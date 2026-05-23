const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');
const { validateWatchlistItem } = require('../middleware/validation');

// GET /api/watchlist - Fetch all watchlist items
router.get('/', async (req, res, next) => {
  try {
    const watchlist = await Watchlist.find()
      .sort({ addedAt: -1 })
      .select('schemeCode schemeName addedAt');
    
    res.status(200).json({
      success: true,
      count: watchlist.length,
      data: watchlist
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/watchlist - Add a scheme to watchlist
router.post('/', validateWatchlistItem, async (req, res, next) => {
  try {
    const { schemeCode, schemeName } = req.body;
    
    // Check if scheme already exists
    const existing = await Watchlist.findOne({ schemeCode });
    if (existing) {
      return res.status(409).json({ 
        error: 'Scheme already exists in watchlist',
        schemeCode 
      });
    }
    
    // Create new watchlist item
    const watchlistItem = new Watchlist({
      schemeCode,
      schemeName
    });
    
    await watchlistItem.save();
    
    res.status(201).json({
      success: true,
      message: 'Scheme added to watchlist',
      data: watchlistItem
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/watchlist/:schemeCode - Remove from watchlist
router.delete('/:schemeCode', async (req, res, next) => {
  try {
    const { schemeCode } = req.params;
    
    const deletedItem = await Watchlist.findOneAndDelete({ schemeCode });
    
    if (!deletedItem) {
      return res.status(404).json({ 
        error: 'Scheme not found in watchlist' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Scheme removed from watchlist',
      schemeCode
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;