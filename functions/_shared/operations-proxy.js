const DEFAULT_UPSTREAM='https://morefunos-admin.pages.dev';

function upstreamOrigin(env={}){
  const value=String(env.OPERATIONS_API_ORIGIN||DEFAULT_UPSTREAM).trim().replace(/\/+$/,'');
  if(!/^https:\/\//i.test(value))throw new Error('OPERATIONS_API_ORIGIN_INVALID');
  return value;
}

export async function proxyOperationsRequest(context,path){
  const request=context.request;
  const headers=new Headers();
  for(const name of ['accept','content-type','authorization','idempotency-key','x-correlation-id']){
    const value=request.headers.get(name);if(value)headers.set(name,value);
  }
  const init={method:request.method,headers,redirect:'manual'};
  if(!['GET','HEAD'].includes(request.method))init.body=await request.arrayBuffer();
  let response;
  try{response=await fetch(`${upstreamOrigin(context.env)}${path}`,init)}
  catch(error){return Response.json({ok:false,error:'operations-upstream-unavailable',detail:String(error?.message||error)},{status:502})}
  const outputHeaders=new Headers(response.headers);
  outputHeaders.delete('access-control-allow-origin');
  outputHeaders.set('cache-control','no-store');
  outputHeaders.set('x-morefun-proxy','smt-pages-function');
  return new Response(response.body,{status:response.status,headers:outputHeaders});
}
