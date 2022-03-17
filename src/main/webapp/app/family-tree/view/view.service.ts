import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';

@Injectable()
export class ViewFamilyTreeService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  get(): Observable<void> {
    return this.http.post<void>(this.applicationConfigService.getEndpointFor(`api/tree/adda-person`), null);
  }
}
