import { Component, OnInit,Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from '../../../../services/filter/filter.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, ImportAuthors } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-subjects-filter',
  templateUrl: './subjects-filter.component.html',
  styleUrls: ['./subjects-filter.component.scss']
})
export class SubjectsFilterComponent implements OnInit {
  public subjectsListFormGroup: FormGroup;
  public searchFilter : any = {};
  public _resetFlag = false
  public _updateFilter = false;
 public subjectsList=[];


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
    this.getSubjects();
    let filters = this.filterService.getFilter("subjectsFilter");
    if (filters === undefined) {
      this.filterService.addFilter("subjects");
    }
    this.initFormGroup();
    this.subjectsListFormGroup.controls.subject_guid.patchValue('');

    this.onsubjectsFormSubmit();
  }
  
  public onsubjectsFormSubmit(event?) {
    if (this.subjectsListFormGroup.invalid) {
      return;
    }
    this.updateFilterService();
    this.sendDataToListComponent();
  }
  
  public updateFilterService() {
    let filters = this.filterService.getFilter("subjectsFilter");
    if(filters){
    this.filterService.updateFilter(this.searchFilter.formData, 0, "subjectsFilter");
    }
  }
  public sendDataToListComponent() {
    this.searchFilter.formData = this.subjectsListFormGroup.value;
    this.updateBubbleConfig(this.subjectsListFormGroup.value);
    this.updateEvent.emit(this.searchFilter);
  }

  public resetFilters() {
    this.subjectsListFormGroup.reset();
    this.subjectsListFormGroup.controls.subject_guid.patchValue('');
    this.updateBubbleConfig(this.subjectsListFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  public initFormGroup() {
    this.subjectsListFormGroup = new FormGroup({ 
      subject_guid:new FormControl('',Validators.minLength(3)) 
     
    });
    let filter = this.filterService.getFilter("subjectsFilter");
    if (filter != undefined && Object.keys(filter.filter_text).length > 0) {
      this.subjectsListFormGroup.patchValue(filter.filter_text);
    }
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup(){
    this.subjectsListFormGroup.reset();
    this.subjectsListFormGroup.controls.subject_guid.patchValue('');
    this.searchFilter.formData = this.subjectsListFormGroup.value;
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

  public getSubjects()
  {
    let keyData = [{
      name: "subjectGuid",
      value: "0"
    }]
      this.restService.ApiEndPointUrlOrKey = ImportAuthors.getSubjects;
      this.restService.callApi(keyData).subscribe(successResponse => {
      this.subjectsList = successResponse.subjects;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });

  }

}
6
