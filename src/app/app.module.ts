import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { SettingsComponent } from './settings/settings.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { MusicPlayerComponent } from './music-player/music-player.component';

const routes: Routes = [{ path: "", component: HomeComponent }];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    LeaderboardComponent,
    NavbarComponent,
    MusicPlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
