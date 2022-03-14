import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { LookupModel } from 'app/shared/models/lookup.model';
import { Pageable } from 'app/shared/models/page.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddCoopModel, DeleteCoopModel, CoopCriteria, CoopModel, ChangeCoopStatusModel, SimpleCoopModel } from '../../models/coop.model';

export interface TableStateModel {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  warehouseId: number;
  name?: string;
  maleStatusCode?: LookupModel;
  femaleStatusCode?: LookupModel;
}
const defaultState: TableStateModel = {
  page: 1,
  size: 10,
  sortColumn: 'id',
  sortDirection: 'asc',
  warehouseId: 0,
};

@Injectable()
export class ListCoopService {
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

  get warehouseId(): number {
    return this._state.warehouseId;
  }
  set warehouseId(warehouseId: number) {
    this._set({ warehouseId });
    this.load();
  }

  get name(): string | undefined {
    return this._state.name;
  }
  set name(name: string | undefined) {
    this._set({ name });
  }

  get maleStatusCode(): LookupModel | undefined {
    return this._state.maleStatusCode;
  }
  set maleStatusCode(maleStatusCode: LookupModel | undefined) {
    this._set({ maleStatusCode });
  }

  get femaleStatusCode(): LookupModel | undefined {
    return this._state.femaleStatusCode;
  }
  set femaleStatusCode(femaleStatusCode: LookupModel | undefined) {
    this._set({ femaleStatusCode });
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

  loadFromServer(): Observable<CoopModel[]> {
    return this.http
      .post<Pageable<CoopModel>>(this.applicationConfigService.getEndpointFor('api/coop/list'), this.createBody(), {
        params: this.createParam(),
      })
      .pipe(
        map(result => {
          this._totalRecords = result.totalElements;
          return result.content;
        })
      );
  }

  listSimpleCoop(warehouseId: number): Observable<SimpleCoopModel[]> {
    return this.http.get<SimpleCoopModel[]>(this.applicationConfigService.getEndpointFor(`api/coop/list-simple-coop/${warehouseId}`));
  }

  delete(data: DeleteCoopModel): Observable<CoopModel> {
    return this.http.post<CoopModel>(this.applicationConfigService.getEndpointFor(`api/coop/delete`), data);
  }

  changeStatus(data: ChangeCoopStatusModel): Observable<CoopModel> {
    return this.http.post<CoopModel>(this.applicationConfigService.getEndpointFor(`api/coop/change-status`), data);
  }

  add(data: AddCoopModel): Observable<CoopModel> {
    return this.http.post<CoopModel>(this.applicationConfigService.getEndpointFor(`api/coop/add`), data);
  }

  errorHandler(response: HttpErrorResponse): void {
    const error = response.error;

    this.toastService.error(error);
  }

  clearFilters(): void {
    this._state.name = undefined;
    this._state.maleStatusCode = undefined;
    this._state.femaleStatusCode = undefined;

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

  private createBody(): CoopCriteria {
    const body: CoopCriteria = {
      warehouseId: {
        equals: this._state.warehouseId,
      },
    };

    if (this._state.name) {
      body.name = {
        contains: this._state.name,
      };
    }

    if (this._state.maleStatusCode) {
      body.maleStatusCode = {
        equals: this._state.maleStatusCode.code,
      };
    }

    if (this._state.femaleStatusCode) {
      body.femaleStatusCode = {
        equals: this._state.femaleStatusCode.code,
      };
    }

    return body;
  }
}
