import { DatePipe } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ALL_CATEGORIES, ALL_ROLES, DEFAULT_CEREMONY, DEFAULT_MOVIE, DEFAULT_PARTICIPANT } from "src/app/classes/constants";
import { ALL_COUNTRIES } from "src/app/classes/countries";
import { Category } from "src/app/enum/category";
import { Role } from "src/app/enum/role";
import { FormMovie } from "src/app/interfaces/form-movie";
import { Oscar } from "src/app/interfaces/oscar";
import { Participant } from "src/app/interfaces/participant";
import { ConfirmationDialogService } from "src/app/services/confirmation-dialog/confirmation-dialog.service";

@Component({
    selector: "app-add-movie",
    templateUrl: "./add-movie.component.html",
    styleUrls: ["./add-movie.component.css"]
})
export class AddMovieComponent {

    public allCountries: string[];
    public roles: Role[];
    public movie: FormMovie;
    public currentParticipant: Participant;
    public currentCeremony: Oscar;
    public categories: Category[];
    urlRegEx = new RegExp(/^(https?|ftp|torrent|image|irc):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i);

    public displayedColumns: string[] = ["name", "role", "delete"];
    dataSource = new MatTableDataSource();
    @ViewChild(MatSort, { static: true }) public sort: MatSort;
    @ViewChild(MatTable) public tables!: MatTable<any>;

    public constructor(
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

    public addMovie(): void {
    }

    public getCurrentDate(): string {
        return this.dateConverter.transform(new Date(), "yyyy-MM-dd") as string;
    }

    public winnerChange(event: Event): void {
        if ((event.target as HTMLOptionElement).value === "w") {
            this.currentCeremony.winner = true;
        } else {
            this.currentCeremony.winner = false;
        }
    }

    public addParticipant(): void {
        console.log("Adding participant");
        this.movie.participants.push(this.cloneParticipant(this.currentParticipant));
        this.currentParticipant = this.cloneParticipant(DEFAULT_PARTICIPANT);
        this.tables.renderRows();
    }

    public cloneParticipant(toClone: Participant): Participant {
        return {
            name: toClone.name,
            dateOfbirth: toClone.dateOfbirth,
            nationality: toClone.nationality,
            sex: toClone.sex,
            role: toClone.role,
            salary: toClone.salary
        };
    }

    public addCeremony(): void {
        this.movie.honors.push(this.currentCeremony);
        this.currentCeremony = DEFAULT_CEREMONY;
        this.tables.renderRows();
    }

    public deleteParticipant(name: string): void {
        this.confirmationDialogService.confirm("Please confirm!", `Do you really want to delete ${name} ?`)
            .then((confirmation) => {
                if (confirmation) {
                    for (let i: number = 0; i < this.movie.participants.length; ++i) {
                        if (this.movie.participants[i].name === name) {
                            this.movie.participants.splice(i, 1);
                            this.tables.renderRows();

                            return;
                        }
                    }
                }
            });
    }

}
