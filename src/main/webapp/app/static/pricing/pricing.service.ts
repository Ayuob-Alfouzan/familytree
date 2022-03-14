import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { PricingModel } from '../models/pricing.model';

@Injectable({ providedIn: 'root' })
export class PricingService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  listPackages(): Observable<PricingModel[]> {
    return this.http.get<PricingModel[]>(this.applicationConfigService.getEndpointFor('api/package/list/PIGEON'));
  }
}
