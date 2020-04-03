import { Component } from '@angular/core';
import { CANADIAN_PROVINCES, DEFAULT_USER } from 'src/app/classes/constants';
import { User } from 'src/app/interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ManageService } from 'src/app/services/manage/manage.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  emailRegEx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  specialCharRegEx = new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);
  upperCaseRegEx = new RegExp('[A-Z]');
  numberRegEx = new RegExp('[0-9]');
  positiveDigitsRegEx = new RegExp(/^\d*[1-9]\d*$/);
  canadianPostalCodeRegEx = new RegExp(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
  states = CANADIAN_PROVINCES;
  user: User;


  constructor(
    protected snacks: MatSnackBar,
    protected router: Router,
    private dateConverter: DatePipe,
    private service: ManageService,
  ) {
    this.user = DEFAULT_USER;
    this.user.dateSubsc = this.getCurrentDate();
  }

  getCurrentDate(): string {
    return this.dateConverter.transform(new Date(), 'yyyy-MM-dd') as string;
  }

  memberTypeChange(event: Event): void {
    if ((event.target as HTMLOptionElement).value === 's') {
      this.user.isSubsc = true;
    } else {
      this.user.isSubsc = false;
    }
  }

  addUser(): void {
    this.service.addUser(this.user)
    .toPromise()
    .then()
    .catch( error => {
      console.log('Error adding user');
      console.log(error) 
    });
  }
}
