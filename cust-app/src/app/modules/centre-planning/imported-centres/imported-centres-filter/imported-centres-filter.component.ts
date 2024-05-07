import { Component, OnInit,Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from '../../../../services/filter/filter.service';
import { GlobalRestService } from '../../../../services/rest/global-rest.service';
import { HandelError,ImportedCentres } from '../../../../shared/enumrations/app-enum.enumerations';
import { RestMethods } from '../../../../shared/models/app.models';

@Component({
  selector: 'app-imported-centres-filter',
  templateUrl: './imported-centres-filter.component.html',
  styleUrls: ['./imported-centres-filter.component.scss']
})
export class ImportedCentresFilterComponent implements OnInit {

  public importedCentresListFormGroup: FormGroup;
  public searchFilter : any = {};
  public _resetFlag = false
  public _updateFilter = false;
  public statesList: any;
  public citiesList: any;
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

  constructor( private filterService: FilterService, private restService: GlobalRestService) { 
    
  }

  ngOnInit() {
    
    this.getStateList();
    let filters = this.filterService.getFilter("importedCentresFilter");
    if (filters === undefined) {
      this.filterService.addFilter("importedCentres");
    }
    this.initFormGroup();
    this.onimportedCentresListFormSubmit();
  }
  
  public onimportedCentresListFormSubmit(event?) {
    if (this.importedCentresListFormGroup.invalid) {
      return;
    }
    this.updateFilterService();
    this.sendDataToListComponent();
  }
  
  public updateFilterService() {
    let filters = this.filterService.getFilter("importedCentresFilter");
    if(filters){
    this.filterService.updateFilter(this.searchFilter.formData, 0, "importedCentresFilter");
    }
  }
  public sendDataToListComponent() {
 
    this.searchFilter.formData = this.importedCentresListFormGroup.value;
    this.updateBubbleConfig(this.importedCentresListFormGroup.value);
    this.updateEvent.emit(this.searchFilter);
  }

  public resetFilters() {
    this.importedCentresListFormGroup.reset();
    this.updateBubbleConfig(this.importedCentresListFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  public initFormGroup() {
    this.importedCentresListFormGroup = new FormGroup({     
      code: new FormControl('', Validators.minLength(3)),
      import_number:new FormControl('',Validators.minLength(3)),
      name: new FormControl('', Validators.minLength(3)),    
      state_guid: new FormControl(''),
      city_guid:new FormControl(''),
      status: new FormControl('')
    });
    let filter = this.filterService.getFilter("importedCentresFilter");
    if (filter != undefined && Object.keys(filter.filter_text).length > 0) {
      this.importedCentresListFormGroup.patchValue(filter.filter_text);
    }
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup(){
    this.importedCentresListFormGroup.reset();
    this.searchFilter.formData = this.importedCentresListFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal : any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal){
      if(ctrlVal[filter] !== null && ctrlVal[filter] !== ""){
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        if(filter == "status"){
          let name = this.status.find((x: any) => x.value == ctrlVal[filter]).name; 
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }

  getStateList()
  {
      this.restService.ApiEndPointUrlOrKey = ImportedCentres.getStatesList;
      this.restService.callApi().subscribe(successResponse => {
      this.statesList = successResponse.state;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  onStateChange(event:any) {
    
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getCitiesList;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = this.searchParams(event.target.value);
    this.restService.callApi().subscribe(successResponse => {
    this.citiesList = successResponse.city;
     
    }, errorResponse => {
      console.error('ERROR: ', errorResponse);
    });
  }
  public searchParams(stateGuid:any) {
    var parameters = {          
      import_parameters: {
        state_guid:[{"guid":stateGuid}]
      }
    };
    return parameters;
  }

}
