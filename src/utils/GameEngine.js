import LevelService from "@/services/api/levelService"

class GameEngine {
  constructor(canvas, callbacks) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.callbacks = callbacks
    
    // Game state
    this.currentLevel = null
    this.player = null
    this.gameRunning = false
    this.animationId = null
    
    // Input handling
    this.keys = {}
    this.setupInputHandlers()
    
    // Game constants
    this.GRAVITY = 0.5
    this.JUMP_FORCE = -12
    this.MOVE_SPEED = 3
    this.TILE_SIZE = 16
    
    // Game stats
    this.score = 0
    this.lives = 3
    this.coinsCollected = 0
    
    // Animation frame counter for sprite animations
    this.frameCounter = 0
  }

  setupInputHandlers() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true
      e.preventDefault()
    })
    
    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false
      e.preventDefault()
    })
  }

  async loadLevel(levelId) {
    try {
      this.currentLevel = await LevelService.getById(levelId)
      this.initializePlayer()
      this.resetGameObjects()
      this.start()
    } catch (error) {
      console.error("Failed to load level:", error)
    }
  }

  initializePlayer() {
    this.player = {
      x: this.currentLevel.playerStart.x,
      y: this.currentLevel.playerStart.y,
      width: 24,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      isGrounded: false,
      isJumping: false,
      direction: "right",
      animFrame: 0
    }
  }

  resetGameObjects() {
    // Reset collectibles
    this.currentLevel.collectibles.forEach(collectible => {
      collectible.collected = false
    })
    
    // Reset enemies
    this.currentLevel.enemies.forEach(enemy => {
      enemy.x = enemy.patrolStart + (enemy.patrolEnd - enemy.patrolStart) / 2
    })
  }

  start() {
    this.gameRunning = true
    this.gameLoop()
  }

  pause() {
    this.gameRunning = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  resume() {
    if (!this.gameRunning) {
      this.gameRunning = true
      this.gameLoop()
    }
  }

  cleanup() {
    this.pause()
    window.removeEventListener("keydown", this.handleKeyDown)
    window.removeEventListener("keyup", this.handleKeyUp)
  }

  gameLoop() {
    if (!this.gameRunning) return
    
    this.update()
    this.render()
    
    this.animationId = requestAnimationFrame(() => this.gameLoop())
  }

  update() {
    this.frameCounter++
    this.updatePlayer()
    this.updateEnemies()
    this.checkCollisions()
    this.checkLevelComplete()
  }

  updatePlayer() {
    // Handle input
    if (this.keys["ArrowLeft"]) {
      this.player.velocityX = -this.MOVE_SPEED
      this.player.direction = "left"
    } else if (this.keys["ArrowRight"]) {
      this.player.velocityX = this.MOVE_SPEED
      this.player.direction = "right"
    } else {
      this.player.velocityX = 0
    }
    
    if (this.keys["Space"] && this.player.isGrounded) {
      this.player.velocityY = this.JUMP_FORCE
      this.player.isGrounded = false
      this.player.isJumping = true
    }
    
    // Apply gravity
    this.player.velocityY += this.GRAVITY
    
    // Update position
    this.player.x += this.player.velocityX
    this.player.y += this.player.velocityY
    
    // Check platform collisions
    this.checkPlatformCollisions()
    
    // Keep player in bounds
    if (this.player.x < 0) this.player.x = 0
    if (this.player.x > this.canvas.width - this.player.width) {
      this.player.x = this.canvas.width - this.player.width
    }
    
    // Check if player fell off screen
    if (this.player.y > this.canvas.height) {
      this.loseLife()
    }
    
    // Update animation
    if (this.player.velocityX !== 0 && this.player.isGrounded) {
      this.player.animFrame = Math.floor(this.frameCounter / 10) % 4
    } else {
      this.player.animFrame = 0
    }
  }

  updateEnemies() {
    this.currentLevel.enemies.forEach(enemy => {
      enemy.x += enemy.velocityX
      
      // Reverse direction at patrol boundaries
      if (enemy.x <= enemy.patrolStart || enemy.x >= enemy.patrolEnd) {
        enemy.velocityX = -enemy.velocityX
      }
    })
  }

  checkPlatformCollisions() {
    this.player.isGrounded = false
    
    this.currentLevel.platforms.forEach(platform => {
      if (this.isColliding(this.player, platform)) {
        // Top collision (landing on platform)
        if (this.player.velocityY > 0 && 
            this.player.y < platform.y) {
          this.player.y = platform.y - this.player.height
          this.player.velocityY = 0
          this.player.isGrounded = true
          this.player.isJumping = false
        }
        // Bottom collision (hitting platform from below)
        else if (this.player.velocityY < 0 && 
                 this.player.y > platform.y) {
          this.player.y = platform.y + platform.height
          this.player.velocityY = 0
        }
        // Side collisions
        else if (this.player.velocityX > 0) {
          this.player.x = platform.x - this.player.width
        } else if (this.player.velocityX < 0) {
          this.player.x = platform.x + platform.width
        }
      }
    })
  }

  checkCollisions() {
    // Check enemy collisions
    this.currentLevel.enemies.forEach(enemy => {
      if (this.isColliding(this.player, enemy)) {
        this.loseLife()
      }
    })
    
    // Check collectible collisions
    this.currentLevel.collectibles.forEach(collectible => {
      if (!collectible.collected && this.isColliding(this.player, collectible)) {
        collectible.collected = true
        this.score += collectible.value
        this.coinsCollected++
        this.callbacks.onScoreUpdate(this.score)
        this.callbacks.onCoinsUpdate(this.coinsCollected)
      }
    })
  }

  checkLevelComplete() {
    const goal = this.currentLevel.goal
    if (goal && this.isColliding(this.player, { ...goal, width: 32, height: 64 })) {
      this.pause()
      this.callbacks.onLevelComplete()
    }
  }

  loseLife() {
    this.lives--
    this.callbacks.onLivesUpdate(this.lives)
    
    if (this.lives <= 0) {
      this.pause()
      this.callbacks.onGameOver()
    } else {
      // Respawn player
      this.player.x = this.currentLevel.playerStart.x
      this.player.y = this.currentLevel.playerStart.y
      this.player.velocityX = 0
      this.player.velocityY = 0
    }
  }

  isColliding(rect1, rect2) {
    return rect1.x < rect2.x + (rect2.width || 20) &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + (rect2.height || 20) &&
           rect1.y + rect1.height > rect2.y
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Render background
    this.renderBackground()
    
    // Render platforms
    this.renderPlatforms()
    
    // Render collectibles
    this.renderCollectibles()
    
    // Render enemies
    this.renderEnemies()
    
    // Render goal
    this.renderGoal()
    
    // Render player
    this.renderPlayer()
  }

  renderBackground() {
    // Sky gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
    gradient.addColorStop(0, "#87CEEB")
    gradient.addColorStop(1, "#4A90E2")
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Clouds
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    this.ctx.fillRect(100 + (this.frameCounter / 2) % 1000, 50, 80, 30)
    this.ctx.fillRect(300 + (this.frameCounter / 3) % 1000, 120, 60, 25)
    this.ctx.fillRect(500 + (this.frameCounter / 4) % 1000, 80, 100, 35)
  }

  renderPlatforms() {
    this.currentLevel.platforms.forEach(platform => {
      if (platform.type === "grass") {
        this.ctx.fillStyle = "#7CB342"
      } else if (platform.type === "stone") {
        this.ctx.fillStyle = "#8B7355"
      } else {
        this.ctx.fillStyle = "#666"
      }
      
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
      
      // Add border
      this.ctx.strokeStyle = "#333"
      this.ctx.lineWidth = 2
      this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)
    })
  }

  renderCollectibles() {
    this.currentLevel.collectibles.forEach(collectible => {
      if (!collectible.collected) {
        this.ctx.fillStyle = "#FFD700"
        
        // Animated coin
        const animOffset = Math.sin(this.frameCounter * 0.1) * 2
        this.ctx.fillRect(
          collectible.x,
          collectible.y + animOffset,
          16,
          16
        )
        
        // Coin highlight
        this.ctx.fillStyle = "#FFF8DC"
        this.ctx.fillRect(
          collectible.x + 2,
          collectible.y + animOffset + 2,
          6,
          6
        )
      }
    })
  }

  renderEnemies() {
    this.currentLevel.enemies.forEach(enemy => {
      this.ctx.fillStyle = "#8B4513"
      this.ctx.fillRect(enemy.x, enemy.y, 20, 20)
      
      // Enemy eyes
      this.ctx.fillStyle = "#FF0000"
      this.ctx.fillRect(enemy.x + 3, enemy.y + 3, 4, 4)
      this.ctx.fillRect(enemy.x + 13, enemy.y + 3, 4, 4)
    })
  }

  renderGoal() {
    const goal = this.currentLevel.goal
    if (goal) {
      // Flag pole
      this.ctx.fillStyle = "#8B7355"
      this.ctx.fillRect(goal.x, goal.y - 64, 4, 64)
      
      // Flag
      this.ctx.fillStyle = "#4CAF50"
      this.ctx.fillRect(goal.x + 4, goal.y - 64, 28, 20)
      
      // Flag pattern
      this.ctx.fillStyle = "#2E7D32"
      this.ctx.fillRect(goal.x + 8, goal.y - 60, 8, 4)
      this.ctx.fillRect(goal.x + 20, goal.y - 56, 8, 4)
      this.ctx.fillRect(goal.x + 8, goal.y - 52, 8, 4)
    }
  }

  renderPlayer() {
    // Player body
    this.ctx.fillStyle = "#FF6B6B"
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height)
    
    // Player hat
    this.ctx.fillStyle = "#FF0000"
    this.ctx.fillRect(this.player.x + 2, this.player.y, this.player.width - 4, 8)
    
    // Player eyes
    this.ctx.fillStyle = "#000"
    if (this.player.direction === "right") {
      this.ctx.fillRect(this.player.x + 6, this.player.y + 10, 3, 3)
      this.ctx.fillRect(this.player.x + 15, this.player.y + 10, 3, 3)
    } else {
      this.ctx.fillRect(this.player.x + 6, this.player.y + 10, 3, 3)
      this.ctx.fillRect(this.player.x + 15, this.player.y + 10, 3, 3)
    }
    
    // Player overalls
    this.ctx.fillStyle = "#4169E1"
    this.ctx.fillRect(this.player.x + 4, this.player.y + 16, this.player.width - 8, 12)
  }
}

export default GameEngine