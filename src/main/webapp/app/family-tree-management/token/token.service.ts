import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { LookupModel } from 'app/shared/models/lookup.model';
import { Pageable } from 'app/shared/models/page.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InvoiceCriteria, InvoiceModel } from '../models/invoice.model';
import { Dayjs } from 'dayjs';
import { AddTokenModel, DeleteTokenModel, TokenCriteria, TokenModel } from '../models/token.model';

export interface TableStateModel {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  familyTreeId: number;
  token?: string;
}
const defaultState: TableStateModel = {
  page: 1,
  size: 10,
  sortColumn: 'id',
  sortDirection: 'desc',
  familyTreeId: 0,
};

@Injectable()
export class TokenService {
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

  get familyTreeId(): number {
    return this._state.familyTreeId;
  }
  set familyTreeId(familyTreeId: number) {
    this._set({ familyTreeId });
    this.load();
  }

  get token(): string | undefined {
    return this._state.token;
  }
  set token(token: string | undefined) {
    this._set({ token });
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

  loadFromServer(): Observable<TokenModel[]> {
    return this.http
      .post<Pageable<TokenModel>>(this.applicationConfigService.getEndpointFor('api/family-tree-token/list'), this.createBody(), {
        params: this.createParam(),
      })
      .pipe(
        map(result => {
          this._totalRecords = result.totalElements;
          return result.content;
        })
      );
  }

  add(data: AddTokenModel): Observable<TokenModel> {
    return this.http.post<TokenModel>(this.applicationConfigService.getEndpointFor(`api/family-tree-token/add`), data);
  }

  delete(data: DeleteTokenModel): Observable<TokenModel> {
    return this.http.post<TokenModel>(this.applicationConfigService.getEndpointFor(`api/family-tree-token/delete`), data);
  }

  errorHandler(response: HttpErrorResponse): void {
    const error = response.error;

    this.toastService.error(error);
  }

  clearFilters(): void {
    this._state.token = undefined;

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

  private createBody(): TokenCriteria {
    const body: TokenCriteria = {
      familyTreeId: {
        equals: this._state.familyTreeId,
      },
    };

    if (this._state.token) {
      body.token = {
        equals: this._state.token,
      };
    }

    return body;
  }
}
