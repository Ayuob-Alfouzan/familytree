import { LookupModel } from 'app/shared/models/lookup.model';

export class Account {
  constructor(
    public id: number,
    public activated: boolean,
    public authorities: string[],
    public email: string,
    public firstName: string | null,
    public langKey: string,
    public lastName: string | null,
    public login: string,
    public imageUrl: string | null,
    public familyTreeList: FamilyTreeModel[] | null
  ) {}
}

export interface FamilyTreeModel {
  id: number;
  familyTreeId: number;
  familyTreeNameAr: String;
  familyTreeType: LookupModel;
  type: LookupModel;
}
