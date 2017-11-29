import { Component, OnInit, Input } from '@angular/core';
import { CalendarService } from './calendar.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() CalendarData;
  
  
  constructor(private calendarService: CalendarService) { }

  public ngOnInit() {
   // var data = this.calendarService.generateMothDays(this.calendarService.getCurentDate());
   // console.log(data);
    
  }
  public nextDate(){
    this.calendarService.nextDateRange();
  }
  public prevDate(){
    this.calendarService.prevDateRange();
  }
}
