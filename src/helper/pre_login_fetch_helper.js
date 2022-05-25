import 'isomorphic-fetch';
import {useNavigate } from 'react-router-dom';

async function makeRequest(url, headers, options) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...headers
    },
    ...options
  });

  if (response.status >= 200 && response.status < 300) {
    return response;
  } else if (response.status === 401) {
    throw new Error('Unauthorized');
  } else if (response.status === 412) {
       useNavigate('/pwdchng');
  } else {
    const {error_code, description} = await response.json();

    let error = new Error(response.statusText);
    error.errorCode = error_code;
    error.description = description;
    throw error;
  }
}

export async function fetchPreLoginCSV(url, {headers, ...options}) {
  
    const authToken =(function (window) {
		  				return window.sessionStorage.getItem('auth-token');
					} (window.mockWindow || window));
	
	if(authToken) {
		headers = Object.assign({'UCSFAUTH-TOKEN':authToken}, headers);
	} 	
	
    const response = await makeRequest(
      url,
      Object.assign({'Accept': 'text/csv'}, headers),
      options
    );
     return await response.text();
}

export async function fetchPreLoginJSON(url, {headers, ...options}) {
  
	const authToken =(function (window) {
			return window.sessionStorage.getItem('auth-token');
	} (window.mockWindow || window));

	if(authToken) {
		headers = Object.assign({'UCSFAUTH-TOKEN':authToken}, headers);
	} 
	
	const response = await makeRequest(
			url,
			Object.assign({'Accept': 'application/json'}, headers),
			options
	);

  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}