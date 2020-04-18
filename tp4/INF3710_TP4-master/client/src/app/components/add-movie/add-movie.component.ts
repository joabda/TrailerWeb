import { DatePipe } from "@angular/common";
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import {
    ALL_CATEGORIES, ALL_NOMINATIONS, ALL_ROLES, DEFAULT_CEREMONY, DEFAULT_MOVIE,
    DEFAULT_PARTICIPANT
} from "src/app/classes/constants";
import { ALL_COUNTRIES } from "src/app/classes/countries";
import { Category } from "src/app/enum/category";
import { HTTP } from "src/app/enum/http-codes";
import { NominationCategory } from "src/app/enum/nomination-category";
import { Role } from "src/app/enum/role";
import { Actor } from "src/app/interfaces/actor";
import { FormMovie } from "src/app/interfaces/form-movie";
import { Oscar } from "src/app/interfaces/oscar";
import { Participant } from "src/app/interfaces/participant";
import { ConfirmationDialogService } from "src/app/services/confirmation-dialog/confirmation-dialog.service";
import { ManageService } from "src/app/services/manage/manage.service";

@Component({
    selector: "app-add-movie",
    templateUrl: "./add-movie.component.html",
    styleUrls: ["./add-movie.component.css"]
})
export class AddMovieComponent implements OnInit {

    public allCountries: string[];
    public allCategories: NominationCategory[];
    public allActors: Actor[];
    public roles: Role[];
    public movie: FormMovie;
    public currentParticipant: Participant;
    public currentCeremony: Oscar;
    public categories: Category[];
    public urlRegEx: RegExp = new RegExp(/^(https?|ftp|torrent|image|irc):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i);

    public displayedColumns: string[] = ["name", "role", "delete"];
    public displayedColumns2: string[] = ["host", "date", "delete"];
    public dataSource: MatTableDataSource<unknown> = new MatTableDataSource();
    public loading: boolean;
    @ViewChild(MatSort, { static: true }) public sort: MatSort;
    @ViewChildren(NgForm) public forms: QueryList<NgForm>;
    @ViewChildren(MatTable) public tables: QueryList<MatTable<any>>;

    public constructor(
        private dateConverter: DatePipe,
        private confirmationDialogService: ConfirmationDialogService,
        private service: ManageService,
        private snacks: MatSnackBar
    ) {
        this.loading = false;
        this.movie = DEFAULT_MOVIE;
        this.currentParticipant = this.cloneParticipant(DEFAULT_PARTICIPANT);
        this.currentCeremony = this.cloneCeremony(DEFAULT_CEREMONY);
        this.categories = ALL_CATEGORIES;
        this.allCountries = ALL_COUNTRIES;
        this.roles = ALL_ROLES;
        this.allCategories = ALL_NOMINATIONS;
        this.dataSource.sort = this.sort;
    }

    public async ngOnInit(): Promise<void> {
        this.allActors = await this.service.getActors() as Actor[];
    }

    public async addMovie(): Promise<void> {
        if (!this.valid()) {
            this.openSnack(`Please correct the form before submitting!`);
            return;
        }
        this.loading = true;
        await this.service.addMovie(
            this.movie.title,
            this.movie.category,
            this.movie.productionDate,
            this.movie.duration,
            this.movie.dvdPrice,
            this.movie.streamingFee,
            this.movie.movieURL,
            this.movie.imageURL
        )
            .toPromise()
            .then((res) => {
                if (res === HTTP.Error) {
                    this.loading = false;
                    this.openSnack("Error couldn't add movie");

                    return;
                }
                const movieID = res.rows[0].max + 1;
                if (this.movie.honors.length === 0 && this.movie.participants.length === 0) {
                    this.resetMovie();
                }
                for (const participant of this.movie.participants) {
                    const actorID = this.actorExists(participant.name);
                    if (actorID === -1) {
                        this.service.addParticipant(participant, movieID).subscribe((res) => {
                            if (res === HTTP.Error) {
                                this.snacks.open("Sorry couldn't add participant " + participant.name);
                            }
                            if (this.movie.honors.length === 0 && participant === this.movie.participants[this.movie.participants.length - 1]) {
                                this.resetMovie();
                            }
                        });
                    } else {
                        this.service.addParticipation(actorID, participant.role, participant.salary, movieID).subscribe((res) => {
                            if (res === HTTP.Error) {
                                this.snacks.open("Sorry couldn't add participant " + participant.name);
                            }
                            if (this.movie.honors.length === 0 && participant === this.movie.participants[this.movie.participants.length - 1]) {
                                this.resetMovie();
                            }
                        });
                    }
                }
                for (const ceremony of this.movie.honors) {
                    this.service.addCeremony(ceremony, movieID).subscribe((res) => {
                        if (res === HTTP.Error) {
                            this.snacks.open("Sorry couldn't add ceremony and honor");
                        }
                        if (ceremony === this.movie.honors[this.movie.honors.length - 1]) {
                            this.resetMovie();
                        }
                    });
                }
            }).catch(() => {
                this.loading = false;
                this.openSnack("Error couldn't add movie");
            });
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
        this.movie.participants.push(this.cloneParticipant(this.currentParticipant));
        this.currentParticipant = this.cloneParticipant(DEFAULT_PARTICIPANT);
        this.tables.first.renderRows();
        this.forms.toArray()[1].resetForm();
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

    public async addCeremony(): Promise<void> {
        this.movie.honors.push(this.cloneCeremony(this.currentCeremony));
        this.currentCeremony = this.cloneCeremony(DEFAULT_CEREMONY);
        this.tables.last.renderRows();
        this.forms.last.resetForm();
    }

    public cloneCeremony(toClone: Oscar): Oscar {
        return {
            date: toClone.date,
            location: toClone.location,
            host: toClone.host,
            winner: toClone.winner,
            category: toClone.category
        };
    }

    public deleteParticipant(name: string): void {
        this.confirmationDialogService.confirm("Please confirm!", `Do you really want to delete ${name} ?`)
            .then((confirmation) => {
                if (confirmation) {
                    for (let i: number = 0; i < this.movie.participants.length; ++i) {
                        if (this.movie.participants[i].name === name) {
                            this.movie.participants.splice(i, 1);
                            this.tables.first.renderRows();

                            return;
                        }
                    }
                }
            });
    }

    public deleteNomination(date: string): void {
        this.confirmationDialogService.confirm("Please confirm!", `Do you really want to delete ${name}'s Ceremony ?`)
            .then((confirmation) => {
                if (confirmation) {
                    for (let i: number = 0; i < this.movie.participants.length; ++i) {
                        if (this.movie.honors[i].date === date) {
                            this.movie.honors.splice(i, 1);
                            this.tables.last.renderRows();

                            return;
                        }
                    }
                }
            });
    }

    private resetMovie(): void {
        this.snacks.open("Movie has been added");
        this.forms.first.resetForm();
        this.loading = false;
    }

    private actorExists(actorName: string): number {
        for (const actor of this.allActors) {
            if (actor.name.toLowerCase() === actorName.toLowerCase()) {
                return actor.id;
            }
        }
        return -1;
    }

    private valid(): boolean {
        return (
            true
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
