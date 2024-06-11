import { Component, OnInit } from '@angular/core';
import { AccesLibreService } from '../../services/acces-libre/acces-libre.service';
import { ERP } from '../../models/definitions';

@Component({
  selector: 'app-erp-list',
  templateUrl: './erp-list.component.html',
  styleUrls: ['./erp-list.component.scss'],
})
export class ErpListComponent implements OnInit {
  erpList: ERP[] = [];

  constructor(private accesLibreService: AccesLibreService) {}

  ngOnInit(): void {
    this.getErpList();
  }

  async getErpList(): Promise<void> {
    const lastSearchResults = this.accesLibreService.getLastSearchResults();
    if (lastSearchResults) {
      this.erpList = lastSearchResults.results;
    } else {
      try {
        const response = await this.accesLibreService.getErp({ communeQuery: 'calvisson' }).toPromise();
        this.erpList = response.results;
      } catch (error) {
        console.error('Error fetching ERP list:', error);
        // Gérer l'erreur ici (par exemple, afficher un message d'erreur à l'utilisateur)
      }
    }
  }

  logLastSearchResults(): void {
    const lastSearchResults = this.accesLibreService.getLastSearchResults();
    if (lastSearchResults) {
      console.log('Derniers résultats de recherche:', lastSearchResults);
    } else {
      console.log('Aucun résultat de recherche disponible.');
    }
  }

  getRandomColorImageUrl(nom: string): string {
    const colorHex = this.getRandomColorHex();
    return `https://placehold.co/300x300/${colorHex}/white?text=${nom}`;
  }

  private getRandomColorHex(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}
