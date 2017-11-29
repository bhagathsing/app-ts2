import { NgModule, ModuleWithProviders} from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { CalendarService} from './calendar.service';
@NgModule({
    declarations:[
        CalendarComponent
    ],
    exports:[CalendarComponent],
    imports:[],
    entryComponents:[CalendarComponent]
})
export class CalendarModule{
    static forRoot():ModuleWithProviders{
        return{
            ngModule:CalendarModule,
            providers:[CalendarService]
        }
    }
}