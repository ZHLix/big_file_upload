<?php

namespace app\api\model;

class Course extends Base
{
    protected $table = 'teacher_course';

    public function smallCourseCount()
    {
        return $this->hasOne(SmallCourse::class, 'course_id', 'id')->field(['count(*)' => 'count'])->group('course_id');
    }
}
