import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { SharedService } from 'src/app/modules/exam-planning/setup-exam-planning/plan-exam-setup/service/shared.service';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.scss']
})
export class PaymentViewComponent implements OnInit {
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;
  examId: string;
  Id: string;
  examNumber: string;
  exam_details:any;
  public exam_number: any;
  constructor(
    private route: ActivatedRoute,
    private primaryHeader: PrimaryHeaderService, private SharedService: SharedService, private restService: GlobalRestService
  ) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Payment Gateway");
    this.route.params.subscribe((params: Params) => {
      this.examId = params['examId'];
      this.Id = params['id'];
      this.getExamSetupDetailsByExamId();

      this.SharedService.ExamId.next(this.examId); //Sharing Exam ID to other component
    }, error => {
      console.error('Error: ', error);

    });
  }
  getExamSetupDetailsByExamId() {
    // var keyData = [
    //   {
    //     "name": "examId",
    //     "value": this.examId
    //   }
    // ]; this.restService.ApiEndPointUrlOrKey = Answerbook.getExamDetailsbyExamId;
    // this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    // this.restService.callApi(keyData).subscribe(successResponse => {
    //   this.exam_number = successResponse.exams[0].exam_number;
    //   this.exam_details=successResponse.exams[0];
    // }, errorResponse => {
    //   console.error('ERROR: ', errorResponse.message[0]);
    // });
  }
  // select the requested tab
  public nextTab(tabId: number) {
    this.tabset.tabs[tabId].active = true;
  }

  // select the requested tab
  public exam_num(exam_num: string) {
    this.examNumber = exam_num;
  }



}
