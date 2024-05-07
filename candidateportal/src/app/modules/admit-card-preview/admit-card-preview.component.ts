import { Component, OnInit} from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service.js';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-admit-card-preview',
  templateUrl: './admit-card-preview.component.html',
  styleUrls: ['./admit-card-preview.component.scss']
})
export class AdmitCardPreviewComponent implements OnInit {

  public templateUrl =  "";  
  public appRoutes: any = {};
  public examGuid : any;  
  public regId : any;
  public admitCardData : any;
 
  constructor(   
    private restService: GlobalRestService,
    private route: ActivatedRoute,
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService
  ) {
 
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
   }
 
  ngOnInit() {    
    this.primaryHeader.pageTitle.next("ADMIT CARD PREVIEW");
    this.route.params.subscribe((params: Params) => {
      this.examGuid = params['id']; // Exam Guid      
      this.regId = params['regId']; // Student Registration Id
      this.getTemplateDetails();    // Get Students admit card data and preview it  
    }, error => {
      console.error('Error: ', error);
    });
  }
   
  
  // Get Students admit card data and preview it  
  getTemplateDetails() {
      var keyData = [
        {
          "name": "examGuid",
          "value": this.examGuid
        }, {
          "name": "regId",
          "value": this.regId
        }
      ];
      this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardPreviewDetails;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {        
          this.admitCardData = sucessResponse;
          this.templateUrl = "/reports/admitcard/" + sucessResponse.candidatedetails[0].layout_id + "_Preview.mrt"; // loading admit card MRT template as per layout mapped by user
        }, errorResponse => {
        });
    }


}
