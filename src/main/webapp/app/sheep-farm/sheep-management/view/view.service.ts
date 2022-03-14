import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { SheepModel, SheepStatusModel } from 'app/sheep-farm/models/sheep.model';
import { Observable } from 'rxjs';

@Injectable()
export class ViewSheepService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  get(sheepId: number): Observable<SheepModel> {
    return this.http.get<SheepModel>(this.applicationConfigService.getEndpointFor(`api/sheep/get/${sheepId}`));
  }

  getStatus(sheepId: number): Observable<SheepStatusModel> {
    return this.http.get<SheepStatusModel>(this.applicationConfigService.getEndpointFor(`api/sheep/get-status/${sheepId}`));
  }
}
