const express = require('express');
const cors = require('cors');
const { knex } = require('knex');


const app = express();
const port = 4000;

var table;

// Knex configuration
const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'Gas',
  },
});

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Define the /data endpoint
app.post('/data',express.text(), async (req, res) => {
  table = req.body;
  try {
    const queryResult = await db.select('*').from(table);
    res.json(queryResult);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

app.post('/auth',express.json(), async (req, res) => {
  try {
    const queryResult = await db.select('*').where({username: req.body.username, password: req.body.password}).from('auth');
    if(queryResult.length > 0)
    {
      res.status(200).send();
    }
    else{
      res.status(404).send('incorrect data');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

app.post('/update',express.json(), async (req, res) => {
  try {

    const tableFields = {};
    for (const key in req.body) {
      if(key != 'isNew') {
        tableFields[key] = req.body[key];
      }
    };
    
    if('isNew' in req.body){
      if(req.body.isNew)
      {
        console.log(tableFields);
        await db(table).insert(tableFields);
        return res.status(200).json(req.body);
      }
    }

    // Update the row in the database using Knex
    await db(table)
      .where('id', req.body.id)
      .update(tableFields);

    return res.status(200).json(req.body); // Return the updated row data
  } catch (error) {
    return res.status(500).json(console.log(error));
  }



});

app.post('/delete',express.text(), async (req, res) => {
  id = req.body;
  try {
    await db(table).where('id',id).del();
    return res.status(200).end();
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
