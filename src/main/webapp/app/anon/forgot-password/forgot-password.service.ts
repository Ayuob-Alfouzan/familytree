import { Injectable } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ForgotPasswordRequestModel, ResetPasswordRequestModel, ResetPasswordResponseModel } from '../models/forgot-password.model';
import { Account } from 'app/core/auth/account.model';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider
  ) {}

  forgotPassword(data: ForgotPasswordRequestModel): Observable<any> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/account/forgot-password/send-otp'), data);
  }

  resetPassword(data: ResetPasswordRequestModel): Observable<Account | null> {
    return this.http
      .post<ResetPasswordResponseModel>(this.applicationConfigService.getEndpointFor('api/account/forgot-password/reset-password'), data)
      .pipe(map(response => this.authServerProvider.authenticateSuccess(response, true)))
      .pipe(mergeMap(() => this.accountService.identity(true)));
  }
}
