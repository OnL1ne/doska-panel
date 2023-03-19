import {Injectable} from '@angular/core';
import {PermissionsService} from "../services/permissions.service";
import {Observable, of} from "rxjs";
import {Resolve, Router} from '@angular/router';
import {catchError, map} from "rxjs/operators";
import {ActivatedRouteSnapshot} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";

@Injectable()
export class PermissionResolver implements Resolve<any> {
  constructor(
    public permissionService: PermissionsService,
    public router: Router,
    public auth: AuthenticationService
  ) {}

  resolve(route: ActivatedRouteSnapshot):Observable<any> {
    return this.permissionService.initPermissions().pipe(
      map(res => res),
      catchError(error => {
        //console.log(`Retrieval error: ${error}`);
        this.auth.logout();
        return of({ error: error })
      })
    )
  }
}
