import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AddSheepModel, SheepCriteria, SheepModel, SimpleSheepModel } from 'app/sheep-familyTree/models/sheep.model';
import { Observable } from 'rxjs';

@Injectable()
export class AddSheepService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  listSimple(farmId: number, type: string[]): Observable<SimpleSheepModel[]> {
    return this.http.post<SimpleSheepModel[]>(
      this.applicationConfigService.getEndpointFor(`api/sheep/list-simple`),
      this.createBody(farmId, type)
    );
  }

  add(data: AddSheepModel): Observable<SheepModel> {
    return this.http.post<SheepModel>(this.applicationConfigService.getEndpointFor('api/sheep/add'), data);
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
