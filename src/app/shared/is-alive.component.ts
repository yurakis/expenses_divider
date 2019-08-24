import { OnDestroy } from '@angular/core';

export abstract class IsAliveComponent implements OnDestroy {
  protected isAlive = true;

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
