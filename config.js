const env = process.env.NODE_ENV || "dev";

const dev = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT) || 3000,
        translations: ['EN', 'JP', 'KR'],
        translationsDefault: 'EN'
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: parseInt(process.env.DEV_DB_PORT) || 27017,
        name: process.env.DEV_DB_NAME,
        user: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PWD,
        connectStr: process.env.DEV_DB_CONN_STR
    },
    apis: {
        linkedInClientId: process.env.DEV_IN_CLIENT_ID,
        linkedInClientSecret: process.env.DEV_IN_CLIENT_SECRET
    }
};

const prod = {
    app: {
        port: parseInt(process.env.PROD_APP_PORT),
        translations: ['EN', 'JP', 'KR'],
        translationsDefault: 'EN'
    },
    db: {
        host: process.env.PROD_DB_HOST,
        port: parseInt(process.env.PROD_DB_PORT),
        name: process.env.PROD_DB_NAME,
        user: process.env.PROD_DB_USERNAME,
        password:process.env.PROD_DB_PWD
    }
};

const config = {
    dev,
    prod
};
   
module.exports = config[env];