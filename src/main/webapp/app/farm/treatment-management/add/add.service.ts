import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { AddTreatmentModel, TreatmentModel } from '../../models/treatment.model';

@Injectable()
export class AddTreatmentService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  add(data: AddTreatmentModel): Observable<TreatmentModel> {
    return this.http.post<TreatmentModel>(this.applicationConfigService.getEndpointFor('api/treatment/add'), data);
  }
}
