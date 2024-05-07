import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppsettingsConfService } from  '../../../services/conf/appsettings-conf/appsettings-conf.service';
import { Router } from '@angular/router';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { GlobalRestService } from '../../../services/rest/global-rest.service'; 
import { HandelError, Jobs } from '../../../shared/enumrations/app-enum.enumerations';
import { RestMethods } from  '../../../shared/models/app.models';

@Component({
  selector: 'app-job-types-add',
  templateUrl: './job-types-add.component.html',
  styleUrls: ['./job-types-add.component.scss']
})
export class JobTypesAddComponent implements OnInit {
public addJobTypesFormGroup: FormGroup;
  private appRoutes: any = {};
  
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
    this.primaryHeader.pageTitle.next("Job Type Add");
    this.initializeFields();
  }
  public initializeFields() {
    this.addJobTypesFormGroup = new FormGroup({
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
  }
  private getParams() {
    let params = this.addJobTypesFormGroup.getRawValue();
    return params;
  }

  public formSubmit() {
    if (this.addJobTypesFormGroup.valid === false) {
      let form = document.getElementById('addJobTypesForm');
      form.classList.add('was-validated');
    } else if (this.addJobTypesFormGroup.valid === true) {
      let params = this.getParams();
      // call api code here...
      if (Object.keys(this.appRoutes).length !== 0) {
        this.restService.ApiEndPointUrlOrKey = Jobs.addJobTypes;
        this.restService.ApiEndPointMehod = RestMethods.Post;
        this.restService.HttpPostParams = params;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi()
          .subscribe(sucessResponse => {
            this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
              if (result == true) { // OK = true for redirection
                this.messageService.hideModal();
                this.router.navigate(['jobs/types']);
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
    let form = document.getElementById('addJobTypesForm');
    form.classList.remove('was-validated');
    this.addJobTypesFormGroup.reset();
    this.initializeFields();
    let params = this.getParams();
  }
}