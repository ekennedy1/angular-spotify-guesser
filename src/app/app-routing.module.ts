import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'settings', component: SettingsComponent },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
