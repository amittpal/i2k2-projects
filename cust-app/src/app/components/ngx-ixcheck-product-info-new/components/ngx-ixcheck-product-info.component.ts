import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessageService } from "ngx-ixcheck-message-lib";
import { GlobalRestService } from "src/app/services/rest/global-rest.service";
import {
  HandelError,
  Exam
} from "src/app/shared/enumrations/app-enum.enumerations";
import { typeaheadAnimation } from "ngx-bootstrap/typeahead/typeahead-animations";
import { TabHeadingDirective } from "ngx-bootstrap";
import { ThrowStmt } from "@angular/compiler";
import { SharedService } from "src/app/modules/exam-planning/setup-exam-planning/plan-exam-setup/service/shared.service";
import { Subscription } from "rxjs";

@Component({
  selector: "ngx-ixcheck-product-info",
  templateUrl: "./ngx-ixcheck-product-info.component.html",
  styleUrls: ["./ngx-ixcheck-product-info.component.scss"]
})
export class NgxIxcheckProductInfoComponent implements OnInit {
  @Output() private childComponentData = new EventEmitter<number>();
  @Input("examId") examId: string;
  @Input("rowItemData") rowItemData: any;
  public dataReturn: any = "";
  private _item: any;
  private _key: number;
  private _itemOrig: any;
  public _productTypes: any[];
  public _productCategories: any[];
  public _productSubCategories: any[];
  public _products: any[];
  public _productVersions: any[];

  difficultyLevels: any;
  // uomsList: any;
  selectedSubject: any;
  disabledRow: boolean;
  selectedSubjectSub: Subscription;

  @Input() get item() {
    return this._item;
  }
  set item(item: any) {
    this._itemOrig = Object.assign({}, item);
    this._item = item;
  }

  @Input() get key() {
    return this._key;
  }
  set key(key: number) {
    this._key = key;
  }

  @Input() get productTypes() {
    return this._productTypes;
  }
  set productTypes(productTypes: any) {
    this._productTypes = productTypes;
  }

  @Input() get ProductCategory() {
    return this._productCategories;
  }
  set ProductCategory(productCategory: any) {
    this._productCategories = productCategory;
  }

  @Input() get ProductSubCategory() {
    return this._productSubCategories;
  }
  set ProductSubCategory(productSubCategory: any) {
    this._productSubCategories = productSubCategory;
  }

  @Input() get Products() {
    return this._products;
  }
  set Products(products: any) {
    this._products = products;
  }

  @Input() get ProductVersions() {
    return this._productVersions;
  }
  set ProductVersions(productVersions: any) {
    this._productVersions = productVersions;
  }
  public productFormGroup: FormGroup;
  public productCategoriesState: boolean;
  public productSubCategoriesState: boolean;
  public productState: boolean | string = false;
  public productVersionState: boolean | string = false;
  public productHasCategory: boolean | string = false;
  public productHasSubCategory: boolean | string = false;
  public productHasProducts: boolean | string = false;
  public productHasVersions: boolean | string = false;

  constructor(
    private messageService: MessageService,
    private restService: GlobalRestService,
    private SharedService: SharedService
  ) {
    // this._checkSubTree = true;
  }

  @Output() productType = new EventEmitter();
  @Output() productCategory = new EventEmitter<{ urlKey: any }>();
  @Output() productSubCategory = new EventEmitter<{ urlKey: any }>();
  @Output() products = new EventEmitter<{ urlKey: any }>();
  @Output() productVersions = new EventEmitter<{ urlKey: any }>();
  @Output() update = new EventEmitter();
  //@Output() updateProductInfo = new EventEmitter();
  @Output() updateProductInfo = new EventEmitter<{ dataObject: any }>();

  ngOnInit() {
    if (!this._key) {
      this._key = 1;
    }
    this.productFormGroup = new FormGroup({
      subject_guids: new FormControl("", Validators.required),
      difficulty_level_guids: new FormControl("", Validators.required),
      number_of_questions: new FormControl("", [
        Validators.required,Validators.min(1),
        Validators.max(999)
      ])
    });

    this.productCategoriesState = true;
    this.productSubCategoriesState = true;
    this.productState = true;
    this.productType.emit();

    this._productCategories = [];
    this._productSubCategories = [];
    this._products = [];
    this._productVersions = [];
    this.setIntialdata();
    this.getIntialData();
    this.getSavedSection();
  }

  getSavedSection() {
    this.selectedSubjectSub = this.SharedService.selectedSubject.subscribe(
      selectedSubject => {
        if (selectedSubject != null) {
          this.selectedSubject = selectedSubject;
        }
      }
    );
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
      if (this.selectedSubjectSub) {
      this.selectedSubjectSub.unsubscribe();
    }
  }

  setIntialdata() {

    if (this.rowItemData["status"] == "false") {

      this.disabledRow = false;
    } else {
      this.disabledRow = true;
      if (
        typeof this.rowItemData["difficulty_levels"] == "undefined" ||
        this.rowItemData["difficulty_levels"] == ""
      ) {
        if (this.rowItemData["name"]) {
          this.productFormGroup.patchValue({
            subject_guids: this.rowItemData["name"]
          });
        }
      } else {

        this.productFormGroup.patchValue({
          subject_guids: this.rowItemData["name"],
          difficulty_level_guids: this.rowItemData.difficulty_level_guids.name,
          number_of_questions: this.rowItemData.number_of_questions
        });
      }
    }
  }

  getIntialData() {
    // Get Difficulty level
    this.restService.ApiEndPointUrlOrKey = Exam.getDifficultyLevelList;
    this.restService.callApi().subscribe(
      successResponse => {
        this.difficultyLevels = successResponse.difficulty_levels;
      },
      errorResponse => {
        console.error("ERROR: ", errorResponse.message[0]);
      }
    );
  }

  getProductInfo() {
    if (this.productFormGroup.valid === false) {
      let form = document.getElementById("productForm");
      form.classList.add("was-validated");
      return false;
    }
    let formdata = this.productFormGroup.getRawValue();
    formdata["line_num"] = this._item["line_num"];
    this.selectedSubject.forEach(element => {
      if (formdata.subject_guids == element.name) {
        formdata.subject_guids = element;
      }
    });

    this.difficultyLevels.forEach(element => {
      if (formdata.difficulty_level_guids == element.name) {
        formdata.difficulty_level_guids = element;
      }
    });
    formdata["status"] = "true";

    this.childComponentData.emit(formdata);
    return true;
  }

  onCancel() {
    this._item = this._itemOrig;
    const prodInfo = this._itemOrig;
    const lineNum = this._itemOrig.line_num;
    this.update.emit({ prodInfo, event });
  }
}
