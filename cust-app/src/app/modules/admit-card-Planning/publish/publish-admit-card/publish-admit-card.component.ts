import { Component, OnInit} from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ActivatedRoute,Router, Params } from '@angular/router';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service.js';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { MessageService } from 'ngx-ixcheck-message-lib';

@Component({
  selector: 'app-publish-admit-card',
  templateUrl: './publish-admit-card.component.html',
  styleUrls: ['./publish-admit-card.component.scss']
})
export class PublishAdmitCardComponent implements OnInit {

  public appRoutes: any = {};
  public regGuid : any;

  constructor(
    private restService: GlobalRestService,
    private route: ActivatedRoute,
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService, private router: Router
  ) {
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
   }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("ADMIT CARD PUBLISHED"); // set page title
    this.route.params.subscribe((params: Params) => {
      this.regGuid = params['regGuid'];
      this.publish();     
    }, error => {
      console.error('Error: ', error);
    });
  }

  // Publish Admit Card against the given exam Id
  publish() {
    var keyData = [
      {
        "name": "regGuid",
        "value": this.regGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = AdmitCard.publishAdmitCards;    
    this.restService.ShowLoadingSpinner=true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {                
        this.messageService
        .okRedirectModal(sucessResponse, "SUCCESS", "Go to Main list")
        .subscribe(result => {
          if (result == true) {
            // OK = true for redirection
            this.messageService.hideModal();
            this.router.navigate(["/admitcard/registrations"]);
          } else {
            // NO/CANCEL = false
            this.messageService.hideModal();
          }
        });
      }, errorResponse => {
      });
  }
}
