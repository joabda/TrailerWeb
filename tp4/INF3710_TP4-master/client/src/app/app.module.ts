import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
// import { CommunicationService } from "./communication.service";
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { appRoutingModule } from './app.routing';
import { BrowseComponent } from "./components/browse/browse.component";
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    BrowseComponent,
    ToolbarComponent,
  ],
  imports: [
    MatToolbarModule,
    CommonModule,
    BrowserModule,
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
             return     localStorage.getItem('access_token');},
        whitelistedDomains: ['localhost:3000'],                       // Public API
        blacklistedRoutes: ['http://localhost:3000/auth/login']       // SECURED ROUTES
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
