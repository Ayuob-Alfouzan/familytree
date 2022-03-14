import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styles: [``],
})
export class ConfirmModalComponent {
  id?: number;

  @Input() buttonKey = 'global.confirm';
  @Input() cancelKey = 'global.cancel';
  @Input() messageKey = '';
  @Input() headerKey = 'global.message.confirmHeader';
  @Input() buttonClass = 'btn btn-danger';

  @Output() confirmed = new EventEmitter<number>();

  @ViewChild('content', { static: false }) private modal: any;

  constructor(private modalService: NgbModal) {}

  open(id: number): void {
    this.id = id;

    this.modalService.open(this.modal, { ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-blue-backdrop' });
  }

  cancel(): void {
    this.id = undefined;

    this.modalService.dismissAll();
  }

  confirm(): void {
    this.confirmed.emit(this.id);
    this.id = undefined;
    this.modalService.dismissAll();
  }
}
