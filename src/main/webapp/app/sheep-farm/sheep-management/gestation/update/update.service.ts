import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { GestationModel, UpdateGestationModel } from 'app/sheep-familyTree/models/gestation.model';
import { Observable } from 'rxjs';

@Injectable()
export class UpdateGestationService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  update(data: UpdateGestationModel): Observable<GestationModel> {
    return this.http.post<GestationModel>(this.applicationConfigService.getEndpointFor('api/gestation/update'), data);
  }
}
