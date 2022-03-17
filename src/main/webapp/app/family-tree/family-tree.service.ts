import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { TreeResponseModel } from './models/family-tree.model';

@Injectable()
export class FamilyTreeService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  get(id: number): Observable<TreeResponseModel> {
    return this.http.get<TreeResponseModel>(this.applicationConfigService.getEndpointFor(`api/tree/get-family/${id}`));
  }
}
