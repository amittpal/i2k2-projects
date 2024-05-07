import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registration, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from '../../../../../shared/models/app.models';

@Component({
  selector: 'app-registration-list-filter',
  templateUrl: './registration-list-filter.component.html',
  styleUrls: ['./registration-list-filter.component.scss']
})
export class RegistrationListFilterComponent implements OnInit {

  public searchFilter: any = {};
  public publishFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;  
  examTypeList: any=[];
  planstatusList: any;

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
    let filters = this.filterService.getFilter("publishMappingFilter");
    if (filters === undefined) {
      this.filterService.addFilter("publish");
      filters = this.filterService.getFilter("publishMappingFilter");
    }
    this.initFormGroup();
    this.getExamTypeList();
    this.getPlanStatus();
    this.onpublishFormSubmit();
    
  }

 

  public initFormGroup() {
    this.publishFormGroup = new FormGroup({      
      exam_number: new FormControl('', Validators.minLength(3)),
      exam_code: new FormControl('', Validators.minLength(3)),      
      exam_name: new FormControl(''),            
      exam_type: new FormControl(''),            
      status: new FormControl(''),            
      publish_status: new FormControl('')
    });
    let savedfilter = this.filterService.getFilter("publishMappingFilter");
    if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
      this.publishFormGroup.patchValue(savedfilter.filter_text);
    }
  }
  public getExamTypeList()
  {
    this.restService.ApiEndPointUrlOrKey = Registration.getExamTypeList;
    this.restService.HttpPostParams = this.searchFilter;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;    
    this.restService.callApi()
      .subscribe(sucessResponse => {  
        this.examTypeList=sucessResponse.exam_type;        
      }, errorResponse => {
        if (errorResponse !== undefined) {          
        }
      });
  }

  public getPlanStatus()
  {
      // Get Plan Status List
    this.restService.ApiEndPointUrlOrKey = Registration.getPlanStatusList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(successResponse => {
      this.planstatusList = successResponse.plan_status;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  onpublishFormSubmit() {
    if (this.publishFormGroup.invalid) {
      return;
    } else {

      //this.updateBubbleConfig(this.publishFormGroup.value);
      this.searchFilter.bubbleConfig = this.publishFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.publish = this.publishFormGroup.value;
    for (let filter in this.searchFilter.publish) {
      if (this.searchFilter.publish[filter] == null || this.searchFilter.publish[filter] == "") {
        delete this.searchFilter.publish[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("publishMappingFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.publish, 0, "publishMappingFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.publish = this.publishFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.publishFormGroup.reset();
    this.searchFilter.publish = this.publishFormGroup.value;
    this.updateBubbleConfig(this.publishFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.publishFormGroup.reset();
    this.searchFilter.publish = this.publishFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        if(filter == "status"){
          let name = this.statusList.find((x: any) => x.value == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }

}
