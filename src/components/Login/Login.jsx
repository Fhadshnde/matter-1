import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import { FaRegEye, FaRegEyeSlash, FaLock } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN}`, formData);
      const token = response.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        setMessage('تم تسجيل الدخول بنجاح!');
        setIsError(false);
        onLogin();
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      setMessage('فشل تسجيل الدخول. يرجى التحقق من رقم الهاتف وكلمة المرور.');
      setIsError(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">تسجيل الدخول</h2>
        <form onSubmit={handleSubmit}>
          {/* رقم الهاتف */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">
              رقم الهاتف
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="ادخل رقم هاتفك"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          {/* كلمة المرور */}
          <div className="mb-5 relative text-right">
            <label htmlFor="password" className="block mb-1 text-black">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full py-3 px-4 pr-12 pl-10 border border-gray-300 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>
          </div>

          {/* رسالة الخطأ أو النجاح */}
          {message && (
            <div
              className={`mb-4 p-3 rounded text-center ${
                isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-200"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
