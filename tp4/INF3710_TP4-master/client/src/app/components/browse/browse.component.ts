import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Movie } from "src/app/interfaces/movie";
import { BrowseService } from "src/app/services/browse/browse.service";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.css"]
})
export class BrowseComponent implements OnInit {

  public movies: Movie[];

  public constructor(
    private snacks: MatSnackBar,
    private router: Router,
    private service: BrowseService
    ) { }

  async ngOnInit() {
    const result = await this.service.getMovies(); 
    console.log(result);
    if(result.valueOf() === false) {
      this.snacks.open(
        "Please Sign In First", 
        "", 
        {
          duration: 3000,
          verticalPosition: "top",
          horizontalPosition: "center"
        }
      );
      this.router.navigate([""]);
    } else {
      this.movies = result as unknown as Movie[];
    }
  }

}
