import { Component, OnInit, Input } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { FilterService } from 'src/app/services/filter/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalRestService } from '../../../../../services/rest/global-rest.service';
import { HandelError, ImportedCentres } from '../../../../../shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';
import { AppsettingsConfService } from '../../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PrimaryHeaderService } from '../../../../layout/primary-header/primary-header.service';


@Component({
  selector: 'app-add-more-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class AddMoreCityComponent implements OnInit {
  private appRoutes: any = {};
  public citiesList= []
  public originalCitiesData:Array<any>;
  @Input() tabset: TabsetComponent;
  @Input() regGuid:any;

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
    
  }
  onformSubmit() {
    this.tabset.tabs[2].active = true;
  }
  ngOnDestroy() {

  }
  getCityList(regGuid: any) {
    var keyData = [
      {
        "name": "regGuid",
        "value": regGuid
      }
    ];

    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getCitiesList;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.originalCitiesData = successResponse.citylist;
      this.filterService.cityListValue.next(this.originalCitiesData);
     

    }, errorResponse => {
      console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  ngOnChanges() 
  { 
    
    if(this.regGuid!=undefined)
    {
      console.log(">>>>>>",this.regGuid);
      this.getCityList(this.regGuid);
    }
  }

}
