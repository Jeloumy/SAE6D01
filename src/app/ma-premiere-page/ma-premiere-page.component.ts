import { Component } from '@angular/core';
import { AccesLibreService } from '../mes-services/acces-libre.service';

@Component({
  selector: 'app-ma-premiere-page',
  templateUrl: './ma-premiere-page.component.html',
  styleUrl: './ma-premiere-page.component.scss'
})
export class MaPremierePageComponent {
  /* filters = {
    enseigne: '',
    ville: '',
    handicaps: [] as string[] // Initialiser handicaps comme un tableau de chaînes
  }; */
  filters: any = {};
  results: any;
  handicapOptions = ['Auditif', 'Mental', 'Moteur', 'Visuel'];

  constructor(private accesLibreService: AccesLibreService) {}

  /* onCheckboxChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.filters.handicaps.push(value);
    } else {
      const index = this.filters.handicaps.indexOf(value);
      if (index > -1) {
        this.filters.handicaps.splice(index, 1);
      }
    }
  } */
  onCheckboxChange(event: any) {
    const value = event.target.value;
    if (!this.filters.handicaps) {
      this.filters.handicaps = [];
    }
    if (event.target.checked) {
      this.filters.handicaps.push(value);
    } else {
      const index = this.filters.handicaps.indexOf(value);
      if (index > -1) {
        this.filters.handicaps.splice(index, 1);
      }
    }
  }

  onSubmit() {
    const apiKey = 'oU6JwJ1T.himZfVvhB5F0JqY6YeU2A2cDbgbr0tzN'; // Remplace par ta clé d'API réelle
  
    this.accesLibreService.getErp(this.filters, apiKey).subscribe(data => {
      this.results = data;
    });
  }

  goToPage(url: string) {
    const apiKey = 'oU6JwJ1T.himZfVvhB5F0JqY6YeU2A2cDbgbr0tzN'; // Remplace par ta clé d'API réelle

    this.accesLibreService.getResultsByUrl(url, apiKey).subscribe(data => {
      this.results = data;
    });
  }
}