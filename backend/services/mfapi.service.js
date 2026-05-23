const axios = require('axios');
const NodeCache = require('node-cache');

class MFAPIService {
  constructor() {
    this.baseURL = 'https://api.mfapi.in';
    this.cache = new NodeCache({ 
      stdTTL: parseInt(process.env.CACHE_TTL) || 3600,
      checkperiod: 600 
    });
  }

  async searchSchemes(query) {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const cacheKey = `search_${query.trim().toLowerCase()}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        console.log(`Cache hit for search: ${query}`);
        return cached;
      }

      const response = await axios.get(`${this.baseURL}/mf/search`, {
        params: { q: query.trim() },
        timeout: 10000
      });

      if (response.data && Array.isArray(response.data)) {
        const results = response.data.slice(0, 20);
        this.cache.set(cacheKey, results);
        console.log(`API called for search: ${query}, found ${results.length} results`);
        return results;
      }
      
      return [];
    } catch (error) {
      console.error('Error searching schemes:', error.message);
      throw new Error('Failed to search mutual funds. Please try again.');
    }
  }

  async getSchemeDetails(schemeCode) {
    try {
      const cacheKey = `scheme_${schemeCode}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        console.log(` Cache hit for scheme: ${schemeCode}`);
        return cached;
      }

      const response = await axios.get(`${this.baseURL}/mf/${schemeCode}`, {
        timeout: 10000
      });

      if (response.data && response.data.data) {
        const processedData = this.processNAVData(response.data.data);
        const result = {
          meta: response.data.meta,
          data: processedData
        };
        
        this.cache.set(cacheKey, result);
        console.log(`📡 API called for scheme: ${schemeCode}, processed ${processedData.length} NAV entries`);
        return result;
      }
      
      throw new Error('No NAV data available for this scheme');
    } catch (error) {
      console.error('Error fetching scheme details:', error.message);
      throw new Error('Failed to fetch fund details. Please try again.');
    }
  }

  processNAVData(data) {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    const parsedData = data
      .map(item => {
        try {
          
          const [day, month, year] = item.date.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          const nav = parseFloat(item.nav);
          
          // Validate date and NAV
          if (isNaN(date.getTime()) || isNaN(nav) || nav <= 0) {
            return null;
          }
          
          return {
            date: item.date,
            nav: nav,
            parsedDate: date
          };
        } catch (err) {
          console.warn(`Failed to parse NAV entry: ${item.date}`);
          return null;
        }
      })
      .filter(item => item !== null)
      .sort((a, b) => a.parsedDate - b.parsedDate); 
    
    return parsedData;
  }

  
  clearCache() {
    this.cache.flushAll();
    console.log('Cache cleared');
  }
}

module.exports = new MFAPIService();