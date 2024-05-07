import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { GlobalRestService } from "../../../../../services/rest/global-rest.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { PrimaryHeaderService } from "../../../../layout/primary-header/primary-header.service";
import { AppsettingsConfService } from "../../../../../services/conf/appsettings-conf/appsettings-conf.service";

import {
  Exam,
  Centre,
  HandelError,
} from "../../../../../shared/enumrations/app-enum.enumerations";

@Component({
  selector: 'app-snapshot-view',
  templateUrl: './snapshot-view.component.html',
  styleUrls: ['./snapshot-view.component.scss']
})
export class SnapshotViewComponent implements OnInit {

  public notFound: boolean = false;
  @Input() items = [];
  @Input() rowItemDetails: any;
  public displayMessage: any;

  constructor(
    private restService: GlobalRestService,
    private messageService: MessageService,
    private configService: AppsettingsConfService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.rowItemDetails || this.items.length > 0) {
      this.getExistedSnapshotList(this.rowItemDetails.guid)
    }
  }

  getExistedSnapshotList(guid) {
    let keyData = [
      {
        name: "regGuid",
        value: guid
      },
    ];

    this.restService.ApiEndPointUrlOrKey = Centre.getExistedSnapshotList;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        this.items = sucessResponse.snap_shot.filter(item => { return (item.planning_status == "Alloted" || item.planning_status == "Finalized") });        
      },
      (errorResponse) => {
        if (errorResponse !== undefined) {
          this.displayMessage =
            errorResponse.httpErrorResponse.data[0].attributes.message[0];
        }
      }
    );
  }

}
