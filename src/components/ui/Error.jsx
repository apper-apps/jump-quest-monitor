import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Text from "@/components/atoms/Text"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong!", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="game-overlay"
    >
      <div className="game-panel">
        <ApperIcon name="AlertTriangle" className="w-16 h-16 text-game-error mx-auto mb-4" />
        <Text variant="title" className="text-black mb-2">Error!</Text>
        <Text variant="body" className="text-gray-600 mb-6">{message}</Text>
        
        {onRetry && (
          <Button onClick={onRetry}>
            TRY AGAIN
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default Error