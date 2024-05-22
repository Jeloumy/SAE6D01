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
    /* const params = new URLSearchParams();
    if (filters.enseigne) params.append('enseigne', filters.enseigne);
    if (filters.ville) params.append('ville', filters.ville);
    if (filters.handicaps) params.append('handicaps', filters.handicaps.join(',')); */

    let params = new HttpParams();
    if (filters.enseigne) params = params.set('q', filters.enseigne);
    if (filters.ville) params = params.set('commune', filters.ville);
    if (filters.handicaps && filters.handicaps.length > 0) params = params.set('handicaps', filters.handicaps.join(','));

    // Construction des en-têtes de la requête avec la clé d'API
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Api-Key ${apiKey}`
    });

    //return this.http.get<any>(`${this.apiUrl}/endpoint?${params.toString()}`);

    console.log('URL de la requête :', this.apiUrl); // Affiche l'URL de la requête
    console.log('Params de la requête :', params); // Affiche les paramètres de la requête
    console.log('Headers de la requête :', headers); // Affiche les en-têtes de la requête

    
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