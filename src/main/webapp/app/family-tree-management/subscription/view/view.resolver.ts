import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SubscriptionModel } from '../../models/subscription.model';
import { SubscriptionService } from '../subscription.service';

@Injectable()
export class ViewSubscriptionResolver implements Resolve<SubscriptionModel> {
  constructor(private service: SubscriptionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SubscriptionModel> {
    const familyTreeId = route.paramMap.get('familyTreeId');
    const subscriptionId = route.paramMap.get('subscriptionId');

    if (familyTreeId && subscriptionId) {
      return this.service.get(+familyTreeId, +subscriptionId);
    }

    return of();
  }
}
