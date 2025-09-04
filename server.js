import path from 'path';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import { connectDB } from './src/config/db.js';
import engine from "ejs-mate";

import employeeRoutes from './src/routes/employee.routes.js';
import departmentRoutes from './src/routes/department.routes.js';
import employeeApiRoutes from './src/routes/api/employee.api.routes.js';
import departmentApiRoutes from './src/routes/api/department.api.routes.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// EJS
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));

app.get('/', (req, res) => res.render('home'));
app.use('/employees', employeeRoutes);
app.use('/departments', departmentRoutes);
app.use('/api/employees', employeeApiRoutes);
app.use('/api/departments', departmentApiRoutes);

// 404
app.use((req, res) => {
  if (req.accepts('html')) return res.status(404).send('<h1>404</h1>');
  res.status(404).json({ message: 'Not found' });
});

// Errors
app.use((err, req, res, _next) => {
  console.error(err);
  const message = err?.message || 'Server error';
  if (req.accepts('html')) return res.status(500).send(`<pre>${message}</pre>`);
  res.status(500).json({ message });
});

const port = process.env.PORT || 3000;
connectDB(process.env.MONGODB_URI)
  .then(() => app.listen(port, () => console.log(`🚀 http://localhost:${port}`)))
  .catch((e) => {
    console.error('DB connection error', e);
    process.exit(1);
  });
