import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RestMethods, HandelError } from 'src/app/shared/models/app.models';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import bubbleConfig from "../../../../../../assets/config/bubbleconfig.json";
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service.js';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';

@Component({
  selector: 'app-layout-mapping-add',
  templateUrl: './layout-mapping-add.component.html',
  styleUrls: ['./layout-mapping-add.component.scss']
})
export class LayoutMappingAddComponent implements OnInit {

  @ViewChild('filterOpen', { static: false }) filterOpen: ElementRef<HTMLElement>;

  layoutId: number = 0;
  layouts = [];
  examDetails: any;

  public templateUrl = "";
  public dataSet: any = [];

  success_response: any;
  registrationGuid: any;
  public config = bubbleConfig
  public offset = 0;
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
  public regListGuid: any;
  private searchFilter: any = {
    "layout_filter": {
      "layout": {
        "code": "",
        "name": "",
        "layout_id": "",
        "reg_list_guid": ""
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
    private messageService: MessageService,
    private restService: GlobalRestService,
    private route: ActivatedRoute,
    private router: Router,
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
    this.primaryHeader.pageTitle.next("MAP LAYOUT");
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
      this.getExamDetails(this.registrationGuid);
    }, error => {
      console.error('Error: ', error);
    });

  }

  public filterClick() {
    let el: HTMLElement = this.filterOpen.nativeElement;
    el.click();
  }


  //Getting template details by id
  getExamDetails(registrationGuid) {
    var keyData = [
      {
        "name": "registrationGuid",
        "value": registrationGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getExamDetails;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;    
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        if (sucessResponse.layout_mapping.length) {
          this.regListGuid = sucessResponse.layout_mapping[0].reg_list_guid
          this.examDetails = sucessResponse;
        }
      }, errorResponse => {
        //this.messageService.ok('No data available...');
      });

  }

  onLayoutMapAdd() {
    if (this.layoutId && this.registrationGuid && this.examDetails != undefined) {
      this.restService.ApiEndPointUrlOrKey = AdmitCard.mapAdmitCardLayout;
      this.restService.ApiEndPointMehod = RestMethods.Post;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.ShowLoadingSpinner = true;
      let _httpParams = {
        "layout_id": this.layoutId,
        // "exam_guid": this.examDetails.layout_mapping[0].exam_guid,
        "registration_guid": this.registrationGuid,
        "id": "",
        "exam_guid": "",
        "exam_number": "",
        "code": "",
        "name": "",
        "exam_type": "",
        "status": "",
        "status_guid": "",
        "planning_status": "",
        "planning_status_css": "",
        "exam": "",
        "exam_code": "",
        "exam_name": "",
        "exam_status": "",
      }

      this.restService.HttpPostParams = _httpParams;
      this.restService.callApi().subscribe(sucessResponse => {
        this.success_response = sucessResponse;
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
          if (result == true) { // OK = true for redirection
            this.messageService.hideModal();
            this.router.navigate(['admitcard/list']);
          }
          else { // NO/CANCEL = false
            this.messageService.hideModal();
          }
        });
      }, errorResponse => {
        //Error Message
        this.messageService.alert(errorResponse.httpErrorResponse);
      }, () => {
        //Success Message
        //this.messageService.notify(this.success_response);
      });
    }
  }

  public updateTable(data: any) {
    this.resetLayoutDetails();
    this.searchFilter.layout_filter.layout = data.layout;
    this.config.data[0] = data.bubbleConfig;
    this.searchFilter.layout_filter.paging = this.defaultPagingParams;
    this.getLayoutsList();
    this.resetFilterFlag = false;
    this.updatedFilter = {};
  }

  public updateSearch(removedId: string) {
    this.resetLayoutDetails();
    this.searchFilter.layout_filter.layout[removedId] = "";
    this.searchFilter.layout_filter.paging = this.defaultPagingParams;
    this.getLayoutsList();
    this.updateFilter();

  }
  public resetFilter() {
    this.resetLayoutDetails();
    this.searchFilter.layout_filter.paging = this.defaultPagingParams;
    this.searchFilter.layout_filter.layout = {}
    this.searchFilter.layout_filter.range_filter = {}
    this.getLayoutsList();
    this.resetFilterFlag = true;
  }

  public updateFilter() {
    this.count = Number(this.count) + 1;
    this.updatedFilter = this.searchFilter.layout_filter;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }

  public getLayoutsList(params?: NgxIxcheckTableParams) {
    this.notFound = false;
    this.resetFilterFlag = false;
    if (params != undefined) {
      this.searchFilter.layout_filter.paging.direction = params.direction;
      this.searchFilter.layout_filter.paging.offset = params.offset;
      this.searchFilter.layout_filter.paging.last_offset = params.lastOffset;
      this.searchFilter.layout_filter.paging.last_seen_id_max = params.lastSeenIdMax;
      this.searchFilter.layout_filter.paging.last_seen_id_min = params.lastSeenIdMin;
    }

    this.restService.ApiEndPointUrlOrKey = AdmitCard.getLayoutList;
    this.searchFilter.layout_filter.layout =
    {
      "id": "",
      "layout_id": "",
      "code": "",
      "name": "",
      "layout_type": "",
      "url": "",
      "status": "",
      "registration_guid": "",
      "reg_list_guid": this.regListGuid
    }
    // this.searchFilter.layout_filter.layout.reg_list_guid = this.regListGuid
    this.restService.HttpPostParams = this.searchFilter;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.showProgress = true;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.layouts = sucessResponse.layout;
      }, errorResponse => {
        if (errorResponse !== undefined) {
          //this.notFound = true;
          this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
        }
      });
  }


  selectedNode: any = '';
  layoutName: string = '';
  layoutType: string = '';

  onOptionsSelected(eventid) {
    this.layoutName = eventid.name;
    this.layoutType = eventid.layout_type;
    this.layoutId = eventid.id;

    let layout_code = eventid.code;
    this.templateUrl = "/reports/admitcard/" + layout_code + ".mrt";
  }

  resetLayoutDetails() {
    this.selectedNode = '';
    this.templateUrl = '';
    this.layoutType = '';
    this.layoutName = '';
    this.layoutId = 0;
    this.layouts = [];
  }

  reset() {
    this.selectedNode = '';
    this.templateUrl = '';
    this.layoutType = '';
    this.layoutName = '';
    this.layoutId = 0;
  }

  ngAfterViewInit() {
    this.filterClick();
  }

}
