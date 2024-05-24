import { Component } from '@angular/core';
import { AccesLibreService } from '../mes-services/acces-libre.service';

@Component({
  selector: 'app-ma-premiere-page',
  templateUrl: './ma-premiere-page.component.html',
  styleUrls: ['./ma-premiere-page.component.scss']
})
export class MaPremierePageComponent {
  filters: any = {
    /* quantity: 1, */
    handicaps: [] as string[], // Initialiser handicaps comme un tableau de chaînes
    zone: [4.268188476562501,48.16242149265213,4.74884033203125,48.43648995594418]
  };
  results: any;
  filteredResults: any;

  mapping: any = {
    'Chemin vers l\'accueil accessible' : 'having_accessible_exterior_path',
    'Dispositif d\'appel à l\'entrée' : 'having_entry_call_device',
    'Proximité de l\'accueil' : 'having_visible_reception',
    'Présence de personnel' : 'having_staff',
    'Personnel sensibilisé ou formé' : 'having_trained_staff',
    'Audiodescription' : 'having_audiodescription',
    'Equipements spécifiques pour personne malentendante' : 'having_hearing_equipments',
    'Chemin sans rétrécissement jusqu\'à l\'accueil ou information inconnue' : 'having_entry_no_shrink',
    'Chambre accessible' : 'having_accessible_rooms',
    'Toilettes PMR' : 'having_adapted_wc',
    'Établissement labellisé' : 'having_label',
    'Stationnement à proximité' : 'having_parking',
    'Transport en commun à proximité' : 'having_public_transportation',
    'Stationnement PMR (dans l\'établissement ou à proximité)' : 'having_adapted_parking',
    'Maximum une marche à l\'entrée' : 'having_path_low_stairs',
    'Maximum une marche à l\'accueil' : 'having_entry_low_stairs',
    'Entrée accessible' : 'having_accessible_entry',
    'Largeur de porte supérieure à 80cm ou information inconnue' : 'having_entry_min_width',
    'Entrée spécifique PMR' : 'having_adapted_entry',
    'Balise sonore' : 'having_sound_beacon',
    'Pas de chemin extérieur ou information inconnue' : 'having_no_path',
    'Chemin adapté aux personnes mal marchantes' : 'having_adapted_path',
    'Extérieur - plain-pied ou accessible via rampe ou ascenseur' : 'having_reception_low_stairs',
    'Chemin extérieur accessible' : 'having_accessible_path_to_reception',
    'Extérieur - bande de guidage' : 'having_guide_band'
  };

  constructor(private accesLibreService: AccesLibreService) {}

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
    const apiKey = 'oU6JwJ1T.himZfVvhB5F0JqY6YeU2A2cDbgbr0tzN';

    this.accesLibreService.getErp(this.filters, apiKey).subscribe(data => {
      this.results = data;
    });
  }

  goToPage(url: string) {
    const apiKey = 'oU6JwJ1T.himZfVvhB5F0JqY6YeU2A2cDbgbr0tzN';

    this.accesLibreService.getResultsByUrl(url, apiKey).subscribe(data => {
      this.results = data;
    });
  }
}