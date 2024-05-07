import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-mock-question-filter-secondary',
  templateUrl: './mock-question-filter-secondary.component.html',
  styleUrls: ['./mock-question-filter-secondary.component.scss']
})
export class MockQuestionFilterSecondaryComponent implements OnInit {

  @Input() QuestionStatusList:any;
  @Input() QuestionNumbersList:any;  
  @Input() DetailId:any;
  @Input() AssingmentId:any;  
  @Input() MockQuestionId:any;  
  @Output() selectedQuestionOutput = new EventEmitter<any>();  
  
  questionStatusList=[];

  constructor(private restService: GlobalRestService) { }

  ngOnInit() {
    this.getMockQuestionStatusList();
  }

  getMockQuestionStatusList()
  {
      var keyData = [
        {
          "name": "questionId",
          "value": this.MockQuestionId
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Exam.getMockQuestionsStatusList;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;      
      this.restService.ShowLoadingSpinner = true;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {
        this.questionStatusList=sucessResponse.mock_question_details;
          //sucessResponse          
        }, errorResponse => {
          //this.messageService.alert(errorResponse);
        });    
  }

  onQuestionNumberClick(item:any) {            
    this.selectedQuestionOutput.emit(item);    
  }

  onFilterCheckboxChange(event: any, itemDetails: any) {
    let item = this.QuestionStatusList
      .find(i => i.completion_status_guid === itemDetails.completion_status_guid);
    if (item) {
      this.QuestionStatusList
        .find(i => i.completion_status_guid === itemDetails.completion_status_guid).selected = event.target.checked;
    }
  }

  // onFilterApplyClick() {
  //   let selectedItems = this.QuestionStatusList
  //     .filter(i => i.selected === true)
  //     .map((e, index) => ({ "guid": e.completion_status_guid }));

  //   if (selectedItems) {
  //     var keyData = [
  //       {
  //         "name": "assignmentId",
  //         "value": this.AssingmentId
  //       }
  //     ];
  //     this.restService.ApiEndPointUrlOrKey = Author.getQuestionAssignments;
  //     this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
  //     this.restService.HttpPostParams = selectedItems;
  //     this.restService.ShowLoadingSpinner = true;
  //     this.restService.callApi(keyData)
  //       .subscribe(sucessResponse => {
  //         if(sucessResponse.question_assignment.length>0)
  //         {
  //           this.QuestionNumbersList=sucessResponse.question_assignment.map((arrayData, index) => (
  //             {
  //               "detail_id": arrayData.id,
  //               ...arrayData
  //             }
  //             ));
  //         }          
  //       }, errorResponse => {
  //         //this.messageService.alert(errorResponse);
  //       });
  //   }
  //   //console.log(selectedFilter);
  // }

}
