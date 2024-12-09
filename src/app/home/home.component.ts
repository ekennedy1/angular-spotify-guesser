// home.component.ts

import { Component, OnInit, ViewChild } from "@angular/core";
import { PlaylistService } from '../../services/playlist.service';
import { MusicPlayerComponent } from '../music-player/music-player.component';
import { LeaderboardService } from "src/services/leaderboard.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  playlists: any[] = [];
  trackId: string = "";
  currentSongName: string = "";
  userGuess: string = "";
  guessResult: string = "";
  gameStarted: boolean = false;
  correctAnswerDisplay: string = "";
  correctCount: number = 0;
  wrongCount: number = 0;
  roundNumber: number = 1;
  maxRounds: number = 5;
  gameOverMessage: string = "";
  guessSubmitted: boolean = false;

  playerName: string = "";
  nameSubmitted: boolean = false;

  // Image properties
  placeholderImage: string = "assets/ab67616d00001e020693793cccddc087df357645.jfif";
  currentImage: string = this.placeholderImage; // Initially set to placeholder

  @ViewChild(MusicPlayerComponent) musicPlayer?: MusicPlayerComponent;

  constructor(
    public playlistService: PlaylistService,
    private leaderboardService: LeaderboardService
  ) {}

  ngOnInit(): void {}

  async startGame() {
    this.gameStarted = true;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.roundNumber = 1;
    this.gameOverMessage = "";

    await this.playlistService.initializeGamePlaylist();

    this.currentImage = this.placeholderImage; // Reset to placeholder at the start of the game
    this.loadRandomSong();
  }

  async loadRandomSong() {
    if (this.musicPlayer) {
      this.musicPlayer.stop();
    }

    const track = this.playlistService.getRandomTrackForRound();
    if (track) {
      this.trackId = track.id;
      this.currentSongName = track.name;
      this.currentImage = this.placeholderImage; // Set placeholder image for each new round
      console.log("Playing track ID:", this.trackId, "Song Name:", this.currentSongName);
      this.guessSubmitted = false;
      this.correctAnswerDisplay = "";
    } else {
      console.error("No track available to play.");
      this.gameOverMessage = "No tracks available. Please check playlist settings.";
      this.gameStarted = false; 
    }
  }

  checkGuess() {
    const normalizedGuess = normalizeString(this.userGuess);
    const normalizedSongName = normalizeString(this.currentSongName);

    console.log("Normalized User Guess:", normalizedGuess);
    console.log("Normalized Song Name:", normalizedSongName);

    this.correctAnswerDisplay = this.currentSongName;

    if (normalizedGuess === normalizedSongName) {
      this.guessResult = "Correct";
      this.correctCount++;
    } else {
      this.guessResult = "Wrong";
      this.wrongCount++;
    }

    this.guessSubmitted = true;

    // Display the Spotify song image after the guess is submitted
    const trackImageUrl = this.playlistService.getCurrentTrackImage();
    if (trackImageUrl) {
      this.currentImage = trackImageUrl;
    }

    if (this.roundNumber >= this.maxRounds) {
      this.endGame();
    }
  }

  nextRound() {
    if (this.roundNumber < this.maxRounds) {
      this.roundNumber++;
      this.guessResult = "";
      this.userGuess = "";
      this.correctAnswerDisplay = "";

      // Reset to the placeholder image at the start of the next round
      this.currentImage = this.placeholderImage;

      this.loadRandomSong();
    }
  }

  endGame() {
    this.gameStarted = false;
    if (this.correctCount >= 10) {
      this.gameOverMessage = `Congratulations! You win! Score: ${this.correctCount} out of ${this.maxRounds}`;
    } else {
      this.gameOverMessage = `Game Over. You lose. Score: ${this.correctCount} out of ${this.maxRounds}`;
    }
    if (this.playerName.trim()) {
      this.leaderboardService.newScore(this.playerName, this.correctCount);
      this.nameSubmitted = true;
    } else {
      console.warn("Player name is empty, score not added to leaderboard.");
    }
  }

  submitName() {
    if (this.playerName.trim()) {
      this.leaderboardService.newScore(this.playerName, this.correctCount);
      this.nameSubmitted = true;
    } else {
      alert("Please enter your name to submit the score.");
    }
  }
}

// Utility function for normalizing strings
function normalizeString(input: string): string {
  input = input.replace(/(\s*feat\.|\s*featuring).*/i, "");
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

