module.exports = {   
    port: 8081,     
    db: {
        database: process.env.DB_NAME || 'Game',
        user: process.env.DB_User || 'root',
        password: process.env.DB_PASS || '',
        options: {
        dialect: process.env.DIALECT || 'sqlite',//sqlite mysql
        storage: './Game.sqlite'
        //host: process.env.HOST || 'localhost',
        },
        },  
    authentication: {
        jwtSecret: 'test'
    }
}