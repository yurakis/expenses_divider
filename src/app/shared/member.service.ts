import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import { Expense, Member } from './member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  members: Member[];
  expenses: Expense[];
  resultsChange$ = new Subject();

  constructor() {
    this.members = [];
    this.expenses = [];
  }

  addMember(name: string) {
    this.members.push({
      name,
      id: this.members.length + 1
    });
    this.resultsChange$.next();
  }

  removeMember(member: Member) {
    this.members.splice(this.members.indexOf(member), 1);
    this.resultsChange$.next();
  }

  addExpense(data: any) {
    const expense: Expense = {
      ...data,
      id: this.expenses.length + 1,
    };

    this.expenses.push(expense);
    this.resultsChange$.next();
  }

  removeExpense(expense: Expense) {
    this.expenses.splice(this.expenses.indexOf(expense), 1);
    this.resultsChange$.next();
  }
}
