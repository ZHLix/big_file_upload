<?php

namespace app\api\controller;

class Index extends Base
{
    public function index()
    {
        if ($this->request->isGet()) { # 检测文件是否已上传
            $filename = input('filename');
            $uploaded = file_exists("./upload/$filename");
            if (!$uploaded) { # 文件未上传 检测上传进度
                $basename = "./upload/" . basename($filename, '.mp4');
                if (is_dir($basename)) { // 已上传部分文件
                    $list = glob($basename . '/*');
                    $uploaded = count($list) - 1;
                } else { // 未上传文件
                    $uploaded = 0;
                    mkdir($basename);
                }
            }
            return result(['status' => $uploaded]);
        } else if ($this->request->isPost()) { # 上传文件
            $file = input('file.file');
            $filename = input('filename');
            $chunk = input('chunk');
            $chunks = input('chunks');
            $path = './upload/' . basename($filename, '.mp4'); //确定上传的文件名
            if (!is_dir($path)) {
                mkdir($path);
            }

            $filename_tmp = $path . '/' . $chunks . '_' . $chunk;

            //第一次上传时没有文件，就创建文件，此后上传只需要把数据追加到此文件中
            move_uploaded_file($file, $filename_tmp);

            if ($chunk == $chunks) {
                $path = "./upload/" . basename($filename, '.mp4');
                $filename = "./upload/$filename";
                $list = glob($path . '/*');
                uasort($list, function ($a, $b) {
                    preg_match("/_(\d+)$/", $a, $a_tmp);
                    $a = $a_tmp[1];
                    preg_match("/_(\d+)$/", $b, $b_tmp);
                    $b = $b_tmp[1];
                    if ($a === $b) return 0;
                    return ((int) $a < (int)$b) ? -1 : 1;
                });
                if (file_exists($filename)) {
                    unlink($filename);
                }
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
            }
            return result(['path' => $filename], 200, '上传成功');
        }
    }
}
