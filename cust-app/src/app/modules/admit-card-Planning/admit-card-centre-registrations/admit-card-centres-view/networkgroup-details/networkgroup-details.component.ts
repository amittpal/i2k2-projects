import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FilterService } from "src/app/services/filter/filter.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import { HandelError, AdmitCard} from "src/app/shared/enumrations/app-enum.enumerations";
import { MessageService } from "ngx-ixcheck-message-lib";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { RestMethods } from "src/app/shared/models/app.models";
// import { SharedService } from "../../../../../../"//"../../../../../../service/shared.service";

@Component({
  selector: 'app-networkgroup-details',
  templateUrl: './networkgroup-details.component.html',
  styleUrls: ['./networkgroup-details.component.scss']
})
export class NetworkgroupDetailsComponent implements OnInit {
  @Input("rowItemData") rowItemData: any;
  @Input() importData: any;
  @Output() private childComponentData = new EventEmitter<number>();
  public items = [];
  public itemCount = 0;
  private appRoutes: any = {};
 
  
  constructor(
   
    private route: ActivatedRoute,
    private restService: GlobalRestService,
    private authService: AuthService,
    private filterService: FilterService,
    private configService: AppsettingsConfService,
    private messageService: MessageService,
    private router: Router,
    private primaryHeader: PrimaryHeaderService
  ) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(
      configData => {
        this.appRoutes = configData;
      },
      error => {
        console.error("Error for configService.getAppRoutes: ", error);
      }
    );
  }
  ngOnInit() {
    this.getNetworkList();
  }

  getNetworkList() {
    debugger;
    var keyData = [
      {
        name: "examGuid",
        value: this.rowItemData["exam_guid"]
      },
      {
        name: "centreGuid",
        value: this.rowItemData["centres_guid"]
      },
    
      {
        name: "shiftNumber",
        value: this.rowItemData["shift_number"]
      }
      
    ];

    this.restService.ApiEndPointUrlOrKey = AdmitCard.getNetworksList;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    // this.restService.HttpPostParams = this.searchParams();
    this.restService.callApi(keyData).subscribe(
      sucessResponse => {
        let data = sucessResponse.network_groups;
        this.items = data;
        this.itemCount = this.items.length;
      },
      errorResponse => {
        if (errorResponse !== undefined) {
          // this.notFound = true;
          // this.displayMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
        }
      }
    );
  }

  createPackage(examGuid:any,centreGuid:any,shift:any,assetGuid:any,registration_guid:any) 
  {


    this.messageService.confirm(["Are you sure you want reset exam?"], "Alert", "Yes", "NO", "error").subscribe(result => {
      if (result == true) {
        this.messageService.hideModal();
        var keyData = [
          {
            name: "examGuid",
            value: examGuid
          },
          {
            name: "centreGuid",
            value: centreGuid
          },
        
          {
            name: "shift",
            value: shift
          },
          {
            name: "networkGuid",
            value: assetGuid
          },
          {
            name:"regGuid",
            value:registration_guid

          }
          
        ];
    
   
        this.restService.ApiEndPointUrlOrKey = AdmitCard.createPackage;
        this.restService.ApiEndPointMehod = RestMethods.Get;
        this.restService.callApi(keyData).subscribe(successResponse => {

          this.messageService.okRedirectModal(successResponse, 'SUCCESS').subscribe(result => {

            if (result == true) { // OK = true for redirection
              this.messageService.hideModal();
           
            }
            else { // NO/CANCEL = false
              this.messageService.hideModal();
            }
          });
        }, () => {
          this.messageService.hideModal();
        });
      } else {
        this.messageService.hideModal();
      }
    })

    
  }
}
