// Admin API endpoint for winner determination
// Provides easy winner identification and complete tournament analytics

import { getTop3Winners } from '../../lib/database.js'

export default async function handler(req, res) {
  // ✅ ADMIN DASHBOARD - Secure access with password
  const { password } = req.query
  
  // Simple password protection for admin access
  if (password !== 'DHL2025Admin!') {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized access. Admin password required.' 
    })
  }

  // Enable CORS for admin tools
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      // ✅ WINNER DETERMINATION - Automatic ranking system
      const winnersData = await getTop3Winners()

      const response = {
        success: true,
        tournament: {
          name: 'DHL IT Lockdown Championship',
          status: 'Live',
          ...winnersData
        },
        prize_structure: {
          first: '🥇 Gold - Premium Prize',
          second: '🥈 Silver - Excellent Prize', 
          third: '🥉 Bronze - Great Prize'
        },
        admin_info: {
          generated_at: new Date().toISOString(),
          access_level: 'Tournament Administrator',
          data_freshness: 'Real-time'
        }
      }

      res.json(response)

    } catch (error) {
      console.error('Winners fetch error:', error)
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch winner data',
        winners: { first: null, second: null, third: null },
        totalParticipants: 0
      })
    }
  } else {
    res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET to fetch winners.' 
    })
  }
}
