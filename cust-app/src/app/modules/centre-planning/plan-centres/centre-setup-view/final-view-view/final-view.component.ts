import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { Router } from "@angular/router";
import { PrimaryHeaderService } from "../../../../layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Exam,
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";
import { Centre } from "src/app/shared/enumrations/app-enum.enumerations";

import { SharedService } from "../service/shared.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-final-view-only",
  templateUrl: "./final-view.component.html",
  styleUrls: ["./final-view.component.scss"],
})
export class FinalViewOnlyComponent implements OnInit {
  @Input() examGuid: any;
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  optionList: any; // del
  finalViewFormGroup: FormGroup;
  private appRoutes: any = {};
  priority: any;
  importId: any;
  importIdSub: Subscription;
  cityPrioritySub: Subscription;
  priorityList: any = [];
  itemJson: any = [];
  allocationItem: any = [];
  cityPriority: any;
  allocationPercentage: any = 0;

  phFemale: any;
  phOther: any;
  otherFemale: any;
  other: any;
  reservedFemale: any;
  otherReserved: any;
  total: any;
  phOtherTotal: any = [];
  phFemaleTotal: any = [];
  reservedFemaleTotal: any = [];
  otherReservedTotal: any = [];
  otherFemaleTotal: any = [];
  otherTotal: any = [];
  totalSum: any = [];

  phFemaleAllo: any = 0;
  phOtherAllo: any = 0;
  reservedFemaleAllo: any = 0;
  reservedOtherAllo: any = 0;
  otherFemaleAllo: any = 0;
  otherAllo: any = 0;
  totalAllo: any = 0;
  finalizeStatus: boolean = false;
  phFemaleTotalBalance: number;
  phOtherTotalBalance: number;
  reservedFemaleTotalBalance: number;
  reservedOtherTotalBalance: number;
  otherFemaleTotalBalance: number;
  otherTotalBalance: number;
  totalSumBalance: number;

