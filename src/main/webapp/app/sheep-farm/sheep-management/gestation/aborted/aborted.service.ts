import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbortedGestationModel, GestationModel } from 'app/sheep-familyTree/models/gestation.model';
import { Observable } from 'rxjs';

@Injectable()
export class AbortedGestationService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  aborted(data: AbortedGestationModel): Observable<GestationModel> {
    return this.http.post<GestationModel>(this.applicationConfigService.getEndpointFor('api/gestation/aborted'), data);
  }
}
