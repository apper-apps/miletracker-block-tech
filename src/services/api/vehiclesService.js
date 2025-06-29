import vehiclesData from '@/services/mockData/vehicles.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class VehiclesService {
  constructor() {
    this.vehicles = [...vehiclesData]
  }

  async getAll() {
    await delay(300)
    return [...this.vehicles]
  }

  async getById(id) {
    await delay(200)
    const vehicle = this.vehicles.find(v => v.Id === parseInt(id))
    if (!vehicle) {
      throw new Error('Vehicle not found')
    }
    return { ...vehicle }
  }

  async create(vehicleData) {
    await delay(400)
    
    const maxId = this.vehicles.length > 0 ? Math.max(...this.vehicles.map(v => v.Id)) : 0
    const newVehicle = {
      Id: maxId + 1,
      ...vehicleData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    this.vehicles.push(newVehicle)
    return { ...newVehicle }
  }

  async update(id, vehicleData) {
    await delay(400)
    
    const index = this.vehicles.findIndex(v => v.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Vehicle not found')
    }
    
    const updatedVehicle = {
      ...this.vehicles[index],
      ...vehicleData,
      updated_at: new Date().toISOString()
    }
    
    this.vehicles[index] = updatedVehicle
    return { ...updatedVehicle }
  }

  async delete(id) {
    await delay(300)
    
    const index = this.vehicles.findIndex(v => v.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Vehicle not found')
    }
    
    this.vehicles.splice(index, 1)
    return true
  }
}

export const vehiclesService = new VehiclesService()