import { DatePipe } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { CANADIAN_PROVINCES, DEFAULT_USER } from "src/app/classes/constants";
import { User } from "src/app/interfaces/user";
import { ManageService } from "src/app/services/manage/manage.service";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"]
})
export class AddUserComponent {

  public emailRegEx: RegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  public specialCharRegEx: RegExp = new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);
  public upperCaseRegEx: RegExp = new RegExp("[A-Z]");
  public numberRegEx: RegExp = new RegExp("[0-9]");
  public positiveDigitsRegEx: RegExp = new RegExp(/^\d*[1-9]\d*$/);
  public canadianPostalCodeRegEx: RegExp = new RegExp(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
  public states: string[] = CANADIAN_PROVINCES;
  public user: User;
  public loading: boolean;
  @ViewChild(NgForm, { static: true }) public form: NgForm;

  public constructor(
    protected snacks: MatSnackBar,
    protected router: Router,
    private dateConverter: DatePipe,
    private service: ManageService,
  ) {
    this.loading = false;
    this.user = this.cloneUser(DEFAULT_USER);
    this.user.dateSubsc = this.getCurrentDate();
  }

  public getCurrentDate(): string {
    return this.dateConverter.transform(new Date(), "yyyy-MM-dd") as string;
  }

  public memberTypeChange(event: Event): void {
    if ((event.target as HTMLOptionElement).value === "s") {
      this.user.isSubsc = true;
    } else {
      this.user.isSubsc = false;
    }
  }

  public addUser(): void {
    if (!this.valid()) {
      this.openSnack(`Please correct the form before submitting!`);

      return ;
    }
    this.loading = true;
    this.service.addUser(this.user)
      .toPromise()
      .then( (error) => {
        this.loading = false;
        if (error === 409) {
          this.openSnack(`Email ${this.user.email} has already been used.`);
        } else {
          this.user = this.cloneUser(DEFAULT_USER);
          this.openSnack(`User has been added.`);
          this.form.resetForm();
        }
      })
      .catch( () => {
          this.loading = false;
          this.openSnack(`Error adding user ${this.user.firstName}.`);
      });
  }

  private cloneUser(toClone: User): User {
    return {
      email       : toClone.email,
      password    : toClone.password,
      firstName   : toClone.firstName,
      lastName    : toClone.lastName,
      adress      : toClone.adress,
      number      : toClone.number,
      postalCode  : toClone.postalCode,
      city        : toClone.city,
      state       : toClone.state,
      country     : toClone.country,
      isSubsc     : toClone.isSubsc,
      fee         : toClone.fee,
      dateSubsc   : toClone.dateSubsc
    };
  }

  private valid(): boolean {
    return (
      this.emailRegEx.test(this.user.email) &&
      this.specialCharRegEx.test(this.user.password) &&
      this.upperCaseRegEx.test(this.user.password) &&
      this.numberRegEx.test(this.user.password) &&
      this.user.password.length >= 6 &&
      this.positiveDigitsRegEx.test(this.user.number) &&
      this.canadianPostalCodeRegEx.test(this.user.postalCode)
    );
  }

  private openSnack(message: string): void { 
    this.snacks.open(
      message,
      "",
      {
        duration: 3000,
        verticalPosition: "top",
        horizontalPosition: "center"
      }
    );
  }
}
