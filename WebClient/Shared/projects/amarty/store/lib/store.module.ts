import { StoreModule } from '@ngrx/store';
import { reducers } from './store';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    StoreModule.forFeature('sharedState', reducers),
  ],
  exports: [
    StoreModule,
  ]
})
export class SharedStoreModule { }
