import { Component, Input, OnInit, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { Router } from "@angular/router";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Centre
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

import { SharedService } from "../../service/shared.service";
import { Subscription } from "rxjs";
import bubbleConfig from "../../../../../../../assets/config/bubbleconfig.json";
import { NgxIxcheckTableParams } from "ngx-ixcheck-table-lib";

@Component({
  selector: 'app-centre-list-add',
  templateUrl: './centre-list-add.component.html',
  styleUrls: ['./centre-list-add.component.scss']
})
export class CentreListAddComponent implements OnInit {
  
  @Input() regGuid: any;
  @Input() snapShotId: any;
  @Input() examList = [];
  @Input() items = [];
  @Input() importId: any;
  @Output() resetCentreList = new EventEmitter();
  @Output() updateCentreList = new EventEmitter();

  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public config = bubbleConfig;
  public bubbleLabels: any = {};
  public resultModal: string;
  public resetFilterFlag: boolean = false;
  public updatedFilter: any;
  public count: Number = 0;
  public notFound: boolean = false;
  public displayMessage: any;
  public showProgress: boolean = false;
  public isLoading: boolean = false;
  public reloadBubble = true;
  public paginationStyle = "minimal";
  private searchFilter: any = {
    "centres_filter": {
      "exam_centres": {
        "state": "",
        "city": "",
        "code": "",
        "name": "",
        "min_ph_seats": "",
        "max_ph_seats": "",
        "min_normal_seats": "",
        "max_normal_seats": ""
      },
      "paging": {
        "last_seen_id_max": 0,
        "last_seen_id_min": 0,
        "last_offset": 0,
        "page_size": 0,
        "sort_by": "",
        "order_dir": "",
        "direction": 0,
        "page_num": 0,
        "sort_exp": "",
        "sort_dir": "",
        "total_rows": 0
      },
      "cols": []
    }
  };

  public defaultPagingParams: any = {
    total_rows: 0,
    returned_rows: 0,
    direction: 0,
    order_dir: "",
    page_size: 10,
    sort_by: "",
    offset: 0,
    last_offset: 0,
    last_seen_id_max: 0,
    last_seen_id_min: 0,
  };

  private appRoutes: any = {};

  examId: any;

  public centreCapacityParam: any = {
    id: "",
    allocation_snapshot_id: "",
    shift_number: "",
    state: "",
    city: "",
    centre_guid: "",
    code: "",
    name: "",
    ph_seats: "",
    normal_seats: "",
    allowed_ph_capacity_per: 0,
    allowed_normal_capacity_per: 0,
    allowed_ph_capacity: 0,
    allowed_normal_capacity: 0
  };

  allowDurationStatus: boolean = false;
  allowBulkUpdate = false;

  constructor(
    private configService: AppsettingsConfService,
    private SharedService: SharedService,
    private router: Router,
    private primaryHeader: PrimaryHeaderService,
    private messageService: MessageService,
    private restService: GlobalRestService
  ) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(
      (configData) => {
        this.appRoutes = configData;
      },
      (error) => {
        console.error("Error for configService.getAppRoutes: ", error);
      }
    );
  }

  ngOnInit() {
    //setting page title

    this.primaryHeader.pageTitle.next("PLAN CENTRES");    
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
  }


  ngDoCheck() {
    if (this.items) {
      this.itemCount = this.items.length;
    }
  }

  // child-component
  public getChildComponentData(childData: any) {
    let centreId = childData["id"];

    this.items.forEach((element, i) => {
      if (element["id"] == centreId) {
        this.items[i] = childData;
      }
    });
  }

  public updateProductDetails(updatedItem: any) {
    let i = 0;
    for (i; i < this.itemCount; i++) {
      if (
        this.items[i].id === updatedItem.centreInfo.id
      ) {
        this.items[i] = updatedItem.centreInfo;
        // this.calTotalAmount();
        break;
      }
    }
  }

  public reset() {
    let form = document.getElementById("editCentreForm");
    form.classList.remove("was-validated");
    this.resetFilter();
  }

  public resetFilter() {    
    this.resetCentreList.emit();
  }

  public updateFilter() {    
    this.updateCentreList.emit();
  }

}
