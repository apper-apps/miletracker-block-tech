import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ title, value, change, icon, color = 'primary' }) => {
const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    success: 'from-success-500 to-success-600',
    info: 'from-info-500 to-info-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
<p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-primary-700">{value}</p>
{change && (
            <p className={`text-sm mt-2 ${change.type === 'increase' ? 'text-success-600' : 'text-error-600'}`}>
              <ApperIcon
                name={change.type === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className="inline mr-1" 
              />
              {change.value}
            </p>
          )}
        </div>
<div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-xl shadow-soft`}>
          <ApperIcon name={icon} className="text-white" size={24} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard