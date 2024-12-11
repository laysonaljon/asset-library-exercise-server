import express from 'express';
import * as dotenv from 'dotenv';
import { KPI, Layout, Visualization, Storyboard, SearchQuery } from '../mongodb/models/assets.js'; 

dotenv.config();

const router = express.Router();

// GET /api/v1/assets - Fetch all assets
router.get('/', async (req, res) => {
    try {
        const kpis = await KPI.find({}).select('_id title description lastUpdated category access');
        const layouts = await Layout.find({}).select('_id title description lastUpdated category access');
        const visualizations = await Visualization.find({}).select('_id title description lastUpdated category access');
        const storyboards = await Storyboard.find({}).select('_id title description lastUpdated category access');

        const assets = [...kpis, ...layouts, ...visualizations, ...storyboards];
        res.status(200).json(assets);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetching assets failed, please try again' });
    }
});

// POST /api/v1/assets/search - Search for assets based on query
router.post('/search', async (req, res) => {
    const { query, user } = req.body;

    if (!query || !user) {
        return res.status(400).json({ success: false, message: 'Query and user parameters are required' });
    }

    try {
        const regex = new RegExp(query, 'i');

        const kpis = await KPI.find({
            $or: [
                { title: regex },
                { description: regex }
            ]
        }).select('_id title description lastUpdated category access');

        const layouts = await Layout.find({
            $or: [
                { title: regex },
                { description: regex }
            ]
        }).select('_id title description lastUpdated category access');

        const visualizations = await Visualization.find({
            $or: [
                { title: regex },
                { description: regex }
            ]
        }).select('_id title description lastUpdated category access');

        const storyboards = await Storyboard.find({
            $or: [
                { title: regex },
                { description: regex }
            ]
        }).select('_id title description lastUpdated category access');

        const assets = [...kpis, ...layouts, ...visualizations, ...storyboards];

        await SearchQuery.create({ query, user });

        const recentSearchQueries = await SearchQuery.find()
            .sort({ date: -1 })
            .limit(5)
            .select('query');

        const search = recentSearchQueries.map(searchQuery => searchQuery.query);

        const responseData = {
            item: assets,
            search: search
        };

        res.status(200).json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Searching assets failed, please try again' });
    }
});

// GET /api/v1/search - Retrieve the last 5 search queries
router.get('/search', async (req, res) => {
    try {
        const recentSearchQueries = await SearchQuery.find()
            .sort({ date: -1 }) 
            .limit(5)
            .select('query'); 

        const queries = recentSearchQueries.map(searchQuery => searchQuery.query);

        res.status(200).json(queries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Fetching recent search queries failed, please try again' });
    }
});

// GET /api/v1/assets/featured - Fetch featured and trending assets
router.get('/featured', async (req, res) => {
    try {
        const kpis = await KPI.find({});
        const layouts = await Layout.find({});
        const visualizations = await Visualization.find({});
        const storyboards = await Storyboard.find({});

        const assets = [...kpis, ...layouts, ...visualizations, ...storyboards];

        const featuredItems = [...assets]
            .sort((a, b) => (b.favoritedCount || 0) - (a.favoritedCount || 0))
            .slice(0, 4);

        const trendingItems = [...assets]
            .sort((a, b) => (b.sharedCount || 0) - (a.sharedCount || 0))
            .slice(0, 4);

        const combinedItems = [...new Map([...featuredItems, ...trendingItems].map(item => [item._id.toString(), item])).values()];

        const response = combinedItems.slice(0, 8).map(item => ({
            _id: item._id,
            title: item.title,
            description: item.description,
            lastUpdated: item.lastUpdated,
            category: item.category,
            access: item.access
        }));

        res.status(200).json(response);
    } catch (err) {
        console.error('Error fetching featured assets:', err);
        res.status(500).json({ success: false, message: 'Fetching featured assets failed, please try again' });
    }
});

// GET /api/v1/assets/layouts - Fetch just the layouts
router.get('/layouts', async (req, res) => {
    try {
        const layouts = await Layout.find({}).select('_id title description lastUpdated category access');
        res.status(200).json(layouts);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetching layouts failed, please try again' });
    }
});

// GET /api/v1/assets/storyboards - Fetch just the storyboards
router.get('/storyboards', async (req, res) => {
    try {
        const storyboards = await Storyboard.find({}).select('_id title description lastUpdated category access');
        res.status(200).json(storyboards);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetching storyboards failed, please try again' });
    }
});

// GET /api/v1/assets/visualizations - Fetch just the visualizations
router.get('/visualizations', async (req, res) => {
    try {
        const visualizations = await Visualization.find({}).select('_id title description lastUpdated category access');
        res.status(200).json(visualizations);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetching visualizations failed, please try again' });
    }
});

// GET /api/v1/assets/KPI - Fetch just the KPIs
router.get('/KPI', async (req, res) => {
    try {
        const kpis = await KPI.find({}).select('_id title description lastUpdated category access');
        res.status(200).json(kpis);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetching KPIs failed, please try again' });
    }
});

// Consolidated GET /api/v1/assets/:id - Fetch a specific asset by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const kpi = await KPI.findById(id);
        if (kpi) return res.status(200).json(kpi);

        const layout = await Layout.findById(id);
        if (layout) return res.status(200).json(layout);

        const visualization = await Visualization.findById(id);
        if (visualization) return res.status(200).json(visualization);

        const storyboard = await Storyboard.findById(id);
        if (storyboard) return res.status(200).json(storyboard);

        return res.status(404).json({ success: false, message: 'Asset not found' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetching asset failed, please try again' });
    }
});

// POST /api/v1/assets/KPI - Create a new KPI
router.post('/kpi', async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            lastUpdated,
            usedCount= 0,
            favoritedCount= 0,
            favorited= false,
            sharedCount= 0,
            businessQuestion,
            metricID,
            calculation,
            affiliateApplicability,
            access
        } = req.body;

        const newKPI = new KPI({
            title,
            category,
            description,
            lastUpdated,
            usedCount,
            favoritedCount,
            favorited,
            sharedCount,
            businessQuestion,
            metricID,
            calculation,
            affiliateApplicability,
            access
        });

        const savedKPI = await newKPI.save();

        res.status(201).json(savedKPI);
    } catch (error) {
        console.error('Error creating KPI:', error);
        res.status(500).json({ message: 'Failed to create KPI', error });
    }
});

// POST /api/v1/assets/layouts - Create a new Layout
router.post('/layouts', async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            type,
            about,
            tags = [],
            page = [],
            businessQuestion,
            usedCount= 0,
            favoritedCount= 0,
            favorited= false,
            sharedCount= 0,
            kpiUsed = [],
            access
        } = req.body;

        if (!title || !category || !description || !about || !businessQuestion) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const newLayout = new Layout({
            title,
            category,
            description,
            type,
            about,
            lastUpdated: Date.now(),
            tags,
            usedCount,
            favoritedCount,
            favorited,
            sharedCount,
            businessQuestion,
            page,
            kpiUsed,
            access
        });

        const savedLayout = await newLayout.save();

        res.status(201).json(savedLayout);
    } catch (error) {
        console.error('Error creating layout:', error);
        res.status(500).json({ success: false, message: 'Failed to create layout', error: error.message });
    }
});

// POST /api/v1/assets/visualizations - Create a new Visualization
router.post('/visualizations', async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            tags = [],
            infoContext,
            usedCount= 0,
            favoritedCount= 0,
            favorited= false,
            sharedCount= 0,
            applicableKpiIDs,
            access
        } = req.body;

        if (!title || !category || !description) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const newVisualization = new Visualization({
            title,
            category,
            description,
            lastUpdated: Date.now(),
            tags,
            usedCount,
            favoritedCount,
            favorited,
            sharedCount,
            infoContext,
            applicableKpiIDs,
            access
        });

        const savedVisualization = await newVisualization.save();

        res.status(201).json(savedVisualization);
    } catch (error) {
        console.error('Error creating visualization:', error);
        res.status(500).json({ success: false, message: 'Failed to create visualization', error: error.message });
    }
});

