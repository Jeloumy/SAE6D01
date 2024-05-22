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
  handicapOptions = [
    'Dispositif d\'appel à l\'entrée',
    'Proximité de l\'accueil',
    'Présence de personnel',
    'Personnel sensibilisé ou formé',
    'Audiodescription',
    'Equipements spécifiques pour personne malentendante',
    'Chemin sans rétrécissement jusqu\'à l\'accueil ou information inconnue',
    'Chambre accessible',
    'Toilettes PMR',
    'Établissement labellisé',
    'Stationnement à proximité',
    'Transport en commun à proximité',
    'Stationnement PMR (dans l\'établissement ou à proximité)',
    'Maximum une marche à l\'entrée',
    'Maximum une marche à l\'accueil',
    'Entrée accessible',
    'Largeur de porte supérieure à 80cm ou information inconnue',
    'Entrée spécifique PMR',
    'Balise sonore',
    'Pas de chemin extérieur ou information inconnue',
    'Chemin adapté aux personnes mal marchantes',
    'Extérieur - plain-pied ou accessible via rampe ou ascenseur',
    'Chemin extérieur accessible',
    'Extérieur - bande de guidage'
  ];
  mapping = {
    'Dispositif d\'appel à l\'entrée' : 'entree_dispositif_appel',
    'Proximité de l\'accueil' : '',
    'Présence de personnel' : '',
    'Personnel sensibilisé ou formé' : 'accueil_personnels',
    'Audiodescription' : 'accueil_audiodescription_presence',
    'Equipements spécifiques pour personne malentendante' : 'accueil_equipements_malentendants_presence',
    'Chemin sans rétrécissement jusqu\'à l\'accueil ou information inconnue' : 'cheminement_ext_retrecissement',
    'Chambre accessible' : 'accueil_chambre_nombre_accessibles',
    'Toilettes PMR' : 'sanitaires_adaptes',
    'Établissement labellisé' : 'labels',
    'Stationnement à proximité' : 'stationnement_presence',
    'Transport en commun à proximité' : 'transport_station_presence',
    'Stationnement PMR (dans l\'établissement ou à proximité)' : 'stationnement_pmr',
    'Maximum une marche à l\'entrée' : 'entree_marches',
    'Maximum une marche à l\'accueil' : 'accueil_cheminement_nombre_marches',
    'Entrée accessible' : 'entree_pmr',
    'Largeur de porte supérieure à 80cm ou information inconnue' : 'entree_porte_type',
    'Entrée spécifique PMR' : 'entree_pmr_informations',
    'Balise sonore' : 'entree_balise_sonore',
    'Pas de chemin extérieur ou information inconnue' : 'cheminement_ext_presence',
    'Extérieur - plain-pied ou accessible via rampe ou ascenseur' : 'cheminement_ext_plain_pied',
    'Chemin extérieur accessible' : 'cheminement_ext_presence',
    'Extérieur - bande de guidage': 'cheminement_ext_bande_guidage'
  };
  
  

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