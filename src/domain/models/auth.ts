export enum EUserRole {
  TECH_LEAD = "TECH_LEAD",
  TEAM_MEMBER = "TEAM_MEMBER",
}

export enum EVerificationStatus {
  VERIFIED = "VERIFIED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: EUserRole | string;
  department?: string;
  verificationStatus?: EVerificationStatus | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthCredentials {
  email: string;
  password: string;
}

export interface ISignupRequest extends IAuthCredentials {
  name: string;
  role: EUserRole;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
