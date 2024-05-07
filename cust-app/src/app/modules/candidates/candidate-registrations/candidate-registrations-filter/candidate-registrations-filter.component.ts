import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { Router } from '@angular/router';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HandelError, Candidates } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-candidate-registrations-filter',
  templateUrl: './candidate-registrations-filter.component.html',
  styleUrls: ['./candidate-registrations-filter.component.scss']
})
export class CandidateRegistrationsFilterComponent implements OnInit {
public candidateRegistrationsFormGroup: FormGroup;
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
    let filters = this.filterService.getFilter("candidatesMappingFilter");
    if (filters === undefined) {
      this.filterService.addFilter("candidatesMapping");
    }
    this.initFormGroup();
    this.getPlanStatus();
    // this.onCandidateRegistrationsFormSubmit();
  }
  
  public onCandidateRegistrationsFormSubmit(event?) {
    if (this.candidateRegistrationsFormGroup.invalid) {
      return;
    }
    this.updateFilterService();
    this.sendDataToListComponent();
  }
  
  public updateFilterService() {
    let filters = this.filterService.getFilter("candidatesMappingFilter");
    if(filters){
    this.filterService.updateFilter(this.searchFilter.formData, 0, "candidatesMappingFilter");
    }
  }
  public sendDataToListComponent() {
    this.searchFilter.formData = this.candidateRegistrationsFormGroup.value;
    this.updateBubbleConfig(this.candidateRegistrationsFormGroup.value);
    this.updateEvent.emit(this.searchFilter);
  }

  public resetFilters() {
    this.candidateRegistrationsFormGroup.reset();
    this.candidateRegistrationsFormGroup.controls.planning_status_guid.setValue("");
    this.candidateRegistrationsFormGroup.controls.status.setValue("");
    this.updateBubbleConfig(this.candidateRegistrationsFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  public initFormGroup() {
    this.candidateRegistrationsFormGroup = new FormGroup({   
      code:new FormControl('',Validators.minLength(3))  ,
      name: new FormControl('', Validators.minLength(3)),
      planning_status_guid: new FormControl(''),
      status: new FormControl('')
    });
    let filter = this.filterService.getFilter("candidatesMappingFilter");
    if (filter != undefined && Object.keys(filter.filter_text).length > 0) {
      this.candidateRegistrationsFormGroup.patchValue(filter.filter_text);
    }
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup(){
    this.candidateRegistrationsFormGroup.reset();
    this.searchFilter.formData = this.candidateRegistrationsFormGroup.value;
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
