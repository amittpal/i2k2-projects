import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registered, Candidates } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit {
public candidateDetail: any = {};

  @Input() candidates: any;
  @Input() registrationGUID: any

  constructor(private router: Router, private restService: GlobalRestService
  ) { }

  ngOnInit() {
    this.getRegisteredCandidateDetail(this.candidates);
  }

  getRegisteredCandidateDetail(candidateInfo) {
    if(candidateInfo) {
      let keyData = [
        {
          "name": "guid",
          "value": this.registrationGUID
        },
        {
          "name": "candidateGuid",
          "value": candidateInfo.candidate_guid
        }
      ]
      this.restService.ApiEndPointUrlOrKey = Candidates.getRegisteredCandidateDetail;
      this.restService.callApi(keyData).subscribe(successResponse => {
        this.candidateDetail = successResponse.exams;
      }, errorResponse => {
         this.candidateDetail = [];
      });     
    }
  }

}
