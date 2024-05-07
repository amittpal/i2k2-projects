import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from '../../../services/rest/global-rest.service';
import { HandelError, Jobs } from '../../../shared/enumrations/app-enum.enumerations';
import { RestMethods } from '../../../shared/models/app.models';

@Component({
  selector: 'app-jobs-add',
  templateUrl: './jobs-add.component.html',
  styleUrls: ['./jobs-add.component.scss']
})
export class JobsAddComponent implements OnInit {
  public addJobsFormGroup: FormGroup;
  private appRoutes: any = {};
  public jobTypes = [];
  public jobStatusList=[];
  constructor(private configService: AppsettingsConfService, private router: Router, private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private restService: GlobalRestService) {
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
    this.primaryHeader.pageTitle.next("Job Add");
    this.getJobTypeList();
    this.getJobStatusList();
    this.initializeFields();

  }
  public initializeFields() {
    this.addJobsFormGroup = new FormGroup({
      id: new FormControl('0'),
      job_type_id: new FormControl('', Validators.required),
      job_status_id: new FormControl('', Validators.required),
      job_access_counter: new FormControl('', Validators.required),
      default_threshold_limit: new FormControl('', Validators.required),
      run_date_time: new FormControl('', Validators.required),
      parent_job_id: new FormControl('0'),
      code: new FormControl('', Validators.required),
      recurring: new FormControl('1', Validators.required),
      status: new FormControl('', Validators.required)
    });
  }
  private getParams() {
    let params = this.addJobsFormGroup.getRawValue();
    return params;
  }
  getJobTypeList() {
    this.restService.ApiEndPointUrlOrKey = Jobs.getJobTypeList;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.jobTypes = sucessResponse.job_types;
      }, errorResponse => {
        if (errorResponse !== undefined) {
          //this.messageService.ok(errorResponse);
        }
      }
      );
  }
  getJobStatusList() {
    this.restService.ApiEndPointUrlOrKey = Jobs.getJobStatusList;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.jobStatusList = sucessResponse.status;
      }, errorResponse => {
        if (errorResponse !== undefined) {
          //this.messageService.ok(errorResponse);
        }
      }
      );
  }
  public formSubmit() {
    if (this.addJobsFormGroup.valid === false) {
      let form = document.getElementById('addJobsForm');
      form.classList.add('was-validated');
    } else if (this.addJobsFormGroup.valid === true) {
      let params = this.getParams();
      // call api code here...
      if (Object.keys(this.appRoutes).length !== 0) {
        this.restService.ApiEndPointUrlOrKey = Jobs.addJobs;
        this.restService.ApiEndPointMehod = RestMethods.Post;
        this.restService.HttpPostParams = params;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi()
          .subscribe(sucessResponse => {
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
              if (result == true) { // OK = true for redirection
                this.messageService.hideModal();
                this.router.navigate(['jobs']);
              }
              else { // NO/CANCEL = false
                this.messageService.hideModal();
              }
            });
          }, errorResponse => {
            if (errorResponse !== undefined) {
              //this.messageService.ok(errorResponse);
            }
          }
          );
      }
    }
  }

  public reset() {
    let form = document.getElementById('addJobsForm');
    form.classList.remove('was-validated');
    this.addJobsFormGroup.reset();
    this.initializeFields();
    let params = this.getParams();
  }
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
}