import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
  @Input() QuestionDetails:any; 
  @Input() LanguagesList: any;
  @Input() SelectedLanguageGuid
  @Output() changeLanguageEmitter = new EventEmitter()
  constructor() { }  

  public onLanguageChange(lang_guid) {
    this.changeLanguageEmitter.emit(lang_guid);
  }
  
}
