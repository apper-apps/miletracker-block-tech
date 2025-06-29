import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const DriverModal = ({ driver, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    license_number: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || '',
        email: driver.email || '',
        license_number: driver.license_number || ''
      })
    }
  }, [driver])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.license_number.trim()) newErrors.license_number = 'License number is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary-500">
              {driver ? 'Edit Driver' : 'Add New Driver'}
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter driver's full name"
            required
            error={errors.name}
          />

          <Input
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="driver@company.com"
            required
            error={errors.email}
          />

          <Input
            label="License Number"
            value={formData.license_number}
            onChange={(e) => handleInputChange('license_number', e.target.value)}
            placeholder="Enter license number"
            required
            error={errors.license_number}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <ApperIcon name="Save" size={16} className="mr-2" />
              {driver ? 'Update Driver' : 'Add Driver'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default DriverModal