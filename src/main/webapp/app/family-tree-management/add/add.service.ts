import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { AddFamilyTreeModel, FamilyTreeModel } from '../models/familyTree.model';

@Injectable()
export class AddFamilyTreeService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  add(data: AddFamilyTreeModel): Observable<FamilyTreeModel> {
    return this.http.post<FamilyTreeModel>(this.applicationConfigService.getEndpointFor('api/familyTree/add'), data);
  }
}
