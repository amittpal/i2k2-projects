import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { ExamHeaderService } from 'src/app/modules/layout/exam-header/exam-header.service';
@Component({
  selector: 'app-answers-summary',
  templateUrl: './answers-summary.component.html',
  styleUrls: ['./answers-summary.component.scss']
})
export class AnswersSummaryComponent implements OnInit, OnChanges {
  @Input() SectionName:string  
  @Input() AnswerSummary:any;
  @Input() QuestionDetails: any;
  @Input() SelectedSectionGuid: any;
  @Input() CandidateInformation: any;
  @Input() SectionsList: any;
  @Output() ResumeExamEmitter = new EventEmitter();
  @Output() SubmitExamEmitter = new EventEmitter();
  examDetails:any;
  total:number;

 questionDetails={
    "question_guid":"",
    "sec_guid": ""
  }
  
  constructor(
    private headerService:ExamHeaderService,
    private messageService:MessageService
    ) {}

  ngOnInit() {
    this.SectionName = this.SectionName? this.SectionName: "All Sections";    
  }

  ngOnChanges() {   
        
    this.headerService.exam_config.subscribe(value => {
      this.examDetails = value;
    });
    this.questionDetails.question_guid="";
    //this.updateAnswerStatus();
  }  
  
  onResumeExamClick()
  {    
   this.ResumeExamEmitter.emit(this.questionDetails);
  }

  onQuestionNumberClick(questionGuid:string, sectionGuid: string)
  {
    this.questionDetails.question_guid=questionGuid; 
    this.questionDetails.sec_guid = sectionGuid; 
    this.ResumeExamEmitter.emit(this.questionDetails);

  }

  onSubmitExamClick()
  {
    this.messageService.confirm(
      ["Are you sure you want to submit this exam?","Once you submit, your exam will be locked and you will not be able to resume.","You will need your exam invigilator's permission to leave the examination room."],
       "Confirmation", "Submit", "NO").subscribe(result => {
      if (result == true) {
        this.messageService.hideModal();
        this.SubmitExamEmitter.emit(true);
      }
      else {
        this.messageService.hideModal();
      }

    });    
  }

  updateAnswerStatus()
  {                  
    //adding all status values
    this.total= this.AnswerSummary.answers_status
    .map(item=> parseInt(item.no_of_questions)).reduce((prev,curr)=>prev+curr,0);     
    }     
  }  
