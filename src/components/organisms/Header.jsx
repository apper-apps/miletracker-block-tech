import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
const Header = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value)
  }

  const languageOptions = [
    { value: 'nl', label: t('language.dutch') },
    { value: 'en', label: t('language.english') }
  ]
  return (
    <motion.header 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden mr-3 p-2"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <div className="flex items-center space-x-3">
<div className="bg-gradient-to-br from-primary-600 to-accent-500 p-2.5 rounded-xl shadow-soft">
              <ApperIcon name="Car" className="text-white" size={24} />
            </div>
<div>
              <h1 className="text-xl font-bold text-primary-700">{t('app.title')}</h1>
              <p className="text-sm text-gray-500">{t('app.subtitle')}</p>
            </div>
            </div>
          </div>

<div className="flex items-center space-x-4">
            <div className="w-32">
              <Select
                value={i18n.language}
                onChange={handleLanguageChange}
                options={languageOptions}
                className="text-sm"
              />
            </div>
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              <ApperIcon name="Calendar" size={16} className="mr-1" />
              {new Date().toLocaleDateString(i18n.language === 'nl' ? 'nl-NL' : 'en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header