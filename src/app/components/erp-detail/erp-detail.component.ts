import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccesLibreService } from '../../services/acces-libre/acces-libre.service';
import { ERP } from '../../models/definitions';

@Component({
  selector: 'app-erp-detail',
  templateUrl: './erp-detail.component.html',
  styleUrls: ['./erp-detail.component.scss']
})
export class ErpDetailComponent implements OnInit {
  erp: ERP | undefined;

  constructor(
    private route: ActivatedRoute,
    private accesLibreService: AccesLibreService // Assurez-vous d'importer et d'injecter le service approprié
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
        },
        (error) => {
          console.error('Error fetching ERP details:', error);
          // Gérer l'erreur ici (par exemple, afficher un message d'erreur à l'utilisateur)
        }
      );
    }
  }
}
