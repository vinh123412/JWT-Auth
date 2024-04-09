// check xem access token đã hết hạn chưa
// nếu hết hạn tạo new access token


// Function to check if the access token is expired
const isTokenExpires = (token) => {
  if (!token) {
    return true;
  }
  const tokenData = JSON.parse(atob(token.split('.')[1])); // Decode token payload
  return tokenData.exp * 1000 < Date.now();
};

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  const response = await fetch('/api/v1/getToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  })

  if (response.ok) {
    const responseData = await response.json();
    const newAccessToken = responseData.newAccessToken;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } else {
    throw new Error('Failed to refresh access token');
  }
};

// Function to handle token expiry and refresh access token if necessary
const handleTokenExpiry = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (isTokenExpires(accessToken)) {
    try {
      const newAccessToken = await refreshAccessToken();
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  } else {
    return accessToken;
  }
};

export default handleTokenExpiry;
