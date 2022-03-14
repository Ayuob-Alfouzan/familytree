import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { LookupModel } from 'app/shared/models/lookup.model';
import { Pageable } from 'app/shared/models/page.model';
import { Dayjs } from 'dayjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddChickModel, ChangeChickStatusModel, DeleteChickModel, ChickCriteria, ChickModel } from '../../models/chick.model';

export interface TableStateModel {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  coopId: number;
  statusCode?: LookupModel;
  dateGraterThanOrEqual?: Dayjs;
  dateLessThanOrEqual?: Dayjs;
}

const defaultState: TableStateModel = {
  page: 1,
  size: 10,
  sortColumn: 'hatchingDate',
  sortDirection: 'desc',
  coopId: 0,
};

@Injectable()
export class ListChickService {
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

  get coopId(): number {
    return this._state.coopId;
  }
  set coopId(coopId: number) {
    this._set({ coopId });
    this.load();
  }

  get statusCode(): LookupModel | undefined {
    return this._state.statusCode;
  }
  set statusCode(statusCode: LookupModel | undefined) {
    this._set({ statusCode });
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

  loadFromServer(): Observable<ChickModel[]> {
    return this.http
      .post<Pageable<ChickModel>>(this.applicationConfigService.getEndpointFor('api/chick/list'), this.createBody(), {
        params: this.createParam(),
      })
      .pipe(
        map(result => {
          this._totalRecords = result.totalElements;
          return result.content;
        })
      );
  }

  delete(data: DeleteChickModel): Observable<ChickModel> {
    return this.http.post<ChickModel>(this.applicationConfigService.getEndpointFor(`api/chick/delete`), data);
  }

  changeStatus(data: ChangeChickStatusModel): Observable<ChickModel> {
    return this.http.post<ChickModel>(this.applicationConfigService.getEndpointFor(`api/chick/change-status`), data);
  }

  add(data: AddChickModel): Observable<ChickModel> {
    return this.http.post<ChickModel>(this.applicationConfigService.getEndpointFor(`api/chick/add`), data);
  }

  errorHandler(response: HttpErrorResponse): void {
    const error = response.error;

    this.toastService.error(error);
  }

  clearFilters(): void {
    this._state.statusCode = undefined;
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

  private createBody(): ChickCriteria {
    const body: ChickCriteria = {
      coopId: {
        equals: this._state.coopId,
      },
    };

    if (this._state.dateGraterThanOrEqual) {
      body.hatchingDate = {
        greaterThanOrEqual: this._state.dateGraterThanOrEqual,
      };
    }

    if (this._state.dateLessThanOrEqual) {
      this._state.dateLessThanOrEqual.endOf('day');
      if (body.hatchingDate) {
        body.hatchingDate.lessThanOrEqual = this._state.dateLessThanOrEqual;
      } else {
        body.hatchingDate = {
          lessThanOrEqual: this._state.dateLessThanOrEqual,
        };
      }
    }

    if (this._state.statusCode) {
      body.statusCode = {
        equals: this._state.statusCode.code,
      };
    }

    return body;
  }
}
