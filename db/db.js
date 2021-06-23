

const { Pool } = require('pg');
const pool = new Pool({
    user: "postgres",
    password: "James112090!",
    host:"localhost",
    port:5431,
    database:"setlistdb",
    max:"20",
    connectionTimeoutMillis:0,
    idleTimeoutMillis:0
})



export const query = async (query,info) => {
    try
    {
        const results =  await pool.query(query,info);
        return results.rows;
    }
    catch(e)
    {
        console.log(e);
    }
    
}
