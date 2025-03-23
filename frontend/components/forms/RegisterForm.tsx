import { useState } from 'react';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { registerSchema } from './validation';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const registerSchema = object({
  email: string().email('Invalid email').required('Email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  role: string().oneOf(['tenant', 'landlord'], 'Please select a role').required('Role is required'),
});

// Export validation schema for reuse
export { registerSchema };

export function RegisterForm() {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        // ... existing registration logic ...
      } catch (error) {
        setFieldError('email', 'Registration failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* ... existing form fields with formik integration ... */}
      {formik.errors.email && formik.touched.email && (
        <div className="text-red-600 text-sm">{formik.errors.email}</div>
      )}
    </form>
  );
}
