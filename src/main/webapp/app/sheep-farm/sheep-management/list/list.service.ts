import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ToastService } from 'app/core/util/toast.service';
import { LookupModel } from 'app/shared/models/lookup.model';
import { Pageable } from 'app/shared/models/page.model';
import { DeleteSheepModel, SheepCriteria, SheepModel, SimpleSheepModel } from 'app/sheep-familyTree/models/sheep.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TableStateModel {
  page: number;
  size: number;
  sortColumn: string;
  sortDirection: string;
  farmId: number;
  number?: string;
  name?: string;
  category?: LookupModel;
  filter: string;
}
const defaultState: TableStateModel = {
  page: 1,
  size: 10,
  sortColumn: 'id',
  sortDirection: 'asc',
  farmId: 0,
  filter: 'EWE',
};

@Injectable()
export class ListSheepService {
  loading = true;
  list: any;
  private _viewed?: SheepModel;
  private _totalRecords = 0;
  private _state: TableStateModel = Object.assign({}, defaultState);

  get totalRecords(): number {
    return this._totalRecords;
  }
  set totalRecords(totalRecords: number) {
    this._totalRecords = totalRecords;
  }

  get viewed(): SheepModel | undefined {
    return this._viewed;
  }
  set viewed(viewed: SheepModel | undefined) {
    this._viewed = viewed;
  }

  get farmId(): number {
    return this._state.farmId;
  }
  set farmId(farmId: number) {
    this._set({ farmId });
    this.load();
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

  get filter(): string {
    return this._state.filter;
  }
  set filter(filter: string) {
    this._set({ filter });
    this.load();
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

  delete(data: DeleteSheepModel): Observable<SheepModel> {
    return this.http.post<SheepModel>(this.applicationConfigService.getEndpointFor(`api/sheep/delete`), data);
  }

  listSimpleSheep(farmId: number): Observable<SimpleSheepModel[]> {
    return this.http.get<SimpleSheepModel[]>(this.applicationConfigService.getEndpointFor(`api/sheep/list-simple-sheep/${farmId}`));
  }

  errorHandler(response: HttpErrorResponse): void {
    const error = response.error;

    this.toastService.error(error);
  }

  clearFilters(): void {
    this._state.number = undefined;
    this._state.name = undefined;
    this._state.category = undefined;

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

    // const types: {[key: string]: boolean} = {
    //   ewes: false,
    //   pregnant: false,
    //   LAMBed: false,
    //   rams: false,
    //   LAMB: false,
    //   springLAMB: false,
    //   '6-12': false,
    // }

    // const statuses: {[key: string]: boolean} = {
    //   hale: false,
    //   sick: false,
    //   dead: false,
    //   sold: false,
    //   stolen: false,
    // }

    // if (this._state.ewes) {
    //   types.ewes = true;
    //   statuses.hale = true;
    //   statuses.sick = true;
    // }

    // if (this._state.pregnant) {
    //   types.pregnant = true;
    //   statuses.hale = true;
    //   statuses.sick = true;
    // }

    // if (this._state.LAMBed) {
    //   types.LAMBed = true;
    //   statuses.hale = true;
    //   statuses.sick = true;
    // }

    // if (this._state.rams) {
    //   types.rams = true;
    //   statuses.hale = true;
    //   statuses.sick = true;
    // }

    // Object.keys(types).forEach(type => {
    //   if (body.typeCode === undefined || body.typeCode.in === undefined) {
    //     body.typeCode = {};
    //     body.typeCode.in = [];
    //   }
    //   if (types[type]) {
    //     body.typeCode.in.push(type);
    //   }
    // });

    // Object.keys(statuses).forEach(status => {
    //   if (body.statusCode === undefined || body.statusCode.in === undefined) {
    //     body.statusCode = {};
    //     body.statusCode.in = [];
    //   }

    //   if (statuses[status]) {
    //     body.statusCode.in.push(status);
    //   }
    // });

    if (this._state.filter === 'EWE') {
      body.typeCode = {
        in: ['EWE'],
      };

      body.statusCode = {
        in: ['HALE', 'SICK'],
      };
    }

    if (this._state.filter === 'PREGNANT') {
      body.typeCode = {
        in: ['PREGNANT'],
      };

      body.statusCode = {
        in: ['HALE', 'SICK'],
      };
    }

    if (this._state.filter === 'LAMBED') {
      body.typeCode = {
        in: ['LAMBED'],
      };

      body.statusCode = {
        in: ['HALE', 'SICK'],
      };
    }

    if (this._state.filter === 'RAM') {
      body.typeCode = {
        in: ['RAM'],
      };

      body.statusCode = {
        in: ['HALE', 'SICK'],
      };
    }

    if (this._state.filter === 'LAMB') {
      body.typeCode = {
        in: ['LAMB'],
      };

      body.statusCode = {
        in: ['HALE', 'SICK'],
      };
    }

    if (this._state.filter === 'SPRING_LAMB') {
      body.typeCode = {
        in: ['SPRING_LAMB'],
      };

      body.statusCode = {
        in: ['HALE', 'SICK'],
      };
    }

    if (this._state.filter === '6-12') {
      body.typeCode = {
        in: ['6-12'],
      };

      body.statusCode = {
        in: ['HALE', 'SICK'],
      };
    }

    if (this._state.filter === 'DEAD') {
      body.statusCode = {
        in: ['DEAD'],
      };
    }

    if (this._state.filter === 'SOLD') {
      body.statusCode = {
        in: ['SOLD'],
      };
    }

    if (this._state.filter === 'STOLEN') {
      body.statusCode = {
        in: ['STOLEN'],
      };
    }

    return body;
  }
}
