import { withLifecycleCallbacks, type LifecycleCallbacks } from 'react-admin';

const alikaLifecycle: LifecycleCallbacks = {
  resource: 'alika-events',
  beforeDelete: async (params, dataProvider) => {
    // You could add confirmation logic or additional checks here
    return params;
  },
  afterDelete: async (params, result, dataProvider) => {
    // You could add notification logic here
    return result;
  },
};

export default alikaLifecycle; 