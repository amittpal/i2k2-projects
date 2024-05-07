import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-add-mock-question',
  templateUrl: './add-mock-question.component.html',
  styleUrls: ['./add-mock-question.component.scss']
})
export class AddMockQuestionComponent implements OnInit {

  detailId: number;
  answerType: string;  
  questionDetails: any;
  questionType=""
  
  constructor(
    private primaryHeader: PrimaryHeaderService,
    private route: ActivatedRoute,
    private router: Router,
    private restService: GlobalRestService,
    private messageService: MessageService) { }

  ngOnInit() {
    //removing filter space from previous screen (need to refactor this logic)
    document.querySelector('.az-content-dashboard-three').classList.remove('filter-show');    
    
    this.route.params.subscribe((params: Params) => {     
      this.detailId = params['id'];
      this.answerType = params['answerType'];
      this.getMockQuestionDetails();
    }, error => {
      console.error('Error: ', error);
    });
    this.showFilter();
  }

  showFilter() {
    /*
    opening filter on component load (need to refactor this logic).
    handle via input parameter in filterToggle directive
    */
    document.querySelector('.az-content-dashboard-three').classList.add('filter-show');
    document.querySelector('.az-content-dashboard-three').classList.remove('filter-mobile');
  }

  getMockQuestionDetails() {    
    var keyData = [
      {
        "name": "detailId",
        "value": this.detailId
      },
      {
        "name": "answerType",
        "value": this.answerType
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Exam.getMockTestQuestionsDetailsById;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {            
        this.questionDetails = sucessResponse;   
        this.questionType=this.questionDetails.question_summary[0].answer_type;           
      }, errorResponse => {
        this.messageService.alert(errorResponse.httpErrorResponse);
      });
  } 

  onQuestionNumberSelect(questionDetails: any) {
        
    if (questionDetails.completion_status_text === "Pending") {
      this.router.navigate(["/author/questions/" + this.answerType + "/" + questionDetails.detail_id + "/add/primary"]);
    }
    if (questionDetails.completion_status_text === "Created") {
      this.router.navigate(["/author/questions/" + this.answerType + "/" + questionDetails.detail_id + "/review/primary"]);
    }
    if (questionDetails.completion_status_text === "Reviewed") {
      this.router.navigate(["/author/questions/" + this.answerType + "/" + questionDetails.detail_id + "/approve/primary"]);
    }
    if (questionDetails.completion_status_text === "Approved") {
      this.router.navigate(["/author/questions/" + this.answerType + "/" + questionDetails.detail_id + "/approve/primary"]);
    }
  }

}
