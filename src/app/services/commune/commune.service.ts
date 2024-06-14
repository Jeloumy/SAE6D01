import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommuneService {
  constructor(private http: HttpClient) {}

  fetchCommunes(query: string): Observable<any> {
    const countryCode = 'FR';
    const geoNamesApiUrl = `http://api.geonames.org/searchJSON?q=${query}&maxRows=10&country=${countryCode}&username=felschrr`;

    return this.http
      .get(geoNamesApiUrl)
      .pipe(map((response: any) => this.formatCommuneData(response)));
  }

  private formatCommuneData(response: any): { id: string; name: string }[] {
    if (response && response.geonames) {
      return response.geonames.map((city: any) => ({
        id: city.geonameId,
        name: city.name,
      }));
    } else {
      return [];
    }
  }
}
