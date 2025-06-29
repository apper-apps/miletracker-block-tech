import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import FilterPanel from '@/components/molecules/FilterPanel'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import TripModal from '@/components/organisms/TripModal'
import { tripsService } from '@/services/api/tripsService'
import { driversService } from '@/services/api/driversService'
import { vehiclesService } from '@/services/api/vehiclesService'

const Trips = () => {
  const [trips, setTrips] = useState([])
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    driverId: '',
    vehicleId: '',
    category: ''
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [tripsData, driversData, vehiclesData] = await Promise.all([
        tripsService.getAll(),
        driversService.getAll(),
        vehiclesService.getAll()
      ])
      
      setTrips(tripsData)
      setDrivers(driversData)
      setVehicles(vehiclesData)
    } catch (err) {
      setError('Failed to load trips data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      driverId: '',
      vehicleId: '',
      category: ''
    })
  }

  const handleAddTrip = () => {
    setEditingTrip(null)
    setShowModal(true)
  }

  const handleEditTrip = (trip) => {
    setEditingTrip(trip)
    setShowModal(true)
  }

  const handleSaveTrip = async (tripData) => {
    try {
      if (editingTrip) {
        const updatedTrip = await tripsService.update(editingTrip.Id, tripData)
        setTrips(prev => prev.map(trip => trip.Id === editingTrip.Id ? updatedTrip : trip))
        toast.success('Trip updated successfully!')
      } else {
        const newTrip = await tripsService.create(tripData)
        setTrips(prev => [...prev, newTrip])
        toast.success('Trip added successfully!')
      }
      setShowModal(false)
    } catch (err) {
      toast.error('Failed to save trip. Please try again.')
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripsService.delete(tripId)
        setTrips(prev => prev.filter(trip => trip.Id !== tripId))
        toast.success('Trip deleted successfully!')
      } catch (err) {
        toast.error('Failed to delete trip. Please try again.')
      }
    }
  }

  // Filter trips based on current filters
  const filteredTrips = trips.filter(trip => {
    if (filters.startDate && trip.date < filters.startDate) return false
    if (filters.endDate && trip.date > filters.endDate) return false
    if (filters.driverId && trip.driver_id !== parseInt(filters.driverId)) return false
    if (filters.vehicleId && trip.vehicle_id !== parseInt(filters.vehicleId)) return false
    if (filters.category && trip.category !== filters.category) return false
    return true
  })

  const driverOptions = drivers.map(driver => ({
    value: driver.Id.toString(),
    label: driver.name
  }))

  const vehicleOptions = vehicles.map(vehicle => ({
    value: vehicle.Id.toString(),
    label: `${vehicle.make} ${vehicle.model} (${vehicle.license_plate})`
  }))

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
<div>
          <h1 className="text-3xl font-bold text-primary-700">Trips</h1>
          <p className="text-gray-600">
            Manage and track vehicle trips
          </p>
        </div>
        <Button variant="primary" onClick={handleAddTrip}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Trip
        </Button>
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        driverOptions={driverOptions}
        vehicleOptions={vehicleOptions}
      />

      {filteredTrips.length === 0 ? (
        <Empty 
          title="No trips found"
          description="Start tracking your vehicle trips by adding your first trip or adjust your filters."
          icon="Route"
          action={{
            label: 'Add Trip',
            icon: 'Plus',
            onClick: handleAddTrip
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
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrips.map((trip) => {
                  const driver = drivers.find(d => d.Id === trip.driver_id)
                  const vehicle = vehicles.find(v => v.Id === trip.vehicle_id)
                  
                  return (
                    <motion.tr
                      key={trip.Id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {format(new Date(trip.date), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-gray-500">{trip.time}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {driver?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {vehicle?.make} {vehicle?.model}
                          </div>
                          <div className="text-gray-500">{vehicle?.license_plate}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate">
                          {trip.start_location} → {trip.end_location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-500">
                        {trip.distance} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={trip.category}>
                          {trip.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTrip(trip)}
                          >
                            <ApperIcon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTrip(trip.Id)}
                            className="text-error hover:text-error"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {showModal && (
        <TripModal
          trip={editingTrip}
          drivers={drivers}
          vehicles={vehicles}
          onSave={handleSaveTrip}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default Trips