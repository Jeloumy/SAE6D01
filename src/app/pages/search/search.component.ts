import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchResults: any;
  filters: any = {}; 

  onSearchResults(results: any, filters: any): void { 
    this.searchResults = results;
    this.filters = filters; 
    console.log('Résultats de la recherche:', results);
    console.log('Filtres de la recherche:', filters);
  }
}
