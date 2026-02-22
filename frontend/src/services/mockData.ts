
import { Service, Vehicle } from '../types';

export const carMakes: { make: string; models: string[] }[] = [
  { make: 'Chevrolet', models: ['Sail', 'Onix', 'Groove'] },
  { make: 'Suzuki', models: ['Swift', 'Baleno', 'S-Presso'] },
  { make: 'Toyota', models: ['Yaris', 'Hilux', 'RAV4'] },
  { make: 'Nissan', models: ['Versa', 'Kicks', 'Qashqai'] },
  { make: 'Hyundai', models: ['Accent', 'Tucson', 'Creta'] },
  { make: 'Kia', models: ['Rio', 'Morning', 'Seltos'] },
  { make: 'Peugeot', models: ['208', '2008', '3008'] },
  { make: 'MG', models: ['ZS', 'MG3'] },
];

export const vehicleYears: number[] = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

export const availableServices: Service[] = [
  { id: 'aceite', name: 'Cambio de Aceite', description: 'Cambio de aceite y filtro de motor.', price: 45000 },
  { id: 'frenos', name: 'Cambio de Pastillas de Freno', description: 'Reemplazo de pastillas de freno delanteras.', price: [60000, 85000] },
  { id: 'bateria', name: 'Reemplazo de Batería', description: 'Instalación de una nueva batería.', price: 75000 },
  { id: 'balanceo', name: 'Rotación y Balanceo de Neumáticos', description: 'Rotación de neumáticos y balanceo.', price: 35000 },
  { id: 'motor', name: 'Reparación de Motor', description: 'Diagnóstico y reparación completa de motor.', price: 450000 },
  { id: 'revision_general', name: 'Revisión General', description: 'Inspección de diagnóstico básico.', price: 25000 },
];
