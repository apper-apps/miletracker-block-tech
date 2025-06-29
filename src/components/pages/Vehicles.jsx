import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import VehicleModal from '@/components/organisms/VehicleModal'
import { vehiclesService } from '@/services/api/vehiclesService'
import { tripsService } from '@/services/api/tripsService'

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)

  const loadVehicles = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await vehiclesService.getAll()
      setVehicles(data)
    } catch (err) {
      setError('Failed to load vehicles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  const handleAddVehicle = () => {
    setEditingVehicle(null)
    setShowModal(true)
  }

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle)
    setShowModal(true)
  }

  const handleSaveVehicle = async (vehicleData) => {
    try {
      if (editingVehicle) {
        const updatedVehicle = await vehiclesService.update(editingVehicle.Id, vehicleData)
        setVehicles(prev => prev.map(vehicle => vehicle.Id === editingVehicle.Id ? updatedVehicle : vehicle))
        toast.success('Vehicle updated successfully!')
      } else {
        const newVehicle = await vehiclesService.create(vehicleData)
        setVehicles(prev => [...prev, newVehicle])
        toast.success('Vehicle added successfully!')
      }
      setShowModal(false)
    } catch (err) {
      toast.error('Failed to save vehicle. Please try again.')
    }
  }

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      // Check if vehicle has associated trips
      const trips = await tripsService.getAll()
      const hasTrips = trips.some(trip => trip.vehicle_id === vehicleId)
      
      if (hasTrips) {
        toast.error('Cannot delete vehicle with associated trips. Please reassign or delete trips first.')
        return
      }

      if (window.confirm('Are you sure you want to delete this vehicle?')) {
        await vehiclesService.delete(vehicleId)
        setVehicles(prev => prev.filter(vehicle => vehicle.Id !== vehicleId))
        toast.success('Vehicle deleted successfully!')
      }
    } catch (err) {
      toast.error('Failed to delete vehicle. Please try again.')
    }
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadVehicles} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
<div>
          <h1 className="text-3xl font-bold text-primary-700">Vehicles</h1>
          <p className="text-gray-600">
            Manage your fleet vehicles
          </p>
        </div>
        <Button variant="primary" onClick={handleAddVehicle}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <Empty 
          title="No vehicles found"
          description="Add your first vehicle to start tracking mileage."
          icon="Car"
          action={{
            label: 'Add Vehicle',
            icon: 'Plus',
            onClick: handleAddVehicle
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License Plate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VIN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <motion.tr
                    key={vehicle.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-full mr-3">
                          <ApperIcon name="Car" className="text-white" size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.year}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-500">
                      {vehicle.license_plate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.vin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(vehicle.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditVehicle(vehicle)}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVehicle(vehicle.Id)}
                          className="text-error hover:text-error"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {showModal && (
        <VehicleModal
          vehicle={editingVehicle}
          onSave={handleSaveVehicle}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default Vehicles