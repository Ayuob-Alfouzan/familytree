import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { EditFamilyTreeModel, FamilyTreeModel } from '../models/familyTree.model';

@Injectable()
export class EditFamilyTreeService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  edit(data: EditFamilyTreeModel): Observable<FamilyTreeModel> {
    return this.http.post<FamilyTreeModel>(this.applicationConfigService.getEndpointFor('api/familyTree/edit'), data);
  }
}
