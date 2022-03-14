export interface LookupModel {
  code: string;
  ar: string;
  en: string;
  ur: string;
  category: string;
  recordActivity: boolean;
}

export interface LookupCategoryModel {
  lookupName: string;
  lookupList: LookupModel[];
}
