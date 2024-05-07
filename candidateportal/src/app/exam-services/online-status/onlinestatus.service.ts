import { Injectable } from '@angular/core';
import { AuthService } from "src/app/exam-services/auth/auth.service";
import { Exam, HandelError } from 'src/app/exam-shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from '../rest/global-rest.service'

@Injectable({
  providedIn: 'root'
})
export class OnlinestatusService {

  constructor(private restService: GlobalRestService,private authService: AuthService,private messageService: MessageService) { }
  _onlineFlag = 1;
  onlineStatusTimer;
  facepi;
  tensorFlowApi;
  capturedData : any = []; //Error captured object
  alertCountForBubble : number = 0;  
  errorCapturedByServer : any = [];

  public getOnlineStatus(): number {      
    
    let studentGuid = this.authService.getUserUniqueId();
    let keyData = [{
        "name": "studentGuid",
        "value": studentGuid
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Exam.getOnlineStatus;        
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = false;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {                
        this._onlineFlag = 1;
      }, errorResponse => {
        //view returned error object
        this._onlineFlag = 0;
        //this.messageService.alert(errorResponse.httpErrorResponse);
        this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result =>
          {
            this.messageService.hideModal();
          })  
      }
    );
    return this._onlineFlag;
  }

  timer() {
    clearInterval(this.onlineStatusTimer);
    this.onlineStatusTimer = setInterval(() => {
      this.getOnlineStatus();     
    }, 60000);
  }

  clearTimerInterval(){
    clearInterval(this.onlineStatusTimer);  
    this.timer();
  }

}
