import { Component, OnInit } from '@angular/core';
import {PermissionsService} from "../../services/permissions.service";

@Component({
  selector: 'app-license-management',
  templateUrl: './license-management.component.html',
  styleUrls: ['./license-management.component.scss']
})
export class LicenseManagementComponent implements OnInit {

  constructor(private permissions: PermissionsService) { }

  ngOnInit() {
  }

}
