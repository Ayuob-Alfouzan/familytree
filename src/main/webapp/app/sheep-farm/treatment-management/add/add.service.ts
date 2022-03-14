import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { SheepCriteria, SimpleSheepModel } from 'app/sheep-familyTree/models/sheep.model';
import { AddSheepTreatmentModel, SheepTreatmentModel } from 'app/sheep-familyTree/models/treatment.model';
import { Observable } from 'rxjs';

@Injectable()
export class AddSheepTreatmentService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  add(data: AddSheepTreatmentModel): Observable<SheepTreatmentModel> {
    return this.http.post<SheepTreatmentModel>(this.applicationConfigService.getEndpointFor('api/sheep-treatment/add'), data);
  }

  listSimple(farmId: number): Observable<SimpleSheepModel[]> {
    return this.http.post<SimpleSheepModel[]>(
      this.applicationConfigService.getEndpointFor(`api/sheep/list-simple`),
      this.createBody(farmId)
    );
  }

  private createBody(farmId: number): SheepCriteria {
    const body: SheepCriteria = {
      farmId: {
        equals: farmId,
      },
      statusCode: {
        in: ['HALE', 'SICK'],
      },
    };

    return body;
  }
}
