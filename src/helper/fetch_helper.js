import 'isomorphic-fetch';
import {useNavigate } from 'react-router-dom';



async function makeRequest(url, headers, options) {
  
	const response = await fetch(encodeURI(url), {
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
    useNavigate('/login');
    throw new Error('Unauthorized');
  } else if (response.status === 412) {
       useNavigate('/pwdchng');
  } else {
    const {error_code, description, key, value} = await response.json();
    let error = new Error(response.statusText);
    error.errorCode = error_code;
    error.description = description;
    error.key = key;
    error.value = value;
    throw error;
  }
}

async function makeFileRequest(url, headers, options) {
	  
	const response = await fetch(encodeURI(url), {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...headers
    },
    ...options
  });

  if (response.status >= 200 && response.status < 300) {
    return response;
  } else if (response.status === 401) {
    useNavigate('/login');
    throw new Error('Unauthorized');
  } else if (response.status === 412) {
       useNavigate('/pwdchng');
  } else {
    const {error_code, description, key, value} = await response.json();
    let error = new Error(response.statusText);
    error.errorCode = error_code;
    error.description = description;
    error.key = key;
    error.value = value;
    throw error;
  }
}

export async function fetchCSV(url, {headers, ...options}) {

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



export async function fetchFileJson(url, {headers, ...options}) {


	const authToken =(function (window) {
			return window.sessionStorage.getItem('auth-token');
	} (window.mockWindow || window));

	if(authToken) {
		headers = Object.assign({'UCSFAUTH-TOKEN':authToken}, headers);
	}
	try {
	const response = await makeFileRequest(
			url,
			Object.assign({'Accept': 'application/json'}, headers),
			options
	);

  try {
    return await response.json();
  } catch (error) {
    return null;
  }  }catch(error1) {
	  throw error1;
  }
}


export async function fetchJSON(url, {headers, ...options}) {


	const authToken =(function (window) {
			return window.sessionStorage.getItem('auth-token');
	} (window.mockWindow || window));

	if(authToken) {
		headers = Object.assign({'UCSFAUTH-TOKEN':authToken}, headers);
	}
	try {
	const response = await makeRequest(
			url,
			Object.assign({'Accept': 'application/json'}, headers),
			options
	);

  try {
    return await response.json();
  } catch (error) {
    return null;
  }  }catch(error1) {
	  throw error1;
  }
}