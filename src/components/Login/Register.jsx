import React, { useState } from 'react';
import axios from 'axios';
import API_CONFIG from '../../config/api';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.REGISTER}`, formData);
      console.log('Registration successful:', response.data);
      setMessage('تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.');
      setIsError(false);
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      setMessage('فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
      setIsError(true);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">إنشاء حساب جديد</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            الاسم
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="ادخل اسمك الكامل"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            رقم الهاتف
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phone"
            type="tel"
            placeholder="ادخل رقم هاتفك"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            كلمة المرور
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="********"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {message && (
          <div className={`mb-4 p-3 rounded text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            إنشاء حساب
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          لديك حساب بالفعل؟{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-500 hover:text-blue-800 font-bold focus:outline-none"
          >
            تسجيل الدخول
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
