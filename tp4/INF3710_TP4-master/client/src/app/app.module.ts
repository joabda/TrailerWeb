import {CdkStepperModule} from "@angular/cdk/stepper";
import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { YouTubePlayerModule } from "@angular/youtube-player";
import { JwtModule } from "@auth0/angular-jwt";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { AppComponent } from "./app.component";
import { appRoutingModule } from "./app.routing";
import { BrowseComponent } from "./components/browse/browse.component";
import { HomeComponent } from "./components/home/home.component";
import { SignInComponent } from "./components/sign-in/sign-in.component";
import { OrderComponent } from "./components/order/order.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { TrailerComponent } from "./components/trailer/trailer.component";
import { DataService } from "./services/data/data.service";
import { ManageComponent } from './components/manage/manage.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from "@angular/material/sort";
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from "./services/confirmation-dialog/confirmation-dialog.service";
import { AddUserComponent } from './components/add-user/add-user.component';
import { AddMovieComponent } from './components/add-movie/add-movie.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    BrowseComponent,
    ToolbarComponent,
    TrailerComponent,
    OrderComponent,
    ManageComponent,
    ConfirmationDialogComponent,
    AddUserComponent,
    AddMovieComponent,
    MovieDetailsComponent,
  ],
  imports: [
    MatSortModule,
    MatTableModule,
    MatInputModule,
    CdkStepperModule,
    ReactiveFormsModule,
    YouTubePlayerModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatGridListModule,
    MatMenuModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    appRoutingModule,
    MatDialogModule,
    NgbModalModule,
    MatSnackBarModule,
    MatCardModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
             return     localStorage.getItem("access_token"); },
        whitelistedDomains: ["localhost:3000"],                       // Public API
        blacklistedRoutes: ["http://localhost:3000/auth/login"]       // SECURED ROUTES
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [
    DataService, 
    DatePipe,
    ConfirmationDialogService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
