import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccesLibreService {
  private apiUrl = 'https://acceslibre.beta.gouv.fr/api/erps';

  constructor(private http: HttpClient) {}

  getErp(filters: any): Observable<any> {
    let params = new HttpParams();
    if (filters.query) {
      params = params.set('q', filters.query);
    }
    if (filters.northEast && filters.southWest) {
      params = params.set('zone', `${filters.southWest.lng},${filters.southWest.lat},${filters.northEast.lng},${filters.northEast.lat}`);
    }
    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.pageSize) {
      params = params.set('page_size', filters.pageSize.toString());
    }
    if (filters.dispositifs && filters.dispositifs.length > 0) {
      filters.dispositifs.forEach((equipment: string) => {
        params = params.append('equipments', equipment);
      });
    }
    if (filters.handicaps && filters.handicaps.length > 0) {
      filters.handicaps.forEach((handicap: string) => {
        params = params.append('handicaps', handicap);
      });
    }

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Api-Key oU6JwJ1T.himZfVvhB5F0JqY6YeU2A2cDbgbr0tzN`
    });

    return this.http.get<any>(this.apiUrl, { params, headers });
  }

  getAllErp(filters: any): Observable<any[]> {
    return this.getErp(filters).pipe(
      mergeMap(response => {
        const totalPages = Math.ceil(response.count / response.page_size);
        const requests = [];
        for (let page = 2; page <= totalPages; page++) {
          let params = new HttpParams();
          if (filters.query) params = params.set('q', filters.query);
          if (filters.dispositifs && filters.dispositifs.length > 0) {
            filters.dispositifs.forEach((equipment: string) => {
              params = params.append('equipments', equipment);
            });
          }
          params = params.set('page', page.toString());

          const headers = new HttpHeaders({
            'accept': 'application/json',
            'Authorization': `Api-Key oU6JwJ1T.himZfVvhB5F0JqY6YeU2A2cDbgbr0tzN`
          });

          requests.push(this.http.get<any>(this.apiUrl, { params, headers }));
        }
        return requests.length ? requests : [response];
      }),
      mergeMap(responses => responses),
      toArray()
    );
  }
}
