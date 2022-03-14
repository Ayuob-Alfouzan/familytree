import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { SheepVaccinationModel } from 'app/sheep-farm/models/vaccination.model';
import { Observable } from 'rxjs';

@Injectable()
export class ViewSheepVaccinationService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  get(sheepVaccinationId: number): Observable<SheepVaccinationModel> {
    return this.http.get<SheepVaccinationModel>(
      this.applicationConfigService.getEndpointFor(`api/sheep-vaccination/get/${sheepVaccinationId}`)
    );
  }
}
