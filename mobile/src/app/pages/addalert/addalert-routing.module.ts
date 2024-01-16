import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddalertPage } from './addalert.page';

const routes: Routes = [
  {
    path: '',
    component: AddalertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddalertPageRoutingModule {}
