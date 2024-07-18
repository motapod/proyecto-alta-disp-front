import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiKey = '673d6edb07431db09699c08f';
  private apiUrl = 'https://v6.exchangerate-api.com/v6/';
  private lambdaStoreUrl = 'https://16777orruc.execute-api.us-west-2.amazonaws.com/guardar_datos';
  private lambdaGetUrl = 'https://16777orruc.execute-api.us-west-2.amazonaws.com/get_todo';

  constructor(private http: HttpClient) {}

  getExchangeRate(baseCurrency: string, targetCurrency: string): Observable<any> {
    const url = `${this.apiUrl}${this.apiKey}/pair/${baseCurrency}/${targetCurrency}`;
    return this.http.get(url);
  }

  storeConversion(data: any): Observable<any> {
    return this.http.post(this.lambdaStoreUrl, data);
  }

  getConversions(currency: string): Observable<any> {
    return this.http.get<any[]>(`${this.lambdaGetUrl}/${currency}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
