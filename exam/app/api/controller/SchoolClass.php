<?php

namespace app\api\controller;

use app\api\model\Bind;
use app\api\model\SchoolClass as ModelSchoolClass;

class SchoolClass extends Base
{
    /**
     * 列表
     *
     * @return void
     */
    public function index()
    {
        $where = [];
        $req = input('post.');

        foreach ($req as $k => $v) {
            switch ($k) {
                case 'class_name':
                    $where[] = ['name', 'like', "%$v%"];
                    break;
                case 'date_range':
                    $where[] = ['start_time', 'between', explode('~', $v)];
                    break;
            }
        }

        $res = ModelSchoolClass::hasWhere('course', ['teacher_id' => session('user.id')])
            ->where($where)
            ->field(['SchoolClass.*', 'Course.name' => 'course_name'])
            ->paginate(input('limit'))->toArray();
        return result(['count' => $res['total'], 'rows' => $res['data']]);
    }

    public function detail()
    {
        $where = [];
        $req = input('post.');

        foreach ($req as $k => $v) {
            switch ($k) {
                case 'name':
                    $where[] = ['name', 'like', "%$v%"];
                    break;
                case 'idcard':
                    $where[] = ['idcard', 'like', "%$v%"];
                    break;
            }
        }
        // $res = ModelSchoolClass::hasWhere('course', ['teacher_id' => session('user.id')])->paginate(input('limit'))->toArray();
        $res = Bind::where('class_id', input('class_id'))->where($where)->paginate(input('limit'))->toArray();
        return result(['count' => $res['total'], 'rows' => $res['data']]);
    }
}
