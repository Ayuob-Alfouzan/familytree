import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { SheepCriteria, SheepModel, SimpleSheepModel, UpdateSheepModel } from 'app/sheep-farm/models/sheep.model';
import { Observable } from 'rxjs';

@Injectable()
export class UpdateSheepService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  update(data: UpdateSheepModel): Observable<SheepModel> {
    return this.http.post<SheepModel>(this.applicationConfigService.getEndpointFor('api/sheep/update'), data);
  }

  listSimple(farmId: number, type: string[]): Observable<SimpleSheepModel[]> {
    return this.http.post<SimpleSheepModel[]>(
      this.applicationConfigService.getEndpointFor(`api/sheep/list-simple`),
      this.createBody(farmId, type)
    );
  }

  private createBody(farmId: number, type: string[]): SheepCriteria {
    const body: SheepCriteria = {
      farmId: {
        equals: farmId,
      },
      typeCode: {
        in: type,
      },
    };

    return body;
  }
}
