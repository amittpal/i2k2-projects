import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import { HandelError, ImportedCentres } from "src/app/shared/enumrations/app-enum.enumerations";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { RestMethods } from "src/app/shared/models/app.models";
import { Router } from "@angular/router";

@Component({
  selector: 'app-centre-mapping-view-details',
  templateUrl: './centre-mapping-view-details.component.html',
  styleUrls: ['./centre-mapping-view-details.component.scss']
})
export class CentreMappingViewDetailsComponent implements OnInit {
  @Input("rowItemData") rowItemData: any;
  public items = [];
  public itemCount = 0;
  private appRoutes: any = {};

  constructor(
    private restService: GlobalRestService,
    private configService: AppsettingsConfService,
    private router: Router,

  ) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(
      (configData) => {
        this.appRoutes = configData;
      },
      (error) => {
        console.error("Error for configService.getAppRoutes: ", error);
      }
    );
  }

  ngOnInit() {
    this.getCentresList();
  }


  getCentresList() {
    var keyData = [

      {
        name: "id",
        value: this.rowItemData["id"],
      },
      {
        name: "cityGuid",
        value: this.rowItemData["city_guid"],
      }
    ];
    this.restService.ApiEndPointUrlOrKey = ImportedCentres.getImportedCentresListDetails;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.AlertAndErrorAction = HandelError.HideAndKill;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        this.items = sucessResponse.import_centers;
        this.itemCount = this.items.length;
      },
      (errorResponse) => {
        if (errorResponse !== undefined) {
          console.log("undefined");
        }
      }
    );
  }


}
