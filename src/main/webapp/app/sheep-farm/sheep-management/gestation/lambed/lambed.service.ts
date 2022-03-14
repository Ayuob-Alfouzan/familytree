import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { GestationModel, LambedGestationModel } from 'app/sheep-farm/models/gestation.model';
import { Observable } from 'rxjs';

@Injectable()
export class LambedGestationService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  lambed(data: LambedGestationModel): Observable<GestationModel> {
    return this.http.post<GestationModel>(this.applicationConfigService.getEndpointFor('api/gestation/lambed'), data);
  }
}
