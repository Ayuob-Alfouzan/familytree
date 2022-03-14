import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { LookupModel } from 'app/shared/models/lookup.model';
import { Pageable } from 'app/shared/models/page.model';
import { Dayjs } from 'dayjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddEggModel, ChangeEggStatusModel, DeleteEggModel, EggCriteria, EggModel } from '../../models/egg.model';

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
  sortColumn: 'layDate',
  sortDirection: 'desc',
  coopId: 0,
};

@Injectable()
export class ListEggService {
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

  loadFromServer(): Observable<EggModel[]> {
    return this.http
      .post<Pageable<EggModel>>(this.applicationConfigService.getEndpointFor('api/egg/list'), this.createBody(), {
        params: this.createParam(),
      })
      .pipe(
        map(result => {
          this._totalRecords = result.totalElements;
          return result.content;
        })
      );
  }

  delete(data: DeleteEggModel): Observable<EggModel> {
    return this.http.post<EggModel>(this.applicationConfigService.getEndpointFor(`api/egg/delete`), data);
  }

  changeStatus(data: ChangeEggStatusModel): Observable<EggModel> {
    return this.http.post<EggModel>(this.applicationConfigService.getEndpointFor(`api/egg/change-status`), data);
  }

  add(data: AddEggModel): Observable<EggModel> {
    return this.http.post<EggModel>(this.applicationConfigService.getEndpointFor(`api/egg/add`), data);
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

  private createBody(): EggCriteria {
    const body: EggCriteria = {
      coopId: {
        equals: this._state.coopId,
      },
    };

    if (this._state.dateGraterThanOrEqual) {
      body.layDate = {
        greaterThanOrEqual: this._state.dateGraterThanOrEqual,
      };
    }

    if (this._state.dateLessThanOrEqual) {
      this._state.dateLessThanOrEqual.endOf('day');
      if (body.layDate) {
        body.layDate.lessThanOrEqual = this._state.dateLessThanOrEqual;
      } else {
        body.layDate = {
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
