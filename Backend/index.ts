import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv'
import connectDB from './config/db'
dotenv.config()
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Example endpoint to fetch customer data
app.get('/api/customers/:customerId/spending', (req, res) => {
  const customerId = req.params.customerId;
  // Fetch and process data here
  // Example: const spendingData = fetchSpendingData(customerId);
  const spendingData = { /* Processed spending data */ };
  res.json(spendingData);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
