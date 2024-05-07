import { Injectable } from '@angular/core';
declare var Stimulsoft: any;

@Injectable({
  providedIn: 'root'
})
export class DownloadReportService {

  constructor() { }

   downloadReport(reportData : any,reportName:any,templateUrl:any){

    Stimulsoft.Base.StiLicense.key =
    "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlaEdVLWMXezgDcHiNfLTn64/d4d/BpnJOECi2W" +
    "t3thqNpqG9wmECCSp4M+Kn/5vdjMY8927vTCms8PbCN6XKwmYsl/b28xtPnAvLXkcsTub41v0XLdlmGO" +
    "FniudML+WrwOVASnP1vRcbDiw8zapkbZRx2j9SFB3CXt2sVwzlyQYX/2Ugbw5f+3gwxLWszZVdwfmP3W" +
    "wdq8jXSSZNKOqOsu24AcWB8XFB8J+gHFP4lxecDjwlPwZBbsmddVSf8IFvx4V1Zw7xAJY8Nygfh9jx4r" +
    "7WuTOCwauOPGyKTuvchXNpiYSwt3qwfnjzgr//OVG/+aTWKYxnS9ut/1DLlnwn6MSJJNuiYnsIxa9blV" +
    "FfizySwwpEZRSXs9eYQAHuLL3hrnRxPaxgyzjPYaQK0SZRinTaniKz2A9oTKSWRFYrHaq2ZXGAOXuVDE" +
    "wUzGNc96ceRfyu5aZQPjviwji1E1/EAoorxpFjY8yjHY6uzSlgyJs5cbQaheGo1F0iQqTKvid1S3LC5Q" +
    "EltNBTkuUJYgREd5";

  
    // Create a new report instance
    let report = new Stimulsoft.Report.StiReport();
    // Load report from url
    report.loadFile(templateUrl);
    

    
    //Adding Background Image to all the pages of the report dynamically as selected by the user
    if(reportName == "AdmitCard"){
        report.pages.list.forEach((element,index )=> {
        var page = report.pages.getByIndex(index);
        page.watermark.image = Stimulsoft.System.Drawing.Image.fromFile(reportData.candidatedetails[0].background_image);
        page.watermark.aspectRatio = false;
        page.watermark.imageStretch = true;
        page.watermark.imageShowBehind= true;      
      });
    }


    // Create new DataSet object
    let dataSet = new Stimulsoft.System.Data.DataSet(reportName);
    // Load JSON data file from specified URL to the DataSet object
    dataSet.readJson(reportData);
    // Remove all connections from the report template
    report.dictionary.databases.clear();
    report.regData(dataSet.dataSetName, "", dataSet);
    // Render report with registered data
    report.render();

    // Create an PDF settings instance. You can change export settings.
    var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
    // Create an PDF service instance.
    var service = new Stimulsoft.Report.Export.StiPdfExportService();
    
    // Create a MemoryStream object.
    var stream = new Stimulsoft.System.IO.MemoryStream();
    
    // Export PDF using MemoryStream.             
    service.exportToAsync(function () {                 
      var data = stream.toArray();                 
      
      // Save data to file                 
      (<any>Object).saveAs(data, reportName + ".pdf", "application/pdf");
    }, report, stream, settings);
  }

}
