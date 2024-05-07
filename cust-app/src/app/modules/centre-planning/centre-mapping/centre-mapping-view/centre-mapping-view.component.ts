import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from '../../../../services/rest/global-rest.service';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from '../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { ImportedCentres, HandelError } from '../../../../shared/enumrations/app-enum.enumerations';
import { NgxIxcheckTableParams } from 'ngx-ixcheck-table-lib';
import bubbleConfig from "src/assets/config/bubbleconfig.json";
import { RestMethods } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-centre-mapping-view',
  templateUrl: './centre-mapping-view.component.html',
  styleUrls: ['./centre-mapping-view.component.scss']
})
export class CentreMappingViewComponent implements OnInit {

  public mappedCentreFormGroup: FormGroup;
  
  private appRoutes: any = {};
  private mapCentreId: any;
  public orgionalData: any;
  public loadingData: any;
  public offset = 0;
  public updatedFilter: any;
  public config = bubbleConfig;
  public importedCentresCode = [];
  public resetFilterFlag: boolean = false;
  public displayMessage: any;
  public notFound: boolean = false;
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;

  phSeatAllo: any = 0;
  normalSeatAllo: number = 0;
  totalAllo: number = 0;
  
  constructor(private route: ActivatedRoute, private restService: GlobalRestService, private configService: AppsettingsConfService,
    private messageService: MessageService, private router: Router, private primaryHeader: PrimaryHeaderService) {
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
   
    this.primaryHeader.pageTitle.next("Mapped Centres View");
    this.mappedCentreFormGroup = new FormGroup({
    importedCentreCode: new FormControl({value:'', disabled:true}),
    exam_number:new FormControl({value:'',disabled:true}),
    name:new FormControl({value:'',disabled:true}),
    code:new FormControl({value:'',disabled:true}),
    exam_type:new FormControl({value:'',disabled:true}),
    imported_centre_name:new FormControl({value:'',disabled:true}),
     
    });
    this.route.params.subscribe((params: Params) => {
      this.mapCentreId = params['id'];
      this.getData(params['id']);
    }, error => {
      console.error('Error: ', error);
    });
  }
  
  getData(id : any) {
    var keyData = [
      {
        "name": "mapCentreId",
        "value": id
      }
    ];
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getMappedCentresList;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.orgionalData = Object.assign([], sucessResponse.exams[0]);
        this.loadingData = sucessResponse.exams[0]; 
        this.initializeFields(this.loadingData);
      });
  }
  
  public initializeFields(result:any) {
    this.mappedCentreFormGroup = new FormGroup({
      exam_number: new FormControl(result.exam_number, Validators.required),
      name: new FormControl(result.name, Validators.required),
      code: new FormControl(result.code, Validators.required),
      exam_type: new FormControl(result.exam_type, Validators.required),
      imported_centre_name: new FormControl(result.imported_centre_name, Validators.required),
      importedCentreCode: new FormControl(result.import_number, Validators.required)
    });
    this.getImportedCentres(result.id);
  }
  
  private getParams() {
    console.log(this.mappedCentreFormGroup.controls.importedCentreCode.value);
    
    let params={
      exam_guid:this.orgionalData.exam_guid,
      import_id:this.mappedCentreFormGroup.controls.importedCentreCode.value
    }
    return params;
  }
  
  getImportedCentres(importedId:any)
  {

    var keyData = [
      {
      "name": "importedId",
      "value": importedId
      }
    ];
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getImportedCentresListById;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi(keyData)
    .subscribe(sucessResponse => {
      this.items = sucessResponse.no_of_shifts;
      this.itemCount = this.items.length;
      this.itemCount = this.items.length;
      this.items.forEach((element, i) => {
        this.phSeatAllo += parseInt(element["pwd_seats"]);
        this.normalSeatAllo += parseInt(element["normal_seats"]);
        this.totalAllo += parseInt(element["total_seats"]);
    });

      this.items.push({
        city_name: "",
        state_name: "Total",
        pwd_seats: this.phSeatAllo,
        normal_seats: this.normalSeatAllo,
        total_seats: this.totalAllo
      });
      
  
    }, errorResponse => {
      this.items=[];
      // if (errorResponse !== undefined) {
        // this.notFound = true;           
        this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
      // }
    }
  );
  }

  }
  
  