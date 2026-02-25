import { Vehicle, ServiceRequest, Job } from './job';
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}
export interface UserProfile extends User {
    vehicles: Vehicle[];
    serviceRequests: (ServiceRequest & {
        id: string;
        createdAt: string;
        status: string;
        job?: Job;
    })[];
}
//# sourceMappingURL=user.d.ts.map