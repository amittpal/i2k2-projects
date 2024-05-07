import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Jobs } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-jobs-filter',
  templateUrl: './jobs-filter.component.html',
  styleUrls: ['./jobs-filter.component.scss']
})
export class JobsFilterComponent implements OnInit {
  public searchFilter: any = {};
  public jobFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;
  public jobTypeList = [];
  public jobStatusList = [];
  public recurring: any = [
    {
      "name": "Yes",
      "value": "1"
    },
    {
      "name": "No",
      "value": "0"
    }
  ];

  public statusList = [
    {
      "name": "Failed",
      "value": "fail"
    },
    {
      "name": "Created",
      "value": "created"
    },
    {
      "name": "Success",
      "value": "success"
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
  constructor(private filterService: FilterService, private restService: GlobalRestService) { }

  ngOnInit() {
    let filters = this.filterService.getFilter("jobFilter");
    if (filters === undefined) {
      this.filterService.addFilter("job");
      filters = this.filterService.getFilter("jobFilter");
    }
    this.initFormGroup();

    this.getJobStatusList();
    this.getJobTypeList();
    this.resetDropdownValue();
    this.onApisFormSubmit();
  }

  public initFormGroup() {
    this.jobFormGroup = new FormGroup({
      id: new FormControl(''),
      job_status_id: new FormControl(''),
      code: new FormControl('', Validators.minLength(3)),
      default_threshold_limit: new FormControl(''),
      recurring: new FormControl(''),
      status: new FormControl(''),
      job_type_id: new FormControl(''),
    });
    let savedfilter = this.filterService.getFilter("jobFilter");
    if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
      this.jobFormGroup.patchValue(savedfilter.filter_text);
    }
  }
  getJobTypeList() {
    this.restService.ApiEndPointUrlOrKey = Jobs.getJobTypeList;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.jobTypeList = sucessResponse.job_types;
      }, errorResponse => {
        if (errorResponse !== undefined) {
          //this.messageService.ok(errorResponse);
        }
      }
      );
  }
  getJobStatusList() {
    this.restService.ApiEndPointUrlOrKey = Jobs.getJobStatusList;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.jobStatusList = sucessResponse.status;
      }, errorResponse => {
        if (errorResponse !== undefined) {
          //this.messageService.ok(errorResponse);
        }
      }
      );
  }
  onApisFormSubmit() {
    if (this.jobFormGroup.invalid) {
      return;
    } else {
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.job = this.jobFormGroup.value;
    for (let filter in this.searchFilter.job) {
      if (this.searchFilter.job[filter] == null || this.searchFilter.job[filter] == "") {
        delete this.searchFilter.job[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("jobFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.job, 0, "jobFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.job = this.jobFormGroup.value;
    this.updateBubbleConfig(this.jobFormGroup.value);
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.jobFormGroup.reset();
    this.resetDropdownValue();
    this.searchFilter.job = this.jobFormGroup.value;
    this.updateBubbleConfig(this.jobFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.jobFormGroup.reset();
    this.resetDropdownValue();
    this.searchFilter.job = this.jobFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        if (filter == "status") {
          let name = this.statusList.find((x: any) => x.value == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "job_status_id") {
          let name = this.jobStatusList.find((x: any) => x.id == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "job_type_id") {
          let name = this.jobTypeList.find((x: any) => x.id == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "recurring") {
          let name = this.recurring.find((x: any) => x.value == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }

  public resetDropdownValue() {
    this.jobFormGroup.controls.status.setValue('');
    this.jobFormGroup.controls.job_status_id.setValue('');
    this.jobFormGroup.controls.job_type_id.setValue('');
    this.jobFormGroup.controls.recurring.setValue('');



  }

}
