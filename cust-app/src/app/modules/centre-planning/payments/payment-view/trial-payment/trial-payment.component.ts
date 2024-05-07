import { Component, OnInit } from '@angular/core';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { PaymentGateway, Registration } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';
import bubbleConfig from "../../../../../../assets/config/bubbleconfig.json";

@Component({
  selector: 'app-trial-payment',
  templateUrl: './trial-payment.component.html',
  styleUrls: ['./trial-payment.component.scss']
})
export class TrialPaymentComponent implements OnInit {
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
  examTypeList: any = [];
  private searchFilter: any = {
    "payment_response_filter": {
      "payment_responses": {
        "id": "",
        "order_id": "",
        "customer_id": "",
        "mid": "",
        "txn_id": "",
        "txn_amount": "",
        "payment_mode": "",
        "currency": "",
        "txn_date": "",
        "response_code": "",
        "response_msg": "",
        "gateway_name": "",
        "bank_txn_id": "",
        "bank_name": "",
        "check_sum_hash": "",
        "from_date": "",
        "to_date": "",
        "txn_status": ""
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
      "cols": [
      ]
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
    this.primaryHeader.pageTitle.next("Payments");
  }
  ngOnDestroy() {
    this.config.data = [];
    this.config.data.push({});
  }
  public updateTable(data: any) {
    this.offset = 0;
    //this.searchFilter.payment_response_filter.exam_setup = data.exams;
    this.searchFilter.payment_response_filter.payment_responses = data.paymentsTransaction;
    this.config.data[0] = data.bubbleConfig;
    this.searchFilter.payment_response_filter.paging = this.defaultPagingParams;
    this.getData();
    this.resetFilterFlag = false;
    this.updatedFilter = {};
    //this.config.data[0] = this.setConfig();   // change dropdown name with value
  }
  public getData(params?: NgxIxcheckTableParams) {
    this.notFound = false;
    this.resetFilterFlag = false;
    if (params != undefined) {
      this.searchFilter.payment_response_filter.paging.direction = params.direction;
      this.searchFilter.payment_response_filter.paging.offset = params.offset;
      this.searchFilter.payment_response_filter.paging.last_offset = params.lastOffset;
      this.searchFilter.payment_response_filter.paging.last_seen_id_max = params.lastSeenIdMax;
      this.searchFilter.payment_response_filter.paging.last_seen_id_min = params.lastSeenIdMin;
    }

    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = PaymentGateway.getPaymentsList;
      this.restService.HttpPostParams = this.searchFilter;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;

      this.restService.callApi()
        .subscribe(sucessResponse => {
          //console.log(sucessResponse);             
          this.items = sucessResponse.account_masters;
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          this.searchFilter.payment_response_filter.paging = sucessResponse.paging;
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
    this.searchFilter.payment_response_filter.payment_responses[removedId] = "";
    //delete this.searchFilter.payment_response_filter.range_filter[removedId];
    this.searchFilter.payment_response_filter.paging = this.defaultPagingParams;
    this.getData();
    this.updateFilter();

  }
  public resetFilter() {
    this.searchFilter.payment_response_filter.paging = this.defaultPagingParams;
    //this.searchFilter.payment_response_filter.exam_setup = {}
    this.searchFilter.payment_response_filter.payment_responses = {}
    this.searchFilter.payment_response_filter.range_filter = {}
    this.getData();
    this.resetFilterFlag = true;
  }
  public refreshExamList() {
    this.restService.ApiEndPointUrlOrKey = Registration.getExamList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;

    this.restService.callApi()
      .subscribe(sucessResponse => {
        console.log(sucessResponse);
        this.examTypeList = sucessResponse.exams;
      }, errorResponse => {
        if (errorResponse !== undefined) {
        }
      });
  }
  public updateFilter() {
    this.count = Number(this.count) + 1;
    //this.updatedFilter = this.searchFilter.payment_response_filter.exam_setup;
    this.updatedFilter = this.searchFilter.payment_response_filter;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }

  }



}
