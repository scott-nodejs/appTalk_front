export default [
    {
        path: '/',
        component: require('@views/Main').default, // main
        children: [
            {
                path: '',
                name: 'home',
                component: require('@views/Home/Home').default // 主页
            },
            {
                path: 'p/:aid',
                name: 'article',
                component: require('@views/Article/Article').default // 文章内容页
            },
            {
                path: 'subscribe/:type',
                name: 'subscribe_tag',
                component: require('@views/Home/Home') // 文章标签订阅页
            },
            {
                path: 'setting',
                name: 'setting',
                component: () => import('@views/Setting/Setting'), // 文章内容页
                children: [
                    {
                        path: 'profile',
                        name: 'settingProfile',
                        component: () => import('@views/Setting/view/Profile') // 修改资料
                    },
                    {
                        path: 'reset-password',
                        name: 'settingResetPassword',
                        component: () => import('@views/Setting/view/ResetPassword') // 重置密码
                    }
                ],
                redirect: { name: 'settingProfile' }
            },
            {
                path: 'user/:uid/:routeType',
                name: 'user',
                component: () => import('@views/User/User') // 用户内页
            },
            {
                path: 'write/:type',
                name: 'Write',
                component: () => import('@views/Write/Write') // 文章编写
            },
            {
                path: 'user-attention',
                name: 'AttentionMessage',
                component: () => import('@views/AttentionMessage') // 关注
            },
            {
                path: '/douban',
                name:'comment',
                component: resolve => require(['@views/ItemList/index.vue'], resolve).default
            },
            {
                path: '/movie/:id',
                component: resolve => require(['@views/Detail/index.vue'], resolve)
            },
            {
                path: '/404',
                name: '404',
                component: resolve => require(['@views/Error/NotFound.vue'], resolve)
            },
            {
                path: '*',
                redirect: '/404'
            }
        ]
    },
    {
        path: '/sign/in',
        name: 'signIn',
        component: () => import('@views/Sign/SignIn') // 登录
    },
    {
        path: '/sign/up',
        name: 'signUp',
        component: () => import('@views/Sign/SignUp') // 注册
    },
    {
        path: '/sign/reset-password',
        name: 'resetPassword',
        component: () => import('@views/Sign/ResetPassword') // 找回密码
    }
]
