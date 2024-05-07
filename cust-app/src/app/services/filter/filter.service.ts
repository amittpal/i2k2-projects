import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private apiTypes: any;
  private appFilters: any;
  private workerId: any;

  constructor( private authService: AuthService) { 
    this.workerId = this.authService.getUserWorkerId();
    //this.apiTypes = restService.apiTypes;
    this.appFilters = JSON.parse(localStorage.getItem("appFilters" + this.workerId));
    if (this.appFilters === undefined || this.appFilters === null) {
      this.appFilters = {
        "customersListFilter": {
          id: 0,
          worker_id: 0,
          page_name: "customersList",
          filter_label: "last",
          filter_text: {}
        },
        "customersFilter": {
          id: 0,
          worker_id: 0,
          page_name: "customers",
          filter_label: "last",
          filter_text: {}
        },
      }}
  }

  setFilter(appFilters : any) {
    localStorage.setItem("appFilters" + this.workerId, JSON.stringify(appFilters));
  }

   // Generic filter

   getFilter(filterName : any) {
    if (this.appFilters[filterName] !== undefined) {
      return this.appFilters[filterName];
    }
  }

  updateFilter(filtersParams : any, index: any, filtername: any) {
    // if (Object.keys(this.appFilters[filtername].filter_text).length > 0) {
    Object.assign(this.appFilters[filtername].filter_text, filtersParams);
    // }
    this.setFilter(this.appFilters);
  }

   // Generic filter changes---new --add---No need to append the this.appFilters in the constructor---
   addFilter(pageName: any) {
    const filterName = pageName + "Filter";
    const obj = {
      id: 0,
      worker_id: 0,
      page_name: pageName,
      filter_label: "last",
      filter_text: {}
    };
    this.appFilters[filterName] = obj;
  }

  public filterResponse: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public customerResponse: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public formGroupValue : BehaviorSubject<any>  = new BehaviorSubject<any>({});
  public stateListValue:BehaviorSubject<any>=new BehaviorSubject<any>({});
  public cityListValue:BehaviorSubject<any>=new BehaviorSubject<any>({});

}
