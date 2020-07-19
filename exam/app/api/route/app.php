<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

use app\api\middleware\auth;
use think\facade\Route;


Route::group('', function () {

    Route::group('course', function () {
        Route::post('', 'course/index');
        Route::post('create', 'course/create');
        Route::post('edit', 'course/edit');
        Route::post('del', 'course/del');
    });

    Route::group('user', function () {
        Route::post('changePassword', 'user/changePassword');
    });

    Route::group('file', function () {
        Route::get('upload', 'file/upload');
        Route::post('upload', 'file/upload');
    });
})->middleware(auth::class);

Route::get('file', 'file/index');

Route::group('user', function () {
    Route::post('login', 'user/login');
    Route::post('logout', 'user/logout');
});


Route::miss(function () {
    return result(null, 400, '访问地址不存在');
});
