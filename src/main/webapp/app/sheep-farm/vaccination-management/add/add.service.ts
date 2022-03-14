import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AddSheepVaccinationModel, SheepVaccinationModel } from 'app/sheep-farm/models/vaccination.model';
import { Observable } from 'rxjs';

@Injectable()
export class AddSheepVaccinationService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  add(data: AddSheepVaccinationModel): Observable<SheepVaccinationModel> {
    return this.http.post<SheepVaccinationModel>(this.applicationConfigService.getEndpointFor('api/sheep-vaccination/add'), data);
  }
}
