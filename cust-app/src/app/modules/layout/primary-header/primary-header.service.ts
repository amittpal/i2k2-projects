import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PrimaryHeaderService {
  public pageTitle: BehaviorSubject<any> = new BehaviorSubject<any>(" ");
  constructor() {}
  public config: any = {
    "show_button": false,
    "navigate_url": "",
    "page_title" : ""
  };
  public header_config: BehaviorSubject<any> = new BehaviorSubject<any>(this.config);
}