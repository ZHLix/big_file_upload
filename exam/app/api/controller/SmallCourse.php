<?php

namespace app\api\controller;

use app\api\model\SmallCourse as ModelSmallCourse;

class SmallCourse extends Base
{

    public function index()
    {
        $where = [];
        $req = input('post.');

        foreach ($req as $k => $v) {
            switch ($k) {
                case 'name':
                    $where[] = ['name', 'like', "%$v%"];
                    break;
            }
        }
        $course_id = input('post.course_id');
        $res = ModelSmallCourse::where('course_id', $course_id)->where($where)->order('sort asc')->paginate(input('limit'))->toArray();
        return result(['count' => $res['total'], 'rows' => $res['data']]);
    }

    /**
     * 修改课程
     */
    public function edit()
    {
        return handle_re(function () {
            $req = input('post.');

            $res = ModelSmallCourse::update($req);
            if (!$res) return result(null, 400, '修改失败');
            return result(null, 200, '修改成功');
        });
    }
}
