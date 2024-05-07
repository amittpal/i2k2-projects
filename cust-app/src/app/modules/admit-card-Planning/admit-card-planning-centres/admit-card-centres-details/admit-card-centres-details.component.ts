import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from '../../../../services/rest/global-rest.service';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from '../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { AdmitCard, HandelError } from '../../../../shared/enumrations/app-enum.enumerations';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import bubbleConfig from "src/assets/config/bubbleconfig.json";
import { RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-admit-card-centres-details',
  templateUrl: './admit-card-centres-details.component.html',
  styleUrls: ['./admit-card-centres-details.component.scss']
})
export class AdmitCardCentresDetailsComponent implements OnInit {
  public centresDetaildFormGroup: FormGroup;
  private appRoutes: any = {};
  public orgionalData: any;
  public loadingData: any;
  public pocData=[];
  public itemPocCount=0;
  public networkGroupData=[];
  public itemNetworkCount=0;
  public displayMessage: any;
  public notFound: boolean = false;
  public pocNotFound: boolean = false;


  constructor(private route: ActivatedRoute, private restService: GlobalRestService, private configService: AppsettingsConfService,
    private messageService: MessageService, private router: Router, private primaryHeader: PrimaryHeaderService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }

  ngOnInit() {
    this.centresDetaildFormGroup = new FormGroup({
      exam_number: new FormControl({value:'',disabled:true}),
      centre_type:new FormControl({value:'',disabled:true}),
      number_of_networkgroup:new FormControl({value:'',disabled:true}),
      exam_type:new FormControl({value:'',disabled:true}),
      centre_code:new FormControl({value:'',disabled:true}),
      number_of_buiding:new FormControl({value:'',disabled:true}),
      exam_code:new FormControl({value:'',disabled:true}),
      centre_name:new  FormControl({value:'',disabled:true}),
      number_of_rooms:new  FormControl({value:'',disabled:true})
    });
    this.route.params.subscribe((params: Params) => {
     
      this.getData(params['id'],params["shift"]);
      this.getPocData(params['id'],params["shift"]);
      this.getNetworkGroupData(params['id'],params["shift"]);
    }, error => {
      console.error('Error: ', error);
    });
  }
  
  getData(id : any,shift:any) {
    var keyData = [
      {
        "name": "id",
        "value": id
      },
      {
        "name":"shift",
        "value":shift
      }

    ];
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardCentresDetails;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.orgionalData = Object.assign([], sucessResponse.centres[0]);
        this.loadingData = sucessResponse.centres[0]; 
       // console.log(this.loadingData.exam_guid);
        this.initializeFields(this.loadingData);
      }, errorResponse => {
        if (errorResponse !== undefined) {
        //  this.notFound = true;
          this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
        }
      });
  }
  
  public initializeFields(result:any) {
    this.centresDetaildFormGroup = new FormGroup({
      exam_number: new FormControl({value:result.exam_number,disabled:true}),
      centre_type:new FormControl({value:result.centre_type,disabled:true}),
      number_of_networkgroup:new FormControl({value:result.number_of_networkgroup,disabled:true}),
      exam_type:new FormControl({value:result.exam_type,disabled:true}),
      centre_code:new FormControl({value:result.centre_code,disabled:true}),
      number_of_buiding:new FormControl({value:result.number_of_buiding,disabled:true}),
      exam_code:new FormControl({value:result.exam_code,disabled:true}),
      centre_name:new  FormControl({value:result.centre_name,disabled:true}),
      number_of_rooms:new  FormControl({value:result.number_of_rooms,disabled:true})
    });
   
  }
  
  getPocData(id : any,shift:any) {
    var keyData = [
      {
        "name": "id",
        "value": id
      },
      {
        "name":"shift",
        "value":shift
      }

    ];
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getpocList;
    this.restService.callApi(keyData)

      .subscribe(sucessResponse => {
      
        this.pocData = sucessResponse.poc; 
      //  this.itemPocCount=this.pocData.length;
        this.pocNotFound = false;
  
      }, errorResponse => {
        if (errorResponse !== undefined) {
          this.pocNotFound = true;
         // this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
        }
      });
  }


  getNetworkGroupData(id : any,shift:any) {
    var keyData = [
      {
        "name": "id",
        "value": id
      },
      {
        "name":"shift",
        "value":shift
      }

    ];
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getNetworkDetailsList;
    this.restService.callApi(keyData)

      .subscribe(sucessResponse => {
  
        this.networkGroupData = sucessResponse.network_groups; 
       
       // this.itemNetworkCount=this.networkGroupData.length;
   
        this.notFound = false;
  
      }, errorResponse => {
        if (errorResponse !== undefined) {
          this.notFound = true;
        //  this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
        }
      });
  }

  public btnClick()
{
  this.router.navigateByUrl('admitcard/centres/'+this.loadingData.exam_guid+'/view')
}
}
