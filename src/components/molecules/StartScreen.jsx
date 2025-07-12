import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Text from "@/components/atoms/Text"

const StartScreen = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="game-overlay"
    >
      <div className="game-panel">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Text variant="display" className="text-game-sky mb-2">JUMP QUEST</Text>
          <Text variant="body" className="text-black mb-8">Platform Adventure</Text>
        </motion.div>
        
        <div className="space-y-6 mb-8">
          <div>
            <Text variant="body" className="text-black mb-2">HOW TO PLAY:</Text>
            <div className="text-left space-y-2">
              <Text variant="caption" className="text-gray-600">← → Arrow Keys to Move</Text>
              <Text variant="caption" className="text-gray-600">SPACE to Jump</Text>
              <Text variant="caption" className="text-gray-600">Collect Coins & Avoid Enemies</Text>
              <Text variant="caption" className="text-gray-600">Reach the Flag to Win!</Text>
            </div>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onStart} size="lg">
            START GAME
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default StartScreen