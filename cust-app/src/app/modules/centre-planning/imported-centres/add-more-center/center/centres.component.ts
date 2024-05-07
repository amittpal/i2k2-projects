import { Component, OnInit, Input } from '@angular/core';
import { FilterService } from 'src/app/services/filter/filter.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { HandelError, RestMethods } from 'src/app/shared/models/app.models';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ImportedCentres } from 'src/app/shared/enumrations/app-enum.enumerations';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-more-centres',
  templateUrl: './centres.component.html',
  styleUrls: ['./centres.component.scss']
})
export class AddMoreCentresComponent implements OnInit {
  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  CentresGuid = [];
  private appRoutes: any = {};
  public CentresList: any;
  public dataAddCentres: any;
  public originalCentresData: Array<any>;
  public originaldataAddCentres: Array<any>;
  public displayMessage: any;
  public importCentreResponse: any;
  public importJson: any;
  public notFound: boolean = false;
  public rowIsSelected: boolean = false;
  selectedCentres = [];
  public importId: any;
  @Input() importData: any;
  @Input() centresData: any;
  constructor(private route: ActivatedRoute, private restService: GlobalRestService, private authService: AuthService, private filterService: FilterService,
    private configService: AppsettingsConfService, private messageService: MessageService, private router: Router,
    private primaryHeader: PrimaryHeaderService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }
  ngOnInit() {
    this.dataAddCentres = [];
    this.route.params.subscribe((params: Params) => {
      this.importId = params['id'];
    }, error => {
      console.error('Error: ', error);
    });
    this.originaldataAddCentres = Object.assign([], this.dataAddCentres);
    this.filterService.cityListValue.subscribe((data) => {
      this.CentresGuid = data;
      this.getCentresList();
    })

  }

  getCentresList() {
    this.items = [];
    //initial layout types list  
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getCentresList;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = this.searchParams();
    const initialCentresList = this.restService.callApi();
    //initial layout types list 
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getNewCentresList;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.HttpPostParams = this.newSearchParam();
    const newCentresList = this.restService.callApi();
    forkJoin([initialCentresList, newCentresList]).subscribe((successResponse) => {
      if (successResponse[0].centre && successResponse[1].centre) {
        this.unique(successResponse[0].centre, successResponse[1].centre)
      }
      this.itemCount = this.items.length;

    }, errorResponse => {
      if (errorResponse !== undefined) {
        this.items = [];
        // this.notFound = true;
        // this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
      }
    }
    );
  }
  unique(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
      let flag = 0;
      for (var j = 0; j < arr2.length; j++) {
        if (arr1[i].guid === arr2[j].guid) {
          arr2.splice(j, 1);
          j--;
          flag = 1;
        }
      }

      if (flag ==0) {
        this.items.push(arr1[i]);
      }
    }
    //this.items.push(arr2);
    return this.items;
  }
  public newSearchParam() {
    let parameter = {
      "import_id": this.importId,
      "city": this.CentresGuid.map(s => ({ "guid": s.guid })),
    }
    return parameter;
  }
  public searchParams() {
    var parameters = {
      import_parameters: {
        city_guid: this.CentresGuid.map(s => ({ "guid": s.guid })),

        centre_code: this.centresData == undefined ? "" : this.centresData.centre_code,
        centre_name: this.centresData == undefined ? "" : this.centresData.centre_name,
        centre_type_guid: this.centresData == undefined ? "" : this.centresData.centre_type_guid,
        total_min_seat: this.centresData == undefined ? "" : this.centresData.total_min_seat,
        total_max_seat: this.centresData == undefined ? "" : this.centresData.total_max_seat,
        normal_min_seat: this.centresData == undefined ? "" : this.centresData.normal_min_seat,
        normal_max_seat: this.centresData == undefined ? "" : this.centresData.normal_max_seat,
        ph_min_seat: this.centresData == undefined ? "" : this.centresData.ph_min_seat,
        ph_max_seat: this.centresData == undefined ? "" : this.centresData.ph_max_seat,
        rating: this.centresData == undefined ? "" : this.centresData.rating
      },

    };
    return parameters;
  }
  onformSubmit() {

    this.getImportJson();
  }
  getImportJson() {
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getImportJson;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = this.importParams();
    this.restService.callApi().subscribe(successResponse => {
      this.importJson = successResponse.import_centers;
      this.importMeta();
    }, errorResponse => {
      console.error('ERROR: ', errorResponse);
    });
  }

  importParams() {
    if (this.items.filter(ob => ob.is_select === '1').length > 0) {
      var parameters = {
        import_parameters: {
          centre_guid: this.items.filter(ob => ob.is_select === '1').map(s => ({ "guid": s.guid }))
        }
      };
      return parameters;
    }
    else {
      this.messageService.ok('Please select atlest one centre');
    }
  }

  importMeta() {
    let parameters = {
      import_number: this.importData.import_number,
      code: this.importData.import_code,
      name: this.importData.import_name,
      import_centers: this.importJson,
      id:this.importId
    };
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.saveMoreImportMeta;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = parameters;
    //call api
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.messageService.okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List').subscribe(result => {
          if (result == true) { // OK = true for redirection
            this.messageService.hideModal();
            this.router.navigate(['imported/centres']);
          }
          else { // NO/CANCEL = false
            this.messageService.hideModal();
          }
        });
      }, errorResponse => {
        if (errorResponse !== undefined) {
          // this.messageService.ok(errorResponse);
        }
      }
      );
  }

  reset() {

    this.ngOnInit();

  }

  addRow(data: any) {
    let item = this.items.find(c => c.guid === data.guid);
    if (item) {
      if (item.is_select === '0') {
        this.items.find(c => c.guid === data.guid).is_select = '1';
      }
      else {
        this.items.find(c => c.guid === data.guid).is_select = '0';
      }

    }



  }

  ngOnChanges() {

    if (this.centresData != undefined)
      this.ngOnInit();

  }

  OnDestroy() {
    this.filterService.stateListValue.unsubscribe();
    this.filterService.cityListValue.unsubscribe();
  }

}
