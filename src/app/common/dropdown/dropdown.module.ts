import { MultiselectDropdown } from './dropdown.component';
import { MultiSelectSearchFilter } from './search-filter.pipe';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  exports: [MultiselectDropdown, MultiSelectSearchFilter],
  declarations: [MultiselectDropdown, MultiSelectSearchFilter],
  entryComponents: [MultiselectDropdown]
})
export class MultiselectDropdownModule { 
	static forRoot(): ModuleWithProviders {
    return {
      ngModule: MultiselectDropdownModule
    };
  }
}
