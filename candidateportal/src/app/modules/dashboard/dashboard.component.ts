import { Component, OnInit } from "@angular/core";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import { PrimaryHeaderService } from "../layout/primary-header/primary-header.service";
import appSettings from "../../../assets/config/settings.json";
import { HandelError } from "src/app/shared/models/app.models";
import { Router } from "@angular/router";
import { Dashboard } from "src/app/shared/enumrations/app-enum.enumerations";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "ngx-ixcheck-message-lib";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  private examLink: string = "";
  registrationsGuid: string = "";
  candidateInitialInfo: any;
  paymentDetails: any;
  sendOtpFromGroup: FormGroup;
  verifyOtpFromGroup: FormGroup;
  emailControlEnabled: boolean = false;

  constructor(
    private primaryHeader: PrimaryHeaderService,
    private restService: GlobalRestService,
    private router: Router,
    private messageService: MessageService
  ) { }
  private appSettingsJson: any = {};
  ngOnInit() {
    //setting page title
    this.appSettingsJson = appSettings;
    this.primaryHeader.pageTitle.next("Dashboard");
    this.bindExamInfo();
    //this.getCandiateDetails();
    this.getCandiateInitialInfo();
    
  }

  onStartRegistrationClick() {
    if (this.registrationsGuid) {
      this.router.navigateByUrl("/registration/exam/" + this.registrationsGuid + "");
    }
  }

  getCandiateDetails() {
    let keyData = [
      {
        name: "guid",
        value: localStorage.getItem("uniqueUserId"),
      },
    ];
    //call the token endpoint
    this.restService.ApiEndPointUrlOrKey = Dashboard.getCandidateDetailsByGuid;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        if (sucessResponse) {
          //this.candidateInitialInfo=sucessResponse.layout[0];
        }
      },
      (errorResponse) => { }
    );
  }

  bindExamInfo() {
    //call the token endpoint
    this.restService.ApiEndPointUrlOrKey = this.appSettingsJson.getRegistrationLink.url;
    this.restService.ApiEndPointMehod = this.appSettingsJson.getRegistrationLink.method;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi().subscribe(
      (sucessResponse) => {
        if (sucessResponse) {
          this.examLink = sucessResponse.exam_link[0].exam_url;
          let array = sucessResponse.exam_link[0].exam_url.split("/");
          if (array.length > 0) {
            this.registrationsGuid = array.slice(-1)[0];
          }
        }
      },
      (errorResponse) => { }
    );
  }

  getCandiateInitialInfo() {
    let keyData = [
      {
        name: "guid",
        value: localStorage.getItem("uniqueUserId"),
      },
    ];
    //call the token endpoint
    this.restService.ApiEndPointUrlOrKey = Dashboard.getCandidateInitialInfo;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        if (sucessResponse) {                    
          this.candidateInitialInfo = sucessResponse.layout[0];
          this.createForms();
          if (
            this.candidateInitialInfo.payment_status != "Success" || 
            this.candidateInitialInfo.payment_status != "Failed"
          ) {
            this.getPaymentStatus();
          }

          this.primaryHeader.saveCanidateInfoToStorage(sucessResponse.layout[0]);                 
        }
      },
      (errorResponse) => { }
    );
  }
  onRegistrationContinueClick() {
    if (this.registrationsGuid) {
      this.router.navigateByUrl(
        "/registration/exam/" + this.registrationsGuid + "/edit"
      );
    }
  }

  onViewRegistrationClick() {
    if (this.registrationsGuid) {
      this.router.navigateByUrl(
        "/registration/exam/" + this.registrationsGuid + "/view"
      );
    }
  }

  createForms() {
    this.sendOtpFromGroup = new FormGroup({
      email: new FormControl(this.candidateInitialInfo.email, [Validators.required,]),
    });

    this.verifyOtpFromGroup = new FormGroup({
      otp: new FormControl("", [Validators.required]),
    });

    this.sendOtpFromGroup.get('email').disable();
  }

  onSendOtpClick() {
    if (this.sendOtpFromGroup.get('email').value && this.emailControlEnabled === false) {
      let postParmas = {
        email_id: this.sendOtpFromGroup.get("email").value,
        registration_guid: this.registrationsGuid,
        candidate_guid: this.candidateInitialInfo.candidate_guid,
      };
      //call the token endpoint
      this.restService.ApiEndPointUrlOrKey = Dashboard.generateOTP;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.HttpPostParams = postParmas;

      this.restService.callApi().subscribe(
        (sucessResponse) => {
          if (sucessResponse) {
            this.messageService.notify(sucessResponse);
          }
        },
        (errorResponse) => {
          this.messageService.notify(errorResponse.httpErrorResponse);
        }
      );
    }
  }

  getPaymentStatus() {
    let keyData = [
      {
        name: "candidateGuid",
        value: this.candidateInitialInfo.candidate_guid,
      },
      {
        name: "registrationGuid",
        value: this.registrationsGuid,
      },
    ];
    //call the token endpoint
    this.restService.ApiEndPointUrlOrKey = Dashboard.getPaymentStatus;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        if (sucessResponse) {
          this.paymentDetails = sucessResponse.payment_status;
         
        }
      },
      (errorResponse) => { }
    );
  }

  onVerifyEmailClick() {
    if (this.verifyOtpFromGroup.valid) {
      let postParmas = {
        otp: this.verifyOtpFromGroup.get("otp").value,
        email_id: this.sendOtpFromGroup.get("email").value,
        registration_guid: this.registrationsGuid,
        candidate_guid: this.candidateInitialInfo.candidate_guid,
      };
      //call the token endpoint
      this.restService.ApiEndPointUrlOrKey = Dashboard.verifyOTP;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.HttpPostParams = postParmas;

      this.restService.callApi().subscribe(
        (sucessResponse) => {
          if (sucessResponse) {
            this.messageService.notify(sucessResponse);
            this.getCandiateInitialInfo();
          }
        },
        (errorResponse) => {
          console.log(errorResponse);
          this.messageService.notify(errorResponse.httpErrorResponse);
        }
      );
    }
  }
  onEditEmailClick() {
    if (this.emailControlEnabled) {
      if (this.sendOtpFromGroup.valid) {
        let postParmas = {
          email_id: this.sendOtpFromGroup.get("email").value,
          registration_guid: this.registrationsGuid,          
          candidate_guid:this.candidateInitialInfo.candidate_guid,
          id: this.candidateInitialInfo.comp_id,
        };
        //call the token endpoint
        this.restService.ApiEndPointUrlOrKey = Dashboard.updateCandidateEmail;
        this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
        this.restService.HttpPostParams = postParmas;

        this.restService.callApi().subscribe(
          (sucessResponse) => {
            if (sucessResponse) {
              this.messageService.notify(sucessResponse);
              this.sendOtpFromGroup.get('email').disable();
              this.emailControlEnabled = false
              this.getCandiateInitialInfo();
            }
          },
          (errorResponse) => {
            this.messageService.notify(errorResponse.httpErrorResponse);
            this.sendOtpFromGroup.get('email').disable();
            this.emailControlEnabled = false
          }
        );
      }
    }
    else {
      this.sendOtpFromGroup.get('email').enable();
      this.emailControlEnabled = true;
    }

  }

  onPayClick() {
    if (this.registrationsGuid) {
      this.router.navigateByUrl("/registration/exam/payment/paytm");
    }
  }

  onViewPaymentClick() {    
      this.router.navigateByUrl(
        "/registration/exam/payment/view/orders"
      );
  }

  onViewAdmitCardClick() {
    if (this.registrationsGuid && this.candidateInitialInfo.reg_id) {
      this.router.navigateByUrl(
        "/admitcard/" + this.registrationsGuid + "/" + this.candidateInitialInfo.reg_id
      );
    }
  }

  onStartMockTestClick()
  {
    const info=this.primaryHeader.getCanidateInfoFromStorage();
    if(info)
    {      
      window.open("https://dev.mocktest.ixcheck.io/#/login?username="+info.userName+"&email="+info.email+"&guid="+info.registration_guid+"", "_blank");
    }   
  }
}