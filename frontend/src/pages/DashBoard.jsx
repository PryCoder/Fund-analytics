// src/pages/Dashboard.jsx

import React, { useState, useEffect, useCallback } from 'react'
import { Box, Container, Text, HStack, useToast } from '@chakra-ui/react'
import { Search, TrendingUp, BarChart3, Star, CheckCircle } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import ErrorAlert from '../components/ErrorAlert'
import { fundsAPI, watchlistAPI } from '../services/api'
import { Card, CardContent } from '@/components/ui/card'

const Dashboard = () => {
  const [searchResults, setSearchResults] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState({ search: false, watchlist: true })
  const [error, setError] = useState(null)
  const [lastQuery, setLastQuery] = useState('')
  const toast = useToast()

  const loadWatchlist = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, watchlist: true }))
      const response = await watchlistAPI.getAll()
      setWatchlist(response.data.data || [])
      setError(null)
    } catch (err) {
      console.error('Failed to load watchlist:', err)
      setError(err.message || 'Failed to load watchlist')
      toast({
        title: 'Error loading watchlist',
        description: err.message || 'Failed to load your watchlist',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      })
    } finally {
      setLoading((prev) => ({ ...prev, watchlist: false }))
    }
  }, [toast])

  useEffect(() => {
    loadWatchlist()
  }, [loadWatchlist])

  const handleSearch = useCallback(
    async (query) => {
      setLastQuery(query || '')
      if (!query || query.trim().length < 2) {
        setSearchResults([])
        return
      }
      try {
        setLoading((prev) => ({ ...prev, search: true }))
        const response = await fundsAPI.search(query)
        const results = response.data.data || []
        setSearchResults(results)
        setError(null)

        if (results.length === 0) {
          toast({
            title: 'No results found',
            description: `No mutual funds matching "${query}"`,
            status: 'info',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        }
      } catch (err) {
        console.error('Search failed:', err)
        setError(err.message || 'Failed to search funds')
        setSearchResults([])
        toast({
          title: 'Search failed',
          description: err.message || 'Unable to search funds at this time',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top-right',
        })
      } finally {
        setLoading((prev) => ({ ...prev, search: false }))
      }
    },
    [toast],
  )

  const handleAddToWatchlist = async (scheme) => {
    try {
      await watchlistAPI.add(scheme.schemeCode, scheme.schemeName)
      await loadWatchlist()
      toast({
        title: 'Added to watchlist',
        description: `${scheme.schemeName.substring(0, 50)}${scheme.schemeName.length > 50 ? '...' : ''}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        icon: <CheckCircle className="h-4 w-4" />,
      })
    } catch (err) {
      console.error('Failed to add to watchlist:', err)
      setError(err.message || 'Failed to add to watchlist')
      toast({
        title: 'Failed to add',
        description: err.message || 'Unable to add fund to watchlist',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      })
    }
  }

  return (
    <Box minH="100vh" bg="#0a0c10">
      <Container maxW="7xl" py={10}>
        {/* Header - Clean, minimal */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-purple-500 rounded-full" />
            <Text
              fontSize="xs"
              fontWeight="500"
              letterSpacing="wider"
              color="purple.400"
              textTransform="uppercase"
            >
              Mutual Fund Analytics
            </Text>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
            Fund Discovery
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Search, track, and analyze Indian mutual funds. Add funds to your watchlist for quick
            access to NAV performance.
          </p>
        </div>

        {/* Stats - Minimal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10">
              <Search className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">1,000+</div>
              <div className="text-xs text-gray-500">Mutual Funds</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10">
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Live NAV</div>
              <div className="text-xs text-gray-500">Real-time updates</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10">
              <BarChart3 className="h-4 w-4 text-orange-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">10+ Years</div>
              <div className="text-xs text-gray-500">Historical data</div>
            </div>
          </div>
        </div>

        {/* Error Alert - For persistent errors */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Search Card */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="mb-5">
              <h2 className="text-lg font-medium text-white mb-1">Search Funds</h2>
              <p className="text-sm text-gray-500">Search by fund name or scheme code</p>
            </div>

            <SearchBar onSearch={handleSearch} loading={loading.search} />

            {loading.search && (
              <div className="mt-6 flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-6">
                <SearchResults
                  results={searchResults}
                  onAddToWatchlist={handleAddToWatchlist}
                  watchlist={watchlist}
                />
              </div>
            )}

            {!loading.search && searchResults.length === 0 && (
              <div className="mt-8 text-center py-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/5 mb-3">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                {lastQuery.trim().length >= 2 ? (
                  <>
                    <p className="text-sm text-gray-300">No results found</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Try a different keyword or fund house
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">Search for a fund to get started</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Try "HDFC", "SBI", "ICICI", or "Axis"
                    </p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <HStack spacing={4} justify="space-between" flexWrap="wrap" gap={3}>
            <HStack spacing={2}>
              <Star className="h-3 w-3 text-gray-600" />
              <Text fontSize="xs" color="gray.600">
                Data from MFAPI • NAV values updated daily
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.600">
              © 2024 Aureva
            </Text>
          </HStack>
        </div>
      </Container>
    </Box>
  )
}

export default Dashboard
