import { Component, OnInit } from '@angular/core';
import { AppsettingsConfService } from '../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from '../../../../services/rest/global-rest.service';
import { HandelError } from '../../../../shared/models/app.models';
import { Packaging } from '../../../../shared/enumrations/app-enum.enumerations';
import { PrimaryHeaderService } from '../../../layout/primary-header/primary-header.service';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-packaging-shift',
  templateUrl: './packaging-shift.component.html',
  styleUrls: ['./packaging-shift.component.scss']
})
export class PackagingShiftComponent implements OnInit {

  public items = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;

  public paginationStyle = 'minimal';

  private appRoutes: any = {};
  examGuid="";
  examNumber: string;

  constructor(
    private route: ActivatedRoute,
    private configService: AppsettingsConfService,
    private restService: GlobalRestService, private primaryHeader: PrimaryHeaderService) {
      this.restService.ShowLoadingSpinner = true;
      this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      this.configService.getAppRoutes.subscribe(configData => {
        this.appRoutes = configData;
      }, error => {
        console.error('Error for configService.getAppRoutes: ', error);
      });
     }

  ngOnInit() {
        //setting page title
        this.primaryHeader.pageTitle.next("PACKAGE");
        this.route.params.subscribe((params: Params) => {
          this.examGuid =params['id'];
         if(this.examGuid)
         {          
           this.getShiftDetailsList(this.examGuid);
         }            
       }, error => {
         console.error('Error: ', error);
       });
  }

  private getShiftDetailsList(id:any) {   
      //call api code here...
      var keyData = [
        {
        "name": "examGuid",
        "value": id
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Packaging.getShiftDetailsList;
      this.restService.callApi(keyData)
        .subscribe(sucessResponse => { 
          if(sucessResponse.exam_list[0].exam_date)
           this.items = sucessResponse.exam_list;
          this.examNumber = sucessResponse.exam_list[0].exam_number;
        },
        errorResponse=>{
          //this.messageService.alert(errorResponse);
        }      
        );  
  }


  public onCreate(examGuid:any,shiftGuid:any) {
    //call api code here...
    var keyData = [
      {
      "name": "examGuid",
      "value": examGuid
      },
      {
        "name":"shiftGuid",
        "value":shiftGuid
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Packaging.createPackage;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => { 
       
      },
      errorResponse=>{
        //this.messageService.alert(errorResponse);
      }      
      );  
    
  }

}
