import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ViewSheepVaccinationService } from './view.service';
import { SheepVaccinationModel } from 'app/sheep-familyTree/models/vaccination.model';

@Injectable()
export class ViewSheepVaccinationResolver implements Resolve<SheepVaccinationModel> {
  constructor(private viewService: ViewSheepVaccinationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SheepVaccinationModel> {
    const sheepVaccinationId = +route.params['sheepVaccinationId'];

    return this.viewService.get(sheepVaccinationId);
  }
}
