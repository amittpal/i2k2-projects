import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import appSettings from "../../../../assets/config/settings.json"

@Component({
  selector: 'app-photo-edit-preview',
  templateUrl: './photo-edit-preview.component.html',
  styleUrls: ['./photo-edit-preview.component.scss']
})
export class PhotoEditPreviewComponent implements OnInit {

  group: FormGroup;
  componentDetails:any= {
    
      "comp_id": "9038",
      "comp_guid": "a75f432e-e616-fc6a-2172-15d11fc2979c",
      "comp_name": "NgxIxcheckPhotouploaderAi",
      "cols": 4,
      "rows": 3,
      "x": 0,
      "y": 5,
      "ai_parameters": {
        "id": "76",
        "comp_id": "9038",
        "algo_guid": "2db08ceb-72a3-11eb-8f5e-5a28b94f0bf6",
        "algo_url": "",
        "color_url": "",
        "validation_url": "https://dev.api.candidateportal.ixcheck.io/api/v1/Shared/images/ai/validations/list",
        "color_percent_min": 1,
        "color_percent_max": "50",
        "face_percent_min": "40",
        "face_percent_max": "50",
        "status": "",
        "colors": [
          {
            "id": "76",
            "reg_components_ai_setting_id": "76",
            "color_guid": "2de87e39-75a7-11eb-8f5e-5a28b94f0bf6",
            "blue_percent_min": "200",
            "blue_percent_max": "250",
            "green_percent_min": "200",
            "green_percent_max": "250",
            "red_percent_min": "200",
            "red_percent_max": "250",
            "status": ""
          }
        ]
      },
      "settings": {
        "setting_id": "8953",
        "setting_measurementType": "",
        "setting_height": "0",
        "setting_width": "20",
        "setting_labelposition": "align-top",
        "setting_type": "file",
        "setting_label": "Photo Upload",
        "setting_description": "Photo Upload",
        "setting_input": "",
        "setting_placeholder": "",
        "setting_dataEndpoint": "",
        "setting_defaultValue": "",
        "setting_dataParameter": "",
        "setting_showingrid": false,
        "setting_isdisabled": false,
        "setting_isoutput": false,
        "setting_dataGetEndpoint": "",
        "setting_dataDeleteEndpoint": "",
        "setting_allowTextUppercase": false
      },
      "data": {},
      "data_object": {},
      "validations": {
        "valid_id": "8682",
        "valid_required": true,
        "valid_maxlength": 0,
        "valid_minlength": 0,
        "valid_maxWidth": 500,
        "valid_minHeight": 50,
        "valid_maxHeight": 700,
        "valid_minWidth": 50,
        "valid_allowedFileCount": 1,
        "valid_regex": "",
        "valid_errormessage": "",
        "valid_minDate": "",
        "valid_maxDate": "",
        "valid_unique": false,
        "otp_varification": false,
        "valid_uniqueURL": "",
        "valid_allowedExtentions": "png,jpeg",
        "valid_allowedSize": 1
      },
      "conditional": {
        "condition_id": "5830",
        "condition_componentid": "9038",
        "condition_componentguid": "a75f432e-e616-fc6a-2172-15d11fc2979c",
        "condition_conditional": "",
        "eventType": "",
        "changeType": "",
        "componentToChange": "",
        "sectionToShowHide": ""
      },
      "subComponents": [
        {}
      ]
    
  }

  @ViewChild('FileuploaderInput', { static: true }) FileuploaderInput: ElementRef;
  @ViewChild('CropperTemplate', { static: true }) CropperTemplate: TemplateRef<any>;
  allowedExtentions: string[];
  addedFiles: any = [];
  selectedFile: any;
  imageFileExtentions = ['png', 'jpeg', 'svg'];
  maxUploadLimitExceeded = false;
  isValidDimensions=false;
  imageChangedEvent: any = '';
  croppedImage={
    width:0,
    height:0,
    imageBase64:''
  };  
  modalRef: BsModalRef;
  private appSettingsJson : any = {};
  validatedImageInfo={
    faceDetectedStatusText:"Failed",
    colorPercentage:0,
    facePercent:0
  }
  isImageValid=false;
  constructor(private http: HttpClient,private modalService: BsModalService) { }

  ngOnInit() {
    this.appSettingsJson = appSettings;

    // this.group.addControl(
    //   'NgxIxcheckPhotouploaderAi',
    //   new FormControl('')
    //   )
    // if (this.componentDetails.validations.valid_allowedExtentions) {
    //   this.allowedExtentions = this.componentDetails.validations.valid_allowedExtentions.split(',');
    // }    
    
  }


 

