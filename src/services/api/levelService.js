import levelsData from "@/services/mockData/levels.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class LevelService {
  static async getAll() {
    await delay(300)
    return [...levelsData]
  }

  static async getById(id) {
    await delay(200)
    const level = levelsData.find(level => level.Id === parseInt(id))
    if (!level) {
      throw new Error(`Level with id ${id} not found`)
    }
    return { ...level }
  }

  static async getLevelCount() {
    await delay(100)
    return levelsData.length
  }

  static resetLevel(levelData) {
    // Reset collectibles
    levelData.collectibles.forEach(collectible => {
      collectible.collected = false
    })
    
    // Reset enemies to their starting positions
    levelData.enemies.forEach(enemy => {
      enemy.x = enemy.patrolStart + (enemy.patrolEnd - enemy.patrolStart) / 2
    })
    
    return levelData
  }
}

export default LevelService