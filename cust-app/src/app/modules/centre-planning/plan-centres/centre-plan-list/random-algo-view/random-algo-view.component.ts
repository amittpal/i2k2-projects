import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError } from 'src/app/shared/models/app.models';
import { Centre} from "../../../../../shared/enumrations/app-enum.enumerations";

@Component({
  selector: 'app-random-algo-view',
  templateUrl: './random-algo-view.component.html',
  styleUrls: ['./random-algo-view.component.scss']
})
export class RandomAlgoViewComponent implements OnInit {
  public randomAlgoFormGroup: FormGroup;
  private appRoutes: any = {};
  private regGuid: any;
  public algoList=[];

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
    this.getAlgo();
    this.primaryHeader.pageTitle.next("Random Algo");
    this.randomAlgoFormGroup = new FormGroup({   
      registration_code: new FormControl({value:'',disabled:true}),
      registration_name: new FormControl({value:'',disabled:true}),
      total_candidate: new FormControl({value:'',disabled:true}),
      random_algo_id:new FormControl({value:'',disabled:true}),
      algo_seed: new FormControl({value:'',disabled:true})
    });
    this.route.params.subscribe((params: Params) => {
      this.regGuid = params['regGuid'];
      this.getData(params['regGuid']);
    }, error => {
      console.error('Error: ', error);
    });
  }

  getData(regGuid : any) {
    var keyData = [
      {
        "name": "regGuid",
        "value": regGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Centre.getRandomAlgo;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        console.log(sucessResponse.random_algo[0]);
        this.initializeFields(sucessResponse.random_algo[0]);
     
      });
  }

  public initializeFields(result:any) {
    this.randomAlgoFormGroup = new FormGroup({
      registration_code: new FormControl({value:result.registration_code,disabled:true}),
      registration_name: new FormControl({value:result.registration_Name,disabled:true}),
      total_candidate: new FormControl({value:result.total_candidates,disabled:true}),
      random_algo_id: new FormControl({value:result.id,disabled:true}),
      algo_seed: new FormControl({value:result.algo_seed,disabled:true}),
      
    });
   }

  getAlgo() {    
    this.restService.ApiEndPointUrlOrKey = Centre.getRandomAlgoList;
    this.restService.callApi().subscribe(successResponse => {
      this.algoList = successResponse.distributions_algo;
    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

 

}
