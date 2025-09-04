import Department from '../models/Department.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const listDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().sort('name');
  if (req.accepts('html')) {
    return res.render('departments/index', { departments });
  }
  res.json(departments);
});

export const createDepartment = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const dept = await Department.create({ name, description });
  if (req.accepts('html')) return res.redirect('/departments');
  res.status(201).json(dept);
});

export const getDepartment = asyncHandler(async (req, res) => {
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ message: 'Not found' });
  res.json(dept);
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const dept = await Department.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true, runValidators: true }
  );
  if (!dept) return res.status(404).json({ message: 'Not found' });
  if (req.accepts('html')) return res.redirect('/departments');
  res.json(dept);
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const ok = await Department.findByIdAndDelete(req.params.id);
  if (!ok) return res.status(404).json({ message: 'Not found' });
  if (req.accepts('html')) return res.redirect('/departments');
  res.json({ message: 'Deleted' });
});
