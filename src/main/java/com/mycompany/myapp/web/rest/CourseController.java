package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.domain.dto.CourseDto;
import com.mycompany.myapp.domain.dto.CourseWithTNDto;
import com.mycompany.myapp.service.CourseService;
import com.mycompany.myapp.service.UserService;
import io.swagger.annotations.Api;
import javax.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping
@Api(value="Course Service Controller", description = "Controller for find couses information")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    @GetMapping(path = "/api/course/findAllCourses", produces = "application/json")
    public HttpEntity<List<CourseDto>> findAllCourses(){
        
        List<CourseDto> allCourses = courseService.findAllCourses();

        return new ResponseEntity<>(allCourses, HttpStatus.OK);
    }

    @GetMapping(path = "/api/course/findAllCoursesDto", produces = "application/json")
    public HttpEntity<List<CourseDto>> findAllCoursesDto(){
        List<CourseDto> allCourses = courseService.findAllCoursesDtoFromDB();

        return new ResponseEntity<>(allCourses, HttpStatus.OK);
    }

    @GetMapping(path = "/api/course/findAllCoursesWithTNDto", produces = "application/json")
    public HttpEntity<List<CourseWithTNDto>> findAllCoursesWithTNDto(){
        List<CourseWithTNDto> allCourses = courseService.findAllCoursesDtoWithTeacherNameFromDB();

        return new ResponseEntity<>(allCourses, HttpStatus.OK);
    }

    @GetMapping(path = "/api/user/findId/{teacherName}", produces = "application/json")
    public HttpEntity<String> findId(@PathVariable String teacherName){
        Optional<User> teacherUser = userService.getUserWithAuthoritiesByLogin(teacherName);
        if (teacherUser.isPresent()) {
            String id= String.valueOf(teacherUser.get().getId());
            return new ResponseEntity<>(id, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    @GetMapping(path = "/api/course/findEnrolledCoursesWithTNDto/{id}", produces = "application/json")
    public HttpEntity<List<CourseWithTNDto>> findEnrolledCoursesWithTNDto(@PathVariable String id){
        List<CourseWithTNDto> allCourses = courseService.findAllCoursesWithId(id);

        return new ResponseEntity<>(allCourses, HttpStatus.OK);
    }


    @PostMapping(path = "/api/course/registerCourse/{courseName}", produces = "application/json")
    public HttpStatus registerCourse(@PathVariable String courseName) {
        try {
            courseService.registerCourse(courseName);
            return HttpStatus.OK;
        } catch (Exception e) {
            return HttpStatus.UNPROCESSABLE_ENTITY;
        }
    }

    @PostMapping(path = "/api/course/addCourse/{teacherId}", produces = "application/json")
    public HttpStatus addCourse(@PathVariable long teacherId,@RequestBody @NotNull CourseDto course) {
        System.out.println(course.getTeacherId());
        try {
            System.out.println("teacherId");
            CourseDto courseDto= CourseDto.builder()
                .courseName(course.getCourseName())
                .courseContent(course.getCourseContent())
                .courseLocation(course.getCourseLocation())
                //.teacherId(course.getTeacherId())
                .teacherId(teacherId)
                .build();
            courseService.addCourse(courseDto);
            return HttpStatus.OK;
        } catch (Exception e) {
            return HttpStatus.BAD_REQUEST;
        }
    }

    @PutMapping(path = "/api/course/updateCourse", produces = "application/json")
    public HttpStatus updateCourse(@RequestBody @NotNull CourseDto course) {
        try {
            courseService.updateCourse(course);
            return HttpStatus.OK;
        } catch (Exception e) {
            return HttpStatus.BAD_REQUEST;
        }
    }

    @DeleteMapping(path = "/api/course/deleteCourse/{courseName}", produces = "application/js")
    public HttpStatus deleteCourse(@NotNull @PathVariable("courseName") String courseName) {
        try {
            courseService.deleteCourse(courseName);
            return HttpStatus.OK;
        } catch (Exception e) {
            return HttpStatus.BAD_REQUEST;
        }
    }

    @DeleteMapping(path = "/api/course/unregisterCourse/{courseName}", produces = "application/json")
    public HttpStatus unregisterCourse(@PathVariable String courseName) {
        try {
            courseService.unregisterCourse(courseName);
            return HttpStatus.OK;
        } catch (Exception e) {
            return HttpStatus.UNPROCESSABLE_ENTITY;
        }
    }
}
