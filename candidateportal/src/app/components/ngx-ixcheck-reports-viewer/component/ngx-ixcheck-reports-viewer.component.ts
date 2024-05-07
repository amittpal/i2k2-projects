import { Component, OnInit, ViewEncapsulation, Input,OnChanges } from '@angular/core';
//import { Http } from '@angular/http';

declare var Stimulsoft: any;

@Component({
  selector: 'ngx-ixcheck-reports-viewer',
  templateUrl: './ngx-ixcheck-reports-viewer.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NgxIxcheckReportsViewerComponent implements OnInit,OnChanges {
  // private viewer: any = new Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
  private viewer: any;
  private report: any;
  private dataSet: any;

  public reportData: any;
  @Input() get data() {
    return this.reportData;
  }
  set data(reportData: any) {
    this.reportData = reportData;
  }

  public reportTemplateUrl: string;
  @Input() get template() {
    return this.reportTemplateUrl;
  }
  set template(reportTemplateUrl: string) {
    this.reportTemplateUrl = reportTemplateUrl;
  }

  public reportName: string;
  @Input() get templateName() {
    return this.reportName;
  }
  set templateName(reportName: string) {
    if (reportName) {
      this.reportName = reportName;
    } else {
      this.reportName = "Report";
    }
  }

  constructor() { }

  ngOnInit() {
    this.reload();
  }

  ngOnChanges(){
    this.reload();
  }

  private reload() {
    const options = new Stimulsoft.Viewer.StiViewerOptions;
    options.exports.showExportToDocument = false;
    options.exports.showExportToPdf = true;
    options.toolbar.showSendEmailButton = false;
    options.toolbar.showParametersButton = true;
    options.toolbar.viewMode = Stimulsoft.Viewer.StiWebViewMode.Continuous;
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlaEdVLWMXezgDcHiNfLTn64/d4d/BpnJOECi2W" +
      "t3thqNpqG9wmECCSp4M+Kn/5vdjMY8927vTCms8PbCN6XKwmYsl/b28xtPnAvLXkcsTub41v0XLdlmGO" +
      "FniudML+WrwOVASnP1vRcbDiw8zapkbZRx2j9SFB3CXt2sVwzlyQYX/2Ugbw5f+3gwxLWszZVdwfmP3W" +
      "wdq8jXSSZNKOqOsu24AcWB8XFB8J+gHFP4lxecDjwlPwZBbsmddVSf8IFvx4V1Zw7xAJY8Nygfh9jx4r" +
      "7WuTOCwauOPGyKTuvchXNpiYSwt3qwfnjzgr//OVG/+aTWKYxnS9ut/1DLlnwn6MSJJNuiYnsIxa9blV" +
      "FfizySwwpEZRSXs9eYQAHuLL3hrnRxPaxgyzjPYaQK0SZRinTaniKz2A9oTKSWRFYrHaq2ZXGAOXuVDE" +
      "wUzGNc96ceRfyu5aZQPjviwji1E1/EAoorxpFjY8yjHY6uzSlgyJs5cbQaheGo1F0iQqTKvid1S3LC5Q" +
      "EltNBTkuUJYgREd5";


    this.viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
    // Create a new report instance
    this.report = new Stimulsoft.Report.StiReport();
    // Load report from url
    this.report.loadFile(this.reportTemplateUrl);

    //Adding Background Image to all the pages of the report dynamically as selected by the user
    if(this.reportName == "AdmitCard"){
    this.report.pages.list.forEach((element,index )=> {
      var page = this.report.pages.getByIndex(index);
      page.watermark.image = Stimulsoft.System.Drawing.Image.fromFile(this.reportData.candidatedetails[0].background_image);
      page.watermark.aspectRatio = false;
      page.watermark.imageStretch = true;
      page.watermark.imageShowBehind= true;      
    });
   }

    // Create new DataSet object
    this.dataSet = new Stimulsoft.System.Data.DataSet(this.reportName);
    // Load JSON data file from specified URL to the DataSet object
    this.dataSet.readJson(this.reportData);
    // Remove all connections from the report template
    this.report.dictionary.databases.clear();
    this.report.regData(this.dataSet.dataSetName, "", this.dataSet);
    // Render report with registered data
    this.report.render();

    this.viewer.report = this.report;
    this.viewer.renderHtml('viewer');
  }

}
