import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Movie } from 'src/app/interfaces/movie';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/services/manage/manage.service';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog/confirmation-dialog.service';
import { User } from 'src/app/interfaces/user';
import { CANADIAN_PROVINCES } from 'src/app/classes/constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, AfterViewInit {

  emailRegEx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  specialCharRegEx = new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);
  upperCaseRegEx = new RegExp('[A-Z]');
  numberRegEx = new RegExp('[0-9]');
  positiveDigitsRegEx = new RegExp(/^\d*[1-9]\d*$/);
  canadianPostalCodeRegEx = new RegExp(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
  states = CANADIAN_PROVINCES;

  addingUser: boolean;
  addingMovie: boolean;
  movies: Movie[];
  user: User;
  displayedColumns: string[] = ['title', 'genre', 'production date', 'duration', 'dvd price', 'streaming fee', 'delete'];
  dataSource =  new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    protected snacks: MatSnackBar,
    protected router: Router,
    private service: ManageService,
    private confirmationDialogService: ConfirmationDialogService,
    private dateConverter : DatePipe
  ) {
    this.addingUser = false;
    this.addingMovie = false;
    this.user = {
      email      : '',
      password   : '',
      firstName  : '',
      lastName   : '',
      adress     : '',
      number     : '',
      postalCode : '',
      city       : '',
      state      : '',
      country    : 'Canada',
      isSubsc    : false,
      fee        : 0 ,
      dateSubsc  : this.getCurrentDate(),
    }
  }

  async ngOnInit(): Promise<void> {
    const result = await this.service.getMovies();
    if (result.valueOf() === false) {
      this.openSnack('Please Sign In First');
      this.router.navigate([""]);
    } else {
      this.movies = result as unknown as Movie[];
    }
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  getCurrentDate(): string {
    return this.dateConverter.transform(new Date(), 'yyyy-MM-dd') as string;
  }

  memberTypeChange(event: Event): void {
    if((event.target as HTMLOptionElement).value === 's') {
      this.user.isSubsc = true;
    } else {
      this.user.isSubsc = false;
    }
  }

  addMovie(): void {
  }

  addUser(): void {
    this.service.addUser(this.user);
  }

  deleteMovie(id: number, title: string): void {
    console.log(id);
    this.confirmationDialogService.confirm('Please confirm!', `Do you really want to delete ${title} ?`);
    this.service.deleteMovie(id);
  }

  private openSnack(message: string) {
    this.snacks.open(
      message,
      "",
      {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      }
    );
  }
}
