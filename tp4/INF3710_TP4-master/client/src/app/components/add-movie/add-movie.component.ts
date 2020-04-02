import { Component, ViewChild, ViewChildren } from '@angular/core';
import { FormMovie } from 'src/app/interfaces/form-movie';
import { Category } from 'src/app/enum/category';
import { ALL_CATEGORIES, DEFAULT_MOVIE, DEFAULT_PARTICIPANT, ALL_ROLES, DEFAULT_CEREMONY } from 'src/app/classes/constants';
import { DatePipe } from '@angular/common';
import { Participant } from 'src/app/interfaces/participant';
import { ALL_COUNTRIES } from 'src/app/classes/countries';
import { Role } from 'src/app/enum/role';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog/confirmation-dialog.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Oscar } from 'src/app/interfaces/oscar';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent {

  allCountries: string[];
  roles: Role[];
  movie: FormMovie;
  currentParticipant: Participant;
  currentCeremony: Oscar;
  categories : Category[];
  urlRegEx = new RegExp(/^(https?|ftp|torrent|image|irc):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i);
  
  displayedColumns: string[] = ['name', 'role', 'delete'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) tables!: MatTable<any>;

  constructor(
    private dateConverter: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,
  ) { 
    this.movie = DEFAULT_MOVIE;
    this.currentParticipant = this.cloneParticipant(DEFAULT_PARTICIPANT);
    this.currentCeremony = DEFAULT_CEREMONY;
    this.categories = ALL_CATEGORIES;
    this.allCountries = ALL_COUNTRIES;
    this.roles = ALL_ROLES;
    this.dataSource.sort = this.sort;
  }

  addMovie(): void {
  }

  getCurrentDate(): string {
    return this.dateConverter.transform(new Date(), 'yyyy-MM-dd') as string;
  }


  winnerChange(event: Event): void {
    if ((event.target as HTMLOptionElement).value === 'w') {
      this.currentCeremony.winner = true;
    } else {
      this.currentCeremony.winner = false;
    }
  }

  addParticipant(): void {
    console.log('Adding participant');
    this.movie.participants.push(this.cloneParticipant(this.currentParticipant));
    this.currentParticipant = this.cloneParticipant(DEFAULT_PARTICIPANT);
    this.tables.renderRows();
  }

  cloneParticipant(toClone: Participant): Participant {
    return {
      name: toClone.name,
      dateOfbirth: toClone.dateOfbirth,
      nationality: toClone.nationality,
      sex: toClone.sex,
      role: toClone.role,
      salary: toClone.salary
    }
  }

  addCeremony(): void {
    this.movie.honors.push(this.currentCeremony);
    this.currentCeremony = DEFAULT_CEREMONY;
    this.tables.renderRows();
  }

  deleteParticipant(name: string): void {
    this.confirmationDialogService.confirm('Please confirm!', `Do you really want to delete ${name} ?`)
    .then((confirmation) => {
      if(confirmation) {
        for(let i: number = 0; i < this.movie.participants.length; ++i) {
          if(this.movie.participants[i].name === name){
            this.movie.participants.splice(i, 1);
            this.tables.renderRows();
            return ;
          }
        }
      }
    });
  }

}
