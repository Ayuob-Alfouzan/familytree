import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';
import { SheepModel } from 'app/sheep-farm/models/sheep.model';
import { ListSheepService } from '../list/list.service';
import { ViewSheepService } from './view.service';

@Injectable()
export class ViewSheepResolver implements Resolve<SheepModel> {
  constructor(private service: ListSheepService, private viewService: ViewSheepService, private accountService: AccountService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SheepModel> {
    const sheepId = +route.params['sheepId'];

    if (this.service.viewed && this.service.viewed.id === sheepId) {
      return of(this.service.viewed);
    } else {
      return this.viewService.get(sheepId);
    }
  }
}
