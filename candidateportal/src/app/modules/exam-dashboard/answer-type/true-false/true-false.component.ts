import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AuthService } from "src/app/exam-services/auth/auth.service";
import { QuestionAnswerResponse } from '../question-answer-response.class';

@Component({
  selector: 'app-true-false',
  templateUrl: './true-false.component.html',
  styleUrls: ['./true-false.component.scss']
})
export class TrueFalseComponent implements OnChanges {
  _answerSubmitted: boolean;
  _candidateGuid: any;
  _clearForm: boolean;
  alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

  @Input() QuestionDetails:any;
  @Input() SelectedLanguageGuid: any;
  @Input() SelectedSectionGuid: any;
  @Input() get AnswerSubmitted():boolean {return this._answerSubmitted;}  
  @Input() get ClearFrom(): boolean { return this._clearForm; }
  set AnswerSubmitted(answerSubmitted: boolean) {        
    this._answerSubmitted =answerSubmitted;
    if(answerSubmitted===true)
    {
      this.onFormSubmit();
    }
  } 
  
  set ClearFrom(clearForm: boolean) {
    this._clearForm =clearForm;
    if (clearForm === true) {
      this.onFormClear();
    }
  }
  @Output() answerSubmitEmitter=new EventEmitter(); 
  @Output() answerChangedEmitter = new EventEmitter();

  answerResponse:QuestionAnswerResponse=new QuestionAnswerResponse();
  constructor(private messageService:MessageService, private authService: AuthService) { 
    this._candidateGuid = this.authService.getUserUniqueId();
  }

  ngOnChanges() {
    this.answerResponse.value_changed=false;
    this.QuestionDetails.option = this.QuestionDetails.option
    .map((arrayData, index) => (
      {
      "selected": this.QuestionDetails.answers.some(el => el.option_Guid === arrayData.option_Guid),    
        ...arrayData
      })); 
  }



  onAnswerCheckboxChange(event: any, itemDetails: any) {
    this.QuestionDetails.option.forEach(element => {  
      if (element.option_Guid===itemDetails.option_Guid) {              
        element.selected=true;        
      }
      else element.selected=false;
    });
    this.answerResponse.value_changed=true;
    this.answerChangedEmitter.emit(); 
  }


  onFormSubmit()
  {        
   
    let answer=[];
    let selectedAnswer=this.QuestionDetails.option.find(el => el.selected===true);
    if(selectedAnswer)
    { 
      // let answer=
      // {                  
      //   "candidate_guid": this._candidateGuid,     
      //   "question_guid": this.QuestionDetails.question[0].question_guid,      
      //   "answers":[]
      // }  
      // answer.answers.push(selectedAnswer);
      // if(this.hasAnswerChanged===true)
      // {
      //   this.answerSubmitEmitter.emit(answer);
      // }
      // else
      // {
      //   this.answerSubmitEmitter.emit(true);
      // }  
      answer.push(selectedAnswer);
      this.answerResponse.candidate_guid=this._candidateGuid;
      this.answerResponse.language_guid=this.SelectedLanguageGuid;
      this.answerResponse.section_guid=this.SelectedSectionGuid;
      this.answerResponse.primary_question_guid=this.QuestionDetails.question[0].question_guid;
      this.answerResponse.question_guid=this.QuestionDetails.question[0].question_guid;
      this.answerResponse.question_number=this.QuestionDetails.question[0].question_number;
      this.answerResponse.answers=answer;  
      this.answerResponse.valid_response=true;
      this.answerSubmitEmitter.emit(this.answerResponse);
    }
    else
    {

      // if(this.hasAnswerChanged===true)
      // {
      //   this.messageService.ok('Please select an answer');
      //   this.answerSubmitEmitter.emit();
      // }
      // else
      // {
      //   this.answerSubmitEmitter.emit(true);
      // }      

      if(this.answerResponse.value_changed === true)
      {
        this.messageService.ok('Please select an answer');
      }
            
      this.answerResponse.valid_response=false;
      this.answerSubmitEmitter.emit(this.answerResponse);
      
    }
    
  }

  onFormClear()
  {
    this.QuestionDetails.option.forEach(element => {
     element.selected = false;
    });    
  }

}
