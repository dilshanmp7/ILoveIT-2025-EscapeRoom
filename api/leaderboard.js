// API endpoint for real-time leaderboard
// Provides live tournament tracking for public viewing

import { getLeaderboard } from '../../lib/database.js'

export default async function handler(req, res) {
  // ✅ PUBLIC HOSTING READY - Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      const { limit = '50' } = req.query
      const limitNum = Math.min(parseInt(limit) || 50, 100) // Max 100 for performance

      // ✅ REAL-TIME LEADERBOARD - Live tournament tracking
      const leaderboardData = await getLeaderboard(limitNum)

      res.json({
        success: true,
        ...leaderboardData,
        requestedAt: new Date().toISOString(),
        nextUpdate: 'Real-time - refresh anytime'
      })

    } catch (error) {
      console.error('Leaderboard fetch error:', error)
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch leaderboard data',
        leaderboard: [],
        totalPlayers: 0
      })
    }
  } else {
    res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET to fetch leaderboard.' 
    })
  }
}
