const API_BASE_URL = 'http://localhost:4500';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh'
  },
  ADMIN: {
    PRODUCTS: '/admin/dashboard/products-management',
    PRODUCT_CREATE: '/admin/products',
    PRODUCT_DETAILS: (id) => `/admin/dashboard/products/${id}`,
    PRODUCT_UPDATE: (id) => `/admin/dashboard/products-management/${id}`,
    PRODUCT_DELETE: (id) => `/admin/dashboard/products-management/${id}`,
    PRODUCT_IMAGE_UPLOAD: '/admin/dashboard/products/upload-image',
    PRODUCT_IMAGE_DELETE: (filename) => `/admin/dashboard/products/delete-image/${filename}`,
    PRODUCT_STOCK: (id) => `/admin/dashboard/products/${id}/stock`,
    PRODUCT_PRICE: (id) => `/admin/dashboard/products/${id}/price`,
    PRODUCT_ADD: '/admin/dashboard/products',
    PRODUCT_EDIT: (id) => `/admin/dashboard/products/${id}`,
    
    ORDERS: '/admin/dashboard/orders',
    ORDER_DETAILS: (id) => `/admin/dashboard/orders/${id}`,
    ORDER_STATUS_UPDATE: (id) => `/admin/dashboard/orders/${id}/status`,
    
    CUSTOMERS: '/admin/dashboard/customers',
    CUSTOMER_DETAILS: (id) => `/admin/dashboard/customers/${id}`,
    CUSTOMER_NOTES: (id) => `/admin/dashboard/customers/${id}/notes`,
    CUSTOMER_BAN: (id) => `/admin/dashboard/customers/${id}/ban`,
    CUSTOMER_CREATE: '/admin/dashboard/customers',
    CUSTOMER_UPDATE: (id) => `/admin/dashboard/customers/${id}`,
    CUSTOMER_DELETE: (id) => `/admin/dashboard/customers/${id}`,
    CUSTOMER_PASSWORD_RESET: (id) => `/admin/dashboard/customers/${id}/password`,
    
    PROFITS: '/admin/dashboard/profits',
    PROFITS_DETAILS: '/admin/dashboard/profits/details',
    PROFITS_MONTHLY: (year, month) => `/admin/dashboard/profits/monthly/${year}/${month}`,
    PROFITS_YEARLY: (year) => `/admin/dashboard/profits/yearly/${year}`,
    
    OFFERS: '/admin/dashboard/offers',
    MERCHANTS: '/admin/dashboard/merchants',
    
    SETTINGS: {
      GENERAL: '/admin/dashboard/settings/general',
      ACCOUNT: '/admin/dashboard/settings/account',
      LOGIN_SESSIONS: '/admin/dashboard/settings/login-sessions'
    },
    
    STAFF: {
      LIST: '/admin/dashboard/staff',
      CREATE: '/admin/dashboard/staff',
      UPDATE_ROLE: (id) => `/admin/dashboard/staff/${id}/role`,
      UPDATE_STATUS: (id) => `/admin/dashboard/staff/${id}/status`,
      AVAILABLE_ROLES: '/admin/dashboard/staff/available-roles'
    },
    
    // Staff Management
    AVAILABLE_ROLES: '/admin/dashboard/staff/available-roles',
    UPDATE_STAFF_ROLE: (id) => `/admin/dashboard/staff/${id}/role`,
    UPDATE_STAFF_STATUS: (id) => `/admin/dashboard/staff/${id}/status`,
    
    SYSTEM_LOGS: '/admin/dashboard/settings/logs',
    
    // Categories and Sections
    CATEGORIES: '/admin/dashboard/categories',
    CATEGORY_DETAILS: (id) => `/admin/dashboard/categories/${id}`,
    CATEGORY_CREATE: '/admin/dashboard/categories',
    CATEGORY_UPDATE: (id) => `/admin/dashboard/categories/${id}`,
    CATEGORY_DELETE: (id) => `/admin/dashboard/categories/${id}`,
    
    SECTIONS: '/admin/dashboard/sections',
    SECTION_DETAILS: (id) => `/admin/dashboard/sections/${id}`,
    SECTION_CREATE: '/admin/dashboard/sections',
    SECTION_UPDATE: (id) => `/admin/dashboard/sections/${id}`,
    SECTION_DELETE: (id) => `/admin/dashboard/sections/${id}`,
    
    // Suppliers
    SUPPLIERS: '/admin/dashboard/suppliers',
    SUPPLIER_DETAILS: (id) => `/admin/dashboard/suppliers/${id}`,
    SUPPLIER_CREATE: '/admin/dashboard/suppliers',
    SUPPLIER_UPDATE: (id) => `/admin/dashboard/suppliers/${id}`,
    SUPPLIER_DELETE: (id) => `/admin/dashboard/suppliers/${id}`,
    SUPPLIER_PROFITS: (id) => `/admin/dashboard/suppliers/${id}/profits`,
    
    // Analytics
    ANALYTICS: '/admin/dashboard/analytics',
    ANALYTICS_DETAILS: (endpoint) => `/admin/dashboard/analytics/${endpoint}`,
    
    // Dashboard Stats
    DASHBOARD_STATS: '/admin/dashboard/stats',
    
    // Overview and Dashboard
    OVERVIEW: '/admin/dashboard/overview',
    OVERVIEW_DETAILS: (endpoint) => `/admin/dashboard/overview/${endpoint}`
  },
  
  ADMIN_UPLOAD: {
    UPLOAD_IMAGE: '/upload'
  }
};

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('userToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  // Stringify body if it's an object and Content-Type is application/json
  if (config.body && typeof config.body === 'object' && config.headers['Content-Type'] === 'application/json') {
    config.body = JSON.stringify(config.body);
  }

  try {
    // Check if endpoint is valid
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Endpoint is required and must be a string');
    }
    
    // Check if endpoint is already a full URL
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    console.log(`Making API call to: ${url}`);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    
    // Provide more specific error messages
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Could not connect to the server. Please check your internet connection and try again.');
    } else if (error.name === 'TypeError' && error.message.includes('Load failed')) {
      throw new Error('Network error: Request failed to load. Please try again.');
    }
    
    throw error;
  }
};

export default API_CONFIG;