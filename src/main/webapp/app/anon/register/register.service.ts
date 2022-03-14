import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivationRequestModel, RegisterRequestModel, ActivationResponseModel, ResendRequestModel } from '../models/registration.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { map, mergeMap } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider
  ) {}

  register(data: RegisterRequestModel): Observable<any> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/registration/register'), data);
  }

  resendActivationOtp(data: ResendRequestModel): Observable<any> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/registration/resend-activation-otp'), data);
  }

  activateAccount(data: ActivationRequestModel): Observable<any> {
    return this.http
      .post<ActivationResponseModel>(this.applicationConfigService.getEndpointFor('api/registration/verify-activation-otp'), data)
      .pipe(map(response => this.authServerProvider.authenticateSuccess(response, true)))
      .pipe(mergeMap(() => this.accountService.identity(true)));
  }
}
