import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { Author, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-review-question',
  templateUrl: './review-question.component.html',
  styleUrls: ['./review-question.component.scss']
})
export class ReviewQuestionComponent implements OnInit {
  questionDetails:any; 
  detailId:number; 
  answerType: string;  
  questionType=""
  constructor(
    private primaryHeader: PrimaryHeaderService,
    private route: ActivatedRoute,
    private router:Router,
    private restService: GlobalRestService,
    private messageService:MessageService) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("QUESTION REVIEW");
    this.route.params.subscribe((params: Params) => {   
      this.answerType = params['answerType'];
      this.detailId=params['id']
      this.getQuestionDetails(this.detailId);  
      
    }, error => {
      console.error('Error: ', error);
    });
    this.showFilter();
  }

  showFilter()
  {
    /*
    opening filter on component load (need to refactor this logic).
    handle via input parameter in filterToggle directive
    */ 
    document.querySelector('.az-content-dashboard-three').classList.add('filter-show');
    document.querySelector('.az-content-dashboard-three').classList.remove('filter-mobile');
  }

  getQuestionDetails(id:any)
  {      
    var keyData = [      
      {
        "name": "detailId",
        "value": id
      },
      {
        "name": "answerType",
        "value": this.answerType
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Author.getQuestionDetails;    
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {    
        this.questionDetails=sucessResponse;    
        this.questionType=this.questionDetails.question_summary[0].answer_type;         
      }, errorResponse => {        
        this.messageService.alert(errorResponse);
      });    
  }

  
  onQuestionNumberSelect(questionDetails:any) {        
    if (questionDetails.completion_status_text === "Pending") {
      this.router.navigate(["/author/questions/" + this.answerType + "/" + questionDetails.detail_id + "/add/secondary"]);
    }
    if (questionDetails.completion_status_text === "Created") {
      this.router.navigate(["/author/questions/" + this.answerType + "/" + questionDetails.detail_id + "/review/secondary"]);
    } 
    if (questionDetails.completion_status_text === "Reviewed") {
      this.router.navigate(["/author/questions/" + this.answerType + "/" + questionDetails.detail_id + "/approve/secondary"]);
    } 
    if (questionDetails.completion_status_text === "Approved") {
      this.router.navigate(["/author/questions/" + this.answerType + "/" + questionDetails.detail_id + "/approve/secondary"]);
    }
    
    //this.router.navigate(["/author/questions/" + questionNumber + "/add"]);
  }
}
