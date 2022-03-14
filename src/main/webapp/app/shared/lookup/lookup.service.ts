import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LookupModel } from '../models/lookup.model';
import { LookupEnum } from './lookup.enum';

@Injectable({ providedIn: 'root' })
export class LookupService {
  private _farmTypes: LookupModel[] = [];
  private _pigeonStatuses: LookupModel[] = [];
  private _eggStatuses: LookupModel[] = [];
  private _chickStatuses: LookupModel[] = [];
  private _treatmentTypes: LookupModel[] = [];
  private _incomeTypes: LookupModel[] = [];
  private _expenseTypes: LookupModel[] = [];
  private _invoiceStatuses: LookupModel[] = [];
  private _subscriptionStatuses: LookupModel[] = [];
  private _sheepCategories: LookupModel[] = [];
  private _sheepTypes: LookupModel[] = [];
  private _sheepStatuses: LookupModel[] = [];
  private _sheepGenderes: LookupModel[] = [];
  private _gestationStatuses: LookupModel[] = [];
  private _sheepVaccinationTypes: LookupModel[] = [];
  private _sheepTreatmentTypes: LookupModel[] = [];
  private _sheepTreatmentDoseTypes: LookupModel[] = [];

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  get farmTypes(): LookupModel[] {
    return this._farmTypes;
  }

  loadLookup(category: string): Observable<LookupModel[]> {
    switch (category) {
      case LookupEnum.FarmType:
        return this.loadFarmTypes();
      case LookupEnum.PigeonStatus:
        return this.loadPigeonStatuses();
      case LookupEnum.EggStatus:
        return this.loadEggStatuses();
      case LookupEnum.ChickStatus:
        return this.loadChickStatuses();
      case LookupEnum.TreatmentType:
        return this.loadTreatmentTypes();
      case LookupEnum.IncomeType:
        return this.loadIncomeTypes();
      case LookupEnum.ExpenseType:
        return this.loadExpenseTypes();
      case LookupEnum.InvoiceStatus:
        return this.loadInvoiceStatuses();
      case LookupEnum.SubscriptionStatus:
        return this.loadSubscriptionStatuses();
      case LookupEnum.SheepType:
        return this.loadSheepTypes();
      case LookupEnum.SheepStatus:
        return this.loadSheepStatuses();
      case LookupEnum.SheepCategory:
        return this.loadSheepCategories();
      case LookupEnum.SheepGender:
        return this.loadSheepGenderes();
      case LookupEnum.GestationStatus:
        return this.loadGestationStatuses();
      case LookupEnum.SheepVaccinationType:
        return this.loadSheepVaccinationTypes();
      case LookupEnum.SheepTreatmentType:
        return this.loadSheepTreatmentTypes();
      case LookupEnum.SheepTreatmentDoseType:
        return this.loadSheepTreatmentDoseTypes();
      default:
        return of([] as LookupModel[]);
    }
  }

  private loadFarmTypes(): Observable<LookupModel[]> {
    if (this._farmTypes.length > 0) {
      return of(this._farmTypes);
    } else {
      return this.getLookup(LookupEnum.FarmType).pipe(tap(x => (this._farmTypes = x)));
    }
  }

  private loadPigeonStatuses(): Observable<LookupModel[]> {
    if (this._pigeonStatuses.length > 0) {
      return of(this._pigeonStatuses);
    } else {
      return this.getLookup(LookupEnum.PigeonStatus).pipe(tap(x => (this._pigeonStatuses = x)));
    }
  }

  private loadEggStatuses(): Observable<LookupModel[]> {
    if (this._eggStatuses.length > 0) {
      return of(this._eggStatuses);
    } else {
      return this.getLookup(LookupEnum.EggStatus).pipe(tap(x => (this._eggStatuses = x)));
    }
  }

