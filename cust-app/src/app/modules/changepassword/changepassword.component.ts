import { Component, OnInit } from '@angular/core';
import { AppsettingsConfService } from '../../services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from '../../services/rest/global-rest.service';
import { HandelError, Changepassword } from '../../shared/enumrations/app-enum.enumerations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  public changePasswordFormGroup: FormGroup;
  private appRoutes: any = {};
  dataUserType: any;
  orgId: any;
  userId: any;
  dataPermissions: any;
  dataAddedPermissions: any;
  username: any;
  isError: any;
  customerId: any;

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
    this.customerId = this.authService.getUserGUId();
    this.dataPermissions = [];
    this.dataAddedPermissions = [];

    this.orgId = this.authService.getUserOrgId();
    this.username = localStorage.getItem('user_name');
    this.userId = this.authService.getUserUId();
    this.initializeFields();
  }

  getPrams() {
    let formControls = this.changePasswordFormGroup.controls;
    let params = {
      user_id: this.userId,
      id: this.userId,
      user_name: formControls.user_name.value,
      password: formControls.new_password.value,
      old_password: formControls.old_password.value,
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
    return frm.get('new_password').value === frm.get('confirm_password').value
      ? null : { 'mismatch': true };
  }

  onChangePasswordFormSubmit() {
    if (this.changePasswordFormGroup.errors !== null) {
      if (this.changePasswordFormGroup.errors.mismatch === true) {
        this.isError = true;
        this.messageService.ok("Password Mismatch");
      }
    } else {
      if (this.changePasswordFormGroup.valid === false) {
        const form = document.getElementById('changePasswordForm');
        form.classList.add('was-validated');
      } else if (this.changePasswordFormGroup.valid === true) {
        const params = this.getPrams();
        this.restService.ApiEndPointUrlOrKey = Changepassword.changepassword;
        params['access_token'] = localStorage.getItem('crmaccessToken');
        this.restService.HttpPostParams = params;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi().subscribe(successResponse => {
          this.messageService.okRedirectModal(successResponse, 'SUCCESS', 'Go to main').subscribe(result => {
            if (result == true) { // OK = true for redirection
              this.messageService.hideModal();
              this.router.navigate(['main']);
            }
            else { // NO/CANCEL = false
              this.messageService.hideModal();
            }
          });
        })
      }
    }
  }

  reset() {
    this.initializeFields();
  }
}
