import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DashboardModel } from '../models/sheep.model';
import { AccountService } from 'app/core/auth/account.service';
import { SheepFarmService } from '../sheep-farm.service';

@Injectable()
export class DashboardResolver implements Resolve<DashboardModel> {
  constructor(private service: SheepFarmService, private accountService: AccountService) {}

  resolve(): Observable<DashboardModel> {
    if (this.accountService.selectedFarm) {
      return this.service.getDashboard(this.accountService.selectedFarm.farmId);
    }

    return of();
  }
}
