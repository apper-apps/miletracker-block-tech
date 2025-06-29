import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Trips', href: '/trips', icon: 'Route' },
    { name: 'Drivers', href: '/drivers', icon: 'Users' },
    { name: 'Vehicles', href: '/vehicles', icon: 'Car' },
    { name: 'Reports', href: '/reports', icon: 'FileText' },
  ]

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  }

  return (
    <motion.div
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:static lg:translate-x-0"
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-xl">
              <ApperIcon name="Car" className="text-white" size={20} />
            </div>
            <span className="text-lg font-semibold text-primary-500">MileTracker Pro</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon
                    name={item.icon}
                    size={20}
                    className={`mr-3 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'
                    }`}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <ApperIcon name="Shield" size={16} />
            <span>Secure & Compliant</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar