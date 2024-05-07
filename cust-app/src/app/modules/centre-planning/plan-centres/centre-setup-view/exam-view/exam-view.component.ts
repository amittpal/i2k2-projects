import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import { Centre } from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

import { SharedService } from "../service/shared.service";

@Component({
  selector: "app-exam-view",
  templateUrl: "./exam-view.component.html",
  styleUrls: ["./exam-view.component.scss"],
})
export class ExamViewComponent implements OnInit {
  public examDetailFormGroup: FormGroup;
  private appRoutes: any = {};
  public examDetail: any = {};
  uomsList: any;
  daysList: any;
  daysDetails: any = [];
  dayNumberJson: any = [];
  @Input() examGuid: any; // get examID from parent component
  @Output() private exam_num = new EventEmitter<string>(); // Sends exam_number to parent tab
  public statusList: any = [
    {
      name: "Active",
      value: "1",
    },
    {
      name: "Inactive",
      value: "0",
    },
  ];
  priorityCity: any;
  selectedDays: any = [];

  constructor(
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService,
    private SharedService: SharedService
  ) {}

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
    this.createForm();
    this.getIntialData();
  }

  valueChange(event: any) {
    this.dayNumberJson = [];
    this.selectedDays = [];
    this.selectedDays = event;
  }

  getIntialData() {
    //Get Days List
    this.restService.ApiEndPointUrlOrKey = Centre.getDaysList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(
      (successResponse) => {
        this.daysList = successResponse.days_number;
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );

    let keyData = [
      {
        name: "examGuid",
        value: this.examGuid,
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Centre.getExamDetail;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      (successResponse) => {
        this.initializeFormFields(successResponse);
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );
  }

  public createForm() {
    this.examDetailFormGroup = new FormGroup({
      priority_city: new FormControl("", Validators.required),
      exam_days: new FormControl("", Validators.required),
    });
  }

  multiSubjectComp(c1: any, c2?: any): any {
    try {
      if (c1.id == c2.dayNumber) {
        return c1;
      }
    } catch (e) {
      // console.log(e);
    }
  }

  initializeFormFields(data: any) {
    if (data.shifts.length > 0) {
      this.examDetail = data.shifts[0];
      this.examDetailFormGroup.patchValue({
        exam_days: data.days_number,
        priority_city: data["shifts"][0]["no_of_city_priority"],
      });
      this.SharedService.cityPriorityNumber.next(
        data["shifts"][0]["no_of_city_priority"]
      );
      this.SharedService.importId.next(this.examDetail.import_id);
      this.examDetailFormGroup.disable();
      this.exam_num.emit(data["shifts"][0]["exam_number"]);
    }
  }
}
