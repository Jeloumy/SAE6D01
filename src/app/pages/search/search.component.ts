import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchResults: any;
  showMap: boolean = true;

  onSearchResults(results: any): void {
    this.searchResults = results;
    console.log('Résultats de la recherche:', results);
    console.log(this.showMap);
    console.log(this.searchResults.length)
    console.log(this.searchResults)
  }

  toggleView(): void {
    this.showMap = !this.showMap;
  }
}
