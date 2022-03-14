import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigurationModel } from './configuration.model';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private configuration?: ConfigurationModel;

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}
  
  setConfiguration(configuration: ConfigurationModel): void {
    this.configuration = configuration;
  }

  getConfiguration(): Observable<ConfigurationModel> {
    if (this.configuration) {
      return of(this.configuration);
    }
    
    return this.getConfigurationFromServer();
  }

  private getConfigurationFromServer(): Observable<ConfigurationModel> {
    return this.http.get<ConfigurationModel>(this.applicationConfigService.getEndpointFor('api/configuration'))
      .pipe(map(response => { 
        this.setConfiguration(response);
        return response;
      }));
  }
}
