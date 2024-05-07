import { Component, OnInit} from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service.js';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';


@Component({
  selector: 'app-manage-admit-card-preview',
  templateUrl: './manage-admit-card-preview.component.html',
  styleUrls: ['./manage-admit-card-preview.component.scss']
})
export class ManageAdmitCardPreviewComponent implements OnInit {

  public templateUrl =  "";  
  public appRoutes: any = {};
  public examGuid : any;
  public regGuid : any;
  public candidateGuid : any;
  public admitCardData : any;
  public snapShotId: any;
  public shiftNumber: any;
 
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
      this.examGuid = params['examGuid']; // Exam Guid
      this.regGuid = params['registrationId']; // Exam registration guid
      this.candidateGuid = params['candidateGuid']; // Candidate guid
      this.snapShotId = params['snapshotId']; // Snapshot id
      this.shiftNumber = params['shiftNo']; // Shift Number
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
          "name": "candidateGuid",
          "value": this.candidateGuid
        }, {
          "name": "regGuid",
          "value": this.regGuid
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
