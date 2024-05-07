import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { QuestionAnswerType } from 'src/app/shared/enumrations/question.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-single-choice',
  templateUrl: './single-choice.component.html',
  styleUrls: ['./single-choice.component.scss']
})
export class SingleChoiceComponent implements OnInit {
  @Input() QuestionDetails: any;
  @ViewChild('tabset', { static: true }) tabset: TabsetComponent;

  questionAddSetupFormGroup: FormGroup;
  questionAddFormGroup: FormGroup;
  optionFormArray = new FormArray([]);
  optionList = ["(a)", "(b)", "(c)", "(d)", "(e)", "(f)", "(g)"];

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

  constructor(
    private router: Router,
    private restService: GlobalRestService,
    private messageService: MessageService) { }
  ngOnInit() {}

  ngOnChanges()
  {   
   this.clearForm();             
   this.setupInitialDetails();

  }
  
  initializeForm() {    
    let details = this.QuestionDetails.question_summary[0];
    if (details) {     
      //creating options            
      for (let option = 0; option < this.QuestionDetails.options.length; option++) {
       
        this.optionFormArray.push(new FormControl(this.QuestionDetails.options[option].description, [Validators.required]));
      }
      this.questionAddFormGroup = new FormGroup({
        question: new FormControl(this.QuestionDetails.question[0].description, [Validators.required]),
        optionsArray: this.optionFormArray,
        answer: new FormControl(null)
      })
    }
  }
  setupInitialDetails() {   
    //mapping array element for checkbox
    this.QuestionDetails.options = this.QuestionDetails.options
      .map((arrayData, index) => (
        {
          "selected": this.QuestionDetails.answer.some(el => el.option_guid === arrayData.guid),
          ...arrayData
        }));

    // this.QuestionDetails.requirement_summary = this.QuestionDetails.requirement_summary.map((e, index) => ({ "selected": false, ...e }));
   
    this.initializeForm();
  }

  onAddQuestionFormsubmit() {  
    //console.log(this.questionAddFormGroup.value);
    if (this.questionAddFormGroup.valid) {
      ////updating question 
      this.QuestionDetails.question[0].description = this.questionAddFormGroup.get('question').value;
      ////updating answer
      let optionsArrayValue = this.questionAddFormGroup.value.optionsArray;
      optionsArrayValue.forEach((element, index) => {
        this.QuestionDetails.options[index].description = element;
      });

     

      //must select a answer
      if (this.QuestionDetails.answer.length == 0) {
        this.messageService.ok('Please select a answer');
        return;
      }

      if (this.QuestionDetails.question[0].question_id) {

        let keyData = [
          {
            "name": "detailId",
            "value": this.QuestionDetails.question[0].detail_id
          },
          {
            "name": "answerType",
            "value": this.QuestionDetails.question_summary[0].answer_type
          }
        ]
        this.restService.ApiEndPointUrlOrKey = Exam.updateMockQuestionsDetails;
        this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
        this.restService.HttpPostParams = this.addParams();
        this.restService.ShowLoadingSpinner = true;
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => {
            //this.messageService.alert(sucessResponse);
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go Back to List').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                this.router.navigate(["/exam/mock-test/" + this.QuestionDetails.question_summary[0].exam_id + "/questions/manage"]);
              }
              else {
                this.messageService.hideModal();
              }
            });
          }, errorResponse => {
            this.messageService.alert(errorResponse);
          });

      }
      else {
        //adding records 
        let keyData = [         
          {
            "name": "answerType",
            "value": this.QuestionDetails.question_summary[0].answer_type
          }
        ]
        this.restService.ApiEndPointUrlOrKey = Exam.addMockQuestionsDetails
        this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
        this.restService.HttpPostParams = this.addParams();
        this.restService.ShowLoadingSpinner = true;
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => {
            //this.messageService.alert(sucessResponse);
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go Back to List').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                this.router.navigate(["/exam/mock-test/" + this.QuestionDetails.question_summary[0].exam_id + "/questions/manage"]);
              }
              else {
                this.messageService.hideModal();
              }
            });
          }, errorResponse => {
            this.messageService.alert(errorResponse);
          });
      }
    }
    else {
      this.messageService.ok('Please provide required data.');
      document.getElementById('questionAddForm').classList.add('was-validated');
    }
  }

  addParams() {    
    let postParams = {
      "id": this.QuestionDetails.question[0].question_id,
      "detail_id": this.QuestionDetails.question[0].detail_id,
      "mock_question_id": this.QuestionDetails.question[0].mock_question_requirment_id,
      "question_number": this.QuestionDetails.question_summary[0].question_number,
      "guid": "",
      "description": this.QuestionDetails.question[0].description,
      "mockOptionList": this.QuestionDetails.options,
      "mockAnswer": this.QuestionDetails.answer,     
      "primary_mock_question_id": this.QuestionDetails.question[0].primary_question,
      "subject_guid": this.QuestionDetails.question_summary[0].subject_guid,
      "language_guid": this.QuestionDetails.question_summary[0].language_guid,
      "difficulty_level_guid": this.QuestionDetails.question_summary[0].difficulty_level_guid,
      "answer_types_guid": this.QuestionDetails.question_summary[0].answer_types_guid,
      "question_type_guid":this.QuestionDetails.question_summary[0].question_type_guid

    }
    return postParams
  }

  onAnswerCheckboxChange(event: any, itemDetails: any) {    
    let isSelectedAny = false;
    this.QuestionDetails.options.forEach(element => {
      //let answerTypeGuid = this.QuestionDetails.question_summary[0].answer_types_guid;
      //for single answer selection  
      //if (QuestionAnswerType.SingleChoice === answerTypeGuid) {
        if (itemDetails === element && event.target.checked) {
          element.selected = event.target.checked;
          this.QuestionDetails.answer = [];
          let mappedObject = Object.assign(element, { "option_guid": element.guid });
          this.QuestionDetails.answer.push(mappedObject);
          isSelectedAny = true;
        }
        else element.selected = false;
      //}
    });
    if (isSelectedAny === false) this.QuestionDetails.answer = [];
  }

 

  clearForm()
  {
    
    if(this.tabset)
    {      
     //selecting default tab
     this.tabset.tabs[0].active = true;
    //clearing existing values from optionsArray.
    this.optionFormArray.clear();   
    }

  }

}
