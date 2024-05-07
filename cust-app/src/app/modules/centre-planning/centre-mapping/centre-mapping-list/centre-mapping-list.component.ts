import { Component, OnInit } from '@angular/core';
import bubbleConfig from '../../../../../assets/config/bubbleconfig.json';
import { GlobalRestService } from '../../../../services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { RestMethods } from '../../../../shared/models/app.models';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { AppsettingsConfService } from '../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { ImportedCentres, HandelError } from '../../../../shared/enumrations/app-enum.enumerations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-centre-mapping-list',
  templateUrl: './centre-mapping-list.component.html',
  styleUrls: ['./centre-mapping-list.component.scss']
})
export class CentreMappingListComponent implements OnInit {
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
  public search_config: any = {

    "centre_mapping_filter":
    {
      "centre_mapping": {},
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
  constructor(private configService: AppsettingsConfService, private messageService: MessageService,
    private restService: GlobalRestService, private primaryHeader: PrimaryHeaderService, private router: Router) {
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
    this.primaryHeader.pageTitle.next("Centre Mapping");
    this.refreshExamList();
  }
  ngOnDestroy() {
    this.config.data = [];
    this.config.data.push({});
  }

  public updateTable(data: any) {
 
    this.offset = 0;
    this.search_config.centre_mapping_filter.centre_mapping = data.formData;
    this.config.data[0] = data.bubbleConfig;
    this.getData(this._getRemoteParameters(), false);
    this.updatedFilter = {};
  }

  private getSearchParams(params: NgxIxcheckTableParams, formSubmit: boolean) {
    this.search_config.centre_mapping_filter.paging = {
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
    this.resetFilterFlag = false;
    let CentreMappingSearchParams = this.getSearchParams(params, fromSubmit);
    //call api code here...
    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = ImportedCentres.getCentresMappingList;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      this.restService.HttpPostParams = CentreMappingSearchParams;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          this.items = sucessResponse.centre_mapping;
          this.notFound = false;
          //paging info
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          //this.offset = sucessResponse.paging.offset;
          //update paging in this.searchFilter
          this.search_config.centre_mapping_filter.paging = sucessResponse.paging;
        }, errorResponse => {
          if (errorResponse !== undefined) {
            this.notFound = true;
            this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
          }
        }
        );
    }
  }

  private getRefereshData(params: NgxIxcheckTableParams, fromSubmit: boolean) {
  
    this.resetFilterFlag = false;
    let CentreMappingSearchParams = this.getSearchParams(params, fromSubmit);
    //call api code here...
    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = ImportedCentres.getCentresMappingRefresgList;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      this.restService.HttpPostParams = CentreMappingSearchParams;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          
          this.items = sucessResponse.centre_mapping;
          this.notFound = false;
          //paging info
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          //this.offset = sucessResponse.paging.offset;
          //update paging in this.searchFilter
          this.search_config.centre_mapping_filter.paging = sucessResponse.paging;
        }, errorResponse => {
          if (errorResponse !== undefined) {
            
            this.notFound = true;
            this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
          }
        }
        );
    }
  }

  public reloadItems(params: any, fromSubmit: any) {
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
    this.updatedFilter = this.search_config.centre_mapping_filter.centre_mapping;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }

  public resetFilter() {
    this.search_config.centre_mapping_filter.centre_mapping = {}
    this.getData(this._getRemoteParameters(), false);
    this.resetFilterFlag = true;
  }

  public updateSearch(removedId: string) {
    this.search_config.exam_type_filter.exam_type[removedId] = ""
    this.getData(this._getRemoteParameters(), false);
    this.updateFilter();
  }
 
 public refreshExamList()
 {
  this.offset = 0;
    this.getRefereshData(this._getRemoteParameters(), false);
    this.updatedFilter = {};
 }

 centresUnmapp(examGuid:any)
 {
  if(examGuid)
  {
    this.messageService.confirm(["All the allocations will be invalidated by unmapping the centre, Are you sure to unmap the centres?"], 
    "Delete", "Yes", "NO", "error").subscribe(result => {
      if (result == true) {
        var keyData = [
          {
            "name": "examGuid",
            "value": examGuid
          }
        ];
        this.restService.ApiEndPointUrlOrKey = ImportedCentres.centresUnMap;      
        this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
        this.showProgress=true;
        this.restService.callApi(keyData)
          .subscribe(sucessResponse => {                          
            this.messageService.notify(sucessResponse);
            this.ngOnInit();
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