import { Component, OnInit, Input } from '@angular/core';
import { Candidates } from './../../../../shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from './../../../../services/rest/global-rest.service';

@Component({
  selector: 'app-registration-import-detail',
  templateUrl: './registration-import-detail.component.html',
  styleUrls: ['./registration-import-detail.component.scss']
})
export class RegistrationImportDetailComponent implements OnInit {
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
        this.candidatesRegistrationDetail = successResponse.jobs;
      }, errorResponse => {
         this.candidatesRegistrationDetail = [];
      });     
    }
  }

  public updateService(statusGUID: any){
    localStorage.setItem('statusGUID', statusGUID)
  }

}

