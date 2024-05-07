import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { PrimaryHeaderService } from '../../../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Author } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from 'src/app/shared/models/app.models';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-manage-exam-shifts',
  templateUrl: './manage-exam-shifts.component.html',
  styleUrls: ['./manage-exam-shifts.component.scss']
})
export class ManageExamShiftsComponent implements OnInit {

  @Input() examId: any;
  examShiftDetails: any = {};
  items: any;
  lastSeenIdMin: any;
  lastSeenIdMax: any;
  lastOffset: any;
  itemCount: any;
  notFound: any;

  constructor(
    private configService: AppsettingsConfService,
    private route: ActivatedRoute,
    private router: Router,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService) { }

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("MANAGE QUESTION ASSIGNMENTS");
    this.getRouteParam();
    this.getIntialData();

  }

  getRouteParam() {
    this.route.params.subscribe((params: Params) => {
      this.examId = params['id'];
    }, error => {
      console.error('Error: ', error);
    });
  }

  getIntialData() {

    var keyData = [
      {
        "name": "examId",
        "value": this.examId
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Author.getAssignmentShiftDetail;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.initializeFormFields(successResponse);
      this.items = successResponse.manage_assignments;
      this.items.forEach(element => {
        element["number_of_questions_balance"] = Number(element["total_no_of_question"]) - Number(element["number_of_questions_assigned"]);
      });
    },
      errorResponse => {
        this.messageService.alert(errorResponse);
      })
  }

  initializeFormFields(data: any) {
    if (data.exams.length > 0) {
      this.examShiftDetails = data.exams[0];
    }
  }

}
