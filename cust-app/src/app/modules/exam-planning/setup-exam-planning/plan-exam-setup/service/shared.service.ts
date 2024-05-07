import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public ExamId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ID: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sectionId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectedSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor() {
   }
}
