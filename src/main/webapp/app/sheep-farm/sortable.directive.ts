import { Directive, EventEmitter, Input, Output } from '@angular/core';

export type SortColumn = 'id' | 'farm.nameAr' | 'number' | 'name' | 'layDate' | 'hatchingDate' | 'type' | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[jhiSortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeaderDirective {
  @Input() jhiSortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate(): void {
    this.direction = rotate[this.direction];

    if (this.direction === '') {
      this.sort.emit({ column: 'id', direction: 'asc' });
    } else {
      this.sort.emit({ column: this.jhiSortable, direction: this.direction });
    }
  }
}
