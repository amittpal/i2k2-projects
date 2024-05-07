import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Centre,
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

import { SharedService } from "../service/shared.service";

@Component({
  selector: "app-exam",
  templateUrl: "./exam.component.html",
  styleUrls: ["./exam.component.scss"],
})
export class ExamComponent implements OnInit {
  public examDetailFormGroup: FormGroup;
  private appRoutes: any = {};
  public examDetail: any = {};
  public exams: any = {};
  public examList : any = [];
  uomsList: any;
  daysList: any;
  daysDetails: any = [];
  dayNumberJson: any = [];
  @Input() examGuid: any; // get examID from parent component
  @Input() snapShotId: any; // get Snapshot id from parent component

  @Output() private nextTab = new EventEmitter<number>(); // Sends tab id to parent component
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
        name: "regGuid",
        value: this.examGuid
      },
      {
        name: "id",
        value: this.snapShotId
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Centre.getSnapshotInfo;
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
      exam_days: new FormControl("", Validators.required),
      snapshotCode: new FormControl("", Validators.required),
      snapshotName: new FormControl("", Validators.required)
    });
  }

  private getParams() {
    let formValues = this.examDetailFormGroup.getRawValue();
    if (formValues.exam_days[0]["days_number"] == undefined) {
      this.selectedDays.forEach((element) => {
        this.daysDetails.day_number = element.id;
        this.dayNumberJson.push(Object.assign({}, this.daysDetails));
      });
    } else {
      this.dayNumberJson = formValues.exam_days;
    }
    let params = {
      id: this.examDetail.snapshot_number,
      snapshot_code: this.examDetailFormGroup.controls["snapshotCode"].value,
      snapshot_name: this.examDetailFormGroup.controls["snapshotName"].value,
      days_number: this.dayNumberJson
    };

    return params;
  }

  public formSubmit() {
    if (this.examDetailFormGroup.valid === false) {
      let form = document.getElementById("examDetailForm");
      form.classList.add("was-validated");
    } else if (this.examDetailFormGroup.valid === true) {
      let params = this.getParams();

      var keyData = [
        {
          name: "id",
          value: this.examDetail.snapshot_number
        },
        {
          name: "regGuid",
          value: this.examGuid
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Centre.updateShiftSnapshot;
      this.restService.ApiEndPointMehod = RestMethods.Put;
      this.restService.HttpPostParams = params;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.callApi(keyData).subscribe(
        (sucessResponse) => {
          // this.SharedService.cityPriorityNumber.next(this.priorityCity);
          // this.SharedService.tabsId.next(1);
          // this.SharedService.changeTab.next(1);
          this.messageService.alert(sucessResponse);
        },
        (errorResponse) => {
          // this.messageService.alert(errorResponse);
        }
      );
    }
  }

  multiSubjectComp(c1: any, c2?: any): any {
    try {
      if (c1.id == c2.days_number) {
        return c1;
      }
    } catch (e) {
      // console.log(e);
    }
  }

  initializeFormFields(data: any) {
    if (data.snapshot_info.snap_shot.length > 0) {
      this.priorityCity = data["snapshot_info"]["snap_shot"][0]["number_of_city_priority"];
      this.examDetail = data["snapshot_info"]["snap_shot"][0];
      this.exams = data["snapshot_info"]["exams"][0]; 
      this.examList = data["snapshot_info"]["exams"];
      
      this.examDetailFormGroup.patchValue({
        exam_days: data["snapshot_info"]["days"],
        snapshotCode: this.examDetail.snapshot_code,
        snapshotName: this.examDetail.snapshot_name
      });
      this.SharedService.cityPriorityNumber.next(
        data["snapshot_info"]["exams"][0]["number_of_city_priority"]
      );
      this.SharedService.registrationStatus.next(
        data["snapshot_info"]["snap_shot"][0]["planning_status"]
      );
      //this.SharedService.importId.next(this.examDetail.import_id); //commented needs to be checked
      //this.exam_num.emit(data["shifts"][0]["exam_number"]); //commented needs to be checked
    }
  }
}
