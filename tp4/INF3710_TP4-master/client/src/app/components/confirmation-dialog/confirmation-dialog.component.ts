// Adapter from https://stackblitz.com/edit/angular-confirmation-dialog?file=app%2Fconfirmation-dialog%2Fconfirmation-dialog.component.html

import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {

  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  constructor(public activeModal: NgbActiveModal) { }
}
