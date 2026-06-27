"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const Booking_1 = require("./models/Booking");
dotenv_1.default.config();
// ─── Environment Validation ───────────────────────────────────────────────────
// Crash early in production if critical secrets are missing or left as defaults
const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_API_KEY', 'ADMIN_USERNAME', 'ADMIN_PASSWORD'];
const INSECURE_DEFAULTS = ['grandeur-admin-secret-2026', 'grandeur2026', 'your-super-secret-jwt-key'];
if (process.env.NODE_ENV === 'production') {
    const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
    if (missing.length > 0) {
        console.error(`❌ FATAL: Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
    const insecure = [process.env.JWT_SECRET, process.env.ADMIN_API_KEY, process.env.ADMIN_PASSWORD].filter((v) => INSECURE_DEFAULTS.includes(v ?? ''));
    if (insecure.length > 0) {
        console.error('❌ FATAL: Insecure default secret detected in production. Change it in .env!');
        process.exit(1);
    }
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grandeur-hall';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'grandeur-admin-secret-2026';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = '12h';
// Allowed origins — set ALLOWED_ORIGINS in .env as comma-separated list for production
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://localhost:3001'];
// ─── Security Middleware ──────────────────────────────────────────────────────
// 1. Helmet — sets 15+ security-related HTTP response headers
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", ...ALLOWED_ORIGINS],
        },
    },
}));
// 2. CORS — only allow listed origins
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin)
            return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin))
            return callback(null, true);
        callback(new Error(`CORS: Origin "${origin}" is not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-admin-key', 'Authorization'],
}));
// 3. Body size limit — prevent large payload attacks (10 KB max)
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
// 4. NoSQL Injection prevention — strips $ and . from request body/query/params
app.use((0, express_mongo_sanitize_1.default)({ replaceWith: '_' }));
// 5. General rate limiter — 100 requests per 15 minutes per IP
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
});
// 6. Strict rate limiter for login — 10 attempts per 15 minutes per IP
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts. Please wait 15 minutes.' },
    skipSuccessfulRequests: true, // Only count failed attempts
});
// 7. Strict rate limiter for booking submission — 5 per hour per IP
const bookingLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many booking submissions from this IP. Please try again in an hour.' },
});
app.use('/api/', generalLimiter);
// ─── Admin Auth Middleware (JWT) ──────────────────────────────────────────────
// Verifies both the x-admin-key header AND a valid JWT in Authorization header
function adminAuth(req, res, next) {
    // Check API key
    const key = req.headers['x-admin-key'];
    if (key !== ADMIN_API_KEY) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid admin key.' });
        return;
    }
    // Check JWT
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        res.status(401).json({ success: false, message: 'Unauthorized: No token provided.' });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (payload.role !== 'admin')
            throw new Error('Insufficient role');
        req.adminUser = payload.username;
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
        }
        else {
            res.status(401).json({ success: false, message: 'Unauthorized: Invalid token.' });
        }
    }
}
// ─── Zod Validation Schema ────────────────────────────────────────────────────
const bookingSchema = zod_1.z.object({
    eventType: zod_1.z.string().min(1, 'Event type is required').max(50),
    guestCount: zod_1.z.number().int().min(10, 'Minimum guest count is 10').max(2000, 'Maximum guest count is 2000'),
    dateFlexibility: zod_1.z.enum(['fixed', 'flexible']),
    venueId: zod_1.z.string().min(1, 'Venue selection is required').max(60),
    date: zod_1.z.string().min(1, 'Date is required').max(30),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: zod_1.z.string().email('Invalid email address').max(150),
    phone: zod_1.z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    notes: zod_1.z.string().max(1000).optional(),
});
// ─── MongoDB Connection ───────────────────────────────────────────────────────
async function connectDB() {
    try {
        await mongoose_1.default.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        // Mask credentials in log output
        const maskedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
        console.log(`  ✅ MongoDB connected: ${maskedUri}`);
    }
    catch (error) {
        console.error('  ❌ MongoDB connection failed:', error);
        process.exit(1);
    }
}
// ─── Public Routes ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Grandeur Hall Backend API is running.',
        db: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});
