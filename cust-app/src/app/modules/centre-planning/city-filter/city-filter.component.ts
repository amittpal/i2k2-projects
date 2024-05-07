import { Component,OnInit,Output, EventEmitter, Input  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from '../../../services/filter/filter.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError, ImportedCentres } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-city-filter',
  templateUrl: './city-filter.component.html',
  styleUrls: ['./city-filter.component.scss']
})
export class CityFilterComponent implements OnInit {
  public citysListFormGroup: FormGroup;
  public searchFilter : any = {};
 public citysList=[];
 statesGuid=[];

  @Output() updateEvent = new EventEmitter<any>();

  constructor( private filterService: FilterService,private configService: AppsettingsConfService, private router: Router, private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private restService: GlobalRestService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
  }

  ngOnInit() {

    this.filterService.stateListValue.subscribe((data) => {
     this.statesGuid=data;  
    })

    // console.log( ">>>>",this.statesGuid);
    this.getCitiesList();
    let filters = this.filterService.getFilter("citysFilter");
    if (filters === undefined) {
      this.filterService.addFilter("citys");
    }
    this.initFormGroup();
    // this.resetFilters();
    this.onCitysFormSubmit();
  }
  
  public onCitysFormSubmit(event?) {

    if (this.citysListFormGroup.invalid) {
      return;
    }
    this.updateFilterService();
    this.sendDataToListComponent();
  }
  
  public updateFilterService() {
    let filters = this.filterService.getFilter("citysFilter");
    if(filters){
    this.filterService.updateFilter(this.searchFilter.formData, 0, "citysFilter");
    }
  }
  public sendDataToListComponent() {
    this.searchFilter.formData = this.citysListFormGroup.value
    this.updateEvent.emit(this.searchFilter);
  }

  public resetFilters() {
    this.citysListFormGroup.reset();
    
  }

  public initFormGroup() {
      this.citysListFormGroup = new FormGroup({ 
      city_guid:new FormControl('') ,
      state_guid:new FormControl({value:'',disabled:true})
     
    });
   
  }

  getCitiesList() {
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getCitiesList;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = this.searchParams();
    this.restService.callApi().subscribe(successResponse => {
    this.citysList = successResponse.city;
     
   
    }, errorResponse => {
      console.error('ERROR: ', errorResponse);
    });
  }
  public searchParams() {
    var parameters = {          
      import_parameters: {
        state_guid:this.statesGuid.map(s=>({"guid":s.guid}))
      }
    };
    return parameters;
  }

}