import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

@Injectable({ providedIn: 'root' })
export class ConfigurationRouteAccessService implements CanActivate {
  constructor(private configurationService: ConfigurationService) {}

  canActivate(): Observable<boolean> {
    return this.configurationService.getConfiguration().pipe(map(() => true));
  }
}
