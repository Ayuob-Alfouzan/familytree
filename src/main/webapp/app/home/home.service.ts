import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { FamilyTreeDashboardModel } from './home.model';

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getFamilyTreeDashboard(): Observable<FamilyTreeDashboardModel> {
    return this.http.get<FamilyTreeDashboardModel>(this.applicationConfigService.getEndpointFor(`api/family-tree/global-dashboard`));
  }
}
