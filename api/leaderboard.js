// API endpoint for real-time leaderboard
// Provides live tournament tracking for public viewing

import { getLeaderboard } from '../lib/database.js'

export default async function handler(req, res) {
  // ✅ PUBLIC HOSTING READY - Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

  console.log('🔍 Leaderboard API called:', { method: req.method, query: req.query })

  if (req.method === 'OPTIONS') {
    console.log('🔍 OPTIONS request - returning CORS headers')
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      const { limit = '50' } = req.query
      const limitNum = Math.min(parseInt(limit) || 50, 100) // Max 100 for performance

      console.log(`🔍 Processing GET request with limit: ${limitNum}`)

      // ✅ REAL-TIME LEADERBOARD - Live tournament tracking
      console.log('🔍 Calling getLeaderboard...')
      const leaderboardData = await getLeaderboard(limitNum)
      console.log('✅ getLeaderboard returned data:', {
        leaderboardCount: leaderboardData.leaderboard?.length,
        totalPlayers: leaderboardData.totalPlayers,
      })

      const response = {
        success: true,
        ...leaderboardData,
        requestedAt: new Date().toISOString(),
        nextUpdate: 'Real-time - refresh anytime',
      }

      console.log('✅ Sending successful response')
      res.json(response)
    } catch (error) {
      console.error('❌ Leaderboard API error:', error)
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })

      res.status(500).json({
        success: false,
        error: 'Failed to fetch leaderboard data',
        leaderboard: [],
        totalPlayers: 0,
        errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined,
      })
    }
  } else {
    console.log(`❌ Method ${req.method} not allowed`)
    res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed. Use GET to fetch leaderboard.`,
    })
  }
}
