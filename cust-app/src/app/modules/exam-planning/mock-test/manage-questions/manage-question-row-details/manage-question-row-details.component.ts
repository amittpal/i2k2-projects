import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-manage-question-row-details',
  templateUrl: './manage-question-row-details.component.html',
  styleUrls: ['./manage-question-row-details.component.scss']
})
export class ManageQuestionRowDetailsComponent implements OnInit {
  @Input() rowItemDetails: any;
  @Input() examId: number;
  public items = []; 
  public count: Number = 0;
  public notFound: boolean = false;
  public displayMessage: any;
  constructor( 
    private restService: GlobalRestService,
    private messageService: MessageService) { }
  
  ngOnInit() {
    //console.log(this.rowItemDetails);
    if (this.rowItemDetails && this.examId > 0) {    
      this.getQuestionListById();     
    }
  }

  getQuestionListById() {    
    var keyData = [
      {
        "name": "questionId",
        "value": this.rowItemDetails.mock_question_requirment_id
      }     
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getMockTestQuestionsById;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {  
        //console.log(sucessResponse);     
        //this.examDetails=sucessResponse.exams[0]; 
        this.items=sucessResponse.mock_question_details;        
        if (this.items === undefined || this.items.length < 1) {
          this.notFound = true;
        }
      }, errorResponse => {
        this.notFound = true;
        this.messageService.alert(errorResponse.httpErrorResponse);
      });

  }


}
