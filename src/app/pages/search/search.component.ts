import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchFormComponent } from '../../components/search-form/search-form.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('searchForm') searchForm!: SearchFormComponent;

  searchResults: any;
  showMap: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchQuery = params['searchQuery'] || '';
      const communeQuery = params['communeQuery'] || '';
      // Ajoutez d'autres paramètres si nécessaire
      if (searchQuery || communeQuery) {
        // Déclenchez la recherche automatique avec les paramètres de la query string
        this.searchForm.setSearchParams(searchQuery, communeQuery);
      }
    });
  }

  onSearchResults(results: any): void {
    this.searchResults = results;
    console.log('Résultats de la recherche:', results);
    console.log(this.showMap);
    console.log(this.searchResults.length);
    console.log(this.searchResults);
  }

  toggleView(): void {
    this.showMap = !this.showMap;
  }
}
