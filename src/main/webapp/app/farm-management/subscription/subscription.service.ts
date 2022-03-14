import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { LookupModel } from 'app/shared/models/lookup.model';
import { Pageable } from 'app/shared/models/page.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { InvoiceCriteria, InvoiceModel } from '../models/invoice.model';
import { SubscriptionActionModel, PackageModel, SubscriptionModel, SubscriptionUpgradeRequestModel } from '../models/subscription.model';

export interface TableStateModel {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  subscriptionAction?: SubscriptionActionModel;
  farmId: number;
  statusCode?: LookupModel;
}
const defaultState: TableStateModel = {
  page: 1,
  size: 10,
  sortColumn: 'id',
  sortDirection: 'desc',
  farmId: 0,
};

@Injectable()
export class SubscriptionService {
  loading = true;
  list: any;
  private _totalRecords = 0;
  private _state: TableStateModel = Object.assign({}, defaultState);

  get totalRecords(): number {
    return this._totalRecords;
  }
  set totalRecords(totalRecords: number) {
    this._totalRecords = totalRecords;
  }

  get page(): number {
    return this._state.page;
  }
  set page(page: number) {
    this._set({ page });
    this.load();
  }

  get farmId(): number {
    return this._state.farmId;
  }
  set farmId(farmId: number) {
    this._set({ farmId });
    this.load();
  }

  get subscriptionAction(): SubscriptionActionModel | undefined {
    return this._state.subscriptionAction;
  }
  set subscriptionAction(subscriptionAction: SubscriptionActionModel | undefined) {
    this._set({ subscriptionAction });
  }

  get statusCode(): LookupModel | undefined {
    return this._state.statusCode;
  }
  set statusCode(statusCode: LookupModel | undefined) {
    this._set({ statusCode });
  }

  get size(): number {
    return this._state.size;
  }
  set size(size: number) {
    this._set({ size });
  }

  get sortColumn(): string {
    return this._state.sortColumn;
  }
  set sortColumn(sortColumn: string) {
    this._set({ sortColumn });
  }

  get sortDirection(): string {
    return this._state.sortDirection;
  }
  set sortDirection(sortDirection: string) {
    this._set({ sortDirection });
    this.load();
  }
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService, private toastService: ToastService) {}

  resetDefauleState(): void {
    this.loading = true;
    this.list = undefined;
    this._totalRecords = 0;
    this._state = Object.assign({}, defaultState);
  }

  load(): void {
    this.loading = true;

    this.loadFromServer().subscribe(
      result => {
        this.list = result;
        this.loading = false;
      },
      error => {
        this.errorHandler(error);
        this.loading = false;
      }
    );
  }

  loadFromServer(): Observable<InvoiceModel[]> {
    return this.http
      .post<Pageable<InvoiceModel>>(this.applicationConfigService.getEndpointFor('api/subscription/list'), this.createBody(), {
        params: this.createParam(),
      })
      .pipe(
        map(result => {
          this._totalRecords = result.totalElements;
          return result.content;
        })
      );
  }

  getSubscriptionAction(): Observable<SubscriptionActionModel> {
    if (this._state.subscriptionAction) {
      return of(this._state.subscriptionAction);
    } else {
      return this.http.get<SubscriptionActionModel>(
        this.applicationConfigService.getEndpointFor(`api/subscription/subscription-action/${this._state.farmId}`)
      );
    }
  }

  add(farmId: number, packageId: number): Observable<SubscriptionModel> {
    return this.http.post<SubscriptionModel>(
      this.applicationConfigService.getEndpointFor(`api/subscription/add/${farmId}/${packageId}`),
      {}
    );
  }

  get(farmId: number, subscriptionId: number): Observable<SubscriptionModel> {
    return this.http.get<SubscriptionModel>(
      this.applicationConfigService.getEndpointFor(`api/subscription/get/${farmId}/${subscriptionId}`)
    );
  }

  upgrade(farmId: number, subscriptionId: number, packageId: number): Observable<SubscriptionModel> {
    return this.http.post<SubscriptionModel>(
      this.applicationConfigService.getEndpointFor(`api/subscription/upgrade/${farmId}/${subscriptionId}/${packageId}`),
      {}
    );
  }

  preRenew(farmId: number, subscriptionId: number): Observable<PackageModel> {
    return this.http.get<PackageModel>(
      this.applicationConfigService.getEndpointFor(`api/package/suitable-for-renew/${farmId}/${subscriptionId}`)
    );
  }

  renew(farmId: number, subscriptionId: number): Observable<SubscriptionModel> {
    return this.http.post<SubscriptionModel>(
      this.applicationConfigService.getEndpointFor(`api/subscription/renew/${farmId}/${subscriptionId}`),
      {}
    );
  }

  cancel(farmId: number, subscriptionId: number): Observable<void> {
    return this.http.post<void>(this.applicationConfigService.getEndpointFor(`api/subscription/cancel/${farmId}/${subscriptionId}`), {});
  }

  cancelUpgrade(farmId: number, subscriptionUpgradeRequestId: number): Observable<SubscriptionUpgradeRequestModel> {
    return this.http.post<SubscriptionUpgradeRequestModel>(
      this.applicationConfigService.getEndpointFor(`api/subscription/cancel-upgrade/${farmId}/${subscriptionUpgradeRequestId}`),
      {}
    );
  }

  listSuitablePackages(farmId: number): Observable<PackageModel[]> {
    return this.http.get<PackageModel[]>(this.applicationConfigService.getEndpointFor(`api/package/list-suitable/${farmId}`));
  }

  listSuitablePackagesForUpgrade(farmId: number, subscriptionId: number): Observable<PackageModel[]> {
    return this.http.get<PackageModel[]>(
      this.applicationConfigService.getEndpointFor(`api/package/list-suitable-for-upgrade/${farmId}/${subscriptionId}`)
    );
  }

  errorHandler(response: HttpErrorResponse): void {
    const error = response.error;

    this.toastService.error(error);
  }

  clearFilters(): void {
    this._state.statusCode = undefined;

    this.load();
  }

  private _set(patch: Partial<TableStateModel>): void {
    Object.assign(this._state, patch);
  }

  private createParam(): HttpParams {
    let params = new HttpParams();
    params = params.append('page', String(this._state.page - 1));
    params = params.append('size', String(this.size));
    params = params.append('sort', String(this._state.sortColumn) + ',' + String(this._state.sortDirection));

    return params;
  }

  private createBody(): InvoiceCriteria {
    const body: InvoiceCriteria = {
      farmId: {
        equals: this._state.farmId,
      },
    };

    if (this._state.statusCode) {
      body.statusCode = {
        equals: this._state.statusCode.code,
      };
    }

    return body;
  }
}
