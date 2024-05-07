import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppsettingsConfService } from '../../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router';
import { PrimaryHeaderService } from '../../../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from '../../../../../services/rest/global-rest.service';
import { HandelError, RegistrationsSetup } from '../../../../../shared/enumrations/app-enum.enumerations';
import { RestMethods } from '../../../../../shared/models/app.models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TabsetComponent } from 'ngx-bootstrap';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-outgoing-mails',
  templateUrl: './outgoing-mails.component.html',
  styleUrls: ['./outgoing-mails.component.scss']
})
export class OutgoingMailsComponent implements OnInit {

  public addOutgoingMailFormGroup: FormGroup;
  private appRoutes: any = {};
  instituteId: string;
  submitted = false;
  registrationEmailDetails: any = {};
  examGuid = "";

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
    //setting page title
    this.primaryHeader.pageTitle.next("REGISTRATION SETUP");
    //this.instituteId=this.authService.getInstituteId();
    this.initializeFields();
    this.route.params.subscribe((params: Params) => {
      this.examGuid = params['id'];
      if (this.examGuid) {
        this.getData(this.examGuid);
      }
    }, error => {
      console.error('Error: ', error);
    });
  }

  public initializeFields() {
    this.addOutgoingMailFormGroup = new FormGroup({
      smtp: new FormControl('', Validators.required),
      smtp_port: new FormControl('', Validators.required),
      sender_email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]),
      sender_name: new FormControl('', Validators.required),
      email_subject: new FormControl('', Validators.required),
      email_template: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  setupFields(emailDetails: any) {
    if (emailDetails) {
      this.addOutgoingMailFormGroup.patchValue({
        smtp: emailDetails.smtp,
        smtp_port: emailDetails.smtp_port,
        sender_email: emailDetails.sender_email,
        sender_name: emailDetails.sender_name,
        email_subject: emailDetails.email_subject,
        email_template: emailDetails.email_template,
        password: emailDetails.password
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
    this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.getRegistrationsEmailServerDetailsByExamId;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        //console.log(sucessResponse); 
        this.registrationEmailDetails = sucessResponse.email_setup[0];
        this.setupFields(sucessResponse.email_setup[0]);
      },
        errorResponse => {
          this.messageService.alert(errorResponse);
        }
      );
  }


  private getParams() {
    let params = this.addOutgoingMailFormGroup.getRawValue();
    params["exam_guid"] = this.examGuid;
    //params["id"] = "0";
    return params;
  }

  public formSubmit() {

    this.submitted = true;
    if (this.addOutgoingMailFormGroup.valid === false) {
      let form = document.getElementById('addOutgoingMailForm');
      form.classList.add('was-validated');
    } else if (this.addOutgoingMailFormGroup.valid === true) {
      let params = this.getParams();
      if (this.registrationEmailDetails.registration_setup_id) {
        //updating if setup id is available

        this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.updateRegistrationsEmailServerDetails;
        this.restService.ShowLoadingSpinner = true;
        this.restService.HttpPostParams = params;
        this.restService.callApi()
          .subscribe(sucessResponse => {
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                this.tabset.tabs[2].active = true;
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
        this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.addRegistrationsEmailServerDetails;
        this.restService.ShowLoadingSpinner = true;
        this.restService.HttpPostParams = params;
        this.restService.callApi()
          .subscribe(sucessResponse => {
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Next').subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();
                this.tabset.tabs[2].active = true;
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
    let params = this.getParams();
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
    if (this.addOutgoingMailFormGroup.valid === false) {
      let form = document.getElementById('addOutgoingMailForm');
      form.classList.add('was-validated');
    } else if (this.addOutgoingMailFormGroup.valid === true) {
      let params = this.getParams();
        //updating if setup id is available

        this.restService.ApiEndPointUrlOrKey = RegistrationsSetup.verifiedMail;
        this.restService.ShowLoadingSpinner = true;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.HttpPostParams = params;
        this.restService.callApi()
          .subscribe(sucessResponse => {
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', ).subscribe(result => {
              if (result == true) {
                this.messageService.hideModal();              }
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
