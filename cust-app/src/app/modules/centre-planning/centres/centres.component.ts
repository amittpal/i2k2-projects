import { Component, OnInit, Input } from '@angular/core';
import { FilterService } from 'src/app/services/filter/filter.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalRestService } from '../../../services/rest/global-rest.service';
import { HandelError, ImportedCentres } from '../../../shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import { RestMethods } from '../../../shared/models/app.models';


@Component({
  selector: 'app-centres',
  templateUrl: './centres.component.html',
  styleUrls: ['./centres.component.scss']
})
export class CentresComponent implements OnInit {
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
  public allSelect = 0;

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
    this.originaldataAddCentres = Object.assign([], this.dataAddCentres);
    this.filterService.cityListValue.subscribe((data) => {
      this.CentresGuid = data;
      this.getCentresList();
    })

  }
  getCentresList() {
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getCentresList;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = this.searchParams();
    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.items = sucessResponse.centre;
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
      registration_guid: this.importData.regName
    };
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.saveImportMeta;
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

    //   if(this.centresData!=undefined)
    //  this.ngOnInit();

  }

  OnDestroy() {

    debugger;
    this.filterService.stateListValue.unsubscribe();
    this.filterService.cityListValue.unsubscribe();
  }

  addAllRow() {
    if (this.allSelect === 0) {

      this.messageService.confirm(["Are you sure you want to select all centres?"], "Alert", "Yes", "NO", "error").subscribe(result => {
        if (result == true) {
          this.messageService.hideModal();
          this.items.forEach(element => {
            element.is_select = '1'

          });
          this.allSelect = 1
        }

        else

        {
          this.messageService.hideModal();
        }
      });
    }

    else {

      this.messageService.confirm(["Are you sure you want to remove all centres?"], "Alert", "Yes", "NO", "error").subscribe(result => {
        if (result == true) {
          this.messageService.hideModal();
          this.items.forEach(element => {
            element.is_select = '0'

          });
          this.allSelect = 0;
        }

        else
        {
          this.messageService.hideModal();
        }
      });
    }
  }

}
