import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FarmModel } from '../farm-management/models/farm.model';
import { AccountService } from 'app/core/auth/account.service';
import { SheepFarmService } from './sheep-farm.service';

@Injectable()
export class FarmResolver implements Resolve<FarmModel> {
  constructor(private service: SheepFarmService, private accountService: AccountService) {}

  resolve(): Observable<FarmModel> {
    if (this.accountService.selectedFarm) {
      return this.service.get(this.accountService.selectedFarm.farmId);
    }

    return of();
  }
}
