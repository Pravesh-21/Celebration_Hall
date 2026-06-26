"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// In-memory bookings database for demonstration
const bookings = [];
// Zod Validation Schema matching the frontend spec
const bookingSchema = zod_1.z.object({
    eventType: zod_1.z.string().min(1, 'Event type is required'),
    guestCount: zod_1.z.number().min(10, 'Minimum guest count is 10').max(2000, 'Maximum guest count is 2000'),
    dateFlexibility: zod_1.z.enum(['fixed', 'flexible']),
    venueId: zod_1.z.string().min(1, 'Venue selection is required'),
    date: zod_1.z.string().min(1, 'Date is required'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    phone: zod_1.z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    notes: zod_1.z.string().optional(),
});
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Grandeur Hall Backend API is running.' });
});
// Bookings endpoints
app.get('/api/bookings', (req, res) => {
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
});
app.post('/api/bookings', (req, res) => {
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
    // Generate a premium confirmation reference number (e.g. GH-2026-XXXX)
    const refNum = `GH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
        id: refNum,
        ...result.data,
        createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    console.log(`[Grandeur Hall API] Booking created: ${refNum}`, newBooking);
    return res.status(201).json({
        success: true,
        referenceNumber: refNum,
        message: 'Booking request received successfully.',
    });
});
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`  GRANDEUR HALL — Premium Backend Server           `);
    console.log(`  Running on http://localhost:${PORT}             `);
    console.log(`===================================================`);
});
