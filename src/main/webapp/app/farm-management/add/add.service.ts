import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { AddFarmModel, FarmModel } from '../models/farm.model';

@Injectable()
export class AddFarmService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  add(data: AddFarmModel): Observable<FarmModel> {
    return this.http.post<FarmModel>(this.applicationConfigService.getEndpointFor('api/farm/add'), data);
  }
}
