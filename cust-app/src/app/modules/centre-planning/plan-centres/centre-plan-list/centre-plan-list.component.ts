import { Component, OnInit, OnDestroy } from "@angular/core";
import bubbleConfig from "../../../../../assets/config/bubbleconfig.json";
import { GlobalRestService } from "../../../../services/rest/global-rest.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { PrimaryHeaderService } from "../../../layout/primary-header/primary-header.service";
import { AppsettingsConfService } from "../../../../services/conf/appsettings-conf/appsettings-conf.service";
import { NgxIxcheckTableParams } from "ngx-ixcheck-table-lib";
import { RestMethods } from "src/app/shared/models/app.models";

import {
  Exam,
  Centre,
  HandelError,
} from "../../../../shared/enumrations/app-enum.enumerations";

@Component({
  selector: "app-centre-plan-list",
  templateUrl: "./centre-plan-list.component.html",
  styleUrls: ["./centre-plan-list.component.scss"],
})
export class CentrePlanListComponent implements OnInit {
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
  public appRoutes: any = {};
  public snapShotList = [];
  private searchFilter: any = {
    registrations_filter: {
      exam_registrations: {
        reg_code: "",
        reg_name: "",
        name: "",
        code: "",
        exam_type: "",
        planning_status: ""
      },
      paging: {
        last_seen_id_max: 0,
        last_seen_id_min: 0,
        last_offset: 0,
        page_size: 0,
        sort_by: "string",
        order_dir: "string",
        direction: 0,
        page_num: 0,
        sort_exp: "string",
        sort_dir: "string",
        total_rows: 0,
      },
      cols: [],
    },
  };

  private refreshFilter: any = {
    registrations_filter: {
      exam_registrations: {
        reg_code: "",
        reg_name: "",
        name: "",
        code: "",
        exam_type: "",
        planning_status: ""
      },
      paging: {
        last_seen_id_max: 0,
        last_seen_id_min: 0,
        last_offset: 0,
        page_size: 0,
        sort_by: "string",
        order_dir: "string",
        direction: 0,
        page_num: 0,
        sort_exp: "string",
        sort_dir: "string",
        total_rows: 0,
      },
      cols: [],
    },
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
  constructor(
    private restService: GlobalRestService,
    private messageService: MessageService,
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService
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
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
  }
  ngOnDestroy() {
    this.config.data = [];
    this.config.data.push({});
  }
  public reloadItems(params: any) {
    this.getData(params);
  }
  public updateTable(data: any) {
    this.offset = 0;
    this.searchFilter.registrations_filter.exam_registrations = data.registration;
    this.config.data[0] = data.bubbleConfig;
    this.searchFilter.registrations_filter.paging = this.defaultPagingParams;
    this.getData();
    this.resetFilterFlag = false;
    this.updatedFilter = {};
    //this.config.data[0] = this.setConfig();   // change dropdown name with value
  }
  public getData(params?: NgxIxcheckTableParams) {
    this.notFound = false;
    this.resetFilterFlag = false;
    if (params != undefined) {
      this.searchFilter.registrations_filter.paging.direction = params.direction;
      this.searchFilter.registrations_filter.paging.offset = params.offset;
      this.searchFilter.registrations_filter.paging.last_offset = params.lastOffset;
      this.searchFilter.registrations_filter.paging.last_seen_id_max =
        params.lastSeenIdMax;
      this.searchFilter.registrations_filter.paging.last_seen_id_min =
        params.lastSeenIdMin;
    }

    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = Exam.getRegistrationList;
      this.restService.HttpPostParams = this.searchFilter;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.showProgress = true;
      this.restService.callApi().subscribe(
        (sucessResponse) => {
          this.items = sucessResponse.exam_registrations;
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          this.searchFilter.registrations_filter.paging = sucessResponse.paging;
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
    this.searchFilter.registrations_filter.registration_setup[removedId] = "";
    this.searchFilter.registrations_filter.paging = this.defaultPagingParams;
    this.getData();
    this.updateFilter();
  }
  public resetFilter() {
    this.searchFilter.registrations_filter.paging = this.defaultPagingParams;
    this.searchFilter.registrations_filter.exam_registrations = {};
    this.getData();
    this.resetFilterFlag = true;
  }

  public updateFilter() {
    this.count = Number(this.count) + 1;
    this.updatedFilter = this.searchFilter.registrations_filter;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }

  public rowClick(_event) {}
  public rowDoubleClick(_event) {}

  getSnapshotList(guid){
    if (Object.keys(this.appRoutes).length !== 0) {

      let keyData = [
        {
          name: "regGuid",
          value: guid
        },
      ];

      this.restService.ApiEndPointUrlOrKey = Centre.getSnapshotList;   
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.showProgress = true;
      this.restService.callApi(keyData).subscribe(
        (sucessResponse) => {
          this.snapShotList = sucessResponse.snap_shot;
        },
        (errorResponse) => {
          if (errorResponse !== undefined) {            
            this.messageService.alert(errorResponse.httpErrorResponse);
          }
        }
      );
    }

  }

}
