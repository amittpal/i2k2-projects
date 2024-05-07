import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Registration, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-layout-sample-data-filter',
  templateUrl: './layout-sample-data-filter.component.html',
  styleUrls: ['./layout-sample-data-filter.component.scss']
})
export class LayoutSampleDataFilterComponent implements OnInit {

  
  public searchFilter: any = {};
  public sampleDataFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;  
  examTypeList: any=[];


  @Output() updateEvent = new EventEmitter<{ searchFilterData: any }>();
  @Input() get resetFlter() {
    return this._resetFlag;
  }


 

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
    let filters = this.filterService.getFilter("layoutsSampleDataFilter");
    if (filters === undefined) {
      this.filterService.addFilter("layout");
      filters = this.filterService.getFilter("layoutsSampleDataFilter");
    }
    this.initFormGroup();
    this.getExamTypeList();
    this.onSampleDataFormSubmit();
    
  }

 

  public initFormGroup() {
    this.sampleDataFormGroup = new FormGroup({
      candidate: new FormControl('', Validators.minLength(3)),
      first_name: new FormControl('', Validators.minLength(3)),      
      address: new FormControl('')               
    });
    let savedfilter = this.filterService.getFilter("layoutsSampleDataFilter");
    if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
      this.sampleDataFormGroup.patchValue(savedfilter.filter_text);
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

  onSampleDataFormSubmit() {
    if (this.sampleDataFormGroup.invalid) {
      return;
    } else {

      //this.updateBubbleConfig(this.sampleDataFormGroup.value);
      this.searchFilter.bubbleConfig = this.sampleDataFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.layout = this.sampleDataFormGroup.value;
    for (let filter in this.searchFilter.layout) {
      if (this.searchFilter.layout[filter] == null || this.searchFilter.layout[filter] == "") {
        delete this.searchFilter.layout[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("layoutsSampleDataFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.layout, 0, "layoutsSampleDataFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.layout = this.sampleDataFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.sampleDataFormGroup.reset();
    this.searchFilter.layout = this.sampleDataFormGroup.value;
    this.updateBubbleConfig(this.sampleDataFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.sampleDataFormGroup.reset();
    this.searchFilter.layout = this.sampleDataFormGroup.value;
  this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        if(filter == "status"){
          //let name = this.statusList.find((x: any) => x.value == ctrlVal[filter]).name;
          //this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }

}
