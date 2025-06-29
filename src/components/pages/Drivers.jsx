import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import DriverModal from '@/components/organisms/DriverModal'
import { driversService } from '@/services/api/driversService'
import { tripsService } from '@/services/api/tripsService'
const Drivers = () => {
  const { t } = useTranslation()
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)

  const loadDrivers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await driversService.getAll()
      setDrivers(data)
    } catch (err) {
      setError('Failed to load drivers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDrivers()
  }, [])

  const handleAddDriver = () => {
    setEditingDriver(null)
    setShowModal(true)
  }

  const handleEditDriver = (driver) => {
    setEditingDriver(driver)
    setShowModal(true)
  }

  const handleSaveDriver = async (driverData) => {
    try {
      if (editingDriver) {
const updatedDriver = await driversService.update(editingDriver.Id, driverData)
        setDrivers(prev => prev.map(driver => driver.Id === editingDriver.Id ? updatedDriver : driver))
        toast.success(t('messages.driverUpdated'))
      } else {
        const newDriver = await driversService.create(driverData)
        setDrivers(prev => [...prev, newDriver])
        toast.success(t('messages.driverAdded'))
      }
      setShowModal(false)
} catch (err) {
      toast.error(t('messages.saveError'))
    }
  }

  const handleDeleteDriver = async (driverId) => {
    try {
      // Check if driver has associated trips
      const trips = await tripsService.getAll()
      const hasTrips = trips.some(trip => trip.driver_id === driverId)
      
if (hasTrips) {
        toast.error(t('messages.cannotDeleteDriver'))
        return
      }

if (window.confirm(t('messages.confirmDelete'))) {
        await driversService.delete(driverId)
        setDrivers(prev => prev.filter(driver => driver.Id !== driverId))
        toast.success(t('messages.driverDeleted'))
      }
    } catch (err) {
      toast.error(t('messages.deleteError'))
    }
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadDrivers} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
<div>
          <h1 className="text-3xl font-bold text-primary-700">{t('drivers.title')}</h1>
          <p className="text-gray-600">
            {t('drivers.subtitle')}
          </p>
        </div>
        <Button variant="primary" onClick={handleAddDriver}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {t('drivers.addDriver')}
        </Button>
      </div>

      {drivers.length === 0 ? (
<Empty 
          title={t('drivers.noDrivers.title')}
          description={t('drivers.noDrivers.description')}
          icon="Users"
          action={{
            label: t('drivers.noDrivers.action'),
            icon: 'Plus',
            onClick: handleAddDriver
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
                    {t('drivers.table.driver')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('drivers.table.email')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('drivers.table.licenseNumber')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('drivers.table.created')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drivers.map((driver) => (
                  <motion.tr
                    key={driver.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-full mr-3">
                          <ApperIcon name="User" className="text-white" size={16} />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {driver.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {driver.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {driver.license_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(driver.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDriver(driver)}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDriver(driver.Id)}
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
        <DriverModal
          driver={editingDriver}
          onSave={handleSaveDriver}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default Drivers