import {
  IAuthCredentials,
  IAuthResponse,
  ISignupRequest,
  ISignupResponse,
} from "@/domain/models/auth";

export interface IAuthRepository {
  login: (credentials: IAuthCredentials) => Promise<IAuthResponse | null>;
  signup: (signupData: ISignupRequest) => Promise<ISignupResponse | null>;
}
