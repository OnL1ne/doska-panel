import { Component, OnInit } from '@angular/core';
import { PermissionsService } from "../../services/permissions.service";
import { UsersService } from "../../services/users.service";
import { AuditEvent } from "../../models/user.model";
import {SortTableService} from "../../services/sort-table.service";


@Component({
  selector: 'app-audit-management',
  templateUrl: './audit-management.component.html',
  styleUrls: ['./audit-management.component.scss']
})
export class AuditManagementComponent implements OnInit {
  public events: AuditEvent[];
  public contentLoaded: boolean;

  constructor(
    public permissions: PermissionsService,
    public usersService: UsersService,
    public sortTableService: SortTableService,
  ) { }

  ngOnInit() {
    this.initEvents();
    this.initSortColumns();
  }

  public initEvents():void {
    this.contentLoaded = false;
    this.usersService.getEvents().subscribe(events => {
      this.contentLoaded = true;
      this.events = events;
    });
  }

  public initSortColumns() {
    this.sortTableService.sortedColumns = [
      {name:'user.name', title: 'panel.audit.user_name', icon: this.sortTableService.sortArrowDefault},
      {name:'title', title: 'panel.audit.event_title', icon: this.sortTableService.sortArrowDefault},
      {name:'description', title: 'panel.audit.event_description', icon: this.sortTableService.sortArrowDefault},
      {name:'created_at', title: 'panel.audit.event_created', icon: this.sortTableService.sortArrowDefault},
    ]
  }
}
