import { Component, OnInit } from '@angular/core';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registered } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';
import bubbleConfig from "../../../../assets/config/bubbleconfig.json";
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.scss']
})
export class PaymentManagementComponent implements OnInit {
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
  public registrationId: any;
  public registrationGUID: any;
  public registrationName: any;
  private searchFilter: any = {
    "payment_filter": {
      "payments": { //---- payments filter
        "exam_number": "",
        "code": "",
        "grade_type_guid": "",
        "plan_status_guid": "",
        "status": ""      
      },
      "registration_filter": { //---- same registered candidate
      "exam_guid":"",
      "reg_code": "",
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
    private route: ActivatedRoute
  ) {
    this.restService.ShowLoadingSpinner = true;
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
   }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Payment Management");
    this.registrationId = localStorage.getItem('registrationId');
    this.registrationName = localStorage.getItem('registrationName');
    this.route.params.subscribe((params: Params) => {
    this.registrationGUID = params['id'];
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
    this.searchFilter.payment_filter.registration_filter = {     
      registration_guid: this.registrationGUID,
      //candidate_guid: data.PaymentManagements.candidate_guid ? data.PaymentManagements.candidate_guid : "",      
      name: data.PaymentManagements.name ? data.PaymentManagements.name : "",
      father_name: data.PaymentManagements.father_name ? data.PaymentManagements.father_name : "",
      dob: data.PaymentManagements.dob ? data.PaymentManagements.dob : "",
      gender: data.PaymentManagements.gender ? data.PaymentManagements.gender : "",
      ph: data.PaymentManagements.ph ? data.PaymentManagements.ph : "",
      category: data.PaymentManagements.category ? data.PaymentManagements.category : "",
      special: data.PaymentManagements.special ? data.PaymentManagements.special : "",
      registration_status: data.PaymentManagements.registration_status ? data.PaymentManagements.registration_status : "",
    }   
    this.searchFilter.payment_filter.payments = {
      payment_status: data.PaymentManagements.payment_status ? data.PaymentManagements.payment_status : localStorage.getItem('paymentStatusGUID'),
      transaction_id: data.PaymentManagements.transaction_id ? data.PaymentManagements.transaction_id : "",  
      bank_name: data.PaymentManagements.bank_name ? data.PaymentManagements.bank_name : "",
      from_date: data.PaymentManagements.from_date ? data.PaymentManagements.from_date : "",
      to_date: data.PaymentManagements.to_date ? data.PaymentManagements.to_date : "",
      fee_amount_min: data.PaymentManagements.fee_amount_min ? data.PaymentManagements.fee_amount_min : "",
      fee_amount_max: data.PaymentManagements.fee_amount_max ? data.PaymentManagements.fee_amount_max : "",
      payment_amount_min: data.PaymentManagements.payment_amount_min ? data.PaymentManagements.payment_amount_min : "",
      payment_amount_max: data.PaymentManagements.payment_amount_max ? data.PaymentManagements.payment_amount_max : "",
      balance_amount_min: data.PaymentManagements.balance_amount_min ? data.PaymentManagements.balance_amount_min : "",      
      balance_amount_max: data.PaymentManagements.balance_amount_max ? data.PaymentManagements.balance_amount_max : "",
    };
    this.config.data[0] = data.bubbleConfig;    
    this.searchFilter.payment_filter.paging = this.defaultPagingParams;
    this.getData();
    this.resetFilterFlag = false;
    this.updatedFilter = {};
    //this.config.data[0] = this.setConfig();   // change dropdown name with value
  }
  public getData(params?: NgxIxcheckTableParams) {        
    this.notFound = false;
   
    this.resetFilterFlag = false;
    if (params != undefined) {
      this.searchFilter.payment_filter.paging.direction = params.direction;
      this.searchFilter.payment_filter.paging.offset = params.offset;
      this.searchFilter.payment_filter.paging.last_offset = params.lastOffset;
      this.searchFilter.payment_filter.paging.last_seen_id_max = params.lastSeenIdMax;
      this.searchFilter.payment_filter.paging.last_seen_id_min = params.lastSeenIdMin;
    }

    if (Object.keys(this.appRoutes).length !== 0) {
      var keyData = [
        {
          "name": "guid",
          "value": this.registrationGUID
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Registered.getPaymentManagementList;
      this.restService.HttpPostParams = this.searchFilter;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.showProgress=true;
      this.restService.callApi(keyData) 
        .subscribe(sucessResponse => {                
          this.items = sucessResponse.payments;
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          this.searchFilter.payment_filter.paging = sucessResponse.paging;
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
    this.searchFilter.payment_filter.registration_filter[removedId] = "";
    this.searchFilter.payment_filter.payments[removedId] = "";
    
    this.searchFilter.payment_filter.paging = this.defaultPagingParams;
    this.getData();
    this.updateFilter();

  }
  public resetFilter() {
    this.searchFilter.payment_filter.paging = this.defaultPagingParams;    
    this.searchFilter.payment_filter.layout = {}
    this.searchFilter.payment_filter.registration_filter = {registration_guid: this.registrationGUID};
    this.searchFilter.payment_filter.payments = {}
    this.getData();
    this.resetFilterFlag = true;
  }

  public updateFilter() {
    this.count = Number(this.count) + 1;    
    this.updatedFilter = this.searchFilter.payment_filter;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }

  }

}
