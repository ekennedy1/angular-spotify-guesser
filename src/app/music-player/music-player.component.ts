import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Howl } from 'howler';
import fetchFromSpotify from '../../services/api';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css'],
})
export class MusicPlayerComponent implements OnChanges {
  @Input() trackId: string = '';
  private howl?: Howl;
  isPlaying: boolean = false; 
  loading: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trackId'] && this.trackId) {
      this.loadTrack(this.trackId);
    }
  }

  async loadTrack(trackId: string) {
    try {
      this.loading = true;
      this.stop(); // Stop any existing track before loading a new one

      const storedToken = JSON.parse(localStorage.getItem('whos-who-access-token') || '{}');
      const token = storedToken.value;

      const trackData = await fetchFromSpotify({
        token: token,
        endpoint: `tracks/${trackId}`,
      });

      const previewUrl = trackData.preview_url;
      if (previewUrl) {
        this.howl = new Howl({
          src: [previewUrl],
          html5: true,
          onplay: () => {
            this.isPlaying = true;
          },
          onpause: () => {
            this.isPlaying = false;
          },
          onend: () => {
            this.isPlaying = false;
          },
          onload: () => {
            this.loading = false;
          },
          onloaderror: (id, error) => {
            console.error("Failed to load track:", error);
            this.loading = false;
          }
        });
      } else {
        console.error("No preview URL available for this track.");
      }
    } catch (error) {
      console.error('Failed to fetch track data:', error);
      this.loading = false;
    }
  }

  togglePlayPause() {
    if (this.howl) {
      if (this.isPlaying) {
        this.howl.pause();
      } else {
        this.howl.play();
      }
    }
  }

  stop() {
    if (this.howl) {
      this.howl.stop();
      this.isPlaying = false;
    }
  }
}

