export interface PersonModel {
  id: number;
  familyTreeId: number;
  name: string;
  dateOfBirth: Date;
  gender: string;
  recordActivity: boolean;
  status: string;
  description?: string;
  mobileNumber?: string;
  job?: string;
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

export interface AddPersonModel {
  familyTreeId: number;
  name: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  description: string;
  mobileNumber: string;
  job: string;
  fatherId: number;
}
