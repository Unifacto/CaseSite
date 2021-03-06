﻿import { Component, AfterViewInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { UtilService } from '../services/util.service';
import { AccountService } from '../services/account.service';

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements AfterViewInit, OnChanges {
    businessCount: number = 0;
    studentCount: number = 0;
    taskCount: number = 0;
    solutionCount: number = 0;
    showBusinesses: boolean = false;
    showTasks: boolean = false;
    showStudents: boolean = false;
    showSolutions: boolean = false;

    constructor(private adminService: AdminService, private activatedRoute: ActivatedRoute, private utilService: UtilService, private router: Router, private accountService: AccountService) {
        this.activatedRoute.params.subscribe((params) => {
            let subpage = params['subpage'];
            if (subpage == 'solutions') {
                this.showBusinesses = false;
                this.showTasks = false;
                this.showStudents = false;
                this.showSolutions = true;
            }
            else if (subpage == 'tasks') {
                this.showBusinesses = false;
                this.showTasks = true;
                this.showStudents = false;
                this.showSolutions = false;
            }
            else if (subpage == 'students') {
                this.showBusinesses = false;
                this.showTasks = false;
                this.showStudents = true;
                this.showSolutions = false;
            }
            else {
                this.showBusinesses = true;
                this.showTasks = false;
                this.showStudents = false;
                this.showSolutions = false;
            }
        });
    }

    ngAfterViewInit() {
        this.adminService.getCounts().subscribe(res => {
            this.businessCount = res[0];
            this.studentCount = res[1];
            this.taskCount = res[2];
            this.solutionCount = res[3];
        });
    }

    ngOnChanges() {
        this.adminService.getCounts().subscribe(res => {
            console.log(res);
            this.businessCount = res[0];
            this.studentCount = res[1];
            this.taskCount = res[2];
            this.solutionCount = res[3];
        });
    }

    logout() {
        this.utilService.displayLoading(true);
        this.accountService.logout().subscribe((response) => {
            this.utilService.displayLoading(false);
            this.router.navigate(['/']);
        }, err => {
            this.utilService.displayLoading(true);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
        });
    }
}
