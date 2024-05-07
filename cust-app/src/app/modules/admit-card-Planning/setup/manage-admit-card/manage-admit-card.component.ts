import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';

@Component({
  selector: 'app-manage-admit-card',
  templateUrl: './manage-admit-card.component.html',
  styleUrls: ['./manage-admit-card.component.scss']
})
export class ManageAdmitCardComponent implements OnInit {
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;
  examNumber: string;
  smsEmailActiveFlag: string;
  qrBarCodeActiveFlag: string;
  
  constructor(private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
        //setting page title
        this.primaryHeader.pageTitle.next("MANAGE ADMIT CARD SETUP");
  }

    //  exam number
    public exam_num(exam_num: string) {
      this.examNumber = exam_num;
    }

    enableDisableSmsEmailQrBarCode(flag){
      this.smsEmailActiveFlag = flag.smsEmailFlag;
      this.qrBarCodeActiveFlag = flag.qrbarCodeFlag;
    }
}
