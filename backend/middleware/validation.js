const validateWatchlistItem = (req, res, next) => {
  console.log('Received body:', req.body); // Debug log
  
  // Extract data from different possible formats
  let schemeCode, schemeName;
  
  // Check if data is in request body directly
  if (req.body.schemeCode && req.body.schemeName) {
    schemeCode = req.body.schemeCode;
    schemeName = req.body.schemeName;
  }
  // Check if data is nested under 'data' property
  else if (req.body.data && req.body.data.schemeCode && req.body.data.schemeName) {
    schemeCode = req.body.data.schemeCode;
    schemeName = req.body.data.schemeName;
  }
  // Check if data is stringified JSON
  else if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      schemeCode = parsed.schemeCode || parsed.data?.schemeCode;
      schemeName = parsed.schemeName || parsed.data?.schemeName;
    } catch (e) {
      console.error('Failed to parse body:', e);
    }
  }
  
  // Validate schemeCode
  if (!schemeCode) {
    return res.status(400).json({ 
      error: 'Valid scheme code is required',
      received: req.body,
      hint: 'Please send { schemeCode: "xxx", schemeName: "xxx" }'
    });
  }
  
  if (typeof schemeCode !== 'string' && typeof schemeCode !== 'number') {
    return res.status(400).json({ 
      error: 'Scheme code must be a string or number',
      received: typeof schemeCode
    });
  }
  
  schemeCode = String(schemeCode).trim();
  if (schemeCode === '') {
    return res.status(400).json({ 
      error: 'Scheme code cannot be empty' 
    });
  }
  
  // Validate schemeName
  if (!schemeName) {
    return res.status(400).json({ 
      error: 'Valid scheme name is required' 
    });
  }
  
  schemeName = String(schemeName).trim();
  if (schemeName === '') {
    return res.status(400).json({ 
      error: 'Scheme name cannot be empty' 
    });
  }
  
  // Set normalized values back to request body
  req.body.schemeCode = schemeCode;
  req.body.schemeName = schemeName;
  
  console.log('Validated data:', { schemeCode, schemeName }); // Debug log
  
  next();
};

const validateSchemeCode = (req, res, next) => {
  const { schemeCode } = req.params;
  
  if (!schemeCode) {
    return res.status(400).json({ 
      error: 'Scheme code is required in URL parameter' 
    });
  }
  
  const numericCode = parseInt(schemeCode);
  if (isNaN(numericCode) || numericCode <= 0) {
    return res.status(400).json({ 
      error: 'Valid numeric scheme code is required',
      received: schemeCode
    });
  }
  
  req.params.schemeCode = String(numericCode);
  next();
};

module.exports = {
  validateWatchlistItem,
  validateSchemeCode
};