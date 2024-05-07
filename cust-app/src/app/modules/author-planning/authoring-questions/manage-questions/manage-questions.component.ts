import { Component, OnInit } from '@angular/core';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { ActivatedRoute, Params } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Author } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods, HandelError } from 'src/app/shared/models/app.models';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.scss']
})
export class ManageQuestionsComponent implements OnInit {

  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public count : Number = 0;
  public notFound: boolean = false;
  public displayMessage : any; 
  examGuid:any;
  examDetails:any;
  
  constructor(private primaryHeader: PrimaryHeaderService,
     private route: ActivatedRoute,
     private restService: GlobalRestService,
     private messageService:MessageService
     ) { }


  ngOnInit() {    
    //removing filter space from previous screen (need to refactor this logic)
    document.querySelector('.az-content-dashboard-three').classList.remove('filter-show');
    
    this.primaryHeader.pageTitle.next("MANAGE QUESTIONS");
    this.route.params.subscribe((params: Params) => {
      this.examGuid = params['id'];
      this.getQuestionsListByExamId();     
    }, error => {
      console.error('Error: ', error);
    });    
  }


  getQuestionsListByExamId()
  {    
    var keyData = [
      {
        "name": "examGuid",
        "value": this.examGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Author.getAuthoringQuestionListByExamId;    
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {        
        this.examDetails=sucessResponse.exams[0]; 
        this.items=sucessResponse.question_assignment;
        if(this.items===undefined || this.items.length<1) 
        {
          this.notFound = true;
        }
      }, errorResponse => {
        this.notFound = true;
        this.messageService.alert(errorResponse.httpErrorResponse);
      });

  }

}
