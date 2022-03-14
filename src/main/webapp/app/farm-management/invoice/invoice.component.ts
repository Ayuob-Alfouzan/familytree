import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { InvoiceService } from './invoice.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../sortable.directive';
import { LanguageService } from 'app/shared/language/language.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { saveAs } from 'file-saver';

@Component({
  selector: 'jhi-list-invoice',
  templateUrl: './invoice.component.html',
})
export class InvoiceComponent implements OnInit {
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faDownload = faDownload;

  currentLanguage = this.languageService.onLangChange();

  invoiceStatuses = [];

  printing = false;

  constructor(public service: InvoiceService, private languageService: LanguageService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(first()).subscribe(paramMap => {
      const farmId = paramMap.get('farmId');

      if (farmId != null) {
        if (this.service.farmId && this.service.farmId !== +farmId) {
          this.service.resetDefauleState();
        }

        this.service.farmId = +farmId;
      }
    });

    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.InvoiceStatus)) {
        this.invoiceStatuses = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.InvoiceStatus).lookupList;
      }
    });
  }

  print(invoiceId: number): void {
    this.printing = true;

    this.service.print(this.service.farmId, invoiceId).subscribe(
      data => {
        saveAs(data, `invoice-${invoiceId}`);
        this.printing = false;
      },
      () => {
        this.printing = false;
      }
    );
  }

  onSort({ column, direction }: SortEvent): void {
    // resetting other headers
    this.headers?.forEach(header => {
      if (header.jhiSortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
