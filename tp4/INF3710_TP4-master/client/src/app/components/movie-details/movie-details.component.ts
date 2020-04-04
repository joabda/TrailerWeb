import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Movie } from 'src/app/interfaces/movie';
import { Participant } from 'src/app/interfaces/participant';
import { Oscar } from 'src/app/interfaces/oscar';
import { BrowseService } from 'src/app/services/browse/browse.service';
import { Participation } from 'src/app/interfaces/participation';

export interface DatabaseParticipant {
    id: number,
    name: string,
    dateOfbirth: string,
    nationality: string,
    sex: string,
}

@Component({
    selector: 'app-movie-details',
    templateUrl: './movie-details.component.html',
    styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
    movie: Movie;
    databaseParticipant: DatabaseParticipant[];
    participants: Participant[];
    participations: Participation[];
    oscars: Oscar[];

    constructor(
        @Inject(MAT_DIALOG_DATA) data: Movie,
        private dialogRef: MatDialogRef<MovieDetailsComponent>,
        private browserService: BrowseService
    ) {
        this.movie = data;
    }

    async ngOnInit() {
        this.databaseParticipant = await this.browserService.getParticipants() as unknown as DatabaseParticipant[];
        this.participations = await this.browserService.getParticipations() as unknown as Participation[];
        this.getAllParticipations();
        this.getAllParticipants();
    }

    getAllParticipations(): void {
        this.participations = this.participations.filter((participation) => participation.movieId === this.movie.id);
    }

    getAllParticipants(): void {
        this.participants = new Array();
        this.databaseParticipant.forEach((participant) => {
            this.participations.forEach((participation) => {
                if (participant.id === participation.participantId) {
                    this.createParticipant(participant, participation);
                }
            });
        });
    }
    createParticipant(participant: DatabaseParticipant, participation: Participation) {
        const res: Participant = {
            name: participant.name ,
            dateOfbirth: participant.dateOfbirth,
            nationality: participant.nationality,
            sex: participant.sex,
            role: participation.role,
            salary: participation.salary  
        }
        this.participants.push(res);
    }

    closeDialog(): void {
        this.dialogRef.close(true);
    }
}
