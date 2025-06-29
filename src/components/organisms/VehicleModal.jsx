import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const VehicleModal = ({ vehicle, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    license_plate: '',
    vin: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year?.toString() || '',
        license_plate: vehicle.license_plate || '',
        vin: vehicle.vin || ''
      })
    }
  }, [vehicle])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.make.trim()) newErrors.make = 'Make is required'
    if (!formData.model.trim()) newErrors.model = 'Model is required'
    if (!formData.year) {
      newErrors.year = 'Year is required'
    } else {
      const year = parseInt(formData.year)
      const currentYear = new Date().getFullYear()
      if (year < 1900 || year > currentYear + 1) {
        newErrors.year = `Year must be between 1900 and ${currentYear + 1}`
      }
    }
    if (!formData.license_plate.trim()) newErrors.license_plate = 'License plate is required'
    if (!formData.vin.trim()) newErrors.vin = 'VIN is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const vehicleData = {
      ...formData,
      year: parseInt(formData.year)
    }

    onSave(vehicleData)
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
              {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Make"
              value={formData.make}
              onChange={(e) => handleInputChange('make', e.target.value)}
              placeholder="Toyota, Ford, etc."
              required
              error={errors.make}
            />

            <Input
              label="Model"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              placeholder="Camry, F-150, etc."
              required
              error={errors.model}
            />
          </div>

          <Input
            type="number"
            label="Year"
            value={formData.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            placeholder="2020"
            min="1900"
            max={new Date().getFullYear() + 1}
            required
            error={errors.year}
          />

          <Input
            label="License Plate"
            value={formData.license_plate}
            onChange={(e) => handleInputChange('license_plate', e.target.value.toUpperCase())}
            placeholder="ABC-123"
            required
            error={errors.license_plate}
          />

          <Input
            label="VIN"
            value={formData.vin}
            onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
            placeholder="17-character VIN"
            maxLength={17}
            required
            error={errors.vin}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <ApperIcon name="Save" size={16} className="mr-2" />
              {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default VehicleModal