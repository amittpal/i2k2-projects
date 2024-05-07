import { Component, OnInit } from '@angular/core';
import { AppsettingsConfService } from '../../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from '../../../../../services/rest/global-rest.service';
import { HandelError } from '../../../../../shared/models/app.models';
import { AdmitCard } from '../../../../../shared/enumrations/app-enum.enumerations';
import { PrimaryHeaderService } from '../../../../layout/primary-header/primary-header.service';
import { Params, ActivatedRoute } from '@angular/router';
import { NgxIxcheckTableParams } from "ngx-ixcheck-table-lib";
import bubbleConfig from "../../../../../../assets/config/bubbleconfig.json";

@Component({
  selector: 'app-manage-admit-card-generate',
  templateUrl: './manage-admit-card-generate.component.html',
  styleUrls: ['./manage-admit-card-generate.component.scss']
})
export class ManageAdmitCardGenerateComponent implements OnInit {

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
  public states: any = [];
  public shiftNo: any;
  public totalShift: any;

  public search_config: any = {
    "admitcardfilter": {
      "admitcard": {
        "exam_guid": "",
        "shift_number": "",
        "city_guid": [],
        "city_name": "",
        "state_guid": [],
        "state": "",        
        "registration_number": "",
        "roll_number": "",
        "first_name": "",
        "middle_name": "",
        "last_name": "",
        "gender": "",
        "father_name": "",
        "email": "",
        "mobile_number": "",
        "dob": ""
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

  examGuid="";
  examNumber: string;

  regGuid = "";
  snapshotId = "";

  constructor(
    private route: ActivatedRoute,
    private configService: AppsettingsConfService,
    private restService: GlobalRestService, private primaryHeader: PrimaryHeaderService) {}

  ngOnInit() {
        //setting page title
        this.primaryHeader.pageTitle.next("MANAGE ADMIT CARDS");
        this.route.params.subscribe((params: Params) => {
          this.regGuid = params['registrationId'];
          this.snapshotId = params['snapshotId'];
        if (this.regGuid && this.snapshotId)
         {          
           this.getShiftDetailsList();
         }            
       }, error => {
         console.error('Error: ', error);
       });
  }

  private getShiftDetailsList() {   
    this.notFound = false;
      //call api code here...
      var keyData = [
        {
          "name": "regGuid",
          "value": this.regGuid
        },
        {
          "name": "allocationSnapshotId",
          "value": this.snapshotId
        }        
      ];
      this.restService.ApiEndPointUrlOrKey = AdmitCard.getShiftDetailsList;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {           
            this.items = sucessResponse.exams;
            if (this.items === undefined || this.items.length < 1) {
              this.notFound = true;
            }
        },
        errorResponse=>{
            if (errorResponse !== undefined) {
              this.notFound = true;
            }
        }      
        );  
  }

  ngOnDestroy() {
    this.config.data = [];
    this.config.data.push({});
  }

  public updateTable(data) {    
    this.offset = 0;
    if (data.admitcard.city_guid) {
      let cityData = [];
      data.admitcard.city_guid.forEach(item => {
        cityData.push({ "guid": item["city_guid"] });
      });
      this.search_config.admitcardfilter.admitcard.city_guid = cityData;
    }
    else {
      this.search_config.admitcardfilter.admitcard.city_guid = [];
    }

    if (data.admitcard.state_guid) {
      let stateData = [];
      data.admitcard.state_guid.forEach(item => {
        stateData.push({ "guid": item["state_guid"] });
      });
      this.search_config.admitcardfilter.admitcard.state_guid = stateData;
    }
    else {
      this.search_config.admitcardfilter.admitcard.state_guid = [];
    }

    this.search_config.admitcardfilter.admitcard.registration_number = data.admitcard.registration_number
    this.search_config.admitcardfilter.admitcard.roll_number = data.admitcard.roll_number
    this.search_config.admitcardfilter.admitcard.first_name = data.admitcard.first_name
    this.search_config.admitcardfilter.admitcard.middle_name = data.admitcard.middle_name
    this.search_config.admitcardfilter.admitcard.last_name = data.admitcard.last_name
    this.search_config.admitcardfilter.admitcard.gender = data.admitcard.gender
    this.search_config.admitcardfilter.admitcard.father_name = data.admitcard.father_name
    this.search_config.admitcardfilter.admitcard.email = data.admitcard.email
    this.search_config.admitcardfilter.admitcard.mobile_number = data.admitcard.mobile_number
    this.search_config.admitcardfilter.admitcard.dob = data.admitcard.dob

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

    this.search_config.admitcardfilter.paging = this.defaultPagingParams;
    this.getData(this._getRemoteParameters(), false);
    this.updatedFilter = {};
  }

  private getSearchParams(params: NgxIxcheckTableParams, formSubmit: boolean) {
    this.search_config.admitcardfilter.paging = {
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
    admitCardSearchParams.admitcardfilter.admitcard.exam_guid = this.examGuid;
    admitCardSearchParams.admitcardfilter.admitcard.shift_number = this.shiftNo;
    //call api code here...
      var keyData = [
        {
          "name": "examGuid",
          "value": this.examGuid
        }
      ];
      this.restService.ApiEndPointUrlOrKey = AdmitCard.getShiftDetailsList;
      this.restService.HttpPostParams = admitCardSearchParams;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = true;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {

          this.getStates();
          // if (sucessResponse.shifts[0].exam_date)
          //   this.items = sucessResponse.shifts;
          // this.examNumber = sucessResponse.shifts[0].exam_number;
          
          this.items = sucessResponse.shifts;

          // Getting sum of normal and ph candidates
          // this.normalCandidates = sucessResponse.admitcard.map(x => (Number)(x.allocated_normal_seats)).reduce((a, b) => a + b, 0);;
          // this.phCandidates = sucessResponse.admitcard.map(x => (Number)(x.allocated_ph_seats)).reduce((a, b) => a + b, 0);

          //paging info
          this.itemCount = sucessResponse.paging.total_rows;
          this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          this.lastOffset = sucessResponse.paging.last_offset;
          //this.offset = sucessResponse.paging.offset;
          this.search_config.admitcardfilter.paging = sucessResponse.paging;
          if (this.items === undefined || this.items.length < 1) {
            this.notFound = true;
          }
        }, errorResponse => {
          if (errorResponse !== undefined) {
            this.notFound = true;
          }
        }
        );
  }

  getStates() {
    // Get States
    this.states = [];
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getStates;
    this.restService.callApi().subscribe(successResponse => {
      this.states = successResponse.state;
    }, errorResponse => {
    });
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
    this.updatedFilter = this.search_config.admitcardfilter.admitcard;
    for (let filter in this.updatedFilter) {
      if (this.updatedFilter[filter] != "") {
        delete this.updatedFilter[filter];
      }
    }
  }

  public resetFilter() {
    this.search_config.admitcardfilter.admitcard = {
      exam_guid: "",
      shift_number: "",
      city_guid: [],
      city_name: "",
      state_guid: [],
      state: ""
    }
    this.search_config.admitcardfilter.paging = this.defaultPagingParams;
    this.getData(this._getRemoteParameters(), false);
    this.resetFilterFlag = true;
  }

  public updateSearch(removedId: string) {
    this.search_config.admitcardfilter.admitcard[removedId] = "";
    this.search_config.admitcardfilter.paging = this.defaultPagingParams;
    this.getData(this._getRemoteParameters(), false);
    this.count = Number(this.count) + 1;
  }

}
