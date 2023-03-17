import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent {
  @Input() title: string;
  @Input() text: string;
  @Input() approve: string;
  @Input() cancel: string;
  @Input() linkTitle: string;
  @Input() classList: string;

  @Output() onConfirm = new EventEmitter<boolean>();

  public modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public confirm(): void {
    this.onConfirm.emit(true);
    this.modalRef.hide();
  }

  public decline(): void {
    this.onConfirm.emit(false);
    this.modalRef.hide();
  }

}
