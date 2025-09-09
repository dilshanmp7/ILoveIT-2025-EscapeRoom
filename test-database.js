// Test script to verify new database connection and add test data

const UPSTASH_REST_URL = 'https://probable-starling-62985.upstash.io'
const UPSTASH_TOKEN = 'AfYJAAIncDE1NmU1M2ZkNzcxY2Y0ZmI0YmMzZmRiNDRkNzI1MjY1NHAxNjI5ODU'

async function upstashCommand(command) {
  try {
    const response = await fetch(UPSTASH_REST_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('✅ Command result:', result)
    return result.result
  } catch (error) {
    console.error('❌ Command failed:', error)
    throw error
  }
}

async function testDatabase() {
  console.log('🔍 Testing new database connection...')
  
  try {
    // Test basic connectivity
    console.log('\n1. Testing basic connectivity...')
    await upstashCommand(['PING'])
    
    // Check if leaderboard exists
    console.log('\n2. Checking leaderboard...')
    const leaderboardSize = await upstashCommand(['ZCARD', 'leaderboard'])
    console.log('Leaderboard size:', leaderboardSize)
    
    // Check tournament stats
    console.log('\n3. Checking tournament stats...')
    const stats = await upstashCommand(['GET', 'tournament:stats'])
    console.log('Tournament stats:', stats)
    
    // Initialize tournament stats if they don't exist
    if (!stats) {
      console.log('\n4. Initializing tournament stats...')
      const initialStats = {
        totalPlayers: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 100,
        lastUpdated: new Date().toISOString()
      }
      await upstashCommand(['SET', 'tournament:stats', JSON.stringify(initialStats)])
      console.log('✅ Tournament stats initialized')
    }
    
    console.log('\n✅ Database connection test completed successfully!')
    
  } catch (error) {
    console.error('\n❌ Database test failed:', error)
  }
}

// Run the test
testDatabase()
