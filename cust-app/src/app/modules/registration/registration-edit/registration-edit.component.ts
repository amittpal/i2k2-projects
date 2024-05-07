import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';

@Component({
  selector: 'app-registration-edit',
  templateUrl: './registration-edit.component.html',
  styleUrls: ['./registration-edit.component.scss']
})
export class RegistrationEditComponent implements OnInit {
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;

  constructor(private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Manage Registration");

  }
}