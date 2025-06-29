import driversData from '@/services/mockData/drivers.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class DriversService {
  constructor() {
    this.drivers = [...driversData]
  }

  async getAll() {
    await delay(300)
    return [...this.drivers]
  }

  async getById(id) {
    await delay(200)
    const driver = this.drivers.find(d => d.Id === parseInt(id))
    if (!driver) {
      throw new Error('Driver not found')
    }
    return { ...driver }
  }

  async create(driverData) {
    await delay(400)
    
    const maxId = this.drivers.length > 0 ? Math.max(...this.drivers.map(d => d.Id)) : 0
    const newDriver = {
      Id: maxId + 1,
      ...driverData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    this.drivers.push(newDriver)
    return { ...newDriver }
  }

  async update(id, driverData) {
    await delay(400)
    
    const index = this.drivers.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Driver not found')
    }
    
    const updatedDriver = {
      ...this.drivers[index],
      ...driverData,
      updated_at: new Date().toISOString()
    }
    
    this.drivers[index] = updatedDriver
    return { ...updatedDriver }
  }

  async delete(id) {
    await delay(300)
    
    const index = this.drivers.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Driver not found')
    }
    
    this.drivers.splice(index, 1)
    return true
  }
}

export const driversService = new DriversService()