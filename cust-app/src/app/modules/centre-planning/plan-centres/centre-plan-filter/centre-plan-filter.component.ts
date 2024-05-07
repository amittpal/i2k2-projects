import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FilterService } from "src/app/services/filter/filter.service";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Centre,
  Exam,
} from "src/app/shared/enumrations/app-enum.enumerations";
@Component({
  selector: "app-centre-plan-filter",
  templateUrl: "./centre-plan-filter.component.html",
  styleUrls: ["./centre-plan-filter.component.scss"],
})
export class CentrePlanFilterComponent implements OnInit {
  public searchFilter: any = {};
  public registrationsFormGroup: FormGroup;
  public _resetFlag = false;
  public _updateFilter = false;
  planstatusList: any; // unused
  examTypeList: any;

  @Output() updateEvent = new EventEmitter<{ searchFilterData: any }>();
  @Input() get resetFlter() {
    return this._resetFlag;
  }

  public statusList: any = [
    {
      name: "Active",
      value: "1",
    },
    {
      name: "Inactive",
      value: "0",
    },
  ];

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
  ) {}

  ngOnInit() {
    let filters = this.filterService.getFilter("registrationFilter");
    if (filters === undefined) {
      this.filterService.addFilter("registration");
      filters = this.filterService.getFilter("registrationFilter");
    }
    this.initFormGroup();
    this.onRegistrationsFormSubmit();
    this.getExamData();
    this.getExamTypeData();
  }

  getExamData() {
    // Get Plan Status List

    this.restService.ApiEndPointUrlOrKey = Centre.getCentrePlanStatus;
    this.restService.callApi().subscribe(
      (successResponse) => {
        this.planstatusList = successResponse.planning_status;
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );
  }
  getExamTypeData() {
    // Get Exam Type List

    this.restService.ApiEndPointUrlOrKey = Exam.getExamTypeList;
    this.restService.callApi().subscribe(
      (successResponse) => {
      this.examTypeList = successResponse.exam_type;
      },
      (errorResponse) => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );
  }


  public initFormGroup() {
    this.registrationsFormGroup = new FormGroup({
      reg_code: new FormControl("", Validators.minLength(3)),
      reg_name: new FormControl("", Validators.minLength(3)),
      code: new FormControl("", Validators.minLength(3)),
      name: new FormControl("", Validators.minLength(3)),
      exam_type: new FormControl("", Validators.minLength(3)),
      planning_status: new FormControl("", Validators.minLength(3)),
      status: new FormControl(""),
    });
  
  }

  onRegistrationsFormSubmit() {
    if (this.registrationsFormGroup.invalid) {
      return;
    } else {
      //this.updateBubbleConfig(this.examsFormGroup.value);
      this.searchFilter.bubbleConfig = this.registrationsFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.registration = this.registrationsFormGroup.value;
    for (let filter in this.searchFilter.registration) {
      if (
        this.searchFilter.registration[filter] == null ||
        this.searchFilter.registration[filter] == ""
      ) {
        delete this.searchFilter.registration[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("registrationFilter");
    if (filters) {
      this.filterService.updateFilter(
        this.searchFilter.registration,
        0,
        "registrationFilter"
      );
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.registration = this.registrationsFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.registrationsFormGroup.reset();
    this.searchFilter.registration = this.registrationsFormGroup.value;
    this.updateBubbleConfig(this.registrationsFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.registrationsFormGroup.reset();
    this.searchFilter.registration = this.registrationsFormGroup.value;
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
        if (filter == "status") {
          let name = this.statusList.find(
            (x: any) => x.value == ctrlVal[filter]
          ).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }
}
