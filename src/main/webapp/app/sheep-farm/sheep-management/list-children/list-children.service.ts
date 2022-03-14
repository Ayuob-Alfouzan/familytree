import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { LookupModel } from 'app/shared/models/lookup.model';
import { Pageable } from 'app/shared/models/page.model';
import { SheepCriteria, SheepModel } from 'app/sheep-farm/models/sheep.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TableStateModel {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  farmId: number;
  fatherId?: number;
  motherId?: number;
  number?: string;
  name?: string;
  category?: LookupModel;
  type?: LookupModel;
  status?: LookupModel;
}
const defaultState: TableStateModel = {
  page: 1,
  size: 10,
  sortColumn: 'id',
  sortDirection: 'asc',
  farmId: 0,
};

@Injectable()
export class ListSheepChildrenService {
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

  get fatherId(): number | undefined {
    return this._state.fatherId;
  }
  set fatherId(fatherId: number | undefined) {
    this._set({ fatherId });
    this.load();
  }

  get motherId(): number | undefined {
    return this._state.motherId;
  }
  set motherId(motherId: number | undefined) {
    this._set({ motherId });
    this.load();
  }

  get farmId(): number {
    return this._state.farmId;
  }
  set farmId(farmId: number) {
    this._set({ farmId });
  }

  get number(): string | undefined {
    return this._state.number;
  }
  set number(number: string | undefined) {
    this._set({ number });
  }

  get name(): string | undefined {
    return this._state.name;
  }
  set name(name: string | undefined) {
    this._set({ name });
  }

  get category(): LookupModel | undefined {
    return this._state.category;
  }
  set category(category: LookupModel | undefined) {
    this._set({ category });
  }

  get type(): LookupModel | undefined {
    return this._state.type;
  }
  set type(type: LookupModel | undefined) {
    this._set({ type });
  }

  get status(): LookupModel | undefined {
    return this._state.status;
  }
  set status(status: LookupModel | undefined) {
    this._set({ status });
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

  loadFromServer(): Observable<SheepModel[]> {
    return this.http
      .post<Pageable<SheepModel>>(this.applicationConfigService.getEndpointFor('api/sheep/list'), this.createBody(), {
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
    this._state.number = undefined;
    this._state.name = undefined;
    this._state.category = undefined;
    this._state.type = undefined;
    this._state.status = undefined;

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
    if (this._state.farmId === 0) {
      throw new Error('No farm');
    }

    const body: SheepCriteria = {
      farmId: {
        equals: this._state.farmId,
      },
    };

    if (this._state.fatherId) {
      body.fatherId = {
        equals: this._state.fatherId,
      };
    } else if (this._state.motherId) {
      body.motherId = {
        equals: this._state.motherId,
      };
    } else {
      throw new Error('No father nor mother');
    }

    if (this._state.number) {
      body.number = {
        contains: this._state.number,
      };
    }

    if (this._state.name) {
      body.name = {
        contains: this._state.name,
      };
    }

    if (this._state.category) {
      body.categoryCode = {
        equals: this._state.category.code,
      };
    }

    if (this._state.type) {
      body.typeCode = {
        equals: this._state.type.code,
      };
    }

    if (this._state.status) {
      body.statusCode = {
        equals: this._state.status.code,
      };
    }

    return body;
  }
}
