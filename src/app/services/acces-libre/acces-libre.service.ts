import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccesLibreService {
  private apiUrl = 'https://acceslibre.beta.gouv.fr/api/erps';

  constructor(private http: HttpClient) { }

  getErp(filters: any): Observable<any> {
    let params = new HttpParams();
    if (filters.query) params = params.set('q', filters.query);
    if (filters.dispositifs && filters.dispositifs.length > 0) {
      filters.dispositifs.forEach((equipment: string) => {
          params = params.append('equipments', equipment);
      });
    }

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Api-Key oU6JwJ1T.himZfVvhB5F0JqY6YeU2A2cDbgbr0tzN`
    });

    console.log('Params:', params.toString());

    return this.http.get<any>(this.apiUrl, { params, headers });
  }

  getResultsByUrl(url: string): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Api-Key oU6JwJ1T.himZfVvhB5F0JqY6YeU2A2cDbgbr0tzN`
    });

    return this.http.get<any>(url, { headers });
  }
}
