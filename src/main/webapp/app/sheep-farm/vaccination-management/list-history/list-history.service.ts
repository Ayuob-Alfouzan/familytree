import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import {
  AddSheepVaccinationHistoryModel,
  DeleteSheepVaccinationHistoryModel,
  SheepVaccinationModel,
} from 'app/sheep-farm/models/vaccination.model';
import { Observable } from 'rxjs';

@Injectable()
export class ListSheepVaccinationHistoryService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  add(data: AddSheepVaccinationHistoryModel): Observable<SheepVaccinationModel> {
    return this.http.post<SheepVaccinationModel>(
      this.applicationConfigService.getEndpointFor(`api/sheep-vaccination/add-given-dose`),
      data
    );
  }

  delete(data: DeleteSheepVaccinationHistoryModel): Observable<SheepVaccinationModel> {
    return this.http.post<SheepVaccinationModel>(
      this.applicationConfigService.getEndpointFor(`api/sheep-vaccination/delete-given-dose`),
      data
    );
  }
}
