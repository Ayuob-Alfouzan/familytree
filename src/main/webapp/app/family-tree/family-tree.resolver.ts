import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TreeResponseModel } from './models/family-tree.model';
import { AccountService } from 'app/core/auth/account.service';
import { FamilyTreeService } from './family-tree.service';

@Injectable()
export class FamilyTreeResolver implements Resolve<TreeResponseModel> {
  constructor(private service: FamilyTreeService, private accountService: AccountService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TreeResponseModel> {
    if (route.params.id) {
      return this.service.get(route.params.id);
    }

    if (this.accountService.selectedFamilyTree) {
      return this.service.get(this.accountService.selectedFamilyTree.familyTreeId);
    }

    return of();
  }
}