// POST /api/v1/assets/storyboards - Create a new Storyboard
router.post('/storyboards', async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            tags = [],
            usedCount= 0,
            favoritedCount= 0,
            favorited= false,
            sharedCount= 0,
            kpifilters = [],
            affiliates,
            access
        } = req.body;

        if (!title || !category || !description || !affiliates) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const newStoryboard = new Storyboard({
            title,
            category,
            description,
            lastUpdated: Date.now(),
            tags,
            usedCount,
            favoritedCount,
            favorited,
            sharedCount,
            kpifilters,
            affiliates,
            access
        });

        const savedStoryboard = await newStoryboard.save();

        res.status(201).json(savedStoryboard);
    } catch (error) {
        console.error('Error creating storyboard:', error);
        res.status(500).json({ success: false, message: 'Failed to create storyboard', error: error.message });
    }
});

// POST /api/v1/assets/:id/shared - Increment shared count for a specific asset
router.post('/:id/shared', async (req, res) => {
    const { id } = req.params;

    try {
        let asset = await KPI.findById(id);
        if (asset) {
            asset.sharedCount += 1;
            await asset.save();
            return res.status(200).json(asset);
        }

        asset = await Layout.findById(id);
        if (asset) {
            asset.sharedCount += 1;
            await asset.save();
            return res.status(200).json(asset);
        }

        asset = await Visualization.findById(id);
        if (asset) {
            asset.sharedCount += 1;
            await asset.save();
            return res.status(200).json(asset);
        }

        asset = await Storyboard.findById(id);
        if (asset) {
            asset.sharedCount += 1;
            await asset.save();
            return res.status(200).json(asset);
        }

        return res.status(404).json({ success: false, message: 'Asset not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Incrementing shared count failed, please try again' });
    }
});


// POST /api/v1/assets/:id/favorited - Update favorited status for a specific asset
router.post('/:id/favorited', async (req, res) => {
    const { id } = req.params;
    const { favorited } = req.body;

    if (typeof favorited !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Favorited status must be a boolean' });
    }

    try {
        let asset = await KPI.findById(id);
        if (asset) {
            if (favorited) {
                asset.favoritedCount += 1;
            } else {
                asset.favoritedCount -= 1;
            }
            asset.favorited = favorited;
            await asset.save();
            return res.status(200).json(asset);
        }

        asset = await Layout.findById(id);
        if (asset) {
            if (favorited) {
                asset.favoritedCount += 1;
            } else {
                asset.favoritedCount -= 1;
            }
            asset.favorited = favorited;
            await asset.save();
            return res.status(200).json(asset);
        }

        asset = await Visualization.findById(id);
        if (asset) {
            if (favorited) {
                asset.favoritedCount += 1;
            } else {
                asset.favoritedCount -= 1;
            }
            asset.favorited = favorited;
            await asset.save();
            return res.status(200).json(asset);
        }

        asset = await Storyboard.findById(id);
        if (asset) {
            if (favorited) {
                asset.favoritedCount += 1;
            } else {
                asset.favoritedCount -= 1;
            }
            asset.favorited = favorited;
            await asset.save();
            return res.status(200).json(asset);
        }

        return res.status(404).json({ success: false, message: 'Asset not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Updating favorited status failed, please try again' });
    }
});

// POST /api/v1/assets/:id/access/:type/:access - Update access for a specific asset
router.post('/:id/access/:type/:access', async (req, res) => {
    const { id, type, access } = req.params;

    const validAccessValues = ['granted', 'requested', 'restricted'];
    if (!validAccessValues.includes(access)) {
        return res.status(400).json({ success: false, message: 'Access value must be granted, requested or restricted' });
    }

    try {
        let asset;

        switch (type) {
            case 'KPI':
                asset = await KPI.findById(id).select('_id title description lastUpdated category access');
                break;
            case 'Layout':
                asset = await Layout.findById(id).select('_id title description lastUpdated category access');
                break;
            case 'Visualization':
                asset = await Visualization.findById(id).select('_id title description lastUpdated category access');
                break;
            case 'Storyboard':
                asset = await Storyboard.findById(id).select('_id title description lastUpdated category access');
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid asset type' });
        }

        if (!asset) {
            return res.status(404).json({ success: false, message: 'Asset not found' });
        }

        asset.access = access;
        await asset.save();

        res.status(200).json(asset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Updating access failed, please try again' });
    }
});

export default router;
