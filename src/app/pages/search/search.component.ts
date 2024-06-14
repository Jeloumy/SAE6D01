import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchResults: any;

  onSearchResults(results: any): void {
    this.searchResults = results;
  }
}
