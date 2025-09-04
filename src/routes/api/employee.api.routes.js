import { Router } from 'express';
import {
  listEmployees, createEmployee, getEmployee, updateEmployee, deleteEmployee
} from '../../controllers/employeeController.js';

const r = Router();
r.get('/', listEmployees);
r.post('/', createEmployee);
r.get('/:id', getEmployee);
r.put('/:id', updateEmployee);
r.delete('/:id', deleteEmployee);
export default r;
