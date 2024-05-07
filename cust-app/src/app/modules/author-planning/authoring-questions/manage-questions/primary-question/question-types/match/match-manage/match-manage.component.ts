import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import {  Router } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { Author, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';
import { QuestionAnswerType } from 'src/app/shared/enumrations/question.enumerations';

// //register quill image resize module
// import ImageResize from 'quill-image-resize';
// import * as QuillNamespace from 'quill';
// let Quill: any = QuillNamespace;
// Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-match-manage',
  templateUrl: './match-manage.component.html',
  styleUrls: ['./match-manage.component.scss']
})
export class MatchManageComponent implements OnInit {
  @Input() QuestionDetails: any;    
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;  
 
  questionAddSetupFormGroup: FormGroup;
  questionAddFormGroup: FormGroup;
  optionFormArray = new FormArray([]);
  optionList = ["(a)", "(b)", "(c)", "(d)", "(e)", "(f)", "(g)"];
  matchOptions=[]; 
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

  ngOnChanges() {
    this.clearForm();
    this.setupInitialDetails();
  }


 
  initializeForm() {
    let details = this.QuestionDetails.question_summary[0];
    if (details) {  
      this.questionAddSetupFormGroup = new FormGroup({
        exam_number: new FormControl({ value: details.exam_number, disabled: true }),
        exam_grade: new FormControl({ value: details.exam_grade, disabled: true }),
        difficulty_level: new FormControl({ value: details.difficulty_level, disabled: true }),
        exam_type: new FormControl({ value: details.exam_type, disabled: true }),
        subject: new FormControl({ value: details.subject, disabled: true }),
        question_type: new FormControl({ value: details.question_type, disabled: true }),
        exam_code: new FormControl({ value: details.code, disabled: true }),
        language: new FormControl({ value: details.language, disabled: true }),
        questions: new FormControl({ value: details.number_of_options, disabled: true }),
        option: new FormControl('')
      });

      //creating options            
      for (let option = 0; option < this.QuestionDetails.options.length; option++) {
        this.optionFormArray.push(
          new FormGroup({
            description:new FormControl(this.QuestionDetails.options[option].description, [Validators.required]),
            match_description:new FormControl(this.QuestionDetails.options[option].match_description, [Validators.required]),
            match_guid:new FormControl(this.QuestionDetails.options[option].match_guid, [Validators.required]),
            match_option_number:new FormControl(this.QuestionDetails.options[option].match_option_number, [Validators.required])            
          }));        
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
    // this.QuestionDetails.options = this.QuestionDetails.options
    //   .map((arrayData, index) => (
    //     {
    //       "selected": this.QuestionDetails.answer.some(el => el.option_guid === arrayData.guid),
    //       ...arrayData
    //     }));

    this.QuestionDetails.requirement_summary = this.QuestionDetails.requirement_summary.map((e, index) => ({ "selected": false, ...e }));
    //mapping reference array for table 3 
    this.QuestionDetails.question_references = this.QuestionDetails.question_references.map((e, index) => ({ "line_num": index + 1, ...e }));
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
        this.QuestionDetails.options[index].description = element.description;
        this.QuestionDetails.options[index].match_description = element.match_description;
      });

      // //must have atleast one reference added
      // let questionReferences=this.QuestionDetails.question_references;
      // if (questionReferences.length == 0) {
      //   this.messageService.ok('Please add reference for question anwer');
      //   return;
      // }
      // else
      // {
      //   //reference data must not be empty
      //   if(questionReferences[0].reference==="" || questionReferences[0].remark==="")
      //   {
      //     this.messageService.ok('Please provide valid reference data');
      //     return;
      //   }
      // }

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
                this.router.navigate(["/author/questions/" +this.QuestionDetails.question_summary[0].exam_guid + "/manage"]);
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
      "question_references": this.QuestionDetails.question_references,
      "primary_question_id": this.QuestionDetails.question_summary[0].primary_question_id,
      "subject_guid": this.QuestionDetails.question_summary[0].subject_guid,
      "language_guid": this.QuestionDetails.question_summary[0].language_guid,
      "difficulty_level_guid": this.QuestionDetails.question_summary[0].difficulty_level_guid,
      "answer_types_guid": this.QuestionDetails.question_summary[0].answer_types_guid,
      "question_type_guid":this.QuestionDetails.question_summary[0].question_type_guid,
      //"matchOptions":this.matchOptions
    }
    return postParams
  }

  onAnswerChange(optionDetails:any,matchOptionDetails:any) {          
    const questionAnswer=this.QuestionDetails.answer;  
    const matchAnswerDetails= this.QuestionDetails.options.find(x=>x.match_guid===matchOptionDetails.target.value);
    //const dds=this.optionFormArray.value.find(x=>x.match_guid===matchOptionDetails.target.value);    
    //updating answer      
    const answerObjcet={
      "question_id":this.QuestionDetails.question[0].question_id,
      "option_guid":optionDetails.guid,
      "match_guid":matchAnswerDetails.match_guid      
    }      
    const index=questionAnswer.findIndex(ques=> ques.option_guid===optionDetails.guid);
    if(index>-1)
    {   
     //updating answers
     this.QuestionDetails.answer[index]=answerObjcet;              
    }
    else
    {    
      this.QuestionDetails.answer.push(answerObjcet);   
    }  
    //  //updating match ans   
    // const matchOptionsObject={      
    //   "option_guid":optionDetails.guid,
    //   "match_guid":matchAnswerDetails.match_guid,
    //   "option_number": matchAnswerDetails.match_option_number,
    //   "description": dds.match_description
    // }
    // const matchIndex= this.matchOptions.findIndex(ques=> ques.option_guid===optionDetails.guid);
    // if(matchIndex>-1)
    // {     
    //   this.matchOptions.splice(index,1);
    //   this.matchOptions.push(matchOptionsObject);     
    // }
    // else
    // {
    //   this.matchOptions.push(matchOptionsObject);       
    // }  
    // console.log(this.matchOptions);
  }
  updateReferenceList(data: any) {
    this.QuestionDetails.question_references = data;
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
