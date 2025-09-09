import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      const response = await axios.post('https://products-api.cbc-apps.net/auth/login', formData);
      const token = response.data.access_token; 
      if (token) {
        localStorage.setItem('userToken', token); 
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
  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">تسجيل الدخول</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">رقم الهاتف</label>
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
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">كلمة المرور</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>
          {message && (
            <div className={`mb-4 p-3 rounded text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-200">تسجيل الدخول</button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ليس لديك حساب؟{' '}
            <button onClick={() => navigate('/register')} className="text-blue-600 hover:text-blue-800 font-bold">إنشاء حساب</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
