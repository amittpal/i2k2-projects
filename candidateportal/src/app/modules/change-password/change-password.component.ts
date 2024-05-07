import { Component, OnInit } from '@angular/core';
import { AppsettingsConfService } from '../../services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from '../../services/rest/global-rest.service';
import { HandelError, ChangePassword } from '../../shared/enumrations/app-enum.enumerations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public changePasswordFormGroup: FormGroup;
  private appRoutes: any = {};
  username: any;
  candidateGuid: any;
  isError: any;

  constructor(private configService: AppsettingsConfService, private authService: AuthService,
    private messageService: MessageService, private restService: GlobalRestService, private router: Router,
    private headerService: PrimaryHeaderService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }
  ngOnInit() {
    this.headerService.pageTitle.next("Change Password")
    this.initializeFields();
    this.getCandiateInitialInfo();
  }

  getCandiateInitialInfo() {

    const candidateInfo=this.headerService.getCanidateInfoFromStorage();
    this.username = candidateInfo.userName;
    this.candidateGuid = candidateInfo.candidate_guid;
    this.changePasswordFormGroup.controls["user_name"].patchValue(this.username);

    
    // let keyData = [
    //   {
    //     name: "guid",
    //     value: localStorage.getItem("uniqueUserId"),
    //   },
    // ];
    // //call the token endpoint
    // this.restService.ApiEndPointUrlOrKey = ChangePassword.getCandidateInitialInfo;
    // this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    // this.restService.callApi(keyData).subscribe(
    //   (sucessResponse) => {
    //     if (sucessResponse) {
    //       this.username = sucessResponse.layout[0].userName;
    //       this.candidateGuid = sucessResponse.layout[0].candidate_guid;
    //       this.changePasswordFormGroup.controls["user_name"].patchValue(this.username);
    //     }
    //   },
    //   (errorResponse) => { }
    // );
  }

  getParams() {
    let formControls = this.changePasswordFormGroup.controls;
    let params = {
      candidate_guid: this.candidateGuid,
      userName: formControls.user_name.value,
      old_password: formControls.old_password.value,
      password: formControls.new_password.value,
      confirm_password: formControls.confirm_password.value
    }
    return params;
  }

  initializeFields() {
    this.changePasswordFormGroup = new FormGroup({
      user_name: new FormControl({ value: this.username, disabled: true }),
      old_password: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
    }, this.pwdMatchValidator);
  }

  pwdMatchValidator(frm: FormGroup) {
    if (!(frm.get('new_password').value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/))) {
      return { 'invalidPassword': true };
    } else if (!(frm.get('new_password').value === frm.get('confirm_password').value)) {
      return { 'mismatch': true }
    }
  }

  onChangePasswordFormSubmit() {
    if (this.changePasswordFormGroup.errors !== null) {
      if (this.changePasswordFormGroup.errors.mismatch === true) {
        this.isError = true;
        this.messageService.ok("Password Mismatch");
      } else if (this.changePasswordFormGroup.errors.invalidPassword === true) {
        this.messageService.ok("Password must be between 8 to 24 characters with no space, atleast one uppercase letter, one number, and one special character(@$!%*?&).");
        return
      }
    } else {
      if (this.changePasswordFormGroup.valid === false) {
        const form = document.getElementById('changePasswordForm');
        form.classList.add('was-validated');
      } else if (this.changePasswordFormGroup.valid === true) {
        const params = this.getParams();
        this.restService.ApiEndPointUrlOrKey = ChangePassword.changePassword;
        this.restService.HttpPostParams = params;
        this.restService.callApi().subscribe(successResponse => {
          this.messageService.ok('Password updated successfully.', 'SUCCESS', 'OK', 'success');
          this.reset();
        }, errorResponse => {
          if (errorResponse !== undefined) {
            this.messageService.ok(errorResponse.httpErrorResponse.data[0].attributes.message[0]);
          }
        })
      }
    }
  }

  reset() {
    this.initializeFields();
  }


}
