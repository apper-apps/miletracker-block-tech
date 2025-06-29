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
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 shadow-sm hover:shadow-md active:scale-98',
    secondary: 'bg-white hover:bg-gray-50 text-primary-500 border border-primary-200 focus:ring-primary-500 shadow-sm hover:shadow-md active:scale-98',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500 shadow-sm hover:shadow-md active:scale-98',
    success: 'bg-success hover:brightness-110 text-white focus:ring-success shadow-sm hover:shadow-md active:scale-98',
    warning: 'bg-warning hover:brightness-110 text-white focus:ring-warning shadow-sm hover:shadow-md active:scale-98',
    error: 'bg-error hover:brightness-110 text-white focus:ring-error shadow-sm hover:shadow-md active:scale-98',
    ghost: 'text-gray-600 hover:text-primary-500 hover:bg-gray-100 focus:ring-primary-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
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