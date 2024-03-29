import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { Observable, interval, map, startWith } from 'rxjs';

const REFRESH_INTERVAL = 60 * 1000;

@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date, withoutSuffix?: boolean): Observable<string> {
    return interval(REFRESH_INTERVAL).pipe(
      startWith(1),
      map(() => moment(value).fromNow(withoutSuffix)),
    );
  }
}
