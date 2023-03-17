export interface User {
  id: number,
  name: string,
  email?: string,
  role_id: number,
  group_id: number,
  company_id: number,
  created_at?: string,
  updated_at?: string,
  company?: {
    id: number,
    name: string,
  },
  role?: {
    id: number,
    name: string,
  },
  detail?: Detail

}

export interface Detail {
  first_name?: string,
  last_name?: string,
  title?: string
}

export interface Role {
  id: number,
  name: string,
}

export interface AuditEvent {
  id: number,
  title: string,
  description: string,
  created_at: string,
  user: User,
}

export interface SuccessResult {
  success: string;
}
