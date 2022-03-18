import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { AddPersonModel, PersonModel } from '../models/family-tree.model';

@Injectable()
export class AddPersonService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  add(data: AddPersonModel): Observable<PersonModel> {
    return this.http.post<PersonModel>(this.applicationConfigService.getEndpointFor('api/tree/add-person'), data);
  }
}
