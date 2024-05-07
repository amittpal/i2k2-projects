import { Component, OnInit } from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { HandelError } from 'src/app/shared/models/app.models';
import bubbleConfig from "../../../../../assets/config/bubbleconfig.json";
import { Registration } from 'src/app/shared/enumrations/app-enum.enumerations.js';
@Component({
  selector: 'app-layout-list',
  templateUrl: './layout-list.component.html',
  styleUrls: ['./layout-list.component.scss']
})
export class LayoutListComponent implements OnInit {

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
    "layout_filter": {
      "layout": {
        "layout_number": "",
        "layout_code": "",
        "name": "",
        "layout_status": "",
        "layout_exam_type": ""      
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
    this.primaryHeader.pageTitle.next("LAYOUTS");
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
    //this.searchFilter.layout_filter.exam_setup = data.exams;
    this.searchFilter.layout_filter.layout = data.layout;
    this.config.data[0] = data.bubbleConfig;
    this.searchFilter.layout_filter.paging = this.defaultPagingParams;
    this.getData();
    this.resetFilterFlag = false;
    this.updatedFilter = {};
    //this.config.data[0] = this.setConfig();   // change dropdown name with value
  }
  public getData(params?: NgxIxcheckTableParams) {
    this.notFound = false;
    this.resetFilterFlag = false;
    if (params != undefined) {
      this.searchFilter.layout_filter.paging.direction = params.direction;
      this.searchFilter.layout_filter.paging.offset = params.offset;
      this.searchFilter.layout_filter.paging.last_offset = params.lastOffset;
      this.searchFilter.layout_filter.paging.last_seen_id_max = params.lastSeenIdMax;
      this.searchFilter.layout_filter.paging.last_seen_id_min = params.lastSeenIdMin;
    }

    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = Registration.getLayoutList;
      this.restService.HttpPostParams = this.searchFilter;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.showProgress=true;
      this.restService.callApi()
        .subscribe(sucessResponse => {                
          this.items = sucessResponse.layout;
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          this.searchFilter.layout_filter.paging = sucessResponse.paging;
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
    this.searchFilter.layout_filter.layout[removedId] = "";
    //delete this.searchFilter.layout_filter.range_filter[removedId];
    this.searchFilter.layout_filter.paging = this.defaultPagingParams;
    this.getData();
    this.updateFilter();

  }
  public resetFilter() {
    this.searchFilter.layout_filter.paging = this.defaultPagingParams;
    //this.searchFilter.layout_filter.exam_setup = {}
    this.searchFilter.layout_filter.layout = {}
    this.searchFilter.layout_filter.range_filter = {}
    this.getData();
    this.resetFilterFlag = true;
  }

  public updateFilter() {
    this.count = Number(this.count) + 1;
    //this.updatedFilter = this.searchFilter.layout_filter.exam_setup;
    this.updatedFilter = this.searchFilter.layout_filter;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }

  }

  onDeleteLayout(layoutId:any)
  {
    if(layoutId)
    {
      this.messageService.confirm(["Are you sure you want to delete this Layout?"], 
      "Delete", "Yes", "NO", "error").subscribe(result => {
        if (result == true) {
          var keyData = [
            {
              "name": "layoutId",
              "value": layoutId
            }
          ];
          this.restService.ApiEndPointUrlOrKey = Registration.deleteLayout;      
          this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
          this.showProgress=true;
          this.restService.callApi(keyData)
            .subscribe(sucessResponse => {                          
              this.messageService.notify(sucessResponse);
              this.getData();
            }, errorResponse => {
              if (errorResponse !== undefined) {            
                //this.notFound = true;
                this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
                this.messageService.notify(this.displayMessage);
              }
            });
        }
        else
        {

        }   
        this.messageService.hideModal();  
    })
  }
}
}
  
  