  priorityId: number = 1;
  constructor(
    private configService: AppsettingsConfService,
    private router: Router,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private SharedService: SharedService,
    private restService: GlobalRestService
  ) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
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
    //setting page title
    this.getImportId();
    this.getCityPriority();
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
    this.createFinalViewForm();
    this.getIntialData();
  }

  public createFinalViewForm() {
    this.finalViewFormGroup = new FormGroup({
      shift_no: new FormControl("", Validators.required),
    });
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

  getCityPriority() {
    this.cityPrioritySub = this.SharedService.cityPriorityNumber.subscribe(
      (number) => {
        if (number) {
          this.cityPriority = parseInt(number);
        } else {
          console.log("Please Fill exam first");
        }
      }
    );

    this.priorityList = Array.from(Array(this.cityPriority).keys());
  }
  // prevent memory leak when component destroyed
  ngOnDestroy() {
    if (this.importIdSub) {
      this.importIdSub.unsubscribe();
    }
  }

  getIntialData() {
    //Get Registration Data
    // var keyData = [
    //   {
    //     name: "examGuid",
    //     value: this.examGuid,
    //   },
    //   {
    //     name: "importId",
    //     value: this.importId,
    //   },
    // ];

    // this.restService.ApiEndPointUrlOrKey = Centre.getRegistrationSummary;
    // this.restService.ApiEndPointMehod = RestMethods.Get;
    // this.restService.callApi(keyData).subscribe(
    //   (successResponse) => {
    //     let unique = [
    //       ...new Set(successResponse.days_number.map((item) => item.priority)),
    //     ];

    //     unique.forEach((element, i) => {
    //       this.itemJson[i] = successResponse.days_number.filter(function (i) {
    //         return i.priority === element;
    //       });

    //       this.phOtherTotal[i] = 0;
    //       this.phFemaleTotal[i] = 0;
    //       this.otherFemaleTotal[i] = 0;
    //       this.otherTotal[i] = 0;
    //       this.totalSum[i] = 0;
    //       this.itemJson[i].filter((element) => {
    //         this.phOtherTotal[i] += parseInt(element["ph_other"]);
    //         this.phFemaleTotal[i] += parseInt(element["ph_female"]);
    //         this.otherFemaleTotal[i] += parseInt(element["other_female"]);
    //         this.otherTotal[i] += parseInt(element["other_other"]);
    //         this.totalSum[i] += parseInt(element["total"]);
    //       });
    //     });

    //     //Add Total City Priority
    //     this.phOtherTotal.filter((a, i) => {
    //       this.itemJson[i].push({
    //         priority: 1,
    //         city_name: "",
    //         state_name: "Total",
    //         ph_female: this.phFemaleTotal[i],
    //         other_female: this.otherFemaleTotal[i],
    //         ph_other: this.phOtherTotal[i],
    //         other_other: this.otherTotal[i],
    //         total: this.totalSum[i],
    //       });
    //     });

    //     this.setIntialData();
    //   },
    //   (errorResponse) => {
    //     // this.messageService.ok(
    //     //   errorResponse["httpErrorResponse"]["data"][0]["attributes"][
    //     //     "message"
    //     //   ][0]
    //     // );
    //   }
    // );
    //this.setIntialData();
    this.getAllocationSummary(1)
  }

  setIntialData() {

    //Add Total City Priority
    this.phOtherTotal.filter((a, i) => {
      this.itemJson[i].push({
        priority: 1,
        city_name: "",
        state_name: "Total",
        ph_female: this.phFemaleTotal[i],
        others_female: this.otherFemaleTotal[i],
        ph_others: this.phOtherTotal[i],
        other_other: this.otherTotal[i],
        reserved_female: this.reservedFemaleTotal[i],
        other_reserved: this.otherReservedTotal[i],
        total: this.totalSum[i],
      });
    });



    this.finalViewFormGroup.patchValue({
      shift_no: 0,
    });
    this.items = this.itemJson[0];
    this.phOther = this.phOtherTotal[0];
    this.phFemale = this.phFemaleTotal[0];
    this.otherFemale = this.otherFemaleTotal[0];
    this.other = this.otherTotal[0];
    this.reservedFemale = this.reservedFemaleTotal[0];
    this.otherReserved = this.otherReservedTotal[0];
    this.total = this.totalSum[0];
    //this.getAllocationSummary(1);
  }

  valueChange(event: any) {
    const priorityId = parseInt(event.target.value);
    this.priorityId = priorityId + 1;
    // this.items = this.itemJson[priorityId];  
    //console.log(this.phOtherTotal)
    //console.log(this.itemJson)

    this.phOther = this.phOtherTotal[priorityId];
    this.phFemale = this.phFemaleTotal[priorityId];
    this.otherFemale = this.otherFemaleTotal[priorityId];
    this.other = this.otherTotal[priorityId];
    this.reservedFemale = this.reservedFemaleTotal[priorityId];
    this.otherReserved = this.otherReservedTotal[priorityId];
    this.total = this.totalSum[priorityId];
    this.getAllocationSummary(priorityId + 1);
  }

  getAllocationSummary(id: any) {
    this.phOtherAllo = 0;
    this.phFemaleAllo = 0;
    this.reservedFemaleAllo = 0;
    this.reservedOtherAllo = 0;
    this.otherFemaleAllo = 0;
    this.otherAllo = 0;
    this.totalAllo = 0;
    var keyData = [
      {
        name: "examGuid",
        value: this.examGuid,
      },
      {
        name: "importId",
        value: this.importId,
      },
      {
        name: "priority",
        value: id,
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Centre.getAssignPrefFinal;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      (successResponse) => {


        this.itemJson[id - 1] = successResponse.priority;

        this.phOtherTotal[id - 1] = 0;
        this.phFemaleTotal[id - 1] = 0;
        this.otherFemaleTotal[id - 1] = 0;
        this.otherTotal[id - 1] = 0;
        this.reservedFemaleTotal[id - 1] = 0;
        this.otherReservedTotal[id - 1] = 0;
        this.totalSum[id - 1] = 0;
        this.itemJson[id - 1].filter((element) => {
          this.phOtherTotal[id - 1] += parseInt(element["ph_others"]);
          this.phFemaleTotal[id - 1] += parseInt(element["ph_female"]);
          this.otherFemaleTotal[id - 1] += parseInt(element["others_female"]);
          this.otherTotal[id - 1] += parseInt(element["other_other"]);
          this.reservedFemaleTotal[id - 1] += parseInt(element["reserved_female"]);
          this.otherReservedTotal[id - 1] += parseInt(element["other_reserved"]);
          this.totalSum[id - 1] += parseInt(element["total"]);
        });
        //console.log(this.totalSum)
        this.allocationPercentage =
          successResponse["distribution"]["percentage"];
        this.allocationItem = successResponse.total;
        if (
          successResponse["distribution"]["total_registration"] ==
          successResponse["distribution"]["total_assign"]
        ) {
          this.finalizeStatus = true;
        }
        successResponse["total"].filter((element, i) => {
          this.phOtherAllo += parseInt(element["ph_others"]);
          this.phFemaleAllo += parseInt(element["ph_female"]);
          this.reservedFemaleAllo += parseInt(element["reserved_female"]);
          this.reservedOtherAllo += parseInt(element["other_reserved"]);
          this.otherFemaleAllo += parseInt(element["others_female"]);
          this.otherAllo += parseInt(element["other_other"]);
          this.totalAllo += parseInt(element["total"]);
        });
        //
        if (id == 1) {
          this.setIntialData();
        }
        else {
          this.itemJson[id - 1].push({
            priority: this.priorityId,
            city_name: "",
            state_name: "Total",
            ph_female: this.phFemaleTotal[id - 1],
            others_female: this.otherFemaleTotal[id - 1],
            ph_others: this.phOtherTotal[id - 1],
            other_other: this.otherTotal[id - 1],
            reserved_female: this.reservedFemaleTotal[id - 1],
            other_reserved: this.otherReservedTotal[id - 1],
            total: this.totalSum[id - 1],
          });
        }
        this.items = this.itemJson[id - 1];
        this.setTotalAllocationSummary(id);
      },
      (errorResponse) => {
        console.log(errorResponse);
        this.messageService.alert(errorResponse);
      }
    );
  }

  getAllocationSummaryTotalDiff(id) {
    this.phFemaleTotalBalance = this.phFemaleAllo - this.phFemaleTotal[id - 1];
    this.phOtherTotalBalance = this.phOtherAllo - this.phOtherTotal[id - 1];
    this.otherFemaleTotalBalance =
      this.otherFemaleAllo - this.otherFemaleTotal[id - 1];
    this.reservedFemaleTotalBalance = this.reservedFemaleAllo - this.reservedFemaleTotal[id - 1];
    this.reservedOtherTotalBalance = this.reservedOtherAllo - this.otherReservedTotal[id - 1];
    this.otherTotalBalance = this.otherAllo - this.otherTotal[id - 1];
    this.totalSumBalance = this.totalAllo - this.totalSum[id - 1];
    // console.log(this.totalAllo)
    // console.log(this.totalSum[id - 1])
    // console.log(this.totalSumBalance)
  }

  setTotalAllocationSummary(id) {
    this.getAllocationSummaryTotalDiff(id);
    // Add Total Allocation Summary
    this.allocationItem.push({
      priority: id,
      city_name: "",
      state_name: "Total",
      ph_female: this.phFemaleAllo,
      others_female: this.otherFemaleAllo,
      ph_others: this.phOtherAllo,
      reserved_female: this.reservedFemaleAllo,
      other_reserved: this.reservedOtherAllo,
      other_other: this.otherAllo,
      total: this.totalAllo,

      ph_female_balance: this.phFemaleTotalBalance,
      others_female_balance: this.otherFemaleTotalBalance,
      ph_others_balance: this.phOtherTotalBalance,
      reserved_female_balance: this.reservedFemaleTotalBalance,
      reserved_others_balance: this.reservedOtherTotalBalance,
      other_other_balance: this.otherTotalBalance,
      total_balance: this.totalSumBalance,
    });
    console.log(this.allocationItem)
  }
}
