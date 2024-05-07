import { Component, OnInit, Input } from '@angular/core';
import { GlobalRestService } from './../../../../services/rest/global-rest.service';
import { Candidates } from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.scss']
})
export class ActivityLogsComponent implements OnInit {
  @Input() candidateGuid: any;
  public activityLogList: any = [];

  constructor(private restService: GlobalRestService) { }

  ngOnInit() {
    this.getActivityLogs(this.candidateGuid)
  }

  public getActivityLogs(candidateGUID) {
     if(candidateGUID) {
      let keyData = [
        {
          "name": "candidateGuid",
          "value": candidateGUID
        }
      ]
      this.restService.ApiEndPointUrlOrKey = Candidates.getActivityLogs;
      this.restService.callApi(keyData).subscribe(successResponse => {
        this.activityLogList = successResponse.activity_logs;
      }, errorResponse => {
         this.activityLogList = [];
      }); 
    }    
  }

}
