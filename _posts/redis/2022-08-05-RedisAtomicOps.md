---
layout:     post
title:      Redis如何保证原子操作
subtitle:   redis原子操作的解决思路
date:       2022-08-05
author:     Nanco
header-img: img/post-bg-debug.png
catalog: true
tags:
    - Redis
---

# Redis执行原子操作

## 1、单命令操作
---
使用redis自封装的操作命令，如SETNX/INCR/DECR等命令

## 2、Redis锁
---
调用SETNX对某个键加锁，使得业务逻辑串行化处理

注意加锁需要处理通用的几个问题：
- 锁的超时释放
- 误解锁的风险

## 3、Lua脚本
---
redis会把整个lua脚本作为一个整体执行，在执行的过程中不会被其他命令打断， 从而保证lua脚本中操作的原子性

### Go中使用lua脚本操作redis：
```lua
local redis_key = KEYS[1]
local value= ARGV[1]
local expire = ARGV[2]
local token = redis.call('GET', redis_key)
if token == false then
    token = account..":"..account
end
redis.call('SET', redis_key, token)
redis.call('EXPIRE', redis_key, expire)
return token
```
`注意不同其他语言，Lua中数组的下标是从1开始的`
```go
func main() {
	InitRedisClient()
	luaScript = redis.NewScript(
		`lua脚本内容`
	)
	r, err := luaScript.Eval(rClient, "myKey", 1111).Result()
	if err != nil {
		fmt.Println("Err", err)
	}
	fmt.Print(r)
}
```