import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { DashboardModel, FarmModel } from '../farm-management/models/farm.model';

@Injectable()
export class FarmService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  get(id: number): Observable<FarmModel> {
    return this.http.get<FarmModel>(this.applicationConfigService.getEndpointFor(`api/farm/get/${id}`));
  }

  getDashboard(id: number): Observable<DashboardModel> {
    return this.http.get<DashboardModel>(this.applicationConfigService.getEndpointFor(`api/farm/dashboard/${id}`));
  }
}
