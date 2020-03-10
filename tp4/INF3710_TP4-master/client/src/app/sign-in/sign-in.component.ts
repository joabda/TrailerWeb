import { Component } from '@angular/core';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  constructor( private modalService: NgbModal, private router: Router) {
  }

  onClose() {
    this.modalService.dismissAll();
  }

  onSignup() {
    this.modalService.open(SignUpComponent, {
      centered: true
    });
  }

  onSubmit() {
    alert('SignedIn');
    const value = this.validate();
    if(value) {
      this.router.navigate(['browse']);
    }
  }

  private validate(): boolean {
    return true;
  }

}
