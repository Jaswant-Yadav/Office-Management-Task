import { Router } from 'express';
import {
  listDepartments, createDepartment, updateDepartment, deleteDepartment
} from '../controllers/departmentController.js';

const r = Router();

r.get('/', listDepartments);
r.post('/', createDepartment);
r.post('/:id', updateDepartment);
r.post('/:id/delete', deleteDepartment);

export default r;
