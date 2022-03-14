import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { SheepVaccinationModel, UpdateSheepVaccinationModel } from 'app/sheep-farm/models/vaccination.model';
import { Observable } from 'rxjs';

@Injectable()
export class UpdateSheepVaccinationService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  add(data: UpdateSheepVaccinationModel): Observable<SheepVaccinationModel> {
    return this.http.post<SheepVaccinationModel>(this.applicationConfigService.getEndpointFor('api/sheep-vaccination/update'), data);
  }
}
