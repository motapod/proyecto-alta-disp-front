import { Component } from '@angular/core';
import { CurrencyService } from '../currency.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  amount: number = 0;
  targetCurrency: string = '';
  convertedAmount: number = 0;
  conversions: any[] = [];
  currencies: string[] = [
    'USD', 'EUR', 'GBP', 'JPY', 'BRL', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK',
    'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'INR', 'RUB', 'ZAR'
  ];

  constructor(private currencyService: CurrencyService) {}

  convert() {
    if (this.amount && this.targetCurrency) {
      this.currencyService.getExchangeRate('CLP', this.targetCurrency).subscribe((data: any) => {
        this.convertedAmount = this.amount * data.conversion_rate;
        this.storeConversion();
      });
    }
  }

  storeConversion() {
    const conversionData = {
      fecha: new Date().toISOString(), // Fecha actual en formato YYYY-MM-DD
      currency: this.targetCurrency,
      monto: this.amount,
      conversion: this.convertedAmount
    };

    this.currencyService.storeConversion(conversionData).subscribe((response: any) => {
      console.log('Datos almacenados exitosamente:', response);
    }, (error: any) => {
      console.error('Error al almacenar datos:', error);
    });
  }

  getConversions() {
    console.log(this.targetCurrency);
    if (this.targetCurrency) {
      this.currencyService.getConversions(this.targetCurrency).subscribe((data: any[]) => {
        this.conversions = data;  // Aquí recibes el array de conversiones
      }, (error: any) => {
        console.error('Error al obtener registros:', error);
      });
    }
  }
}
