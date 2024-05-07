import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { Router } from "@angular/router";
import { PrimaryHeaderService } from "../../../../layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import { Centre } from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

import { SharedService } from "../service/shared.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-assign-pref-1",
  templateUrl: "./assign-pref-1.component.html",
  styleUrls: ["./assign-pref-1.component.scss"]
})
export class AssignPrefAComponent implements OnInit {
  
  public examShiftFormGroup: FormGroup;
  examShiftDetails: any = {};
  total_assigned_students = 0;
  total_remaining_students = 0;
  lastSeenIdMin: any;
  lastSeenIdMax: any;
  lastOffset: any;
  itemCount: any;
  notFound: any;
  searchUserModal: any;
  orgItems: any;
  itemPriority1: any = [];
  itemPriority2: any = [];
  itemPriority3: any = [];
  priority: any;
  importId: any;
  importIdSub: Subscription;
  itemJson: any = [];
  ph_female: any = [];
  ph_other: any = [];
  other_female: any = [];
  other: any = [];
  total: any = [];
  allocationItem: any = [];
  allocationPercentage: any = 0;
  phOtherAllo: any = 0;
  phFemaleAllo: number = 0;
  otherFemaleAllo: number = 0;
  otherAllo: number = 0;
  totalAllo: number = 0;

  examList = [];
  @Input() regGuid: any;
  @Input() snapShotId: any;
  @Input() selectedExamGuid: any;
  @Output() private setExamGuid = new EventEmitter<number>();
 childExamGuid:any;

  public assignPrefFormGroup: FormGroup;

  constructor(
    private configService: AppsettingsConfService,
    private router: Router,
    private SharedService: SharedService,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService
  ) { }

  ngOnInit() {
    debugger;
    //setting page title
    //this.getImportId();
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
    this.assignPrefFormGroup = new FormGroup({
      examCode: new FormControl('')
    });
    this.getExamList();
    //this.getIntialData();
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
          this.assignPrefFormGroup.controls["examCode"].setValue(this.selectedExamGuid);
          this.getIntialData();
        }        
        else if (this.examList.length > 0){
          this.assignPrefFormGroup.controls["examCode"].setValue(this.examList[0]["exam_guid"]);
          this.getIntialData();
        }
      })
  }

  rowClick(data: any) {
    console.log("rowClick ", data);
  }

  rowDoubleClick(data: any) {
    console.log("rowDoubleClick ", data);
  }

  getImportId() {
    this.importIdSub = this.SharedService.importId.subscribe(id => {
      if (id) {
        this.importId = id;
      } else {
        console.log("Please Fill exam first");
      }
    });
  }

  // prevent memory leak when component destroyed
  ngOnDestroy() {
    if (this.importIdSub) {
      this.importIdSub.unsubscribe();
    }
  }

  getIntialData() {

    this.phOtherAllo = 0;
    this.phFemaleAllo = 0;
    this.otherFemaleAllo = 0;
    this.otherAllo = 0;
    this.totalAllo = 0;
    let examGuid = this.assignPrefFormGroup.controls["examCode"].value;
    this.childExamGuid=examGuid
    this.setExamGuid.emit(examGuid);
    var keyData = [
      {
        name: "examGuid",
        value: examGuid
      },
      {
        name: "snapshotId",
        value: this.snapShotId
      },
      {
        name: "priority",
        value: "1"
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Centre.getAssignPrefA;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {
        this.allocationItem = successResponse.total;
        this.allocationPercentage =
          successResponse["distribution"]["percentage"];
        // console.log("pref ",JSON.stringify(successResponse));
        let unique = [
          ...new Set(successResponse.shifts.map(item => item.shift_number))
        ];
        unique.forEach((element, i) => {
          this.itemJson[i] = successResponse.shifts.filter(function (i) {
            return i.shift_number === element;
          });
          this.ph_other[i] = 0;
          this.ph_female[i] = 0;
          this.other_female[i] = 0;
          this.other[i] = 0;
          this.total[i] = 0;
          this.itemJson[i].filter(element => {
            this.ph_other[i] += parseInt(element["ph_others"]);
            this.ph_female[i] += parseInt(element["ph_female"]);
            this.other_female[i] += parseInt(element["others_female"]);
            this.other[i] += parseInt(element["other_other"]);
            this.total[i] += parseInt(element["total"]);
          });
          this.priority = element;
        });
        successResponse["total"].filter((element, i) => {
          this.phOtherAllo += parseInt(element["ph_others"]);
          this.phFemaleAllo += parseInt(element["ph_female"]);
          this.otherFemaleAllo += parseInt(element["others_female"]);
          this.otherAllo += parseInt(element["other_other"]);
          this.totalAllo += parseInt(element["total"]);
        });

        this.ph_other.filter((a, i) => {
          this.itemJson[i].push({
            priority: 1,
            city_name: "",
            state_name: "Total",
            ph_female: this.ph_female[i],
            others_female: this.other_female[i],
            ph_others: this.ph_other[i],
            other_other: this.other[i],
            total: this.total[i]
          });
        });

        this.allocationItem.push({
          priority: 1,
          city_name: "",
          state_name: "Total",
          ph_female: this.phFemaleAllo,
          others_female: this.otherFemaleAllo,
          ph_others: this.phOtherAllo,
          other_other: this.otherAllo,
          total: this.totalAllo
        });
      },
      errorResponse => {
        this.messageService.alert(errorResponse);
      }
    );
  }

  getChildComponentData(childData: any) {
   
    this.getIntialData();
  }

  updateProductDetails(updatedItem: any) {
    this.itemJson.filter((levelA, indexA) => {
      levelA.filter((levelB, indexB) => {
        if (levelB.city_name === updatedItem.prodInfo.city_name) {
          this.itemJson[indexA][indexB] = updatedItem.prodInfo;
        }
      });
    });
  }
}
