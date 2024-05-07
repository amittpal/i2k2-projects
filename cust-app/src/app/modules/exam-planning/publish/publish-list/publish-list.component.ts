import { Component, OnInit } from '@angular/core';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';
import bubbleConfig from "../../../../../assets/config/bubbleconfig.json";

@Component({
  selector: 'app-publish-list',
  templateUrl: './publish-list.component.html',
  styleUrls: ['./publish-list.component.scss']
})
export class PublishListComponent implements OnInit {

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
  private searchFilter: any = {
    "exam_filter": {
      "exams": {
        "exam_number": "",
        "code": "",
        "grade_type_guid": "",
        "plan_status_guid": "",
        "status": ""      
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
    private messageService: MessageService,
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
    this.primaryHeader.pageTitle.next("PUBLISH");
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
    this.searchFilter.exam_filter.exams = data.publish;
    this.config.data[0] = data.bubbleConfig;
    this.searchFilter.exam_filter.paging = this.defaultPagingParams;
    this.getData();
    this.resetFilterFlag = false;
    this.updatedFilter = {};
    //this.config.data[0] = this.setConfig();   // change dropdown name with value
  }
  public getData(params?: NgxIxcheckTableParams) {        
    this.notFound = false;
    this.resetFilterFlag = false;
    if (params != undefined) {
      this.searchFilter.exam_filter.paging.direction = params.direction;
      this.searchFilter.exam_filter.paging.offset = params.offset;
      this.searchFilter.exam_filter.paging.last_offset = params.lastOffset;
      this.searchFilter.exam_filter.paging.last_seen_id_max = params.lastSeenIdMax;
      this.searchFilter.exam_filter.paging.last_seen_id_min = params.lastSeenIdMin;
    }

    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = Exam.getMockTestExamList;
      this.restService.HttpPostParams = this.searchFilter;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.showProgress=true;
      this.restService.callApi()
        .subscribe(sucessResponse => {                
          this.items = sucessResponse.exams;
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          this.searchFilter.exam_filter.paging = sucessResponse.paging;
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
    this.searchFilter.exam_filter.exams[removedId] = "";
    
    this.searchFilter.exam_filter.paging = this.defaultPagingParams;
    this.getData();
    this.updateFilter();

  }
  public resetFilter() {
    this.searchFilter.exam_filter.paging = this.defaultPagingParams;    
    this.searchFilter.exam_filter.layout = {}
    this.searchFilter.exam_filter.range_filter = {}
    this.getData();
    this.resetFilterFlag = true;
  }

  public updateFilter() {
    this.count = Number(this.count) + 1;    
    this.updatedFilter = this.searchFilter.exam_filter;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }

  }

}