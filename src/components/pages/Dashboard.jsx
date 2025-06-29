import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import StatCard from '@/components/molecules/StatCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { tripsService } from '@/services/api/tripsService'
import { driversService } from '@/services/api/driversService'
import { vehiclesService } from '@/services/api/vehiclesService'

const Dashboard = () => {
  const [data, setData] = useState({
    trips: [],
    drivers: [],
    vehicles: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [trips, drivers, vehicles] = await Promise.all([
        tripsService.getAll(),
        driversService.getAll(),
        vehiclesService.getAll()
      ])
      
      setData({ trips, drivers, vehicles })
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />

  // Calculate current month stats
  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  
  const currentMonthTrips = data.trips.filter(trip => {
    const tripDate = new Date(trip.date)
    return tripDate >= monthStart && tripDate <= monthEnd
  })

  const totalDistance = currentMonthTrips.reduce((sum, trip) => sum + trip.distance, 0)
  const businessDistance = currentMonthTrips
    .filter(trip => trip.category === 'business')
    .reduce((sum, trip) => sum + trip.distance, 0)
  const privateDistance = totalDistance - businessDistance

  const recentTrips = data.trips
    .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time))
    .slice(0, 5)

  const stats = [
    {
      title: 'Total Trips This Month',
      value: currentMonthTrips.length.toString(),
      icon: 'Route',
      color: 'primary'
    },
    {
      title: 'Total Distance',
      value: `${totalDistance.toFixed(1)} km`,
      icon: 'Gauge',
      color: 'accent'
    },
    {
      title: 'Business Miles',
      value: `${businessDistance.toFixed(1)} km`,
      icon: 'Briefcase',
      color: 'success'
    },
    {
      title: 'Active Vehicles',
      value: data.vehicles.length.toString(),
      icon: 'Car',
      color: 'info'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-500">Dashboard</h1>
          <p className="text-gray-600">
            {format(currentMonth, 'MMMM yyyy')} Overview
          </p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Trip
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Recent Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary-500">Recent Trips</h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ExternalLink" size={16} className="mr-1" />
              View All
            </Button>
          </div>
          
          {recentTrips.length === 0 ? (
            <Empty 
              title="No trips yet"
              description="Start tracking your vehicle mileage by adding your first trip."
              icon="Route"
              action={{
                label: 'Add Trip',
                icon: 'Plus',
                onClick: () => {}
              }}
            />
          ) : (
            <div className="space-y-3">
              {recentTrips.map((trip) => {
                const driver = data.drivers.find(d => d.Id === trip.driver_id)
                const vehicle = data.vehicles.find(v => v.Id === trip.vehicle_id)
                
                return (
                  <div key={trip.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={trip.category}>
                          {trip.category}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {format(new Date(trip.date), 'MMM dd')}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {trip.start_location} → {trip.end_location}
                      </p>
                      <p className="text-xs text-gray-500">
                        {driver?.name} • {vehicle?.make} {vehicle?.model}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary-500">
                        {trip.distance} km
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-primary-500 mb-4">Quick Stats</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-success/10 p-2 rounded-lg mr-3">
                  <ApperIcon name="Briefcase" size={16} className="text-success" />
                </div>
                <span className="text-sm font-medium text-gray-700">Business Trips</span>
              </div>
              <span className="text-lg font-bold text-success">
                {currentMonthTrips.filter(t => t.category === 'business').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-info/10 p-2 rounded-lg mr-3">
                  <ApperIcon name="Home" size={16} className="text-info" />
                </div>
                <span className="text-sm font-medium text-gray-700">Private Trips</span>
              </div>
              <span className="text-lg font-bold text-info">
                {currentMonthTrips.filter(t => t.category === 'private').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-primary-100 p-2 rounded-lg mr-3">
                  <ApperIcon name="Users" size={16} className="text-primary-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Active Drivers</span>
              </div>
              <span className="text-lg font-bold text-primary-500">
                {data.drivers.length}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-accent-100 p-2 rounded-lg mr-3">
                  <ApperIcon name="Car" size={16} className="text-accent-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Fleet Size</span>
              </div>
              <span className="text-lg font-bold text-accent-500">
                {data.vehicles.length}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard