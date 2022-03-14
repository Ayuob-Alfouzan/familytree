import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { FarmDashboardModel } from './home.model';

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getFarmDashboard(): Observable<FarmDashboardModel> {
    return this.http.get<FarmDashboardModel>(this.applicationConfigService.getEndpointFor(`api/familyTree/global-dashboard`));
  }
}
