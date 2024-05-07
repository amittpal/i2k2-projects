import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Jobs } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';

@Component({
  selector: 'app-jobs-view',
  templateUrl: './jobs-view.component.html',
  styleUrls: ['./jobs-view.component.scss']
})
export class JobsViewComponent implements OnInit {
  public  viewJobsFormGroup: FormGroup;
  private appRoutes: any = {};
  public jobTypes = [];
  public jobStatusList = [];
  public loadingData: any;
  public orgionalData: any;
  public jobId: any;
  constructor(private configService: AppsettingsConfService, private router: Router, private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private restService: GlobalRestService,
    private route: ActivatedRoute) {
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
    this.primaryHeader.pageTitle.next("Job View");
    this.route.params.subscribe((params: Params) => {
      this.jobId = params['id'];
      this.getData(params['id']);
    }, error => {
      console.error('Error: ', error);
    });
    this.getJobTypeList();
    this.getJobStatusList();
    this.initializeFields();

  }
  public initializeFields() {
    this. viewJobsFormGroup = new FormGroup({
      id: new FormControl(''),
      job_type_id: new FormControl('', Validators.required),
      job_status_id: new FormControl('', Validators.required),
      job_access_counter: new FormControl('', Validators.required),
      default_threshold_limit: new FormControl('', Validators.required),
      run_date_time: new FormControl('', Validators.required),
      parent_job_id: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      recurring: new FormControl('1', Validators.required),
      status: new FormControl('', Validators.required)
    });
  }
  getData(id: any) {
    var keyData = [
      {
        "name": "jobId",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Jobs.getJobDetailsById;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.orgionalData = Object.assign([], sucessResponse.job_types[0]);
        this.setInitializeFields(sucessResponse.job_types[0]);
        this.loadingData = sucessResponse.job_types[0];
      });
  }

  public setInitializeFields(result: any) {
    this. viewJobsFormGroup = new FormGroup({
      id: new FormControl(result.id),
      job_type_id: new FormControl(result.job_type_id, Validators.required),
      job_status_id: new FormControl(result.job_status_id, Validators.required),
      job_access_counter: new FormControl(result.job_access_counter, Validators.required),
      default_threshold_limit: new FormControl(result.default_threshold_limit, Validators.required),
      run_date_time: new FormControl(result.run_date_time, Validators.required),
      parent_job_id: new FormControl(result.parent_job_id, Validators.required),
      code: new FormControl(result.code, Validators.required),
      recurring: new FormControl(result.recurring, Validators.required),
      status: new FormControl(result.status, Validators.required)
    });
    this.jobId = result.id;
  }
  private getParams() {
    let params = this. viewJobsFormGroup.getRawValue();
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
    if (this. viewJobsFormGroup.valid === false) {
      let form = document.getElementById(' viewJobsForm');
      form.classList.add('was-validated');
    } else if (this. viewJobsFormGroup.valid === true) {
      let params = this.getParams();
      var keyData = [
        {
          "name": "jobId",
          "value": this.jobId
        }
      ];
      // call api code here...
      if (Object.keys(this.appRoutes).length !== 0) {
        this.restService.ApiEndPointUrlOrKey = Jobs.updateJobs;
        this.restService.ApiEndPointMehod = RestMethods.Put;
        this.restService.HttpPostParams = params;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi(keyData)
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
    let form = document.getElementById(' viewJobsForm');
    form.classList.remove('was-validated');
    this. viewJobsFormGroup.reset();
    this.initializeFields();
    let params = this.getParams();
  }
}