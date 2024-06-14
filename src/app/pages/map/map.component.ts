import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import Swal from 'sweetalert2';
import { ThemeService } from '../../services/theme/theme.service';
import { ProfileService } from '../../services/profile/profile.service'; // Import ProfileService
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('map', { static: false }) private mapContainer!: ElementRef<HTMLDivElement>;
  @Input() results: any;
  @Output() locationDetected = new EventEmitter<void>();

  private map!: L.Map;
  private markersLayer!: L.LayerGroup;
  private layerControl!: L.Control.Layers;
  private layers: { [name: string]: L.TileLayer } = {
    OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }),
    'CartoDB Dark': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }),
    'Stadia.StamenTonerLite': L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen-toner-lite/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
    }),
  };

  private themeSubscription: Subscription | undefined;
  private profileSubscription: Subscription | undefined;

  constructor(private themeService: ThemeService, private profileService: ProfileService) {} // Inject ProfileService

  ngOnInit(): void {
    this.themeSubscription = this.themeService.themeChange.subscribe(theme => {
      this.setMapLayer(theme);
    });
    this.profileSubscription = this.profileService.currentProfile$.subscribe(profile => {
      if (profile) {
        const theme = profile.systemPreferences?.highContrast ? 'contrast' :
                      profile.systemPreferences?.darkMode ? 'dark' : 'light';
        this.themeService.setTheme(theme);
      }
    });
    this.applyCurrentTheme(); // Appliquer le thème actuel lors de l'initialisation
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.applyCurrentTheme(); 
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results'] && this.results) {
      this.updateMarkers();
    }
  }

  private initMap(): void {
    const franceCenter: L.LatLngExpression = [46.603354, 1.888334];
    const franceBounds: L.LatLngBoundsLiteral = [
      [41.33, -5.14],
      [51.124, 9.662],
    ];

    this.map = L.map(this.mapContainer.nativeElement, {
      maxBounds: franceBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 5,
    }).setView(franceCenter, 5);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.layerControl = L.control.layers(this.layers).addTo(this.map);

    // Move the control to a custom position
    const controlContainer = this.layerControl.getContainer();
    if (controlContainer) {
      controlContainer.style.position = 'absolute';
      controlContainer.style.top = '100px'; // Adjust this value to position it lower
      controlContainer.style.right = '10px'; // Adjust this value to position it to the right

      const mapContainer = this.mapContainer.nativeElement;
      mapContainer.appendChild(controlContainer);
    }
  }

  private applyCurrentTheme(): void {
    const currentTheme = this.themeService.getTheme();
    this.setMapLayer(currentTheme);
  }

  public updateMarkers(): void {
    this.markersLayer.clearLayers();

    let newMarkers = new L.LatLngBounds([]);

    if (this.results && this.results.results) {
      this.results.results.forEach((result: any) => {
        const { geom, nom, adresse, activite } = result;
        if (geom && geom.coordinates && geom.coordinates.length === 2) {
          const [longitude, latitude] = geom.coordinates;

          const iconHtml = this.getIconHtml(activite.nom);
          const icon = L.divIcon({
            html: iconHtml,
            className: 'custom-div-icon',
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -35],
          });

          const marker = L.marker([latitude, longitude], { icon }).bindPopup(`<b>${nom}</b><br>${adresse}`);

          this.markersLayer.addLayer(marker);

          newMarkers.extend([latitude, longitude]);
        } else {
          console.error(`Invalid coordinates for result: ${nom}`, result);
        }
      });
    }

    if (newMarkers.isValid()) {
      this.map.flyToBounds(newMarkers, {
        animate: true,
        duration: 2,
        easeLinearity: 0.25,
      });
    }
  }

  private getIconHtml(activity: string): string {
    const icons: { [key: string]: string } = {
      'musée': 'fa-landmark',
      'restaurant': 'fa-utensils',
      'hôtel': 'fa-solid fa-hotel',
      'cinéma': 'fa-film',
      'théâtre': 'fa-theater-masks',
      'bibliothèque': 'fa-book',
      'parc': 'fa-tree',
      'hôpital': 'fa-hospital',
      'pharmacie': 'fa-prescription-bottle-alt',
      'école': 'fa-school',
      'collège': 'fa-school',
      'lycée': 'fa-school',
      'magasin': 'fa-store',
      'bar': 'fa-beer',
      'boulangerie': 'fa-bread-slice',
      'café': 'fa-mug-saucer',
      'supermarché': 'fa-basket-shopping',
      'sport': 'fa-dumbbell',
      'vetement': 'fa-shirt',
      'photo': 'fa-camera',
      'beauté': 'fa-spa',
      'jeu vidéo': 'fa-gamepad',
      'chocolatier': 'fa-candy-cane',
      'confisier': 'fa-candy-cane',
      'bijou': 'fa-gem',
      'restauration rapide': 'fa-burger',
      'opticien': 'fa-glasses',
      'Auto école': 'fa-car-side',
      'art': 'fa-palette',
      'coiffeur': 'fa-scissors',
    };

    for (const pattern in icons) {
      const regex = new RegExp(pattern); // Convertir la chaîne de caractères en regex
      if (regex.test(activity.toLowerCase())) {
        return '<span class="fa-stack fa-xl"> <i class="fa-solid fa-location-pin fa-stack-2x" style="color: #134e4a;"></i> <i class="fa-solid ' + icons[pattern] + ' fa-stack-1x fa-inverse" style="line-height: 1; margin: 10% 10% 0 0; font-size: 85%"></i> </span>';
      }
    }
    return '<i class="fa-solid fa-location-dot fa-stack-2x" style="color: #134e4a;"></i>';
  }

  flyToLocation(lat: number, lon: number): void {
    const zoomLevel = 13;
    const options: L.ZoomPanOptions = {
      animate: true,
      duration: 5,
      easeLinearity: 0.25,
    };
    this.map.flyTo([lat, lon], zoomLevel, options);
  }

  public getMap(): L.Map {
    return this.map;
  }

  onLocationToggled(isLocationActive: boolean): void {
    if (isLocationActive) {
      this.getUserLocation();
    }
  }

  async getUserLocation(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.flyToLocation(position.coords.latitude, position.coords.longitude);
      this.locationDetected.emit();
    } catch (error) {
      console.error('Geolocation error:', error);
    }
  }

  showTutorial(): void {
    Swal.fire({
      title: 'Bienvenue dans notre application!',
      html: `
        <div id="modal-content" style="max-height: 40vh; overflow-y: auto; padding-right: 20px;">
          <h3>Comment utiliser l'application:</h3>
          <ul style="text-align: left; line-height: 1.6;">
            <li><strong>1.</strong> Utilisez le <strong>bouton de géolocalisation</strong> pour détecter votre position.</li>
            <li><strong>2.</strong> Sélectionnez votre profil en cliquant sur la <strong>photo de profil</strong>.</li>
            <li><strong>3.</strong> Pour <strong>modifier ou supprimer un profil</strong>, cliquez sur les boutons correspondants dans la sélection de profil.</li>
            <li><strong>4.</strong> Pour <strong>créer un nouveau profil</strong>, cliquez sur le bouton <strong>"+ ajouter"</strong> en bas du sélecteur de profil.</li>
            <li><strong>5.</strong> Pour effectuer une <strong>recherche</strong>, tapez des mots-clés dans la barre de recherche.</li>
            <li><strong>6.</strong> Pour une <strong>recherche avancée</strong>, cliquez sur le bouton <strong>"plus de filtres"</strong>. Notez que des pré-filtres peuvent être appliqués selon le profil sélectionné.</li>
            <li><strong>7.</strong> Vous pouvez <strong>zoomer</strong> et <strong>dézoomer</strong> la carte.</li>
            <li><strong>8.</strong> Vous pouvez également <strong>changer de calque</strong> sur la carte.</li>
            <li><strong>9.</strong> Affichez les <strong>résultats sous forme de filtres</strong> pour mieux organiser les informations.</li>
            <li><strong>10.</strong> Cliquez sur un <strong>résultat</strong> pour afficher une page plus détaillée du lieu.</li>
          </ul>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'modal-custom'
      }
    }).then(() => {
      // Remove scroll buttons when modal is closed
      const scrollUpButton = document.getElementById('scroll-up');
      const scrollDownButton = document.getElementById('scroll-down');
      if (scrollUpButton) scrollUpButton.remove();
      if (scrollDownButton) scrollDownButton.remove();
    });
  
    // Add scroll buttons dynamically
    setTimeout(() => {
      const modalPopup = document.querySelector('.swal2-popup');
      if (modalPopup) {
        const scrollUpButton = document.createElement('button');
        scrollUpButton.id = 'scroll-up';
        scrollUpButton.className = 'btn  bg-accent';
        scrollUpButton.textContent = '↑';
        scrollUpButton.style.position = 'fixed';
        scrollUpButton.style.left = 'calc(50% + 300px)'; // Adjust position as needed
        scrollUpButton.style.top = 'calc(50% - 60px)';
        scrollUpButton.style.zIndex = '9999'; // Ensure the button is on top of everything
        scrollUpButton.style.width = '50px'; // Increase button size
        scrollUpButton.style.height = '50px'; // Increase button size
        scrollUpButton.style.fontSize = '30px'; // Increase font size
  
        const scrollDownButton = document.createElement('button');
        scrollDownButton.id = 'scroll-down';
        scrollDownButton.className = 'btn  bg-accent';
        scrollDownButton.textContent = '↓';
        scrollDownButton.style.position = 'fixed';
        scrollDownButton.style.left = 'calc(50% + 300px)'; // Adjust position as needed
        scrollDownButton.style.top = 'calc(50% + 20px)';
        scrollDownButton.style.zIndex = '9999'; // Ensure the button is on top of everything
        scrollDownButton.style.width = '50px'; // Increase button size
        scrollDownButton.style.height = '50px'; // Increase button size
        scrollDownButton.style.fontSize = '30px'; // Increase font size
  
        document.body.appendChild(scrollUpButton);
        document.body.appendChild(scrollDownButton);
  
        // Add scroll event listeners
        const modalContent = document.getElementById('modal-content');
        if (modalContent) {
          let scrollInterval: any;
  
          scrollUpButton.addEventListener('mousedown', () => {
            scrollInterval = setInterval(() => {
              modalContent.scrollBy(0, -10);
            }, 50);
          });
  
          scrollDownButton.addEventListener('mousedown', () => {
            scrollInterval = setInterval(() => {
              modalContent.scrollBy(0, 10);
            }, 50);
          });
  
          document.addEventListener('mouseup', () => {
            clearInterval(scrollInterval);
          });
  
          scrollUpButton.addEventListener('mouseleave', () => {
            clearInterval(scrollInterval);
          });
  
          scrollDownButton.addEventListener('mouseleave', () => {
            clearInterval(scrollInterval);
          });
        }
      }
    }, 0); // Delay to ensure the modal is fully rendered
  }

  setMapLayer(theme: string): void {
    if (theme === 'dark') {
      this.changeLayer(this.layers['CartoDB Dark']);
    } else if (theme === 'contrast') {
      this.changeLayer(this.layers['Stadia.StamenTonerLite']);
    } else {
      this.changeLayer(this.layers['OpenStreetMap']);
    }
  }

  private changeLayer(layer: L.TileLayer): void {
    if (!this.map) {
      return;
    }
    Object.values(this.layers).forEach(l => {
      if (this.map.hasLayer(l)) {
        this.map.removeLayer(l);
      }
    });
    layer.addTo(this.map);
  }
}


