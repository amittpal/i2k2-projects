import { Component, OnInit,Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from '../../../../services/filter/filter.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, ImportedCentres } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-centre-mapping-list-filter',
  templateUrl: './centre-mapping-list-filter.component.html',
  styleUrls: ['./centre-mapping-list-filter.component.scss']
})
export class CentreMappingListFilterComponent implements OnInit {
  public centresMappingListFormGroup: FormGroup;
  public searchFilter : any = {};
  public _resetFlag = false
  public _updateFilter = false;
 public examtypeList=[];
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

  constructor( private filterService: FilterService,private configService: AppsettingsConfService, private router: Router, private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private restService: GlobalRestService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
  }

  

  ngOnInit() {
    this. getExamType();
    this.getPlanStatus();
    let filters = this.filterService.getFilter("centresMappingFilter");
    if (filters === undefined) {
      this.filterService.addFilter("centresMapping");
    }
    this.initFormGroup();
    this.oncentresMappingListFormSubmit();
  }
  
  public oncentresMappingListFormSubmit(event?) {
    if (this.centresMappingListFormGroup.invalid) {
      return;
    }
    this.updateFilterService();
    this.sendDataToListComponent();
  }
  
  public updateFilterService() {
    let filters = this.filterService.getFilter("centresMappingFilter");
    if(filters){
    this.filterService.updateFilter(this.searchFilter.formData, 0, "centresMappingFilter");
    }
  }
  public sendDataToListComponent() {
    this.searchFilter.formData = this.centresMappingListFormGroup.value;
    this.updateBubbleConfig(this.centresMappingListFormGroup.value);
    this.updateEvent.emit(this.searchFilter);
  }

  public resetFilters() {
    this.centresMappingListFormGroup.reset();
    this.updateBubbleConfig(this.centresMappingListFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  public initFormGroup() {
    this.centresMappingListFormGroup = new FormGroup({   
      exam_number:new FormControl('',Validators.minLength(3))  ,
      code: new FormControl('', Validators.minLength(3)),
      name: new FormControl('', Validators.minLength(3)),
      exam_type: new FormControl(''),    
      import_number:new FormControl('',Validators.minLength(3)),  
      imported_centres_code:new FormControl('',Validators.minLength(3)),
      imported_centres_name:new FormControl('',Validators.minLength(3)),
      status: new FormControl(''),
      planning_status:new FormControl('')
    });
    let filter = this.filterService.getFilter("centresMappingFilter");
    if (filter != undefined && Object.keys(filter.filter_text).length > 0) {
      this.centresMappingListFormGroup.patchValue(filter.filter_text);
    }
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup(){
    this.centresMappingListFormGroup.reset();
    this.searchFilter.formData = this.centresMappingListFormGroup.value;
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


  getExamType() {
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getExamTypeList;
    this.restService.callApi().subscribe(successResponse => {
      this.examtypeList = successResponse.exam_type;
    }, errorResponse => {
      this.examtypeList=[];
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  getPlanStatus() {
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getPlanStatus;
    this.restService.callApi().subscribe(successResponse => {
      this.planStatus = successResponse.planning_status;
    }, errorResponse => {
      this.planStatus=[];
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }
}
