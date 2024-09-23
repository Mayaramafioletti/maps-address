import { Injectable } from '@angular/core'; 
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { throwError } from 'rxjs';
import { data } from '../data/data';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly apiUrlList = 'https://jonatasnote:8080/api/Address/list';
  private readonly apiUrlUpdate = 'https://jonatasnote:8080/api/Address/update-coordinates';
  private readonly api = data;

  constructor(private http: HttpClient) {}
  getEnderecos(): Observable<any> {
    return this.http.get<any>(this.apiUrlList, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        return response.body; 
      }),
      catchError(error => {
        console.error('Error fetching addresses:', error);
        return throwError(() => new Error('Failed to fetch addresses.'));
      })
    );
  }
  
  updateEndereco(addressId: number, lat: number, lng: number): Observable<any> {
    const body = { addressId, lat, lng };
    console.log('Body do request:', body); // Log para verificar o conteúdo do body
    return this.http.post<any>(this.apiUrlUpdate, body, {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response'
    }).pipe(
      catchError(error => {
        console.error('Error updating address:', error);
        return throwError(() => new Error('Failed to update address.'));
      })
    );
  }
}
