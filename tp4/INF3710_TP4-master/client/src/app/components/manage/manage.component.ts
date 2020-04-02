import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Movie } from 'src/app/interfaces/movie';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/services/manage/manage.service';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, AfterViewInit {

  addingUser: boolean;
  addingMovie: boolean;
  movies: Movie[];
  displayedColumns: string[] = ['title', 'genre', 'production date', 'duration', 'dvd price', 'streaming fee', 'delete'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    protected snacks: MatSnackBar,
    protected router: Router,
    private service: ManageService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    this.addingUser = false;
    this.addingMovie = false;
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

  deleteMovie(id: number, title: string): void {
    console.log(id);
    this.confirmationDialogService.confirm('Please confirm!', `Do you really want to delete ${title} ?`)
      .then(confirmation => {
        if (confirmation) {
          this.service.deleteMovie(id);
        }
      });
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
