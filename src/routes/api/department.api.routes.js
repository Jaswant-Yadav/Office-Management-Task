import { Router } from 'express';
import {
  listDepartments, createDepartment, getDepartment, updateDepartment, deleteDepartment
} from '../../controllers/departmentController.js';

const r = Router();
r.get('/', listDepartments);
r.post('/', createDepartment);
r.get('/:id', getDepartment);
r.put('/:id', updateDepartment);
r.delete('/:id', deleteDepartment);
export default r;
