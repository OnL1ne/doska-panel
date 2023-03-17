import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpEventType, HttpResponse} from "@angular/common/http";

import {Observable, pipe} from "rxjs";
import {catchError, filter, map, tap} from "rxjs/operators";

import {License} from "src/app/models/company.model";
import {HttpErrorHandler, HandlerError} from "./http-error-handler.services";
import {environment} from "../../environments/environment";

@Injectable()
export class LicensesService {
  public handleError: HandlerError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('TrainingsService');
  }

  public getLicenses(): Observable<License[]> {
    return this.http
      .get<License[]>(`${environment.API_ENDPOINT}/get-licenses/`)
      .pipe(catchError(this.handleError('getLicenses', [])))
  }

  public addLicense(value) {
    return this.http
      .post(`${environment.API_ENDPOINT}/create-license/`, value, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError(this.handleError('addLicense', value)),
        this.toResponseBody()
      )
  }

  public updateLicense(license: License): Observable<License> {
    return this.http
      .put<License>(`${environment.API_ENDPOINT}/update-license/${license.id}`, license)
      .pipe(catchError(this.handleError('updateLicense', license)))
  }

  public deleteLicense(id: number): Observable<{}> {
    const url = `${environment.API_ENDPOINT}/delete-license/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.handleError('deleteLicense')))
  }

  public toResponseBody<T>() {
    return pipe(
      filter(( event: HttpEvent<T> ) => event.type === HttpEventType.Response),
      map(( res: HttpResponse<T> ) => res.body)
    );
  }

  public toFormData<T>( formValue: T ) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }
}
