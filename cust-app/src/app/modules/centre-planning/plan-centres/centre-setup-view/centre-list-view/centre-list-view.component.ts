import { Component, Input, OnInit, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { Router } from "@angular/router";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Centre
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

import { SharedService } from "../service/shared.service";
import { Subscription } from "rxjs";
import bubbleConfig from "../../../../../../assets/config/bubbleconfig.json";
import { NgxIxcheckTableParams } from "ngx-ixcheck-table-lib";

@Component({
  selector: 'app-centre-list-view',
  templateUrl: './centre-list-view.component.html',
  styleUrls: ['./centre-list-view.component.scss']
})
export class CentreListViewComponent implements OnInit {

  @Input() examGuid: any; // get examID from parent component

  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public config = bubbleConfig;
  public bubbleLabels: any = {};
  public resultModal: string;
  public resetFilterFlag: boolean = false;
  public updatedFilter: any;
  public count: Number = 0;
  public notFound: boolean = false;
  public displayMessage: any;
  public showProgress: boolean = false;
  public isLoading: boolean = false;
  public reloadBubble = true;
  public paginationStyle = "minimal";
  private searchFilter: any = {
    "centres_filter": {
      "exam_centres": {
        "state": "",
        "city": "",
        "code": "",
        "name": "",
        "min_ph_seats": "",
        "max_ph_seats": "",
        "min_normal_seats": "",
        "max_normal_seats": ""
      },
      "paging": {
        "last_seen_id_max": 0,
        "last_seen_id_min": 0,
        "last_offset": 0,
        "page_size": 0,
        "sort_by": "",
        "order_dir": "",
        "direction": 0,
        "page_num": 0,
        "sort_exp": "",
        "sort_dir": "",
        "total_rows": 0
      },
      "cols": []
    }
  };

  public defaultPagingParams: any = {
    total_rows: 0,
    returned_rows: 0,
    direction: 0,
    order_dir: "",
    page_size: 10,
    sort_by: "",
    offset: 0,
    last_offset: 0,
    last_seen_id_max: 0,
    last_seen_id_min: 0,
  };

  public editCentreFormGroup: FormGroup;
  private appRoutes: any = {};

  examId: any;

  public centreCapacityParam: any = {
    id: "",
    state: "",
    city: "",
    code: "",
    name: "",
    min_ph_seats: "",
    max_ph_seats: "",
    min_normal_seats: "",
    max_normal_seats: "",
    allowed_ph_capacity_per: 0,
    allowed_normal_capacity_per: 0,
    allowed_ph_capacity: 0,
    allowed_normal_capacity: 0
  };

  constructor(
    private configService: AppsettingsConfService,
    private SharedService: SharedService,
    private router: Router,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
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
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
  }


  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }

  // child-component
  public getChildComponentData(childData: any) {
    let centreId = childData["id"];

    this.items.forEach((element, i) => {
      if (element["id"] == centreId) {
        this.items[i] = childData;
      }
    });
  }

  public updateProductDetails(updatedItem: any) {
    let i = 0;
    for (i; i < this.itemCount; i++) {
      if (
        this.items[i].id === updatedItem.centreInfo.id
      ) {
        this.items[i] = updatedItem.centreInfo;
        // this.calTotalAmount();
        break;
      }
    }
  }


  public reloadItems(params: any) {
    this.getData(params);
  }

  public updateTable(data: any) {
    this.offset = 0;
    this.searchFilter.centres_filter.exam_centres = data.centres;
    this.config.data[0] = data.bubbleConfig;
    this.searchFilter.centres_filter.paging = this.defaultPagingParams;
    this.getData();
    this.resetFilterFlag = false;
    this.updatedFilter = {};
    //this.config.data[0] = this.setConfig();   // change dropdown name with value
  }
  public getData(params?: NgxIxcheckTableParams) {
    this.notFound = false;
    this.resetFilterFlag = false;
    if (params != undefined) {
      this.searchFilter.centres_filter.paging.direction = params.direction;
      this.searchFilter.centres_filter.paging.offset = params.offset;
      this.searchFilter.centres_filter.paging.last_offset = params.lastOffset;
      this.searchFilter.centres_filter.paging.last_seen_id_max =
        params.lastSeenIdMax;
      this.searchFilter.centres_filter.paging.last_seen_id_min =
        params.lastSeenIdMin;
    }

    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = Centre.getCentreListForEdit;
      this.restService.HttpPostParams = this.searchFilter;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.showProgress = true;
      var keyData = [
        {
          name: "examGuid",
          value: this.examGuid
        }
      ];
      this.restService.callApi(keyData).subscribe(
        (sucessResponse) => {
          this.items = sucessResponse.exam_centres;
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          this.searchFilter.centres_filter.paging = sucessResponse.paging;
        },
        (errorResponse) => {
          if (errorResponse !== undefined) {
            this.items = null;
            this.notFound = true;
            this.displayMessage =
              errorResponse.httpErrorResponse.data[0].attributes.message[0];
          }
        }
      );
    }
  }
  public updateSearch(removedId: string) {
    this.searchFilter.centres_filter.exam_centres[removedId] = "";
    delete this.searchFilter.centres_filter.range_filter[removedId];
    this.searchFilter.centres_filter.paging = this.defaultPagingParams;
    this.getData();
    this.updateFilter();
  }
  public resetFilter() {
    this.searchFilter.centres_filter.paging = this.defaultPagingParams;
    this.searchFilter.centres_filter.exam_centres = {};
    this.searchFilter.centres_filter.range_filter = {};
    this.getData();
    this.resetFilterFlag = true;
  }

  public updateFilter() {
    this.count = Number(this.count) + 1;
    this.updatedFilter = this.searchFilter.centres_filter;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }

}
