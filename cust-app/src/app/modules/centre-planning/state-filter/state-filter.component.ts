import { Component, OnInit,Output, EventEmitter } from '@angular/core';
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
  selector: 'app-state-filter',
  templateUrl: './state-filter.component.html',
  styleUrls: ['./state-filter.component.scss']
})
export class StateFilterComponent implements OnInit {
  public statesListFormGroup: FormGroup;
  public searchFilter : any = {};
  public statesList=[];

  @Output() updateEvent = new EventEmitter<any>();

  constructor( private filterService: FilterService,private configService: AppsettingsConfService, private router: Router, private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private restService: GlobalRestService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
  }

  ngOnInit() {
    this.getStatesList();
    let filters = this.filterService.getFilter("statesFilter");
    if (filters === undefined) {
      this.filterService.addFilter("states");
    }
    this.initFormGroup();
    this.onStatesFormSubmit();
  }
  
  public onStatesFormSubmit(event?) {

    if (this.statesListFormGroup.invalid) {
      return;
    }
    this.updateFilterService();
    this.sendDataToListComponent();
  }
  
  public updateFilterService() {
    let filters = this.filterService.getFilter("statesFilter");
    if(filters){
    this.filterService.updateFilter(this.searchFilter.formData, 0, "statesFilter");
    }
  }
  public sendDataToListComponent() {
    this.searchFilter.formData = this.statesListFormGroup.value
    this.updateEvent.emit(this.searchFilter);
  }

  public resetFilters() {
    this.statesListFormGroup.reset();
    
  }

  public initFormGroup() {
    this.statesListFormGroup = new FormGroup({ 
      state_guid:new FormControl('') 
    }); 
  }

  getStatesList() {
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getStatesList;
    this.restService.callApi().subscribe(successResponse => {
    this.statesList = successResponse.state;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse);
    });
  }

}