import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LookupModel } from '../models/lookup.model';
import { LookupEnum } from './lookup.enum';

@Injectable({ providedIn: 'root' })
export class LookupService {
  private _familyTreeTypes: LookupModel[] = [];
  private _invoiceStatuses: LookupModel[] = [];
  private _subscriptionStatuses: LookupModel[] = [];
  private _genders: LookupModel[] = [];
  private _lifeStatuses: LookupModel[] = [];

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  get familyTreeTypes(): LookupModel[] {
    return this._familyTreeTypes;
  }

  loadLookup(category: string): Observable<LookupModel[]> {
    switch (category) {
      case LookupEnum.FamilyTreeType:
        return this.loadFamilyTreeTypes();
      case LookupEnum.InvoiceStatus:
        return this.loadInvoiceStatuses();
      case LookupEnum.SubscriptionStatus:
        return this.loadSubscriptionStatuses();
      case LookupEnum.Gender:
        return this.loadGenders();
      case LookupEnum.LifeStatus:
        return this.loadLifeStatuses();
      default:
        return of([] as LookupModel[]);
    }
  }

  findLookupByCode(list: LookupModel[], code: string): LookupModel | undefined {
    return list.find(x => x.code === code);
  }

  private loadFamilyTreeTypes(): Observable<LookupModel[]> {
    if (this._familyTreeTypes.length > 0) {
      return of(this._familyTreeTypes);
    } else {
      return this.getLookup(LookupEnum.FamilyTreeType).pipe(tap(x => (this._familyTreeTypes = x)));
    }
  }

  private loadInvoiceStatuses(): Observable<LookupModel[]> {
    if (this._invoiceStatuses.length > 0) {
      return of(this._invoiceStatuses);
    } else {
      return this.getLookup(LookupEnum.InvoiceStatus).pipe(tap(x => (this._invoiceStatuses = x)));
    }
  }

  private loadSubscriptionStatuses(): Observable<LookupModel[]> {
    if (this._subscriptionStatuses.length > 0) {
      return of(this._subscriptionStatuses);
    } else {
      return this.getLookup(LookupEnum.SubscriptionStatus).pipe(tap(x => (this._subscriptionStatuses = x)));
    }
  }

  private loadGenders(): Observable<LookupModel[]> {
    if (this._genders.length > 0) {
      return of(this._genders);
    } else {
      return this.getLookup(LookupEnum.Gender).pipe(tap(x => (this._genders = x)));
    }
  }

  private loadLifeStatuses(): Observable<LookupModel[]> {
    if (this._lifeStatuses.length > 0) {
      return of(this._lifeStatuses);
    } else {
      return this.getLookup(LookupEnum.LifeStatus).pipe(tap(x => (this._lifeStatuses = x)));
    }
  }

  private getLookup(category: string): Observable<LookupModel[]> {
    let p = new HttpParams();
    p = p.append('category', category);
    return this.http.get<LookupModel[]>(this.applicationConfigService.getEndpointFor('api/lookup'), { params: p });
  }
}
