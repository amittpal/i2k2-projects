import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { Author, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-single-choice-manage',
  templateUrl: './single-choice-manage.component.html',
  styleUrls: ['./single-choice-manage.component.scss']
})
export class SingleChoiceManageComponent implements OnInit {
  @Input() QuestionDetails: any;
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent; 
  questionAddSetupFormGroup: FormGroup;
  questionAddFormGroup: FormGroup;
  optionFormArray = new FormArray([]);

  optionList = ["(a)", "(b)", "(c)", "(d)", "(e)", "(f)", "(g)"];
  imgSrc = "";
  

  quillConfig={
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
  
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
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

  ngOnChanges() {
    this.clearForm();
    this.setupInitialDetails();
  }

  showFilter() {
    /*
    opening filter on component load (need to refactor this logic).
    handle via input parameter in filterToggle directive
    */
    document.querySelector('.az-content-dashboard-three').classList.add('filter-show');
    document.querySelector('.az-content-dashboard-three').classList.remove('filter-mobile');
  }

  initializeForm() {
    let details = this.QuestionDetails.question_summary[0];
    if (details) {
      this.questionAddSetupFormGroup = new FormGroup({
        exam_number: new FormControl({ value: details.exam_number, disabled: true }),                        
        subject: new FormControl({ value: details.subject, disabled: true }),                
        language: new FormControl({ value: details.language, disabled: true }),
        questions: new FormControl({ value: details.number_of_options, disabled: true }),
        option: new FormControl('')
      });

      //creating options            
      for (let option = 0; option < this.QuestionDetails.options.length; option++) {
        this.optionFormArray.push(new FormControl(this.QuestionDetails.options[option].description, Validators.required));
      }
      this.questionAddFormGroup = new FormGroup({
        question: new FormControl(this.QuestionDetails.question[0].description, Validators.required),
        optionsArray: this.optionFormArray,
        answer: new FormControl(null)
      })
    }
  }


  setupInitialDetails() {
   
    //mapping array element for checkbox
    this.QuestionDetails.option_primary = this.QuestionDetails.option_primary
      .map((arrayData, index) => (
        {
          "selected": this.QuestionDetails.answer_primary.some(el => el.option_guid === arrayData.guid),
          ...arrayData
        }));

     this.QuestionDetails.options = this.QuestionDetails.options
      .map((arrayData, index) => (
        {
          
          "selected": false,
          ...arrayData
        }));

    this.QuestionDetails.requirement_summary = this.QuestionDetails.requirement_summary.map((e, index) => ({ "selected": false, ...e }));
    this.setSelectedAnswer();
    this.initializeForm();          
  }

  onAddQuestionFormsubmit() {    
    
    if (this.questionAddFormGroup.valid) {
      ////updating question 
      this.QuestionDetails.question[0].description = this.questionAddFormGroup.get('question').value;
      ////updating answer
      let optionsArrayValue = this.questionAddFormGroup.value.optionsArray;
      optionsArrayValue.forEach((element, index) => {
        this.QuestionDetails.options[index].description = element;
      });
           
      if (this.QuestionDetails.question[0].question_id) {
        //updating records
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
        this.restService.ApiEndPointUrlOrKey = Author.updateQuestionDetails;
        this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
        this.restService.HttpPostParams = this.addParams();
        this.restService.ShowLoadingSpinner = true;
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => {
            //this.messageService.alert(sucessResponse);
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go Back to List').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                this.router.navigate(["/author/questions/" + this.QuestionDetails.question_summary[0].exam_guid + "/manage"]);
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
        this.restService.ApiEndPointUrlOrKey = Author.addQuestionDetails;
        this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
        this.restService.HttpPostParams = this.addParams();
        this.restService.ShowLoadingSpinner = true;
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => {
            //this.messageService.alert(sucessResponse);
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go Back to List').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                this.router.navigate(["/author/questions/" + this.QuestionDetails.question_summary[0].exam_guid + "/manage"]);
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
    else
    { 
      this.messageService.ok('Please provide required data.');
      document.getElementById('questionAddForm').classList.add('was-validated');      
    }
  }


  addParams() {
    let postParams = {
      "detail_id": this.QuestionDetails.question[0].detail_id,
      "question_id": this.QuestionDetails.question[0].question_id,
      "question_number": this.QuestionDetails.question_summary[0].question_number,
      "guid": "",
      "description": this.QuestionDetails.question[0].description,
      "options": this.QuestionDetails.options,
      "answer": this.QuestionDetails.answer,
      "question_references":this.QuestionDetails.question_references_primary,
      "primary_question_id": this.QuestionDetails.question_summary[0].primary_question_id,
      "subject_guid": this.QuestionDetails.question_summary[0].subject_guid,
      "language_guid": this.QuestionDetails.question_summary[0].language_guid,
      "difficulty_level_guid": this.QuestionDetails.question_summary[0].difficulty_level_guid,
      "answer_types_guid": this.QuestionDetails.question_summary[0].answer_types_guid,
      "question_type_guid":this.QuestionDetails.question_summary[0].question_type_guid
    }
    return postParams
  }

  setSelectedAnswer()
  {
    let index=this.QuestionDetails.option_primary.findIndex(q=>q.selected===true);
    if(index>-1)
    {
      this.QuestionDetails.options[index].selected=true;
      this.QuestionDetails.answer=[];
      let answer={
        "detail_id": this.QuestionDetails.options[index].detail_id,
        "question_id": this.QuestionDetails.options[index].question_id,
        "option_guid": this.QuestionDetails.options[index].guid  
      }

      this.QuestionDetails.answer.push(answer);
    }       
  }

  clearForm() {

    if (this.tabset) {

      if (this.tabset.tabs.length > 0) {

        //selecting default tab
        this.tabset.tabs[0].active = true;
      }   
    }

  }
}
