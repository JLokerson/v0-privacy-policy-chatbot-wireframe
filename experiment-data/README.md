# Experiment Data

This directory contains the results from the privacy policy usability experiment.

## Files

- `results.json` - Contains all experiment results with timing data for each participant

## Data Structure

Each result entry includes:
- `id` - Unique identifier for the result
- `timestamp` - ISO timestamp of when the experiment was completed
- `version` - Which version was tested (A or B)
- `totalTime` - Total time spent in seconds
- `taskTimes` - Array of time spent on each task in seconds
- `taskLabels` - Labels for each task
- `averageTimePerTask` - Average time per task in seconds

## Usage

The data is automatically saved when participants complete the experiment. You can:
1. Commit this file to your GitHub repository to track results over time
2. Import the JSON file into spreadsheet software for analysis
3. Use the data for statistical analysis comparing Version A vs Version B

## Note

This file-based storage works in local development. For production deployments, consider using a database integration (Supabase, Neon) or cloud storage (Vercel Blob).
