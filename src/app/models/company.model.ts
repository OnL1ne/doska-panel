export interface Company {
  id: number,
  name: string,
  license_start: string,
  license_id: number,
  expiration_date?: number,
  created_at?: number,
  updated_at?: number,
  license: License
}
export interface License {
  id: number,
  title: string,
  description?: string,
  validity: string,
}
