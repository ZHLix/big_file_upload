<?php

namespace app\api\model;

use think\Model;
use think\model\concern\SoftDelete;

class Base extends Model
{
    use SoftDelete;

    protected $autoWriteTimestamp = 'datetime';
}
