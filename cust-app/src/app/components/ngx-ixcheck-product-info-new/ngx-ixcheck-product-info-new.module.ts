import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxIxcheckProductInfoComponent } from "./components/ngx-ixcheck-product-info.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

@NgModule({
  declarations: [NgxIxcheckProductInfoComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [NgxIxcheckProductInfoComponent],
})
export class NgxIxcheckProductInfoLibModule {}
