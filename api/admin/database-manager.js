// Database Management Tool for DHL Tournament
// Access this at: /admin-db.html

import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  // ✅ ADMIN AUTHENTICATION - Simple protection
  const adminKey = req.headers['x-admin-key']
  if (adminKey !== 'dhl-tournament-admin-2025') {
    return res.status(401).json({ error: 'Unauthorized access' })
  }

  // ✅ CORS for admin tool
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      const { action, key, limit } = req.query

      switch (action) {
        case 'stats':
          // Get tournament statistics
          const stats = await kv.get('tournament:stats') || {}
          const leaderboardSize = await kv.zcard('leaderboard')
          return res.json({
            success: true,
            stats: {
              ...stats,
              totalPlayersInLeaderboard: leaderboardSize,
            },
          })

        case 'leaderboard':
          // Get full leaderboard
          const playerKeys = await kv.zrevrange('leaderboard', 0, parseInt(limit) || -1)
          const players = await Promise.all(playerKeys.map((key) => kv.get(key)))
          return res.json({
            success: true,
            leaderboard: players.filter(Boolean).map((player, index) => ({
              ...player,
              rank: index + 1,
            })),
          })

        case 'player':
          // Get specific player data
          if (!key) return res.status(400).json({ error: 'Player key required' })
          const playerData = await kv.get(`player:${key}`)
          return res.json({
            success: true,
            player: playerData,
          })

        case 'all-keys':
          // Get all database keys (for debugging)
          const allKeys = await kv.keys('*')
          return res.json({
            success: true,
            keys: allKeys,
            count: allKeys.length,
          })

        default:
          return res.status(400).json({ error: 'Invalid action' })
      }
    }

    if (req.method === 'DELETE') {
      const { action, key } = req.query

      switch (action) {
        case 'player':
          // Remove player from tournament
          if (!key) return res.status(400).json({ error: 'Player key required' })
          await kv.del(`player:${key}`)
          await kv.zrem('leaderboard', `player:${key}`)
          return res.json({
            success: true,
            message: `Player ${key} removed from tournament`,
          })

        case 'reset-tournament':
          // ⚠️ DANGER: Reset entire tournament
          const keys = await kv.keys('*')
          if (keys.length > 0) {
            await Promise.all(keys.map((k) => kv.del(k)))
          }
          return res.json({
            success: true,
            message: `Tournament reset. ${keys.length} keys deleted.`,
          })

        default:
          return res.status(400).json({ error: 'Invalid delete action' })
      }
    }

    if (req.method === 'POST') {
      const { action, data } = req.body

      if (action === 'update-stats') {
        // Update tournament statistics
        await kv.set('tournament:stats', data)
        return res.json({
          success: true,
          message: 'Tournament stats updated',
        })
      }

      return res.status(400).json({ error: 'Invalid post action' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Database management error:', error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
