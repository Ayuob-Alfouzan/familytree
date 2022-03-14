export interface RegisterRequestModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  language: string;
  captchaResponse: string;
}

export interface ActivationRequestModel {
  email: string;
  otp: string;
}

export interface ActivationResponseModel {
  id_token: string;
}

export interface ResendRequestModel {
  email: string;
}
