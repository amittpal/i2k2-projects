import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard, HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';


@Component({
  selector: 'app-admit-card-exam-list-filter',
  templateUrl: './admit-card-exam-list-filter.component.html',
  styleUrls: ['./admit-card-exam-list-filter.component.scss']
})
export class AdmitCardExamListFilterComponent implements OnInit {

  public admitCardCentresFormGroup: FormGroup;
  public searchFilter : any = {};
  public _resetFlag = false
  public _updateFilter = false;
  public examTypeList: any=[];
  public planStatus=[];
  @Input() get resetFlter() {
    return this._resetFlag;
  }
  set resetFlter(flag: any) {
    this._resetFlag = flag;
    if(this._resetFlag){
    this.resetFilterGroup();
    }
  }
  public status: any = [
    {
      "name": "Active",
      "value": "1"
    },
    {
      "name": "Inactive",
      "value": "0"
    }
  ]

  @Input() get updatedFilter() {
    return this._updateFilter;
  }
  set updatedFilter(updatedFilter: any) {
    this._updateFilter = updatedFilter;
    this.updateFilterFG();
  }

  @Output() updateEvent = new EventEmitter<any>();

  constructor( private filterService: FilterService, private restService: GlobalRestService) { 
    
  }

  ngOnInit() {
    
    this.getPlanStatus();
    this.getExamTypeList();
    let filters = this.filterService.getFilter("admitCardExamFilter");
    if (filters === undefined) {
      this.filterService.addFilter("admitCardExam");
    }
    this.initFormGroup();
    this.onAdmitCardCentresFormSubmit();
  }
  
  public onAdmitCardCentresFormSubmit(event?) {
    if (this.admitCardCentresFormGroup.invalid) {
      return;
    }
    this.updateFilterService();
    this.sendDataToListComponent();
  }
  
  public updateFilterService() {
    let filters = this.filterService.getFilter("admitCardExamFilter");
    if(filters){
    this.filterService.updateFilter(this.searchFilter.formData, 0, "admitCardExamFilter");
    }
  }
  public sendDataToListComponent() {
 
    this.searchFilter.formData = this.admitCardCentresFormGroup.value;
    this.updateBubbleConfig(this.admitCardCentresFormGroup.value);
    this.updateEvent.emit(this.searchFilter);
  }

  public resetFilters() {
    this.admitCardCentresFormGroup.reset();
    this.updateBubbleConfig(this.admitCardCentresFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  public initFormGroup() {
    this.admitCardCentresFormGroup = new FormGroup({     
      exam_number: new FormControl('', Validators.minLength(3)),            
      exam_code: new FormControl('', Validators.minLength(3)),            
      exam_name: new FormControl('', Validators.minLength(3)),
      exam_type: new FormControl(''),
      status: new FormControl(''),
      plan_status: new FormControl('')    
    });
    let filter = this.filterService.getFilter("admitCardExamFilter");
    if (filter != undefined && Object.keys(filter.filter_text).length > 0) {
      this.admitCardCentresFormGroup.patchValue(filter.filter_text);
    }
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup(){
    this.admitCardCentresFormGroup.reset();
    this.searchFilter.formData = this.admitCardCentresFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal : any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal){
      if(ctrlVal[filter] !== null && ctrlVal[filter] !== ""){
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        if(filter == "status"){
          let name = this.status.find((x: any) => x.value == ctrlVal[filter]).name; 
          this.searchFilter.bubbleConfig[filter] = name;
        }
      }
    }
  }

  getPlanStatus() {
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getPlanStatusList;
    this.restService.callApi().subscribe(successResponse => {
      this.planStatus = successResponse.plan_status;
    }, errorResponse => {
      this.planStatus=[];
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }


  public getExamTypeList()
  {
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getExamTypeList;
    this.restService.HttpPostParams = this.searchFilter;
    this.restService.callApi()
      .subscribe(sucessResponse => { 
        this.examTypeList=sucessResponse.exam_type;        
      }, errorResponse => {
        if (errorResponse !== undefined) {          
        }
      });
  }
}
