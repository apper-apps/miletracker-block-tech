import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'

const TripModal = ({ trip, drivers, vehicles, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    driver_id: '',
    vehicle_id: '',
    date: '',
    time: '',
    start_location: '',
    end_location: '',
    start_odometer: '',
    end_odometer: '',
    distance: '',
    category: 'business',
    notes: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (trip) {
      setFormData({
        driver_id: trip.driver_id?.toString() || '',
        vehicle_id: trip.vehicle_id?.toString() || '',
        date: trip.date || '',
        time: trip.time || '',
        start_location: trip.start_location || '',
        end_location: trip.end_location || '',
        start_odometer: trip.start_odometer?.toString() || '',
        end_odometer: trip.end_odometer?.toString() || '',
        distance: trip.distance?.toString() || '',
        category: trip.category || 'business',
        notes: trip.notes || ''
      })
    } else {
      // Set default values for new trip
      const now = new Date()
      setFormData(prev => ({
        ...prev,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5)
      }))
    }
  }, [trip])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-calculate distance from odometer readings
    if (field === 'start_odometer' || field === 'end_odometer') {
      const start = field === 'start_odometer' ? parseFloat(value) : parseFloat(formData.start_odometer)
      const end = field === 'end_odometer' ? parseFloat(value) : parseFloat(formData.end_odometer)
      
      if (start && end && end > start) {
        const calculatedDistance = (end - start).toFixed(1)
        setFormData(prev => ({ ...prev, distance: calculatedDistance }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.driver_id) newErrors.driver_id = 'Driver is required'
    if (!formData.vehicle_id) newErrors.vehicle_id = 'Vehicle is required'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.time) newErrors.time = 'Time is required'
    if (!formData.start_location) newErrors.start_location = 'Start location is required'
    if (!formData.end_location) newErrors.end_location = 'End location is required'
    if (!formData.distance || parseFloat(formData.distance) <= 0) {
      newErrors.distance = 'Distance must be greater than 0'
    }

    if (formData.start_odometer && formData.end_odometer) {
      const start = parseFloat(formData.start_odometer)
      const end = parseFloat(formData.end_odometer)
      if (end <= start) {
        newErrors.end_odometer = 'End odometer must be greater than start odometer'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const tripData = {
      ...formData,
      driver_id: parseInt(formData.driver_id),
      vehicle_id: parseInt(formData.vehicle_id),
      distance: parseFloat(formData.distance),
      start_odometer: formData.start_odometer ? parseFloat(formData.start_odometer) : null,
      end_odometer: formData.end_odometer ? parseFloat(formData.end_odometer) : null
    }

    onSave(tripData)
  }

  const driverOptions = drivers.map(driver => ({
    value: driver.Id.toString(),
    label: driver.name
  }))

  const vehicleOptions = vehicles.map(vehicle => ({
    value: vehicle.Id.toString(),
    label: `${vehicle.make} ${vehicle.model} (${vehicle.license_plate})`
  }))

  const categoryOptions = [
    { value: 'business', label: 'Business' },
    { value: 'private', label: 'Private' }
  ]

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary-500">
              {trip ? 'Edit Trip' : 'Add New Trip'}
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Driver"
              value={formData.driver_id}
              onChange={(e) => handleInputChange('driver_id', e.target.value)}
              options={driverOptions}
              required
              error={errors.driver_id}
            />

            <Select
              label="Vehicle"
              value={formData.vehicle_id}
              onChange={(e) => handleInputChange('vehicle_id', e.target.value)}
              options={vehicleOptions}
              required
              error={errors.vehicle_id}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
              error={errors.date}
            />

            <Input
              type="time"
              label="Time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              required
              error={errors.time}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Location"
              value={formData.start_location}
              onChange={(e) => handleInputChange('start_location', e.target.value)}
              placeholder="Enter start location"
              required
              error={errors.start_location}
            />

            <Input
              label="End Location"
              value={formData.end_location}
              onChange={(e) => handleInputChange('end_location', e.target.value)}
              placeholder="Enter end location"
              required
              error={errors.end_location}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              step="0.1"
              label="Start Odometer (Optional)"
              value={formData.start_odometer}
              onChange={(e) => handleInputChange('start_odometer', e.target.value)}
              placeholder="Start reading"
              error={errors.start_odometer}
            />

            <Input
              type="number"
              step="0.1"
              label="End Odometer (Optional)"
              value={formData.end_odometer}
              onChange={(e) => handleInputChange('end_odometer', e.target.value)}
              placeholder="End reading"
              error={errors.end_odometer}
            />

            <Input
              type="number"
              step="0.1"
              label="Distance (km)"
              value={formData.distance}
              onChange={(e) => handleInputChange('distance', e.target.value)}
              placeholder="Distance in km"
              required
              error={errors.distance}
            />
          </div>

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            options={categoryOptions}
            required
          />

          <div>
            <label className="label">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this trip"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <ApperIcon name="Save" size={16} className="mr-2" />
              {trip ? 'Update Trip' : 'Add Trip'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default TripModal