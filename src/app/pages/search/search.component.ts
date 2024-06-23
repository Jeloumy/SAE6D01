import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { ProfileService } from '../../services/profile/profile.service';
import { SpeechService } from '../../services/speech/speech.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild('searchForm') searchForm!: SearchFormComponent;

  searchResults: any;
  showMap: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private profileService: ProfileService, private speechService: SpeechService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const searchQuery = params['searchQuery'] || '';
      const communeQuery = params['communeQuery'] || '';
      // Ajoutez d'autres paramètres si nécessaire
      if (searchQuery || communeQuery) {
        // Déclenchez la recherche automatique avec les paramètres de la query string
        this.searchForm.setSearchParams(searchQuery, communeQuery);
      }
    });

    const initialProfile = this.profileService.getCurrentProfile();
    if (initialProfile?.systemPreferences?.voiceCommands) {
      this.continousListening();
    } else {
      this.stopContinuousListening();
    }
  }

  continousListening(): void {
    console.log('Start listening button clicked');
    this.speechService.continuousListening();
  }

  stopContinuousListening(): void {
    this.speechService.stopContinuousListening();
  }

  onSearchResults(results: any): void {
    this.searchResults = results;
  }

  toggleView(): void {
    this.showMap = !this.showMap;
  }
}
