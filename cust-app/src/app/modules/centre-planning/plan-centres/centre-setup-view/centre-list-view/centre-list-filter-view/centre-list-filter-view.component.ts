import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FilterService } from "src/app/services/filter/filter.service";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Centre,
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from '../../../../../../shared/models/app.models';

@Component({
  selector: 'app-centre-list-filter-view',
  templateUrl: './centre-list-filter-view.component.html',
  styleUrls: ['./centre-list-filter-view.component.scss']
})
export class CentreListFilterViewComponent implements OnInit {

  public searchFilter: any = {};
  public centreEditViewFormGroup: FormGroup;
  public _resetFlag = false;
  public _updateFilter = false;
  public statesList: any;
  public citiesList: any;

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
    private filterService: FilterService,
    private restService: GlobalRestService
  ) { }

  ngOnInit() {
    this.getStateList();
    let filters = this.filterService.getFilter("centreEditViewFilter");
    if (filters === undefined) {
      this.filterService.addFilter("centreEditView");
      filters = this.filterService.getFilter("centreEditViewFilter");
    }
    this.initFormGroup();
    this.centreListFormSubmit();
  }

  public initFormGroup() {
    this.centreEditViewFormGroup = new FormGroup({
      state: new FormControl(""),
      city: new FormControl(""),
      code: new FormControl(""),
      name: new FormControl("", Validators.minLength(3)),
      min_ph_seats: new FormControl(""),
      min_normal_seats: new FormControl(""),
      max_ph_seats: new FormControl(""),
      max_normal_seats: new FormControl("")
    });
  }

  getStateList() {
    this.restService.ApiEndPointUrlOrKey = Centre.getStatesList;
    this.restService.callApi().subscribe(successResponse => {
      this.statesList = successResponse.state;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  onStateChange(event: any) {

    this.restService.ApiEndPointUrlOrKey = Centre.getCitiesList;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = this.searchParams(event.target.value);
    this.restService.callApi().subscribe(successResponse => {
      this.citiesList = successResponse.city;

    }, errorResponse => {
      console.error('ERROR: ', errorResponse);
    });
  }

  public searchParams(stateGuid: any) {
    var parameters = {
      import_parameters: {
        state_guid: [{ "guid": stateGuid }]
      }
    };
    return parameters;
  }

  centreListFormSubmit() {
    if (this.centreEditViewFormGroup.invalid) {
      return;
    } else {
      //this.updateBubbleConfig(this.centreEditViewFormGroup.value);
      this.searchFilter.bubbleConfig = this.centreEditViewFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.centres = this.centreEditViewFormGroup.value;
    for (let filter in this.searchFilter.centres) {
      if (
        this.searchFilter.centres[filter] == null ||
        this.searchFilter.centres[filter] == ""
      ) {
        delete this.searchFilter.centres[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("centreEditViewFilter");
    if (filters) {
      this.filterService.updateFilter(
        this.searchFilter.centres,
        0,
        "centreEditViewFilter"
      );
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.centres = this.centreEditViewFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.formReset();
    this.citiesList = [];
    this.searchFilter.centres = this.centreEditViewFormGroup.value;
    this.updateBubbleConfig(this.centreEditViewFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.formReset();
    this.searchFilter.centres = this.centreEditViewFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (
        ctrlVal[filter] !== null &&
        ctrlVal[filter] !== "" &&
        ctrlVal[filter] !== "-1"
      ) {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
      }
    }
  }

  formReset() {
    this.centreEditViewFormGroup.reset({
      state: "",
      city: "",
      code: "",
      name: "",
      min_ph_seats: "",
      min_normal_seats: "",
      max_ph_seats: "",
      max_normal_seats: ""
    });

  }

}
