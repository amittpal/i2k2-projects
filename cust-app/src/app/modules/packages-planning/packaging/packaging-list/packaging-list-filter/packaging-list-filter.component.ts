import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from '../../../../../services/filter/filter.service';
import { GlobalRestService } from '../../../../../services/rest/global-rest.service';
import { Packaging } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-packaging-list-filter',
  templateUrl: './packaging-list-filter.component.html',
  styleUrls: ['./packaging-list-filter.component.scss']
})
export class PackagingListFilterComponent implements OnInit {

  public searchFilter: any = {};
  public examsFormGroup: FormGroup;
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
    
    let filters = this.filterService.getFilter("packagingExamListFilter");
    if (filters === undefined) {
      this.filterService.addFilter("packagingExamList");
      filters = this.filterService.getFilter("packagingExamListFilter");
    }
    this.initFormGroup();
    this.getExamData(); // get exam type list
    this.getPlanStatus(); // get plan status list
    this.onexamsFormSubmit(); // on submit
  }

  getExamData() {    
     // Get Exam Type List
     this.restService.ApiEndPointUrlOrKey = Packaging.getPackageExamType;
     this.restService.callApi().subscribe(successResponse => {
       this.examTypeList = successResponse.exam_type;
     }, errorResponse => {      
       console.error('ERROR: ',errorResponse.httpErrorResponse.data[0].attributes.message[0]);
     });       
  }

  getPlanStatus() {
    this.restService.ApiEndPointUrlOrKey = Packaging.getPackagePlanStatusList;
    this.restService.callApi().subscribe(successResponse => {
      this.planstatusList = successResponse.plan_status;
    }, errorResponse => {
      this.planstatusList=[];
      console.error('ERROR: ',errorResponse.httpErrorResponse.data[0].attributes.message[0]);
    });
  }

  public initFormGroup() {
    this.examsFormGroup = new FormGroup({
      exam_number: new FormControl('', Validators.minLength(3)),     
      exam_code: new FormControl('', Validators.minLength(3)),   
      exam_name: new FormControl('', Validators.minLength(3)),   
      exam_type: new FormControl(''),         
      plan_status: new FormControl(''),
      status: new FormControl(''),
    });
    let savedfilter = this.filterService.getFilter("packagingExamListFilter");
    if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
      this.examsFormGroup.patchValue(savedfilter.filter_text);
    }
  }

  onexamsFormSubmit() {
    if (this.examsFormGroup.invalid) {
      return;
    } else {

      //this.updateBubbleConfig(this.examsFormGroup.value);
      this.searchFilter.bubbleConfig = this.examsFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.exam_list = this.examsFormGroup.value;
    for (let filter in this.searchFilter.exam_list) {
      if (this.searchFilter.exam_list[filter] == null || this.searchFilter.exam_list[filter] == "") {
        delete this.searchFilter.exam_list[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("packagingExamListFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.exam_list, 0, "packagingExamListFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.exam_list = this.examsFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.resetFormGroup();    
    this.searchFilter.exam_list = this.examsFormGroup.value;
    this.updateBubbleConfig(this.examsFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.resetFormGroup();
    this.searchFilter.exam_list = this.examsFormGroup.value;
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

  resetFormGroup(){
    this.examsFormGroup.reset({
      exam_number: '',     
      exam_code: '',   
      exam_name: '',   
      exam_type: '',         
      plan_status: '',
      status: '',
    });
  }

}
