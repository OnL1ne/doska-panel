import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpEventType, HttpResponse} from "@angular/common/http";

import {Observable, pipe} from "rxjs";
import {catchError, filter, map, tap} from "rxjs/operators";

import {Company, License} from "src/app/models/company.model";
import {HttpErrorHandler, HandlerError} from "./http-error-handler.services";
import {environment} from "../../environments/environment";

@Injectable()
export class CompaniesService {
  public handleError: HandlerError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('TrainingsService');
  }

  public getCompanies(): Observable<Company[]> {
    return this.http
      .get<Company[]>(`${environment.API_ENDPOINT}/get-companies/`)
      .pipe(catchError(this.handleError('getCompanies', [])))
  }

  public getLicenses(): Observable<License[]> {
    return this.http
      .get<License[]>(`${environment.API_ENDPOINT}/get-licenses/`)
      .pipe(catchError(this.handleError('getLicenses', [])))
  }

  public addCompany(value) {
    console.log('value', value);
    return this.http
      .post(`${environment.API_ENDPOINT}/create-company/`, value, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError(this.handleError('addCompany', value)),
        this.toResponseBody()
      )
  }

  public updateCompany(company: Company): Observable<Company> {
    return this.http
      .put<Company>(`${environment.API_ENDPOINT}/update-company/${company.id}`, company)
      .pipe(catchError(this.handleError('updateCompany', company)))
  }

  public deleteCompany(id: number): Observable<{}> {
    const url = `${environment.API_ENDPOINT}/delete-company/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.handleError('deleteCompany')))
  }

  public toResponseBody<T>() {
    return pipe(
      filter(( event: HttpEvent<T> ) => event.type === HttpEventType.Response),
      map(( res: HttpResponse<T> ) => res.body)
    );
  }

  public toFormData<T>( formValue: T ) {
    const formData = new FormData();

    for ( const key of Object.keys(formValue) ) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }
}
