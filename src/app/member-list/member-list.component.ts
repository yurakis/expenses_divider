import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { filter, takeWhile } from 'rxjs/operators';

import { MemberDialogComponent } from '../member-dialog/member-dialog.component';
import { IsAliveComponent, Member, MemberService, TableComponent, TableConfig } from '../shared';

@Component({
  selector: 'ed-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
  providers: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListComponent extends IsAliveComponent implements OnInit {
  @ViewChild('tableComponent', {static: true}) tableComponent: TableComponent;
  tableConfig: TableConfig;

  constructor(
    public memberService: MemberService,
    private matDialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private decimalPipe: DecimalPipe
  ) {
    super();
  }

  ngOnInit(): void {
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
          transformFn: (member: Member) => this.decimalPipe.transform(this.getMemberTotalExpensesAmount(member))
        }
      ]
    };

    this.memberService.resultsChange$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => this.tableComponent.updateTable());
  }

  openMemberDialog(member: Member = null) {
    this.matDialog
      .open(MemberDialogComponent, {data: member})
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((name: string) => {
        if (member) {
          member.name = name;
        } else {
          this.memberService.addMember(name);
        }

        this.tableComponent.updateTable();
        this.changeDetector.markForCheck();
      });
  }

  private getMemberTotalExpensesAmount(member: Member): number {
    return this.memberService.expenses
      .filter(({payer}) => payer === member)
      .reduce((sum, {amount}) => sum += amount, 0);
  }
}
