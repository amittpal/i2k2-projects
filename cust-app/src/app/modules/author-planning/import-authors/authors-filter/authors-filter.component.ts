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
  selector: 'app-authors-filter',
  templateUrl: './authors-filter.component.html',
  styleUrls: ['./authors-filter.component.scss']
})
export class AuthorsFilterComponent implements OnInit {
  public authorsListFormGroup: FormGroup;
  public searchFilter : any = {};
  public _resetFlag = false
  public _updateFilter = false;
 public examtypeList=[];


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
   
    let filters = this.filterService.getFilter("authorsFilter");
    if (filters === undefined) {
      this.filterService.addFilter("authors");
    }
    this.initFormGroup();
    this.onauthorsListFormSubmit();
  }
  
  public onauthorsListFormSubmit(event?) {
    if (this.authorsListFormGroup.invalid) {
      return;
    }
    this.updateFilterService();
    this.sendDataToListComponent();
  }
  
  public updateFilterService() {
    let filters = this.filterService.getFilter("authorsFilter");
    if(filters){
    this.filterService.updateFilter(this.searchFilter.formData, 0, "authorsFilter");
    }
  }
  public sendDataToListComponent() {
    this.searchFilter.formData = this.authorsListFormGroup.value;
    this.updateBubbleConfig(this.authorsListFormGroup.value);
    this.updateEvent.emit(this.searchFilter);
  }

  public resetFilters() {
    this.authorsListFormGroup.reset();
    this.updateBubbleConfig(this.authorsListFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  public initFormGroup() {
    this.authorsListFormGroup = new FormGroup({   
      id:new FormControl('',Validators.minLength(3))  ,
      code: new FormControl('', Validators.minLength(3)),
      name: new FormControl('', Validators.minLength(3)),
      address: new FormControl('',Validators.minLength(3)),    
      organization_name:new FormControl('',Validators.minLength(3)),  
      state:new FormControl('',Validators.minLength(3)),
      city:new FormControl('',Validators.minLength(3)),
      rating:new FormControl('',Validators.minLength(3)),
      status: new FormControl('')
    });
    let filter = this.filterService.getFilter("authorsFilter");
    if (filter != undefined && Object.keys(filter.filter_text).length > 0) {
      this.authorsListFormGroup.patchValue(filter.filter_text);
    }
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup(){
    this.authorsListFormGroup.reset();
    this.searchFilter.formData = this.authorsListFormGroup.value;
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
}
