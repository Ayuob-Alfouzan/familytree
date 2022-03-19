import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { PersonModel, UpdatePersonModel } from '../models/family-tree.model';

@Injectable()
export class UpdatePersonService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  update(data: UpdatePersonModel): Observable<PersonModel> {
    return this.http.post<PersonModel>(this.applicationConfigService.getEndpointFor('api/tree/update-person'), data);
  }
}
