<?php

namespace app\controller;

use app\BaseController;

class Index extends BaseController
{
    public function index()
    {
        if ($this->request->isPost()) {
            $file = input('file.file');
            $filename = input('filename');
            $path = './upload/' . basename($filename, '.mp4'); //确定上传的文件名
            if (!is_dir($path)) {
                mkdir($path);
            }

            $filename = $path . '/' . input('chunk');

            //第一次上传时没有文件，就创建文件，此后上传只需要把数据追加到此文件中
            // if (!file_exists($filename)) {
            move_uploaded_file($file, $filename);
            // } else {
            //     file_put_contents($filename, file_get_contents($file), FILE_APPEND);
            // }
            return result(['path' => $filename], 200, '上传成功');
        } else if ($this->request->isPut()) {
            $filename = input('filename');
            $path = "./upload/" . basename($filename, '.mp4');
            $filename = "./upload/$filename";
            $list = glob($path . '/*');
            foreach ($list as $v) {
                $context = file_get_contents($v);
                if (!file_exists($filename)) {
                    $fd = fopen($filename, 'w+');
                } else {
                    $fd = fopen($filename, 'a');
                }
                fwrite($fd, $context);
            }

            deldir($path);

            return result(['path' => $filename], 200, '上传成功');
        }
    }

    public function hello($name = 'ThinkPHP6')
    {
        return 'hello,' . $name;
    }
}
