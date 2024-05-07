import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-layout-list-filter',
  templateUrl: './layout-list-filter.component.html',
  styleUrls: ['./layout-list-filter.component.scss']
})
export class LayoutListFilterComponent implements OnInit {

  public searchFilter: any = {};
  public layoutFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;  
  regListTypes: any=[];


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
    let filters = this.filterService.getFilter("admitCardLayoutFilter");
    if (filters === undefined) {
      this.filterService.addFilter("admitCardLayout");
      filters = this.filterService.getFilter("admitCardLayoutFilter");
    }
    this.initFormGroup();
    this.getLayoutTypeList();
    this.onLayoutsFormSubmit();    
  }

 

  public initFormGroup() {
    this.layoutFormGroup = new FormGroup({
      layout_id: new FormControl('', Validators.minLength(3)),      
      name: new FormControl('', Validators.minLength(3)),
      code: new FormControl('', Validators.minLength(3)),
      layout_type: new FormControl(''),          
      status: new FormControl(''),
    });
    // let savedfilter = this.filterService.getFilter("admitCardLayoutFilter");
    // if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
    //   this.layoutFormGroup.patchValue(savedfilter.filter_text);
    // }
  }

  public getLayoutTypeList()
  {
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getLayoutTypeList;
    this.restService.HttpPostParams = this.searchFilter;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;    
    this.restService.callApi()
      .subscribe(sucessResponse => {  
        this.regListTypes=sucessResponse.reg_list_types;        
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
    let filters = this.filterService.getFilter("admitCardLayoutFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.layout, 0, "admitCardLayoutFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.layout = this.layoutFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.resetLayoutFormGroup();
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
    this.resetLayoutFormGroup();
    this.searchFilter.layout = this.layoutFormGroup.value;
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

  resetLayoutFormGroup(){
    this.layoutFormGroup.reset({
      layout_id: '',      
      name:  '',
      layout_type : '',
      code:  '',
      status:  ''
    });
  }

}
