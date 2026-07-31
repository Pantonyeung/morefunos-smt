import {proxyOperationsRequest} from '../../_shared/operations-proxy.js';

export const onRequestGet=context=>proxyOperationsRequest(context,'/v1/staff/availability');
export const onRequestPatch=context=>proxyOperationsRequest(context,'/v1/staff/availability');
export const onRequestOptions=()=>new Response(null,{status:204,headers:{allow:'GET, PATCH, OPTIONS'}});
