import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-layout-mapping-list-filter',
  templateUrl: './layout-mapping-list-filter.component.html',
  styleUrls: ['./layout-mapping-list-filter.component.scss']
})
export class LayoutMappingListFilterComponent implements OnInit {

  public searchFilter: any = {};
  public layoutFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;  
  examTypeList: any=[];
  public planStatus=[];


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
    let filters = this.filterService.getFilter("admitCardLayoutMapFilter");
    if (filters === undefined) {
      this.filterService.addFilter("admitCardLayoutMap");
      filters = this.filterService.getFilter("admitCardLayoutMapFilter");
    }
    this.initFormGroup();
    this.getExamTypeList();
    this.getPlanStatus();
    this.onLayoutsFormSubmit();    
  }

  public initFormGroup() {
    this.layoutFormGroup = new FormGroup({
      exam_number: new FormControl('', Validators.minLength(3)),            
      exam_code: new FormControl('', Validators.minLength(3)),            
      exam_name: new FormControl('', Validators.minLength(3)),
      exam_type: new FormControl(''),
      layout_id: new FormControl('', Validators.minLength(3)),   
      code: new FormControl('', Validators.minLength(3)),    
      name: new FormControl('', Validators.minLength(3)),
      exam_status: new FormControl(''),
      planning_status: new FormControl('')      
    });
    // let savedfilter = this.filterService.getFilter("admitCardLayoutMapFilter");
    // if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
    //   this.layoutFormGroup.patchValue(savedfilter.filter_text);
    // }
  }
  public getExamTypeList()
  {
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getExamTypeList;
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

  onLayoutsFormSubmit() {
    if (this.layoutFormGroup.invalid) {
      return;
    } else {
      this.searchFilter.bubbleConfig = this.layoutFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.layout = this.layoutFormGroup.value;
    for (let filter in this.searchFilter.layout) {
      if (this.searchFilter.layout[filter] == null || this.searchFilter.layout[filter] == "") {
        delete this.searchFilter.layout[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("admitCardLayoutMapFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.layout, 0, "admitCardLayoutMapFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.layout = this.layoutFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.resetlayoutFormGroup();
    this.searchFilter.layout = this.layoutFormGroup.value;
    this.updateBubbleConfig(this.layoutFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.resetlayoutFormGroup();
    this.searchFilter.layout = this.layoutFormGroup.value;
  this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        if(filter == "exam_status"){
          let name = this.statusList.find((x: any) => x.value == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }

  resetlayoutFormGroup(){
    this.layoutFormGroup.reset({
     layout_id: '',      
     name: '',
     code: '',      
     exam_type: '',            
     exam_status: '',
     exam_number: '',            
     exam_code: '',            
     exam_name: '',
     planning_status: ''   
    });
  }

  getPlanStatus() {
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getPlanStatusList;
    this.restService.callApi().subscribe(successResponse => {
      this.planStatus = successResponse.plan_status;
    }, errorResponse => {
      this.planStatus=[];
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

}
