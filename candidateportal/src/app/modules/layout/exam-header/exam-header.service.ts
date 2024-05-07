import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GlobalRestService } from 'src/app/exam-services/rest/global-rest.service';
import appSettings from "../../../../exam-assets/config/settings.json"
@Injectable({
  providedIn: 'root'
})
export class ExamHeaderService {
  public instructions: BehaviorSubject<any> = new BehaviorSubject<any>(" ");
  public pageTitle: BehaviorSubject<any> = new BehaviorSubject<any>(" ");
  public timerValue: BehaviorSubject<any> = new BehaviorSubject<any>(" ");
  public mobilePageTitle: BehaviorSubject<any> = new BehaviorSubject<any>(" ");
  public serverDetailsSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public serverHeartbeatSubscription:Subscription;
  
  constructor(
    private restService: GlobalRestService) {}
  public config: any = {
    "show_button": false,
    "navigate_url": "",
    "page_title" : ""
  };
  public examConfig: any = {   
    "institute_name":"",
    "exam_name":"", 
    "class_name":"",    
    "user_name" : "",
    "question_subject_name" : "",
    "duration_name" : "",
    "duration" : "",
  };

  public header_config: BehaviorSubject<any> = new BehaviorSubject<any>(this.config);
  public exam_config: BehaviorSubject<any> = new BehaviorSubject<any>(this.examConfig); 
  public examDetails: BehaviorSubject<any> = new BehaviorSubject<any>(false);


  checkLocalHeartbeat(postParams:any) {
    if(postParams)
    {
      this.restService.ApiEndPointUrlOrKey = appSettings.updateHeartbeatLocal.url;
      this.restService.ApiEndPointMehod = appSettings.updateHeartbeatLocal.method;
      this.restService.HttpPostParams = postParams;
      this.restService.callApi().subscribe(successResponse => {
        console.log(new Date() + ': ' + successResponse);      
      }, errorResponse => {
        console.error(new Date() + ': ' + errorResponse.httpErrorResponse);
      })
    }
    
  }


}