import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SheepTreatmentModel } from 'app/sheep-familyTree/models/treatment.model';
import { Observable } from 'rxjs';
import { ViewSheepTreatmentService } from './view.service';

@Injectable()
export class ViewSheepTreatmentResolver implements Resolve<SheepTreatmentModel> {
  constructor(private viewService: ViewSheepTreatmentService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SheepTreatmentModel> {
    const sheepTreatmentId = +route.params['sheepTreatmentId'];

    return this.viewService.get(sheepTreatmentId);
  }
}
