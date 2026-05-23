import { useCallback, useEffect, useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Dashboard from './pages/DashBoard'
import FundDetail from './pages/FundDetails'

import AppSidebar from './components/AppSidebar'

import { watchlistAPI } from './services/api'
import WatchlistPage from './components/WatchList'

function App() {
  const [watchlist, setWatchlist] = useState([])

  const [watchlistError, setWatchlistError] = useState(null)

  const [loading, setLoading] = useState({
    watchlist: true,
  })

  const loadWatchlist = useCallback(async () => {
    try {
      setLoading((prev) => ({
        ...prev,
        watchlist: true,
      }))

      setWatchlistError(null)

      const response = await watchlistAPI.getAll()

      setWatchlist(response.data.data || [])
    } catch (error) {
      console.error('Failed to load watchlist:', error)

      setWatchlistError(error?.message || 'Failed to load your watchlist. Please try again.')
    } finally {
      setLoading((prev) => ({
        ...prev,
        watchlist: false,
      }))
    }
  }, [])

  // LOAD WATCHLIST
  useEffect(() => {
    loadWatchlist()
  }, [loadWatchlist])

  // REMOVE FROM WATCHLIST
  const handleRemoveFromWatchlist = async (schemeCode) => {
    try {
      await watchlistAPI.remove(schemeCode)

      setWatchlist((prev) => prev.filter((item) => item.schemeCode !== schemeCode))
    } catch (error) {
      console.error('Failed to remove from watchlist:', error)
    }
  }

  return (
    <Router>
      <AppSidebar>
        <Routes>
          {/* DASHBOARD */}
          <Route path="/" element={<Dashboard />} />

          {/* FUND DETAILS */}
          <Route path="/fund/:schemeCode" element={<FundDetail />} />

          {/* WATCHLIST */}
          <Route
            path="/watchlist"
            element={
              <WatchlistPage
                items={watchlist}
                error={watchlistError}
                onRetry={loadWatchlist}
                onRemove={handleRemoveFromWatchlist}
                loading={loading.watchlist}
              />
            }
          />
        </Routes>
      </AppSidebar>
    </Router>
  )
}

export default App
