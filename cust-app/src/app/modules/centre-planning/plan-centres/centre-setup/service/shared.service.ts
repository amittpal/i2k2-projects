import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public importId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public tabsId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public changeTab: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public examGuid: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public cityPriorityNumber: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public registrationStatus: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor() {
  }
}
