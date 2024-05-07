import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { NgxIxcheckLoadingSpinnerService } from 'ngx-ixcheck-loading-spinner-lib';
import { HandelError, RestMethods } from '../../shared/models/app.models';
import { AppsettingsConfService } from '../../services/conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router'; // Avinash

import { MessageService } from 'ngx-ixcheck-message-lib';

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


  constructor(private messageService: MessageService, private http: HttpClient, private configService: AppsettingsConfService, private loadingSpinnerService: NgxIxcheckLoadingSpinnerService, private router: Router) {
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

  private errorModel(resposeStatus: number, responseMessage: string) {
    let httpErrorResponse = {
      http_status: resposeStatus,
      data: [
        {
          type: "APP_ERROR",
          attributes: {
            message_type: "APP_ERROR",
            message: [responseMessage]
          }
        }
      ]
    }
    return httpErrorResponse;
  }

  private handleError(resposeStatus: number, responseMessage: string, errEnum) {
    //Error Object
    //Make Model out of it to use all across the application
    let httpErrorResponse = this.errorModel(resposeStatus, responseMessage)

    switch (errEnum) {
      case HandelError.ShowAndReturn: {
        //Show Popup Alert Error in GlobalRestService AND return ErrorObject to Component observable's error case;
        //Show Error
        //alert('Alert from HandelError.ShowAndReturn: ' + JSON.stringify(httpErrorResponse))
        this.messageService.alert(httpErrorResponse);
        //Return Error
        return throwError({ httpErrorResponse })

        break;
      }
      case HandelError.ShowAndKill: {
        //Show Popup Alert Error in GlobalRestService AND suppress any error back to Component observable's error case;
        //Show Error
        //alert('Alert from HandelError.ShowAndKill: ' + JSON.stringify(httpErrorResponse))
        this.messageService.alert(httpErrorResponse)
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

    //*******************************/
    this.currentRoute = this.router.url;

    this.updateHeaders();
    //*******************************/

    //apiEndPointUrlOrKey could be null
    //force input to be a valid string by adding empty char to input value
    this.apiEndPointUrlOrKey = this.apiEndPointUrlOrKey + "";

    let hasSlash = this.apiEndPointUrlOrKey.indexOf('/');

    if (this.apiEndPointUrlOrKey.trim() == "") {
      return this.handleError(400, "Api endpoint is required", this.alertAndErrorAction);
    }
    if (hasSlash < 0) {
      // No direct endpoint was passed
      // We meed following to call an api based on restPrams.ApiEndPointKey and restPrams.CurrentRoute
      //  restPrams.ApiEndPointUrlorKey
      //  restPrams.ApiEndPointMehod

      if (this.currentRoute.trim() == "") {
        return this.handleError(400, "CurrentRoute is missing, to resolve api endpoint", this.alertAndErrorAction);
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
        return this.handleError(400, "Api endpoint url or method could not be evaluated", this.alertAndErrorAction);
      }

      if (apiEndpoint != undefined && apiMethod != undefined) {
        if (apiEndpoint == "" || apiMethod == "") {
          return this.handleError(400, "Api endpoint url or method is missing from app routes", this.alertAndErrorAction);
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
              return this.handleError(400, "Api endpoint url could not be properly formated, [" + dynamicUrl + "]", this.alertAndErrorAction);
            }
          }

          // we have both
          //  restPrams.ApiEndPointUrlorKey
          //  restPrams.ApiEndPointMehod
        }
      }
      else {
        return this.handleError(400, "Api endpoint url or method is missing from app routes", this.alertAndErrorAction);
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
        return this.handleError(400, "Api endpoint method is missing from app routes", this.alertAndErrorAction);
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
                let errorMessage = errorResponse.error.data[0].attributes.message[0];
                return this.handleError(errorStatus, errorMessage, this.alertAndErrorAction);
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
                let errorMessage = errorResponse.error.data[0].attributes.message[0];
                return this.handleError(errorStatus, errorMessage, this.alertAndErrorAction);
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
                let errorMessage = errorResponse.error.data[0].attributes.message[0];
                return this.handleError(errorStatus, errorMessage, this.alertAndErrorAction);
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
                let errorMessage = errorResponse.error.data[0].attributes.message[0];
                return this.handleError(errorStatus, errorMessage, this.alertAndErrorAction);
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
        return this.handleError(400, "Unknown api endpoint method: " + this.apiEndPointMehod, this.alertAndErrorAction);
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
}
