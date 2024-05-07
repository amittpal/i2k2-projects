import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Configurations } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-mail-configuation',
  templateUrl: './mail-configuation.component.html',
  styleUrls: ['./mail-configuation.component.scss']
})

export class MailConfiguationComponent implements OnInit {
  public addOutgoingMailFormGroup: FormGroup;
  private appRoutes: any = {};
  instituteId: string;
  submitted = false;
  registrationEmailDetails: any = {};
  registrationGuid = "";
  isError: any;
  @Input() tabset: TabsetComponent;

  constructor(private route: ActivatedRoute, private configService: AppsettingsConfService, private router: Router, private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private restService: GlobalRestService, private authService: AuthService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Mail Server Configuration");
    //setting page title
    this.initializeFields();
    this.route.params.subscribe((params: Params) => {
      this.registrationGuid = params['registrationGuid'];
      if (this.registrationGuid) {
        this.getData(this.registrationGuid);
      }
    }, error => {
      console.error('Error: ', error);
    });
  }

  public initializeFields() {
    this.addOutgoingMailFormGroup = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      smtp: new FormControl('', Validators.required),
      smtp_port: new FormControl('', Validators.required),
      sender_email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]),
      sender_name: new FormControl('', Validators.required),
      verify_email_id: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]),
      email_subject: new FormControl('', Validators.required),
      email_template: new FormControl(''),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
    }, this.pwdMatchValidator);
  }

  pwdMatchValidator(frm: FormGroup) {
    //lert('hi');
    return frm.get('password').value === frm.get('confirm_password').value
      ? null : { 'mismatch': true };
  }

//  }, this.pwdMatchValidator);

  setupFields(emailDetails: any) {
    if (emailDetails) {
      this.addOutgoingMailFormGroup.patchValue({
        code: emailDetails.code,
        name: emailDetails.name,
        smtp: emailDetails.smtp,
        smtp_port: emailDetails.smtp_port,
        sender_email: emailDetails.sender_email,
        sender_name: emailDetails.sender_name,
        verify_email_id: emailDetails.verify_email_id,
        email_subject: emailDetails.email_subject,
        email_template: emailDetails.email_template,
        password: emailDetails.password,
        confirm_password: emailDetails.confirm_password
      });
    }
  }

  getData(id: any) {
    var keyData = [
      {
        "name": "examGuid",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Configurations.getRegistrationsEmailServerDetailsByGuid;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.registrationEmailDetails = sucessResponse.email_setup[0];
        this.setupFields(sucessResponse.email_setup[0]);
      }, errorResponse => {
      }
      );
  }


  private getParams() {
    let params = this.addOutgoingMailFormGroup.getRawValue();
    params["registration_guid"] = this.registrationGuid;
    return params;
  }

  public formSubmit() {
    this.submitted = true;
    
    if (this.addOutgoingMailFormGroup.valid === false) {

      if (this.addOutgoingMailFormGroup.errors !== null) {


        let form = document.getElementById('addOutgoingMailForm');
        form.classList.add('was-validated');

        if (this.addOutgoingMailFormGroup.errors.mismatch === true && this.addOutgoingMailFormGroup.controls["password"].valid && this.addOutgoingMailFormGroup.controls["confirm_password"].valid) {
          this.isError = true;
          this.messageService.ok("Password Mismatch");
        }
      }


    }
    else if (this.addOutgoingMailFormGroup.valid === true) {
      
      let params = this.getParams();
      if (this.registrationEmailDetails.registration_guid) {
        //updating if setup id is available

        this.restService.ApiEndPointUrlOrKey = Configurations.updateRegistrationsEmailServerDetails;
        this.restService.ShowLoadingSpinner = true;
        this.restService.HttpPostParams = params;
        this.restService.callApi()
          .subscribe(sucessResponse => {
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                //this.tabset.tabs[4].active = true;
                this.reset();
              }
              else {
                this.messageService.hideModal();
              }
            });
          },
            errorResponse => {
              //this.messageService.alert(errorResponse);
            }
          );
      }
      else {
        //adding if setup id is 0
        this.restService.ApiEndPointUrlOrKey = Configurations.addRegistrationsEmailServerDetails;
        this.restService.ShowLoadingSpinner = true;
        this.restService.HttpPostParams = params;
        this.restService.callApi()
          .subscribe(sucessResponse => {
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                //this.tabset.tabs[4].active = true;
                this.reset();
              }
              else {
                this.messageService.hideModal();
              }
            });
          },
            errorResponse => {
              //this.messageService.alert(errorResponse);
            });
      }

    }

  }

  public reset() {
    let form = document.getElementById('addOutgoingMailForm');
    form.classList.remove('was-validated');
    this.submitted = false;
    this.addOutgoingMailFormGroup.reset();
    this.initializeFields();
    //let params = this.getParams();
  }
  // allow only numbers
  public checkInput(event) {
    var ctrlCode = (event.ctrlKey) ? event.ctrlKey : event.metaKey;  // get key cross-browser
    var charCode = (event.which) ? event.which : event.keyCode;      // get key cross-browser

    if ( // Allow: home, end, left, right, down, up
      (charCode >= 35 && charCode <= 40)
      // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
      || (charCode == 65 || charCode == 86 || charCode == 67) && (ctrlCode === true)) {
      return true;
    }
    if (charCode > 31
      && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else {
      return true
    }
  }
  verifiedMail() {
    this.submitted = true;
   
    if (this.addOutgoingMailFormGroup.valid === false) {
      if (this.addOutgoingMailFormGroup.errors !== null) {


        let form = document.getElementById('addOutgoingMailForm');
        form.classList.add('was-validated');

        if (this.addOutgoingMailFormGroup.errors.mismatch === true && this.addOutgoingMailFormGroup.controls["password"].valid && this.addOutgoingMailFormGroup.controls["confirm_password"].valid) {
          this.isError = true;
          this.messageService.ok("Password Mismatch");
        }
      }
    
    } 
    
    else if (this.addOutgoingMailFormGroup.valid === true) {
      let params = this.getParams();
      //updating if setup id is available

      this.restService.ApiEndPointUrlOrKey = Configurations.verifiedMail;
      this.restService.ShowLoadingSpinner = true;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.restService.HttpPostParams = params;
      this.restService.callApi()
        .subscribe(sucessResponse => {
          this.messageService.okRedirectModal(sucessResponse, 'SUCCESS',).subscribe(result => {
            if (result == true) {
              this.messageService.hideModal();
            }
            else {
              this.messageService.hideModal();
            }
          });
        },
          errorResponse => {
            //this.messageService.alert(errorResponse);
          }
        );
    }
  
  }
}
