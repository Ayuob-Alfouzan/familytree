import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { Observable, of } from 'rxjs';
import { FullWarehouseModel } from '../models/warehouse.model';
import { EditWarehouseService } from './edit/edit-warehouse.service';

@Injectable()
export class WarehouseResolver implements Resolve<FullWarehouseModel> {
  constructor(private service: EditWarehouseService, private accountService: AccountService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FullWarehouseModel> {
    if (this.accountService.selectedFarm) {
      const warehouseId: number = route.params.warehouseId;
      return this.service.get(this.accountService.selectedFarm.farmId, warehouseId);
    }

    return of();
  }
}
