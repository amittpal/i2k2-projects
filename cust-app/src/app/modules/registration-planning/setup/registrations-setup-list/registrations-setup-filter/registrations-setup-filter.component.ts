import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from '../../../../../services/filter/filter.service';
import { GlobalRestService } from '../../../../../services/rest/global-rest.service';
import { RestMethods } from '../../../../../shared/models/app.models';
import { RegistrationsSetup } from '../../../../../shared/enumrations/app-enum.enumerations'

@Component({
  selector: 'app-registrations-setup-filter',
  templateUrl: './registrations-setup-filter.component.html',
  styleUrls: ['./registrations-setup-filter.component.scss']
})
export class RegistrationsSetupFilterComponent implements OnInit {
  public searchConfig : any = {
    "registrationsSetup" : {
      "exam_type_guid": "",
      "plan_status_guid": ""
    },
    "bubbleConfig": {}
  }
  public registrationsSetupListFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;
  planstatusList: any;
  examTypeList: any;

  @Input() get resetFlter() {
    return this._resetFlag;
  }

  public statusList: any = [
    {
      "name": "Active",
      "value": "1"
    },
    {
      "name": "Inactive",
      "value": "0"
    }
  ]

  set resetFlter(flag: any) {
    this._resetFlag = flag;
    if (this._resetFlag) {
      this.resetFilterGroup();
    }
  }

  @Input() get updatedFilter() {
    return this._updateFilter;
  }

  set updatedFilter(updatedFilter: any) {
    this._updateFilter = updatedFilter;
    this.updateFilterFG();
  }

  @Output() updateEvent = new EventEmitter<any>();
  constructor( private filterService: FilterService, private restService: GlobalRestService) { }

  ngOnInit() {
    let filters = this.filterService.getFilter("registrationsSetupListFilter");
    if (filters === undefined) {
      this.filterService.addFilter("registrationsSetupList");
      filters = this.filterService.getFilter("registrationsSetupListFilter");
    }
    this.initFormGroup();
    this.onRegistrationsSetupListFormSubmit();
    this.getExamData();
  }
  
   getExamData() {     
    // Get Exam Type List
    this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.getExamTypeList;  
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(successResponse => {
      this.examTypeList = successResponse.exam_type;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // Get Plan Status List
    this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.getPlanStatusList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(successResponse => {
      this.planstatusList = successResponse.plan_status;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
  
  public onRegistrationsSetupListFormSubmit(event?) {
    if(!this.registrationsSetupListFormGroup.invalid){
	    this.searchConfig.bubbleConfig = this.registrationsSetupListFormGroup.value;
      this.updateSearchFilter(this.registrationsSetupListFormGroup.value);
      this.sendDataToListComponent();
      this.updateFilterService();
      }
  }
  
  public updateFilterService() {
    let filters = this.filterService.getFilter("registrationsSetupListFilter");
    if(filters){
    this.filterService.updateFilter(this.searchConfig.regsetup, 0, "registrationsSetupListFilter");
    }
  }
  
  public sendDataToListComponent() {
    this.searchConfig.registrationsSetup = this.registrationsSetupListFormGroup.value;
    for (let filter in this.searchConfig.registrationsSetup) {
      if (this.searchConfig.registrationsSetup[filter] == "-1") {
        delete this.searchConfig.registrationsSetup[filter];
      }
    }
    this.updateEvent.emit(this.searchConfig);
  }

  public resetFilters() {
    this.registrationsSetupListFormGroup.reset();
    this.searchConfig.registrationsSetup = this.registrationsSetupListFormGroup.value;
    this.updateSearchFilter(this.registrationsSetupListFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  public initFormGroup() {
    this.registrationsSetupListFormGroup = new FormGroup({     
      id: new FormControl(''),
      exam_number: new FormControl('', Validators.minLength(3)),
      name: new FormControl('', Validators.minLength(3)),
      code: new FormControl('', Validators.minLength(3)),
      exam_type_guid: new FormControl(''),
      plan_status_guid: new FormControl(''),
      status: new FormControl(''),
    });
    let filter = this.filterService.getFilter("registrationsSetupListFilter");
    if (filter != undefined && Object.keys(filter.filter_text).length > 0) {
      this.registrationsSetupListFormGroup.patchValue(filter.filter_text);
    }
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup(){
    this.registrationsSetupListFormGroup.reset();
    this.searchConfig.registrationsSetup = this.registrationsSetupListFormGroup.value;
    this.updateFilterService();
  }

  private updateSearchFilter(ctrlVal: any) {
    this.searchConfig.bubbleConfig = {};    
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {        
        this.searchConfig.bubbleConfig[filter] = ctrlVal[filter];
        if(filter == "status"){
          let name = this.statusList.find((x: any) => x.value == ctrlVal[filter]).name; 
          this.searchConfig.bubbleConfig[filter] = name;
        }
      }
    }
  }

}
