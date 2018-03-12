const config = require('../config')[process.env.NODE_ENV || "dev"];

const mysql = require('mysql');
const pool = mysql.createPool(config.db);


withConnection = (query, values, callback) => {
    pool.getConnection( (err, connection) => {
        connection.query(query, values, (err, results, fields) => {
          connection.release();
          callback(err, results, fields);
      });
    });
}

exports.addEmail = (name, email, successCb, errorCb) => {
    withConnection(
        "INSERT INTO subscription SET ?", 
        {
            name: name, 
            email: email
        },
        (err, results, fields) => {
            if(err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    errorCb("DUPLICATED"); // TODO: encapsulate error codes for database errors
                    return;
                }
                console.log(err); //suficiente info? no haria falta fecha y demas?
                errorCb("OTHER");
            } else {
                successCb(results);
            }
        });
}