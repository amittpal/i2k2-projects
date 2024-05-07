import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-layout-mapping-add-filter',
  templateUrl: './layout-mapping-add-filter.component.html',
  styleUrls: ['./layout-mapping-add-filter.component.scss']
})
export class LayoutMappingAddFilterComponent implements OnInit {

  public searchFilter: any = {};
  public layoutFormGroup: FormGroup;
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
    this.initFormGroup();
  }

  public initFormGroup() {
    this.layoutFormGroup = new FormGroup({
      layout_id: new FormControl(''),
      name: new FormControl('', Validators.minLength(3)),
      code: new FormControl('', Validators.minLength(3)),      
      layout_type: new FormControl('')                
    });
    let savedfilter = this.filterService.getFilter("layoutsMappingAddFilter");
    if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
      this.layoutFormGroup.patchValue(savedfilter.filter_text);
    }
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
    let filters = this.filterService.getFilter("layoutsMappingAddFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.layout, 0, "layoutsMappingAddFilter");
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
        // if(filter == "status"){
        //   let name = this.statusList.find((x: any) => x.value == ctrlVal[filter]).name;
        //   this.searchFilter.bubbleConfig[filter] = name;
        // }
      }
    }
  }

  resetlayoutFormGroup(){
    this.layoutFormGroup.reset({
      layout_id: '',
      name: '',
      code: '',      
      layout_type: ''
    });
  }

}
