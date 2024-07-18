import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CurrencyService } from '../currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService]
    });
    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get exchange rate', () => {
    const mockResponse = { result: 'success', data: { rate: 1.2 } };
    const baseCurrency = 'USD';
    const targetCurrency = 'EUR';

    service.getExchangeRate(baseCurrency, targetCurrency).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}${service['apiKey']}/pair/${baseCurrency}/${targetCurrency}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should store conversion', () => {
    const mockResponse = { result: 'success' };
    const data = { baseCurrency: 'USD', targetCurrency: 'EUR', rate: 1.2 };

    service.storeConversion(data).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service['lambdaStoreUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush(mockResponse);
  });

  it('should get conversions', () => {
    const mockResponse = [{ baseCurrency: 'USD', targetCurrency: 'EUR', rate: 1.2 }];
    const currency = 'USD';

    service.getConversions(currency).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['lambdaGetUrl']}/${currency}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
