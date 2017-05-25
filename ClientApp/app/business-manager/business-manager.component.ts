﻿import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../services/business.service';
import { AccountService } from '../services/account.service';
import { JobService } from '../services/job.service';
import { Router } from '@angular/router';
import { Job } from '../model/job';

@Component({
    selector: 'business-manager',
    templateUrl: './business-manager.component.html',
    styleUrls: ['./business-manager.component.css']
})
export class BusinessManagerComponent{
    loading: boolean = false;
    jobs: Job[];

    constructor(private businessService: BusinessService,
        private accountService: AccountService,
        private jobService: JobService,
        private router: Router) {

    }

    getInfo() {
        this.businessService.getBusinessFromUser()
            .subscribe((response) => {
                console.log(response);
        }, (err) => console.log(err));
    }

    ngAfterViewInit() {
        this.loading = true;
        this.jobService.getJobsForBusiness().subscribe((data) => {
            console.log(data);
            this.jobs = data;
            this.loading = false;
        }, (err) => {
            this.loading = false;
            if (err.status === 401)
                this.router.navigateByUrl("login");
            else
                console.log(err);
        });
    }

}
