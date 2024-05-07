import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { AppsettingsConfService } from "src/app/services/conf/appsettings-conf/appsettings-conf.service";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Main
} from "src/app/shared/enumrations/app-enum.enumerations";
import { RestMethods } from "src/app/shared/models/app.models";

@Component({
  selector: 'app-registration-per-hour',
  templateUrl: './registration-per-hour.component.html',
  styleUrls: ['./registration-per-hour.component.scss']
})
export class RegistrationPerHourComponent implements OnInit {

  @Input() regGuid: any;
  @Input() examGuid: any;

  lineChartOptions = {
    responsive: true,    
    maintainAspectRatio: false,
    legend: {
      display: false
    }
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(111,200,200,1)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  lineChartData: ChartDataSets[] = [];
  lineChartLabels: Label[] = [];

  constructor(
    private configService: AppsettingsConfService,
    private messageService: MessageService,
    private restService: GlobalRestService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.getRegistrationPerHour();
  }


  getRegistrationPerHour(){
    var keyData = [
      {
        name: "regGuid",
        value: this.regGuid
      },
      {
        name: "examGuid",
        value: this.examGuid
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Main.getRegistrationPerHour;
    this.restService.ApiEndPointMehod = RestMethods.Get;
    this.restService.callApi(keyData).subscribe(
      successResponse => {
        let obj = successResponse.exams;
        console.log(obj.map(item => item.registration_total))
        console.log(obj.map(item => item.datatime_hour))
        this.lineChartData.push({ data: obj.map(item => item.registration_total)});
        this.lineChartLabels = obj.map(item => item.datatime_hour);
      })
  }

}
