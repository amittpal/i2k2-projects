import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
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
  selector: "app-regdata-view",
  templateUrl: "./regdata-view.component.html",
  styleUrls: ["./regdata-view.component.scss"],
})
export class RegDataViewComponent implements OnInit {
  @Input() examGuid: any;
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
  other_reserved: any = [];
  other: any = [];
  total: any = [];
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
    this.getImportId();
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
    this.getIntialData();
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

  // prevent memory leak when component destroyed
  ngOnDestroy() {
    if (this.importIdSub) {
      this.importIdSub.unsubscribe();
    }
  }
  getIntialData() {
    var keyData = [
      {
        name: "examGuid",
        value: this.examGuid,
      },
      {
        name: "importId",
        value: this.importId,
      },
    ];

    this.restService.ApiEndPointUrlOrKey = Centre.getRegistrationSummary;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      (successResponse) => {
        let unique = [
          ...new Set(successResponse.days_number.map((item) => item.priority)),
        ];
        unique.forEach((element, i) => {
          this.itemJson[i] = successResponse.days_number.filter(function (i) {
            return i.priority === element;
          });

          this.ph_other[i] = 0;
          this.ph_female[i] = 0;
          this.other_female[i] = 0;
          this.reserved_female[i] = 0;
          this.other_reserved[i] = 0;
          this.other[i] = 0;
          this.total[i] = 0;
          // console.log(this.itemJson[0]);

          this.itemJson[i].filter((element) => {
            this.ph_other[i] += parseInt(element["ph_other"]);
            this.ph_female[i] += parseInt(element["ph_female"]);
            this.other_female[i] += parseInt(element["other_female"]);
            this.reserved_female[i] += parseInt(element["reserved_female"]);
            this.other_reserved[i] += parseInt(element["other_reserved"]);
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
            other_reserved: this.other_reserved[i],
            other_other: this.other[i],
            total: this.total[i],
          });
        });
      },
      (errorResponse) => {}
    );
  }
}
