import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ConfirmCopulationModel, CopulationModel } from 'app/sheep-farm/models/copulation.model';
import { Observable } from 'rxjs';

@Injectable()
export class ConfirmedCopulationService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  confirmed(data: ConfirmCopulationModel): Observable<CopulationModel> {
    return this.http.post<CopulationModel>(this.applicationConfigService.getEndpointFor(`api/copulation/confirm`), data);
  }
}
