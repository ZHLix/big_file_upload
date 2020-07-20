<?php

namespace app\api\controller;

use app\api\model\Course as ModelCourse;
use app\api\model\SmallCourse;

class Course extends Base
{
    /**
     * 课程列表
     */
    public function index()
    {
        $res = ModelCourse::where('teacher_id', session('user.id'))->paginate(input('limit'))->toArray();
        return result(['count' => $res['total'], 'rows' => $res['data']]);
    }

    /**
     * 创建课程
     */
    public function create()
    {
        return handle_re(function () {
            $req = input('post.');
            $req['teacher_id'] = session('user.id');
            $res = ModelCourse::create($req);
            if (!$res) return result(null, 400, '添加失败');
            $video_list = explode(',', $req['course']);
            foreach ($video_list as $k => $v) {
                $video_list[$k] = [
                    'name' => basename($v, '.mp4'),
                    'video_url' => $v,
                    'course_id' => $res['id']
                ];
            }
            $res = (new SmallCourse)->saveAll($video_list);
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

            $course_old = explode(',', ModelCourse::where('id', $req['id'])->value('course'));
            $course_new = explode(',', $req['course']);
            // return result([$course_old, $course_new, array_filter($course_old, function ($v) use ($course_new) {
            //     return !in_array($v, $course_new);
            // })]);
            $res = ModelCourse::update($req);
            if (!$res) return result(null, 400, '修改失败');
            $course_del = array_filter($course_old, function ($v) use ($course_new) {
                return !in_array($v, $course_new);
            });
            // 删除地址
            SmallCourse::where([['video_url', 'in', $course_del]])->select()->delete();
            // 添加新视频地址
            $course_add = array_filter($course_new, function ($v) use ($course_old) {
                return !in_array($v, $course_old);
            });
            foreach ($course_add as $k => $v) {
                $course_add[$k] = [
                    'name' => basename($v, '.mp4'),
                    'video_url' => $v,
                    'course_id' => $res['id']
                ];
            }
            $res = (new SmallCourse)->saveAll($course_add);
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
