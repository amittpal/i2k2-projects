import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mock-question-header',
  templateUrl: './mock-question-header.component.html',
  styleUrls: ['./mock-question-header.component.scss']
})
export class MockQuestionHeaderComponent implements OnInit {

  @Input() ExamDetails;
  constructor() { }

  ngOnInit() {
}

}
