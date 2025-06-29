import React from 'react'
import { motion } from 'framer-motion'

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className={`${className}`}>
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <motion.input
        whileFocus={{ scale: 1.01 }}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input-field ${error ? 'border-error focus:ring-error focus:border-error' : ''} ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input