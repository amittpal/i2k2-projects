import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registrations } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-registration-list-filter',
  templateUrl: './registration-list-filter.component.html',
  styleUrls: ['./registration-list-filter.component.scss']
})
export class RegistrationListFilterComponent implements OnInit {

  public searchConfig: any = {
    "registrationListFilter": {
      "guid": "",
      "code": "",
      "name": "",
      "description": "",
      "status": "",
      "registration_setup_details": {},
      "exams": []
    },
    "bubbleConfig": {}
  }
  public registrationsListFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;
  languageList: any;
  subjectList: any;
  sectionList: any;
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
  constructor(private filterService: FilterService, private restService: GlobalRestService) { }

  ngOnInit() {
    let filters = this.filterService.getFilter("registrationsListFilter");
    if (filters === undefined) {
      this.filterService.addFilter("registrationsList");
      filters = this.filterService.getFilter("registrationsListFilter");
    }
    this.initFormGroup();
    this.resetDropdownFilter();
    this.onRegistrationsListFormSubmit();
    this.getExamData();
  }

  getExamData() {
    // Get Exam Type List
    this.restService.ApiEndPointUrlOrKey = Registrations.getExamTypeList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(successResponse => {
      this.examTypeList = successResponse.exam_type;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // Get Plan Status List
    this.restService.ApiEndPointUrlOrKey = Registrations.getRegPlanStatusList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(successResponse => {
      this.planstatusList = successResponse.status;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  public onRegistrationsListFormSubmit(event?) {
    if (!this.registrationsListFormGroup.invalid) {
      this.resetDropdownValue();
      this.searchConfig.bubbleConfig = this.registrationsListFormGroup.value;
      this.updateSearchFilter(this.registrationsListFormGroup.value);
      this.sendDataToListComponent();
      this.updateFilterService();
      // this.sendDataToListComponent();
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("registrationsListFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchConfig.registrations, 0, "registrationsListFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchConfig.registrations = this.registrationsListFormGroup.value;
    for (let filter in this.searchConfig.registrations) {
      if (this.searchConfig.registrations[filter] == "-1") {
        delete this.searchConfig.registrations[filter];
      }
    }
    this.updateEvent.emit(this.searchConfig);
  }

  public resetFilters() {
    this.registrationsListFormGroup.reset();
    this.searchConfig.registrations = this.registrationsListFormGroup.value;
    this.resetDropdownValue();
    this.resetDropdownFilter();
    this.updateSearchFilter(this.registrationsListFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  public initFormGroup() {
    this.registrationsListFormGroup = new FormGroup({
      id: new FormControl(''),
      guid: new FormControl(''),
      name: new FormControl('', Validators.minLength(3)),
      code: new FormControl('', Validators.minLength(3)),
      exam_name: new FormControl('', Validators.minLength(3)),
      exam_type: new FormControl(''),
      exam_code: new FormControl(''),
      plan_status: new FormControl(''),
      status: new FormControl(''),
    });
    this.resetDropdownValue();
    let filter = this.filterService.getFilter("registrationsListFilter");
    if (filter != undefined && Object.keys(filter.filter_text).length > 0) {
      this.registrationsListFormGroup.patchValue(filter.filter_text);
    }
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.registrationsListFormGroup.reset();
    this.searchConfig.registrations = this.registrationsListFormGroup.value;
    this.resetDropdownValue();
    this.resetDropdownFilter();
    this.updateFilterService();
  }

  public resetDropdownValue() {
    // if (this.registrationsListFormGroup.value.status == null) {
    //   this.registrationsListFormGroup.value['status'] = "";
    // }
  }

  private updateSearchFilter(ctrlVal: any) {
    this.searchConfig.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchConfig.bubbleConfig[filter] = ctrlVal[filter];
        if (filter == "status") {
          let name = this.statusList.find((x: any) => x.value == ctrlVal[filter]).name;
          this.searchConfig.bubbleConfig[filter] = name;
        }
        if (filter == "plan_status") {
          let name = this.planstatusList.find((x: any) => x.status_guid == ctrlVal[filter]).status_text;
          this.searchConfig.bubbleConfig[filter] = name;
        }

        if (filter == "exam_type") {
          let name = this.examTypeList.find((x: any) => x.exam_type_guid == ctrlVal[filter]).name;
          this.searchConfig.bubbleConfig[filter] = name;
        }
      }
    }
  }
  public resetDropdownFilter() {
    this.registrationsListFormGroup.controls.status.setValue("");
    this.registrationsListFormGroup.controls.plan_status.setValue("");
    this.registrationsListFormGroup.controls.exam_type.setValue("");
  }
}
