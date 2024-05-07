import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FilterService } from '../../../services/filter/filter.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, ImportedCentres } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-centres-filter',
  templateUrl: './centres-filter.component.html',
  styleUrls: ['./centres-filter.component.scss']
})
export class CentresFilterComponent implements OnInit {
  public centresListFormGroup: FormGroup;
  public searchFilter : any = {};
  public statesList=[];
  public CentresGuid = [];
  public centreTypeList:any;

  @Output() updateEvent = new EventEmitter<any>();

  constructor( private filterService: FilterService,private configService: AppsettingsConfService, private router: Router, private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private restService: GlobalRestService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
  }

  ngOnInit() {
    
    this. getCentreTypeList();
    this.filterService.cityListValue.subscribe((data) => {
      this.CentresGuid = data;
      // console.log("centre guid>>>>>>>>>>",this.CentresGuid);
    });

    let filters = this.filterService.getFilter("centresFilter");
    if (filters === undefined) {
      this.filterService.addFilter("centres");
    }
    this.initFormGroup();
    //this.resetFilters();
   // this.oncentresFormSubmit();
  }
  
  public oncentresFormSubmit(event?) {

    if (this.centresListFormGroup.invalid) {
      return;
    }
    this.updateFilterService();
    this.sendDataToListComponent();
  }
  
  public updateFilterService() {
    let filters = this.filterService.getFilter("centresFilter");
    if(filters){
    this.filterService.updateFilter(this.searchFilter.formData, 0, "centresFilter");
    }
  }
  public sendDataToListComponent() {
    this.searchFilter.formData = this.centresListFormGroup.value
    this.updateEvent.emit(this.searchFilter);
  }

  public resetFilters() {
    this.centresListFormGroup.reset();
    
  }

  public initFormGroup() {
    this.centresListFormGroup = new FormGroup({ 
      state_guid:new FormControl({value:'',disabled:true}),
      city_guid:new FormControl({value:'',disabled:true}),
      centre_code:new FormControl(''),
      centre_type_guid:new FormControl(''),
      total_min_seat:new FormControl(''),
      total_max_seat:new FormControl(''),
      normal_min_seat:new FormControl(''),
      normal_max_seat:new FormControl(''),
      ph_min_seat:new FormControl(''),
      ph_max_seat:new FormControl(''),
      rating:new FormControl('')
    }); 
  }

  getCentreTypeList() {
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getCentreTypeList;
    this.restService.callApi().subscribe(successResponse => {
    this.centreTypeList = successResponse.centre_types;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse);
    });
  }

}
