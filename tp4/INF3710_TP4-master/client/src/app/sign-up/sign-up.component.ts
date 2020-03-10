import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  errorMessage = '';
  firstName = '';
  lastName = '';
  mail = '';
  postalCode = '';
  password = '';

  constructor (private modalService: NgbModal) {
  }

  private checkMail(): boolean {
    const index = this.mail.indexOf( '@' );
    if ( index !== -1 && index >= 2) {
      if (this.mail.substr( index + 1 ).includes( '.' ) ) {
        return true;
      }
    }
    this.errorMessage += 'Please enter a valid e-mail adress\n';
    return false;
  }

  private checkPostalCode(): void {
    const regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;  
    if(!regex.exec(this.postalCode)) {
      this.errorMessage += 'Invalid Postal Code';
    }
  }
  private checkPassword(): void {

  }


  private checkInputs(): boolean {
    this.errorMessage = '';
    if (!(!/[^a-z]/i.test(this.firstName))) {
      this.errorMessage = 'Invalid First Name.\n';
    }
    if (!(!/[^a-z]/i.test(this.lastName))) {
      this.errorMessage += 'Invalid Last Name.\n';
    }
    this.checkMail();
    this.checkPostalCode();
    this.checkPassword();
    if(this.errorMessage === ''){
      return true;
    }
    return false;
  }

  onSubmit(): void {
    alert(this.checkInputs() ? 'Registered' : this.errorMessage);
  }

  onClose(): void {
    this.modalService.dismissAll();
  }
}
