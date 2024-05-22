/*import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccesLibreService {

  constructor() { }
}*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccesLibreService {
  private apiUrl = 'https://acceslibre.beta.gouv.fr/api/erps'; // Remplace par l'URL de l'API Accès Libre

  constructor(private http: HttpClient) { }

  getErp(filters: any, apiKey: string): Observable<any> {
    // Construire l'URL avec les filtres
    // const params = new URLSearchParams();

    let params = new HttpParams();
    if (filters.quantity) params = params.set('page_size', filters.quantity);
    if (filters.enseigne) params = params.set('q', filters.enseigne);
    if (filters.ville) params = params.set('commune', filters.ville);
    if (filters.handicaps && filters.handicaps.length > 0) params = params.set('equipments', filters.handicaps.join(','));

    // Construction des en-têtes de la requête avec la clé d'API
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Api-Key ${apiKey}`
    });

    //return this.http.get<any>(`${this.apiUrl}/endpoint?${params.toString()}`);
    console.log(params);

    return this.http.get<any>(this.apiUrl, { params: params, headers: headers });
  }

  getResultsByUrl(url: string, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Api-Key ${apiKey}`
    });
  
    return this.http.get<any>(url, { headers: headers });
  }
}