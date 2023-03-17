import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Detail, Role} from "../models/user.model";

export interface UserDetails {
  id: number,
  name: string,
  email: string,
  role_id: number,
  role_name: string,
  group_id: number,
  company_id: number,
  permissions: [],
  created_at?: string,
  updated_at?: string,
  exp: number,
  iat: number,
  iss?: string,
  detail?: Detail,
  role: Role
}

export interface TokenResponse {
  access_token: string,
  expires_in: number,
  token_type: string
}

export interface TokenPayload {
  id: number,
  login: string,
  password: string,
}

export interface TokenPayloadRegister {
  id: number,
  name: string,
  password: string,
  email: string
}

export interface ResetPassword {
  email: string
  new_password: string,
  repeat_password: string,
  token: string
}

@Injectable()
export class AuthenticationService {
  private token: string;
  private user: UserDetails;
  private burgerMenu = false;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string):void {
    localStorage.setItem('userToken', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('userToken')
    }

    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public saveUserDetails(user: UserDetails) {
    this.user = user
  }

  public isLoggedIn(): boolean {
    const token = this.getUserDetails();
    if (token) {
      return token.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public reset(passwords:ResetPassword) {
    return this.http.post(`${environment.API_ENDPOINT}/reset-password/`, passwords, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  public forgot(email:string) {
    return this.http.post(`${environment.API_ENDPOINT}/forgot-password/`, {email: email}, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  public register(user: TokenPayloadRegister): Observable<any> {
    return this.http.post(`${environment.API_ENDPOINT}/registration/`, user, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  public login(user: TokenPayload): Observable<any> {
    const base = this.http.post(
      `${environment.API_ENDPOINT}/login/`,
      {login: user.login, password: user.password},
      {
        headers: {'Content-Type': 'application/json'}
      }
    );

    return base.pipe(
      map((data: TokenResponse) => {
        if (data.access_token) {
          this.saveToken(data.access_token)
        }
        return data;
      })
    );
  }

  public profile(): Observable<any> {
    return this.http.get(`${environment.API_ENDPOINT}/profile/`)
  }

  public logout():void {
    this.token = '';
    window.localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  public burgerMenuToggle() {
    this.burgerMenu = !this.burgerMenu;
  }

  public get getBurgerMenu() {
    return this.burgerMenu;
  }
}

