import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseDto } from 'app/shared/model/course-dto.model';
import { SERVER_API_URL } from 'app/app.constants';
import { CourseWithTNDto } from 'app/shared/model/courseWithTN-dto.model';

@Injectable()
export class CourseService {
    private courseAddressUrl = SERVER_API_URL + '/api/course/findAllCoursesDto';
    private courseAddressWithTNUrl = SERVER_API_URL + '/api/course/findAllCoursesWithTNDto';
    private enrolledCourseUrl = SERVER_API_URL + '/api/course/findEnrolledCoursesWithTNDto';
    private registerCourseUrl = SERVER_API_URL + '/api/course/registerCourse';
    private unregisterCourseUrl = SERVER_API_URL + '/api/course/unregisterCourse';
    private addCourseUrl = SERVER_API_URL + '/api/course/addCourse';
    private courseDeleteUrl = SERVER_API_URL + '/api/course/deleteCourse';
    private courseUpdateUrl = SERVER_API_URL + '/api/course/updateCourse';
    private findTeacherIdUrl = SERVER_API_URL + '/api/user/findId';

    constructor(private http: HttpClient) {}

    getCourseInfo(): Observable<CourseDto[]> {
        return this.http.get<CourseDto[]>(`${this.courseAddressUrl}`);
    }

    getCourseInfoWithTN(): Observable<CourseWithTNDto[]> {
        return this.http.get<CourseWithTNDto[]>(`${this.courseAddressWithTNUrl}`);
    }

    getEnrolledCourseInfoWithTN(id: String): Observable<CourseWithTNDto[]> {
        return this.http.get<CourseWithTNDto[]>(`${this.enrolledCourseUrl}/${id}`);
    }
    registerCourse(courseName: String): Observable<Response> {
        const res = this.http.post<Response>(`${this.registerCourseUrl}/${courseName}`, courseName);
        console.log(res);
        return res;
    }

    unregisterCourse(courseName: String): Observable<Response> {
        const res = this.http.delete<Response>(`${this.unregisterCourseUrl}/${courseName}`);
        console.log(res);
        return res;
    }

    addCourse(course: CourseDto): Observable<Response> {
        return this.http.post<Response>(`${this.addCourseUrl}/${course.courseTeacher}`, course);
    }

    findTeacherId(teacherName: string): Observable<string> {
        return this.http.get<string>(`${this.findTeacherIdUrl}/${teacherName}`);
    }

    delete(courseName: String): Observable<Response> {
        return this.http.delete<Response>(`${this.courseDeleteUrl}/${courseName}`);
    }

    update(course: CourseDto): Observable<Response> {
        return this.http.put<Response>(this.courseUpdateUrl, course);
    }
}
