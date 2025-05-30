export interface HospitalDto {
  name: string;
  location: string;
  photo?: string;
}

export interface JwtUser {
  id: string;
  name: string;
  email: string;
}
