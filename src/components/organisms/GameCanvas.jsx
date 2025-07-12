import React, { useRef, useEffect, useState } from "react"
import { toast } from "react-toastify"
import GameEngine from "@/utils/GameEngine"

const GameCanvas = ({ 
  onScoreUpdate, 
  onLivesUpdate, 
  onCoinsUpdate, 
  onGameOver, 
  onLevelComplete,
  currentLevel = 1,
  gameState = "playing"
}) => {
  const canvasRef = useRef(null)
  const gameEngineRef = useRef(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || isInitialized) return

    const ctx = canvas.getContext("2d")
    
    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas, {
      onScoreUpdate,
      onLivesUpdate,
      onCoinsUpdate,
      onGameOver,
      onLevelComplete
    })

    // Load initial level
    gameEngineRef.current.loadLevel(currentLevel)
    setIsInitialized(true)

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.cleanup()
      }
    }
  }, [onScoreUpdate, onLivesUpdate, onCoinsUpdate, onGameOver, onLevelComplete])

  useEffect(() => {
    if (gameEngineRef.current && gameState === "playing") {
      gameEngineRef.current.resume()
    } else if (gameEngineRef.current && gameState === "paused") {
      gameEngineRef.current.pause()
    }
  }, [gameState])

  useEffect(() => {
    if (gameEngineRef.current && isInitialized) {
      gameEngineRef.current.loadLevel(currentLevel)
    }
  }, [currentLevel, isInitialized])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-gray-800 bg-sky-gradient shadow-2xl"
          style={{
            maxWidth: "100vw",
            maxHeight: "100vh",
            imageRendering: "pixelated"
          }}
        />
      </div>
    </div>
  )
}

export default GameCanvas