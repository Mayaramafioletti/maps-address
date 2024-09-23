import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  private apiKey = 'AIzaSyCM_YOOsnG5AZNh_ngbuFmLzpaaXfIJOCc';

  constructor(private http: HttpClient) { }

  getAddress(address: string, pagetoken?: string): Observable<any> {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=rua ${encodeURIComponent(address)}, Brasil&key=${this.apiKey}`;
    if (pagetoken) {
      url += `&pagetoken=${pagetoken}`;
    }
    return this.http.get(url);
  }

}
