import { Component, OnInit, Input } from '@angular/core';
import {  Router } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Author, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-match-review',
  templateUrl: './match-review.component.html',
  styleUrls: ['./match-review.component.scss']
})
export class MatchReviewComponent implements OnInit {

  @Input() QuestionDetails: any;  
  questionReviewFormGroup: FormGroup;  
  optionList=["(a)","(b)","(c)","(d)","(e)","(f)","(g)"];   
  reviewStatusList=[];
  rightAnswersList=[];
  constructor(   
    private router:Router,
    private restService: GlobalRestService,
    private messageService:MessageService) { }

  ngOnInit() {}
  ngOnChanges() {
    this.getReviewStatusList();
    this.setupInitialDetails();
  }

  initializeForm() {
    let examDetails=this.QuestionDetails.question_summary[0];   
     if(examDetails)
     {      
      this.questionReviewFormGroup = new FormGroup({
        exam_number: new FormControl({ value: examDetails.exam_number, disabled: true }),       
        subject: new FormControl({ value: examDetails.subject, disabled: true }),      
        language: new FormControl({ value: examDetails.language, disabled: true }),
        questions: new FormControl({ value: examDetails.number_of_options, disabled: true }),
        reviewStatus: new FormControl('',[Validators.required]),
        remarks: new FormControl('',[Validators.required,Validators.maxLength(200)])                
      });                
     }           
  }
  
  setupInitialDetails()
  {              
    this.QuestionDetails.requirement_summary=this.QuestionDetails.requirement_summary.map((e,index)=>({"selected":false,...e}));              
    this.initializeForm();   

  }

  getReviewStatusList()
  {     
    this.restService.ApiEndPointUrlOrKey = Author.getReviewPlanStatusList;    
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi()
      .subscribe(sucessResponse => {          
      this.reviewStatusList=sucessResponse.plan_status;        
      }, errorResponse => {        
        this.messageService.alert(errorResponse);
      });    
  }

  onQuestionReviewClick()
  {
    if(this.questionReviewFormGroup.valid)
    {
      var keyData = [      
        {
          "name": "detailId",
          "value": this.QuestionDetails.question[0].detail_id
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Author.updateQuestionReviewStatus;    
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;
      this.restService.HttpPostParams=this.getPostParams();
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {    
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go Back to List').subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
              this.router.navigate(["/author/questions/" + this.QuestionDetails.question_summary[0].exam_guid +  "/manage"]);
            }
            else {
              this.messageService.hideModal();
            }
          }); 
        }, errorResponse => {        
          this.messageService.alert(errorResponse);
          //this.messageService.notify(errorResponse);
        });  
    }
    else
    {
      document.getElementById('questionReviewForm').classList.add('was-validated');  
      //this.messageService.ok("Please provide review status and remark for question.");
    }
  }

  getPostParams()
  {
    let postParams={
      "completion_status_guid":this.questionReviewFormGroup.get('reviewStatus').value,
      "remark":this.questionReviewFormGroup.get('remarks').value
    }
   return postParams;
  }

}
