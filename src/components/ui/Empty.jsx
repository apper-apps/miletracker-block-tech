import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = 'No data found', 
  description = 'Get started by adding your first record.',
  action,
  icon = 'Database'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="bg-gradient-to-br from-primary-100 to-accent-100 p-6 rounded-full mb-6">
        <ApperIcon name={icon} size={48} className="text-primary-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 text-center max-w-md">{description}</p>
      
      {action && (
        <Button onClick={action.onClick} variant="primary">
          <ApperIcon name={action.icon} size={16} className="mr-2" />
          {action.label}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty