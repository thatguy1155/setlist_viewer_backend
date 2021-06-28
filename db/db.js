

const { Pool } = require('pg');
const pool = new Pool({
    user: "postgres",
    password: "James112090!",
    host:"localhost",
    port:5431,
    database:"setlistdb",
    max:"20",
    connectionTimeoutMillis:1000,
    idleTimeoutMillis:1000
})



export const query = async (query,info) => {
    try
    {
        const results =  await pool.query(query,info);
        // pool.end(() => {
        //   console.log('pool has ended')
        // })
        
        return results.rows;
    }
    catch(e)
    {
        console.log(e);
    }
    
}
