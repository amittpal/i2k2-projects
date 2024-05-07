import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FilterService } from '../../../../../../services/filter/filter.service';
import { GlobalRestService } from '../../../../../../services/rest/global-rest.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-manage-admit-card-view-list-filter',
  templateUrl: './manage-admit-card-view-list-filter.component.html',
  styleUrls: ['./manage-admit-card-view-list-filter.component.scss']
})
export class ManageAdmitCardViewListFilterComponent implements OnInit {

  public searchFilter: any = {};
  public admitCardViewFormGroup: FormGroup;
  public _resetFlag = false
  public _updateFilter = false;

  public admitcard :any;
  public stateMultiSelectDrpDwnSettings = {};  // For state multiselect dropdown settings
  public cityMultiSelectDrpDwnSettings = {};  // For city multiselect dropdown settings
  public states: any = [];
  public cities: any = [];  

  public genderList: any = [
    {
      "name": "Male",
      "value": "Male"
    },
    {
      "name": "Female",
      "value": "Female"
    },
    {
      "name": "Other",
      "value": "Other"
    }
  ];  

  @Output() updateEvent = new EventEmitter<{ searchFilterData: any }>();
  @Input() get resetFlter() {
    return this._resetFlag;
  }

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

  constructor(private filterService: FilterService, private restService: GlobalRestService) { }

  ngOnInit() {
    let filters = this.filterService.getFilter("admitcardcitywiseFilter");
    if (filters === undefined) {
      this.filterService.addFilter("admitcardcitywise");
      filters = this.filterService.getFilter("admitcardcitywiseFilter");
    }
    this.initFormGroup();
    this.setMultiSelectDrpDwnProps(); //setting properties for State & City multi select dropdown
    this.getStates();    
    this.onFormSubmit();
  }

  public initFormGroup() {    
    this.admitCardViewFormGroup = new FormGroup({
      states: new FormControl([]),     
      cities: new FormControl([]),
      registration_number: new FormControl('', Validators.minLength(3)),
      roll_number: new FormControl(""),
      first_name: new FormControl('', Validators.minLength(3)),
      middle_name: new FormControl('', Validators.minLength(3)),
      last_name: new FormControl('', Validators.minLength(3)),
      father_name: new FormControl('', Validators.minLength(3)),
      gender: new FormControl(""),
      email: new FormControl('', Validators.minLength(3)),
      phone_number: new FormControl('', Validators.minLength(9)),
      mobile_number: new FormControl('', Validators.minLength(9)),
      dob: new FormControl("")
    });
    let savedfilter = this.filterService.getFilter("admitcardcitywiseFilter");    
    if (savedfilter != undefined && Object.keys(savedfilter.filter_text).length > 0) {
      this.admitCardViewFormGroup.patchValue({
        states : savedfilter.filter_text.state_guid ? savedfilter.filter_text.state_guid : [],
        cities : savedfilter.filter_text.city_guid ? savedfilter.filter_text.city_guid : [],
        registration_number: savedfilter.filter_text.registration_number ? savedfilter.filter_text.registration_number : '',
        roll_number: savedfilter.filter_text.roll_number ? savedfilter.filter_text.roll_number : '',
        first_name: savedfilter.filter_text.first_name ? savedfilter.filter_text.first_name : '',
        middle_name: savedfilter.filter_text.middle_name ? savedfilter.filter_text.middle_name : '',
        last_name: savedfilter.filter_text.last_name ? savedfilter.filter_text.last_name : '',
        father_name: savedfilter.filter_text.father_name ? savedfilter.filter_text.father_name : '',
        gender: savedfilter.filter_text.gender ? savedfilter.filter_text.gender : '',
        email: savedfilter.filter_text.email ? savedfilter.filter_text.email : '',
        phone_number: savedfilter.filter_text.phone_number ? savedfilter.filter_text.phone_number : '',
        mobile_number: savedfilter.filter_text.mobile_number ? savedfilter.filter_text.mobile_number : '',
        dob: savedfilter.filter_text.dob ? savedfilter.filter_text.dob : ''
      });
      if (savedfilter.filter_text.state_guid.length && savedfilter.filter_text.city_guid.length) {
        this.getCities(savedfilter.filter_text.city_guid);
      } else if (savedfilter.filter_text.state_guid.length) {
        this.getCities();
      }      
    }

    
  }

  getStates() {    
     // Get States
     this.states = [];
     this.restService.ApiEndPointUrlOrKey = AdmitCard.getStates;
     this.restService.callApi().subscribe(successResponse => {
       this.states = successResponse.state;       
     }, errorResponse => {       
     }); 
  }

  getCities(city_guid?) {      
    // Get Cities
    let statesSelected = [];
    this.admitCardViewFormGroup.controls["states"].value.forEach(item => {      
      statesSelected.push({"guid": item.state_guid}); 
    });
    
    let postObj = {
      "state_guid": statesSelected,
      "city_guid": [
        {
          "guid": ""
        }
      ]
    }

    let params =  postObj;
    this.cities = [];
    //this.admitCardViewFormGroup.controls["cities"].setValue([]);
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getCities;        
    this.restService.ShowLoadingSpinner=true;
    this.restService.HttpPostParams=params;      
    this.restService.callApi()
      .subscribe(sucessResponse => { 
        this.cities = sucessResponse.city; 
        this.admitCardViewFormGroup.patchValue({
          cities: city_guid ? city_guid : []
        });
        //this.citiesDrp = sucessResponse.city; 
      },
      errorResponse=>{        
      });
  }

