import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LookupService } from '../lookup/lookup.service';
import { LookupCategoryModel, LookupModel } from '../models/lookup.model';

@Injectable({ providedIn: 'root' })
export class LookupResolver implements Resolve<LookupCategoryModel[]> {
  constructor(private service: LookupService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<LookupCategoryModel[]> {
    if (route.data.lookupNames && route.data.lookupNames.length > 0) {
      const categories: string[] = route.data.lookupNames;
      const lookupObservablesList: Observable<LookupModel[]>[] = [];

      categories.forEach(x => lookupObservablesList.push(this.service.loadLookup(x)));

      return forkJoin(lookupObservablesList).pipe(
        map((x: LookupModel[][]) => {
          let i: number;
          const lookups: LookupCategoryModel[] = [];

          for (i = 0; i < categories.length; i++) {
            const category: LookupCategoryModel = {
              lookupName: categories[i],
              lookupList: x[i],
            };
            lookups.push(category);
          }

          return lookups;
        })
      );
    } else {
      return of([]);
    }
  }
}
