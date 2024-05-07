import { Component, OnInit, DoCheck,OnDestroy } from '@angular/core';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';
import { QuestionRequirement } from 'src/app/shared/enumrations/app-enum.enumerations';
import bubbleConfig from "src/assets/config/bubbleconfig.json";
import { CommonClass } from 'src/app/shared/classes/common.class';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';

@Component({
  selector: 'app-question-requirements-list',
  templateUrl: './question-requirements-list.component.html',
  styleUrls: ['./question-requirements-list.component.scss'],
  providers:[ CommonClass ]
})
export class QuestionRequirementsListComponent implements OnInit, DoCheck, OnDestroy {

  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;

  public paginationStyle = 'minimal';

  private appRoutes: any = {};

  public resetFilterFlag : boolean = false;
  public config = bubbleConfig;
  public updatedFilter : any;
  public count : Number = 0;
  public notFound: boolean = false;
  public displayMessage : any;

  public search_config: any = {
      "exam_filter" :
       {
         "exam_setup": {	},
         "cols":[ ],
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

  constructor(
    private configService: AppsettingsConfService,
    private restService: GlobalRestService, private primaryHeader: PrimaryHeaderService,
    private commonClass : CommonClass
    ) {
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
    this.primaryHeader.pageTitle.next("QUESTION REQUIREMENT");
  }

  ngDoCheck() {
    //this.config.data = [];
  }

  ngOnDestroy(){
    this.config.data = [];
    this.config.data.push({});
  }

  public updateTable(data){
    this.offset = 0;
    this.search_config.exam_filter.exam_setup = data.questionRequirements;
    this.config.data[0] = data.bubbleConfig;
    // ----------------------------------------
    // reset bublle config on reset filter
    if(data.resetFlag !== undefined) {
      this.resetFilterFlag = data.resetFlag;
      this.count = 0;
    } else {
      this.resetFilterFlag = false;
    }
    // ------------------------------------------
    this.getData(this._getRemoteParameters(), false);
    this.updatedFilter = {};
  }

  private getSearchParams(params: NgxIxcheckTableParams, formSubmit: boolean) {
    this.search_config.exam_filter.paging = {
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
    let examSearchParams = this.getSearchParams(params, fromSubmit);
    //call api code here...
    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = QuestionRequirement.getQuestionRequirementsList;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      this.restService.HttpPostParams = examSearchParams;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          this.items = sucessResponse.exam_setup;
          //paging info
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          //this.offset = sucessResponse.paging.offset;
          this.search_config.exam_filter.paging = sucessResponse.paging;
        }, errorResponse => {
          if (errorResponse !== undefined) {
            this.notFound = true;
            this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
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

  public rowClick(event) {
     // console.log('Clicked: ' + rowEvent.row.item.name);
  }

  public rowDoubleClick(event) {
    // alert('Double clicked: ' + rowEvent.row.item.name);
  }

  public updateFilter(){
    this.count = Number(this.count) + 1;
    this.updatedFilter = this.search_config.exam_filter.exam_setup;
    for (let filter in this.updatedFilter){
      if(this.updatedFilter[filter] != ""){
        delete this.updatedFilter[filter];
      }
    }
  }

  public resetFilter() {
    this.search_config.exam_filter.exam_setup = {}
    this.getData(this._getRemoteParameters(), false);
    this.resetFilterFlag = true;
  }

  public updateSearch(removedId: string) {
    this.search_config.exam_filter.exam_setup[removedId] = "";
    this.getData(this._getRemoteParameters(), false);
    this.count = Number(this.count) + 1;
  }

}
