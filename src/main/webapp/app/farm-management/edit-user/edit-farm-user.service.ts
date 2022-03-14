import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { AddUserModel, RemoveUserModel, FarmModel, SuitableUserModel, FindSuitableUserModel } from '../models/farm.model';

@Injectable()
export class EditFarmUserService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  addUser(data: AddUserModel): Observable<FarmModel> {
    return this.http.post<FarmModel>(this.applicationConfigService.getEndpointFor('api/farm/add-user'), data);
  }

  removeUser(data: RemoveUserModel): Observable<FarmModel> {
    return this.http.post<FarmModel>(this.applicationConfigService.getEndpointFor('api/farm/remove-user'), data);
  }

  getSuitableUsers(data: FindSuitableUserModel): Observable<SuitableUserModel[]> {
    return this.http.post<SuitableUserModel[]>(this.applicationConfigService.getEndpointFor('api/user/find-suitable'), data);
  }
}
