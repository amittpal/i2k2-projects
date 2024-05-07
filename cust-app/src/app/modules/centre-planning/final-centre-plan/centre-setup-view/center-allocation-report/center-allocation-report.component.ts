import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { PrimaryHeaderService } from "../../../../layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import { Centre } from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";
import { Router } from "@angular/router";
import { SharedService } from "../service/shared.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-center-allocation-report',
  templateUrl: './center-allocation-report.component.html',
  styleUrls: ['./center-allocation-report.component.scss']
})
export class CenterAllocationReportComponent implements OnInit {
  
  @Input() regGuid: any;
  @Input() snapShotId: any;
  @Input() selectedExamGuid: any;
  @Output() private setExamGuid = new EventEmitter<number>();

  public templateUrl = "";
  public layout;
  public dataSet: {} = {};
  public centreReportFormGroup: FormGroup;
  importId: any;
  importIdSub: Subscription;
  private appRoutes: any = {};
  shiftWiseDataset: any = {};
  centerWiseDataset: any = {};
  examList = [];

  constructor(
    private configService: AppsettingsConfService,    
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService,
    private SharedService: SharedService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.configService.getAppRoutes.subscribe(
      (configData) => {
        this.appRoutes = configData;
      },
      (error) => {
        console.error("Error for configService.getAppRoutes: ", error);
      }
    );
   }

  ngOnInit() {
    this.centreReportFormGroup = this.fb.group({
      examCode: new FormControl(''),
      reportOption: new FormControl("2")
    });    
    this.layout = "CentreWise";
    this.templateUrl = "/reports/centreplan/" + this.layout + ".mrt";
    this.getExamList();
  }

  getExamList() {
    this.examList = [];
    var keyData = [
      {
        name: "regGuid",
        value: this.regGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Centre.getExamList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {
        this.examList = successResponse.code;    
        if (this.selectedExamGuid) {
          this.centreReportFormGroup.controls["examCode"].setValue(this.selectedExamGuid);
          this.getReportByCenter();
        }
        else if (this.examList.length > 0) {
          this.centreReportFormGroup.controls["examCode"].setValue(this.examList[0]["exam_guid"]);
          this.getReportByCenter();
        }
      })
  }

  valueChange(event: any) {
    const id = event.target.value;
    this.layout = id == "1" ? "Shiftwise" : "CentreWise";
    this.templateUrl = "/reports/centreplan/" + this.layout + ".mrt";
    if(id == "1"){
      this.getReportByShift();      
    }
    if (id == "2") {
      this.getReportByCenter();      
    }        
  }

  resetReportOption() {
    let examGuid = this.centreReportFormGroup.controls["examCode"].value;
    this.setExamGuid.emit(examGuid);    
    this.centreReportFormGroup.controls["reportOption"].setValue("0");
    this.layout = "";
  }

  getReportByShift() {

    // call api code here...
    if (Object.keys(this.appRoutes).length !== 0) {
      let examGuid = this.centreReportFormGroup.controls["examCode"].value;
      //// API call for new exam
      var keyData = [
        {
          name: "examGuid",
          value: examGuid
        },
        {
          name: "snapshotId",
          value: this.snapShotId
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Centre.getReportByShift;
      this.restService.ApiEndPointMehod = RestMethods.Get;
      this.restService.callApi(keyData).subscribe(
        (successResponse) => {
          this.shiftWiseDataset = successResponse;
          this.dataSet = this.shiftWiseDataset;
        },
        (errorResponse) => {
          console.log(errorResponse);
          this.messageService.alert(errorResponse.httpErrorResponse);
        }
      );
    }

  }

  getReportByCenter() {

    // call api code here...
    if (Object.keys(this.appRoutes).length !== 0) {
      let examGuid = this.centreReportFormGroup.controls["examCode"].value;
      //// API call for new exam
      var keyData = [
        {
          name: "examGuid",
          value: examGuid
        },
        {
          name: "snapshotId",
          value: this.snapShotId
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Centre.getReportByCenter;
      this.restService.ApiEndPointMehod = RestMethods.Get;
      this.restService.callApi(keyData).subscribe(
        (successResponse) => {
          this.centerWiseDataset = successResponse;
          this.dataSet = this.centerWiseDataset;
        },
        (errorResponse) => {
          console.log(errorResponse);
          this.messageService.alert(errorResponse.httpErrorResponse);
        }
      );
    }

  }

  public formSubmit() {
    // if (this.finalizeStatus) {
    // call api code here...
    if (Object.keys(this.appRoutes).length !== 0) {
      //// API call for new exam
      var keyData = [
        {
          name: "regGuid",
          value: this.regGuid,
        },
        {
          name: "allocationSnapshotId",
          value: this.snapShotId
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Centre.finalizeCentrePlanning;
      this.restService.ApiEndPointMehod = RestMethods.Get;
      this.restService.callApi(keyData).subscribe(
        (successResponse) => {
          this.messageService
            .okRedirectModal(successResponse, "SUCCESS", "Go to Main list")
            .subscribe((result) => {
              if (result == true) {
                // OK = true for redirection
                this.messageService.hideModal();
                this.router.navigate(["/centre/planning/finalize"]);
              } else {
                // NO/CANCEL = false
                this.messageService.hideModal();
              }
            });
        },
        (errorResponse) => {
          console.log(errorResponse);
          this.messageService.alert(errorResponse.httpErrorResponse);
        }
      );
    }
  }

}
