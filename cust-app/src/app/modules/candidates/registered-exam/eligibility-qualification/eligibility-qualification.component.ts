import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { GlobalRestService } from './../../../../services/rest/global-rest.service';
import { AppsettingsConfService } from './../../../../services/conf/appsettings-conf/appsettings-conf.service';
import { ActivatedRoute, Params } from '@angular/router';
import { HandelError } from './../../../../shared/models/app.models';
import { Candidates } from './../../../../shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-eligibility-qualification',
  templateUrl: './eligibility-qualification.component.html',
  styleUrls: ['./eligibility-qualification.component.scss']
})
export class EligibilityQualificationComponent implements OnInit {
  @Input() candidateGuid: any 
  @Output() updateEvent = new EventEmitter<any>();
  public qualification = [];
  public eligibility = [];
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public count: Number = 0;
  public appRoutes: any = {};
  public registrationGUID: any;

  constructor(
    private restService: GlobalRestService,
    private configService: AppsettingsConfService,
    private route: ActivatedRoute
  ) {
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
   }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
    this.registrationGUID = params['guid'];

    this.getData(params['guid']);
  }, error => {
    console.error('Error: ', error);
  });
  }
  public getData(params: any) {   

    if (Object.keys(this.appRoutes).length !== 0) {
      var keyData = [
        {
          "name": "guid",
          "value": params
        },
        {
          "name": "candidateGuid",
          "value": this.candidateGuid
        }
      ];
      this.restService.ApiEndPointUrlOrKey = Candidates.getEligibilityQualification;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.callApi(keyData) 
        .subscribe(sucessResponse => {                
          //this.eligibility = sucessResponse.eligibility_qualification.eligibility;
          this.qualification = sucessResponse.qualifications;
          // this.itemCount = sucessResponse.paging.total_rows;
          // this.lastSeenIdMax = sucessResponse.paging.last_seen_id_max;
          // this.lastSeenIdMin = sucessResponse.paging.last_seen_id_min;
          // this.lastOffset = sucessResponse.paging.last_offset;
        }, errorResponse => {
          if (errorResponse !== undefined) {
          }
        });
    }
  }
  public updateEventEmit(){
    this.getData(this.registrationGUID);
    this.updateEvent.emit(true);
  }
}