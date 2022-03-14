import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { Pageable } from 'app/shared/models/page.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AddWarehouseModel,
  DeleteWarehouseModel,
  WarehouseCriteria,
  WarehouseDashboardModel,
  WarehouseDashboardRequestModel,
  WarehouseModel,
} from '../../models/warehouse.model';

export interface TableStateModel {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  farmId: number;
  number?: number;
}

@Injectable()
export class ListWarehouseService {
  loading = true;
  list: any;
  private _totalRecords = 0;
  private _state: TableStateModel = {
    page: 1,
    size: 10,
    sortColumn: 'id',
    sortDirection: 'asc',
    farmId: 0,
  };

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

  get number(): number | undefined {
    return this._state.number;
  }
  set number(number: number | undefined) {
    this._set({ number });
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

  loadFromServer(): Observable<WarehouseModel[]> {
    return this.http
      .post<Pageable<WarehouseModel>>(this.applicationConfigService.getEndpointFor('api/warehouse/list'), this.createBody(), {
        params: this.createParam(),
      })
      .pipe(
        map(result => {
          this._totalRecords = result.totalElements;
          return result.content;
        })
      );
  }

  delete(data: DeleteWarehouseModel): Observable<WarehouseModel> {
    return this.http.post<WarehouseModel>(this.applicationConfigService.getEndpointFor(`api/warehouse/delete`), data);
  }

  add(data: AddWarehouseModel): Observable<WarehouseModel> {
    return this.http.post<WarehouseModel>(this.applicationConfigService.getEndpointFor(`api/warehouse/add`), data);
  }

  errorHandler(response: HttpErrorResponse): void {
    const error = response.error;

    this.toastService.error(error);
  }

  getDashboard(data: WarehouseDashboardRequestModel): Observable<WarehouseDashboardModel> {
    return this.http.post<WarehouseDashboardModel>(this.applicationConfigService.getEndpointFor(`api/warehouse/dashboard`), data);
  }

  clearFilters(): void {
    this._state.number = undefined;

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

  private createBody(): WarehouseCriteria {
    const body: WarehouseCriteria = {
      farmId: {
        equals: this._state.farmId,
      },
    };

    if (this._state.number) {
      body.number = {
        equals: this._state.number,
      };
    }

    return body;
  }
}
