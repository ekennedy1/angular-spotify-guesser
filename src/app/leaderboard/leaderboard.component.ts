import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: { name: string; score: number }[] = [];

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit(): void {
    this.leaderboard = this.leaderboardService.getLeaderboard();
  }

  clearLeaderboard(): void {
    this.leaderboardService.clearLeaderboard();
    this.leaderboard = [];
  }
}

