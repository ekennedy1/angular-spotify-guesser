import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PlaylistService } from 'src/services/playlist.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @Output() savedSettings: EventEmitter<any> = new EventEmitter<any>();

  difficulties = ['Easy', 'Hard'];
  artists = ['None','Madonna', 'Britney Spears', 'Beyonce'];
  decades = ['None','90\'s', '00\'s', '10\'s'];

  selectedDifficulty = 'Easy';
  selectedArtist = 'None';
  selectedDecade = 'None';

  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.playlistService.getSettings().subscribe(settings => {
      if (settings) {
        this.selectedDifficulty = settings.difficulty;
        this.selectedArtist = settings.artist;
        this.selectedDecade = settings.decade;
      }
    });
  }

  saveSettings() {
    const settings = {
      difficulty: this.selectedDifficulty,
      artist: this.selectedArtist,
      decade: this.selectedDecade
    };
    console.log("Settings saved:", settings);
    this.playlistService.setSettings(settings);
    this.savedSettings.emit(settings);
  }

  onArtistSelect() {
    if (this.selectedArtist !== 'None') {
      this.selectedDecade = 'None';
    }
  }

  onDecadeSelect() {
    if (this.selectedDecade !== 'None') {
      this.selectedArtist = 'None';
    }
  }
}

