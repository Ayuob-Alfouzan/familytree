import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { WarehouseDashboardModel } from '../models/warehouse.model';
import { AccountService } from 'app/core/auth/account.service';
import { ListWarehouseService } from './list/list.service';

@Injectable()
export class WarehouseDashboardResolver implements Resolve<WarehouseDashboardModel> {
  constructor(private service: ListWarehouseService, private accountService: AccountService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<WarehouseDashboardModel> {
    const warehouseId = route.params['warehouseId'];

    if (this.accountService.selectedFarm && warehouseId) {
      return this.service.getDashboard({
        farmId: this.accountService.selectedFarm.farmId,
        warehouseId: +warehouseId,
      });
    }

    return of();
  }
}
