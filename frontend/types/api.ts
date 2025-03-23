export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: 'tenant' | 'landlord';
  user_id: number;
}

export interface RegisterResponse {
  msg: string;
  user_id: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface MaintenanceRequest {
  id: number;
  description: string;
  status: MaintenanceStatus;
  submitted_at: string;
}

export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface TenantDetails {
  email: string;
  due_date: string;
  amount: number;
  property: PropertyDetails;
}

export interface PropertyDetails {
  id: number;
  name: string;
  address: string;
}
