// playlist.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import fetchFromSpotify, { request } from "./api";

const AUTH_ENDPOINT = "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";
const SETTINGS_KEY = "game-settings"; 

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private authLoading: boolean = false;
  private token: string = "";
  private playlistId: string = '0pEnVifTRuyBoyaf4Z5LNk';
  private fullPlaylist: any[] = []; // Stores the full playlist for the current game
  private currentGamePlaylist: any[] = []; // Temporary playlist that removes songs as they’re played

  private settingsSubject = new BehaviorSubject<any>(this.loadSettings());
  private currentTrackImage: string = ""; // Store the current track's image URL

  constructor() {
    this.loadAuthToken();

    this.settingsSubject.subscribe(settings => {
      this.saveSettings(settings);
    });
  }

  setSettings(settings: any) {
    this.settingsSubject.next(settings);
  }

  getSettings() {
    return this.settingsSubject.asObservable();
  }

  getCurrentDifficulty(): string {
    return this.settingsSubject.value.difficulty;
  }

  private loadSettings(): any {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    return {
      difficulty: 'Easy',
      artist: 'None',
      decade: 'None'
    };
  }

  private saveSettings(settings: any): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  private loadAuthToken() {
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        this.authLoading = false;
        this.token = storedToken.value;
        return;
      }
    }

    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
    });
  }

  async initializeGamePlaylist(): Promise<void> {
    const settings = this.settingsSubject.value;
    const { difficulty, artist, decade } = settings;

    if (artist !== 'None') {
      this.playlistId = this.getArtistPlaylistId(artist);
    } else if (decade !== 'None') {
      this.playlistId = this.getDecadePlaylistId(decade);
    } else if (difficulty) {
      this.playlistId = '0pEnVifTRuyBoyaf4Z5LNk';
    }

    const response = await fetchFromSpotify({
      token: this.token,
      endpoint: `playlists/${this.playlistId}/tracks`,
      params: { limit: 50 }
    });

    const previewableTracks = response.items
      .map((item: any) => item.track)
      .filter((track: any) => track.preview_url);

    this.fullPlaylist = [...previewableTracks];
    this.currentGamePlaylist = [...this.fullPlaylist];
  }

  getRandomTrackForRound(): any {
    if (this.currentGamePlaylist.length === 0) {
      console.error("No more tracks available for this game.");
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.currentGamePlaylist.length);
    const randomTrack = this.currentGamePlaylist[randomIndex];
    this.currentGamePlaylist.splice(randomIndex, 1);

    // Store the image URL of the selected track
    this.currentTrackImage = randomTrack.album.images[0]?.url || ''; 

    console.log("Random Track Selected:", randomTrack); // Debugging line
    return randomTrack;
  }

  getCurrentTrackImage(): string {
    return this.currentTrackImage;
  }

  private getArtistPlaylistId(artist: string): string {
    switch (artist) {
      case 'Madonna': return '37i9dQZF1DZ06evO3OV3gs';
      case 'Britney Spears': return '37i9dQZF1DZ06evO1bSHqE';
      case 'Beyonce': return '37i9dQZF1DX2oU49YwtXI2';
      default: return '0pEnVifTRuyBoyaf4Z5LNk';
    }
  }

  private getDecadePlaylistId(decade: string): string {
    switch (decade) {
      case "90's": return '37i9dQZF1DWVcJK7WY4M52';
      case "00's": return '1udqwx26htiKljZx4HwVxs';
      case "10's": return '37i9dQZF1DX5Ejj0EkURtP';
      default: return '0pEnVifTRuyBoyaf4Z5LNk';
    }
  }
}


