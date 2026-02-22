
export interface Vehicle {
  make: string;
  model: string;
  year: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number | [number, number]; // Fixed price or a range
}

export interface ServiceRequest {
  vehicle: Vehicle;
  service: Service;
  problemDescription?: string;
  damagePhoto?: string;
}

export interface Mechanic {
  name: string;
  rating: number;
  vehicle: string;
  licensePlate: string;
}

export interface Job {
  id: string;
  request: ServiceRequest;
  mechanic: Mechanic;
  status: 'En Route' | 'In Progress' | 'Completed';
  etaMinutes: number;
}
