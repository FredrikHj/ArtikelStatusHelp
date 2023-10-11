import sql from 'mssql';
import {sqlConConfig} from '../../data/SQLConConfig';
import SQLQueryBuilder from '../../data/SQLQueryBuilder';
var sendSQLRes: Array<object> = [];

export default function handler(req: any, res: any, next: any){
    
    const runSQL = async () => {      
        console.log("Called Server");
        sql.connect(sqlConConfig).then((pool: any) => {
            return pool.request().query(SQLQueryBuilder())
        }).then((result: any) => {
            console.log('result :', result.rowsAffected[0]);
            sendSQLRes.push(result);
            res.status(200).send(sendSQLRes);
            }).catch((err: any) => {
                res.send(err);    
            }
        );
    };    
   //setTimeout(() => {res.status(200).send(sendSQLRes);}, 3000);
    runSQL();
    console.log("------------------------------------------------------");
    
    // Reset the length = 0
    sendSQLRes.length = 0;
}
