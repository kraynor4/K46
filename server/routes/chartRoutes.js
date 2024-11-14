const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define schemas (Optional if you don't want strict schema validation)
const sumChartSchema = new mongoose.Schema({}, { collection: 'sum-chart' });
const repChartSchema = new mongoose.Schema({}, { collection: 'rep-chart' });

// Create models for each collection
const SumChart = mongoose.model('SumChart', sumChartSchema);
const RepChart = mongoose.model('RepChart', repChartSchema);

// Route to get data from sum-chart
router.get('/sum-chart', async (req, res) => {
  try {
    const data = await SumChart.findOne(); // Fetch the first document in sum-chart
    res.json(data);
  } catch (error) {
    console.error('Error fetching sum-chart data:', error);
    res.status(500).json({ error: 'Failed to fetch sum-chart data' });
  }
});

// Route to get data from rep-chart
router.get('/rep-chart', async (req, res) => {
  try {
    const data = await RepChart.findOne(); // Fetch the first document in rep-chart
    res.json(data);
  } catch (error) {
    console.error('Error fetching rep-chart data:', error);
    res.status(500).json({ error: 'Failed to fetch rep-chart data' });
  }
});

module.exports = router;
