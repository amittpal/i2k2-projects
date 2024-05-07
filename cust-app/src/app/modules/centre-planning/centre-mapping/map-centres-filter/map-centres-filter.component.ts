import { Component, OnInit,Output, EventEmitter, Input} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from '../../../../services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-map-centres-filter',
  templateUrl: './map-centres-filter.component.html',
  styleUrls: ['./map-centres-filter.component.scss']
})
export class MapCentresFilterComponent implements OnInit {
  public searchFilter: any = {};
  public mapCentreListFormGroup: FormGroup;
  public _resetFlag = false
  public centreTypeList: any;
  public _updateFilter = false;


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
  constructor(private filterService: FilterService, private restService: GlobalRestService, private messageService: MessageService) {
 
  }

  ngOnInit() {
    this.initFormGroup();
  }
  public initFormGroup() {
    this.mapCentreListFormGroup = new FormGroup({
      import_number: new FormControl('', Validators.minLength(3)),
      code: new FormControl('', Validators.minLength(3)),
      name: new FormControl('', Validators.minLength(3)),
     
    });
    let savedfilter = this.filterService.getFilter("mapCentresFilter");
    if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
      this.mapCentreListFormGroup.patchValue(savedfilter.filter_text);
    }
  }
  onMapCentreListFormSubmit() {
    if (this.mapCentreListFormGroup.invalid) {
      return;
    } else {
      this.validateFilter(this.mapCentreListFormGroup.controls);
    }
  }

  private validateFilter(formControls: any) {
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
  }

  private updateSearchFilter() {
    this.searchFilter.building = this.mapCentreListFormGroup.value;
    for (let filter in this.searchFilter.building) {
      if (this.searchFilter.building[filter] == null || this.searchFilter.building[filter] == "") {
        delete this.searchFilter.building[filter];
      }
    }
  }
  public updateFilterService() {
    let filters = this.filterService.getFilter("mapCentresFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.building, 0,"mapCentresFilter");
    }
  }
  public sendDataToListComponent() {
      this.searchFilter.formData = this.mapCentreListFormGroup.value;
      this.updateBubbleConfig(this.mapCentreListFormGroup.value);
      this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.mapCentreListFormGroup.reset();
    this.searchFilter.building = this.mapCentreListFormGroup.value;
    this.updateBubbleConfig(this.mapCentreListFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.mapCentreListFormGroup.reset();
    this.searchFilter.building = this.mapCentreListFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {

    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
      }
    }
  }
}
