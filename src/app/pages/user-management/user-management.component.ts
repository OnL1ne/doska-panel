import {Component, OnInit} from '@angular/core';
import {PermissionsService} from "../../services/permissions.service";
import {AuthenticationService} from "../../services/authentication.service";
import {SearchTableService} from "../../services/search-table.service";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  constructor(
    private permissions: PermissionsService,
    private auth: AuthenticationService,
    private searchTableService: SearchTableService,
  ) { }

  ngOnInit() {
  }

}
