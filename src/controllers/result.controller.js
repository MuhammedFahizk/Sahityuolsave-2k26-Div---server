import { Result } from '../models/index.js';

// ── GET ALL RESULTS ──
// GET /api/results
// GET /api/results?group=High School
// GET /api/results?categoryName=Pencil Drawing
// GET /api/results?group=High School&categoryName=Pencil Drawing
// Public
export const getAllResults = async (req, res) => {
    try {
        const filter = {};

        if (req.query.group) filter.group = req.query.group;
        if (req.query.categoryName) filter.categoryName = req.query.categoryName;

        const results = await Result
            .find(filter)
            .populate('entries.teamId', 'name color')
            .sort({ resultNumber: 1 });

        res.status(200).json({
            success: true,
            count: results.length,
            filters: { group: req.query.group || null, categoryName: req.query.categoryName || null },
            data: results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── GET SINGLE RESULT CARD ──
// GET /api/results/:id
// Public
export const getResultById = async (req, res) => {
    try {
        const result = await Result
            .findById(req.params.id)
            .populate({
                path: 'entries.teamId',
                select: 'name color',
            })
            .lean();

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('[getResultById]', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// ── Add these indexes to result.model.js ─────────────────────────────────────
// resultSchema.index({ published: 1, 'entries.teamId': 1 });
// resultSchema.index({ published: 1, resultNumber:     1 });
// ─────────────────────────────────────────────────────────────────────────────

export const getResultByIdForPublic = async (req, res) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 10);

        const { teamId, group, categoryName, sort = 'newest' } = req.query;

        // ── Filter ────────────────────────────────────────────────────────────
        const filter = { published: true };
        if (teamId)       filter['entries.teamId'] = teamId;
        if (group)        filter.group             = { $regex: new RegExp(`^${group}$`, 'i') };
        if (categoryName) filter.categoryName      = { $regex: categoryName, $options: 'i' };

        // ── Sort ──────────────────────────────────────────────────────────────
        // newest → createdAt desc  (default — no param needed)
        // oldest → createdAt asc
        // az     → categoryName A–Z
        // number → resultNumber 1–N
        const SORT_MAP = {
            newest: { createdAt:    -1 },
            oldest: { createdAt:     1 },
            az:     { categoryName:  1 },
            number: { resultNumber:  1 },
        };
        const sortQuery = SORT_MAP[sort] ?? SORT_MAP.newest;

        // ── Query (parallel) ──────────────────────────────────────────────────
        const [results, total] = await Promise.all([
            Result
                .find(filter)
                .select('resultNumber categoryName group entries createdAt resultUrl')
                .slice('entries', 50)
                .sort(sortQuery)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate({ path: 'entries.teamId', select: 'name color' })
                .lean(),
            Result.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count:  results.length,
            total,
            page,
            pages:  Math.ceil(total / limit),
            sort,
            data:   results,
        });
    } catch (error) {
        console.error('[getResultByIdForPublic]', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// ── GET FILTER OPTIONS ──
// GET /api/results/filters
// Returns unique groups and categoryNames for frontend dropdowns
// Public
export const getFilters = async (req, res) => {
    try {
        // distinct() returns all unique values of a field across all documents
        const groups = await Result.distinct('group');
        const categories = await Result.distinct('categoryName');

        res.status(200).json({
            success: true,
            data: {
                groups: groups.filter(Boolean),     // remove empty strings
                categories: categories.filter(Boolean),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── CREATE RESULT CARD ──
// POST /api/results
// Protected — admin only
export const createResult = async (req, res) => {
    try {
        const { resultNumber, categoryName, group, entries, resultUrl } = req.body;

        // Check required fields
        if (!resultNumber || !categoryName || !entries || entries.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'resultNumber, categoryName and at least one entry are required',
            });
        }

        // Check duplicate result number
        const existing = await Result.findOne({ resultNumber });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `Result number ${resultNumber} already exists`,
            });
        }

        const result = await Result.create({ resultNumber, categoryName, group, entries , resultUrl });

        // Populate team details before sending response
        await result.populate('entries.teamId', 'name color');

        res.status(201).json({
            success: true,
            message: 'Result created successfully',
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── UPDATE RESULT CARD ──
// PUT /api/results/:id
// Protected — admin only
// Can update categoryName, group, or the full entries array
export const updateResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        const updated = await Result.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('entries.teamId', 'name color');

        res.status(200).json({
            success: true,
            message: 'Result updated successfully',
            data: updated,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── DELETE RESULT CARD ──
// DELETE /api/results/:id
// Protected — admin only
export const deleteResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        await Result.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Result deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};