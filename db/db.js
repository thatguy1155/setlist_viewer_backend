const dbName = process.env.NODE_ENV === 'test' ? 'setlist_test_db' : 'setlist_db';


const { Pool } = require('pg');
const pool = new Pool({
    user: "jamesglass",
    password: "James112090!",
    host:"localhost",
    port:5432,
    database:dbName,
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
