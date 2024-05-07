import { Component, Input,Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-full-question-view',
  templateUrl: './full-question-view.component.html',
  styleUrls: ['./full-question-view.component.scss']
})
export class FullQuestionViewComponent  {

  @Input() QuestionsList;   
  @Input() SelectedLanguageGuid;  
  @Input() LanguagesList;  
  @Output() questionClickEmitter = new EventEmitter();
  @Output() selectLanguageClickEmitter = new EventEmitter();  
  group:any;

  constructor() { }
  
  ngOnChanges()
  {    
    this.groupQuestionsBySectionName();          
  }

  groupQuestionsBySectionName()
  {    
    if(this.QuestionsList && this.SelectedLanguageGuid)
    {
      this.group = this.QuestionsList.filter(s=>s.question[0].language_guid === this.SelectedLanguageGuid)
      .reduce((r, a) => {       
        r[a.question[0].section_name] = [...r[a.question[0].section_name] || [], a.question];
        return r;
       }, {});  
    }  
  }
  onQuestionCardClick(questionGuid:any)
  {
    if(questionGuid)
    {
      this.questionClickEmitter.emit(questionGuid);
    }
  }

  onLanguageChange(languageGuid:string)
  {
    if(languageGuid)
    {
      this.SelectedLanguageGuid=languageGuid;
      this.selectLanguageClickEmitter.emit(languageGuid);
      this.groupQuestionsBySectionName();
    }    
  }
  
  
}
