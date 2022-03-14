export interface ForgotPasswordRequestModel {
  email: string;
  captchaResponse: string;
}

export interface ResetPasswordRequestModel {
  email: string;
  password: string;
  otp: string;
}

export interface ResetPasswordResponseModel {
  id_token: string;
}
