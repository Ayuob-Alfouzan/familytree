import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { Pageable } from 'app/shared/models/page.model';
import { CopulationCriteria, CopulationModel, DeleteCopulationModel, FalseCopulationModel } from 'app/sheep-familyTree/models/copulation.model';
import { Dayjs } from 'dayjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TableStateModel {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  eweId?: number;
  ramId?: number;
  dateGraterThanOrEqual?: Dayjs;
  dateLessThanOrEqual?: Dayjs;
}
const defaultState: TableStateModel = {
  page: 1,
  size: 10,
  sortColumn: 'id',
  sortDirection: 'desc',
};

@Injectable()
export class ListCopulationService {
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

  get eweId(): number | undefined {
    return this._state.eweId;
  }
  set eweId(eweId: number | undefined) {
    this._state.ramId = undefined;
    this._set({ eweId });
    this.load();
  }

  get ramId(): number | undefined {
    return this._state.ramId;
  }
  set ramId(ramId: number | undefined) {
    this._state.eweId = undefined;
    this._set({ ramId });
    this.load();
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

  get page(): number {
    return this._state.page;
  }
  set page(page: number) {
    this._set({ page });
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

  loadFromServer(): Observable<CopulationModel[]> {
    return this.http
      .post<Pageable<CopulationModel>>(this.applicationConfigService.getEndpointFor('api/copulation/list'), this.createBody(), {
        params: this.createParam(),
      })
      .pipe(
        map(result => {
          this._totalRecords = result.totalElements;
          return result.content;
        })
      );
  }

  get(id: number): Observable<CopulationModel> {
    return this.http.get<CopulationModel>(this.applicationConfigService.getEndpointFor(`api/copulation/get/${id}`));
  }

  delete(data: DeleteCopulationModel): Observable<CopulationModel> {
    return this.http.post<CopulationModel>(this.applicationConfigService.getEndpointFor(`api/copulation/delete`), data);
  }

  false(data: FalseCopulationModel): Observable<CopulationModel> {
    return this.http.post<CopulationModel>(this.applicationConfigService.getEndpointFor(`api/copulation/false-copulation`), data);
  }

  errorHandler(response: HttpErrorResponse): void {
    const error = response.error;

    this.toastService.error(error);
  }

  clearFilters(): void {
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

  private createBody(): CopulationCriteria {
    const body: CopulationCriteria = {};

    if (this._state.eweId) {
      body.eweId = {
        equals: this._state.eweId,
      };
    } else if (this._state.ramId) {
      body.ramId = {
        equals: this._state.ramId,
      };
    }

    if (this._state.dateGraterThanOrEqual) {
      body.impregnationDate = {
        greaterThanOrEqual: this._state.dateGraterThanOrEqual,
      };
    }

    if (this._state.dateLessThanOrEqual) {
      this._state.dateLessThanOrEqual.endOf('day');
      if (body.impregnationDate) {
        body.impregnationDate.lessThanOrEqual = this._state.dateLessThanOrEqual;
      } else {
        body.impregnationDate = {
          lessThanOrEqual: this._state.dateLessThanOrEqual,
        };
      }
    }

    return body;
  }
}
