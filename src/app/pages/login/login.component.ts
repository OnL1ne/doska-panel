import { Component, OnInit } from '@angular/core';
import {AuthenticationService, TokenPayload} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {SystemMessagesService} from "../../services/system-messages";


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginLoad = false;
  public credentials: TokenPayload = {
    id: 0,
    login: '',
    password: ''
  };

  constructor(
    private auth:AuthenticationService,
    private systemMessages: SystemMessagesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.systemMessages.clearSystemMessages();
  }

  public submit(passwordInvalid:boolean, loginInvalid:boolean) {
    if (passwordInvalid || loginInvalid) return false;
    this.loginLoad = true;
    this.systemMessages.clearSystemMessages();
    this.auth.login(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/')
      },
      response => {
        this.loginLoad = false;
        this.systemMessages.setServerErrors(response.error.error);
      }
    )
  }

}