  getPostFormValues(formValue){   
    this.admitcard = {
      "city_guid": "",
      "city_name": "",
      "state_guid": "",
      "state": "",
      "registration_number": formValue.registration_number ? formValue.registration_number : "",
      "roll_number": formValue.roll_number ? formValue.roll_number : "",
      "first_name": formValue.first_name ? formValue.first_name : "",
      "middle_name": formValue.middle_name ? formValue.middle_name : "",
      "last_name": formValue.last_name ? formValue.last_name : "",
      "gender": formValue.gender ? formValue.gender : "",
      "father_name": formValue.father_name ? formValue.father_name : "",
      "email": formValue.email ? formValue.email : "",
      "phone_number": formValue.phone_number ? formValue.phone_number : "",
      "mobile_number": formValue.mobile_number ? formValue.mobile_number : "",
      "dob": formValue.dob ? formValue.dob : ""
    }; 
    
    let statesSelected = [];
    formValue.states.forEach(item => {      
      statesSelected.push({"state_guid": item.state_guid,"name":item.name}); 
    });

    let citiesSelected = [];
    formValue.cities.forEach(item => {
      citiesSelected.push({"city_guid": item.city_guid,"name":item.name}); 
    });

     this.admitcard.city_guid  =  citiesSelected;
     this.admitcard.state_guid =  statesSelected;
    return this.admitcard;
  }


  getPostFormValuesForBubble(formValue){   

    this.admitcard = {
      "city_guid": "",
      "city": "",
      "state_guid": "",
      "state": "",
      "registration_number": formValue.registration_number,
      "roll_number": formValue.roll_number,
      "first_name": formValue.first_name,
      "middle_name": formValue.middle_name,
      "last_name": formValue.last_name,
      "gender": formValue.gender,
      "father_name": formValue.father_name,
      "email": formValue.email,
      "phone_number": formValue.phone_number,
      "mobile_number": formValue.mobile_number,
      "dob": formValue.dob
    }; 
    
    let statesSelected = [];
    formValue.states.forEach(item => {      
      statesSelected.push(item.name) ;
    });

    let citiesSelected = [];
    formValue.cities.forEach(item => {
      citiesSelected.push(item.name);
    });

     this.admitcard.city  =  citiesSelected.join(',') //{ "guid" : formValue.cities };
    
     this.admitcard.state = statesSelected.join(',') //{ "guid" : formValue.states };

    return this.admitcard;
  }

  onFormSubmit() {
    if (this.admitCardViewFormGroup.invalid) {
      return;
    } else {      
      this.searchFilter.bubbleConfig = this.getPostFormValuesForBubble(this.admitCardViewFormGroup.value);      
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.admitcard = this.getPostFormValues(this.admitCardViewFormGroup.value);
    for (let filter in this.searchFilter.admitcard) {
      if (this.searchFilter.admitcard[filter] == null || this.searchFilter.admitcard[filter] == "") {
        //delete this.searchFilter.admitcard[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter("admitcardcitywiseFilter");
    if (filters) {
      this.filterService.updateFilter(this.searchFilter.admitcard, 0, "admitcardcitywiseFilter");
    }
  }

  public sendDataToListComponent() {    
    this.searchFilter.admitcard = this.getPostFormValues(this.admitCardViewFormGroup.value);    
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.admitCardViewFormGroup.reset({
      states: [],
      cities: []
    });
    this.cities = [];
    this.searchFilter.admitcard = this.getPostFormValues(this.admitCardViewFormGroup.value);
    this.updateBubbleConfig(this.getPostFormValues(this.admitCardViewFormGroup.value));
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.admitCardViewFormGroup.reset({
      states: [],
      cities: []
    });
    this.cities = [];
    this.searchFilter.admitcard = this.getPostFormValues(this.admitCardViewFormGroup.value);
  this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (ctrlVal[filter] !== null && ctrlVal[filter] !== "" && ctrlVal[filter] !== "-1") {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
      }
    }
  }
  
  setMultiSelectDrpDwnProps(){
        // setting properties for state multi select dropdown
        this.stateMultiSelectDrpDwnSettings = {
          singleSelection: false,
          idField: 'state_guid',
          textField: 'name',
          enableCheckAll: false,      
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',            
          allowSearchFilter: true,
          limitSelection: -1,
          clearSearchFilter: true,
          maxHeight: 197,
          itemsShowLimit: 1,
          searchPlaceholderText: 'Search State',
          noDataAvailablePlaceholderText: 'No Data Available',
          closeDropDownOnSelection: false,
          showSelectedItemsAtTop: false,
          defaultOpen: false
        };
    
        // setting properties for city multi select dropdown
        this.cityMultiSelectDrpDwnSettings = {
          singleSelection: false,
          idField: 'city_guid',
          textField: 'name',
          enableCheckAll: true,      
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',            
          allowSearchFilter: true,
          limitSelection: -1,
          clearSearchFilter: true,
          maxHeight: 197,
          itemsShowLimit: 1,
          searchPlaceholderText: 'Search City',
          noDataAvailablePlaceholderText: 'No Data Available',
          closeDropDownOnSelection: false,
          showSelectedItemsAtTop: false,
          defaultOpen: false
        };
  }

}
