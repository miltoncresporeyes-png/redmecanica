
import React, { useState, useEffect } from 'react';
import { Job } from '../../types';
import { getJobStatus, advanceJobStatus } from '../../services/api';
import Card from '../../components/common/Card';

interface JobTrackingProps {
  job: Job;
  onComplete: () => void;
}

const JobTracking: React.FC<JobTrackingProps> = ({ job: initialJob, onComplete }) => {
  const [job, setJob] = useState<Job>(initialJob);
  const [eta, setEta] = useState(initialJob.etaMinutes);

  useEffect(() => {
    // Poll for updates every 3 seconds
    const interval = setInterval(async () => {
        try {
            // Optimistic UI updates handled by backend now
            const updatedJob = await getJobStatus(job.id);
            setJob(updatedJob);
            if (updatedJob.etaMinutes !== undefined) {
                setEta(updatedJob.etaMinutes);
            }
            
            if (updatedJob.status === 'Completed') {
                clearInterval(interval);
                setTimeout(onComplete, 3000);
            }
        } catch (error) {
            console.error("Error polling job status:", error);
        }
    }, 3000);

    return () => clearInterval(interval);
  }, [job.id, onComplete]);

  // Local effect for countdown just for visual smoothness between polls
  useEffect(() => {
      if (job.status === 'En Route' && eta > 0) {
          const timer = setInterval(() => setEta(prev => Math.max(0, prev - 1)), 60000);
          return () => clearInterval(timer);
      }
  }, [job.status, eta]);

  const handleSimulateAdvance = async () => {
      try {
          const updated = await advanceJobStatus(job.id);
          setJob(updated);
      } catch (e) {
          console.error("Failed to advance job:", e);
      }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Seguimiento de tu Servicio</h2>
        
        {/* Placeholder for Map */}
        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
           <div className="absolute inset-0 bg-gray-300 opacity-50"></div>
           <div className="text-center z-10">
            <svg className="w-16 h-16 text-gray-500 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10v-5m6 5v-5m0 0l-6-3m6 3l6-3"></path></svg>
            <p className="text-gray-600 mt-2 font-semibold">Rastreando ubicación en tiempo real...</p>
           </div>
        </div>

        <div className="text-center mb-6">
            <p className="text-lg font-semibold text-gray-800 transition-all duration-500">
                {job.status === 'En Route' && `Tu mecánico llegará en aproximadamente ${eta} minutos.`}
                {job.status === 'In Progress' && `El servicio para tu ${job.request.vehicle.model} está en progreso.`}
                {job.status === 'Completed' && `¡Servicio completado! Gracias por usar RedMecánica.`}
            </p>
            <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    job.status === 'En Route' ? 'bg-yellow-100 text-yellow-800' :
                    job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {job.status === 'En Route' ? 'En Camino' : 
                     job.status === 'In Progress' ? 'En Progreso' : 'Finalizado'}
                </span>
            </div>
        </div>

        <div className="p-4 border rounded-lg bg-white shadow-sm flex items-center space-x-4 mb-6">
          <img src={`https://ui-avatars.com/api/?name=${job.mechanic?.name || 'Mecanico'}&background=0D8ABC&color=fff`} alt={job.mechanic?.name} className="w-16 h-16 rounded-full" />
          <div className="flex-grow">
            <p className="font-bold text-lg">{job.mechanic?.name || 'Mecánico Asignado'}</p>
            <p className="text-sm text-gray-600">{job.mechanic?.vehicle} • {job.mechanic?.licensePlate}</p>
          </div>
          <div className="flex flex-col items-center bg-yellow-50 px-3 py-2 rounded-lg">
            <span className="text-yellow-500 text-xl">★</span>
            <span className="font-bold text-gray-800">{job.mechanic?.rating || '5.0'}</span>
          </div>
        </div>
        
        {/* Simulation Controls for Demo */}
        <div className="mt-8 pt-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400 mb-2 uppercase tracking-wide">Controles de Simulación (Demo)</p>
            <div className="flex justify-center space-x-4">
                {job.status !== 'Completed' && (
                    <button 
                        onClick={handleSimulateAdvance}
                        className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition"
                    >
                        {job.status === 'En Route' ? 'Simular Llegada' : 'Simular Término'}
                    </button>
                )}
            </div>
        </div>
      </div>
    </Card>
  );
};

export default JobTracking;
