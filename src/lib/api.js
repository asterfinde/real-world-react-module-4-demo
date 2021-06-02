/* 
    With the api.js file, we’ll be introducing the concept of a data handler. Put simply, a data handler is a middle man 
    of sorts that handles the communication between a data source and a data consumer. In our case, the data source is 
    The Dog API and our data consumer is any component that wants information from the API, such as the BreedList.jsx 
    component.

    We gain a lot of benefits:
    • Only one place to edit and maintain data handling code.
    • Our component code becomes more DRY (Don’t Repeat Yourself) and adheres to the Single Responsibility Principle (SRP) more closely as it should now just be dealing with just handling incoming data and presenting it. 
    • Errors are localized in one place. 
    • We only need to define one interface with the API.
*/

// bring in Axios and our environment variables
import axios from 'axios';

const API_URL = process.env.REACT_APP_DOG_API_URL;
const API_KEY = process.env.REACT_APP_DOG_API_KEY;

// callAPI() function which will actually go out and talk to the API
const callAPI = async (url, params = null) => {
    const requestConfig = {
        baseURL: API_URL,
        headers: {
            'x-api-key': API_KEY
        },
        url
    };
  
    if (params) {
        requestConfig.params = params;
    }
    try {
        return await axios(requestConfig);
    } catch (err) {
        console.log('axios encountered an error', err);
    }
  };

//
export const fetchBreeds = async (page, count = 10) => {
    const breeds = await callAPI('breeds', {
            limit: count,
            page,
    });

    return {
        breeds: breeds.data,
        totalBreeds: breeds.headers['pagination-count'],
    };
};

//
export const fetchPictures = async (breed = '', count = 20) => {
    if (!breed) {
        return [];
    }

    const pictures = await callAPI('images/search', {
        breed_id: breed,
        limit: count
    });

    return pictures.data;
};