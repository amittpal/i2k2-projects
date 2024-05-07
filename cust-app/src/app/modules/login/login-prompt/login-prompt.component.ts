import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RestApiParams, HandelError, RestMethods } from '../../../shared/models/app.models';
import { GlobalRestService } from '../../../services/rest/global-rest.service'
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-prompt',
  templateUrl: './login-prompt.component.html',
  styleUrls: ['./login-prompt.component.scss']
})
export class LoginPromptComponent implements OnInit {
  public loginFormGroup: FormGroup;
  public errMessage = "";
  private restPrams: RestApiParams;
  private appSettingsJson: any = {};

  constructor(
    private restService: GlobalRestService,
    private configService: AppsettingsConfService,
    private router: Router,
    private http: HttpClient
  ) {

    this.http.get('../../../../assets/config/settings.json')
      .toPromise()
      .then(data => {
        this.appSettingsJson = data;
        this.restPrams = new RestApiParams;
        this.restPrams.ShowLoadingSpinner = true;
        this.restPrams.AlertAndErrorAction = HandelError.ShowAndReturn;

        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("userPermissions");
      })

  }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  public login(event) {
    event.preventDefault();
    event.stopPropagation();


    this.errMessage = "";
    const username: string = this.loginFormGroup.controls.username.value;
    const password: string = this.loginFormGroup.controls.password.value;

    let httpPostParams = {
      userName: username,
      password: password,
      appGuid: this.appSettingsJson.application_guid
    }

    //call the token endpoint
    this.restService.ApiEndPointUrlOrKey = this.appSettingsJson.token.url;
    this.restService.ApiEndPointMehod = this.appSettingsJson.token.method;
    this.restService.HttpPostParams = httpPostParams;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        if (sucessResponse.token.access_token != "") {
          localStorage.setItem('accessToken', sucessResponse.token.access_token);
          localStorage.setItem('userPermissions', JSON.stringify(sucessResponse.token.access_groups));
          localStorage.setItem('user_name', sucessResponse.user_name);
          localStorage.setItem('user_type', sucessResponse.user_type);
          // this.router.navigate(['/main']);
          this.loginCrm(event);
        }
        else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userPermissions");
          localStorage.removeItem("currentUser");
          localStorage.removeItem("user_name");
          localStorage.removeItem("user_type");
          this.errMessage = 'Un-expected error';
        }
      }, errorResponse => {
        //view returned error object
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userPermissions");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_type");
        this.errMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];//'Username or password is incorrect';
      }
      );
  }
  public loginCrm(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.loginFormGroup.valid === false) {
      const form = document.getElementById('loginForm');
      form.classList.add('was-validated');
    } else {

      this.errMessage = "";
      const username: string = this.loginFormGroup.controls.username.value;
      const password: string = this.loginFormGroup.controls.password.value;

      let httpPostParams = {
        Username: username,
        Password: password,
        appGuid: "f20caa40-6aa6-47ba-b763-f5c5f29fa0e5"
      }

      //call the token endpoint
      this.restService.ApiEndPointUrlOrKey = this.appSettingsJson.tokenCrm.url;
      this.restService.ApiEndPointMehod = this.appSettingsJson.token.method;
      this.restService.HttpPostParams = httpPostParams;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          if (sucessResponse.token.access_token != "") {
            localStorage.setItem('crmaccessToken', sucessResponse.token.access_token);
            this.router.navigate(['/main']);
          }
          else {
            localStorage.removeItem("crmaccessToken");
            this.errMessage = 'Un-expected error';
          }
        }, errorResponse => {
          //view returned error object
          localStorage.removeItem("crmaccessToken");
          this.errMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0]; //'Username or password is incorrect';
        }
        );
    }
  }

}
