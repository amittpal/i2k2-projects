import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import { HandelError, AdmitCard } from "src/app/shared/enumrations/app-enum.enumerations";
import { NgxIxcheckTableParams } from "ngx-ixcheck-table-lib";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import bubbleConfig from "../../../../../assets/config/bubbleconfig.json";
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admit-card-centres-view',
  templateUrl: './admit-card-centres-view.component.html',
  styleUrls: ['./admit-card-centres-view.component.scss']
})
export class AdmitCardCentresViewComponent implements OnInit {

  //ngx-ixcheck-table Parameters
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public paginationStyle = 'minimal';

  private appRoutes: any = {};

  public resetFilterFlag: boolean = false;
  public config = bubbleConfig;
  public updatedFilter: any;
  public count: Number = 0;
  public notFound: boolean = false;

  public examGuid: any;
  public examNumber: string;
  public shiftNo: any;
  public snapshotId: any;
  public registrationId: any;

  public totalShift: any;

  public search_config: any = {
    "admitcardfilter": {
      "admitcard": {
        "exam_guid": "",
        "shift_number": "",
        "city_guid": [],
        "city_name": "",
        "state_guid": [],
        "state": "",
        "registration_number": "",
        "roll_number": "",
        "first_name": "",
        "middle_name": "",
        "last_name": "",
        "gender": "",
        "father_name": "",
        "email": "",
        "phone_number": "",
        "mobile_number": "",
        "dob": "",
        "registration_guid": "",
        "allocation_snapshots_id": ""
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
    "total_rows": 0,
    "returned_rows": 0,
    "direction": 0,
    "order_dir": "",
    "page_size": 10,
    "sort_by": "",
    "offset": 0,
    "last_offset": 0,
    "last_seen_id_max": 0,
    "last_seen_id_min": 0
  }

  // public normalCandidates : number = 0;
  // public phCandidates : number = 0;

  constructor(private configService: AppsettingsConfService, private restService: GlobalRestService, private primaryHeader: PrimaryHeaderService, private route: ActivatedRoute) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("Centre View");

    this.route.params.subscribe((params: Params) => {
      //this.examGuid = params['examGuid']; // Exam guid
      //this.shiftNo = params['shiftNo']; // Exam Shift Number
      this.snapshotId = params['snapshotId']; // snapshotId
      this.registrationId = params['registrationId']; // registrationId

    }, error => {
      console.error('Error: ', error);
    });
  }


  ngOnDestroy() {
    this.config.data = [];
    this.config.data.push({});
  }

  public updateTable(data) {
    this.offset = 0;
    if (data.admitcard.city_guid) {
      let cityData = [];
      data.admitcard.city_guid.forEach(item => {
        cityData.push({ "guid": item["city_guid"] });
      });
      this.search_config.admitcardfilter.admitcard.city_guid = cityData;
    }
    else {
      this.search_config.admitcardfilter.admitcard.city_guid = [];
    }

    if (data.admitcard.state_guid) {
      let stateData = [];
      data.admitcard.state_guid.forEach(item => {
        stateData.push({ "guid": item["state_guid"] });
      });
      this.search_config.admitcardfilter.admitcard.state_guid = stateData;
    }
    else {
      this.search_config.admitcardfilter.admitcard.state_guid = [];
    }

    this.search_config.admitcardfilter.admitcard.registration_number = data.admitcard.registration_number ? data.admitcard.registration_number : "";
    this.search_config.admitcardfilter.admitcard.roll_number = data.admitcard.roll_number ? data.admitcard.roll_number : "";
    this.search_config.admitcardfilter.admitcard.first_name = data.admitcard.first_name ? data.admitcard.first_name : "";
    this.search_config.admitcardfilter.admitcard.middle_name = data.admitcard.middle_name ? data.admitcard.middle_name : "";
    this.search_config.admitcardfilter.admitcard.last_name = data.admitcard.last_name ? data.admitcard.last_name : "";
    this.search_config.admitcardfilter.admitcard.gender = data.admitcard.gender ? data.admitcard.gender : "";
    this.search_config.admitcardfilter.admitcard.father_name = data.admitcard.father_name ? data.admitcard.father_name : "";
    this.search_config.admitcardfilter.admitcard.email = data.admitcard.email ? data.admitcard.email : "";
    this.search_config.admitcardfilter.admitcard.phone_number = data.admitcard.phone_number ? data.admitcard.phone_number : "";
    this.search_config.admitcardfilter.admitcard.mobile_number = data.admitcard.mobile_number ? data.admitcard.mobile_number : "";
    this.search_config.admitcardfilter.admitcard.dob = data.admitcard.dob ? data.admitcard.dob : "";

    this.config.data[0] = data.bubbleConfig;
    // ---------------------------------------- 
    // reset bublle config on reset filter
    if (data.resetFlag !== undefined) {
      this.resetFilterFlag = data.resetFlag;
      this.count = 0;
    } else {
      this.resetFilterFlag = false;
    }
    // ------------------------------------------

    this.search_config.admitcardfilter.paging = this.defaultPagingParams;
    this.getData(this._getRemoteParameters(), false);
    this.updatedFilter = {};
  }

  private getSearchParams(params: NgxIxcheckTableParams, formSubmit: boolean) {
    this.search_config.admitcardfilter.paging = {
      total_rows: this.itemCount || 0,
      returned_rows: 0,
      direction: params.direction || 0,
      order_dir: params.sortAsc ? 'asc' : 'desc' || "",
      page_size: 10,
      sort_by: params.sortBy || "",
      offset: params.offset || 0,
      last_offset: params.lastOffset || 0,
      last_seen_id_max: params.lastSeenIdMax || 0,
      last_seen_id_min: params.lastSeenIdMin || 0
    }
    return this.search_config;
  }

  private getData(params: NgxIxcheckTableParams, fromSubmit: boolean) {
    this.notFound = false;
    this.resetFilterFlag = false;
    let admitCardSearchParams = this.getSearchParams(params, fromSubmit);
    //admitCardSearchParams.admitcardfilter.admitcard.exam_guid = this.examGuid;
    //admitCardSearchParams.admitcardfilter.admitcard.shift_number = this.shiftNo;
    admitCardSearchParams.admitcardfilter.admitcard.registration_guid = this.registrationId;
    admitCardSearchParams.admitcardfilter.admitcard.allocation_snapshots_id = this.snapshotId;

    //call api code here...
    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardCentreList;
      this.restService.HttpPostParams = admitCardSearchParams;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          this.items = sucessResponse.admitcard;
          this.examNumber = sucessResponse.admitcard[0].exam_number;
          this.totalShift = sucessResponse.admitcard[0].total_shift;
          this.shiftNo = sucessResponse.admitcard[0].shift_number;

          //paging info
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          //this.offset = sucessResponse.paging.offset;
          this.search_config.admitcardfilter.paging = sucessResponse.paging;
          if (this.items === undefined || this.items.length < 1) {
            this.notFound = true;
          }
        }, errorResponse => {
          if (errorResponse !== undefined) {
            this.notFound = true;
          }
        }
        );
    }
  }

  public reloadItems(params, fromSubmit) {
    this.getData(params, fromSubmit);
  }

  private _getRemoteParameters(): NgxIxcheckTableParams {
    let params = <NgxIxcheckTableParams>{};

    params.sortBy = '';
    params.sortAsc = true;
    params.offset = 0;
    params.limit = 10;
    params.lastSeenIdMax = 0;
    params.lastSeenIdMin = 0;
    params.lastOffset = 0;

    return params;
  }

  public updateFilter() {
    this.count = Number(this.count) + 1;
    this.updatedFilter = this.search_config.admitcardfilter.admitcard;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }

  public resetFilter() {
    this.search_config.admitcardfilter.admitcard = {
      exam_guid: "",
      shift_number: "",
      city_guid: [],
      city_name: "",
      state_guid: [],
      state: ""
    }
    this.search_config.admitcardfilter.paging = this.defaultPagingParams;
    this.getData(this._getRemoteParameters(), false);
    this.resetFilterFlag = true;
  }

  public updateSearch(removedId: string) {
    this.search_config.admitcardfilter.admitcard[removedId] = "";
    this.search_config.admitcardfilter.paging = this.defaultPagingParams;
    this.getData(this._getRemoteParameters(), false);
    this.count = Number(this.count) + 1;
  }
}