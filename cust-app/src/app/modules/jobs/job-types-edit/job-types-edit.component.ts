import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from '../../../services/rest/global-rest.service'; 
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service'; 
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import { HandelError, Jobs } from '../../../shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-job-types-edit',
  templateUrl: './job-types-edit.component.html',
  styleUrls: ['./job-types-edit.component.scss']
})
export class JobTypesEditComponent implements OnInit {
  public editJobTypesFormGroup: FormGroup;
  private appRoutes: any = {};
  private jobTypeId: any;
  private orgionalData: any;
  public loadingData: any;

  constructor(private route: ActivatedRoute, private restService: GlobalRestService, private configService: AppsettingsConfService,
    private messageService: MessageService, private primaryHeader: PrimaryHeaderService, private router: Router) {
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
    this.primaryHeader.pageTitle.next("Job Type Edit");
    this.editJobTypesFormGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      default_timeout_minutes: new FormControl('', Validators.required),
      recurring_interval_hour: new FormControl('', Validators.required),
      create_on_fail: new FormControl('YES', Validators.required),
      action: new FormControl('', Validators.required),
      recurring: new FormControl('1', Validators.required),
      status: new FormControl('1', Validators.required)
    });
    this.route.params.subscribe((params: Params) => {
      this.jobTypeId = params['id'];
      this.getData(params['id']);
    }, error => {
      console.error('Error: ', error);
    });
  }

  getData(id :any) {
    var keyData = [
      {
        "name": "jobTypeId",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Jobs.getJobTypesById;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.orgionalData = Object.assign([], sucessResponse.job_types[0]);
        this.initializeFields(sucessResponse.job_types[0]);
        this.loadingData = sucessResponse.job_types[0];
      });
  }

  public initializeFields(result:any) {
    this.editJobTypesFormGroup = new FormGroup({
      name: new FormControl(result.name, Validators.required),
      code: new FormControl(result.code, Validators.required),
      description: new FormControl(result.description, Validators.required),
      default_timeout_minutes: new FormControl(result.default_timeout_minutes, Validators.required),
      recurring_interval_hour: new FormControl(result.recurring_interval_hour, Validators.required),
      create_on_fail: new FormControl(result.create_on_fail, Validators.required),
      action: new FormControl(result.action, Validators.required),
      recurring: new FormControl(result.recurring, Validators.required),
      status: new FormControl(result.status, Validators.required), 
    });
    this.jobTypeId = result.id;
  }

  private getParams() {
    let params = this.editJobTypesFormGroup.value;
    params['id'] = this.jobTypeId;
    return params;
  }

  public formSubmit() {
    let form = document.getElementById('editJobTypesForm');
    if (this.editJobTypesFormGroup.valid === false) {
      form.classList.add('was-validated');
    } else {
      form.classList.add('was-validated');
      let params = this.getParams();
      if (Object.keys(this.appRoutes).length !== 0) {
        var keyData = [
          {
            "name": "jobTypeId",
            "value": this.jobTypeId
          }
        ]
        this.restService.ApiEndPointUrlOrKey = Jobs.updateJobTypes;
        this.restService.HttpPostParams = params;
        this.restService.callApi(keyData).subscribe(successRespnse => {
          this.messageService.okRedirectModal(successRespnse, 'SUCCESS', 'Go to List').subscribe(result =>
            {
              if(result == true) {
                this.messageService.hideModal();
                this.router.navigate(['jobs/types']);
              } else {
                this.messageService.hideModal();
              }
            })
        })
      }

    }
  }

  public reset() {
    let form = document.getElementById('editJobTypesForms');
    form.classList.remove('was-validated');
    this.editJobTypesFormGroup.reset();
    this.initializeFields(this.orgionalData);
  }

}
 