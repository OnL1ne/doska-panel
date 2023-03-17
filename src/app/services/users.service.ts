import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpEventType, HttpResponse} from "@angular/common/http";

import {Observable, pipe} from "rxjs";
import {catchError, filter, map} from "rxjs/operators";
import {HttpErrorHandler, HandlerError} from "./http-error-handler.services";
import {environment} from "../../environments/environment";
import {User, Role, AuditEvent} from "src/app/models/user.model";

@Injectable()
export class UsersService {
  public handleError: HandlerError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('UsersService');
  }

  public getRoles(): Observable<Role[]> {
    return this.http
      .get<Role[]>(`${environment.API_ENDPOINT}/get-roles/`)
      .pipe(catchError(this.handleError('getRoles', [])))
  }

  public getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${environment.API_ENDPOINT}/get-users/`)
      .pipe(catchError(this.handleError('getUsers', [])))
  }

  public getEvents(): Observable<AuditEvent[]> {
    return this.http
      .get<AuditEvent[]>(`${environment.API_ENDPOINT}/get-events/`)
      .pipe(catchError(this.handleError('getEvents', [])))
  }

  public addUser(value) {
    return this.http
      .post(`${environment.API_ENDPOINT}/create-user/`, value, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        //catchError(this.handleError('addUser', value)),
        this.toResponseBody()
      );
  }

  public updateUser(user: User): Observable<User> {
    return this.http
      .put<User>(`${environment.API_ENDPOINT}/update-user/${user.id}`, user)
  }

  public updateProfile(user: User): Observable<User> {
    return this.http
      .post<User>(`${environment.API_ENDPOINT}/update-profile/`, user)
  }

  public deleteUser(id: number): Observable<{}> {
    const url = `${environment.API_ENDPOINT}/delete-user/${id}`;
    return this.http.delete(url);
  }

  public changeUserPassword(value) {
    return this.http
      .put(`${environment.API_ENDPOINT}/change-user-password/${value.user_id}`, value)
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
