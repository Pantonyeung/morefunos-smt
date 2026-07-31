import {proxyOperationsRequest} from '../../_shared/operations-proxy.js';

export const onRequestPost=context=>proxyOperationsRequest(context,'/v1/staff/login');
export const onRequestOptions=()=>new Response(null,{status:204,headers:{allow:'POST, OPTIONS'}});
