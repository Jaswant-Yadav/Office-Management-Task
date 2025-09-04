import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    jobTitle:  { type: String, default: '' },
    department: { type: ObjectId, ref: 'Department', required: true },
    supervisor: { type: ObjectId, ref: 'Employee', default: null },
    country:   { type: String, default: '' },
    state:     { type: String, default: '' },
    city:      { type: String, default: '' }
  },
  { timestamps: true }
);

EmployeeSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

export default mongoose.model('Employee', EmployeeSchema);
