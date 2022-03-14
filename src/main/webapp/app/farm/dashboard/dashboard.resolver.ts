import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DashboardModel } from '../../farm-management/models/farm.model';
import { AccountService } from 'app/core/auth/account.service';
import { FarmService } from '../farm.service';

@Injectable()
export class DashboardResolver implements Resolve<DashboardModel> {
  constructor(private service: FarmService, private accountService: AccountService) {}

  resolve(): Observable<DashboardModel> {
    if (this.accountService.selectedFarm) {
      return this.service.getDashboard(this.accountService.selectedFarm.farmId);
    }

    return of();
  }
}
