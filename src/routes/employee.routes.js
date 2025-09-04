import { Router } from 'express';
import {
  listEmployees, createEmployee, updateEmployee, deleteEmployee,
  employeeCreateForm, employeeEditForm
} from '../controllers/employeeController.js';

const r = Router();

r.get('/', listEmployees);
r.get('/new', employeeCreateForm);
r.get('/:id/edit', employeeEditForm);
r.post('/', createEmployee);
r.post('/:id', updateEmployee);
r.post('/:id/delete', deleteEmployee);

export default r;
