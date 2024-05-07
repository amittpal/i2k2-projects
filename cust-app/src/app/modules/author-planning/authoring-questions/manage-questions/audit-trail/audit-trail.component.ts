import { Component, OnInit, Input } from '@angular/core';
import { Author, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {
  
  @Input() QuestionId:number;
  questionAuditTrailList:any;
  constructor(private restService:GlobalRestService) { }
  
  ngOnInit() {
    if(this.QuestionId>0)
    {
      this.getQuestionAuditTrail();
    }
  }

  getQuestionAuditTrail()
  {    
    let keyData=[
      {
        "name":"questionId",
        "value":this.QuestionId
      }
    ]
    this.restService.ApiEndPointUrlOrKey = Author.getQuestionAuditTrail;          
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner=true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {        
        this.questionAuditTrailList=sucessResponse.question_assignment;
      }, errorResponse => {
        
      }
      );
  }

}
