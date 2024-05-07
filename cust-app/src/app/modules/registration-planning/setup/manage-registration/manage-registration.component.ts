import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-manage-registration',
  templateUrl: './manage-registration.component.html',
  styleUrls: ['./manage-registration.component.scss']
})
export class ManageRegistrationComponent implements OnInit {
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;

  constructor() { }

  ngOnInit() {}

}
