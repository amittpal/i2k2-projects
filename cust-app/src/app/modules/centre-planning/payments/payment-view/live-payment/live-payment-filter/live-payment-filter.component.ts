import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registration } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-live-payment-filter',
  templateUrl: './live-payment-filter.component.html',
  styleUrls: ['./live-payment-filter.component.scss']
})
export class LivePaymentFilterComponent implements OnInit {
  public searchFilter: any = {};
  public paymentsTransactionFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;
  examTypeList: any = [];


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
    let filters = this.filterService.getFilter("paymentsTransactionFilter");
    if (filters === undefined) {
      this.filterService.addFilter("payments");
      filters = this.filterService.getFilter("paymentsTransactionFilter");
    }
    this.initFormGroup();
    this.getExamTypeList();
    this.onPaymentsFormSubmit();

  }



  public initFormGroup() {
    this.paymentsTransactionFormGroup = new FormGroup({
      id: new FormControl(''),
      registration_number: new FormControl('', Validators.minLength(3)),
      name: new FormControl('', Validators.minLength(3)),
      mobile_number: new FormControl('', Validators.minLength(3)),
      order_id: new FormControl(''),
      response_msg: new FormControl('', Validators.minLength(3)),
      transaction_id: new FormControl('', Validators.minLength(3)),
      txn_amount: new FormControl(''),
      txn_date: new FormControl(''),
      txn_status: new FormControl(''),
      email: new FormControl(''),
      from_date: new FormControl(''),
      to_date: new FormControl(''),
    });
    let savedfilter = this.filterService.getFilter("paymentsTransactionFilter");
    if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
      this.paymentsTransactionFormGroup.patchValue(savedfilter.filter_text);
    }
  }
  public getExamTypeList() {
    this.restService.ApiEndPointUrlOrKey = Registration.getExamTypeList;
    this.restService.HttpPostParams = this.searchFilter;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.examTypeList = sucessResponse.exam_type;
      }, errorResponse => {
        if (errorResponse !== undefined) {
        }
      });
  }

  onPaymentsFormSubmit() {
    if (this.paymentsTransactionFormGroup.invalid) {
      return;
    } else {

      //this.updateBubbleConfig(this.paymentsTransactionFormGroup.value);
      this.searchFilter.bubbleConfig = this.paymentsTransactionFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.paymentsTransaction = this.paymentsTransactionFormGroup.value;
    for (let filter in this.searchFilter.paymentsTransaction) {
      if (this.searchFilter.paymentsTransaction[filter] == null || this.searchFilter.paymentsTransaction[filter] == "") {
        delete this.searchFilter.paymentsTransaction[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("paymentsTransactionFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.paymentsTransaction, 0, "paymentsTransactionFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.paymentTransaction = this.paymentsTransactionFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.paymentsTransactionFormGroup.reset();
    this.searchFilter.paymentsTransaction = this.paymentsTransactionFormGroup.value;
    this.updateBubbleConfig(this.paymentsTransactionFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.paymentsTransactionFormGroup.reset();
    this.searchFilter.paymentsTransaction = this.paymentsTransactionFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        // if (filter == "status") {
        //   let name = this.statusList.find((x: any) => x.value == ctrlVal[filter]).name;
        //   this.searchFilter.bubbleConfig[filter] = name;
        // }
      }
    }
  }

}
