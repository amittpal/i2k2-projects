import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';

@Component({
  selector: 'app-registration-view',
  templateUrl: './registration-view.component.html',
  styleUrls: ['./registration-view.component.scss']
})
export class RegistrationViewComponent implements OnInit {

  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;

  constructor(private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("View Registration");

  }
}
