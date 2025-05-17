export enum EUserRole {
  TEAM_MEMBER = "Team Member",
  TEAM_LEAD = "Team Lead",
  ADMIN = "Admin",
}

export enum EVerificationStatus {
  PENDING = "Pending",
  VERIFIED = "Verified",
  REJECTED = "Rejected",
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
  team?: {
    id: string;
    name: string;
  };
  profileImage?: string;
}

export interface IAuthCredentials {
  email: string;
  password: string;
}

export interface ISignupRequest extends IAuthCredentials {
  name: string;
  role: EUserRole;
  teamId?: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
  message?: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ISignupResponse {
  id: string;
  name: string;
  email: string;
  role: EUserRole | string;
  verificationStatus: EVerificationStatus | string;
  createdAt: string;
  updatedAt: string;
  team?: {
    id: string;
    name: string;
  };
  message?: string;
}