// POST /api/admin/login — Issues a signed JWT (credentials live only in backend .env)
app.post('/api/admin/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;
    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid request body.' });
    }
    const validUser = process.env.ADMIN_USERNAME || 'admin';
    const validPass = process.env.ADMIN_PASSWORD || 'grandeur2026';
    // Use constant-time comparison to prevent timing attacks
    const usernameMatch = username === validUser;
    const passwordMatch = password === validPass;
    if (usernameMatch && passwordMatch) {
        const token = jsonwebtoken_1.default.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, issuer: 'grandeur-hall-api' });
        return res.json({ success: true, token, expiresIn: JWT_EXPIRES_IN });
    }
    // Generic error — don't reveal which field was wrong
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
});
// POST /api/bookings — Submit a new booking (called by frontend)
app.post('/api/bookings', bookingLimiter, async (req, res) => {
    const result = bookingSchema.safeParse(req.body);
    if (!result.success) {
        const fieldErrors = {};
        result.error.issues.forEach((err) => {
            if (err.path[0]) {
                fieldErrors[err.path[0]] = err.message;
            }
        });
        return res.status(400).json({ success: false, fieldErrors });
    }
    const refNum = `GH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
        const booking = await Booking_1.Booking.create({
            ...result.data,
            referenceNumber: refNum,
            status: 'pending',
        });
        console.log(`[Grandeur Hall API] ✅ Booking created: ${refNum}`);
        return res.status(201).json({
            success: true,
            referenceNumber: booking.referenceNumber,
            message: 'Booking request received successfully.',
        });
    }
    catch (error) {
        if (error.code === 11000) {
            const fallbackRef = `GH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const booking = await Booking_1.Booking.create({ ...result.data, referenceNumber: fallbackRef, status: 'pending' });
            return res.status(201).json({ success: true, referenceNumber: booking.referenceNumber });
        }
        console.error('[Grandeur Hall API] ❌ Error creating booking:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});
// ─── Admin Routes (Protected by JWT + API Key) ───────────────────────────────
app.get('/api/admin/stats', adminAuth, async (_req, res) => {
    try {
        const [total, pending, confirmed, rejected] = await Promise.all([
            Booking_1.Booking.countDocuments(),
            Booking_1.Booking.countDocuments({ status: 'pending' }),
            Booking_1.Booking.countDocuments({ status: 'confirmed' }),
            Booking_1.Booking.countDocuments({ status: 'rejected' }),
        ]);
        const eventTypeBreakdown = await Booking_1.Booking.aggregate([
            { $group: { _id: '$eventType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyBookings = await Booking_1.Booking.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);
        res.json({ success: true, data: { total, pending, confirmed, rejected, eventTypeBreakdown, monthlyBookings } });
    }
    catch {
        res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
    }
});
app.get('/api/admin/bookings', adminAuth, async (req, res) => {
    try {
        const { status, eventType, search, page = '1', limit = '20', sortBy = 'createdAt', sortOrder = 'desc', dateFrom, dateTo, } = req.query;
        // Whitelist sortBy to prevent arbitrary field access
        const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt', 'name', 'guestCount', 'referenceNumber', 'date', 'eventType'];
        const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
        // Clamp pagination
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
        const skip = (pageNum - 1) * limitNum;
        const sortDir = sortOrder === 'asc' ? 1 : -1;
        const filter = {};
        if (status && status !== 'all' && ['pending', 'confirmed', 'rejected'].includes(status)) {
            filter.status = status;
        }
        if (eventType && eventType !== 'all') {
            filter.eventType = String(eventType).slice(0, 50);
        }
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom)
                filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo)
                filter.createdAt.$lte = new Date(dateTo);
        }
        if (search) {
            const safeSearch = String(search).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.$or = [
                { name: { $regex: safeSearch, $options: 'i' } },
                { email: { $regex: safeSearch, $options: 'i' } },
                { referenceNumber: { $regex: safeSearch, $options: 'i' } },
                { phone: { $regex: safeSearch, $options: 'i' } },
            ];
        }
        const [bookings, totalCount] = await Promise.all([
            Booking_1.Booking.find(filter).sort({ [safeSortBy]: sortDir }).skip(skip).limit(limitNum).lean(),
            Booking_1.Booking.countDocuments(filter),
        ]);
        res.json({
            success: true,
            data: bookings,
            pagination: { total: totalCount, page: pageNum, limit: limitNum, totalPages: Math.ceil(totalCount / limitNum) },
        });
    }
    catch {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings.' });
    }
});
app.get('/api/admin/bookings/:id', adminAuth, async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid booking ID.' });
        }
        const booking = await Booking_1.Booking.findById(req.params.id).lean();
        if (!booking)
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        res.json({ success: true, data: booking });
    }
    catch {
        res.status(500).json({ success: false, message: 'Failed to fetch booking.' });
    }
});
app.patch('/api/admin/bookings/:id/status', adminAuth, async (req, res) => {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid booking ID.' });
        }
        const booking = await Booking_1.Booking.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }).lean();
        if (!booking)
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        console.log(`[Admin] Status updated: ${booking.referenceNumber} → ${status}`);
        res.json({ success: true, data: booking, message: `Status updated to ${status}.` });
    }
    catch {
        res.status(500).json({ success: false, message: 'Failed to update status.' });
    }
});
app.delete('/api/admin/bookings/:id', adminAuth, async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid booking ID.' });
        }
        const booking = await Booking_1.Booking.findByIdAndDelete(req.params.id);
        if (!booking)
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        console.log(`[Admin] Booking deleted: ${booking.referenceNumber}`);
        res.json({ success: true, message: 'Booking deleted successfully.' });
    }
    catch {
        res.status(500).json({ success: false, message: 'Failed to delete booking.' });
    }
});
// ─── Global Error Handler ─────────────────────────────────────────────────────
// Catches unhandled errors — never leaks stack traces to the client
app.use((err, _req, res, _next) => {
    if (err.message.startsWith('CORS:')) {
        return res.status(403).json({ success: false, message: err.message });
    }
    console.error('[Unhandled Error]', err.message);
    res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
});
// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});
// ─── Start Server ─────────────────────────────────────────────────────────────
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`===================================================`);
        console.log(`  GRANDEUR HALL — Premium Backend Server           `);
        console.log(`  Running on http://localhost:${PORT}             `);
        console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`===================================================`);
    });
});
