import {
  IAuthCredentials,
  IAuthResponse,
  ISignupRequest,
} from "@/domain/models/auth";

export interface IAuthRepository {
  login: (credentials: IAuthCredentials) => Promise<IAuthResponse>;
  signup: (signupData: ISignupRequest) => Promise<IAuthResponse>;
}
