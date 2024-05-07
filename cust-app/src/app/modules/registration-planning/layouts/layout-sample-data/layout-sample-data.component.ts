import { Component, OnInit } from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import bubbleConfig from "../../../../../assets/config/bubbleconfig.json";
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { Registration, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations.js';
import { Params, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-layout-sample-data',
  templateUrl: './layout-sample-data.component.html',
  styleUrls: ['./layout-sample-data.component.scss']
})
export class LayoutSampleDataComponent implements OnInit {

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
  public templateId:any;
  private searchFilter: any = {
    "student_list_filter": {
      "student_list": {
        "layout_id": 0,
        "candidate": "",        
        "first_name": "",
        "address": ""        
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
    private primaryHeader: PrimaryHeaderService,
    private route: ActivatedRoute,
  ) {
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;

    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }

  ngOnInit() {    
    this.primaryHeader.pageTitle.next("SAMPLE DATA");
    this.route.params.subscribe((params: Params) => {

      
      this.searchFilter.student_list_filter.student_list.layout_id=params['id']
      this.templateId = params['id'];
      //this.getTemplateDetails(params['id']);     
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
    //this.searchFilter.student_list_filter.exam_setup = data.exams;
    this.searchFilter.student_list_filter.student_list = data.layout;
    this.searchFilter.student_list_filter.student_list.layout_id=this.templateId;
    this.config.data[0] = data.bubbleConfig;
    this.searchFilter.student_list_filter.paging = this.defaultPagingParams;
    this.getData();
    this.resetFilterFlag = false;
    this.updatedFilter = {};
    //this.config.data[0] = this.setConfig();   // change dropdown name with value
  }
  public getData(params?: NgxIxcheckTableParams) {
    this.notFound = false;
    this.resetFilterFlag = false;
    if (params != undefined) {
      this.searchFilter.student_list_filter.paging.direction = params.direction;
      this.searchFilter.student_list_filter.paging.offset = params.offset;
      this.searchFilter.student_list_filter.paging.last_offset = params.lastOffset;
      this.searchFilter.student_list_filter.paging.last_seen_id_max = params.lastSeenIdMax;
      this.searchFilter.student_list_filter.paging.last_seen_id_min = params.lastSeenIdMin;
    }

    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = Registration.getStudentList;
      this.restService.HttpPostParams = this.searchFilter;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.showProgress=true;
      this.restService.callApi()
        .subscribe(sucessResponse => {            
          this.items = sucessResponse.student_list
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          this.searchFilter.student_list_filter.paging = sucessResponse.paging;          
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
    this.searchFilter.student_list_filter.student_list[removedId] = "";
    //delete this.searchFilter.student_list_filter.range_filter[removedId];
    this.searchFilter.student_list_filter.paging = this.defaultPagingParams;
    this.getData();
    this.updateFilter();

  }
  public resetFilter() {
    this.searchFilter.student_list_filter.paging = this.defaultPagingParams;
    //this.searchFilter.student_list_filter.exam_setup = {}
    this.searchFilter.student_list_filter.student_list = {}
    this.searchFilter.student_list_filter.range_filter = {}
    this.getData();
    this.resetFilterFlag = true;
  }

  public updateFilter() {
    this.count = Number(this.count) + 1;
    //this.updatedFilter = this.searchFilter.student_list_filter.exam_setup;
    this.updatedFilter = this.searchFilter.student_list_filter;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }

  }

}
