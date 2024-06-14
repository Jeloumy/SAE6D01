import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccesLibreService } from '../../services/acces-libre/acces-libre.service';
import { ERP, Accessibilite } from '../../models/definitions'; // Assurez-vous d'importer les bonnes interfaces
import accessibiliteHelp from '../../../assets/accessibiliteHelp.json'; // Assurez-vous que l'importation du fichier JSON est correcte

@Component({
  selector: 'app-erp-detail',
  host: {
    class: 'flex flex-1 flex-col bg-base-300'
  },
  templateUrl: './erp-detail.component.html',
  styleUrls: ['./erp-detail.component.scss'],
})
export class ErpDetailComponent implements OnInit {
  erp: ERP | undefined;
  backgroundClass: string = ''; // Variable pour stocker la classe de fond
  accessibility: Accessibilite | undefined; // Variable pour stocker les informations d'accessibilité
  accessibiliteHelp: any = accessibiliteHelp; // Déclaration de la propriété accessibiliteHelp

  constructor(
    private route: ActivatedRoute,
    private accesLibreService: AccesLibreService
  ) {}

  ngOnInit(): void {
    this.getErpDetail();
  }

  getErpDetail(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.accesLibreService.getErpBySlug(slug).subscribe(
        (response: ERP) => {
          this.erp = response;
          this.accessibility = this.erp.accessibilite;
          console.log(this.accessibility);
          this.backgroundClass = this.getBackgroundClass(new Date(response.updated_at));
        },
        (error: any) => {
          console.error(
            'Erreur lors de la récupération des détails ERP :',
            error
          );
        }
      );
    }
  }

  getBackgroundClass(updatedAt: Date): string {
    const today = new Date();
    const updatedDate = new Date(updatedAt);

    // Calcul de la différence en mois entre aujourd'hui et la date de mise à jour
    const diffMonths = (today.getFullYear() - updatedDate.getFullYear()) * 12 + today.getMonth() - updatedDate.getMonth();

    // Détermination de la classe de fond en fonction de la différence en mois
    if (diffMonths < 6) {
      return 'bg-primary';
    } else if (diffMonths < 12) {
      return 'bg-warning';
    } else {
      return 'bg-error';
    }
  }

  getNonNullEntries(obj: any): [string, any][] {
    return Object.entries(obj).filter(([key, value]) => 
      key !== 'url' && key !== 'erp' && value !== null && value !== '' && value !== false && !(Array.isArray(value) && value.length === 0)
    );
  }

  getLabel(key: string): string {
    if (this.accessibiliteHelp[key] && this.accessibiliteHelp[key].label) {
      return this.accessibiliteHelp[key].label;
    } else {
      return key;
    }
  }
}
