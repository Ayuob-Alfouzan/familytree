import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { UpdateAccountRequestModel } from '../models/profile.model';

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  changePassword(password: string): Observable<void> {
    return this.http.post<void>(this.applicationConfigService.getEndpointFor(`api/account/change-password`), { password });
  }

  updateAccount(data: UpdateAccountRequestModel): Observable<Account> {
    return this.http.post<Account>(this.applicationConfigService.getEndpointFor(`api/account/update-account`), data);
  }
}
