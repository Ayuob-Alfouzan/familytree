import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { FamilyTreeModel } from './models/family-tree.model';

@Injectable()
export class FamilyTreeManagementService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  get(id: number): Observable<FamilyTreeModel> {
    return this.http.get<FamilyTreeModel>(this.applicationConfigService.getEndpointFor(`api/family-tree/get/${id}`));
  }
}
