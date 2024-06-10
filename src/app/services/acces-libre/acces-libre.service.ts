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
    if (filters.latitude && filters.longitude) {
      const { minLat, minLon, maxLat, maxLon } = getBoundingBox(filters.latitude, filters.longitude, 20);
      const zone = `${minLon},${minLat},${maxLon},${maxLat}`;
      params = params.set('zone', zone);
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

function getBoundingBox(lat: number, lon: number, distanceInKm: number) {
  const earthRadius = 6371; // Radius of the Earth in km

  const latRad = lat * Math.PI / 180;
  const lonRad = lon * Math.PI / 180;

  const distanceRad = distanceInKm / earthRadius;

  const minLat = lat - (distanceRad * 180 / Math.PI);
  const maxLat = lat + (distanceRad * 180 / Math.PI);
  const minLon = lon - (distanceRad * 180 / Math.PI) / Math.cos(latRad);
  const maxLon = lon + (distanceRad * 180 / Math.PI) / Math.cos(latRad);

  return {
    minLat,
    minLon,
    maxLat,
    maxLon
  };
}


