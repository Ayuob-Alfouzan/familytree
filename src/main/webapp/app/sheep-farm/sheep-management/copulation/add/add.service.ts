import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AddCopulationModel, CopulationModel } from 'app/sheep-farm/models/copulation.model';
import { SheepCriteria, SimpleSheepModel } from 'app/sheep-farm/models/sheep.model';
import { Observable } from 'rxjs';

@Injectable()
export class AddCopulationService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  listSimple(farmId: number, type: string[]): Observable<SimpleSheepModel[]> {
    return this.http.post<SimpleSheepModel[]>(
      this.applicationConfigService.getEndpointFor(`api/sheep/list-simple`),
      this.createBody(farmId, type)
    );
  }

  add(data: AddCopulationModel): Observable<CopulationModel> {
    return this.http.post<CopulationModel>(this.applicationConfigService.getEndpointFor('api/copulation/add'), data);
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
