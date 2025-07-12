import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Text from "@/components/atoms/Text"

const GameOverScreen = ({ score, coins, onRestart, onMenu }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="game-overlay"
    >
      <div className="game-panel">
        <Text variant="display" className="text-red-500 mb-6">GAME OVER</Text>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center gap-8">
            <Text variant="body" className="text-black">Final Score:</Text>
            <Text variant="score" className="text-black">{score.toString().padStart(6, "0")}</Text>
          </div>
          
          <div className="flex justify-between items-center gap-8">
            <Text variant="body" className="text-black">Coins Collected:</Text>
            <Text variant="score" className="text-black">{coins}</Text>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button onClick={onRestart}>
            RESTART
          </Button>
          <Button variant="secondary" onClick={onMenu}>
            MENU
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default GameOverScreen