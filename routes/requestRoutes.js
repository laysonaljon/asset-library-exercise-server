import express from 'express';
import * as dotenv from 'dotenv';
import { Request } from '../mongodb/models/assets.js';

dotenv.config();

const router = express.Router();

// GET /api/v1/requests - Fetch all requests
router.get('/', async (req, res) => {
    try {
        const requests = await Request.find({});
        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Fetching requests failed, please try again' });
    }
});

// POST /api/v1/requests - Create a new request
router.post('/', async (req, res) => {
    const { title, category, description, purpose, requestedByID } = req.body;

    if (!title || !category || !description || !purpose || !requestedByID) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const newRequest = new Request({
            title,
            category,
            description,
            purpose,
            requestedByID,
        });

        await newRequest.save();
        res.status(201).json({ success: true, request: newRequest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Creating request failed, please try again' });
    }
});

export default router;
