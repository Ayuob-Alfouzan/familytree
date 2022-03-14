import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { EditFarmModel, FarmModel } from '../models/farm.model';

@Injectable()
export class EditFarmService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  edit(data: EditFarmModel): Observable<FarmModel> {
    return this.http.post<FarmModel>(this.applicationConfigService.getEndpointFor('api/farm/edit'), data);
  }
}
