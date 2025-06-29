import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
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
  const { t } = useTranslation()
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
      toast.warning(t('messages.noTripsWarning'))
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

      const exportData = filteredTrips.map(trip => {
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

      // Add summary rows
      exportData.push([])
      exportData.push(['SUMMARY'])
      exportData.push(['Total Trips', summary.totalTrips])
      exportData.push(['Total Distance (km)', summary.totalDistance.toFixed(2)])
      exportData.push(['Business Trips', summary.businessTrips])
      exportData.push(['Business Distance (km)', summary.businessDistance.toFixed(2)])
      exportData.push(['Private Trips', summary.privateTrips])
      exportData.push(['Private Distance (km)', summary.privateDistance.toFixed(2)])

      const fileName = `mileage-report-${filters.startDate}-to-${filters.endDate}`

      if (filters.format === 'excel') {
        // Create Excel workbook
        const wb = XLSX.utils.book_new()
        const wsData = [headers, ...exportData]
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        
        // Set column widths
        const colWidths = [
          { wch: 12 }, // Date
          { wch: 8 },  // Time
          { wch: 20 }, // Driver
          { wch: 20 }, // Vehicle
          { wch: 15 }, // License Plate
          { wch: 30 }, // Start Location
          { wch: 30 }, // End Location
          { wch: 12 }, // Distance
          { wch: 10 }, // Category
          { wch: 30 }  // Notes
        ]
        ws['!cols'] = colWidths

        XLSX.utils.book_append_sheet(wb, ws, 'Mileage Report')
        XLSX.writeFile(wb, `${fileName}.xlsx`)
      } else {
        // CSV export
        const csvContent = [headers, ...exportData]
          .map(row => row.map(field => `"${field}"`).join(','))
          .join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        
        link.setAttribute('href', url)
        link.setAttribute('download', `${fileName}.csv`)
        link.style.visibility = 'hidden'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      toast.success(t('messages.reportExported'))
    } catch (err) {
      toast.error(t('messages.exportError'))
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
<div>
          <h1 className="text-3xl font-bold text-primary-700">{t('reports.title')}</h1>
          <p className="text-gray-600">
            {t('reports.subtitle')}
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
          <h3 className="text-lg font-semibold text-primary-500">{t('reports.exportConfig')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
<Input
            type="date"
            label={t('reports.startDate')}
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
          
          <Input
            type="date"
            label={t('reports.endDate')}
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
          
<Select
            label={t('reports.format')}
            value={filters.format}
            onChange={(e) => handleFilterChange('format', e.target.value)}
            options={[
              { value: 'csv', label: t('reports.csvFormat') },
              { value: 'excel', label: t('reports.excelFormat') }
            ]}
          />
        </div>
        
<Button variant="primary" onClick={handleExport} className="w-full sm:w-auto">
          <ApperIcon name="Download" size={16} className="mr-2" />
          {t('reports.exportButton')} ({filteredTrips.length} {t('reports.trips')})
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
          <h3 className="text-lg font-semibold text-primary-500">{t('reports.summary')}</h3>
          <span className="ml-2 text-sm text-gray-500">
            ({format(new Date(filters.startDate), 'MMM dd, yyyy')} - {format(new Date(filters.endDate), 'MMM dd, yyyy')})
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">
              {summary.totalTrips}
            </div>
<div className="text-sm text-gray-600">{t('reports.stats.totalTrips')}</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-500 mb-1">
              {summary.totalDistance.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">{t('reports.stats.totalDistance')}</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-1">
              {summary.businessDistance.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">{t('reports.stats.businessDistance')}</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-info mb-1">
              {summary.privateDistance.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">{t('reports.stats.privateDistance')}</div>
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
            <h3 className="text-lg font-semibold text-primary-500">{t('reports.tripPreview')}</h3>
          </div>
          <span className="text-sm text-gray-500">
            {t('reports.showing')} {Math.min(10, filteredTrips.length)} {t('reports.of')} {filteredTrips.length} {t('reports.trips')}
          </span>
        </div>
        
        {filteredTrips.length === 0 ? (
<div className="text-center py-8 text-gray-500">
            {t('reports.noTripsInRange')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('reports.table.date')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('reports.table.driver')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('reports.table.vehicle')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('reports.table.route')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('reports.table.distance')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('reports.table.category')}</th>
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
                          {t(`trips.categories.${trip.category}`)}
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