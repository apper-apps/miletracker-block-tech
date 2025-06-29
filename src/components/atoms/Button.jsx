import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  type = 'button',
  className = '',
  ...props 
}) => {
const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative z-10'
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-card hover:shadow-card-hover active:scale-98 border border-transparent',
    secondary: 'bg-white hover:bg-gray-50 text-primary-600 border border-gray-200 focus:ring-primary-500 shadow-card hover:shadow-card-hover hover:border-gray-300 active:scale-98',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500 shadow-card hover:shadow-card-hover active:scale-98 border border-transparent',
    success: 'bg-success-500 hover:bg-success-600 text-white focus:ring-success-500 shadow-card hover:shadow-card-hover active:scale-98 border border-transparent',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500 shadow-card hover:shadow-card-hover active:scale-98 border border-transparent',
    error: 'bg-error-500 hover:bg-error-600 text-white focus:ring-error-500 shadow-card hover:shadow-card-hover active:scale-98 border border-transparent',
    ghost: 'text-gray-500 hover:text-primary-600 hover:bg-gray-50 focus:ring-primary-500 rounded-xl'
  }
  
const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <motion.button
      whileHover={{ scale: variant !== 'ghost' ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button