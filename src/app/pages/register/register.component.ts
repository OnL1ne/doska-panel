import { Component, OnInit } from '@angular/core';
import {AuthenticationService, TokenPayloadRegister} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {SystemMessagesService} from "../../services/system-messages";


@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerLoad = false;
  public credentials: TokenPayloadRegister = {
    id: 0,
    name: '',
    password: '',
    email: '',
  };

  constructor(
    private auth: AuthenticationService,
    private systemMessages: SystemMessagesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.systemMessages.clearSystemMessages();
  }

  public register(nameInvalid:boolean, emailInvalid:boolean, passwordInvalid:boolean) {
    if (nameInvalid || emailInvalid || passwordInvalid) return false;
    this.registerLoad = true;
    this.systemMessages.clearSystemMessages();
    this.auth.register(this.credentials).subscribe(
      response => {
        this.systemMessages.setServerSuccess(response.success);
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 3000)
      },
      response => {
        this.registerLoad = false;
        this.systemMessages.setServerErrors(response.error.error);
      }
    )
  }

}
