import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from "src/app/exam-services/auth/auth.service";
import { QuestionAnswerResponse } from '../question-answer-response.class';


@Component({
  selector: 'app-subjective',
  templateUrl: './subjective.component.html',
  styleUrls: ['./subjective.component.scss']
})
export class SubjectiveComponent implements OnChanges {

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button  
      ['image']                         // ['link', 'image', 'video'] link and image, video
    ],
    imageResize: true
  };
  mobileQuillConfig = {
    toolbar: [
      [],        // toggled buttons
    ],
    imageResize: true
  }

  _candidateGuid: any;
  _answerSubmitted: boolean;
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

  answerFormGroup: FormGroup;    
  answerResponse:QuestionAnswerResponse=new QuestionAnswerResponse();
  constructor(private authService: AuthService) {
    this._candidateGuid = this.authService.getUserUniqueId();
  }

  ngOnChanges() {  
    let answer = '';
    this.answerResponse.value_changed=false;
    if (this.QuestionDetails.answers.length > 0) {
      answer = this.QuestionDetails.answers[0].option_text;
    }
    this.answerFormGroup = new FormGroup({
      answer_text: new FormControl(answer, [Validators.required])
    })
    this.answerFormGroup.valueChanges.subscribe(data => {      
       if(data.answer_text)
       {
        this.answerResponse.value_changed=true;
       }      
   })
  }
  onAnswerChange()
  {    
    this.answerResponse.value_changed=true;   
    this.answerChangedEmitter.emit();  
  }
  onFormSubmit() {                  
    if (this.answerFormGroup && this.answerFormGroup.valid) {                        
      this.answerResponse.candidate_guid=this._candidateGuid;
      this.answerResponse.language_guid=this.SelectedLanguageGuid;
      this.answerResponse.section_guid=this.SelectedSectionGuid;
      this.answerResponse.primary_question_guid=this.QuestionDetails.question[0].question_guid;
      this.answerResponse.question_guid=this.QuestionDetails.question[0].question_guid;
      this.answerResponse.question_number=this.QuestionDetails.question[0].question_number;
      this.answerResponse.answers=
      [
        {
          "question_guid": this.QuestionDetails.question[0].question_guid,
          "option_text": this.answerFormGroup.get('answer_text').value,
        }
      ];
      this.answerResponse.valid_response=true;
      this.answerSubmitEmitter.emit(this.answerResponse);
    }
    else {
      if(this.answerResponse.value_changed === true)
      {
        document.getElementById('answerForm').classList.add('was-validated');
      }
      
      this.answerResponse.valid_response=false;
      this.answerSubmitEmitter.emit(this.answerResponse);           
    }
  }
  onFormClear()
  {
    this.answerFormGroup.get('answer_text').setValue('');
  }
}
