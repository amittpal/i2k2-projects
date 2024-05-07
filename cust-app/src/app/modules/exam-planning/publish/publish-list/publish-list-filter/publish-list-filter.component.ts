import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Exam } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';
import { RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-publish-list-filter',
  templateUrl: './publish-list-filter.component.html',
  styleUrls: ['./publish-list-filter.component.scss']
})
export class PublishListFilterComponent implements OnInit {
  public searchConfig : any = {
    "questionRequirements" : {
      "language_guid": "",
      "exam_type_guid": "",
      "primary_language_guid": "",
      "subject_guid": "",
      "plan_status_guid": ""
    },
    "bubbleConfig": {}
  }
  public questionRequirementsListFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;
  languageList: any;
  subjectList: any;
  sectionList: any;
  planstatusList: any;
  examTypeList: any;

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

  @Output() updateEvent = new EventEmitter<any>();
  constructor( private filterService: FilterService, private restService: GlobalRestService) { }

  ngOnInit() {
    let filters = this.filterService.getFilter("questionRequirementsListFilter");
    if (filters === undefined) {
      this.filterService.addFilter("questionRequirementsList");
      filters = this.filterService.getFilter("questionRequirementsListFilter");
    }
    this.initFormGroup();
    this.resetDropdownFilter();
    this.onQuestionRequirementsListFormSubmit();
    this.getExamData();
  }

   getExamData() {
    // Get Exam Type List
    this.restService.ApiEndPointUrlOrKey = Exam.getExamTypeList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(successResponse => {
      this.examTypeList = successResponse.exam_type;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // Get Language List
    this.restService.ApiEndPointUrlOrKey = Exam.getLanguageList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(successResponse => {
      this.languageList = successResponse.languages;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // Get Subject List
    this.restService.ApiEndPointUrlOrKey = Exam.getSubjectList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(successResponse => {
      this.subjectList = successResponse.subjects;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

    // Get Plan Status List
    this.restService.ApiEndPointUrlOrKey = Exam.getPlanStatusList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi().subscribe(successResponse => {
      this.planstatusList = successResponse.plan_status;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  public onQuestionRequirementsListFormSubmit(event?) {
    if(!this.questionRequirementsListFormGroup.invalid){
      this.resetDropdownValue();
	    this.searchConfig.bubbleConfig = this.questionRequirementsListFormGroup.value;
      this.updateSearchFilter(this.questionRequirementsListFormGroup.value);
      this.sendDataToListComponent();
      this.updateFilterService();
	// this.sendDataToListComponent();
      }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("questionRequirementsListFilter");
    if(filters){
    this.filterService.updateFilter(this.searchConfig.questionRequirements, 0, "questionRequirementsListFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchConfig.questionRequirements = this.questionRequirementsListFormGroup.value;
    for (let filter in this.searchConfig.questionRequirements) {
      if (this.searchConfig.questionRequirements[filter] == "-1") {
        delete this.searchConfig.questionRequirements[filter];
      }
    }
    this.updateEvent.emit(this.searchConfig);
  }

  public resetFilters() {
    this.questionRequirementsListFormGroup.reset();
    this.searchConfig.questionRequirements = this.questionRequirementsListFormGroup.value;
    this.resetDropdownValue();
    this.resetDropdownFilter();
    this.updateSearchFilter(this.questionRequirementsListFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  public initFormGroup() {
    this.questionRequirementsListFormGroup = new FormGroup({
      id: new FormControl(''),
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
    this.resetDropdownValue();
    let filter = this.filterService.getFilter("questionRequirementsListFilter");
    if (filter != undefined && Object.keys(filter.filter_text).length > 0) {
      this.questionRequirementsListFormGroup.patchValue(filter.filter_text);
    }
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup(){
    this.questionRequirementsListFormGroup.reset();
    this.searchConfig.questionRequirements = this.questionRequirementsListFormGroup.value;
    this.resetDropdownValue();
    this.resetDropdownFilter();
    this.updateFilterService();
  }

  public resetDropdownValue() {
    // if (this.questionRequirementsListFormGroup.value.status == null) {
    //   this.questionRequirementsListFormGroup.value['status'] = "";
    // }
  }

  private updateSearchFilter(ctrlVal: any) {
    this.searchConfig.bubbleConfig = {};
for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchConfig.bubbleConfig[filter] = ctrlVal[filter];
        if (filter == "status") {
          let name = this.statusList.find((x: any) => x.value == ctrlVal[filter]).name;
          this.searchConfig.bubbleConfig[filter] = name;
        }
        if (filter == "plan_status_guid") {
          let name = this.planstatusList.find((x: any) => x.guid == ctrlVal[filter]).name;
          this.searchConfig.bubbleConfig[filter] = name;
        }
        if (filter == "language_guid") {
          let name = this.languageList.find((x: any) => x.guid == ctrlVal[filter]).name;
          this.searchConfig.bubbleConfig[filter] = name;
        }
        if (filter == "subject_guid") {
          let name = this.subjectList.find((x: any) => x.code == ctrlVal[filter]).name;
          this.searchConfig.bubbleConfig[filter] = name;
        }
        if (filter == "primary_language_guid") {
          let name = this.languageList.find((x: any) => x.guid == ctrlVal[filter]).name;
          this.searchConfig.bubbleConfig[filter] = name;
        }
        if (filter == "exam_type_guid") {
          let name = this.examTypeList.find((x: any) => x.guid == ctrlVal[filter]).name;
          this.searchConfig.bubbleConfig[filter] = name;
        }
      }
    }
  }
  public resetDropdownFilter() {
    this.questionRequirementsListFormGroup.controls.status.setValue("");
    this.questionRequirementsListFormGroup.controls.plan_status_guid.setValue("");
    this.questionRequirementsListFormGroup.controls.language_guid.setValue("");
    this.questionRequirementsListFormGroup.controls.subject_guid.setValue("");
    this.questionRequirementsListFormGroup.controls.primary_language_guid.setValue("");
    this.questionRequirementsListFormGroup.controls.exam_type_guid.setValue("");
  }
}