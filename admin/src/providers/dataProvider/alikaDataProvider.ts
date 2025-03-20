import { DataProvider } from 'react-admin';

// Decorator function to wrap the standard data provider and transform the API responses
export const createAlikaDataProvider = (dataProvider: DataProvider): DataProvider => ({
  ...dataProvider,
  
  // For list endpoints (GET_LIST, GET_MANY, GET_MANY_REFERENCE)
  getList: async (resource, params) => {
    if (resource === 'alika-events') {
      const response = await dataProvider.getList(resource, params);
      
      // If the API returns { events: [...] } format, unwrap it
      if (response.data && response.data.events) {
        return {
          ...response,
          data: response.data.events
        };
      }
      
      return response;
    }
    
    return dataProvider.getList(resource, params);
  },
  
  // For single record endpoints (GET_ONE)
  getOne: async (resource, params) => {
    if (resource === 'alika-events') {
      const response = await dataProvider.getOne(resource, params);
      
      // If the API returns { event: {...} } format, unwrap it
      if (response.data && response.data.event) {
        return {
          ...response,
          data: response.data.event
        };
      }
      
      return response;
    }
    
    return dataProvider.getOne(resource, params);
  },
  
  // Handle other methods if needed
  create: async (resource, params) => {
    if (resource === 'alika-events') {
      const response = await dataProvider.create(resource, params);
      
      // If the API returns { event: {...} } format, unwrap it
      if (response.data && response.data.event) {
        return {
          ...response,
          data: response.data.event
        };
      }
      
      return response;
    }
    
    return dataProvider.create(resource, params);
  },
  
  update: async (resource, params) => {
    if (resource === 'alika-events') {
      const response = await dataProvider.update(resource, params);
      
      // If the API returns { event: {...} } format, unwrap it
      if (response.data && response.data.event) {
        return {
          ...response,
          data: response.data.event
        };
      }
      
      return response;
    }
    
    return dataProvider.update(resource, params);
  }
}); 