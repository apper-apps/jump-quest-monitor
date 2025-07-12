import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Text from "@/components/atoms/Text"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ title = "No Data", message = "Nothing to display here.", actionText, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <ApperIcon name="Package" className="w-16 h-16 text-gray-400 mb-4" />
      <Text variant="title" className="text-black mb-2">{title}</Text>
      <Text variant="body" className="text-gray-600 mb-6">{message}</Text>
      
      {onAction && actionText && (
        <Button onClick={onAction}>
          {actionText}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty