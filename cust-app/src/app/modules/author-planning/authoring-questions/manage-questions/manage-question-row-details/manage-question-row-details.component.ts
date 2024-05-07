import { Component, OnInit, Input } from '@angular/core';
import { Author, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-manage-question-row-details',
  templateUrl: './manage-question-row-details.component.html',
  styleUrls: ['./manage-question-row-details.component.scss']
})
export class ManageQuestionRowDetailsComponent implements OnInit {
  @Input() rowItemDetails: any;
  //@Input() examId: number;

  
  public items = []; 
  public count: Number = 0;
  public notFound: boolean = false;
  public displayMessage: any;

  constructor(
    private restService: GlobalRestService,
    private messageService: MessageService
  ) { }
  ngOnInit() {   
    //&& this.examId > 0
    if (this.rowItemDetails) {    
      this.getQuestionAssignmentsListById();     
    }
  }

  getQuestionAssignmentsListById() {    
    var keyData = [
      {
        "name": "assignmentId",
        "value": this.rowItemDetails.Assigment_id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Author.getQuestionAssignmentsListById;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {       
        //this.examDetails=sucessResponse.exams[0]; 
        this.items=sucessResponse.question_assignment;        
        if (this.items === undefined || this.items.length < 1) {
          this.notFound = true;
        }
      }, errorResponse => {
        this.notFound = true;
        // this.messageService.alert(errorResponse);
      });

  }

}
