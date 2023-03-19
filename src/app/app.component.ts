import { Component, OnChanges, OnInit } from '@angular/core';
import { AuthenticationService } from "./services/authentication.service";
import { TranslateService } from '@ngx-translate/core';
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Doska';

  constructor(
    public auth: AuthenticationService,
    public translate: TranslateService,
  ) {
    this.translate.use(environment.defaultLocale);
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      //console.log('getTokenDetails', this.auth.getUserDetails());
    }
  }

  public useLanguage(language: string) {
    this.translate.use(language);
  }
}
