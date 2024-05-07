import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalRestService } from './../../../../services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { Router } from '@angular/router';
import { AppsettingsConfService } from './../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { FilterService } from './../../../../services/filter/filter.service';
import { HandelError } from './../../../../shared/models/app.models';
import { Candidates } from './../../../../shared/enumrations/app-enum.enumerations';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-payments-filter',
  templateUrl: './payments-filter.component.html',
  styleUrls: ['./payments-filter.component.scss']
})
export class PaymentsFilterComponent implements OnInit {
  public paymentsListFormGroup: FormGroup;
  public searchFilter : any = {};
  public _resetFlag = false
  public _updateFilter = false;
  public planStatusList = [];

  @Input() get resetFlter() {
    return this._resetFlag;
  }
  set resetFlter(flag: any) {
    this._resetFlag = flag;
    if(this._resetFlag){
    this.resetFilterGroup();
    }
  }
  public status: any = [
    {
      "name": "Active",
      "value": "1"
    },
    {
      "name": "Inactive",
      "value": "0"
    }
  ]

  
  @Input() get updatedFilter() {
    return this._updateFilter;
  }
  set updatedFilter(updatedFilter: any) {
    this._updateFilter = updatedFilter;
    this.updateFilterFG();
  }

  @Output() updateEvent = new EventEmitter<any>();

  constructor( private filterService: FilterService,private configService: AppsettingsConfService, private router: Router,
    private messageService: MessageService, private restService: GlobalRestService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
  }

  

  ngOnInit() {    
    let filters = this.filterService.getFilter("paymentsListFilter");
    if (filters === undefined) {
      this.filterService.addFilter("paymentsList");
    }
    this.initFormGroup();
    this.getPlanStatus();
    // this.onCandidateRegistrationsFormSubmit();
  }
  
  public onCandidateRegistrationsFormSubmit(event?) {
    if (this.paymentsListFormGroup.invalid) {
      return;
    }
    this.updateFilterService();
    this.sendDataToListComponent();
  }
  
  public updateFilterService() {
    let filters = this.filterService.getFilter("paymentsListFilter");
    if(filters){
    this.filterService.updateFilter(this.searchFilter.formData, 0, "paymentsListFilter");
    }
  }
  public sendDataToListComponent() {
    this.searchFilter.formData = this.paymentsListFormGroup.value;
    this.updateBubbleConfig(this.paymentsListFormGroup.value);
    this.updateEvent.emit(this.searchFilter);
  }

  public resetFilters() {
    this.paymentsListFormGroup.reset();
    this.paymentsListFormGroup.controls.planning_status_guid.setValue("");
    this.paymentsListFormGroup.controls.status.setValue("");
    this.updateBubbleConfig(this.paymentsListFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  public initFormGroup() {
    this.paymentsListFormGroup = new FormGroup({   
      code:new FormControl('',Validators.minLength(3))  ,
      name: new FormControl('', Validators.minLength(3)),
      planning_status_guid: new FormControl(''),
      status: new FormControl('')
    });
    let filter = this.filterService.getFilter("paymentsListFilter");
    if (filter != undefined && Object.keys(filter.filter_text).length > 0) {
      this.paymentsListFormGroup.patchValue(filter.filter_text);
    }
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup(){
    this.paymentsListFormGroup.reset();
    this.searchFilter.formData = this.paymentsListFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal : any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal){
      if(ctrlVal[filter] !== null && ctrlVal[filter] !== ""){
        if(filter == "planning_status_guid"){
          let name = this.planStatusList.find((x: any) => x.status_guid == ctrlVal[filter]).planning_status; 
          this.searchFilter.bubbleConfig[filter] = name;
        }
         if(filter == "status"){
          let name = this.status.find((x: any) => x.value == ctrlVal[filter]).name; 
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }


  getPlanStatus() {
    this.restService.ApiEndPointUrlOrKey = Candidates.getPlanStatus;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi().subscribe(successResponse => {
      this.planStatusList = successResponse.registration_plan_status;
      this.onCandidateRegistrationsFormSubmit();
    }, errorResponse => {
      this.planStatusList = [];
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
}
