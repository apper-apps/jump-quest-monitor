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
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || isInitialized) return

    try {
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("Failed to get 2D rendering context")
      }
      
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
      setLoading(false)
      setError(null)
    } catch (err) {
      console.error("GameCanvas initialization error:", err)
      setError(err.message || "Failed to initialize game")
      setLoading(false)
      toast.error("Failed to initialize game canvas")
    }

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.cleanup()
        gameEngineRef.current = null
      }
    }
  }, [onScoreUpdate, onLivesUpdate, onCoinsUpdate, onGameOver, onLevelComplete, currentLevel])

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

if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white font-pixel">Loading game...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 font-pixel text-center">
          <div>Game Error</div>
          <div className="text-xs mt-2">{error}</div>
        </div>
      </div>
    )
  }

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