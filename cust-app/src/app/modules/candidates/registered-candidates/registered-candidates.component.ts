import { Component, OnInit } from '@angular/core';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Candidates } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';
import bubbleConfig from "../../../../assets/config/bubbleconfig.json";
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-registered-candidates',
  templateUrl: './registered-candidates.component.html',
  styleUrls: ['./registered-candidates.component.scss']
})
export class RegisteredCandidatesComponent implements OnInit {
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public config = bubbleConfig
  public bubbleLabels: any = {}
  public resultModal: string;
  public resetFilterFlag: boolean = false;
  public updatedFilter: any;
  public count: Number = 0;
  public notFound: boolean = false;
  public displayMessage: any;
  public showProgress: boolean = false;
  public isLoading: boolean = false;
  public reloadBubble = true
  public paginationStyle = 'minimal';
  public appRoutes: any = {};
  public regId: any;
  public registrationGUID: any;
  public regName: any;
  private searchFilter: any = {
    "registration_filter": {
      "registration":
      {
        "exam_guid": ""
      },
      "paging": {
        "last_seen_id_max": 0,
        "last_seen_id_min": 0,
        "last_offset": 0,
        "page_size": 0,
        "sort_by": "string",
        "order_dir": "string",
        "direction": 0,
        "page_num": 0,
        "sort_exp": "string",
        "sort_dir": "string",
        "total_rows": 0
      }
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

  constructor(
    private restService: GlobalRestService,
    private messageService: MessageService,
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService,
    private route: ActivatedRoute
  ) {
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Registered Candidates");
    this.regId = localStorage.getItem('registrationId');
    this.regName = localStorage.getItem('registrationName');
    this.route.params.subscribe((params: Params) => {
      this.registrationGUID = params['guid'];
      // this.getData(params['id']);
    }, error => {
      console.error('Error: ', error);
    });
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
    this.searchFilter.registration_filter.registration = {
      registration_status: data.registeredCandidates.registration_status ? data.registeredCandidates.registration_status : localStorage.getItem('statusGUID'),
      registration_guid: this.registrationGUID,
      reg_id: data.registeredCandidates.reg_id ? data.registeredCandidates.reg_id : "",
      name: data.registeredCandidates.name ? data.registeredCandidates.name : "",
      color_percent_min: data.registeredCandidates.color_percent_min ? data.registeredCandidates.color_percent_min : "",
      color_percent_max: data.registeredCandidates.color_percent_max ? data.registeredCandidates.color_percent_max : "",
      face_percent_min: data.registeredCandidates.face_percent_min ? data.registeredCandidates.face_percent_min : "",
      face_percent_max: data.registeredCandidates.face_percent_max ? data.registeredCandidates.face_percent_max : "",
      father_name: data.registeredCandidates.father_name ? data.registeredCandidates.father_name : "",
      dob: data.registeredCandidates.dob ? data.registeredCandidates.dob : "",
      gender: data.registeredCandidates.gender ? data.registeredCandidates.gender : "",
      ph: data.registeredCandidates.ph ? data.registeredCandidates.ph : "",
      category: data.registeredCandidates.category ? data.registeredCandidates.category : "",
      special: data.registeredCandidates.special ? data.registeredCandidates.special : "",
      // registration_status: data.registeredCandidates.registration_status ? data.registeredCandidates.registration_status : "",
      payment_status: data.registeredCandidates.payment_status ? data.registeredCandidates.payment_status : ""
    };
    this.config.data[0] = data.bubbleConfig;
    this.searchFilter.registration_filter.paging = this.defaultPagingParams;
    this.getData();
    this.resetFilterFlag = false;
    this.updatedFilter = {};
    //this.config.data[0] = this.setConfig();   // change dropdown name with value
  }
  public getData(params?: NgxIxcheckTableParams) {
    this.notFound = false;

    this.resetFilterFlag = false;
    if (params != undefined) {
      this.searchFilter.registration_filter.paging.direction = params.direction;
      this.searchFilter.registration_filter.paging.offset = params.offset;
      this.searchFilter.registration_filter.paging.last_offset = params.lastOffset;
      this.searchFilter.registration_filter.paging.last_seen_id_max = params.lastSeenIdMax;
      this.searchFilter.registration_filter.paging.last_seen_id_min = params.lastSeenIdMin;
    }

    if (Object.keys(this.appRoutes).length !== 0) {
      var keyData = [
        {
          "name": "guid",
          "value": this.registrationGUID
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Candidates.getRegisteredCandidatesList;
      this.restService.HttpPostParams = this.searchFilter;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.showProgress = true;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {
          this.items = sucessResponse.registrations;
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          this.searchFilter.registration_filter.paging = sucessResponse.paging;
        }, errorResponse => {
          if (errorResponse !== undefined) {
            this.items = null;
            this.notFound = true;
            this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
          }
        });
    }
  }
  public updateSearch(removedId: string) {
    this.searchFilter.registration_filter.registration[removedId] = "";

    this.searchFilter.registration_filter.paging = this.defaultPagingParams;
    this.getData();
    this.updateFilter();

  }
  public resetFilter() {
    this.searchFilter.registration_filter.paging = this.defaultPagingParams;
    this.searchFilter.registration_filter.layout = {}
    this.searchFilter.registration_filter.range_filter = {}
    this.getData();
    this.resetFilterFlag = true;
  }

  public updateFilter() {
    this.count = Number(this.count) + 1;
    this.updatedFilter = this.searchFilter.registration_filter;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }
}