import {Component, Input, OnInit} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss']
})
export class ContentHeaderComponent implements OnInit {
  public faBars = faBars;

  @Input() title: string;

  constructor(
    private auth:AuthenticationService,
  ) { }

  ngOnInit() {
  }

  onToggleNav(event: Event) {
    event.stopPropagation();
    this.auth.burgerMenuToggle()
  }
}
