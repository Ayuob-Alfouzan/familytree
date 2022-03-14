import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { ManageWarehouseUserModel, FullWarehouseModel, EditWarehouseModel } from '../../models/warehouse.model';

@Injectable()
export class EditWarehouseService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  get(farmId: number, warehouseId: number): Observable<FullWarehouseModel> {
    return this.http.post<FullWarehouseModel>(this.applicationConfigService.getEndpointFor('api/warehouse/get'), { farmId, warehouseId });
  }

  edit(date: EditWarehouseModel): Observable<FullWarehouseModel> {
    return this.http.post<FullWarehouseModel>(this.applicationConfigService.getEndpointFor('api/warehouse/edit'), date);
  }

  addUser(data: ManageWarehouseUserModel): Observable<FullWarehouseModel> {
    return this.http.post<FullWarehouseModel>(this.applicationConfigService.getEndpointFor('api/warehouse/add-user'), data);
  }

  removeUser(data: ManageWarehouseUserModel): Observable<FullWarehouseModel> {
    return this.http.post<FullWarehouseModel>(this.applicationConfigService.getEndpointFor('api/warehouse/remove-user'), data);
  }
}
