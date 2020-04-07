import { Component, Inject, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { filter } from "rxjs/operators";
import { OrderType } from "src/app/enum/order-type";
import { CreditCard } from "src/app/interfaces/cc";
import { Movie } from "src/app/interfaces/movie";
import { Nomination } from "src/app/interfaces/nomination";
import { Oscar } from "src/app/interfaces/oscar";
import { Participant } from "src/app/interfaces/participant";
import { Participation } from "src/app/interfaces/participation";
import { BrowseService } from "src/app/services/browse/browse.service";
import { OrderComponent } from "../order/order.component";
import { TrailerComponent } from "../trailer/trailer.component";

export interface DatabaseParticipant {
    id: number;
    name: string;
    dateOfbirth: string;
    nationality: string;
    sex: string;
}

@Component({
    selector: "app-movie-details",
    templateUrl: "./movie-details.component.html",
    styleUrls: ["./movie-details.component.css"]
})
export class MovieDetailsComponent implements OnInit {
    public movie: Movie;
    public databaseParticipant: DatabaseParticipant[];
    public participants: Participant[];
    public participations: Participation[];
    public nominations: Nomination[];
    public oscars: Oscar[];

    public constructor(
        @Inject(MAT_DIALOG_DATA) data: Movie,
        private dialogRef: MatDialogRef<MovieDetailsComponent>,
        private browserService: BrowseService,
        private dialog: MatDialog,
    ) {
        this.movie = data;
    }

    public async ngOnInit(): Promise<void> {
        this.databaseParticipant = await this.browserService.getParticipants() as unknown as DatabaseParticipant[];
        this.participations = await this.browserService.getParticipations() as unknown as Participation[];
        this.nominations = await this.browserService.getNominations() as unknown as Nomination[];
        this.getAllParticipations();
        this.getAllParticipants();
        this.getNominations();
    }

    private getAllParticipations(): void {
        this.participations = this.participations.filter((participation) => participation.movieId === this.movie.id);
    }

    private getAllParticipants(): void {
        this.participants = new Array();
        this.databaseParticipant.forEach((participant) => {
            this.participations.forEach((participation) => {
                if (participant.id === participation.participantId) {
                    this.createParticipant(participant, participation);
                }
            });
        });
    }

    private createParticipant(participant: DatabaseParticipant, participation: Participation): void {
        const res: Participant = {
            name: participant.name,
            dateOfbirth: participant.dateOfbirth,
            nationality: participant.nationality,
            sex: participant.sex,
            role: participation.role,
            salary: participation.salary
        };
        this.participants.push(res);
    }

    private getNominations(): void {
        this.nominations = this.nominations.filter((nomination) => nomination.movieId === this.movie.id);
    }

    public async onClick(event: MatButton, type: OrderType): Promise<void> {
        this.browserService.isOrdered(this.movie.id).subscribe(async (res) => {
            if (res !== null && res.valueOf() != -1) {
                this.playMovie(this.movie, (res as any).stoppedat, (res as any).idorder);
            } else {
                this.orderMovie(this.movie, type);
            }
        });
    }

    private orderMovie(movie: Movie, type: OrderType): void {
        this.browserService.creditCards().subscribe((res) => {
            if (res !== null) {
                const reference = this.openOrderDialog(movie.title, res);
                reference.afterClosed().pipe(
                    filter((stopTime) => stopTime)
                ).subscribe((stopTime) => {
                    if (stopTime.buy) {
                        if (type === OrderType.Streaming) {
                            this.browserService.orderMovieStreaming({
                                movieID: movie.id,
                                dateOfOrder: new Date()
                            });
                        } else {
                            this.browserService.orderMovieDVD(movie.id, new Date());
                        }
                    }
                });
            }
        });
    }

    private openOrderDialog(title: string, ccs: CreditCard[]): MatDialogRef<OrderComponent> {
        return this.dialog.open(OrderComponent, {
            data: {
                title: title,
                cc: ccs
            }
        });
    }

    private playMovie(movie: Movie, currentTime: number, idorder: number): void {
        const reference = this.dialog.open(TrailerComponent, {
            data: {
                title: movie.title,
                id: movie.url.slice(0, movie.url.indexOf("?")),
                start: currentTime
            },
            width: "100%",
            height: "800px"
        });
        reference.afterClosed().pipe(
            filter((stopTime) => stopTime)
        ).subscribe((stopTime) => {
            const newURL = `${movie.url.slice(0, movie.url.indexOf("=") + 1)}${stopTime}`;
            this.browserService.changeCurrentTime(idorder, stopTime);
            this.movie.url = newURL; // A VOIR
        });
    }

    public closeDialog(): void {
        this.dialogRef.close(true);
    }
}
