import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from '../../../services/rest/global-rest.service'; 
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service'; 
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import { HandelError, Jobs } from '../../../shared/enumrations/app-enum.enumerations';


@Component({
  selector: 'app-job-types-view',
  templateUrl: './job-types-view.component.html',
  styleUrls: ['./job-types-view.component.scss']
})
export class JobTypesViewComponent implements OnInit {
  public viewJobTypesFormGroup: FormGroup;
  private appRoutes: any = {};

  constructor(private route: ActivatedRoute, private restService: GlobalRestService, private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService, private router: Router) {
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
    this.primaryHeader.pageTitle.next("Job Type View");
    this.viewJobTypesFormGroup = new FormGroup({
      name: new FormControl({value:'', disabled: true}),
      code: new FormControl({value:'', disabled: true}),
      description: new FormControl({value:'', disabled: true}),
      default_timeout_minutes: new FormControl({value:'', disabled: true}),
      recurring_interval_hour: new FormControl({value:'', disabled: true}),
      create_on_fail: new FormControl({value:'YES', disabled: true}),
      action: new FormControl({value:'', disabled: true}),
      recurring: new FormControl({value:'1', disabled: true}),
      status: new FormControl({value:'1', disabled: true})
    });
    this.route.params.subscribe((params: Params) => {
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
        this.initializeFields(sucessResponse.job_types[0]);
      });
  }

  public initializeFields(result:any) {
    this.viewJobTypesFormGroup = new FormGroup({      
      name: new FormControl({value: result.name, disabled: true}),
      code: new FormControl({value: result.code, disabled: true}),
      description: new FormControl({value: result.description, disabled: true}),
      default_timeout_minutes: new FormControl({value: result.default_timeout_minutes, disabled: true}),
      recurring_interval_hour: new FormControl({value: result.recurring_interval_hour, disabled: true}),
      create_on_fail: new FormControl({value: result.create_on_fail, disabled: true}),
      action: new FormControl({value: result.action, disabled: true}),
      recurring: new FormControl({value: result.recurring, disabled: true}),
      status: new FormControl({value: result.status, disabled: true}) 
    });
  }

}