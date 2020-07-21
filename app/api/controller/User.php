<?php

namespace app\api\controller;

use app\api\model\Teacher;
use Exception;
use zhlix\helper\facade\Handle;
use zhlix\helper\facade\Rsa;

class User extends Base
{
    public function changePassword($encryptedData, $captcha)
    {
        Handle::exec(function () use ($encryptedData, $captcha) {
            if (!captcha_check($captcha)) throw new Exception('验证码不正确');
            ['password_old' => $old, 'password_new' => $password] = json_decode(Rsa::decode($encryptedData), 1);
            $teacher = Teacher::where([['account', '=', session('user.account')], ['password', '=', $old]])->find();
            if (!$teacher) throw new Exception('用户名或密码错误'); // 用户不存在
            // if ($password === $teacher->password) throw new Exception('密码未修改'); // 密码错误

            $teacher->password = $password;

            $res = $teacher->save();

            if (!$res) throw new Exception('密码未修改');

            session('user', $teacher->hidden(['password', 'update_time', 'delete_time'])->toArray());

            return [null, 200, '修改成功'];
        });
        return Handle::result();
    }

    /**
     * 登录
     *
     * @param [type] $encryptedData
     * @param [type] $captcha
     * @return void
     */
    public function login($encryptedData, $captcha)
    {
        Handle::exec(function () use ($encryptedData, $captcha) {
            if (session('?user')) throw new Exception('已登录，请勿重复提交', 200);

            if (!captcha_check($captcha)) throw new Exception('验证码不正确');
            ['username' => $username, 'password' => $password] = json_decode(Rsa::decode($encryptedData), 1);
            $teacher = Teacher::where('account', $username)->find();
            if (!$teacher) throw new Exception('用户名或密码错误'); // 用户不存在
            if ($password !== $teacher->password) throw new Exception('用户名或密码错误'); // 密码错误

            session('user', $teacher->hidden(['password', 'update_time', 'delete_time'])->toArray());

            return [null, 200, '登录成功'];
        });
        return Handle::result();
    }

    /**
     * 登出
     *
     * @return void
     */
    public function logout()
    {
        session(null);
        return result(null, 200, '登出成功');
    }
}
