import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { SheepTreatmentModel } from 'app/sheep-familyTree/models/treatment.model';
import { Observable } from 'rxjs';

@Injectable()
export class ViewSheepTreatmentService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  get(sheepTreatmentId: number): Observable<SheepTreatmentModel> {
    return this.http.get<SheepTreatmentModel>(this.applicationConfigService.getEndpointFor(`api/sheep-treatment/get/${sheepTreatmentId}`));
  }
}