  onFileChange(event: any) {
    //this.resetValdations();
    this.imageChangedEvent = event;
    //this.showImageCropperModal();
    this.selectedFile = event.target.files[0];
    this.showImageCropperModal();
    //this.onUploadClick();
  }
  onUploadClick() {    
   // if (this.addedFiles.length < this.componentDetails.validations.valid_allowedFileCount) {
      this.maxUploadLimitExceeded = false;
      var file = this.selectedFile;
      if (file) {
        //this.validateFile(file);
        let isFileValid: boolean = this.validateFile(file);
        if (isFileValid === true) {
          //getting image as base 64 and saving in control value.
          let reader: FileReader = new FileReader();
          reader.onloadend = () => {
            let imageBase64String = reader.result;
            //validationg image for AI.
            this.validateImageForAi(imageBase64String, this.componentDetails.comp_id);
          }
          reader.readAsDataURL(file);
        }
      }
    // }
    // else {
    //   this.maxUploadLimitExceeded = true;
    //   this.FileuploaderInput.nativeElement.value = '';
    //   this.group.get('NgxIxcheckPhotouploaderAi').reset();
    // }
  }
  onRemoveImage(index: number) {
    if (index > -1) {
      this.addedFiles.splice(index, 1);
      this.maxUploadLimitExceeded = false;
      
      this.FileuploaderInput.nativeElement.value = '';
      this.group.get('NgxIxcheckPhotouploaderAi').reset();
      //this.outputEmitter.emit(this.addedFiles);
    }
  }

  //adding validationd based on component validations object
  validateFile(fileObject: any): boolean {
    let fileExtention = fileObject.type.split('/')[1];
    /*
     1 MB = 1000000 Bytes (in decimal)
     1 MB = 1048576 Bytes (in binary)
    */
    const fileSize = fileObject.size;
    const allowedFileSizeinByte = this.componentDetails.validations.valid_allowedSize * 1048576;
    // //checking for valid file extention
    // if (this.allowedExtentions.indexOf(fileExtention) < 0) {
    //   this.group.get('NgxIxcheckPhotouploaderAi').setValidators(this.addInvalidFileExtentionValidation.bind(this, true))
    //   this.group.get('NgxIxcheckPhotouploaderAi').updateValueAndValidity();
    //   return false;
    // }
    // //checking for valid file size
    // else if (fileSize > allowedFileSizeinByte) {
    //   this.group.get('NgxIxcheckPhotouploaderAi').setValidators(this.addInvalidFileFileSizeValidation.bind(this, true))
    //   this.group.get('NgxIxcheckPhotouploaderAi').updateValueAndValidity();
    //   return false;
    // }    
    //if file is of type image
    if (this.imageFileExtentions.indexOf(fileExtention) > -1) {
      let reader: FileReader = new FileReader();
      reader.onload = () => {
        var image = new Image();
        image.onload = () => {
          //checking image file for valid width and height.
          let validImageDimension = this.componentDetails.validations;
          if (
            image.width >= validImageDimension.valid_minWidth &&
            image.width <= validImageDimension.valid_maxWidth &&
            image.height >= validImageDimension.valid_minHeight &&
            image.height <= validImageDimension.valid_maxHeight
          ) {
            
            return true;
          }
          else {
            this.group.get('NgxIxcheckPhotouploaderAi').setValidators(this.addInvalidFileDimensionValidation.bind(this, true))
            this.group.get('NgxIxcheckPhotouploaderAi').updateValueAndValidity();
            return false;
          }
        }
        image.src = reader.result as string;
      }
      reader.readAsDataURL(fileObject);
      
      return true;
    }

    else {
      
      //this.group.get('NgxIxcheckFileuploader').setValue(fileObject);
      return true;

    }
  }

  addInvalidFileExtentionValidation(control: FormControl, validate: boolean) {
    this.group.get('NgxIxcheckPhotouploaderAi').markAsDirty();
    if (validate) return { invalidFileType: true };
    else return { invalidFileType: false };;
  }

  addInvalidFileFileSizeValidation(control: FormControl, validate: boolean) {
    this.group.get('NgxIxcheckPhotouploaderAi').markAsDirty();
    if (validate) return { invalidFileSize: true };
    else return { invalidFileSize: false };
  }

  addInvalidFileDimensionValidation(control: FormControl, validate: boolean) {
    this.group.get('NgxIxcheckPhotouploaderAi').markAsDirty();
    if (validate) return { invalidFileDimension: true };
    else return { invalidFileDimension: false };
  }

