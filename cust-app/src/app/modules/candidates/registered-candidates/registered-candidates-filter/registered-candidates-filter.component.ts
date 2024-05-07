import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';
import { Candidates } from './../../../../shared/enumrations/app-enum.enumerations';
import { forkJoin } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-registered-candidates-filter',
  templateUrl: './registered-candidates-filter.component.html',
  styleUrls: ['./registered-candidates-filter.component.scss']
})
export class RegisteredCandidatesFilterComponent implements OnInit {
  @ViewChild('tabset', { static: true }) tabset: TabsetComponent;
  public searchFilter: any = {};
  public registeredCandidateFormGroup: FormGroup;
  public categoryList = [];
  public genderList = [];
  public registrationStatusList = [];
  public PaymentStatusList = [];

  public _resetFlag = false
  public _updateFilter = false;

  examTypeList = [];
  planStatusList = [];

  @Output() updateEvent = new EventEmitter<{ searchFilterData: any }>();
  @Input() get resetFlter() {
    return this._resetFlag;
  }

  public phList: any = [
    {
      value: '1',
      name: 'Yes'
    },
    {
      value: '0',
      name: 'No'
    }
  ];

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
    private filterService: FilterService,
    private restService: GlobalRestService,
    private messageService: MessageService) { }

  ngOnInit() {
    let filters = this.filterService.getFilter("registeredCandidatesFilter");
    if (filters === undefined) {
      this.filterService.addFilter("registeredCandidates");
      filters = this.filterService.getFilter("registeredCandidatesFilter");
    }
    this.getDropdownValues();
    this.initFormGroup();
    this.onRegisteredCandidateFormSubmit();
  }
  public getDropdownValues() {
    this.restService.ApiEndPointUrlOrKey = Candidates.getGenderList;
    const genders = this.restService.callApi()
    // this.restService.ApiEndPointUrlOrKey = Candidates.getPhList;
    this.restService.ApiEndPointUrlOrKey = Candidates.getCategoryList;
    const category = this.restService.callApi();
    this.restService.ApiEndPointUrlOrKey = Candidates.getCandidateRegistrationStatus;
    const regStatus = this.restService.callApi();
    this.restService.ApiEndPointUrlOrKey = Candidates.getPaymentStatus;
    const payStatus = this.restService.callApi();

    forkJoin([genders, category, regStatus, payStatus]).subscribe(successResponse => {
      this.genderList = successResponse[0].gender;
      this.categoryList = successResponse[1].category;
      this.registrationStatusList = successResponse[2].registration_status;
      this.PaymentStatusList = successResponse[3].payment_status;
    })
  }

  public initFormGroup() {
    this.registeredCandidateFormGroup = new FormGroup({
      reg_id: new FormControl('', Validators.minLength(3)),
      name: new FormControl('', Validators.minLength(3)),
      father_name: new FormControl('', Validators.minLength(3)),
      dob: new FormControl(''),
      gender: new FormControl(''),
      ph: new FormControl(''),
      category: new FormControl(''),
      special: new FormControl(''),
      registration_status: new FormControl(''),
      color_percent_min: new FormControl(''),
      color_percent_max: new FormControl(''),
      face_percent_min: new FormControl(''),
      face_percent_max: new FormControl(''),
      payment_status: new FormControl('')
    });
  }

  onRegisteredCandidateFormSubmit() {
    if (this.registeredCandidateFormGroup.invalid) {
      return;
    } else {

      this.updateBubbleConfig(this.registeredCandidateFormGroup.value);
      // this.searchFilter.bubbleConfig = this.registeredCandidateFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.registeredCandidates = this.registeredCandidateFormGroup.value;
    for (let filter in this.searchFilter.registeredCandidates) {
      if (this.searchFilter.registeredCandidates[filter] == null || this.searchFilter.registeredCandidates[filter] == "") {
        delete this.searchFilter.registeredCandidates[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("registeredCandidatesFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.layout, 0, "registeredCandidatesFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.registeredCandidates = this.registeredCandidateFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.registeredCandidateFormGroup.reset();
    this.searchFilter.registeredCandidates = this.registeredCandidateFormGroup.value;
    this.updateBubbleConfig(this.registeredCandidateFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.registeredCandidateFormGroup.reset();
    this.searchFilter.registeredCandidates = this.registeredCandidateFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        if (filter == "gender") {
          let name = this.genderList.find((x: any) => x.gender_guid == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "ph") {
          let name = this.phList.find((x: any) => x.value == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "category") {
          let name = this.categoryList.find((x: any) => x.category_guid == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "registration_status") {
          let name = this.registrationStatusList.find((x: any) => x.status_guid == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "payment_status") {
          let name = this.PaymentStatusList.find((x: any) => x.status_guid == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }
  public checkInput(event) {
    var ctrlCode = (event.ctrlKey) ? event.ctrlKey : event.metaKey; // get key cross-browser
    var charCode = (event.which) ? event.which : event.keyCode; // get key cross-browser

    if ( // Allow: home, end, left, right, down, up
      (charCode >= 35 && charCode <= 40)
      // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
      || (charCode == 65 || charCode == 86 || charCode == 67) && (ctrlCode === true)) {
      return true;
    }
    if (charCode > 31
      && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else {
      return true
    }
  }

}