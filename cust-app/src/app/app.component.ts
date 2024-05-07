import { Component } from '@angular/core';

import { GlobalRestService } from 'src/app/services/rest/global-rest.service'
import appSettings from "src/assets/config/settings.json"
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ixcheck-cust-app';
  private appSettingsJson: any = {};
  animation = 'pulse';
  contentLoaded = false;
  count = 0;

  constructor(private http: HttpClient, private configService: AppsettingsConfService,private restService: GlobalRestService, private renderer:Renderer2) {
    this.http.get('../assets/config/settings.json')
      .toPromise()
      .then(data => {
        this.appSettingsJson = data;
        //pass application identification
        if(this.appSettingsJson) {
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
    }, error => {
     throw Error('Config file not loaded!');     
   })    
  }
  ngOnInit() {
    let loader = this.renderer.selectRootElement('#div-application-loader');
    this.renderer.setStyle(loader, 'display', 'none');
    // this.versionCheckService.initVersionCheck(this.currentUrl + '/assets/version.json')
  }
  ngOnChanges(){
    console.log('ngOnChanges Start');
    this.contentLoaded = false;
    console.log('ngOnChanges End');
  }
  ngAfterContentInit()
  {
    let loader = this.renderer.selectRootElement('#div-application-loader');
    this.renderer.setStyle(loader, 'display', 'none');
  }
  ngAfterViewInit()
  {
    let loader = this.renderer.selectRootElement('#div-application-loader');
    this.renderer.setStyle(loader, 'display', 'none');
   
    setTimeout(() => {
      this.contentLoaded = true;
    }, 1000);
  }
  ngOnDestroy() {
    let loader = this.renderer.selectRootElement('#div-application-loader');
    this.renderer.setStyle(loader, 'display', 'none');
  }
}
