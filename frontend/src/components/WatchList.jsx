// src/pages/WatchlistPage.jsx

import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Trash2, ArrowRight, Bookmark, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ErrorAlert from './ErrorAlert'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
}

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}

const WatchlistPage = ({ items, onRemove, loading, error, onRetry }) => {
  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-white/5" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0c10]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <ErrorAlert title="Unable to load watchlist" message={error} onRetry={onRetry} />
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/15 bg-transparent text-gray-200 hover:bg-white/5"
            >
              <Link to="/">
                <ArrowRight className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // EMPTY STATE
  if (!items || items.length === 0) {
    return (
      <div className="relative min-h-screen bg-[#0a0c10]">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-3xl" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-12 backdrop-blur-sm"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-purple-500/15">
              <Bookmark className="h-7 w-7 text-purple-400" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-white">Watchlist Empty</h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Add mutual funds to your watchlist to track NAV performance and market insights.
            </p>

            <Button
              asChild
              className="mt-6 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30"
            >
              <Link to="/">
                Explore Funds
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#0a0c10]">
      {/* Subtle background gradients - minimal */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        {/* Header Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-0.5 text-[11px] font-medium uppercase tracking-wider text-purple-300">
              Watchlist
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Tracked Funds
            </h1>
            <p className="mt-2 max-w-xl text-sm text-gray-500">
              Monitor and analyze your selected mutual funds in one place.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15">
              <Eye className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Total Funds</p>
              <p className="text-2xl font-semibold text-white">{items.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Grid Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.schemeCode}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]">
                  <CardContent className="p-5">
                    {/* Header with icon and remove button */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/15">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                      </div>

                      <button
                        onClick={() => onRemove(item.schemeCode)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-500 transition-all hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <Link to={`/fund/${item.schemeCode}`} className="block">
                      {/* Fund Name */}
                      <h3 className="line-clamp-2 text-base font-medium leading-snug tracking-tight text-white transition-colors group-hover:text-purple-300">
                        {item.schemeName}
                      </h3>

                      {/* Details */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                          <span className="text-xs text-gray-500">Scheme Code</span>
                          <span className="font-mono text-xs text-white">{item.schemeCode}</span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                          <span className="text-xs text-gray-500">Added</span>
                          <span className="text-xs text-gray-300">
                            {new Date(item.addedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* View link */}
                      <div className="mt-4 flex items-center text-xs font-medium text-purple-400/80 transition-colors group-hover:text-purple-400">
                        View Analytics
                        <ArrowRight className="ml-1.5 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer Stats - only show if there are items */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-8 pt-6 border-t border-white/10"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-600">
                {items.length} {items.length === 1 ? 'fund' : 'funds'} in watchlist
              </p>
              <Button
                asChild
                variant="outline"
                className="h-8 rounded-full border-white/10 bg-transparent text-xs text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <Link to="/">
                  Browse More Funds
                  <ArrowRight className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default WatchlistPage
