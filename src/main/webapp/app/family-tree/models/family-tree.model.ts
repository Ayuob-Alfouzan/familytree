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

export interface DataModel {
  name: string;
  parent: string;
  // x0: number;
  // y0: number;
  // x: number;
  // y: number;
  children?: DataModel[];
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
