import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';

@Component({
  selector: 'app-registration-add',
  templateUrl: './registration-add.component.html',
  styleUrls: ['./registration-add.component.scss']
})
export class RegistrationAddComponent implements OnInit {

  constructor(private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Registration  Add");

  }

}
