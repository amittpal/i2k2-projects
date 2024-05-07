import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { Router } from "@angular/router";
import { PrimaryHeaderService } from "../../../../layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Centre
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

import { SharedService } from "../service/shared.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-regdata",
  templateUrl: "./regdata.component.html",
  styleUrls: ["./regdata.component.scss"]
})
export class RegDataComponent implements OnInit {
  @Input() regGuid: any;
  @Input() snapShotId:any;
  @Input() selectedExamGuid: any;
  @Output() private setExamGuid = new EventEmitter<number>();

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
  priority: any;
  importId: any;
  importIdSub: Subscription;
  itemJson: any = [];
  ph_female: any = [];
  ph_other: any = [];
  other_female: any = [];
  reserved_female: any = [];
  reserved_other: any = [];
  other: any = [];
  total: any = [];
  examList = [];
  public regDataFormGroup: FormGroup;
  constructor(
    private configService: AppsettingsConfService,
    private router: Router,
    private SharedService: SharedService,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService
  ) {}

  ngOnInit() {
    //setting page title
    //this.getImportId();
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
    this.regDataFormGroup = new FormGroup({
      examCode: new FormControl('')
    });
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
        if (this.selectedExamGuid){
          this.regDataFormGroup.controls["examCode"].setValue(this.selectedExamGuid);
          this.getIntialData();
        }
        else if (this.examList.length > 0) {
          this.regDataFormGroup.controls["examCode"].setValue("");
          this.getIntialData();
        }

      })
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
    let examGuid = this.regDataFormGroup.controls["examCode"].value;
    this.setExamGuid.emit(examGuid);
    var keyData = [
      {
        name: "regGuid",
        value: this.regGuid
      },
      {
        name: "examGuid",
        value: examGuid == "" ? "All" : examGuid
      },    
      {
        name:"snapShotId",
        value:this.snapShotId
      }        
    ];

    this.restService.ApiEndPointUrlOrKey = Centre.getRegistrationSummaryByRegGuid;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {

        let unique = [
          ...new Set(successResponse.days_number.map(item => item.priority))
        ];
        unique.forEach((element, i) => {
          this.itemJson[i] = successResponse.days_number.filter(function(i) {
            return i.priority === element;
          });

          this.ph_other[i] = 0;
          this.ph_female[i] = 0;
          this.other_female[i] = 0;
          this.reserved_female[i] = 0;
          this.reserved_other[i] = 0;          
          this.other[i] = 0;
          this.total[i] = 0;
          // console.log(this.itemJson[0]);

          this.itemJson[i].filter(element => {
            this.ph_other[i] += parseInt(element["ph_other"]);
            this.ph_female[i] += parseInt(element["ph_female"]);
            this.other_female[i] += parseInt(element["other_female"]);
            this.reserved_female[i] += parseInt(element["reserved_female"]);
            this.reserved_other[i] += parseInt(element["reserved_other"]);            
            this.other[i] += parseInt(element["other_other"]);
            this.total[i] += parseInt(element["total"]);
          });
          this.priority = element;
        });
        // console.log(this.ph_other);

        this.ph_other.filter((a, i) => {
          // console.log(a);
          this.itemJson[i].push({
            priority: 1,
            city_name: "",
            state_name: "Total",
            ph_female: this.ph_female[i],
            other_female: this.other_female[i],
            ph_other: this.ph_other[i],
            reserved_female: this.reserved_female[i],
            reserved_other: this.reserved_other[i],            
            other_other: this.other[i],
            total: this.total[i]
          });
        });
      },
      errorResponse => {
      }
    );
  }
}
