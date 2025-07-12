import React from "react"
import { motion } from "framer-motion"
import Text from "@/components/atoms/Text"

const Loading = () => {
  return (
    <div className="game-overlay">
      <div className="game-panel">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-game-gold border-t-transparent rounded-full mx-auto mb-4"
        />
        <Text variant="title" className="text-black">Loading...</Text>
      </div>
    </div>
  )
}

export default Loading