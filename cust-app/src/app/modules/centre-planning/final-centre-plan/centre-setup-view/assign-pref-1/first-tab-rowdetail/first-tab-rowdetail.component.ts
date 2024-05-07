import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { FilterService } from "src/app/services/filter/filter.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";

import {
  HandelError,
  Centre,
} from "src/app/shared/enumrations/app-enum.enumerations";
import { MessageService } from "ngx-ixcheck-message-lib";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { RestMethods } from "src/app/shared/models/app.models";
import { SharedService } from "../../service/shared.service";
@Component({
  selector: "app-first-tab-rowdetail",
  templateUrl: "./first-tab-rowdetail.component.html",
  styleUrls: ["./first-tab-rowdetail.component.scss"],
})
export class FirstTabRowdetailComponent implements OnInit {
  @Output() private childComponentData = new EventEmitter<number>();
  @Input("rowItemData") rowItemData: any;
  @Output() update = new EventEmitter();
  public items = [];
  public itemCount = 0;
  _itemOrig: any;
  private appRoutes: any = {};
  _item: any;
  public centreData: any = {
    exam_guid: "",
    centre_guid: "",
    shift_number: "",
    status: "",
  };
  @Input() importData: any;
  importIdSub: any;
  importId: any;
  examGuidSub: any;
  examGuid: any;
  centreJson: any = [];
  starRating: any;
  selectedStar: any[];

  @Input() get item() {
    return this._item;
  }
  set item(item: any) {
    this._itemOrig = Object.assign({}, item);
    this._item = item;
  }

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
      (configData) => {
        this.appRoutes = configData;
      },
      (error) => {
        console.error("Error for configService.getAppRoutes: ", error);
      }
    );
  }

  ngOnInit() {
    this.getIntialData();
  }

  getIntialData() {
    this.importIdSub = this.SharedService.importId.subscribe((id) => {
      if (id) {
        this.importId = id;
      } else {
        console.log("Please Fill exam first");
      }
    });
    this.examGuidSub = this.SharedService.examGuid.subscribe((guid) => {
      if (guid) {
        this.examGuid = guid;
      } else {
        console.log("Please Fill exam first");
      }
    });
    this.getCentresList();
  }

  getCentresList() {
    var keyData = [
      {
        name: "cityGuid",
        value: this.rowItemData["city_guid"],
      },
      {
        name: "importId",
        value: this.importId,
      },
      {
        name: "examGuid",
        value: this.examGuid,
      },
      {
        name: "priority",
        value: "1",
      },
      {
        name: "shift_number",
        value: this.rowItemData["shift_number"],
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Centre.getAssignPrefCentreList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndKill;
    // this.restService.HttpPostParams = this.searchParams();
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        // console.log(JSON.stringify(sucessResponse));

        this.items = sucessResponse.days_number;
        this.itemCount = this.items.length;
        this.starRating = parseInt(
          sucessResponse["days_number"][0]["star_rating"]
        );
        this.selectedStar = new Array(this.starRating);
      },
      (errorResponse) => {
        if (errorResponse !== undefined) {
          console.log("undefined");
        }
      }
    );
  }

  addRow(data: any) {
    let item = this.items.find((c) => c.centres_guid === data.centres_guid);
    if (item) {
      if (item.is_select === "0") {
        this.items.find((c) => c.centres_guid === data.centres_guid).is_select =
          "1";
      } else {
        this.items.find((c) => c.centres_guid === data.centres_guid).is_select =
          "0";
      }
    }
    // let selectCentre = this.items.filter(c => c.is_select = '0')
  }

  sendToParent() {
    this.restService.ApiEndPointUrlOrKey = Centre.updateSelectedCentreList;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    let params = this.getparams();

    this.restService.HttpPostParams = params;
    this.restService.callApi().subscribe(
      (successResponse) => {
        // this.SharedService.tabsId.next(3);
        this.childComponentData.emit(this.rowItemData);
        this.messageService.alert(successResponse);
      },
      (errorResponse) => {
        this.messageService.alert(errorResponse);
      }
    );
  }

  getparams(): any {
    const selectedCentre = this.items.filter((d) => d.is_select == "0");

    selectedCentre.forEach((element) => {
      this.centreData.centre_guid = element["centres_guid"];
      this.centreData.shift_number = this.rowItemData["shift_number"];
      this.centreData.status = "1";
      this.centreData.city_guid = this.rowItemData["city_guid"];
      this.centreData.exam_guid = this.examGuid;
      this.centreJson.push(Object.assign({}, this.centreData));
    });
    let params = {
      priority: "1",
      exam_guid: this.examGuid,
      exam_centres: this.centreJson,
    };

    return params;
  }

  onCancel() {
    this._item = this._itemOrig;
    const prodInfo = this._itemOrig;
    this.update.emit({ prodInfo, event });
  }
}
