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
  selector: 'app-map-centres',
  templateUrl: './map-centres.component.html',
  styleUrls: ['./map-centres.component.scss']
})
export class MapCentresComponent implements OnInit {

public mapCentreFormGroup: FormGroup;
public orginalData:any;
public difficultyLevelId:any;
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


public search_config: any = {
  "imported_centres_filter":
  {
    "imported_centres": {},
    "cols": [],
    "paging": {
      "total_rows": 0,
      "returned_rows": 0,
      "direction": 0,
      "order_dir": "",
      "page_size": 10,
      "sort_by": "",
      "last_offset": 0,
      "last_seen_id_max": 0,
      "last_seen_id_min": 0
    }
  }
};

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
 
  this.primaryHeader.pageTitle.next("Map Centres");
  this.showFilter();
  this.mapCentreFormGroup = new FormGroup({
  importedCentreCode: new FormControl('', Validators.required),
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
  this.restService.ApiEndPointUrlOrKey = ImportedCentres.getCentresMappingById;
  this.restService.callApi(keyData)
    .subscribe(sucessResponse => {
      this.orgionalData = Object.assign([], sucessResponse.imported_centres[0]);
      this.loadingData = sucessResponse.imported_centres[0]; 
      this.initializeFields(this.loadingData);
    });
}

public initializeFields(result:any) {
  this.mapCentreFormGroup = new FormGroup({
    exam_number: new FormControl(result.exam_number, Validators.required),
    name: new FormControl(result.name, Validators.required),
    code: new FormControl(result.code, Validators.required),
    exam_type: new FormControl(result.exam_type, Validators.required),
    imported_centre_name: new FormControl(result.imported_centre_name, Validators.required),
    importedCentreCode: new FormControl('', Validators.required)
  });
  this.mapCentreId = result.id;
}

private getParams() {
  console.log(this.mapCentreFormGroup.controls.importedCentreCode.value);
  
  let params={
    exam_guid:this.orgionalData.exam_guid,
    import_id:this.mapCentreFormGroup.controls.importedCentreCode.value
  }
  return params;
}

public formSubmit() {
  

  let form = document.getElementById('mapCentreslist');
  if (this.mapCentreFormGroup.valid === false) {
    form.classList.add('was-validated');
  } else {
    form.classList.add('was-validated');
    let params = this.getParams();
    if (Object.keys(this.appRoutes).length !== 0) {
      this.restService.ApiEndPointUrlOrKey = ImportedCentres.saveCentresMapping;
      this.restService.HttpPostParams = params;
      this.restService.callApi().subscribe(successRespnse => {
        this.messageService.okRedirectModal(successRespnse, 'SUCCESS', 'Go to List').subscribe(result =>
          {
            if(result == true) {
              this.messageService.hideModal();
              this.router.navigate(['imported/mapping']);
            } else {
              this.messageService.hideModal();
            }
          })
      })
    }
  }
}

public reset() {
  let form = document.getElementById('mapCentreslist');
  form.classList.remove('was-validated');
  this.mapCentreFormGroup.reset();
  this.initializeFields(this.orgionalData);
}

public updateTable(data :any) {
  this.offset = 0;
  this.search_config.imported_centres_filter.imported_centres = data.formData;
  this.config.data[0] = data.bubbleConfig;
  this.getCentreCode(this._getRemoteParameters(), false);
  this.updatedFilter = {};
  
}
private getCentreCode(params: NgxIxcheckTableParams, fromSubmit: boolean) {
  this.resetFilterFlag = false;
  let centreSearchParams = this.getSearchParams(params, fromSubmit);
  //call api code here...
  if (Object.keys(this.appRoutes).length !== 0) {
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getImportedCentresList;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = centreSearchParams;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.importedCentresCode = sucessResponse.imported_centres;
        // this.notFound = false;
      }, errorResponse => {
        this.importedCentresCode=[];
        if (errorResponse !== undefined) {
          // this.notFound = true;           
          this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
        }
      }
    );
  }
}

private getSearchParams(params: NgxIxcheckTableParams, formSubmit: boolean) {
  this.search_config.imported_centres_filter.paging = {  
  }
  return this.search_config;
}
private _getRemoteParameters(): NgxIxcheckTableParams {
  let params = <NgxIxcheckTableParams>{};
  params.sortBy = '';
  params.sortAsc = true;
  return params;
}
onChangeCentreCode(event:any)
{
  
this.getImportedCentres(event.target.value);
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
    this.fillImportedname(this.items[0]);
    
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

fillImportedname(importResult:any)
{
    this.mapCentreFormGroup.controls['imported_centre_name'].setValue(importResult.imported_centre_name);
}
showFilter()
{
  /*
  opening filter on component load (need to refactor this logic).
  handle via input parameter in filterToggle directive
  */ 
  document.querySelector('.az-content-dashboard-three').classList.toggle('filter-show');
  document.querySelector('.az-content-dashboard-three').classList.remove('filter-mobile');
}

}

