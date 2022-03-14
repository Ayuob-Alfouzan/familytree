import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ListGestationService } from './list/list.service';
import { GestationModel } from 'app/sheep-farm/models/gestation.model';

@Injectable()
export class ViewGestationResolver implements Resolve<GestationModel> {
  constructor(private service: ListGestationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<GestationModel> {
    const gestationId = +route.params['gestationId'];

    if (gestationId) {
      return this.service.get(gestationId);
    }

    return of();
  }
}
