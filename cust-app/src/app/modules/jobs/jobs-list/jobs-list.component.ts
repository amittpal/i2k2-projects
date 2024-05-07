import { Component, OnInit } from '@angular/core';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import bubbleConfig from "../../../../assets/config/bubbleconfig.json";
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { Jobs } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.scss']
})
export class JobsListComponent implements OnInit {
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public config = bubbleConfig
  public bubbleLabels: any = {}
  public resultModal: string;
  public resetFilterFlag : boolean = false;
  public updatedFilter : any;
  public count : Number = 0;
  public notFound: boolean = false;
  public displayMessage : any; 
  public showProgress: boolean = false;
  public isLoading: boolean = false;
  public reloadBubble = true
  public paginationStyle = 'minimal';
  public appRoutes: any = {};
  private searchFilter: any = {
    "job_filter" :
    {
      "job": {},
      "cols": [],
      "paging": {
        "total_rows": 0,
        "returned_rows": 0,
        "direction": 0,
        "order_dir": "",
        "page_size": 10,
        "sort_by": "",
        "last_offset": 0,
        "last_seen_id_max": 0,
        "last_seen_id_min": 0
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
    private restService: GlobalRestService, private messageService: MessageService,
    private configService: AppsettingsConfService, private primaryHeader: PrimaryHeaderService
  ) { 
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("Job List");
  }
  ngOnDestroy() {
    this.config.data = [];
    this.config.data.push({});
  }

  
  public reloadItems(params) {
    this.getData(params);
  }
 
  public updateTable(data) {
    this.offset = 0;
    debugger
    const filterData = data.job;
    this.searchFilter.job_filter.job = filterData;
    this.config.data[0] = data.bubbleConfig;  
    this.searchFilter.job_filter.paging = this.defaultPagingParams;
    this.getData(this._getRemoteParameters());
    this.resetFilterFlag = false;
    this.updatedFilter = {};
  }

  private getSearchParams(params: NgxIxcheckTableParams) {
    this.searchFilter.job_filter.paging = {
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


  public updateSearch(removedId: string) {
    this.searchFilter.job_filter.job[removedId] = "";
    this.searchFilter.job_filter.paging = this.defaultPagingParams;
    this.getData(this._getRemoteParameters());
    this.updateFilter();
    
  }
  public resetFilter() {
    this.resetFilterFlag = true;
    this.searchFilter.job_filter.job = {}
    this.searchFilter.job_filter.paging = this.defaultPagingParams;
    this.getData(this._getRemoteParameters());
  }

  public updateFilter(){
    this.count = Number(this.count) + 1;
    this.updatedFilter = this.searchFilter.job_filter.job;
    for (let filter in this.updatedFilter){
      if(this.updatedFilter[filter] != ""){
        delete this.updatedFilter[filter];
      }
    }
  }
  public rowClick(_event) {

  }
  public rowDoubleClick(_event) {

  }

  public getData(params: NgxIxcheckTableParams) {
    let apisParams = this.getSearchParams(params);
    this.notFound = false;
      this.restService.ApiEndPointUrlOrKey = Jobs.getJobList;
      this.restService.HttpPostParams = apisParams;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          this.items = sucessResponse.jobs;
          this.notFound = false;
          //paging info
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          //update paging in this.searchFilter
          this.searchFilter.job_filter.paging = sucessResponse.paging;

        }, errorResponse => {
          if (errorResponse !== undefined) {
            this.notFound = true;
            this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
          }
        }
      );
  }
  onDelete(id, name) {
    this.messageService.confirm(["Are you sure you want to delete this record?", JSON.stringify('#' +id +' '+name)], 
    "Delete", "Yes", "NO", "error").subscribe(result => {
      if (result == true) {
        this.messageService.hideModal();
        const keyData = [
          {
            "name": "jobTypeId",
            "value": id
          }
        ];
        this.restService.ApiEndPointUrlOrKey = Jobs.deleteJobTypesById;
        this.restService.callApi(keyData).subscribe(successResponse => {
          this.messageService.okRedirectModal(successResponse, 'SUCCESS').subscribe(result => {
            if (result == true) { // OK = true for redirection
              this.messageService.hideModal();
              this.getData(this._getRemoteParameters());
            }
            else { // NO/CANCEL = false
              this.messageService.hideModal();
            }
          });
        }, () => {
          this.messageService.hideModal();
        });
      } else {
        this.messageService.hideModal();
      }
    })
  }
}