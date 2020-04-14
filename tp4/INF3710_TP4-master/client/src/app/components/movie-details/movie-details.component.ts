import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Movie } from "src/app/interfaces/movie";
import { Nomination } from "src/app/interfaces/nomination";
import { Oscar } from "src/app/interfaces/oscar";
import { Participant } from "src/app/interfaces/participant";
import { Participation } from "src/app/interfaces/participation";
import { BrowseService } from "src/app/services/browse/browse.service";

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
        protected snacks: MatSnackBar
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

    public closeDialog(): void {
        this.dialogRef.close(true);
    }
}
