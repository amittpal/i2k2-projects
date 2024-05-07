import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { NgxIxcheckLoadingSpinnerService } from 'ngx-ixcheck-loading-spinner-lib';
import { HandelError, RestMethods } from '../../exam-shared/models/app.models';
import { AppsettingsConfService } from '../conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router'; // Avinash

import { MessageService } from 'ngx-ixcheck-message-lib';
//import questions from 'src/exam-assets/config/exam-questions.json';

import { ExamQuestionsSummary } from 'src/app/modules/exam-dashboard/models/exam-question.models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GlobalRestService {

  private headers: HttpHeaders;
  private httpHeaderOptions = httpOptions;
  private optionsDelete = httpOptions;
  private appRoutes: any = {};
  private currentRoute: string;

  /***********call and reset***********/
  private apiEndPointUrlOrKey: string;
  private apiEndPointMehod: string;
  //private currentRoute: string;
  private showLoadingSpinner: boolean;
  private alertAndErrorAction: number;
  private httpPostParams: any;
  private urlKeyData: any;
  /************************************/
  //Only for Desktop Apps
  private errorConnectionMessage: any = ["API is not reachable."]

  //Endpoints used in exam preview screen
  examEndpoints=[
    "getLanguageList",
    "addCandidateDetails",
    "getCandidateInformation",                
    "getAllExamQuestions",
    "updateHeartbeat",
    "clearQuestionAnswers",
    "addQuestionAnswer",
    "getAnswerSummary",
    "submitExam"
  ] 
  //questions=questions;   
  public examQuestionsSummary:ExamQuestionsSummary;
  public sectionStatus:any;
  
  constructor(
    private messageService: MessageService, 
    private http: HttpClient, 
    private configService: 
    AppsettingsConfService, 
    private loadingSpinnerService: NgxIxcheckLoadingSpinnerService, 
    private router: Router    
    ) {
      
    this.updateHeaders();

    //get saved appRoutes
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }

  private resetRestParams() {
    //*********************************/
    // Default values
    this.apiEndPointUrlOrKey = '';
    this.ApiEndPointMehod = RestMethods.Get;
    this.currentRoute = '';
    this.showLoadingSpinner = true;
    this.alertAndErrorAction = HandelError.HideAndReturn;
    this.httpPostParams = {};
    this.urlKeyData = {};
    //*********************************/
  }

  set ApiEndPointUrlOrKey(_apiEndPointUrlorKey: string) {
    this.apiEndPointUrlOrKey = _apiEndPointUrlorKey;
  }

  set ApiEndPointMehod(_apiEndPointMehod: string) {
    this.apiEndPointMehod = _apiEndPointMehod;
  }

  set ShowLoadingSpinner(_showLoadingSpinner: boolean) {
    this.showLoadingSpinner = _showLoadingSpinner;
  }

  set AlertAndErrorAction(_alertAndErrorAction: HandelError) {
    this.alertAndErrorAction = _alertAndErrorAction;
  }

  set HttpPostParams(_httpPostParms: any) {
    this.httpPostParams = _httpPostParms;
  }

  set UrlKeyData(_urlKeyData: any) {
    this.urlKeyData = _urlKeyData;
  }


  private updateHeaders() {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9',
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    });
    this.httpHeaderOptions = { headers: this.headers };
    this.optionsDelete = { headers: this.headers };
  }

  private errorModel(resposeStatus: number, responseMessage: string[]) {
    let httpErrorResponse = {
      http_status: resposeStatus,
      data: [
        {
          type: "APP_ERROR",
          attributes: {
            message_type: "APP_ERROR",
            message: responseMessage
          }
        }
      ]
    }
    return httpErrorResponse;
  }

  private handleError(resposeStatus: number, responseMessage: string[], errEnum) {
    //Error Object
    //Make Model out of it to use all across the application
    let httpErrorResponse = this.errorModel(resposeStatus, responseMessage)

    switch (errEnum) {
      case HandelError.ShowAndReturn: {
        //Show Popup Alert Error in GlobalRestService AND return ErrorObject to Component observable's error case;
        //Show Error
        //alert('Alert from HandelError.ShowAndReturn: ' + JSON.stringify(httpErrorResponse))
        //this.messageService.alert(httpErrorResponse);
        this.messageService.okRedirectModal(httpErrorResponse, 'ERROR', 'OK').subscribe(result =>
          {
            this.messageService.hideModal();
          })  
        
        //Return Error
        return throwError({ httpErrorResponse })

        break;
      }
      case HandelError.ShowAndKill: {
        //Show Popup Alert Error in GlobalRestService AND suppress any error back to Component observable's error case;
        //Show Error
        //alert('Alert from HandelError.ShowAndKill: ' + JSON.stringify(httpErrorResponse))
        this.messageService.okRedirectModal(httpErrorResponse, 'ERROR', 'OK').subscribe(result =>
          {
            this.messageService.hideModal();
          })  
        //Supress Error Return
        return EMPTY;

        break;
      }
      case HandelError.HideAndReturn: {
        //Do not show Popup Alert Error in GlobalRestService AND return ErrorObject to Component observable's error case;

        //Return Error
        return throwError({ httpErrorResponse })

        break;
      }
      case HandelError.HideAndKill: {
        //Do not show Popup Alert Error in GlobalRestService AND suppress any error back to Component observable's error case;

        //Supress Error Return
        return EMPTY;

        break;
      }
      default: {
        //HandelError.ShowAndReturn
        //Show Popup Alert Error in GlobalRestService AND return ErrorObject to Component observable's error case;
        //Show Error
        //alert('Alert from handleError' + JSON.stringify(httpErrorResponse))
        this.messageService.alert(httpErrorResponse);

        //Return Error
        return throwError({ httpErrorResponse })

        break;
      }
    }
  }

  public callApi(keyData?: any): Observable<any> {
    
    //return custom response for exam preview
    if(this.examEndpoints.includes(this.apiEndPointUrlOrKey))
    {     
      return this.customResponse(this.apiEndPointUrlOrKey);
      //console.log(this.customResponse(this.apiEndPointUrlOrKey));
    }

    //*******************************/
    this.currentRoute = this.router.url;

    this.updateHeaders();
    //*******************************/

    //apiEndPointUrlOrKey could be null
    //force input to be a valid string by adding empty char to input value
    this.apiEndPointUrlOrKey = this.apiEndPointUrlOrKey + "";

    let hasSlash = this.apiEndPointUrlOrKey.indexOf('/');

    if (this.apiEndPointUrlOrKey.trim() == "") {
      return this.handleError(400, ["Api endpoint is required"], this.alertAndErrorAction);
    }
    if (hasSlash < 0) {
      // No direct endpoint was passed
      // We meed following to call an api based on restPrams.ApiEndPointKey and restPrams.CurrentRoute
      //  restPrams.ApiEndPointUrlorKey
      //  restPrams.ApiEndPointMehod

      if (this.currentRoute.trim() == "") {
        return this.handleError(400, ["CurrentRoute is missing, to resolve api endpoint"], this.alertAndErrorAction);
      }
      //if currentUrl have either
      //'id/edit'
      // 'id/view'
      if (this.currentRoute.match('view') || this.currentRoute.match('edit') || this.currentRoute.match('add')) {
        this.currentRoute = '/' + this.currentRoute.split('/')[1];
      }
      //we have both
      // restPrams.CurrentRoute
      // restPrams.ApiEndPointKey

      var str = this.currentRoute.toString();

      let currentRoute = "_" + str.split('/')[1] //str.split('/').join('_');

      let routeObjectString = "this.appRoutes." + currentRoute + "." + this.apiEndPointUrlOrKey.trim();

      // If more than one slash in current url than error occured
      //let routeObjectString = "this.appRoutes." + this.currentRoute.replace('/', '_').trim() + "." + this.apiEndPointUrlOrKey.trim()

      let apiEndpoint = "";
      let apiMethod = ""
      try {
        apiEndpoint = eval(routeObjectString).url;
        apiMethod = eval(routeObjectString).method;

      }
      catch (e) {
        return this.handleError(400, ["Api endpoint url or method could not be evaluated"], this.alertAndErrorAction);
      }

      if (apiEndpoint != undefined && apiMethod != undefined) {
        if (apiEndpoint == "" || apiMethod == "") {
          return this.handleError(400, ["Api endpoint url or method is missing from app routes"], this.alertAndErrorAction);
        }
        else {
          this.apiEndPointUrlOrKey = eval(routeObjectString).url;
          this.apiEndPointMehod = eval(routeObjectString).method;

          if (keyData != null || keyData != undefined) {
            let dynamicUrl = this.setURL(keyData, this.apiEndPointUrlOrKey);
            //error check? , do we still have # in the final url (yes or no)
            let hasHash = dynamicUrl.indexOf('#');

            if (hasHash < 0) {
              this.apiEndPointUrlOrKey = dynamicUrl;
            }
            else {
              return this.handleError(400, ["Api endpoint url could not be properly formated, [" + dynamicUrl + "]"], this.alertAndErrorAction);
            }
          }

          // we have both
          //  restPrams.ApiEndPointUrlorKey
          //  restPrams.ApiEndPointMehod
        }
      }
      else {
        return this.handleError(400, ["Api endpoint url or method is missing from app routes"], this.alertAndErrorAction);
      }

      // we have both
      //  restPrams.ApiEndPointUrlorKey
      //  restPrams.ApiEndPointMehod

      //Everything required to make an api call is ready
    }
    else {
      if (this.apiEndPointMehod == null) //cannot be empty as its mapped to a type
      {
        //Error we need to know what METHOD to call
        return this.handleError(400, ["Api endpoint method is missing from app routes"], this.alertAndErrorAction);
      }
    }

    // we have both
    //  restPrams.ApiEndPointUrlorKey
    //  restPrams.ApiEndPointMehod

    //Everything required to make an api call is ready

    switch (this.apiEndPointMehod) {

      //HTTP GET
      case RestMethods.Get: {
        if (this.showLoadingSpinner == true) {
          this.loadingSpinnerService.show()
        }
        //this.countResponse(true);
        return this.http.get(this.apiEndPointUrlOrKey, this.httpHeaderOptions)
          .pipe(
            map(
              //http status 200
              //always good data no need to check for error
              httpResponse => {
                return httpResponse;
              }
            ),
            catchError(
              //http status <> 200
              //client error, server error or data not found error
              (errorResponse: HttpErrorResponse) => {

                let errorStatus = errorResponse.status;
                if(errorResponse.error.data == undefined) {
                  return this.handleError(errorStatus, this.errorConnectionMessage, this.alertAndErrorAction);                  
                } else {
                  let errorMessage = errorResponse.error.data[0].attributes.message;
                  return this.handleError(errorStatus, errorMessage, this.alertAndErrorAction);
                }  
              }
            ),
            finalize(
              () => {
                this.resetRestParams();

                if (this.showLoadingSpinner == true) {
                  this.loadingSpinnerService.hide()
                }
              }
            )
          );
        break;
      }

      //HTTP POST
      case RestMethods.Post: {
        if (this.showLoadingSpinner == true) {
          this.loadingSpinnerService.show()
        }
        const httpPostData = JSON.stringify(this.httpPostParams);
        // console.log("this.apiEndPointUrlOrKey ",this.apiEndPointUrlOrKey);
        // console.log("httpPostData ",httpPostData);
        // console.log("this.httpHeaderOptions ",this.httpHeaderOptions);

        return this.http.post(this.apiEndPointUrlOrKey, httpPostData, this.httpHeaderOptions)
          .pipe(
            map(
              //http status 200
              //always good data no need to check for error
              httpResponse => {
                return httpResponse;
              }
            ),
            catchError(
              //http status <> 200
              //client error, server error or data not found error
              (errorResponse: HttpErrorResponse) => {

                let errorStatus = errorResponse.status;
                if(errorResponse.error.data == undefined) {
                  return this.handleError(errorStatus, this.errorConnectionMessage, this.alertAndErrorAction);                  
                } else {
                  let errorMessage = errorResponse.error.data[0].attributes.message;
                  return this.handleError(errorStatus, errorMessage, this.alertAndErrorAction);
                }                
              }
            ),
            finalize(
              () => {
                this.resetRestParams();

                if (this.showLoadingSpinner == true) {
                  this.loadingSpinnerService.hide()
                }
              }
            )
          );
        break;
      }

      //HTTP DELETE
      case RestMethods.Delete: {

        if (this.showLoadingSpinner == true) {
          this.loadingSpinnerService.show()
        }
        const httpDeleteHeaderOptions = { headers: this.headers, body: JSON.stringify(this.httpPostParams) };

        return this.http.delete(this.apiEndPointUrlOrKey, httpDeleteHeaderOptions)
          .pipe(
            map(
              //http status 200
              //always good data no need to check for error
              httpResponse => {
                return httpResponse;
              }
            ),
            catchError(
              //http status <> 200
              //client error, server error or data not found error
              (errorResponse: HttpErrorResponse) => {
                let errorStatus = errorResponse.status;
                if(errorResponse.error.data == undefined) {
                  return this.handleError(errorStatus, this.errorConnectionMessage, this.alertAndErrorAction);                  
                } else {
                  let errorMessage = errorResponse.error.data[0].attributes.message;
                  return this.handleError(errorStatus, errorMessage, this.alertAndErrorAction);
                }  
              }
            ),
            finalize(
              () => {
                this.resetRestParams();

                if (this.showLoadingSpinner == true) {
                  this.loadingSpinnerService.hide()
                }
              }
            )
          );
        break;
      }

      //HTTP PATCH
      case RestMethods.Patch: {

        break;
      }

      // HTTP PUT
      case RestMethods.Put: {
        if (this.showLoadingSpinner == true) {
          this.loadingSpinnerService.show()
        }
        const httpPostData = JSON.stringify(this.httpPostParams);
        return this.http.put(this.apiEndPointUrlOrKey, httpPostData, this.httpHeaderOptions)
          .pipe(
            map(
              //http status 200
              //always good data no need to check for error
              httpResponse => {
                return httpResponse;
              }
            ),
            catchError(
              //http status <> 200
              //client error, server error or data not found error
              (errorResponse: HttpErrorResponse) => {

                let errorStatus = errorResponse.status;
                if(errorResponse.error.data == undefined) {
                  return this.handleError(errorStatus, this.errorConnectionMessage, this.alertAndErrorAction);                  
                } else {
                  let errorMessage = errorResponse.error.data[0].attributes.message;
                  return this.handleError(errorStatus, errorMessage, this.alertAndErrorAction);
                }  
              }
            ),
            finalize(
              () => {
                this.resetRestParams();

                if (this.showLoadingSpinner == true) {
                  this.loadingSpinnerService.hide()
                }
              }
            )
          );
        break;
      }

      //Error - Unknown HTTP Method
      default: {
        //Error we need to know what METHOD to call
        return this.handleError(400, ["Unknown api endpoint method: " + this.apiEndPointMehod], this.alertAndErrorAction);
        break;
      }
    }
  }

  public setURL(keyData: any, oldURL: string) {
    let newURL = oldURL;
    var regex = /([#])\w+/g;  // g is imp
    var matches = oldURL.match(regex);
    //loop the KEYS from oldURL
    for (var i = 0; i < matches.length; i++) {
      //loop keyData
      for (var j = 0; j < keyData.length; j++) {
        if (matches[i] == "#" + keyData[j].name) {
          newURL = newURL.replace(matches[i], keyData[j].value);
          //keyData value matched..at this stage the current array element is of no use anymore
          keyData.splice(j, 1);
          break;
        }
      }
    }
    return newURL
  }

  private customResponse(endpointText:string)
  {      
    switch(endpointText){
      case "getLanguageList":{
        const response={
          "language": [
            {
              "code": "English",
              "name": "English",
              "guid": "2b087c3f-2beb-11ea-a071-0242ac110013"
            }
          ]        
        }   
        localStorage.setItem("defaultLanguageGuid","2b087c3f-2beb-11ea-a071-0242ac110013");     
        return of(response)
      }
      case  "getCandidateInformation":{
        const response={
          "candidate_info": [
            {
              "name": " Puneet Shankar ",
              "roll_number": "005830",
              "photo": "data:image/jpeg;base64,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",
              "signature": "data:image/jpeg;base64,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",
              "exam_guid": "61391a06-4e63-11eb-8f5e-5a28b94f0bf6",
              "exam_name": "Exam 003"
            }
          ]         
        }
        return of(response)
      }
      case "updateHeartbeat":{
        const response={"http_status":"200","data":[{"type":"VALID_RETURN","attributes":{"message_type":"","message":[]},"data":null}]}
        return of(response)
      }
      case "getAllExamQuestions":{                          
        const details= JSON.parse(localStorage.getItem("examPreviewData"));
        //const httpPostData = JSON.stringify(details.params);               
        return this.http.get(details.url, this.httpHeaderOptions)
          .pipe(
            map(
              //http status 200
              //always good data no need to check for error
              httpResponse => {
                return httpResponse;
              }
            ),
            catchError(
              //http status <> 200
              //client error, server error or data not found error
              (errorResponse: HttpErrorResponse) => {
                 let errorStatus = errorResponse.status;
                if(errorResponse.error.data == undefined) {
                  return this.handleError(errorStatus, this.errorConnectionMessage, this.alertAndErrorAction);                  
                } else {
                  let errorMessage = errorResponse.error.data[0].attributes.message;
                  return this.handleError(errorStatus, errorMessage, this.alertAndErrorAction);
                }                
              }
            )           
          );

        //return of(questions)
      }
      case "addQuestionAnswer":{
        const response={"http_status":"200","data":[{"type":"VALID_RETURN","attributes":{"message_type":"","message":[]},"data":null}]}
        return of(response)
      }
      case "clearQuestionAnswers":{
        const response={"http_status":"200","data":[{"type":"VALID_RETURN","attributes":{"message_type":"","message":[]},"data":null}]}
        return of(response)
      } 
      case "getAnswerSummary":{                     
        return of(this.getQuestionsSummary())
      } 
      case "submitExam":{
        const response={"http_status":"401","data":[{"type":"APP_ERROR","attributes":{"message_type":"APP_ERROR","message":["Can not submit exam."]}}]}
        return of(response)
      }    
      default:{
        return;
      }
    }        
  }

  private getQuestionsSummary():any  
  {
    let details=this.examQuestionsSummary;

    let response={
      "section_status":this.sectionStatus,
       "answer_summary":[]
    }
    details.sections.forEach(section=>{
      let sectionResponse={
      "section_guid": section.section_guid,
      "section_name": section.section_name,
      "subject_name": "",
      "question":[]
      }
      sectionResponse.question=details.section_questions_status.filter
      (s=>s.section_guid === section.section_guid);        
      
      response.answer_summary.push(sectionResponse);
    });    
    return response;    
  }
}
