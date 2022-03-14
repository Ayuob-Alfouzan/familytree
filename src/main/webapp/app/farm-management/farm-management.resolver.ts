import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FarmModel } from './models/farm.model';
import { AccountService } from 'app/core/auth/account.service';
import { FarmManagementService } from './farm-management.service';

@Injectable()
export class FarmResolver implements Resolve<FarmModel> {
  constructor(private service: FarmManagementService, private accountService: AccountService) {}

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
