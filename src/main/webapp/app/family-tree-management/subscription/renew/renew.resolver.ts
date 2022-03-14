import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PackageModel } from '../../models/subscription.model';
import { SubscriptionService } from '../subscription.service';

@Injectable()
export class RenewSubscriptionResolver implements Resolve<PackageModel> {
  constructor(private service: SubscriptionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PackageModel> {
    const familyTreeId = route.paramMap.get('familyTreeId');
    const subscriptionId = route.paramMap.get('subscriptionId');

    if (familyTreeId && subscriptionId) {
      return this.service.preRenew(+familyTreeId, +subscriptionId);
    }

    return of();
  }
}
