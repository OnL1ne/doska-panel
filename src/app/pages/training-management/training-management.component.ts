import { Component, OnInit } from '@angular/core';
import {PermissionsService} from "../../services/permissions.service";
import {SearchTableService} from "../../services/search-table.service";

@Component({
  selector: 'app-training-management',
  templateUrl: './training-management.component.html',
  styleUrls: ['./training-management.component.scss']
})
export class TrainingManagementComponent implements OnInit {

  constructor(
    public permissions: PermissionsService,
    public searchTableService: SearchTableService,
  ) { }

  ngOnInit() {
  }

}
