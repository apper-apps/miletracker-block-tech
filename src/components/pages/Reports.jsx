import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { toast } from 'react-toastify'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { tripsService } from '@/services/api/tripsService'
import { driversService } from '@/services/api/driversService'
import { vehiclesService } from '@/services/api/vehiclesService'

const Reports = () => {
  const [trips, setTrips] = useState([])
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    format: 'csv'
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
      setError('Failed to load data. Please try again.')
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

  // Filter trips based on date range
  const filteredTrips = trips.filter(trip => {
    return trip.date >= filters.startDate && trip.date <= filters.endDate
  })

  // Calculate summary statistics
  const summary = {
    totalTrips: filteredTrips.length,
    totalDistance: filteredTrips.reduce((sum, trip) => sum + trip.distance, 0),
    businessTrips: filteredTrips.filter(trip => trip.category === 'business').length,
    privateTrips: filteredTrips.filter(trip => trip.category === 'private').length,
    businessDistance: filteredTrips
      .filter(trip => trip.category === 'business')
      .reduce((sum, trip) => sum + trip.distance, 0),
    privateDistance: filteredTrips
      .filter(trip => trip.category === 'private')
      .reduce((sum, trip) => sum + trip.distance, 0)
  }

  const handleExport = () => {
    if (filteredTrips.length === 0) {
      toast.warning('No trips found for the selected date range.')
      return
    }

    try {
      const headers = [
        'Date',
        'Time', 
        'Driver',
        'Vehicle',
        'License Plate',
        'Start Location',
        'End Location',
        'Distance (km)',
        'Category',
        'Notes'
      ]

      const csvData = filteredTrips.map(trip => {
        const driver = drivers.find(d => d.Id === trip.driver_id)
        const vehicle = vehicles.find(v => v.Id === trip.vehicle_id)
        
        return [
          trip.date,
          trip.time,
          driver?.name || 'Unknown',
          `${vehicle?.make || ''} ${vehicle?.model || ''}`.trim() || 'Unknown',
          vehicle?.license_plate || '',
          trip.start_location,
          trip.end_location,
          trip.distance,
          trip.category,
          trip.notes || ''
        ]
      })

      // Add summary row
      csvData.push([])
      csvData.push(['SUMMARY'])
      csvData.push(['Total Trips', summary.totalTrips])
      csvData.push(['Total Distance (km)', summary.totalDistance.toFixed(2)])
      csvData.push(['Business Trips', summary.businessTrips])
      csvData.push(['Business Distance (km)', summary.businessDistance.toFixed(2)])
      csvData.push(['Private Trips', summary.privateTrips])
      csvData.push(['Private Distance (km)', summary.privateDistance.toFixed(2)])

      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `mileage-report-${filters.startDate}-to-${filters.endDate}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Report exported successfully!')
    } catch (err) {
      toast.error('Failed to export report. Please try again.')
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Reports</h1>
          <p className="text-gray-600">
            Export trip data and view summary statistics
          </p>
        </div>
      </div>

      {/* Export Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center mb-4">
          <ApperIcon name="Download" size={20} className="text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-primary-500">Export Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            type="date"
            label="Start Date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
          
          <Input
            type="date"
            label="End Date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
          
          <Select
            label="Format"
            value={filters.format}
            onChange={(e) => handleFilterChange('format', e.target.value)}
            options={[
              { value: 'csv', label: 'CSV (Excel Compatible)' }
            ]}
          />
        </div>
        
        <Button variant="primary" onClick={handleExport} className="w-full sm:w-auto">
          <ApperIcon name="Download" size={16} className="mr-2" />
          Export Report ({filteredTrips.length} trips)
        </Button>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex items-center mb-4">
          <ApperIcon name="BarChart3" size={20} className="text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-primary-500">Summary Statistics</h3>
          <span className="ml-2 text-sm text-gray-500">
            ({format(new Date(filters.startDate), 'MMM dd, yyyy')} - {format(new Date(filters.endDate), 'MMM dd, yyyy')})
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">
              {summary.totalTrips}
            </div>
            <div className="text-sm text-gray-600">Total Trips</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-500 mb-1">
              {summary.totalDistance.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Total Distance (km)</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-1">
              {summary.businessDistance.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Business Distance (km)</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-info mb-1">
              {summary.privateDistance.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Private Distance (km)</div>
          </div>
        </div>
      </motion.div>

      {/* Trip Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ApperIcon name="Eye" size={20} className="text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold text-primary-500">Trip Preview</h3>
          </div>
          <span className="text-sm text-gray-500">
            Showing {Math.min(10, filteredTrips.length)} of {filteredTrips.length} trips
          </span>
        </div>
        
        {filteredTrips.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No trips found for the selected date range.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTrips.slice(0, 10).map((trip) => {
                  const driver = drivers.find(d => d.Id === trip.driver_id)
                  const vehicle = vehicles.find(v => v.Id === trip.vehicle_id)
                  
                  return (
                    <tr key={trip.Id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {format(new Date(trip.date), 'MMM dd')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {driver?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {trip.start_location} → {trip.end_location}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-primary-500">
                        {trip.distance} km
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={trip.category}>
                          {trip.category}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Reports