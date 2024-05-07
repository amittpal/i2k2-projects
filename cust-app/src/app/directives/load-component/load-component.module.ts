import { NgModule } from '@angular/core';
import{LoadComponentDirective} from './load-component.directive';

@NgModule({  
  declarations: [LoadComponentDirective],
  exports:[LoadComponentDirective]
})
export class LoadComponentModule { }
