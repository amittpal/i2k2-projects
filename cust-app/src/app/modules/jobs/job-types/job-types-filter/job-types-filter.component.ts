import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';

@Component({
  selector: 'app-job-types-filter',
  templateUrl: './job-types-filter.component.html',
  styleUrls: ['./job-types-filter.component.scss']
})
export class JobTypesFilterComponent implements OnInit {
  public searchFilter: any = {};
  public jobTypesFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;
  public status: any = [
    {
      "name": "Active",
      "value": "1"
    },
    {
      "name": "Inactive",
      "value": "0"
    }
  ];
  public recurringList = [
    {
      "name": "Yes",
      "value": "1"
    },
    {
      "name": "No",
      "value": "0"
    }
  ];
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
  constructor(private filterService: FilterService) { }

  ngOnInit() {
    let filters = this.filterService.getFilter("jobTypesFilter");
    if (filters === undefined) {
      this.filterService.addFilter("jobTypes");
      filters = this.filterService.getFilter("jobTypesFilter");
    }
    this.initFormGroup();
    this.resetDropdownValue();
    this.onApisFormSubmit();
  }

  public initFormGroup() {
    this.jobTypesFormGroup = new FormGroup({
      id: new FormControl(''),
      code: new FormControl('', Validators.minLength(3)),
      name: new FormControl('', Validators.minLength(3)),
      description: new FormControl('', Validators.minLength(3)),
      default_timeout_minutes: new FormControl(''),
      recurring_interval_hour: new FormControl(''),
      create_on_fall: new FormControl(''),
      action: new FormControl(''),
      recurring: new FormControl(''),
      status: new FormControl('')
    });
    let savedfilter = this.filterService.getFilter("jobTypesFilter");
    if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
      this.jobTypesFormGroup.patchValue(savedfilter.filter_text);
    }
  }

  onApisFormSubmit() {
    if (this.jobTypesFormGroup.invalid) {
      return;
    } else {
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.jobTypes = this.jobTypesFormGroup.value;
    for (let filter in this.searchFilter.jobTypes) {
      if (this.searchFilter.jobTypes[filter] == null || this.searchFilter.jobTypes[filter] == "") {
        delete this.searchFilter.jobTypes[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("jobTypesFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.jobTypes, 0, "jobTypesFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.jobTypes = this.jobTypesFormGroup.value;
    this.updateBubbleConfig(this.jobTypesFormGroup.value);
    if (this.searchFilter.jobTypes["status"] == "") {
      delete this.searchFilter.jobTypes["status"];
    }
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.jobTypesFormGroup.reset();
    this.resetDropdownValue();
    this.searchFilter.jobTypes = this.jobTypesFormGroup.value;
    this.updateBubbleConfig(this.jobTypesFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.jobTypesFormGroup.reset();
    this.resetDropdownValue();
    this.searchFilter.jobTypes = this.jobTypesFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        if (filter == "status") {
          let name = this.status.find((x: any) => x.value == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "recurring") {
          let name = this.recurringList.find((x: any) => x.value == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }

  public resetDropdownValue() {
    this.jobTypesFormGroup.controls.status.setValue("");
    this.jobTypesFormGroup.controls.recurring.setValue("");
  }

}
