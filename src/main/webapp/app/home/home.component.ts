import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, Principal, Account, UserService } from 'app/core';
import { CourseService } from 'app/shared/service/CourseService';
import { CourseDto } from 'app/shared/model/course-dto.model';
import { CourseWithTNDto } from 'app/shared/model/courseWithTN-dto.model';
import { renderComponent } from '@angular/core/src/render3';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.css']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    courses: CourseDto[] = [];

    coursesWithTN: CourseWithTNDto[] = [];

    enrolledCoursesWithTN: CourseWithTNDto[] = [];

    courseName: string;
    courseContent: string;
    courseLocation: string;
    courseTeacher: string;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private courseService: CourseService
    ) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    getAllCourses() {
        this.courseService.getCourseInfo().subscribe(curDto => {
            if (!curDto) {
                this.courses = [];
            } else {
                this.courses = curDto;
            }
        });
    }

    getAllCoursesWithTN() {
        this.courseService.getCourseInfoWithTN().subscribe(curDto => {
            if (!curDto) {
                this.coursesWithTN = [];
            } else {
                this.coursesWithTN = curDto;
            }
        });
    }

    getEnrolledCoursesWithTN() {
        this.courseService.getEnrolledCourseInfoWithTN(this.principal.userIdentity.id).subscribe(curDto => {
            if (!curDto) {
                this.enrolledCoursesWithTN = [];
            } else {
                this.enrolledCoursesWithTN = curDto;
            }
        });
    }

    registerCourse(courseName: string) {
        for (const course of this.enrolledCoursesWithTN) {
            if (course.courseName === courseName) {
                alert('你已经选过这门课了！');
                return;
            }
        }
        this.courseService.registerCourse(courseName).subscribe(curDto => {
            this.getAllCoursesWithTN();
        });
    }

    unregisterCourse(courseName: string) {
        this.courseService.unregisterCourse(courseName).subscribe(curDto => {
            this.getAllCoursesWithTN();
        });
    }

    addCourse() {
        this.courseService.findTeacherId(this.courseTeacher).subscribe(id => {
            const course: CourseDto = {
                courseName: this.courseName,
                courseLocation: this.courseLocation,
                courseContent: this.courseContent,
                courseTeacher: id
            };
            this.courseService.addCourse(course).subscribe(res => {
                this.getAllCoursesWithTN();
            });
        });
    }

    deleteCourse(courseName: string) {
        this.courseService.delete(courseName).subscribe(curDto => {
            this.getAllCoursesWithTN();
        });
    }

    clearAllCourses() {
        this.courses = [];
    }

    clearAllCoursesWithTN() {
        this.coursesWithTN = [];
    }

    clearEnrolledCoursesWithTN() {
        this.enrolledCoursesWithTN = [];
    }
}
