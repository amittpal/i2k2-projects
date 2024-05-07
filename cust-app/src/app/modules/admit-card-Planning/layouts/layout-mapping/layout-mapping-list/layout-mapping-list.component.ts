import { Component, OnInit } from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import bubbleConfig from "../../../../../../assets/config/bubbleconfig.json";
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations.js';
import { RestMethods, HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-layout-mapping-list',
  templateUrl: './layout-mapping-list.component.html',
  styleUrls: ['./layout-mapping-list.component.scss']
})
export class LayoutMappingListComponent implements OnInit {

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
  examTypeList: any=[];
  private searchFilter: any = {
    "layout_mapping_filter": {
      "layout_mapping": {        
        "layout_number": "",
        "id": "",
        "layout_id": "",
        "exam_guid": "",
        "exam_number": "",
        "code": "",
        "name": "",
        "exam_type": "",
        "status": "",
        "status_guid": "",
        "planning_status": "",
        "planning_status_css": "",
        "exam": "",
        "exam_code": "",
        "exam_name": "",
        "exam_status": ""
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
  constructor(
    private restService: GlobalRestService,
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService
  ) {
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("ADMIT CARD LAYOUT MAPPING");
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
    this.searchFilter.layout_mapping_filter.layout_mapping = data.layout;
    this.config.data[0] = data.bubbleConfig;
    this.searchFilter.layout_mapping_filter.paging = this.defaultPagingParams;
    this.getData();
    this.resetFilterFlag = false;
    this.updatedFilter = {};
    //this.config.data[0] = this.setConfig();   // change dropdown name with value
  }
  public getData(params?: NgxIxcheckTableParams) {
    this.notFound = false;
    this.resetFilterFlag = false;
    if (params != undefined) {
      this.searchFilter.layout_mapping_filter.paging.direction = params.direction;
      this.searchFilter.layout_mapping_filter.paging.offset = params.offset;
      this.searchFilter.layout_mapping_filter.paging.last_offset = params.lastOffset;
      this.searchFilter.layout_mapping_filter.paging.last_seen_id_max = params.lastSeenIdMax;
      this.searchFilter.layout_mapping_filter.paging.last_seen_id_min = params.lastSeenIdMin;
    }

    if (Object.keys(this.appRoutes).length !== 0) {    
      this.restService.ApiEndPointUrlOrKey = AdmitCard.getLayoutMappingList;
      this.restService.HttpPostParams = this.searchFilter;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;    
      this.restService.ShowLoadingSpinner=true;
      this.restService.callApi()
        .subscribe(sucessResponse => {            
          this.items = sucessResponse.layout_mapping;
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          this.searchFilter.layout_mapping_filter.paging = sucessResponse.paging;
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
    this.searchFilter.layout_mapping_filter.layout_mapping[removedId] = "";    
    this.searchFilter.layout_mapping_filter.paging = this.defaultPagingParams;
    this.getData();
    this.updateFilter();

  }
  public resetFilter() {
    this.searchFilter.layout_mapping_filter.paging = this.defaultPagingParams;    
    this.searchFilter.layout_mapping_filter.layout_mapping = {}
    this.searchFilter.layout_mapping_filter.range_filter = {}
    this.getData();
    this.resetFilterFlag = true;
  }
  
  public updateFilter() {
    this.count = Number(this.count) + 1;    
    this.updatedFilter = this.searchFilter.layout_mapping_filter;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }

  // public refreshExamList()
  // {
  //  this.offset = 0;
  //    this.getRefereshData(this._getRemoteParameters(), false);
  //    this.updatedFilter = {};
  // }

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

  private getSearchParams(params: NgxIxcheckTableParams, formSubmit: boolean) {
    this.searchFilter.layout_mapping_filter.paging = {
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
    return this.searchFilter;
  }

  // private getRefereshData(params: NgxIxcheckTableParams, fromSubmit: boolean) {
  
  //   this.resetFilterFlag = false;
  //   let LayoutMappingSearchParams = this.getSearchParams(params, fromSubmit);
  //   //call api code here...
  //   if (Object.keys(this.appRoutes).length !== 0) {
  //     this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardLayoutMappingRefreshList;
  //     this.restService.ApiEndPointMehod = RestMethods.Post;
  //     this.restService.HttpPostParams = LayoutMappingSearchParams;
  //     this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
  //     this.restService.callApi()
  //       .subscribe(sucessResponse => {
  //         this.items = sucessResponse.centre_mapping;
  //         this.notFound = false;
  //         //paging info
  //         this.itemCount = sucessResponse.paging.total_rows;
  //         this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
  //         this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
  //         this.lastOffset = sucessResponse.paging.last_offset;
  //         //this.offset = sucessResponse.paging.offset;
  //         //update paging in this.searchFilter
  //         this.searchFilter.layout_mapping_filter.paging = sucessResponse.paging;
  //       }, errorResponse => {
  //         if (errorResponse !== undefined) {
  //           this.notFound = true;
  //           this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
  //         }
  //       }
  //       );
  //   }
  // }

}
