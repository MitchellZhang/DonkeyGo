module.exports =
    {
        mysql: {
            host: '127.0.0.1',
            user: 'root',
            password: '123456',//本地的数据库，密码明文随便乱写。生产上不能这么干！
            database: 'donkey_go_schema', // 前面建的user表位于这个数据库中
            port: 3306
        }
    };