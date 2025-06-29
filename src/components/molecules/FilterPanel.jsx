import React from 'react'
import { motion } from 'framer-motion'
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
  const categoryOptions = [
    { value: 'business', label: 'Business' },
    { value: 'private', label: 'Private' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 mb-6"
    >
      <div className="flex items-center mb-4">
<ApperIcon name="Filter" size={20} className="text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold text-primary-700">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Input
          type="date"
          label="Start Date"
          value={filters.startDate}
          onChange={(e) => onFilterChange('startDate', e.target.value)}
        />
        
        <Input
          type="date"
          label="End Date"
          value={filters.endDate}
          onChange={(e) => onFilterChange('endDate', e.target.value)}
        />
        
        <Select
          label="Driver"
          value={filters.driverId}
          onChange={(e) => onFilterChange('driverId', e.target.value)}
          options={driverOptions}
          placeholder="All Drivers"
        />
        
        <Select
          label="Vehicle"
          value={filters.vehicleId}
          onChange={(e) => onFilterChange('vehicleId', e.target.value)}
          options={vehicleOptions}
          placeholder="All Vehicles"
        />
        
        <Select
          label="Category"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          options={categoryOptions}
          placeholder="All Categories"
        />
        
        <div className="flex items-end">
          <Button
            variant="secondary"
            onClick={onClearFilters}
            className="w-full"
          >
            <ApperIcon name="X" size={16} className="mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default FilterPanel