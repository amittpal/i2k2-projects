import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-exam-type-status',
  templateUrl: './exam-type-status.component.html',
  styleUrls: ['./exam-type-status.component.scss']
})
export class ExamTypeStatusComponent implements OnInit {

  @Input() Position:string;
  
  constructor() { }
  ngOnInit(): void {
  }

}
