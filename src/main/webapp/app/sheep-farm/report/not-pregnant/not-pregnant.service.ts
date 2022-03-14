import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { Pageable } from 'app/shared/models/page.model';
import { SheepCriteria, SheepModel } from 'app/sheep-familyTree/models/sheep.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TableStateModel {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  farmId: number;
}

const defaultState: TableStateModel = {
  page: 1,
  size: 10,
  sortColumn: 'id',
  sortDirection: 'asc',
  farmId: 0,
};

@Injectable()
export class NotPregnantReportService {
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

  loadFromServer(): Observable<SheepModel[]> {
    return this.http
      .post<Pageable<SheepModel>>(this.applicationConfigService.getEndpointFor('api/sheep-report/not-pregnant'), this.createBody(), {
        params: this.createParam(),
      })
      .pipe(
        map(result => {
          this._totalRecords = result.totalElements;
          return result.content;
        })
      );
  }

  errorHandler(response: HttpErrorResponse): void {
    const error = response.error;

    this.toastService.error(error);
  }

  clearFilters(): void {
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

  private createBody(): SheepCriteria {
    const body: SheepCriteria = {
      farmId: {
        equals: this._state.farmId,
      },
    };

    return body;
  }
}
