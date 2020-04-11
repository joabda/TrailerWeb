import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { YOUTUBE_API } from "src/app/classes/constants";
import { Trailer } from "src/app/interfaces/trailer";

@Component({
    selector: "app-trailer",
    templateUrl: "./trailer.component.html",
    styleUrls: ["./trailer.component.css"]
})
export class TrailerComponent implements OnInit {

    public player: YT.Player;

    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: Trailer,
        private dialogRef: MatDialogRef<TrailerComponent>) {
        dialogRef.beforeClosed().subscribe(() => this.close());
    }

    public ngOnInit(): void {
        if (window["YT"]) {
            this.startVideo();

            return;
        }
        const tag = document.createElement("script");
        tag.src = YOUTUBE_API;
        const firstScriptTag = document.getElementsByTagName("script")[0] as HTMLScriptElement;
        (firstScriptTag.parentNode as Node).insertBefore(tag, firstScriptTag);
        window["onYouTubeIframeAPIReady"] = () => this.startVideo();
    }

    public startVideo(): void {
        this.player = new window["YT"].Player("player", {
            videoId: this.data.id,
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                controls: 1,
                disablekb: 1,
                rel: 0,
                showinfo: 0,
                fs: 0,
                playsinline: 1,
                start: this.data.start,
            },
            width: "1080",
            height: "600",
        });
    }

    public close(): void {
        this.dialogRef.close(Math.round(this.player.getCurrentTime()));
    }
}
