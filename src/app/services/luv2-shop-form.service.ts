import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Country} from '../common/country';
import {Observable, of} from "rxjs";
import {State} from '../common/state';


@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries'
  private statesUrl = 'http://localhost:8080/api/states'

  constructor(private httpclient: HttpClient) {
  }

  getCountries(): Observable<Country[]> {
    return this.httpclient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(theCountryCode: string): Observable<State[]> {
    // search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`

    return this.httpclient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    )
  }

  // @ts-ignore
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    // build an array for "Month" dropdown list
    // start with current month and loop until month 12

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth)
    }

    return of(data)
  }

  // @ts-ignore
  getCreditCardYears(): Observable<number[]> {
    let data: number[] = []

    // build an array for "Year" dropdown list
    // start with current year and loop until month 10 years

    const startYear: number = new Date().getFullYear()
    const endYear: number = startYear + 10

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear)
    }

    return of(data)
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }

}
