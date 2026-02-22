export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
}

export interface ServiceProvider {
  id: string;
  type: 'MECHANIC' | 'WORKSHOP' | 'TOWING' | 'INSURANCE';
  status: string;
  bio?: string;
  rating: number;
  trustScore: number;
  completedJobs: number;
  commune?: string;
  region?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  specialties?: string;
  distance?: number;
  etaMinutes?: number;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  type: 'MECHANIC' | 'TOWING' | 'INSURANCE' | 'EMERGENCY';
}

export interface Job {
  id: string;
  status: 'EN_ROUTE' | 'IN_PROGRESS' | 'COMPLETED';
  etaMinutes?: number;
  estimatedCost?: number;
  rating?: number;
  review?: string;
  createdAt?: string;
  provider: ServiceProvider;
  request: {
    service: Service;
    vehicle: Vehicle;
    problemDescription?: string;
  };
}

export interface Quote {
  id: string;
  preliminaryDiagnosis?: string;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  estimatedDuration: number;
  status: 'SENT' | 'ACCEPTED' | 'REJECTED';
  provider: ServiceProvider;
}

export interface Conversation {
  id: string;
  jobId?: string;
  provider: ServiceProvider;
  lastMessageAt: string;
  messages: Message[];
}

export interface Message {
  id: string;
  senderId: string;
  senderType: 'CUSTOMER' | 'PROVIDER';
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  type: 'JOB_STATUS' | 'QUOTE' | 'MESSAGE' | 'SYSTEM' | 'EMERGENCY' | 'PROMOTION';
  title: string;
  message: string;
  body?: string;
  read: boolean;
  createdAt: string;
}
