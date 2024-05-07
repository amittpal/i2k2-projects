import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Centre, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-registrations-list-filter',
  templateUrl: './registrations-list-filter.component.html',
  styleUrls: ['./registrations-list-filter.component.scss']
})




export class RegistrationsListFilterComponent implements OnInit {

  public searchFilter: any = {};
  public layoutFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;  
  examTypeList: any=[];


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

  public importStatusList: any = [
    {
      "name": "Pending",
      "value": "Pending"
    },
    {
      "name": "Imported",
      "value": "Imported"
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
    let filters = this.filterService.getFilter("layoutsMappingFilter");
    if (filters === undefined) {
      this.filterService.addFilter("layout");
      filters = this.filterService.getFilter("layoutsMappingFilter");
    }
    this.initFormGroup();
    this.getExamTypeList();
    this.onLayoutsFormSubmit();
    
  }

 

  public initFormGroup() {
    this.layoutFormGroup = new FormGroup({ 
      exam_number: new FormControl('', Validators.minLength(3)),
      code: new FormControl('', Validators.minLength(3)),      
      name: new FormControl(''),            
      exam_type: new FormControl(''),            
      status: new FormControl(''),
      import_status: new FormControl('')
    });
    let savedfilter = this.filterService.getFilter("layoutsMappingFilter");
    if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
      this.layoutFormGroup.patchValue(savedfilter.filter_text);
    }
  }
  public getExamTypeList()
  {
    this.restService.ApiEndPointUrlOrKey = Centre.getExamTypeList;
    this.restService.HttpPostParams = this.searchFilter;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;    
    this.restService.callApi()
      .subscribe(sucessResponse => {  
       //console.log(sucessResponse);
        this.examTypeList=sucessResponse.exam_type;        
      }, errorResponse => {
        if (errorResponse !== undefined) {          
        }
      });
  }

  onLayoutsFormSubmit() {
    if (this.layoutFormGroup.invalid) {
      return;
    } else {

      //this.updateBubbleConfig(this.layoutFormGroup.value);
      this.searchFilter.bubbleConfig = this.layoutFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.center_registration = this.layoutFormGroup.value;
    for (let filter in this.searchFilter.layout) {
      if (this.searchFilter.center_registration[filter] == null || this.searchFilter.center_registration[filter] == "") {
        delete this.searchFilter.center_registration[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("layoutsMappingFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.center_registration, 0, "layoutsMappingFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.center_registration = this.layoutFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.layoutFormGroup.reset();
    this.searchFilter.center_registration = this.layoutFormGroup.value;
    this.updateBubbleConfig(this.layoutFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.layoutFormGroup.reset();
    this.searchFilter.center_registration = this.layoutFormGroup.value;
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
