import React, { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import GameCanvas from "@/components/organisms/GameCanvas"
import GameHUD from "@/components/molecules/GameHUD"
import StartScreen from "@/components/molecules/StartScreen"
import GameOverScreen from "@/components/molecules/GameOverScreen"
import LevelCompleteScreen from "@/components/molecules/LevelCompleteScreen"

const GamePage = () => {
  const [gameState, setGameState] = useState("start") // start, playing, paused, gameOver, levelComplete
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [coins, setCoins] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)

  const handleStart = useCallback(() => {
    setGameState("playing")
    setScore(0)
    setLives(3)
    setCoins(0)
    setCurrentLevel(1)
    toast.success("Game Started!")
  }, [])

  const handleRestart = useCallback(() => {
    setGameState("playing")
    setScore(0)
    setLives(3)
    setCoins(0)
    setCurrentLevel(1)
    toast.info("Game Restarted!")
  }, [])

  const handleMenu = useCallback(() => {
    setGameState("start")
  }, [])

  const handleScoreUpdate = useCallback((newScore) => {
    setScore(newScore)
  }, [])

  const handleLivesUpdate = useCallback((newLives) => {
    setLives(newLives)
    if (newLives === 0) {
      toast.error("Game Over!")
    }
  }, [])

  const handleCoinsUpdate = useCallback((newCoins) => {
    setCoins(newCoins)
  }, [])

  const handleGameOver = useCallback(() => {
    setGameState("gameOver")
  }, [])

  const handleLevelComplete = useCallback(() => {
    setGameState("levelComplete")
    toast.success(`Level ${currentLevel} Complete!`)
  }, [currentLevel])

  const handleNextLevel = useCallback(() => {
    const nextLevel = currentLevel + 1
    if (nextLevel <= 3) {
      setCurrentLevel(nextLevel)
      setGameState("playing")
      toast.info(`Starting Level ${nextLevel}`)
    } else {
      toast.success("Congratulations! You completed all levels!")
      setGameState("start")
    }
  }, [currentLevel])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-sky-gradient overflow-hidden"
    >
      {/* Background clouds */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ x: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-0 w-32 h-16 bg-white rounded-full opacity-60"
        />
        <motion.div
          animate={{ x: [0, -150, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-32 right-0 w-24 h-12 bg-white rounded-full opacity-40"
        />
        <motion.div
          animate={{ x: [0, -80, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 left-0 w-40 h-20 bg-white rounded-full opacity-50"
        />
      </div>

      {/* Game Canvas */}
      {(gameState === "playing" || gameState === "paused") && (
        <>
          <GameCanvas
            onScoreUpdate={handleScoreUpdate}
            onLivesUpdate={handleLivesUpdate}
            onCoinsUpdate={handleCoinsUpdate}
            onGameOver={handleGameOver}
            onLevelComplete={handleLevelComplete}
            currentLevel={currentLevel}
            gameState={gameState}
          />
          
          <GameHUD
            score={score}
            lives={lives}
            coins={coins}
            level={currentLevel}
          />
        </>
      )}

      {/* Start Screen */}
      {gameState === "start" && (
        <StartScreen onStart={handleStart} />
      )}

      {/* Game Over Screen */}
      {gameState === "gameOver" && (
        <GameOverScreen
          score={score}
          coins={coins}
          onRestart={handleRestart}
          onMenu={handleMenu}
        />
      )}

      {/* Level Complete Screen */}
      {gameState === "levelComplete" && (
        <LevelCompleteScreen
          score={score}
          coins={coins}
          level={currentLevel}
          onNext={handleNextLevel}
          onMenu={handleMenu}
        />
      )}
    </motion.div>
  )
}

export default GamePage