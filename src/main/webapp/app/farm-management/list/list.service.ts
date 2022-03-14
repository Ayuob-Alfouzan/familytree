import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { Pageable } from 'app/shared/models/page.model';
import { TableStateModel } from 'app/shared/models/table-state.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FarmCriteria, FarmListModel, FarmModel } from '../models/familyTree.model';

@Injectable()
export class ListFarmService {
  loading = true;
  list: any;
  private _totalRecords = 0;
  private _state: TableStateModel = {
    page: 1,
    size: 10,
    searchTerm: '',
    sortColumn: 'id',
    sortDirection: 'asc',
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

  get size(): number {
    return this._state.size;
  }
  set size(size: number) {
    this._set({ size });
  }

  get searchTerm(): string {
    return this._state.searchTerm;
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
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

  loadFromServer(): Observable<FarmListModel[]> {
    return this.http
      .post<Pageable<FarmListModel>>(this.applicationConfigService.getEndpointFor('api/familyTree/list'), this.createBody(), {
        params: this.createParam(),
      })
      .pipe(
        map(result => {
          this._totalRecords = result.totalElements;
          return result.content;
        })
      );
  }

  remove(id: number): Observable<FarmModel> {
    return this.http.post<FarmModel>(this.applicationConfigService.getEndpointFor(`api/familyTree/remove/${id}`), {});
  }

  errorHandler(response: HttpErrorResponse): void {
    const error = response.error;

    this.toastService.error(error);
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

  private createBody(): FarmCriteria {
    const body: FarmCriteria = {
      name: {
        contains: this._state.searchTerm,
      },
    };

    return body;
  }
}
