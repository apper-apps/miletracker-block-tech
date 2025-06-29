import tripsData from '@/services/mockData/trips.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TripsService {
  constructor() {
    this.trips = [...tripsData]
  }

  async getAll() {
    await delay(400)
    return [...this.trips]
  }

  async getById(id) {
    await delay(200)
    const trip = this.trips.find(t => t.Id === parseInt(id))
    if (!trip) {
      throw new Error('Trip not found')
    }
    return { ...trip }
  }

  async create(tripData) {
    await delay(500)
    
    const maxId = this.trips.length > 0 ? Math.max(...this.trips.map(t => t.Id)) : 0
    const newTrip = {
      Id: maxId + 1,
      ...tripData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    this.trips.push(newTrip)
    return { ...newTrip }
  }

  async update(id, tripData) {
    await delay(500)
    
    const index = this.trips.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Trip not found')
    }
    
    const updatedTrip = {
      ...this.trips[index],
      ...tripData,
      updated_at: new Date().toISOString()
    }
    
    this.trips[index] = updatedTrip
    return { ...updatedTrip }
  }

  async delete(id) {
    await delay(300)
    
    const index = this.trips.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Trip not found')
    }
    
    this.trips.splice(index, 1)
    return true
  }
}

export const tripsService = new TripsService()