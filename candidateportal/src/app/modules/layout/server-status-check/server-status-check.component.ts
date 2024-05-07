import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { interval, Subscription } from 'rxjs';
import { GlobalRestService } from 'src/app/exam-services/rest/global-rest.service';
import { ExamHeaderService } from '../exam-header/exam-header.service';
import appSettings from "../../../../exam-assets/config/settings.json"
import { ServerStatusDetails } from 'src/app/exam-shared/classes/server-status-details.class';
@Component({
  selector: 'app-server-status-check',
  templateUrl: './server-status-check.component.html',
  styleUrls: ['./server-status-check.component.scss']
})
export class ServerStatusCheckComponent implements OnInit {

  private appSettingsJson: any;
  statusCssClass = "offline";
  serverStatusText = '';
  isServerOnline = false;
  isUserLoggedIn = false;
  serverCheckTimeInterval = 30; // 30 seconds
  serverOfflineTime = 0; //in seconds
  serverOfflineTimeLimit = 300; // 5 minutes
  serverStatusSubscription: Subscription;
  offlineTimeSubscription: Subscription;
  checkStatusFirstTime = true;
  isOfflineTimeExceeded = false;
  examServeDetails: ServerStatusDetails = new ServerStatusDetails();
  @Output() checkServerStatus = new EventEmitter();
  
  
  
  constructor(
    private restService: GlobalRestService,
    private messageService: MessageService,
    private examHeaderService: ExamHeaderService) { }

  ngOnInit(): void {

    this.appSettingsJson = appSettings;
    this.setInitialData();
    this.getServerStatus();
    this.checkServerStatusInInterval();
  }

  setInitialData() {    
    //checking if user logged in
    if (localStorage.getItem("accessToken")) {
      this.isUserLoggedIn = true;
    }
    else {
      this.isUserLoggedIn = false
    }
    //setting server offline time duration    
    if (localStorage.getItem("offlineTimeDuration")) {
      const offlineTimeLimit= parseInt(localStorage.getItem("offlineTimeDuration"));
      if(offlineTimeLimit > 0)
      {
        this.serverOfflineTimeLimit= offlineTimeLimit;
      }      
    }

  }

  getServerStatus() {
    this.restService.ApiEndPointUrlOrKey = this.appSettingsJson.checkServerStatus.url;
    this.restService.ApiEndPointMehod = this.appSettingsJson.checkServerStatus.method; //Exam.checkServerStatus;
    this.restService.ShowLoadingSpinner = false;
    this.restService.callApi().subscribe(
      (sucessResponse) => {
        if (sucessResponse) {
          this.checkServerStatus.emit(sucessResponse.heart_beat.server_online)
          this.updateServerStatusLocally(sucessResponse.heart_beat.server_online);
        }
      },
      (errorResponse) => {
        console.log(errorResponse);
        //if server offline limit is exceeded
        if (this.isOfflineTimeExceeded) {
          return;
        }
        this.updateServerStatusLocally("No", errorResponse.httpErrorResponse);
      });
  }

  checkServerStatusInInterval() {

    this.serverStatusSubscription = interval(this.serverCheckTimeInterval * 1000)
      .subscribe(val => this.getServerStatus());
  }

  updateServerStatusLocally(serverStatusText: string, response?: any) {

    const hasStatusChanged = this.checkServerStatusChanged(serverStatusText);

    if (serverStatusText === "YES") {
      if (hasStatusChanged) {
        if (this.checkStatusFirstTime === false) {
          this.updateExamServerStatus(true, false, this.serverOfflineTime);
        }
        this.isServerOnline = true;
        this.serverOfflineTime = 0;
        this.statusCssClass = "online";
        this.isOfflineTimeExceeded = false;
      }

    }
    else {
      //this.serverOfflineTime += this.serverCheckTimeInterval;

      //when offline time is more than 5 mins      
      if (this.serverOfflineTime >= this.serverOfflineTimeLimit && this.isUserLoggedIn) {
        this.isOfflineTimeExceeded = true;
        this.updateExamServerStatus(false, true, this.serverOfflineTime);
        const message = ["Exam server is offline from last " + (this.serverOfflineTimeLimit / 60) + " minutes.", "You can not continue your exam now. You can resume your exam once exam server will be online."]
        response.data[0].attributes.message = message;
        this.messageService.okRedirectModal(response, 'ERROR', 'OK').subscribe(result => {
          this.messageService.hideModal();
        });

      }
      else {
        if (hasStatusChanged) {
          this.statusCssClass = "offline"
          this.isServerOnline = false;
          this.updateUserOfflineTime();

          if (this.checkStatusFirstTime === false) {
            const message = ["Exam Server is offline.", this.isUserLoggedIn ? "You can continue your offline exam for "+(this.serverOfflineTimeLimit / 60)+" minutes." : ""]
            response.data[0].attributes.message = message;
            this.messageService.okRedirectModal(response, 'ERROR', 'OK').subscribe(result => {
              this.messageService.hideModal();
              this.updateExamServerStatus(false, false, this.serverOfflineTime);
            });
          }

        }
      }
    }
    this.checkStatusFirstTime = false;
  }

  checkServerStatusChanged(serverStatusText: string): boolean {
    if (serverStatusText === "YES" && this.isServerOnline) {
      return false;
    }
    else if (serverStatusText !== "YES" && !this.isServerOnline) {
      return false
    }
    else {
      return true;
    }
  }

  updateExamServerStatus(isServerOnline: boolean, hasOfflineExceeded: boolean, offlineTime: number) {
    let details: ServerStatusDetails = new ServerStatusDetails();
    details = this.examServeDetails;
    if(this.isUserLoggedIn)
    {
      this.examServeDetails.isServerOnline = isServerOnline;
      this.examServeDetails.hasExamOfflineTimeExceeded = hasOfflineExceeded;
      this.examServeDetails.examOfflineTimeInSeconds = offlineTime;      
      this.examHeaderService.serverDetailsSubject.next(details);
    } 
    else
    {
      if(isServerOnline)
      {
        //showing message when user is not logged in        
        const successMessage = { "http_status": "200", "data": [{ "type": "VALID_RETURN", "attributes": { "message_type": "", "message": ["Exam server is online."] }, "data": null }] };  
        this.messageService.okRedirectModal(successMessage, 'SUCCESS', 'OK').subscribe(result => {       
          this.messageService.hideModal();
        });
      }            
      //this.examHeaderService.serverDetailsSubject.next(details);
    }              
  }

  updateUserOfflineTime() {
    if (this.isUserLoggedIn && this.isServerOnline === false) {
      this.offlineTimeSubscription = interval(1000)
        .subscribe(val => {

          if (this.isServerOnline === false) {
            this.serverOfflineTime = val;
            if (val >= this.serverOfflineTimeLimit) {
              if (this.offlineTimeSubscription) {
                this.offlineTimeSubscription.unsubscribe();
                const response = { "http_status": "401", "data": [{ "type": "APP_ERROR", "attributes": { "message_type": "APP_ERROR", "message": ["Exam Server is offline.", "You can only view the questions and can not save answers."] } }] };
                this.updateServerStatusLocally("no", response);
              }
            }
          }
          else {
            this.serverOfflineTime = 0;
            this.offlineTimeSubscription.unsubscribe();
          }

        });
    }
    else {
      if (this.offlineTimeSubscription) {
        this.offlineTimeSubscription.unsubscribe();
      }

    }

  }


  ngOnDestroy() {
    this.serverStatusSubscription.unsubscribe();
    if(this.offlineTimeSubscription)
    {
      this.offlineTimeSubscription.unsubscribe();
    }
    //
  }


}
