import { Component } from '@angular/core';

import { GlobalRestService } from 'src/app/services/rest/global-rest.service'
import appSettings from "src/assets/config/settings.json"
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent {
  title = 'ixcheck-base-app';
  private appSettingsJson: any = {};
  constructor( private configService: AppsettingsConfService,private restService: GlobalRestService) {
    this.appSettingsJson = appSettings;

    //pass application identification
    let httpPostParams = {
      app_id: this.appSettingsJson.application_guid,
      app_type: this.appSettingsJson.application_type,
    }
    this.restService.ApiEndPointUrlOrKey = this.appSettingsJson.appmodulesandroutes.url;
    this.restService.ApiEndPointMehod = this.appSettingsJson.appmodulesandroutes.method;
    this.restService.HttpPostParams = httpPostParams;

    this.restService.callApi()
      .subscribe(sucessResponse => {
        // console.log(sucessResponse);
        //save app routes in config service for later use
        this.configService.setAppRoutes(sucessResponse.app_routes);
      }, errorResponse => {
        //view returned error object
      }
      );
  }
}
