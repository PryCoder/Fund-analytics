const express = require('express')
const router = express.Router()
const mfapiService = require('../services/mfapi.service')
const { validateSchemeCode } = require('../middleware/validation')

// GET /api/funds/search?q=query - Search mutual funds
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'Search query must be at least 2 characters long',
      })
    }

    const results = await mfapiService.searchSchemes(q)

    res.status(200).json({
      success: true,
      query: q,
      count: results.length,
      data: results,
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/funds/:schemeCode - Get fund details and historical NAV
router.get('/:schemeCode', validateSchemeCode, async (req, res, next) => {
  try {
    const { schemeCode } = req.params

    const fundDetails = await mfapiService.getSchemeDetails(schemeCode)

    if (!fundDetails.data || fundDetails.data.length === 0) {
      return res.status(404).json({
        error: 'No NAV data available for this scheme',
      })
    }

    res.status(200).json({
      success: true,
      schemeCode,
      data: fundDetails,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
