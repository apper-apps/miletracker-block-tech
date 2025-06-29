import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Header = ({ onMenuClick }) => {
  return (
    <motion.header 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden mr-3 p-2"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-xl">
                <ApperIcon name="Car" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-500">MileTracker Pro</h1>
                <p className="text-sm text-gray-500">Vehicle Mileage Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              <ApperIcon name="Calendar" size={16} className="mr-1" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header