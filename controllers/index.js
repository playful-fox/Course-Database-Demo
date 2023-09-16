import { Router } from "express";


// eslint-disable-next-line no-unused-vars
import sql from "mssql";
const router = Router();

router.get("/check-auth", (req, res) => {
    if (req.session && req.session.user) {
        res.json({ loggedIn: true });
    }else {
        res.json({ loggedIn:false });
    }
});

router.get("/trans", async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const result = await pool.request().query('SELECT * from Trans');
        console.log(result);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying Trans table", err);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/login", async (req, res) => {
    try{
        const { username, password } = req.body;
        const pool = req.app.locals.pool;

        const query = `SELECT AccID, Password FROM Account WHERE AccID = @username;`;
        const result = await pool.request()
            .input('username', username)
            .query(query);
        console.log("Query Result: ", result.recordset); // 印出查詢結果，方便除錯

        if (result.recordset.length > 0) {
            if (password === result.recordset[0].Password) {
                req.session.user = { AccID: username };
                res.json({ success: true, message: 'Login successful' });
            }else {
                res.status(401).json({ success: false, message: 'Wrong password' });
            }
        } else {
            res.status(401).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error('Error during login', err);
        res.status(401).json({ success: false, message: 'Error during login' });
    }
});

router.post('/trans', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const newTrans = req.body;


        const result = await pool.request()
            .input('AccID', sql.NVarChar, newTrans.AccID)
            .input('AtmID', sql.NVarChar, newTrans.AtmID)
            .input('TranType', sql.NVarChar, newTrans.TranType)
            .input('TranNote', sql.NVarChar, newTrans.TranNote)
            .input('UP_USR', sql.NVarChar, newTrans.UP_USR)
            .query('INSERT INTO Trans (AccID, AtmID, TranType, TranNote, UP_USR) VALUES (@AccID, @AtmID, @TranType, @TranNote, @UP_USR)');

        if (result.rowsAffected[0] === 0){
            res.status(404).send('Transaction not found');
            return;
        }

        res.status(200).send('Transaction added');
    } catch (err) {
        console.error('Error during adding transaction', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/trans/:TranID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { TranID } = req.params;

        const result = await pool.request()
            .input('TranID', sql.NVarChar, TranID)
            .query('SELECT AccID, TranID, CONVERT(varchar, TranTime, 23) AS TranTime, AtmID, TranType, TranNote, CONVERT(varchar, UP_DATETIME, 23) AS UP_DATETIME, UP_USR FROM Trans WHERE TranID = @TranID');

        if (result.recordset.length === 0){
            res.status(404).send('Transaction not found');
            return;
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error('Error during getting transaction', err);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/trans/:TranID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { TranID } = req.params;

        const result = await pool.request()
            .input('TranID', sql.NVarChar, TranID)
            .query('DELETE FROM Trans WHERE TranID = @TranID');

        if (result.rowsAffected[0] === 0){
            res.status(404).send('Transaction not found');
            return;
        }

        res.status(200).json({ success: true, message: 'Transaction deleted' });
    } catch (err) {
        console.error('Error during deleting transaction', err);
        res.status(500).send('Internal Server Error');
    }
});
export default router;