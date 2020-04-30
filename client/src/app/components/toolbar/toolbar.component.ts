import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Token } from "src/app/enum/token";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.css"]
})
export class ToolbarComponent {
  public constructor(
    private snacks: MatSnackBar,
    private router: Router
    ) { }

  public goHome(): void {
    this.router.navigate(["browse"]);
  }

  public logout(): void {
    localStorage.setItem(Token.id, "");
    this.router.navigate([""]);
    this.snacks.open(
      "See you tomorrow!",
      "",
      {
        duration: 3000,
        verticalPosition: "top"
      }
    );
  }
}
