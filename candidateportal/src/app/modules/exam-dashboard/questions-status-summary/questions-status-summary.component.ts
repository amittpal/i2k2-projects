import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { ExamHeaderService } from 'src/app/modules/layout/exam-header/exam-header.service';

@Component({
  selector: 'app-questions-status-summary',
  templateUrl: './questions-status-summary.component.html',
  styleUrls: ['./questions-status-summary.component.scss']
})
export class QuestionsStatusSummaryComponent implements OnChanges {
  @ViewChild('sectionsTabs') sectionsTabs: TabsetComponent;
  //@Input() QuestionStatusDetails:any; 
  _summaryView: boolean;
  _selectSection: boolean;
  photo: any;
  userPhotoUploaded: string = "0";
  // enableProctoring : string = "0";  
  examDetails:any;
  total:number;
  summaryTotal: number;
  @Input() SectionStatus:any; 
  @Input() SectionQuestionStatus:any; 
  @Input() SectionsList: any;
  @Input() AnswerSummary: any;
  @Input() SelectedSectionGuid: any;
  @Input() SelectedQuestionGuid: any;
  @Input() SelectedQuestionNumber: any;
  @Input() SelectedLanguageGuid: any;
  @Input() CandidateInformation: any;
  @Input() get SummaryView(): boolean { return this._summaryView; }
  @Input() get SelectSection(): boolean { return this._selectSection; }
  @Output() questionClickEmitter = new EventEmitter();
  @Output() questionStatusClickEmitter = new EventEmitter(); 
  @Output() sectionClickEmitter = new EventEmitter();
  @Output() sectionActiveEmitter = new EventEmitter();
  

  set SummaryView(summaryView: boolean) {
    this._summaryView = summaryView;
    if (summaryView === true) {
      // this.bindAnswerSummaryDetails();
      // this.bindQuestionSummaryViewDetails();
    } else {
      //this.bindQuestionSummaryViewDetails();
    }
  
  }

  set SelectSection(selecteSection: boolean) {
    this._selectSection = selecteSection;
    if (selecteSection === true) {            
      this.onSelectTabById()
    } 
  
  }

  constructor(
    private headerService:ExamHeaderService) { }
  
  ngOnChanges() {                
    // if(localStorage.getItem("coOrdinates")){
    //   this.enableProctoring = "1";
    // }   
    this.userPhotoUploaded = "1";    
    if(this._summaryView === false && this.SectionStatus)
    {
      this.SectionQuestionStatus=  this.SectionQuestionStatus.filter(s=>s.language_guid=== this.SelectedLanguageGuid);
      this.bindQuestionSummaryViewDetails();
    }
    else if(this._summaryView === true) {
      this.bindAnswerSummaryDetails();
    }    
      
  }
  

  bindQuestionSummaryViewDetails()
  {     
    this.total= this.SectionStatus
    .map(item=> parseInt(item.no_of_questions)).reduce((prev,curr)=>prev+curr,0);   
    
    //console.log(this.total)
    
  }

  bindAnswerSummaryDetails() {
     this.headerService.exam_config.subscribe(value => {
      if(value)
      {
        this.examDetails = value;
      }  
    });

    if(this.AnswerSummary) {
      this.summaryTotal= this.AnswerSummary.section_status
      .map(item=> parseInt(item.no_of_questions)).reduce((prev,curr)=>prev+curr,0);  
    }    
  }
  
  onQuestionNumberClick(questionGuid: string) {
    this.questionClickEmitter.emit(questionGuid);
  }

  onQuestionStatusClick(statusGuid: string) {
    this.questionStatusClickEmitter.emit(statusGuid);
  }

  onSectionClick(index, sectionInfo) {        
    if(this._selectSection)
    {
      let questionGuid=this.SelectedQuestionGuid;
      this.sectionClickEmitter.emit({index, sectionInfo,questionGuid});
    }
    else
    {
      this.sectionClickEmitter.emit({index, sectionInfo});
    }
    
  }

  onSelectTabById()
  {   
    let activeTabIndex=this.SectionsList.findIndex(s=>s.section_guid === this.SelectedSectionGuid);
    if(activeTabIndex > -1)
    {
      // old logic when full question tab was first 
      //this.sectionsTabs.tabs[activeTabIndex+1].active=true;
            
      //new logic      
      this.sectionsTabs.tabs[activeTabIndex].active=true;      
      //manual select tab 
      const sectionInfo=this.SectionsList.find(s=>s.section_guid === this.SelectedSectionGuid);
      if(sectionInfo)
      {
        this.onSectionClick(activeTabIndex,sectionInfo);
      }
    } 
  }

}