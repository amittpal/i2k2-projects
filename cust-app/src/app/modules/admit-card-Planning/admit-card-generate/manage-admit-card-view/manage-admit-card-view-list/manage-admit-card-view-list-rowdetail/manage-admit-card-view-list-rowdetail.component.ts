import { Component, Input, OnInit } from '@angular/core';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { AdmitCard } from 'src/app/shared/enumrations/app-enum.enumerations';
import { DownloadReportService } from '../../../../../../services/download-report/download-report.service';
import { FilterService } from '../../../../../../services/filter/filter.service';

@Component({
  selector: 'app-manage-admit-card-view-list-rowdetail',
  templateUrl: './manage-admit-card-view-list-rowdetail.component.html',
  styleUrls: ['./manage-admit-card-view-list-rowdetail.component.scss']
})
export class ManageAdmitCardViewListRowdetailComponent implements OnInit {
  @Input() admitCardItem: any;   
  @Input() regGuid: any;
  @Input() snapshotId: any;
  private report: any;
  private dataSet: any;
  
  public admitCardList: any = [];
  public searchCandidateModel : any;
  public originalAdmitCardList : any = [];
  public reportData: any;

  constructor(private restService: GlobalRestService, private downloadReport: DownloadReportService, private filterService: FilterService) { }

  ngOnInit() {    
    this.getData();
  }

  filterCandidateData(data) {
    data = data.toLowerCase();
    this.admitCardList = this.originalAdmitCardList.filter(item => item.name.toLowerCase().includes(data) || item.father_name.toLowerCase().includes(data)  || item.roll_number.toLowerCase().includes(data)
    );
  }

  getData() {

    let filters = this.filterService.getFilter("admitcardcitywiseFilter");
    if (filters === undefined) {
      this.filterService.addFilter("admitcardcitywise");
      filters = this.filterService.getFilter("admitcardcitywiseFilter");
    }

    let paging = {
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
    }

    let data = filters.filter_text;
    if (data.city_guid) {
      let cityData = [];
      data.city_guid.forEach(item => {
        cityData.push({ "guid": item["city_guid"], "name": item["name"]});
      });
      filters.filter_text.city_guid = cityData;
    }
    else {
      filters.filter_text.city_guid = [];
    }

    if (data.state_guid) {
      let stateData = [];
      data.state_guid.forEach(item => {
        stateData.push({ "guid": item["state_guid"], "name": item["name"] });
      });
      filters.filter_text.state_guid = stateData;
    }
    else {
      filters.filter_text.state_guid = [];
    }
    
    filters.filter_text.exam_guid = this.admitCardItem.exam_guid;
    filters.filter_text.shift_number = this.admitCardItem.shift_number;
    filters.filter_text.registration_guid = this.regGuid;
    filters.filter_text.allocation_snapshots_id = this.snapshotId;
    
    let postParam = {
      "admitcardfilter": {
        "admitcard": filters.filter_text,
        "paging": paging,
        "cols":[]
     }
    }

    var keyData = [
      {
        "name": "examGuid",
        "value": this.admitCardItem.exam_guid
      }, {
        "name": "cityGuid",
        "value": this.admitCardItem.city_guid
      },{
        "name": "shiftNumber",
        "value": this.admitCardItem.shift_number
      }
    ];
    // Get Admit Card List as per City Id
    this.restService.HttpPostParams = postParam;
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardListByCityId;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {        
        this.admitCardList = sucessResponse['shifts'];
        this.originalAdmitCardList  = sucessResponse['shifts'];

        let data = filters.filter_text;
        if (data.city_guid) {
          let cityData = [];
          data.city_guid.forEach(item => {
            cityData.push({ "city_guid": item["guid"], "name": item["name"] });
          });
          filters.filter_text.city_guid = cityData;
        }
        else {
          filters.filter_text.city_guid = [];
        }

        if (data.state_guid) {
          let stateData = [];
          data.state_guid.forEach(item => {
            stateData.push({ "state_guid": item["guid"], "name": item["name"] });
          });
          filters.filter_text.state_guid = stateData;
        }
        else {
          filters.filter_text.state_guid = [];
        }

      }, errorResponse => {

          let data = filters.filter_text;
          if (data.city_guid) {
            let cityData = [];
            data.city_guid.forEach(item => {
              cityData.push({ "city_guid": item["guid"], "name": item["name"] });
            });
            filters.filter_text.city_guid = cityData;
          }
          else {
            filters.filter_text.city_guid = [];
          }

          if (data.state_guid) {
            let stateData = [];
            data.state_guid.forEach(item => {
              stateData.push({ "state_guid": item["guid"], "name": item["name"] });
            });
            filters.filter_text.state_guid = stateData;
          }
          else {
            filters.filter_text.state_guid = [];
          }

      });
  }

  downloadAdmitCard(candidate_guid) {
    event.preventDefault();
    var keyData = [     
      {
        "name": "examGuid",
        "value": this.admitCardItem.exam_guid
      }, {
        "name": "candidateGuid",
        "value": candidate_guid
      }, {
        "name": "regGuid",
        "value": this.regGuid
      }
    ];
    // Get Admit Card data of the student as per registration id
    this.restService.ApiEndPointUrlOrKey = AdmitCard.getAdmitCardPreviewDetails;
    this.restService.callApi(keyData)
      .subscribe(successResponse => {   
        this.reportData = successResponse;     
        let templateUrl = "/reports/admitcard/" + successResponse.candidatedetails[0].layout_id + "_Preview.mrt"; // loading admit card MRT template as per layout mapped by user
        this.downloadReport.downloadReport(this.reportData,'AdmitCard',templateUrl); // Downloading candidate's admit card using download report service
      }, errorResponse => {        
      });
  }

}
