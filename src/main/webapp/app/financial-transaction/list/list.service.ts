import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { LookupModel } from 'app/shared/models/lookup.model';
import { Pageable } from 'app/shared/models/page.model';
import { Dayjs } from 'dayjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DeleteFinancialTransactionModel,
  AddFinancialTransactionModel,
  FinancialTransactionModel,
  FinancialTransactionCriteria,
} from '../models/financial-transaction.model';

export interface TableStateModel {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  farmId: number;
  dateGraterThanOrEqual?: Dayjs;
  dateLessThanOrEqual?: Dayjs;
  type: string;
  specificType?: LookupModel;
}

@Injectable()
export class ListFinancialTransactionService {
  loading = true;
  list: any;
  private _totalRecords = 0;
  private _state: TableStateModel = {
    page: 1,
    size: 10,
    sortColumn: 'id',
    sortDirection: 'asc',
    farmId: 0,
    type: 'EXPENSE',
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

  get type(): string {
    return this._state.type;
  }
  set type(type: string) {
    this._set({ type });
  }

  get specificType(): LookupModel | undefined {
    return this._state.specificType;
  }
  set specificType(specificType: LookupModel | undefined) {
    this._set({ specificType });
  }

  get size(): number {
    return this._state.size;
  }
  set size(size: number) {
    this._set({ size });
  }

  get dateGraterThanOrEqual(): Dayjs | undefined {
    return this._state.dateGraterThanOrEqual;
  }
  set dateGraterThanOrEqual(dateGraterThanOrEqual: Dayjs | undefined) {
    this._set({ dateGraterThanOrEqual });
  }

  get dateLessThanOrEqual(): Dayjs | undefined {
    return this._state.dateLessThanOrEqual;
  }
  set dateLessThanOrEqual(dateLessThanOrEqual: Dayjs | undefined) {
    this._set({ dateLessThanOrEqual });
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

  loadFromServer(): Observable<FinancialTransactionModel[]> {
    return this.http
      .post<Pageable<FinancialTransactionModel>>(
        this.applicationConfigService.getEndpointFor('api/financial-transaction/list'),
        this.createBody(),
        {
          params: this.createParam(),
        }
      )
      .pipe(
        map(result => {
          this._totalRecords = result.totalElements;
          return result.content;
        })
      );
  }

  delete(data: DeleteFinancialTransactionModel): Observable<FinancialTransactionModel> {
    return this.http.post<FinancialTransactionModel>(
      this.applicationConfigService.getEndpointFor(`api/financial-transaction/delete`),
      data
    );
  }

  add(data: AddFinancialTransactionModel): Observable<FinancialTransactionModel> {
    return this.http.post<FinancialTransactionModel>(this.applicationConfigService.getEndpointFor(`api/financial-transaction/add`), data);
  }

  errorHandler(response: HttpErrorResponse): void {
    const error = response.error;

    this.toastService.error(error);
  }

  clearFilters(): void {
    this._state.specificType = undefined;
    this._state.dateGraterThanOrEqual = undefined;
    this._state.dateLessThanOrEqual = undefined;

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

  private createBody(): FinancialTransactionCriteria {
    const body: FinancialTransactionCriteria = {
      farmId: {
        equals: this._state.farmId,
      },
      type: {
        equals: this._state.type,
      },
    };

    if (this._state.specificType) {
      body.specificType = {
        equals: this._state.specificType.code,
      };
    }

    if (this._state.dateGraterThanOrEqual) {
      body.createdDate = {
        greaterThanOrEqual: this._state.dateGraterThanOrEqual,
      };
    }

    if (this._state.dateLessThanOrEqual) {
      this._state.dateLessThanOrEqual.endOf('day');
      if (body.createdDate) {
        body.createdDate.lessThanOrEqual = this._state.dateLessThanOrEqual;
      } else {
        body.createdDate = {
          lessThanOrEqual: this._state.dateLessThanOrEqual,
        };
      }
    }

    return body;
  }
}
