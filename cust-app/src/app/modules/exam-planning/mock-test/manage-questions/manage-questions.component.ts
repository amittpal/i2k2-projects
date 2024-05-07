import { Component, OnInit } from '@angular/core';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Author } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AuthService } from '../../../../services/auth/auth.service';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import bubbleConfig from "../../../../../assets/config/bubbleconfig.json";
import { AppsettingsConfService } from '../../../../services/conf/appsettings-conf/appsettings-conf.service';

import { Exam, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.scss']
})
export class ManageQuestionsComponent implements OnInit {

  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public count: Number = 0;
  public notFound: boolean = false;
  public displayMessage: any;
  examGuid: any;
  examName = "";
  orderId: any;
  public paginationStyle = 'minimal';
  exam_status_css_tag = "";
  exam_status = "";

  public resetFilterFlag: boolean = false;
  public config = bubbleConfig;
  public updatedFilter: any;
  private appRoutes: any = {};

  public search_config: any = {
    "mocktest_filter": {
      "mock_test": {
        "subject": "",
        "language": "",
        "difficulty_level": "",
        "question_type": ""
      },
      "paging": {
        "total_rows": 0,
        "returned_rows": 0,
        "direction": 0,
        "order_dir": "",
        "page_size": 0,
        "sort_by": "",
        "last_offset": 0,
        "last_seen_id_max": 0,
        "last_seen_id_min": 0
      },
      "cols": []
    }

  };
  examId:any;
  examDetails:any;

  constructor(
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService,
    private route: ActivatedRoute,
    private restService: GlobalRestService,
    private messageService:MessageService) {
      this.restService.ShowLoadingSpinner = true;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.configService.getAppRoutes.subscribe(configData => {
        this.appRoutes = configData;
      }, error => {
        console.error('Error for configService.getAppRoutes: ', error);
      });
     }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("MANAGE MOCK QUESTIONS");
     //removing filter space from previous screen (need to refactor this logic)
     document.querySelector('.az-content-dashboard-three').classList.remove('filter-show');
  
    this.route.params.subscribe((params: Params) => {
      this.examId = params['examId'];
    }, error => {
      console.error('Error: ', error);
    });
  }

  public updateTable(data) {
    this.offset = 0;
    this.search_config.mocktest_filter.mock_test = data.questions;
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
    this.getData(this._getRemoteParameters(), false);
    this.updatedFilter = {};
  }

  private getSearchParams(params: NgxIxcheckTableParams, formSubmit: boolean) {
    this.search_config.mocktest_filter.paging = {
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

    var keyData = [
      {
        "name": "examId",
        "value": this.examId
      }
    ];

    //console.log(examSearchParams)
    //call api code here...
    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = Exam.getMockTestQuestionsListByExamId;
      this.restService.HttpPostParams = examSearchParams;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {
          this.items = sucessResponse.mock_question_list;

          this.exam_status = this.items[0]["number_of_questions_created"] == "0" ? "Pending" :
            this.items[0]["number_of_questions_created"] == this.items[0]["total_question"] ? "Completed"
              : "In Progress";

          this.exam_status_css_tag = this.items[0]["number_of_questions_created"] == "0" ? "badge" :
            this.items[0]["number_of_questions_created"] == this.items[0]["total_question"] ? "badge badge-success"
              : "badge badge-warning";

          //paging info
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          //this.offset = sucessResponse.paging.offset;
          this.search_config.mocktest_filter.paging = sucessResponse.paging;
          if (this.items === undefined || this.items.length < 1) {
            this.notFound = true;
          }
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

  public updateFilter() {
    this.count = Number(this.count) + 1;
    this.updatedFilter = this.search_config.mocktest_filter.mock_test;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }

  public resetFilter() {
    this.search_config.mocktest_filter.mock_test = {}
    this.getData(this._getRemoteParameters(), false);
    this.resetFilterFlag = true;
  }

  public updateSearch(removedId: string) {
    this.search_config.mocktest_filter.mock_test[removedId] = "";
    this.getData(this._getRemoteParameters(), false);
    this.count = Number(this.count) + 1;
  }


}
