/**
 * Custom React hooks go here.
 *
 * Example hook:
 *
 * import { useState, useCallback } from 'react';
 *
 * export const useForm = <T extends Record<string, any>>(initialValues: T) => {
 *   const [values, setValues] = useState<T>(initialValues);
 *   const [errors, setErrors] = useState<Record<string, string>>({});
 *
 *   const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
 *     const { name, value } = e.target;
 *     setValues((prev) => ({ ...prev, [name]: value }));
 *   }, []);
 *
 *   const reset = useCallback(() => {
 *     setValues(initialValues);
 *     setErrors({});
 *   }, [initialValues]);
 *
 *   return {
 *     values,
 *     errors,
 *     handleChange,
 *     reset,
 *     setValues,
 *     setErrors
 *   };
 * };
 */
