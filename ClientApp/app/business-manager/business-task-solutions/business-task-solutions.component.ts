﻿import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { AccountService } from '../../services/account.service';
import { SolutionService } from '../../services/solution.service';
import { TaskService } from '../../services/task.service';
import { UtilService } from '../../services/util.service';
import { Business } from '../../model/business';
import { Solution } from '../../model/solution';
import { Task } from '../../model/task';
import * as moment from 'moment';

@Component({
    selector: 'business-task-solutions',
    templateUrl: './business-task-solutions.component.html',
    styleUrls: ['./business-task-solutions.component.css']
})

export class BusinessTaskSolutionsComponent implements AfterViewInit {
    business: Business;
    task: Task;
    solutions: Solution[] = [];
    winnerSolution: Solution;
    now = moment();

    constructor(private businessService: BusinessService,
        private route: ActivatedRoute,
        private accountService: AccountService,
        private solutionService: SolutionService,
        private taskService: TaskService,
        private utilService: UtilService,
        private router: Router) {
        accountService.loggedIn.subscribe(newValue => {
            if (newValue)
                this.getBusiness();
            else
                this.business = null;
        });
    }

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.getTasksAndSolutions(id);
            }
        });
    }

    getBusiness() {
        this.utilService.displayLoading(true);
        this.businessService.getBusinessFromUser().subscribe(res => {
            this.business = res;
            this.utilService.displayLoading(false);
        }, err => {
            this.utilService.displayLoading(false);
            if (err.status === 401) {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Du skal være logget ind for at se dette indhold" });
                this.router.navigateByUrl("login");
            } else {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
            }

        });
    }

    getDeadlineString() {
        if (this.task) {
            return this.task.deadline.format('HH:mm - DD/MM-YYYY');
        }
    }

    submitWinner(studentId) {
        this.utilService.displayLoading(true);
        this.solutionService.selectWinner(this.task.id, studentId).subscribe(res => {
            if (res.ok) {
                this.getTasksAndSolutions(this.task.id);
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "success", titel: "Succes", message: "Vinder af opgaven er blevet valgt" });
            } else {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Vinder af opgaven er ikke blevet valgt" });
            }
        }, (err) => {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Vinder af opgaven er ikke blevet valgt" });
            });
    }

    gotoDownload(studentId: number) {
        this.router.navigate(["business/solutions/" + this.task.id + "/download/" + studentId]);
    }

    getTasksAndSolutions(id) {
        this.utilService.displayLoading(true);
        this.taskService.getTask(id).subscribe(res => {
            this.utilService.displayLoading(false);
            this.task = res;
            console.log(this.task);
            this.solutionService.getTaskSolutions(id).subscribe(data => {
                this.utilService.displayLoading(false);
                this.solutions = data;
            });
        });
    }
}