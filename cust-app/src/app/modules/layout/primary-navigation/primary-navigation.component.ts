import { Component, OnInit, ElementRef, ViewChild, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
//import { map, tap, catchError, finalize, flatMap, mergeMap } from 'rxjs/operators';
import { SvgIconRegistryService } from 'angular-svg-icon';

//import { HandelError, RestMethods } from '../../../shared/models/app.models';
import { GlobalRestService } from '../../../services/rest/global-rest.service'
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service';
import { Compiler } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-primary-navigation',
  templateUrl: './primary-navigation.component.html',
  styleUrls: ['./primary-navigation.component.scss']
})
export class PrimaryNavigationComponent implements OnInit, AfterContentChecked {
  private appSettingsJson: any = {};
  //private restPrams: RestApiParams;

  //Application Menu Json
  public boolDataLoaded: boolean = false;
  public navData: any;
  public navModules: any;
  public navDesc: any;
  public moduleCount = 0;
  public navOpenStyle: boolean = false;
  private appRoutesJson: any = {};
  private selectedModules: any = [];
  //`static` - This is new in Angular 8 and indicates whether or not to resolve query results before change detection runs.
  @ViewChild('aside', { static: true }) aside: ElementRef;

  constructor(private restService: GlobalRestService, private configService: AppsettingsConfService,
    private router: Router, private registry: SvgIconRegistryService, private _compiler: Compiler,
    private http: HttpClient) {  

  }

  ngOnInit() { 
    this.http.get('../../../../assets/config/settings.json')
      .toPromise()
      .then(data => {
        this.appSettingsJson = data;  
        let userPermissions = localStorage.getItem('userPermissions');
        const userCan = JSON.stringify(userPermissions);
        this.setSettings(this.appSettingsJson, userCan);  
      }, error => {
        throw Error('Config file not loaded!');
      }
    );
     
  }
  
  setSettings(gpSettingsJson: any, perms: any) {    
    //save app settings in config service for later use
    this.configService.setAppSettings(this.appSettingsJson);

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
        this.appRoutesJson = sucessResponse;
               
        // this.selectedModules.push(this.appRoutesJson.app_modules[0]) // --- display dashboard module
        for (let j = 0; j < sucessResponse.app_modules.length; j++) {
        if (
        sucessResponse.app_modules[j].permission.some(item => perms.indexOf(item) !== -1) // Compares module's permissions with user's persmission.
        ) {  
                 
          for(let l = 0; l < this.appRoutesJson.app_modules[j].main_modules.length;l++){    
            if (
            sucessResponse.app_modules[j].main_modules[l].permission.some(item => perms.indexOf(item) !== -1) // Compares module's permissions with user's persmission.
            ) {
              for(let k = 0; k < this.appRoutesJson.app_modules[j].main_modules[l].sub_modules.length; k++){                    
                if(perms.includes(this.appRoutesJson.app_modules[j].main_modules[l].sub_modules[k].permission)){ 
                  // Compares sub module's permissions with user's persmission. 
                  this.appRoutesJson.app_modules[j].main_modules[l].selected_sub_modules.push (this.appRoutesJson.app_modules[j].main_modules[l].sub_modules[k]);
                }
              }
            }  
          }
          this.selectedModules.push(this.appRoutesJson.app_modules[j]);
        }
      }

      //sorting modules by id asc
      this.selectedModules.sort((a, b) => (a.id < b.id ? -1 : 1));                    
      this.appRoutesJson.selected_modules.push(this.selectedModules);         
      this.navModules = sucessResponse.selected_modules[0];      
      this.navDesc = sucessResponse.app_desc;
      //save app routes in config service for later use
      this.configService.setAppRoutes(sucessResponse.app_routes);
      this.boolDataLoaded = true;
        console.log(sucessResponse.selected_modules)

        // this.navModules = sucessResponse.app_modules;
        // this.navDesc = sucessResponse.app_desc;
        // //save app routes in config service for later use
        // this.configService.setAppRoutes(sucessResponse.app_routes);
        // this.boolDataLoaded = true;
      }, errorResponse => {
        //view returned error object
      }
      );
  }

  // ----- commented by Gunjan Sharma on 03-dec-2019
  // Throw ERROR - "Cannot read property 'nativeElement' of undefined"
  //--- This is new in angular 8, called before the directive content is checked (@ViewChild)
  // ngDoCheck() {  
  //   // if (this.aside.nativeElement.classList.contains('show')) this.navOpenStyle = true;		
  //   // else this.navOpenStyle = false;		
  // }

  // called right after the directive content is checked.
  ngAfterContentChecked() {
    //console.log('After Content checked called')
    if (this.aside.nativeElement.classList.contains('show')) this.navOpenStyle = true;
    else this.navOpenStyle = false;
    //console.log(this.navOpenStyle)
  }

  showMenu(event, div_id) {
    // console.log('mouse enter ')
    event.preventDefault();
    event.stopPropagation();

    let elements = document.querySelectorAll('.nav-link');
    for (let element = 0; element < elements.length; element++) {
      elements[element].classList.remove('on-hover');
    }
    event.target.parentElement.classList.add('on-hover');
    event.target.classList.add('on-hover');

    document.querySelector('.az-iconbar-aside').classList.remove('in-transit');
    document.querySelector('.az-iconbar-aside').classList.add('show');
    elements = document.querySelectorAll('.az-iconbar-pane');
    for (let element = 0; element < elements.length; element++) {
      elements[element].classList.remove('show');
    }
    document.getElementById(div_id).classList.add('show');
  }

  clickedFooterMenu(event, div_id) {
    this.clickMobile(event, div_id);
    this.showMenu(event, div_id);
  }

  clickClose(event, clickAndFollowLink, div_id) {

    if (clickAndFollowLink == false) {
      event.preventDefault();
      event.stopPropagation();
    }
    let elements = document.querySelectorAll('.nav-link');
    let elemParent = document.getElementById('side-nav');    
    for (let element = 0; element < elements.length; element++) {
      elements[element].classList.remove('on-hover');
    }
    elemParent.classList.remove('on-hover');

    // let elemSelect = document.querySelector('#side-nav#icon-mod'+div_id);
    
    //   elemSelect.classList.add('on-active');
     

    document.querySelector('.az-iconbar-aside').classList.remove('show');
    document.querySelector('.az-iconbar-aside').classList.add('in-transit');

    let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width <= 991) {
      document.querySelector('body').classList.remove('az-iconbar-show');
    }
  }

  modClose(event, clickAndFollowLink, div_id) {
    let elements = document.querySelectorAll('.nav-link');
    for (let element = 0; element < elements.length; element++) {
      elements[element].classList.remove('on-active');
    }
    document.querySelector('icon-mod'+div_id).classList.add('on-active');
    this.clickClose(event, clickAndFollowLink, div_id);
  }
                                          
  clickMobile(event, div_id) {
    event.preventDefault();
    event.stopPropagation();
    document.querySelector('body').classList.add('az-iconbar-show');
  }

  logout() {
    this._compiler.clearCache();
    this.router.navigate(['/login']);
  }

}
