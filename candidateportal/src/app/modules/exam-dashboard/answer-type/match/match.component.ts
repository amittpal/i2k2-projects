import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AuthService } from "src/app/exam-services/auth/auth.service";
import { QuestionAnswerResponse } from '../question-answer-response.class';


@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnChanges, OnInit {
  _answerSubmitted: boolean;
  _candidateGuid: any;
  _clearForm: boolean;
  
  @Input() QuestionDetails: any;
  @Input() SelectedLanguageGuid: any;
  @Input() SelectedSectionGuid: any;
  @Input() get AnswerSubmitted(): boolean { return this._answerSubmitted; }
  @Input() get ClearFrom(): boolean { return this._clearForm; }

  set AnswerSubmitted(answerSubmitted: boolean) {
    this._answerSubmitted = answerSubmitted;
    if (answerSubmitted === true) {
      this.onFormSubmit();
    }
  }

  set ClearFrom(clearForm: boolean) {
    this._clearForm =clearForm;
    if (clearForm === true) {
      this.onFormClear();
    }
  }

  @Output() answerSubmitEmitter = new EventEmitter();
  @Output() answerChangedEmitter = new EventEmitter();

  answerResponse: QuestionAnswerResponse=new QuestionAnswerResponse();

  matchQuestionFormGroup: FormGroup;
  private optionFormArray = new FormArray([]);
  matchAnswers = [];
  constructor(private messageService: MessageService, private authService: AuthService) {
    this._candidateGuid = this.authService.getUserUniqueId();
  }

  ngOnChanges() {
    this.optionFormArray.clear();
    this.matchAnswers = [];
    this.answerResponse.value_changed=false;
    //creating options 
    if (this.QuestionDetails.answers.length > 0) {
      this.QuestionDetails.option.forEach((e, index) => {
        this.optionFormArray.push(
          new FormGroup({
            match_guid: new FormControl(this.QuestionDetails.answers[index].match_guid, [Validators.required]),
          }));
      });
      this.matchAnswers = this.QuestionDetails.answers;
    }
    else {
      this.QuestionDetails.option.forEach((e, index) => {
        this.optionFormArray.push(
          new FormGroup({
            match_guid: new FormControl('', [Validators.required]),
          }));
      });
    }

    this.matchQuestionFormGroup = new FormGroup({
      optionsArray: this.optionFormArray
    });


  }
  ngOnInit() { }

  onOptionSelect(optionDetails: any, selectedOption: any) {
    if (optionDetails && selectedOption.target.value) {
      let savedAnswerIndex = this.matchAnswers.findIndex(ans => ans.option_Guid === optionDetails.option_Guid);
      if (savedAnswerIndex > -1) {
        this.matchAnswers.find(ans => ans.option_Guid === optionDetails.option_Guid).match_guid = selectedOption.target.value;
      }
      else {
        let answer = {
          "question_guid": optionDetails.question_guid,
          "option_Guid": optionDetails.option_Guid,
          "match_guid": selectedOption.target.value
        }
        this.matchAnswers.push(answer);
      }
    }
    this.answerResponse.value_changed = true;
    this.answerChangedEmitter.emit(); 
  }

  onFormSubmit() {

    if (this.matchQuestionFormGroup && this.matchQuestionFormGroup.valid) {
      // let answer =
      // {
      //   "candidate_guid": this._candidateGuid,
      //   "question_guid": this.QuestionDetails.question[0].question_guid,
      //   "answers": this.matchAnswers
      // }

      // if(this.hasAnswerChanged===true)
      // {
      //   this.answerSubmitEmitter.emit(answer);
      // }
      // else
      // {
      //   this.answerSubmitEmitter.emit(true);
      // } 
      this.answerResponse.candidate_guid = this._candidateGuid;
      this.answerResponse.language_guid=this.SelectedLanguageGuid;
      this.answerResponse.section_guid=this.SelectedSectionGuid;
      this.answerResponse.primary_question_guid=this.QuestionDetails.question[0].question_guid;
      this.answerResponse.question_guid = this.QuestionDetails.question[0].question_guid;
      this.answerResponse.question_number=this.QuestionDetails.question[0].question_number;
      this.answerResponse.answers = this.matchAnswers;
      this.answerResponse.valid_response = true;
      this.answerSubmitEmitter.emit(this.answerResponse);


    }
    else {
      if(this.answerResponse.value_changed === true)
      {
        document.getElementById('matchQuestionForm').classList.add('was-validated');
        this.messageService.ok('Please provide required data.');
      }
           
      this.answerResponse.valid_response = false;
      this.answerSubmitEmitter.emit(this.answerResponse);
      // if(this.hasAnswerChanged===true)
      // {
      //   document.getElementById('matchQuestionForm').classList.add('was-validated');
      //   this.messageService.ok('Please provide required data.')
      //   this.answerSubmitEmitter.emit();
      // }
      // else
      // {
      //   this.answerSubmitEmitter.emit(true);
      // }     
    }
  }
  onFormClear()
  {
    this.QuestionDetails.option.forEach(element => {
     element.selected = false;
    });    
  }
}
