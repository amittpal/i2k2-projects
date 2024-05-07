import { Component, OnInit} from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service.js';
import { PrimaryHeaderService } from 'src/app/modules/layout/primary-header/primary-header.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-admit-card-email-preview',
  templateUrl: './manage-admit-card-email-preview.component.html',
  styleUrls: ['./manage-admit-card-email-preview.component.scss']
})
export class ManageAdmitCardEmailPreviewComponent implements OnInit {


  public appRoutes: any = {};
  public examGuid : any;
  public regId : any;  
  public shiftNo : any;  
  public emailBody = "";
  public admitCardEmailPreviewFormGroup: FormGroup;
  
  public regGuid: any;
  public candidateGuid: any;
  public admitCardData: any;
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
    this.primaryHeader.pageTitle.next("EMAIL PREVIEW");
    this.route.params.subscribe((params: Params) => {                  

      this.examGuid = params['examGuid']; // Exam Guid
      this.regGuid = params['registrationId']; // Exam registration guid
      this.candidateGuid = params['candidateGuid']; // Candidate guid
      this.snapShotId = params['snapshotId']; // Snapshot id
      this.shiftNumber = params['shiftNo']; // Shift Number

      this.getStudentSendEmailPreview();    // Get Students send email data and preview it 
    }, error => {
      console.error('Error: ', error);
    });
    this.initFormGroup();
  }


  public initFormGroup() {    
    this.admitCardEmailPreviewFormGroup = new FormGroup({
      email_subject: new FormControl({value:'',disabled:true})
    });
  }
   
  // Get Students send email data and preview it 
  getStudentSendEmailPreview() {
      
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

      this.restService.ApiEndPointUrlOrKey = AdmitCard.getEmailPreviewDetail;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => {   
          this.admitCardEmailPreviewFormGroup.controls["email_subject"].setValue(sucessResponse.email[0].email_subject);
          this.emailBody = sucessResponse.email[0].email_body;
        }, errorResponse => {
        });
    }

}
