import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormMovie } from 'src/app/interfaces/form-movie';
import { Category } from 'src/app/enum/category';
import { ALL_CATEGORIES, DEFAULT_MOVIE, DEFAULT_PARTICIPANT, ALL_ROLES, DEFAULT_CEREMONY, ALL_NOMINATIONS } from 'src/app/classes/constants';
import { DatePipe } from '@angular/common';
import { Participant } from 'src/app/interfaces/participant';
import { ALL_COUNTRIES } from 'src/app/classes/countries';
import { Role } from 'src/app/enum/role';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog/confirmation-dialog.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Oscar } from 'src/app/interfaces/oscar';
import { NominationCategory } from 'src/app/enum/nomination-category';
import { ManageService } from 'src/app/services/manage/manage.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent {

  allCountries: string[];
  allCategories: NominationCategory[];
  roles: Role[];
  movie: FormMovie;
  currentParticipant: Participant;
  currentCeremony: Oscar;
  categories : Category[];
  urlRegEx = new RegExp(/^(https?|ftp|torrent|image|irc):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i);
  
  displayedColumns : string[] = ['name', 'role', 'delete'];
  displayedColumns2: string[] = ['host', 'date', 'delete'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(MatTable) tables : QueryList<MatTable<any>>;

  constructor(
    private dateConverter: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,
    private service: ManageService,
  ) { 
    this.movie = DEFAULT_MOVIE;
    this.currentParticipant = this.cloneParticipant(DEFAULT_PARTICIPANT);
    this.currentCeremony = this.cloneCeremony(DEFAULT_CEREMONY);
    this.categories = ALL_CATEGORIES;
    this.allCountries = ALL_COUNTRIES;
    this.roles = ALL_ROLES;
    this.allCategories = ALL_NOMINATIONS;;
    this.dataSource.sort = this.sort;
  }

  async addMovie(): Promise<void> {
    console.log('called');
    await this.service.addMovie(
      this.movie.title, 
      this.movie.category,
      this.movie.productionDate,
      this.movie.duration,
      this.movie.dvdPrice,
      this.movie.streamingFee,
      this.movie.movieURL,
      this.movie.imageURL
    ).subscribe( res => {
      for(const participant of this.movie.participants) {
        this.service.addParticipant(participant, (res as any).movieid);
      }
      for(const ceremony of this.movie.honors) {
        this.service.addCeremony(ceremony, (res as any).movieid);
      }
    })

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
    this.movie.participants.push(this.cloneParticipant(this.currentParticipant));
    this.currentParticipant = this.cloneParticipant(DEFAULT_PARTICIPANT);
    this.tables.first.renderRows();
  }

  cloneParticipant(toClone: Participant): Participant {
    return {
      name: toClone.name,
      dateOfbirth: toClone.dateOfbirth,
      nationality: toClone.nationality,
      sex: toClone.sex,
      role: toClone.role,
      salary: toClone.salary
    };
  }

  addCeremony(): void {
    this.movie.honors.push(this.cloneCeremony(this.currentCeremony));
    this.currentCeremony = this.cloneCeremony(DEFAULT_CEREMONY);
    this.tables.last.renderRows();
  }

  cloneCeremony(toClone: Oscar): Oscar {
    return {
      date        : toClone.date,
      location    : toClone.location,
      host        : toClone.host,
      winner      : toClone.winner,
      category    : toClone.category
    };
  }

  deleteParticipant(name: string): void {
    this.confirmationDialogService.confirm('Please confirm!', `Do you really want to delete ${name} ?`)
    .then((confirmation) => {
      if(confirmation) {
        for(let i: number = 0; i < this.movie.participants.length; ++i) {
          if(this.movie.participants[i].name === name){
            this.movie.participants.splice(i, 1);
            this.tables.first.renderRows();
            return ;
          }
        }
      }
    });
  }

  deleteNomination(date: string): void {
    this.confirmationDialogService.confirm('Please confirm!', `Do you really want to delete ${name}'s Ceremony ?`)
    .then((confirmation) => {
      if(confirmation) {
        for(let i: number = 0; i < this.movie.participants.length; ++i) {
          if(this.movie.honors[i].date === date){
            this.movie.honors.splice(i, 1);
            this.tables.last.renderRows();
            return ;
          }
        }
      }
    });
  }
}
