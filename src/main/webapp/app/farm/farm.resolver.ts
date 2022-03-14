import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FarmModel } from '../farm-management/models/farm.model';
import { AccountService } from 'app/core/auth/account.service';
import { FarmService } from './farm.service';
@Injectable()
export class FarmResolver implements Resolve<FarmModel> {
  constructor(private service: FarmService, private accountService: AccountService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FarmModel> {
    if (route.params.id) {
      return this.service.get(route.params.id);
    }

    if (this.accountService.selectedFarm) {
      return this.service.get(this.accountService.selectedFarm.farmId);
    }

    return of();
  }
}
