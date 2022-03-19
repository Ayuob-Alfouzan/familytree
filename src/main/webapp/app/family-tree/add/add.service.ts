import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { AddChildModel, AddFatherModel, PersonModel } from '../models/family-tree.model';

@Injectable()
export class AddPersonService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  addChild(data: AddChildModel): Observable<PersonModel> {
    return this.http.post<PersonModel>(this.applicationConfigService.getEndpointFor('api/tree/add-child'), data);
  }

  addFather(data: AddFatherModel): Observable<PersonModel> {
    return this.http.post<PersonModel>(this.applicationConfigService.getEndpointFor('api/tree/add-father'), data);
  }
}
