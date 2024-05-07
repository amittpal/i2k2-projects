import { Component, OnInit } from '@angular/core';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';
import bubbleConfig from "src/assets/config/bubbleconfig.json";

@Component({
  selector: 'app-admit-card-centre-registrations',
  templateUrl: './admit-card-centre-registrations.component.html',
  styleUrls: ['./admit-card-centre-registrations.component.scss']
})
export class AdmitCardCentreRegistrationsComponent implements OnInit {
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;

  public paginationStyle = 'minimal';

  private appRoutes: any = {};

  public resetFilterFlag: boolean = false;
  public config = bubbleConfig;
  public updatedFilter: any;
  public count: Number = 0;
  public notFound: boolean = false;
  public displayMessage: any;

  public search_config: any = {

    "registration_filter": {
      "registration": {
        "guid": "",
        "code": "",
        "name": "",
        "exam_code": "",
        "exam_name": "",
        "exam_type": "",
        "plan_status": "",
        "description": "",
        "status": "",
        "registrations_setup_details": {
          "id": "",
          "exam_guid": "",
          "special_category_wise_fee": "",
          "category_wise_fee": "",
          "gender_wise_fee": "",
          "required_payment": "",
          "registration_start_date": "",
          "registration_end_date": "",
          "fee_end_date": "",
          "url": "",
          "status": ""
        },
        "exams": [
          {
            "exam_guid": "",
            "code": "",
            "name": ""
          }
        ]
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
      "cols": [

      ]
    }
  };

  constructor(
    private configService: AppsettingsConfService, private messageService: MessageService,
    private restService: GlobalRestService, private primaryHeader: PrimaryHeaderService,
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
    this.primaryHeader.pageTitle.next("Registration ");
  }


  ngOnDestroy() {
    this.config.data = [];
    this.config.data.push({});
  }

  public updateTable(data) {
    this.offset = 0;    
    this.search_config.registration_filter.registration = {
      "guid": "",
      "code": "",
      "name": "",
      "exam_code": "",
      "exam_name": "",
      "exam_type": "",
      "plan_status": "",
      "description": "",
      "status": "",
      "registrations_setup_details": {
        "id": "",
        "exam_guid": "",
        "special_category_wise_fee": "",
        "category_wise_fee": "",
        "gender_wise_fee": "",
        "required_payment": "",
        "registration_start_date": "",
        "registration_end_date": "",
        "fee_end_date": "",
        "url": "",
        "status": ""
      },
      "exams": [
        {
          "exam_guid": "",
          "code": "",
          "name": ""
        }
      ]
    }

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
    this.search_config.registration_filter.paging = {
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
    let admitCardSearchParams = this.getSearchParams(params, fromSubmit);
    //call api code here...
    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardSetupRegList;
      this.restService.HttpPostParams = admitCardSearchParams;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          this.items = sucessResponse.registrations;
          //paging info
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          //this.offset = sucessResponse.paging.offset;
          this.search_config.registration_filter.paging = sucessResponse.paging;
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
  public rowClick(event) {
    // console.log('Clicked: ' + rowEvent.row.item.name);
  }

  public rowDoubleClick(event) {
    // alert('Double clicked: ' + rowEvent.row.item.name);
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
    this.updatedFilter = this.search_config.registration_filter.registration;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }

  public resetFilter() {
    this.search_config.registration_filter.registration = {}
    this.getData(this._getRemoteParameters(), false);
    this.resetFilterFlag = true;
  }

  public updateSearch(removedId: string) {
    this.search_config.registration_filter.registration[removedId] = "";
    this.getData(this._getRemoteParameters(), false);
    this.count = Number(this.count) + 1;
  }
  onGenerateAdmitCard(registrationGuid) {
    this.restService.ApiEndPointUrlOrKey = AdmitCard.generateRegistration;
    let keydata = [{
      name: "registrationGuid",
      value: registrationGuid
    }
    ];
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keydata)
      .subscribe(sucessResponse => {
        this.messageService
          .okRedirectModal(sucessResponse, "SUCCESS", "OK")
          .subscribe(result => {
            if (result == true) {
              // OK = true for redirection
              this.messageService.hideModal();
              this.getData(this._getRemoteParameters(), false);
            } else {
              // NO/CANCEL = false
              this.messageService.hideModal();
              this.getData(this._getRemoteParameters(), false);
            }
          });
      }, errorResponse => {
        if (errorResponse !== undefined) {
          this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
        }
      }
      );
  }
}
