import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-mock-test-exam-list-filter',
  templateUrl: './mock-test-exam-list-filter.component.html',
  styleUrls: ['./mock-test-exam-list-filter.component.scss']
})
export class MockTestExamListFilterComponent implements OnInit {

  public searchFilter: any = {};
  public mockTestFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;  
  
  gradeTypeList=[];
  planStatusList=[];

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
     private filterService: FilterService,
     private restService: GlobalRestService) { }

  ngOnInit() {    
    let filters = this.filterService.getFilter("mockTestFilter");
    if (filters === undefined) {
      this.filterService.addFilter("mockTest");
      filters = this.filterService.getFilter("mockTestFilter");
    }
    this.initFormGroup(); 
    this.getGradeTypeList();
    this.getPlanStatusList();   
    this.onMockTestFormSubmit();

  }

 

  public initFormGroup() {
    this.mockTestFormGroup = new FormGroup({
      exam_number: new FormControl('', Validators.minLength(1)),      
      code: new FormControl('', Validators.minLength(3)),
      grade_type_guid: new FormControl(''),      
      plan_status_guid: new FormControl(''),            
      status: new FormControl(''),
    });
    // let savedfilter = this.filterService.getFilter("mockTestFilter");
    // if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
    //   this.mockTestFormGroup.patchValue(savedfilter.filter_text);
    // }
  }
  public getGradeTypeList()
  {
    this.restService.ApiEndPointUrlOrKey = Exam.getGradeList
    //this.restService.HttpPostParams = this.searchFilter;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;    
    this.restService.callApi()
      .subscribe(sucessResponse => {        
        this.gradeTypeList=sucessResponse.sections;              
      }, errorResponse => {
        if (errorResponse !== undefined) {          
        }
      });
  }

  public getPlanStatusList()
  {
    this.restService.ApiEndPointUrlOrKey = Exam.getPlanStatusList;
    //this.restService.HttpPostParams = this.searchFilter;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;    
    this.restService.callApi()
      .subscribe(sucessResponse => {        
        this.planStatusList=sucessResponse.plan_status;        
        
      }, errorResponse => {
        if (errorResponse !== undefined) {          
        }
      });
  }

  onMockTestFormSubmit() {    
    if (this.mockTestFormGroup.invalid) {
      return;
    } else {

      //this.updateBubbleConfig(this.layoutFormGroup.value);
      this.searchFilter.bubbleConfig = this.mockTestFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.mockTest = this.mockTestFormGroup.value;
    for (let filter in this.searchFilter.mockTest) {
      if (this.searchFilter.mockTest[filter] == null || this.searchFilter.mockTest[filter] == "") {
        delete this.searchFilter.mockTest[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("mockTestFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.layout, 0, "mockTestFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.mockTest = this.mockTestFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.mockTestFormGroup.reset();
    this.searchFilter.mockTest = this.mockTestFormGroup.value;
    this.updateBubbleConfig(this.mockTestFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.mockTestFormGroup.reset();
    this.searchFilter.mockTest = this.mockTestFormGroup.value;
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
