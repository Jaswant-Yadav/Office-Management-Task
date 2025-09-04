import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { buildPagination } from '../utils/paginate.js';

export const listEmployees = asyncHandler(async (req, res) => {
  const { page, limit, search, department, jobTitle } = req.query;
  const { skip, limit: l, page: p } = buildPagination({ page, limit });

  const q = {};
  if (search) {
    q.$text = { $search: search };
  }
  if (department) {
    q.department = department;
  }
  if (jobTitle) {
    q.jobTitle = new RegExp(jobTitle, 'i');
  }

  const [items, total] = await Promise.all([
    Employee.find(q)
      .populate('department', 'name')
      .populate('supervisor', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l),
    Employee.countDocuments(q)
  ]);

  const meta = {
    page: p,
    limit: l,
    total,
    pages: Math.ceil(total / l)
  };

  if (req.accepts('html')) {
    const departments = await Department.find().sort('name');
    return res.render('employees/index', { employees: items, meta, departments, filters: { search, department, jobTitle } });
  }
  res.json({ data: items, meta });
});


export const createEmployee = async (req, res, next) => {
  try {
    if (!req.body.supervisor) delete req.body.supervisor; 
    const employee = new Employee(req.body);
    await employee.save();
    res.redirect('/employees');
  } catch (err) {
    next(err);
  }
};


export const updateEmployee = async (req, res, next) => {
  try {
    if (!req.body.supervisor) delete req.body.supervisor; 
    await Employee.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
    res.redirect('/employees');
  } catch (err) {
    next(err);
  }
};

export const getEmployee = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id)
    .populate('department', 'name')
    .populate('supervisor', 'firstName lastName email');
  if (!emp) return res.status(404).json({ message: 'Not found' });
  res.json(emp);
});



export const deleteEmployee = asyncHandler(async (req, res) => {
  const ok = await Employee.findByIdAndDelete(req.params.id);
  if (!ok) return res.status(404).json({ message: 'Not found' });
  if (req.accepts('html')) return res.redirect('/employees');
  res.json({ message: 'Deleted' });
});


export const employeeCreateForm = asyncHandler(async (req, res) => {
  const departments = await Department.find().sort('name');
  const supervisors = await Employee.find().select('firstName lastName email');
  res.render('employees/form', { isEdit: false, employee: {}, departments, supervisors });
});

export const employeeEditForm = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.redirect('/employees');
  const departments = await Department.find().sort('name');
  const supervisors = await Employee.find({ _id: { $ne: employee._id } }).select('firstName lastName email');
  res.render('employees/form', { isEdit: true, employee, departments, supervisors });
});
