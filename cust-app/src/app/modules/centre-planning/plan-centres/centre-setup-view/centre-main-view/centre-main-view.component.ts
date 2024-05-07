import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { TabsetComponent } from "ngx-bootstrap";
import { PrimaryHeaderService } from "src/app/modules/layout/primary-header/primary-header.service";
import { Subscription } from "rxjs";

import { SharedService } from "../service/shared.service";
@Component({
  selector: "app-centre-main-view",
  templateUrl: "./centre-main-view.component.html",
  styleUrls: ["./centre-main-view.component.scss"]
})
export class CentreMainViewComponent implements OnInit {
  @ViewChild("tabset", { static: false }) tabset: TabsetComponent;
  examGuid: string;
  Id: string;
  tabsIdSub: Subscription;
  disableSwitching: boolean = true;
  changeTabSub: Subscription;
  disableTabSub: Subscription;
  cityPriority: number;
  disableTab: number[] = [];
  examNumber: string;
  constructor(
    private route: ActivatedRoute,
    private primaryHeader: PrimaryHeaderService,
    private SharedService: SharedService
  ) {}

  ngOnInit() {
    this.primaryHeader.pageTitle.next("PLAN CENTRES");
    this.route.params.subscribe(
      (params: Params) => {
        this.examGuid = params["examId"];
        this.SharedService.examGuid.next(this.examGuid);
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
  }

  ngAfterViewInit() {
    this.tabsIdSub = this.SharedService.tabsId.subscribe(id => {
      if (id) {
        this.enableTabs(id);
      }
    });
    this.changeTabSub = this.SharedService.changeTab.subscribe(id => {
      if (id) {
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
    this.disableTab = Array.from(Array(cityPriority).keys());
    this.disableTab.forEach(a => {
      this.tabset.tabs[4 + a].disabled = false;
    });
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
}
