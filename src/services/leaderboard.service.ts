import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private leaderboard: { name: string; score: number }[] = [];

  constructor() {
    // Load leaderboard from localStorage on initialization
    const storedLeaderboard = localStorage.getItem('leaderboard');
    if (storedLeaderboard) {
      this.leaderboard = JSON.parse(storedLeaderboard);
    }
  }

  newScore(name: string, score: number): void {
    const newGameScore = { name, score };
    this.leaderboard.push(newGameScore);
    this.leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard));
  }

  getLeaderboard(): { name: string; score: number }[] {
    return this.leaderboard;
  }

  clearLeaderboard(): void {
    this.leaderboard = [];
    localStorage.removeItem('leaderboard');
  }
}



