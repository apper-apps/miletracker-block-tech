import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  driverOptions = [], 
  vehicleOptions = [] 
}) => {
  const { t } = useTranslation()
  
  const categoryOptions = [
    { value: 'business', label: t('trips.categories.business') },
    { value: 'private', label: t('trips.categories.private') }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 mb-6"
    >
<div className="flex items-center mb-4">
        <ApperIcon name="Filter" size={20} className="text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold text-primary-700">{t('common.filter')}</h3>
      </div>
      
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Input
          type="date"
          label={t('reports.startDate')}
          value={filters.startDate}
          onChange={(e) => onFilterChange('startDate', e.target.value)}
        />
        
        <Input
          type="date"
          label={t('reports.endDate')}
          value={filters.endDate}
          onChange={(e) => onFilterChange('endDate', e.target.value)}
        />
        
        <Select
          label={t('drivers.table.driver')}
          value={filters.driverId}
          onChange={(e) => onFilterChange('driverId', e.target.value)}
          options={driverOptions}
          placeholder={t('common.selectOption')}
        />
        
<Select
          label={t('vehicles.table.vehicle')}
          value={filters.vehicleId}
          onChange={(e) => onFilterChange('vehicleId', e.target.value)}
          options={vehicleOptions}
          placeholder={t('common.selectOption')}
        />
        
        <Select
          label={t('trips.table.category')}
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          options={categoryOptions}
          placeholder={t('common.selectOption')}
        />
        
        <div className="flex items-end">
          <Button
            variant="secondary"
            onClick={onClearFilters}
            className="w-full"
          >
<ApperIcon name="X" size={16} className="mr-2" />
            {t('common.filter')}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default FilterPanel