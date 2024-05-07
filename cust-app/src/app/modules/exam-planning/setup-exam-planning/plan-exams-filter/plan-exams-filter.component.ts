import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, Exam } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-plan-exams-filter',
  templateUrl: './plan-exams-filter.component.html',
  styleUrls: ['./plan-exams-filter.component.scss']
})
export class PlanExamsFilterComponent implements OnInit {
  public searchFilter: any = {};
  public examsFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;
  languageList: any;
  subjectList: any;
  sectionList: any; // unused
  planstatusList: any // unused
  examTypeList: any;

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
    let filters = this.filterService.getFilter("examsFilter");
    if (filters === undefined) {
      this.filterService.addFilter("exams");
      filters = this.filterService.getFilter("examsFilter");
    }
    this.initFormGroup();
    this.resetDropdownFilter();
    this.onexamsFormSubmit();
    this.getExamData();
  }

  getExamData() {
    // Get Exam Type List
    this.restService.ApiEndPointUrlOrKey = Exam.getExamTypeList;
    this.restService.callApi().subscribe(successResponse => {
      this.examTypeList = successResponse.exam_type;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // Get Language List
    this.restService.ApiEndPointUrlOrKey = Exam.getLanguageList;
    this.restService.callApi().subscribe(successResponse => {
      this.languageList = successResponse.languages;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // Get Subject List
    this.restService.ApiEndPointUrlOrKey = Exam.getSubjectList;
    this.restService.callApi().subscribe(successResponse => {
      this.subjectList = successResponse.subjects;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // Get Plan Status List
    this.restService.ApiEndPointUrlOrKey = Exam.getPlanStatusList;
    this.restService.callApi().subscribe(successResponse => {
      this.planstatusList = successResponse.plan_status;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  public initFormGroup() {
    this.examsFormGroup = new FormGroup({
      exam_number: new FormControl('', Validators.minLength(3)),
      name: new FormControl('', Validators.minLength(3)),
      code: new FormControl('', Validators.minLength(3)),
      language_guid: new FormControl(''),
      exam_type_guid: new FormControl(''),
      primary_language_guid: new FormControl(''),
      subject_guid: new FormControl(''),
      sections: new FormControl(''),
      plan_status_guid: new FormControl(''),
      status: new FormControl(''),
    });
    let savedfilter = this.filterService.getFilter("examsFilter");
    if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
      this.examsFormGroup.patchValue(savedfilter.filter_text);
    }
  }

  onexamsFormSubmit() {
    if (this.examsFormGroup.invalid) {
      return;
    } else {

      this.updateBubbleConfig(this.examsFormGroup.value);
      // this.searchFilter.bubbleConfig = this.examsFormGroup.value;
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.exams = this.examsFormGroup.value;
    for (let filter in this.searchFilter.exams) {
      if (this.searchFilter.exams[filter] == null || this.searchFilter.exams[filter] == "") {
        delete this.searchFilter.exams[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("examsFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.exams, 0, "examsFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.exams = this.examsFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.examsFormGroup.reset();
    this.searchFilter.exams = this.examsFormGroup.value;
    this.resetDropdownFilter()
    this.updateBubbleConfig(this.examsFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }
  public resetDropdownFilter() {
    this.examsFormGroup.controls.status.setValue("");
    this.examsFormGroup.controls.plan_status_guid.setValue("");
    this.examsFormGroup.controls.language_guid.setValue("");
    this.examsFormGroup.controls.subject_guid.setValue("");
    this.examsFormGroup.controls.primary_language_guid.setValue("");
    this.examsFormGroup.controls.exam_type_guid.setValue("");
  }
  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.examsFormGroup.reset();
    this.searchFilter.exams = this.examsFormGroup.value;
    this.resetDropdownFilter();
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
        if (filter == "plan_status_guid") {
          let name = this.planstatusList.find((x: any) => x.guid == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "language_guid") {
          let name = this.languageList.find((x: any) => x.guid == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "subject_guid") {
          let name = this.subjectList.find((x: any) => x.code == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "primary_language_guid") {
          let name = this.languageList.find((x: any) => x.guid == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
        if (filter == "exam_type_guid") {
          let name = this.examTypeList.find((x: any) => x.guid == ctrlVal[filter]).name;
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }

}
