import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { filter, takeWhile } from 'rxjs/operators';

import { MemberDialogComponent } from '../member-dialog/member-dialog.component';
import { WithTableComponent, Member, MemberService } from '../shared';

@Component({
  selector: 'ed-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
  providers: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListComponent extends WithTableComponent implements OnInit {
  constructor(
    public memberService: MemberService,
    protected changeDetector: ChangeDetectorRef,
    protected decimalPipe: DecimalPipe,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) {
    super(changeDetector, decimalPipe);
  }

  ngOnInit(): void {
    this.setTableConfig();
    this.memberService.resultsChange$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => this.updateView());
  }

  openMemberDialog(member: Member = null) {
    this.matDialog
      .open(MemberDialogComponent, {data: member})
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((name: string) => {
        if (member) {
          member.name = name;
          this.memberService.resultsChange$.next();
        } else {
          this.memberService.addMember(name);
        }

        this.updateView();
      });
  }

  removeMember(member: Member) {
    const index = this.memberService.expenses.findIndex(({payer, consumers}) => payer === member || consumers.includes(member));

    if (index === -1) {
      this.memberService.removeMember(member);
    } else {
      this.matSnackBar.open(
        'Could not delete this member. The member was mentioned in expenses',
        null,
        {duration: 3000}
        );
    }
  }

  protected setTableConfig(): void {
    this.tableConfig = {
      items: this.memberService.members,
      actions: {
        edit: true,
        remove: true
      },
      columns: [
        {
          displayName: 'Name',
          displayProperty: 'name'
        },
        {
          width: 80,
          displayName: 'Money Spent',
          transformFn: (member: Member) => this.transformNumber(this.getMemberTotalExpensesAmount(member))
        }
      ]
    };
  }

  private getMemberTotalExpensesAmount(member: Member): number {
    return this.memberService.expenses
      .filter(({payer}) => payer === member)
      .reduce((sum, {amount}) => sum += amount, 0);
  }
}
