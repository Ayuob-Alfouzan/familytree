export interface TreeResponseModel {
  nodes: NodeResponseModel[];
  links: LinkResponseModel[];
}

export interface NodeResponseModel {
  id: string;
  label: string;
  gender: string;
  description: string;
  mobileNumber: string;
  job: string;
  imageUrl: string;
  status: string;
  dateOfBirth: string;
}

export interface LinkResponseModel {
  source: string;
  target: string;
  relationship: string;
}

export interface PersonModel {
  id: number;
  familyTreeId: number;
  name: string;
  dateOfBirth: string;
  gender: string;
  recordActivity: boolean;
  status: string;
  description: string;
  mobileNumber: string;
  job: string;
  imageUrl: string;
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
