import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ListCopulationService } from './list/list.service';
import { CopulationModel } from 'app/sheep-familyTree/models/copulation.model';

@Injectable()
export class ViewCopulationResolver implements Resolve<CopulationModel> {
  constructor(private service: ListCopulationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CopulationModel> {
    const copulationId = +route.params['copulationId'];

    if (copulationId) {
      return this.service.get(copulationId);
    }

    return of();
  }
}
