import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FilterService } from "src/app/services/filter/filter.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";

import {
  HandelError,
  Centre
} from "src/app/shared/enumrations/app-enum.enumerations";
import { MessageService } from "ngx-ixcheck-message-lib";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { RestMethods } from "src/app/shared/models/app.models";
import { SharedService } from "../../service/shared.service";
@Component({
  selector: "app-table-list-rowdetail",
  templateUrl: "./table-list-rowdetail.component.html",
  styleUrls: ["./table-list-rowdetail.component.scss"]
})
export class TableListRowdetailComponent implements OnInit {
  @Input("rowItemData") rowItemData: any;
  @Input() importData: any;
  @Output() private childComponentData = new EventEmitter<number>();
  @Input() examGuid:any;
  @Input() snapShotId:any;
  public items = [];
  public itemCount = 0;

  private appRoutes: any = {};

  public centreData: any = {
    exam_guid: "",
    centre_guid: "",
    shift_number: "",
    status: ""
  };
  importIdSub: any;
  importId: any;
  examGuidSub: any;
  centreJson: any = [];
  optionId: any;
  constructor(
    private SharedService: SharedService,
    private route: ActivatedRoute,
    private restService: GlobalRestService,
    private authService: AuthService,
    private filterService: FilterService,
    private configService: AppsettingsConfService,
    private messageService: MessageService,
    private router: Router,
    private primaryHeader: PrimaryHeaderService
  ) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(
      configData => {
        this.appRoutes = configData;
      },
      error => {
        console.error("Error for configService.getAppRoutes: ", error);
      }
    );
  }
  ngOnInit() {
   
    this.getIntialData();
    this.getRegDataCopyOption();
  }

  getIntialData() {
    this.getCentresList();
  }

  updateProductDetails(updatedItem: any) {
    let i = 0;
    for (i; i < this.itemCount; i++) {
      if (this.items[i].centres_guid === updatedItem.prodInfo.centres_guid) {
        this.items[i] = updatedItem.prodInfo;
        // this.calTotalAmount();
        break;
      }
    }
  }

  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }

  getChildComponentData(childData: any) {
    let params = {
      centre_guid: childData.centres_guid,
      exam_guid: this.examGuid,
      shift_number: this.rowItemData["shift_number"],
      ph_female: childData.ph_female,
      ph_others: childData.ph_others,
      reserved_female : childData.reserved_female,
      other_reserved : childData.other_reserved,
      others_female: childData.others_female,
      others: childData.others,
      shift_main_id: childData.shift_main_id,
      import_id: this.importId,
      status: "1",
      city_guid: this.rowItemData["city_guid"],
      priority: "1",
      ph_capacity: childData.ph_seats,
      normal_capacity: childData.normal_seats
    };

    this.restService.ApiEndPointUrlOrKey = Centre.updateAddCentreData;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = params;
    this.restService.callApi().subscribe(
      successResponse => {
        // this.getCentresList();
        this.messageService.alert(successResponse);
        this.childComponentData.emit(1);        
      },
      errorResponse => {
        this.messageService.alert(errorResponse.httpErrorResponse);
      }
    );
  }

  getCentresList() {
    debugger;
    var keyData = [
      {
        name: "cityGuid",
        value: this.rowItemData["city_guid"]
      },
      {
        name: "importId",
        value: this.snapShotId
      },
      {
        name: "examGuid",
        value: this.examGuid
      },
      {
        name: "shiftNumber",
        value: this.rowItemData["shift_number"]
      },
      {
        name: "priority",
        value: "1"
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Centre.getAddedCentreList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    // this.restService.HttpPostParams = this.searchParams();
    this.restService.callApi(keyData).subscribe(
      sucessResponse => {
        let data = sucessResponse.days_number;
        //Creating total capacity
        data.forEach(a => {
          let sum = parseInt(a["pwd_seats"]) + parseInt(a["normal_seats"]);
          a["total_capacity"] = sum;
        });
        this.items = data;
        this.itemCount = this.items.length;
      },
      errorResponse => {
        if (errorResponse !== undefined) {
          // this.notFound = true;
          // this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
        }
      }
    );
  }

  onformSubmit() {
    // this.getImportJson();
  }

  addRow(data: any) {
    let item = this.items.find(c => c.centres_guid === data.centres_guid);
    if (item) {
      if (item.is_select === "0") {
        this.items.find(c => c.centres_guid === data.centres_guid).is_select =
          "1";
      } else {
        this.items.find(c => c.centres_guid === data.centres_guid).is_select =
          "0";
      }
    }
    // let selectCentre = this.items.filter(c => c.is_select = '0')
  }

  sendToParent() {
    if (this.optionId != 1) {
      this.messageService.confirm(["All the allocations will be invalidated by adding the centre, Are you sure to add the record?"],
        "Delete", "Yes", "NO", "error").subscribe(result => {
          if (result == true) {
            this.restService.ApiEndPointUrlOrKey = Centre.updateSelectedCentreList;
            this.restService.ApiEndPointMehod = RestMethods.Post;
            let params = this.getparams();
            this.restService.HttpPostParams = params;
            this.restService.callApi().subscribe(
              successResponse => {
                // this.SharedService.tabsId.next(3);
                this.messageService.alert(successResponse);
                this.messageService.hideModal();
              },
              errorResponse => {
                this.messageService.alert(errorResponse);
                this.messageService.hideModal();
              }
            );
          }
          else {
            this.messageService.hideModal();
          }
        })
    }
    else {
      this.restService.ApiEndPointUrlOrKey = Centre.updateSelectedCentreList;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      let params = this.getparams();
      this.restService.HttpPostParams = params;
      this.restService.callApi().subscribe(
        successResponse => {
          // this.SharedService.tabsId.next(3);
          this.messageService.alert(successResponse);
        },
        errorResponse => {
          this.messageService.alert(errorResponse);
        }
      );
    }
  }

  getparams(): any {
    const selectedCentre = this.items.filter(d => d.is_select == "0");
    selectedCentre.forEach(element => {
      this.centreData.centre_guid = element["centres_guid"];
      this.centreData.shift_number = this.rowItemData["shift_number"];
      this.centreData.status = "1";
      this.centreData.exam_guid = this.examGuid;
      this.centreJson.push(Object.assign({}, this.centreData));
    });
    let params = {
      exam_guid: this.examGuid,
      exam_centres: this.centreJson
    };
    return params;
  }

  getRegDataCopyOption() {
    var keyData = [
      {
        name: "examGuid",
        value: this.examGuid,
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Centre.getShiftsDetailsList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      (successResponse) => {
        this.optionId = successResponse["days_number"][0]["copy_options_id"];
      },
      (errorResponse) => {
        //this.messageService.alert(errorResponse);
      }
    );
  }

  deleteAssign() {
    if (this.optionId != 1) {
      this.messageService.confirm(["All the allocations will be invalidated by deleting the centre, Are you sure to delete the record?"],
        "Delete", "Yes", "NO", "error").subscribe(result => {
          if (result == true) {
            this.callDeleteCenter();
            this.childComponentData.emit(1);
          }
          else {
            this.messageService.hideModal();
            this.childComponentData.emit(1);
          }
        })
    }
    else {
      this.callDeleteCenter();
      this.childComponentData.emit(1);
    }
  }

  callDeleteCenter() {
    var keyData = [
      {
        "name": "examGuid",
        "value": this.examGuid
      },
      {
        "name": "centreGuid",
        "value": this.items[0].centres_guid
      },
      {
        "name": "shiftNumber",
        "value": this.rowItemData["shift_number"]
      },
      {
        "name": "priority",
        "value": "1"
      }
    ];

    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ApiEndPointUrlOrKey = Centre.deleteAssignPrefCenter;
    this.restService.ApiEndPointMehod = RestMethods.Delete;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.getIntialData();
        this.getRegDataCopyOption();
        this.messageService.hideModal();
        this.messageService.alert(sucessResponse);
      }, errorResponse => {
        if (errorResponse !== undefined) {
          this.messageService.hideModal();
        }
      });
  }
}
