import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RestApiParams, HandelError, RestMethods } from '../../../shared/models/app.models';
import { GlobalRestService } from '../../../services/rest/global-rest.service'
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service'
import { Login } from 'src/app/shared/enumrations/app-enum.enumerations';
import appSettings from "../../../../assets/config/settings.json"
import { MessageService } from 'ngx-ixcheck-message-lib';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';

@Component({
  selector: 'app-login-prompt',
  templateUrl: './login-prompt.component.html',
  styleUrls: ['./login-prompt.component.scss']
})
export class LoginPromptComponent implements OnInit {
  public loginFormGroup: FormGroup;
  public newCandidateFormGroup: FormGroup;
  public errMessage = "";
  private restPrams : RestApiParams;
  private appSettingsJson : any = {};
  examList:[];
  private examLink:string="";
  private examGuid:string="";
  public captchaId : number ;
  public captchaImg : any;

  constructor(
    private restService: GlobalRestService, 
    private configService : AppsettingsConfService, 
    private router : Router,
    private messageService:MessageService,
    private headerService:PrimaryHeaderService) { 
    
    this.restPrams = new RestApiParams;
    this.restPrams.ShowLoadingSpinner = true;
    this.restPrams.AlertAndErrorAction =  HandelError.ShowAndReturn;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem('uniqueUserId');
    this.headerService.removeCandidateInfoFromStorage();
    this.headerService.userLoginStatus.next(false);
    
  }

  ngOnInit() {
    this.appSettingsJson = appSettings;
    this.loginFormGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      captcha: new FormControl('', Validators.required)
    });
    this.bindExamInfo();   
    this.captchaId = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.getCaptcha();
  }

  bindExamInfo()
  {
  //call the token endpoint
  this.restService.ApiEndPointUrlOrKey = this.appSettingsJson.getRegistrationLink.url;
  this.restService.ApiEndPointMehod = this.appSettingsJson.getRegistrationLink.method;         
  this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
  this.restService.callApi()
    .subscribe(sucessResponse => {                
      if(sucessResponse)
      {         
         this.examLink=sucessResponse.exam_link[0].exam_url;         
         let array=sucessResponse.exam_link[0].exam_url.split('/');
         if(array.length>0)
         {
           this.examGuid=array.slice(-1)[0];
         }         
      }
    }, errorResponse => {
      
      }
    );  
  }



  onStartRegistrationClick()
  {
    // if(this.examLink)
    // {       
    //    window.open(this.examLink, "_blank"); 
    // }
    
    this.router.navigate(['/dashboard']); 
  }
  
  
  public login(){

    this.appSettingsJson = appSettings;

    this.errMessage = "";
    const username : string = this.loginFormGroup.controls.username.value;
    const password : string = this.loginFormGroup.controls.password.value;

    let httpPostParams = { 
      Username : username, 
      Password : password,
      AppGuid : appSettings.application_guid,
      ExamGuid:this.examGuid 
    }

    //call the token endpoint
    this.restService.ApiEndPointUrlOrKey = this.appSettingsJson.token.url;
    this.restService.ApiEndPointMehod = this.appSettingsJson.token.method; 
    this.restService.HttpPostParams = httpPostParams;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi()
      .subscribe(sucessResponse => {        
          if(sucessResponse.token.access_token != "")
          {
            let candidateGuid=sucessResponse.core_user_info.UserUniqueId;
            if(candidateGuid)
            {   
              // this.loginFormGroup.reset();           
              // window.open("http://localhost:4300/#/registration/exam/"+candidateGuid+"/edit", "_blank"); 
              localStorage.setItem('uniqueUserId',candidateGuid);
              localStorage.setItem('accessToken', sucessResponse.token.access_token);
              this.headerService.userLoginStatus.next(true);
              this.router.navigate(['/dashboard']);
            }
            else
            {
              localStorage.removeItem('uniqueUserId');
              localStorage.setItem('accessToken', sucessResponse.token.access_token);
              this.router.navigate(['/dashboard']);
            }
            
          }
          else
          {
            localStorage.removeItem("accessToken");
            localStorage.removeItem('uniqueUserId');
            localStorage.removeItem("currentUser");
            this.errMessage = 'Un-expected error';
          }
      }, errorResponse => {
          //view returned error object
          localStorage.removeItem("accessToken");
          localStorage.removeItem('uniqueUserId');
          localStorage.removeItem("currentUser");
          if (errorResponse !== undefined) {
            this.messageService.ok(errorResponse.httpErrorResponse.data[0].attributes.message[0]);
          }
        }
      );
  }

  public validateCaptcha(event) {
    event.preventDefault();
    event.stopPropagation();

    let form = document.getElementById("loginForm");
    if (this.loginFormGroup.valid === false) {
      form.classList.add("was-validated");
    }
    else{
      this.errMessage = "";
      const captcha: string = this.loginFormGroup.controls.captcha.value;

      let httpPostParams = {
        captchaId: this.captchaId,
        captchaCode: captcha
      }

      //call the token endpoint
      this.restService.ApiEndPointUrlOrKey = Login.validateCaptcha;
      this.restService.HttpPostParams = httpPostParams;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.ShowLoadingSpinner = false;
      this.restService.callApi()
        .subscribe(sucessResponse => {
            this.login();
        }, errorResponse => {        
            if (errorResponse !== undefined) {
              this.reloadCaptcha()
              this.messageService.ok(errorResponse.httpErrorResponse.data[0].attributes.message[0]);
            }
        }
        );
    }
  }

  getCaptcha() {

    var keyData = [
      {
        "name": "id",
        "value": this.captchaId
      }
    ];
        
    this.restService.ApiEndPointUrlOrKey = Login.getCaptcha;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        if (sucessResponse) {
          this.captchaImg = "data:image/png;base64," + sucessResponse["captcha_details"]["captcha_image"];
        }
      }, errorResponse => {

      }
      );
  }

  reloadCaptcha(){
    this.loginFormGroup.controls["captcha"].setValue("");
    this.getCaptcha();
  }

}