  private loadChickStatuses(): Observable<LookupModel[]> {
    if (this._chickStatuses.length > 0) {
      return of(this._chickStatuses);
    } else {
      return this.getLookup(LookupEnum.ChickStatus).pipe(tap(x => (this._chickStatuses = x)));
    }
  }

  private loadTreatmentTypes(): Observable<LookupModel[]> {
    if (this._treatmentTypes.length > 0) {
      return of(this._treatmentTypes);
    } else {
      return this.getLookup(LookupEnum.TreatmentType).pipe(tap(x => (this._treatmentTypes = x)));
    }
  }

  private loadIncomeTypes(): Observable<LookupModel[]> {
    if (this._incomeTypes.length > 0) {
      return of(this._incomeTypes);
    } else {
      return this.getLookup(LookupEnum.IncomeType).pipe(tap(x => (this._incomeTypes = x)));
    }
  }

  private loadExpenseTypes(): Observable<LookupModel[]> {
    if (this._expenseTypes.length > 0) {
      return of(this._expenseTypes);
    } else {
      return this.getLookup(LookupEnum.ExpenseType).pipe(tap(x => (this._expenseTypes = x)));
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

  private loadSheepStatuses(): Observable<LookupModel[]> {
    if (this._sheepStatuses.length > 0) {
      return of(this._sheepStatuses);
    } else {
      return this.getLookup(LookupEnum.SheepStatus).pipe(tap(x => (this._sheepStatuses = x)));
    }
  }

  private loadGestationStatuses(): Observable<LookupModel[]> {
    if (this._gestationStatuses.length > 0) {
      return of(this._gestationStatuses);
    } else {
      return this.getLookup(LookupEnum.GestationStatus).pipe(tap(x => (this._gestationStatuses = x)));
    }
  }

  private loadSheepCategories(): Observable<LookupModel[]> {
    if (this._sheepCategories.length > 0) {
      return of(this._sheepCategories);
    } else {
      return this.getLookup(LookupEnum.SheepCategory).pipe(tap(x => (this._sheepCategories = x)));
    }
  }

  private loadSheepGenderes(): Observable<LookupModel[]> {
    if (this._sheepGenderes.length > 0) {
      return of(this._sheepGenderes);
    } else {
      return this.getLookup(LookupEnum.SheepGender).pipe(tap(x => (this._sheepGenderes = x)));
    }
  }

  private loadSheepTypes(): Observable<LookupModel[]> {
    if (this._sheepTypes.length > 0) {
      return of(this._sheepTypes);
    } else {
      return this.getLookup(LookupEnum.SheepType).pipe(tap(x => (this._sheepTypes = x)));
    }
  }

  private loadSheepVaccinationTypes(): Observable<LookupModel[]> {
    if (this._sheepVaccinationTypes.length > 0) {
      return of(this._sheepVaccinationTypes);
    } else {
      return this.getLookup(LookupEnum.SheepVaccinationType).pipe(tap(x => (this._sheepVaccinationTypes = x)));
    }
  }

  private loadSheepTreatmentTypes(): Observable<LookupModel[]> {
    if (this._sheepTreatmentTypes.length > 0) {
      return of(this._sheepTreatmentTypes);
    } else {
      return this.getLookup(LookupEnum.SheepTreatmentType).pipe(tap(x => (this._sheepTreatmentTypes = x)));
    }
  }

  private loadSheepTreatmentDoseTypes(): Observable<LookupModel[]> {
    if (this._sheepTreatmentDoseTypes.length > 0) {
      return of(this._sheepTreatmentDoseTypes);
    } else {
      return this.getLookup(LookupEnum.SheepTreatmentDoseType).pipe(tap(x => (this._sheepTreatmentDoseTypes = x)));
    }
  }

  private getLookup(category: string): Observable<LookupModel[]> {
    let p = new HttpParams();
    p = p.append('category', category);
    return this.http.get<LookupModel[]>(this.applicationConfigService.getEndpointFor('api/lookup'), { params: p });
  }
}
