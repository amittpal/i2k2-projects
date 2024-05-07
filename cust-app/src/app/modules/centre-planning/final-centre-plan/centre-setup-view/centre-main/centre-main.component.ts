import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { TabsetComponent } from "ngx-bootstrap";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { Subscription } from "rxjs";

import { SharedService } from "../service/shared.service";
@Component({
  selector: "app-centre-main",
  templateUrl: "./centre-main.component.html",
  styleUrls: ["./centre-main.component.scss"]
})
export class CentreMainComponent implements OnInit {
  @ViewChild("tabset", { static: false }) tabset: TabsetComponent;
  examGuid: string;
  snapShotId: string;
  Id: string;
  tabsIdSub: Subscription;
  disableSwitching: boolean = true;
  disableReviewAncReport: boolean = true;
  changeTabSub: Subscription;
  disableTabSub: Subscription;
  disableTabSubBasedOnStatus: Subscription;
  cityPriority: number;
  disableTab: number[] = [];
  examNumber: string;
  selectedExamGuid: string;
  constructor(
    private route: ActivatedRoute,
    private primaryHeader: PrimaryHeaderService,
    private SharedService: SharedService
  ) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
    this.route.params.subscribe(
      (params: Params) => {
        this.examGuid = params["examId"];
        this.SharedService.examGuid.next(this.examGuid);
        this.snapShotId = params["snapShotId"];
        //this.Id = params['id'];
      },
      error => {
        console.error("Error: ", error);
      }
    );
  }

  // prevent memory leak when component destroyed
  ngOnDestroy() {
    if (this.tabsIdSub) {
      this.tabsIdSub.unsubscribe();
    }
    if (this.changeTabSub) {
      this.changeTabSub.unsubscribe();
    }
    if (this.disableTabSub) {
      this.disableTabSub.unsubscribe();
    }
    if (this.disableTabSubBasedOnStatus) {
      this.disableTabSubBasedOnStatus.unsubscribe();
    }    
  }

  ngAfterViewInit() {
    this.tabsIdSub = this.SharedService.tabsId.subscribe(id => {
      if (id != null) {
        this.enableTabs(id);
      }
    });
    this.changeTabSub = this.SharedService.changeTab.subscribe(id => {
      if (id != null) {
        this.changeTab(id);
      }
    });

    this.disableTabSub = this.SharedService.cityPriorityNumber.subscribe(
      number => {
        if (number) {
          this.cityPriority = parseInt(number);
          this.disableTabs(this.cityPriority);
        } else {
          // console.log("Please Fill exam first");
        }
      }
    );
  }

  disableTabs(cityPriority: any) {
    this.disableTabSubBasedOnStatus = this.SharedService.registrationStatus.subscribe(
      status => {
        if (status == "Alloted" || status == "Finalized" || status == "Archived") {
          this.disableTab = Array.from(Array(cityPriority).keys());
          this.disableTab.forEach(a => {
            this.tabset.tabs[5 + a].disabled = false;
          });
          this.disableReviewAncReport = false;
        }})
  }

  enableTabs(i: any) {
    this.tabset.tabs[i].disabled = false;
  }

  changeTab(i: any) {
    this.tabset.tabs[i].active = true;
    this.SharedService.changeTab.next(null);
  }

  //  exam number
  public exam_num(exam_num: string) {
    this.examNumber = exam_num;
  }

  setExamGuid(examGuid) {
    this.selectedExamGuid = examGuid;
  }
  
}
