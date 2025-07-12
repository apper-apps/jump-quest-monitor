import React from "react"
import Text from "@/components/atoms/Text"
import ApperIcon from "@/components/ApperIcon"

const GameHUD = ({ score, lives, coins, level }) => {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-40 pointer-events-none">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-black bg-opacity-50 px-3 py-2 rounded border-2 border-white">
          <Text variant="body">SCORE:</Text>
          <Text variant="score">{score.toString().padStart(6, "0")}</Text>
        </div>
        
        <div className="flex items-center gap-2 bg-black bg-opacity-50 px-3 py-2 rounded border-2 border-white">
          <ApperIcon name="Coins" className="w-4 h-4 text-game-gold" />
          <Text variant="score">{coins}</Text>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-end">
        <div className="flex items-center gap-2 bg-black bg-opacity-50 px-3 py-2 rounded border-2 border-white">
          <Text variant="body">LEVEL:</Text>
          <Text variant="score">{level}</Text>
        </div>
        
        <div className="flex items-center gap-2 bg-black bg-opacity-50 px-3 py-2 rounded border-2 border-white">
          <ApperIcon name="Heart" className="w-4 h-4 text-red-500" />
          <Text variant="score">{lives}</Text>
        </div>
      </div>
    </div>
  )
}

export default GameHUD