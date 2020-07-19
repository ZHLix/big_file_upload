<?php

namespace app\api\controller;

use app\api\model\Course as ModelCourse;

class Course extends Base
{
    /**
     * 课程列表
     */
    public function index()
    {
        $res = ModelCourse::paginate(input('limit'))->toArray();
        return result(['count' => $res['total'], 'rows' => $res['data']]);
    }

    /**
     * 创建课程
     */
    public function create()
    {
        return handle_re(function () {
            $req = input('post.');

            $res = ModelCourse::create($req);
            if (!$res) return result(null, 400, '添加失败');
            return result(null, 200, '添加成功');
        });
    }

    /**
     * 修改课程
     */
    public function edit()
    {
        return handle_re(function () {
            $req = input('post.');

            $res = ModelCourse::update($req);
            if (!$res) return result(null, 400, '修改失败');
            return result(null, 200, '修改成功');
        });
    }

    public function del()
    {
        return handle_re(function () {
            $id = input('post.id');

            $res = ModelCourse::destroy($id);
            if (!$res) return result(null, 400, '修改失败');
            return result(null, 200, '修改成功');
        });
    }
}
