export interface PersonBasicModel {
  name: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  description: string;
  mobileNumber: string;
  job: string;
}

export interface PersonModel extends PersonBasicModel {
  id: number;
  familyTreeId: number;
  recordActivity: boolean;
  imageUrl?: string;
  children: PersonModel[];
  wives: PersonModel[];
}

export interface FTHierarchyNode<Datum> extends d3.HierarchyNode<Datum> {
  _children?: this[] | undefined;
  x?: number;
  y?: number;
  x0?: number;
  y0?: number;
}

export interface FTHierarchyPointNode<Datum> extends d3.HierarchyPointNode<Datum> {
  _children?: this[] | undefined;
  x0?: number;
  y0?: number;
}

export interface AddChildModel extends PersonBasicModel {
  familyTreeId: number;
  fatherId: number;
}

export interface AddFatherModel extends PersonBasicModel {
  familyTreeId: number;
  childId: number;
}

export interface UpdatePersonModel extends PersonBasicModel {
  familyTreeId: number;
  id: number;
}
