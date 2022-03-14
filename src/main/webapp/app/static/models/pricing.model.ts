import { LookupModel } from 'app/shared/models/lookup.model';

export interface PricingModel {
  id: number;
  familyTreeType: LookupModel;
  nameAr: string;
  nameEn: string;
  nameUr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionUr: string;
  rangeStart: number;
  rangeEnd: number;
  cost: number;
  duration: number;
}
