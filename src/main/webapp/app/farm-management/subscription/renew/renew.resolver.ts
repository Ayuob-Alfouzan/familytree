import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PackageModel } from '../../models/subscription.model';
import { SubscriptionService } from '../subscription.service';

@Injectable()
export class RenewSubscriptionResolver implements Resolve<PackageModel> {
  constructor(private service: SubscriptionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PackageModel> {
    const farmId = route.paramMap.get('farmId');
    const subscriptionId = route.paramMap.get('subscriptionId');

    if (farmId && subscriptionId) {
      return this.service.preRenew(+farmId, +subscriptionId);
    }

    return of();
  }
}
