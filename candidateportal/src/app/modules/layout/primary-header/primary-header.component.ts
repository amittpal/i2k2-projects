import { Component, OnInit, Input, OnDestroy, OnChanges, Compiler } from '@angular/core';
import { PrimaryHeaderService } from './primary-header.service';
import { Subscription, config } from 'rxjs';
import { Router } from '@angular/router';
import appSettings from "../../../../assets/config/settings.json"
@Component({
  selector: 'app-primary-header',
  templateUrl: './primary-header.component.html',
  styleUrls: ['./primary-header.component.scss']
})
export class PrimaryHeaderComponent implements OnInit, OnDestroy {
  public page_title: string = "";
  public config: any;
  public subscriptions: Subscription[] = [];
  public isUserLoggedIn: boolean;
  private appSettingsJson : any = {};
  //Setting up page title
  // @Input() get pageTitle() {
  //   return this.pageTitle;
  // }
  // set pageTitle(pageTitleValue: string) {
  //   this.page_title = pageTitleValue;
  // }
  constructor(
    private primaryHeaderService: PrimaryHeaderService,
    private router: Router,
    private _compiler: Compiler
  ) {

  }
  ngOnInit() {
    this.appSettingsJson = appSettings;
    this.checkUserLoginStatus();
    //Setting up page title
    this.setPageTitle();
    // this.setBackButtonConfig();
    // this.config = {
    //   "show_button": false,
    //   "navigate_url": "",
    //   "page_title" : ""
    // }
  }



  checkUserLoginStatus() {
    this.primaryHeaderService.userLoginStatus.subscribe(value => {
      if (value === true || localStorage.getItem('accessToken')) {
        this.isUserLoggedIn = true;
      }
      else {
        this.isUserLoggedIn = false;
      }
    })
  }

  public setPageTitle() {
    this.subscriptions.push(this.primaryHeaderService.pageTitle.subscribe(value => this.page_title = value));
  }
  public setBackButtonConfig() {
    this.subscriptions.push(this.primaryHeaderService.header_config.subscribe(value => this.config = value));

  }
  ngOnDestroy() {
    //Unsubscribing all subscriptions to avoid memory leak    
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  public navigate() {
    if (this.config.navigate_url != "")
      this.router.navigate([this.config.navigate_url]);
    this.config = {
      "show_button": false,
      "navigate_url": "",
      "page_title": ""
    }
  }

  onResumeRegistrationClick() {
    if (localStorage.getItem('uniqueUserId')) {
      window.open("http://localhost:4300/#/registration/exam/" + localStorage.getItem('uniqueUserId') + "/edit", "_blank");
    }
  }
  onMockTestClick()
  {  
    if(this.isUserLoggedIn)
    {    
      const postParams={
        url:this.appSettingsJson.getAllQuestions.url,        
      }
      //type:"POST",        
        // params:{        
        //     "local_endpoint_object": {
        //       "user_guid": this.authService.getUserUniqueId(),
        //       "order_id": this.orderId,
        //       "exam_guid": this.examGuid,
        //       "endpoint_type": "AUTHORING"
        //     }                         
        // }
  
      localStorage.setItem("examPreviewData", JSON.stringify(postParams));
      
      const top=(screen.height - 768) / 4;;
      const left=(screen.width - 1280) / 2;    
      window.open('/#/exam-preview', '', 'width=1280,height=768,location=0,top='+top+',left='+left+',location=no');
    }                
  }
  logout() {
    this._compiler.clearCache();
    this.primaryHeaderService.userLoginStatus.next(false);
    this.primaryHeaderService.removeCandidateInfoFromStorage();
    this.router.navigate(['/login']);
  }

  

}