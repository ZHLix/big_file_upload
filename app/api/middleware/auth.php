<?php

declare(strict_types=1);

namespace app\api\middleware;

class auth
{
    /**
     * 处理请求
     *
     * @param \think\Request $request
     * @param \Closure       $next
     * @return Response
     */
    public function handle($request, \Closure $next)
    {
        //
        if (!session('?user')) return result(null, 400, '未登录，禁止访问');
        return $next($request);
    }
}
