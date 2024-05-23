import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  handleSearch(event: any): void {
    console.log('Recherche effectuée:', event);
    // Logique de recherche et mise à jour de la carte
  }
}
