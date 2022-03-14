import { Dayjs } from 'dayjs';

export interface StringFilter {
  contains?: string;
  equals?: string;
  in?: string[];
}

export interface LongFilter {
  equals: number;
}

export interface DateRangeFilter {
  greaterThanOrEqual?: Dayjs;
  lessThanOrEqual?: Dayjs;
}
