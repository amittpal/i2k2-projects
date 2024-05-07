import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from '../../../../services/filter/filter.service';
import { GlobalRestService } from '../../../../services/rest/global-rest.service';
import { Author, Exam, AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-setup-filter',
  templateUrl: './setup-filter.component.html',
  styleUrls: ['./setup-filter.component.scss']
})
export class SetupFilterComponent implements OnInit {

  public searchFilter: any = {};
  public examsFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;
  languageList: any;
  gradeList: any;
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
    
    let filters = this.filterService.getFilter("admitCardSetupFilter");
    if (filters === undefined) {
      this.filterService.addFilter("admitCardSetup");
      filters = this.filterService.getFilter("admitCardSetupFilter");
    }
    this.initFormGroup();
    this.getExamData(); // get exam type list
    this.getPlanStatus(); // get plan status list
    this.onexamsFormSubmit(); // on submit
    
  }

  getExamData() {    
     // Get Exam Type List
     this.restService.ApiEndPointUrlOrKey = AdmitCard.getExamTypeList;
     this.restService.callApi().subscribe(successResponse => {
       this.examTypeList = successResponse.exam_type;
     }, errorResponse => {
       console.error('ERROR: ', errorResponse.message[0]);
     });   
  }

  // Get Plan Status List
  getPlanStatus() {
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getPlanStatusList;
    this.restService.callApi().subscribe(successResponse => {
      this.planstatusList = successResponse.plan_status;
    }, errorResponse => {
      this.planstatusList=[];
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  public initFormGroup() {
    this.examsFormGroup = new FormGroup({
      examNumber: new FormControl('', Validators.minLength(3)),     
      code: new FormControl('', Validators.minLength(3)),   
      examName: new FormControl('', Validators.minLength(3)),   
      examType: new FormControl(''),         
      planStatusGuid: new FormControl(''),
      status: new FormControl(''),
    });
    // let savedfilter = this.filterService.getFilter("admitCardSetupFilter");
    // if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
    //   this.examsFormGroup.patchValue(savedfilter.filter_text);
    // }
  }

  onexamsFormSubmit() {
    if (this.examsFormGroup.invalid) {
      return;
    } else {

      //this.updateBubbleConfig(this.examsFormGroup.value);
      this.searchFilter.bubbleConfig = this.examsFormGroup.value;
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
    let filters = this.filterService.getFilter("admitCardSetupFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.exams, 0, "admitCardSetupFilter");
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.exams = this.examsFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.resetFormGroup();    
    this.searchFilter.exams = this.examsFormGroup.value;
    this.updateBubbleConfig(this.examsFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.resetFormGroup();
    this.searchFilter.exams = this.examsFormGroup.value;
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

  resetFormGroup(){
    this.examsFormGroup.reset({
      examNumber: '',     
      code: '',   
      examName: '',   
      examType: '',         
      planStatusGuid: '',
      status: '',
    });
  }

}
