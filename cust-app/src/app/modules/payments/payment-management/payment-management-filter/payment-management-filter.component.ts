import { forkJoin } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registered } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-payment-management-filter',
  templateUrl: './payment-management-filter.component.html',
  styleUrls: ['./payment-management-filter.component.scss']
})
export class PaymentManagementFilterComponent implements OnInit {
  @ViewChild('tabset', { static: true }) tabset: TabsetComponent;
  public searchFilter: any = {}; 
  public PaymentManagementFormGroup: FormGroup;
  public fieldArray: Array<any> = [];
  public categoryList = [];
  public genderList = [];
  public registrationStatusList = [];
  public PaymentStatusList = [];
  public _resetFlag = false
  public _updateFilter = false;  

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
  ]
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
     private filterService: FilterService,
     private restService: GlobalRestService,
     private messageService: MessageService) { }

  ngOnInit() {    
    let filters = this.filterService.getFilter("PaymentManagementsFilter");
    if (filters === undefined) {
      this.filterService.addFilter("PaymentManagements");
      filters = this.filterService.getFilter("PaymentManagementsFilter");
    }
    this.getDropdownValues();
    this.initFormGroup(); 
    this.onRegisteredCandidateFormSubmit();
  } 

  public getDropdownValues() {
    this.restService.ApiEndPointUrlOrKey = Registered.getGenderList;
    const genders = this.restService.callApi()
    // this.restService.ApiEndPointUrlOrKey = Registered.getPhList;
    this.restService.ApiEndPointUrlOrKey = Registered.getCategoryList;
    const category = this.restService.callApi();
    this.restService.ApiEndPointUrlOrKey = Registered.getCandidateRegistrationStatus;
    const regStatus = this.restService.callApi();    
    this.restService.ApiEndPointUrlOrKey = Registered.getPaymentStatus;
    const payStatus = this.restService.callApi();

    forkJoin([genders, category, regStatus, payStatus]).subscribe(successResponse => {
      this.genderList = successResponse[0].gender;
      this.categoryList = successResponse[1].category;
      this.registrationStatusList = successResponse[2].registration_status;
      this.PaymentStatusList = successResponse[3].payment_status;      
    })
  }

  public initFormGroup() {
    this.PaymentManagementFormGroup = new FormGroup({
        
      name: new FormControl('', Validators.minLength(3)),
      father_name: new FormControl('', Validators.minLength(3)),
      dob: new FormControl(''),
      gender: new FormControl(''),
      ph: new FormControl(''),
      category: new FormControl(''),
      special: new FormControl(''), 
      registration_status: new FormControl(''), 
      //candidate_guid: new FormControl('', Validators.minLength(3)),    
      transaction_id: new FormControl('', Validators.minLength(3)),  
      bank_name: new FormControl('', Validators.minLength(3)),
      from_date: new FormControl(''),
      to_date: new FormControl(''),
      fee_amount_min: new FormControl(''),
      fee_amount_max: new FormControl(''),
      payment_amount_min: new FormControl(''),
      payment_amount_max: new FormControl(''),
      balance_amount_min: new FormControl(''),      
      balance_amount_max: new FormControl(''),        
      payment_status: new FormControl(''),
    });    
  }
 
  onRegisteredCandidateFormSubmit() {
    if (this.PaymentManagementFormGroup.invalid) {
      return;
    } else {

      if(this.validateFilter()) {
        this.updateBubbleConfig(this.PaymentManagementFormGroup.value);    
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();

      }
    }
  }  

  private updateSearchFilter() {
    this.searchFilter.PaymentManagements = this.PaymentManagementFormGroup.value;
    for (let filter in this.searchFilter.candidateDetail) {
      if (this.searchFilter.candidateDetail[filter] == null || this.searchFilter.candidateDetail[filter] == "") {
        delete this.searchFilter.candidateDetail[filter];
      }
    }
    for (let filter in this.searchFilter.PaymentManagements) {
      if (this.searchFilter.PaymentManagements[filter] == null || this.searchFilter.PaymentManagements[filter] == "") {
        delete this.searchFilter.PaymentManagements[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("PaymentManagementsFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.PaymentManagements, 0, "PaymentManagementsFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.PaymentManagements = this.PaymentManagementFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.PaymentManagementFormGroup.reset();
    this.PaymentManagementFormGroup.controls.gender.setValue("");
    this.PaymentManagementFormGroup.controls.ph.setValue("");
    this.PaymentManagementFormGroup.controls.category.setValue("");
    this.PaymentManagementFormGroup.controls.payment_status.setValue("");
    this.searchFilter.PaymentManagements = this.PaymentManagementFormGroup.value;
    this.updateBubbleConfig(this.PaymentManagementFormGroup.value); 
    //this.searchFilter.bubbleConfig = {};
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.PaymentManagementFormGroup.reset();
    this.searchFilter.PaymentManagements = this.PaymentManagementFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        if(filter == "gender"){
          let name = this.genderList.find((x: any) => x.id == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if(filter == "ph"){
          let name = this.phList.find((x: any) => x.value == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if(filter == "category"){
          let name = this.categoryList.find((x: any) => x.id == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if(filter == "registration_status"){
          let name = this.registrationStatusList.find((x: any) => x.status_guid == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if(filter == "payment_status"){
          let name = this.PaymentStatusList.find((x: any) => x.status_guid == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }

   public validateFilter() {
    let retVal = true;
    let errorMsg = '';

    if ((this.PaymentManagementFormGroup.value.balance_amount_min) && (this.PaymentManagementFormGroup.value.balance_amount_max)) {
      if (Number(this.PaymentManagementFormGroup.value.balance_amount_min) > Number(this.PaymentManagementFormGroup.value.balance_amount_max)) {
        errorMsg += 'Maximum Balance must be Greater than Minimum Balancee. \n';
        retVal = false
      }
    }
    if ((this.PaymentManagementFormGroup.value.paid_amount_min) && (this.PaymentManagementFormGroup.value.paid_amount_max)) {
      if (Number(this.PaymentManagementFormGroup.value.paid_amount_min) > Number(this.PaymentManagementFormGroup.value.paid_amount_max)) {
        errorMsg += 'Maximum Paid Amount must be Greater than Minimum Paid Amount. \n';
        retVal = false
      }
    }
    if ((this.PaymentManagementFormGroup.value.fee_amount_min) && (this.PaymentManagementFormGroup.value.fee_amount_max)) {
      if (Number(this.PaymentManagementFormGroup.value.fee_amount_min) > Number(this.PaymentManagementFormGroup.value.fee_amount_max)) {
        errorMsg += 'Maximum Fee Amount must be Greater than Minimum Fee Amount. \n';
        retVal = false
      }
    }
    if (!retVal) {
      this.messageService.ok(errorMsg, 'error');
    }
    return retVal;
  }

}
