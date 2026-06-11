import express   from 'express';
import cors      from 'cors';
import dotenv    from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';

dotenv.config();
connectDB();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', routes);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});