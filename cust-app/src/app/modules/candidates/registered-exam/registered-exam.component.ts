import { Candidates } from './../../../shared/enumrations/app-enum.enumerations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { AppsettingsConfService } from './../../../services/conf/appsettings-conf/appsettings-conf.service';
import { PrimaryHeaderService } from './../../layout/primary-header/primary-header.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from './../../../services/rest/global-rest.service';
import { HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-registered-exam',
  templateUrl: './registered-exam.component.html',
  styleUrls: ['./registered-exam.component.scss'],
  providers: [DatePipe]
})
export class RegisteredExamComponent implements OnInit {
  @ViewChild('tabset', { static: true }) tabset: TabsetComponent;
  public studentInfoFormGroup: FormGroup;
  private appRoutes: any = {};
  public candidateGuid: any;
  public candidateImage: any;
  public signatureImage: any;
  public face_percent: any;
  public color_percent: any;
  public registration_status: any;

  constructor(
    private restService: GlobalRestService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private primaryHeader: PrimaryHeaderService,
    private configService: AppsettingsConfService,
    private router: Router, private messageService: MessageService
  ) {
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
    this.primaryHeader.pageTitle.next("Manage Registered Candidate");
    this.tabset.tabs[1].active = true;
    this.initializeFields();

    this.route.params.subscribe((params: Params) => {
      this.candidateGuid = params['candidateGuid'];
      this.getCandidateInfo(this.candidateGuid);
    }, error => {
      console.error('Error: ', error);
    });
  }

  initializeFields() {
    this.studentInfoFormGroup = new FormGroup({
      code: new FormControl({ value: '', disabled: true }),
      registration_date: new FormControl({ value: '', disabled: true }),
      name: new FormControl({ value: '', disabled: true }),
      father_name: new FormControl({ value: '', disabled: true }),
      dob: new FormControl({ value: '', disabled: true }),
      gender: new FormControl({ value: '', disabled: true }),
      category: new FormControl({ value: '', disabled: true }),
      ph: new FormControl({ value: '', disabled: true }),
      pay_status: new FormControl({ value: '', disabled: true }),
      registration_status: new FormControl({ value: '', disabled: true }),
      city_name: new FormControl({ value: '', disabled: true }),
      state_name: new FormControl({ value: '', disabled: true }),
      //country: new FormControl({ value: '', disabled: true }),
      pin_code: new FormControl({ value: '', disabled: true })
    })
  }
  public getCandidateInfo(candidateGUID) {
    let keyData = [
      {
        "name": "candidateGuid",
        "value": candidateGUID
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Candidates.getCandidateInfo;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.candidateImage = successResponse.candidate_info[0].image_value.split('~')[0];
      this.signatureImage = successResponse.candidate_info[0].signature_value;
      this.face_percent = successResponse.candidate_info[0].face_percent;
      this.color_percent = successResponse.candidate_info[0].color_percent;
      this.bindFieldsValues(successResponse.candidate_info[0])
    })
  }
  public bindFieldsValues(result: any) {
    result["ph"] = result.ph == "0" ? "No" : "Yes";
    result["registration_date"] = this.datePipe.transform(result.registration_date, 'yyyy-MM-dd');
    result["dob"] = this.datePipe.transform(result.dob, 'yyyy-MM-dd');
    result["registration_status"] = result.status_text !== '' && result.status_text !== undefined ? result.status_text : result.registration_status;
    this.registration_status = result["registration_status"];
    this.studentInfoFormGroup.patchValue(result);
  }
  public viewRegistrationForm() {
    this.router.navigate(['/candidates/' + this.candidateGuid + '/view'])
  }

  public updateCandidateStatus(_statusCode) {
    let keyData = [
      {
        "name": "statusCode",
        "value": _statusCode
      },
      {
        "name": "candidateGuid",
        "value": this.candidateGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Candidates.updateCandidateStatus;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS').subscribe(result => {
          if (result == true) {
            this.messageService.hideModal();
            this.getCandidateInfo(this.candidateGuid);
          }
          else {
            this.messageService.hideModal();
          }
        });
      },
        errorResponse => {
          //this.messageService.alert(errorResponse);
          this.messageService.notify(errorResponse.httpErrorResponse);
        }
      );
  }
  public updateEventEmit() {
    this.getCandidateInfo(this.candidateGuid);
  }
}