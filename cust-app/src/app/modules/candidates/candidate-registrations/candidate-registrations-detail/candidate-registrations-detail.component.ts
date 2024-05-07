import { Component, OnInit, Input } from '@angular/core';
import { GlobalRestService } from './../../../../services/rest/global-rest.service';
import { Candidates } from './../../../../shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-candidate-registrations-detail',
  templateUrl: './candidate-registrations-detail.component.html',
  styleUrls: ['./candidate-registrations-detail.component.scss']
})
export class CandidateRegistrationsDetailComponent implements OnInit {
  @Input() registrations: any;
  public candidatesRegistrationDetail = [];  

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
      this.restService.ApiEndPointUrlOrKey = Candidates.getCandidateRegistrationsDetail;
      this.restService.callApi(keyData).subscribe(successResponse => {
        this.candidatesRegistrationDetail = successResponse.registration_status;
      }, errorResponse => {
         this.candidatesRegistrationDetail = [];
      });     
    }
  }

  public updateService(statusGUID: any){
    localStorage.setItem('statusGUID', statusGUID)
  }

}
