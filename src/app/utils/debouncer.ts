import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

export function createDebouncer<T>(delay: number = 300): (obs: Observable<T>) => Observable<T> {
  const subject = new Subject<T>();

  return (source: Observable<T>) =>
    new Observable<T>((observer) => {
      const debounced = subject.pipe(debounceTime(delay), distinctUntilChanged());

      const subscription = source
        .pipe(
          switchMap((value) => {
            subject.next(value);
            return debounced;
          })
        )
        .subscribe(observer);

      return subscription;
    });
}
