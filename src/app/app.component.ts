import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MemberService } from './shared';

@Component({
  selector: 'ed-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(public memberService: MemberService) {}
}
