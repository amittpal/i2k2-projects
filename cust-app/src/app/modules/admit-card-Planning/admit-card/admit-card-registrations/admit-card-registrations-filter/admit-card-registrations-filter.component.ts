import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-admit-card-registrations-filter',
  templateUrl: './admit-card-registrations-filter.component.html',
  styleUrls: ['./admit-card-registrations-filter.component.scss']
})
export class AdmitCardRegistrationsFilterComponent implements OnInit {
  public searchFilter: any = {
    // "guid": "",
    // "code": "",
    // "name": "",
    // "exam_code": "",
    // "exam_name": "",
    // "exam_type": "",
    // "plan_status": "",
    // "description": "",
    // "status": "",
    // "registrations_setup_details": {
    //   "id": "",
    //   "exam_guid": "",
    //   "special_category_wise_fee": "",
    //   "category_wise_fee": "",
    //   "gender_wise_fee": "",
    //   "required_payment": "",
    //   "registration_start_date": "",
    //   "registration_end_date": "",
    //   "fee_end_date": "",
    //   "url": "",
    //   "status": ""
    // },
    // "exams": [
    //   {
    //     "exam_guid": "",
    //     "code": "",
    //     "name": ""
    //   }
    // ]
  };
  public admitCardRegListFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;
  public planstatusList: any = [];
  public examTypeList: any = [];


  @Output() updateEvent = new EventEmitter<{ searchFilterData: any }>();
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

  constructor(
    private filterService: FilterService, private restService: GlobalRestService
  ) { }

  ngOnInit() {

    let filters = this.filterService.getFilter("admitCardRegListFilter");
    if (filters === undefined) {
      this.filterService.addFilter("admitCardRegistrationList");
      filters = this.filterService.getFilter("admitCardRegistrationListFilter");
    }
    this.initFormGroup();
    this.getExamData(); // get exam type list
    this.getPlanStatus(); // get plan status list
    this.onadmitCardListFormSubmit(); // on submit
  }

  getExamData() {
    // Get Exam Type List
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getRegTypeList;
    this.restService.callApi().subscribe(successResponse => {
      this.examTypeList = successResponse.reg_list_types;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  getPlanStatus() {
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getPlanStatusList;
    this.restService.callApi().subscribe(successResponse => {
      this.planstatusList = successResponse.plan_status;
    }, errorResponse => {
      this.planstatusList = [];
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  public initFormGroup() {
    this.admitCardRegListFormGroup = new FormGroup({

      code: new FormControl('', Validators.minLength(3)),
      name: new FormControl('', Validators.minLength(3)),
      examType: new FormControl(''),
      planStatusGuid: new FormControl(''),
      status: new FormControl(''),
      "guid": new FormControl(''),
      "exam_code": new FormControl(''),
      "exam_name": new FormControl(''),
      "exam_type": new FormControl(''),
      "plan_status": new FormControl(''),
      "description": new FormControl(''),
      "registrations_setup_details": new FormControl(''),
      "exams": new FormControl(''),
    });
    // let savedfilter = this.filterService.getFilter("admitCardRegistrationListFilter");
    // if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
    //   this.admitCardRegListFormGroup.patchValue(savedfilter.filter_text);
    // }
  }

  onadmitCardListFormSubmit() {
    if (this.admitCardRegListFormGroup.invalid) {
      return;
    } else {

      //this.updateBubbleConfig(this.admitCardRegListFormGroup.value);
      this.searchFilter.bubbleConfig = this.admitCardRegListFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter = this.admitCardRegListFormGroup.value;
    for (let filter in this.searchFilter.admitcard) {
      if (this.searchFilter.admitcard[filter] == null || this.searchFilter.admitcard[filter] == "") {
        delete this.searchFilter.admitcard[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("admitCardRegistrationListFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.admitcard, 0, "admitCardRegistrationListFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.admitcard = this.admitCardRegListFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.resetFormGroup();
    this.searchFilter.admitcard = this.admitCardRegListFormGroup.value;
    this.updateBubbleConfig(this.admitCardRegListFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.resetFormGroup();
    this.searchFilter.admitcard = this.admitCardRegListFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        if (filter == "status") {
          let name = this.statusList.find((x: any) => x.value == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }

  resetFormGroup() {
    this.admitCardRegListFormGroup.reset({
      examNumber: '',
      code: '',
      examName: '',
      examType: '',
      planStatusGuid: '',
      status: '',
    });
  }

}
