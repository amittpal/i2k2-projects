import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';

import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { SharedService } from 'src/app/modules/exam-planning/setup-exam-planning/plan-exam-setup/service/shared.service'

@Component({
  selector: 'app-exam-setup',
  templateUrl: './exam-setup.component.html',
  styleUrls: ['./exam-setup.component.scss']
})
export class ExamSetupComponent implements OnInit {
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;
  examId: string;
  Id: string;
  examNumber: string;
  constructor(
    private route: ActivatedRoute,
    private primaryHeader: PrimaryHeaderService, private SharedService: SharedService
  ) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("EXAM SETUP");
    this.route.params.subscribe((params: Params) => {
      this.examId = params['examId'];
      this.Id = params['id'];
      this.SharedService.ExamId.next(this.examId); //Sharing Exam ID to other component
    }, error => {
      console.error('Error: ', error);

    });

  }

  // select the requested tab
  public nextTab(tabId: number) {
    this.tabset.tabs[tabId].active = true;
  }

  //  exam number
  public exam_num(exam_num: string) {
    this.examNumber = exam_num;
  }
}
