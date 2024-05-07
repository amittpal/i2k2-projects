import { Component, OnInit, Input } from '@angular/core';
import { GlobalRestService } from './../../../../services/rest/global-rest.service';
import { Candidates } from './../../../../shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-payments-detail',
  templateUrl: './payments-detail.component.html',
  styleUrls: ['./payments-detail.component.scss']
})
export class PaymentsDetailComponent implements OnInit {
  @Input() registrations: any;
  public paymentsRegistrationDetail = [];  

  constructor(private restService: GlobalRestService) { }

  ngOnInit() {
    this.getCandidateRegistrationDetail(this.registrations);
  }

  public getCandidateRegistrationDetail(regInfo: any) {
    if(regInfo) {                 
      let keyData = [
        {
          "name": "guid",
          "value": regInfo.guid
        }
      ]
      this.restService.ApiEndPointUrlOrKey = Candidates.getRegistrationsPaymentDetail;
      this.restService.callApi(keyData).subscribe(successResponse => {
        this.paymentsRegistrationDetail = successResponse.payment_status;
      }, errorResponse => {
         this.paymentsRegistrationDetail = [];
      });     
    }
  }

  public updateService(statusGUID: any){
    localStorage.setItem('paymentStatusGUID', statusGUID)
  }

}
