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
  selector: 'app-center-allocation-report-view',
  templateUrl: './center-allocation-report-view.component.html',
  styleUrls: ['./center-allocation-report-view.component.scss']
})
export class CenterAllocationReportViewComponent implements OnInit {

  @Input() examGuid: any;
  public templateUrl = "";
  public layout;
  public dataSet: {} = {};
  public centreReportFormGroup: FormGroup;
  importId: any;
  importIdSub: Subscription;
  private appRoutes: any = {};
  shiftWiseDataset: any = {};
  centerWiseDataset: any = {};
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
    this.getImportId();
    this.centreReportFormGroup = this.fb.group({
      reportOption: new FormControl("2")
    });
    this.layout = "CentreWise";
    this.templateUrl = "/reports/centreplan/" + this.layout + ".mrt";
    this.getReportByCenter();
  }

  valueChange(event: any) {
    const id = event.target.value;
    this.layout = id == "1" ? "Shiftwise" : "CentreWise";
    this.templateUrl = "/reports/centreplan/" + this.layout + ".mrt";
    if (id == "1") {
      this.getReportByShift();
    }
    if (id == "2") {
      this.getReportByCenter();
    }
  }

  getImportId() {
    this.importIdSub = this.SharedService.importId.subscribe((id) => {
      if (id) {
        this.importId = id;
      } else {
        console.log("Please Fill exam first");
      }
    });
  }

  getReportByShift() {

    // call api code here...
    if (Object.keys(this.appRoutes).length !== 0) {
      //// API call for new exam
      var keyData = [
        {
          name: "examGuid",
          value: this.examGuid
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
      //// API call for new exam
      var keyData = [
        {
          name: "examGuid",
          value: this.examGuid
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

}
