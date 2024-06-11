import { Component, OnInit } from '@angular/core';
import { AccesLibreService } from '../../services/acces-libre/acces-libre.service';

@Component({
  selector: 'app-erp-list',
  templateUrl: './erp-list.component.html',
  styleUrls: ['./erp-list.component.scss']
})
export class ErpListComponent implements OnInit {
  erpList: any[] = [];

  constructor(private accesLibreService: AccesLibreService) { }

  ngOnInit(): void {
    this.getErpList();
  }

  getErpList(): void {
    this.accesLibreService.getErp({}).subscribe(
      response => {
        this.erpList = response.features;
      },
      error => {
        console.error('Error fetching ERP list:', error);
      }
    );
  }
}
