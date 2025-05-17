export enum EUserRole {
  TECH_LEAD = "TECH_LEAD",
  TEAM_MEMBER = "TEAM_MEMBER",
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: EUserRole;
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
