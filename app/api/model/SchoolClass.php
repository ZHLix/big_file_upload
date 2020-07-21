<?php

namespace app\api\model;

class SchoolClass extends Base
{
    public function course()
    {
        return $this->hasOne(Course::class, 'id', 'course_id');
    }
}
