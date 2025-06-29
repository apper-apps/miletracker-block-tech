import React from 'react'
import { motion } from 'framer-motion'

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [],
  required = false,
  disabled = false,
  error,
  placeholder = 'Select an option',
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
      <motion.select
        whileFocus={{ scale: 1.01 }}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`input-field ${error ? 'border-error focus:ring-error focus:border-error' : ''} ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
        {...props}
      >
<option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
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

export default Select