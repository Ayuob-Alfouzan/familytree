import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FamilyTreeModel } from './models/family-tree.model';
import { AccountService } from 'app/core/auth/account.service';
import { FamilyTreeManagementService } from './family-tree-management.service';

@Injectable()
export class FamilyTreeResolver implements Resolve<FamilyTreeModel> {
  constructor(private service: FamilyTreeManagementService, private accountService: AccountService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FamilyTreeModel> {
    if (route.params.id) {
      return this.service.get(route.params.id);
    }

    if (this.accountService.selectedFamilyTree) {
      return this.service.get(this.accountService.selectedFamilyTree.familyTreeId);
    }

    return of();
  }
}