  addNoHumanFaceDetectedValidation(control: FormControl, validate: boolean) {
    this.group.get('NgxIxcheckPhotouploaderAi').markAsDirty();
    if (validate) return { noHumanFaceDetected: true };
    else return { noHumanFaceDetected: false };
  }

  addMultipleFaceDetectedValidation(control: FormControl, validate: boolean) {
    this.group.get('NgxIxcheckPhotouploaderAi').markAsDirty();
    if (validate) return { multipleFaceDetected: true };
    else return { multipleFaceDetected: false };
  }

  validateImageForAi(imageBase64: string | ArrayBuffer, componentId: string) {

    if (this.componentDetails.ai_parameters.validation_url
      && imageBase64 && componentId) {
      let postBody = {        
        "image": imageBase64,
        "blueMin": "200",
        "blueMax": "255",
        "greenMin": "200",
        "greenMax": "255",
        "redMin": "200",
        "redMax": "255",
      };
      this.http.post(this.appSettingsJson.aiValidateImage.url, postBody)
        .subscribe((response: any) => {
          let parsedResponse = JSON.parse(response);

            this.validatedImageInfo.faceDetectedStatusText=parsedResponse.info.ai_faces[0].human_face_detected_status_text; 
            this.validatedImageInfo.colorPercentage=parsedResponse.info.color_analysis[0].color_percent;
            this.validatedImageInfo.facePercent=parsedResponse.info.ai_faces[0].Ai_photo_percent; 
           
            
            //this.addedFiles.push(fileInfo);
            this.selectedFile = null;
            
            //this.group.get('NgxIxcheckPhotouploaderAi').reset();
            this.FileuploaderInput.nativeElement.value = '';
            //this.outputEmitter.emit(this.addedFiles);
         // }

         this.checkImageValidity();

        }, (errorResponse: any) => {
          let parsedResponse = JSON.parse(errorResponse.error);
          console.log(parsedResponse);
          if (parsedResponse) {
            let errorMessage = parsedResponse.data[0].attributes.message[0];
            if (errorMessage === "No human faces detected") {
              this.group.get('NgxIxcheckPhotouploaderAi').setValidators(this.addNoHumanFaceDetectedValidation.bind(this, true))
              this.group.get('NgxIxcheckPhotouploaderAi').updateValueAndValidity();
            }
            else if (errorMessage === "Multiple faces detected") {
              this.group.get('NgxIxcheckPhotouploaderAi').setValidators(this.addMultipleFaceDetectedValidation.bind(this, true))
              this.group.get('NgxIxcheckPhotouploaderAi').updateValueAndValidity();

            }
          }

        })
    }

  }

  //#region image cropper

  showImageCropperModal()
  {
    if(this.selectedFile)
    {
      this.modalRef = this.modalService.show(
        this.CropperTemplate,
        {class: 'modal-xl', backdrop : 'static', keyboard : false});
    }    
  }

 
  imageCropped(event: ImageCroppedEvent) { 

    this.croppedImage.imageBase64 = event.base64;
    this.croppedImage.width = event.width;
    this.croppedImage.height = event.height;
    
    if(this.croppedImage.width >= this.componentDetails.validations.valid_minWidth &&
      this.croppedImage.width <= this.componentDetails.validations.valid_maxWidth &&
      this.croppedImage.height >= this.componentDetails.validations.valid_minHeight &&
      this.croppedImage.height <= this.componentDetails.validations.valid_maxHeight)
    {
      this.isValidDimensions=true;
    }
    else
    {
      this.isValidDimensions=false;
    }
    
    this.imageCropedAndValidate();
  }
   
  imageCropedAndValidate()
  {  
    const croppedImageResult=this.croppedImage.imageBase64;
    const croppedImageBase64=croppedImageResult.replace("data:image/png;base64,", "");
    const imageBlob = this.dataURItoBlob(croppedImageBase64);
    const croppedImageFile = new File([imageBlob], "croppedImage", { type: 'image/png' });
    if(croppedImageFile)
    {
      this.selectedFile=croppedImageFile;
      this.onUploadClick(); 
      //this.modalRef.hide();        
    }    
  }

  checkImageValidity()
  {
    if(
      this.isValidDimensions && 
      this.validatedImageInfo.faceDetectedStatusText ==='Human face detected' &&
      this.validatedImageInfo.colorPercentage > 0)
      {
        this.isImageValid=true;
      }
      else
      {
        this.isImageValid=false;
      }    
  }


  onDownloadImageClick()
  {    
    const downloadLink = document.createElement("a");
    downloadLink.href = this.croppedImage.imageBase64;
    downloadLink.download = "cropped-image";
    downloadLink.click();
    downloadLink.remove();   
  }

  //converting base64 to file
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
 }

}
