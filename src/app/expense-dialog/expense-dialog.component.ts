import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Expense, MemberService } from '../shared';

@Component({
  selector: 'ed-expense-dialog',
  templateUrl: './expense-dialog.component.html',
  styleUrls: ['./expense-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    public memberService: MemberService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private expense: Expense
  ) {}

  ngOnInit() {
    this.isEditMode = Boolean(this.expense);
    this.form = this.formBuilder.group({
      name: ['', Validators.minLength(3)],
      amount: [0, Validators.min(1)],
      payer: [null, Validators.required],
      consumers: [[], Validators.required]
    });
    this.initFormValues();
  }

  saveExpense() {
    this.dialogRef.close(this.form.value);
  }

  private initFormValues() {
    if (!this.isEditMode) {
      return;
    }

    Object.keys(this.expense).forEach((key) => {
      const control = this.form.get(key);

      if (control) {
        control.setValue(this.expense[key]);
      }
    });
  }
}
