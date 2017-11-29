import { Injectable,OnInit} from '@angular/core';

interface currentDate {
    date:number;
    month:number;
    year:number;
}
@Injectable()
export class CalendarService{
    private WeekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    private monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    private Month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    private dateRange:number = 0;
    public MothDaysData = [];
    private date = new Date();
    private cMonth = this.date.getMonth();
    private cYear = this.date.getFullYear();
    private cDate = this.date.getDate();
    constructor(){
        this.generateMothDays(this.getCurentDate());
    }

    public getDateData(dateObj){
        
        let dateObject = new Date(`${dateObj.month+1}/${dateObj.date}/${dateObj.year}`);
        let currentMonth = dateObject.getMonth();
        let currentDate = dateObject.getDate();
        let currentYear = dateObject.getFullYear();
        let currentMonthDays = this.Month[currentMonth];
        let currentMonthName = this.monthNames[currentMonth];this.monthNames[currentMonth];
        
        let halfDays = Math.floor(currentMonthDays/2);
        this.dateRange = currentDate > halfDays ? 2:1;
     
        var startDay = this.dateRange == 1? 1:(halfDays+1);
        var endDay = this.dateRange == 1? 15:currentMonthDays;

        return {
            currentMonth,
            currentDate,
            currentYear,
            currentMonthDays,
            currentMonthName,
            startDay,
            endDay
        }
    }
    public generateMothDays( date){
       this.MothDaysData = [];
        var dateObj = this.getDateData(date);
        for(dateObj.startDay; dateObj.startDay<=dateObj.endDay; dateObj.startDay++ ){
            var d = new Date(`${(dateObj.currentMonth+1)}/${dateObj.startDay}/${dateObj.currentYear}`);
            this.MothDaysData.push({
                weekDayName:this.WeekDays[d.getDay()],
                date:d.getDate(),
                year:d.getFullYear(),
                getMonth:d.getMonth(),
                getDay:d.getDay(),
                day:d.getDate()+' '+this.monthNames[d.getMonth()]+' '+ this.WeekDays[d.getDay()],
                monthName:this.monthNames[d.getMonth()]
            });
        }
    }
    public nextDateRange(){
        if(this.dateRange==2){
            ++this.cMonth;
            if(this.cMonth >11){
                this.cMonth = 0;
                ++this.cYear;
            }
           this.generateMothDays({date:1, month:this.cMonth, year:this.cYear,});
        }else{
            this.generateMothDays({date:16, month:this.cMonth, year:this.cYear,});
        }
    }
    public prevDateRange(){
        if(this.dateRange==1){
            --this.cMonth;
            if(this.cMonth <0){
                this.cMonth = 11;
                --this.cYear;
            }
           this.generateMothDays({date:16, month:this.cMonth, year:this.cYear,});
        }else{
            this.generateMothDays({date:1, month:this.cMonth, year:this.cYear,});
        }
    }
    public getCurentDate(){
        var d = new Date();
        return{
            month:d.getMonth(),
            year:d.getFullYear(),
            date:d.getDate()
        };
    }
}