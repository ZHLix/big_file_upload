<?php

namespace app\api\model;

class Bind extends Base
{
    public function getIdcardAttr($v)
    {
        return str_replace(substr($v, 4, 11), '*******', $v);
    }
}
