
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({  name: 'orderBy' })
export class OrderrByPipe implements PipeTransform {

  transform(records: Array<any>, args?: any): any {
    
    return records.sort(function(a:string, b:string){
      let x = a[args.property].toLowerCase();
      let y = b[args.property].toLowerCase();
          if(x < y){
            return -1 * args.direction;
          }
          else if( x > y){
            return 1 * args.direction;
          }
          else{
            return 0;
          }
        });
    };
}

