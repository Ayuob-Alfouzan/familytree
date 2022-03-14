import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AddGestationModel, GestationModel } from 'app/sheep-farm/models/gestation.model';
import { SheepCriteria, SimpleSheepModel } from 'app/sheep-farm/models/sheep.model';
import { Observable } from 'rxjs';

@Injectable()
export class AddGestationService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  listSimple(farmId: number, type: string[]): Observable<SimpleSheepModel[]> {
    return this.http.post<SimpleSheepModel[]>(
      this.applicationConfigService.getEndpointFor(`api/sheep/list-simple`),
      this.createBody(farmId, type)
    );
  }

  add(data: AddGestationModel): Observable<GestationModel> {
    return this.http.post<GestationModel>(this.applicationConfigService.getEndpointFor('api/gestation/add'), data);
  }

  private createBody(farmId: number, type: string[]): SheepCriteria {
    const body: SheepCriteria = {
      farmId: {
        equals: farmId,
      },
      typeCode: {
        in: type,
      },
      statusCode: {
        in: ['HALE', 'SICK'],
      },
    };

    return body;
  }
}
