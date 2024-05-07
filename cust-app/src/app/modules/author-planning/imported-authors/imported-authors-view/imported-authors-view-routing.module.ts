import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportedAuthorsViewComponent } from './imported-authors-view.component';


const routes: Routes = [

  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: ImportedAuthorsViewComponent,
        data: {
          title: 'Imported Authors view'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportedAuthorsViewRoutingModule { }
