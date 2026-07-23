const allowedColumns=new Set([5,6,7]);
const allowedRows=new Set([1,2]);

export function normalizeCategoryLayout(value={}){
  const columns=allowedColumns.has(Number(value?.columns))?Number(value.columns):6;
  const rows=allowedRows.has(Number(value?.rows))?Number(value.rows):1;
  const showSearch=value?.showSearch===false?false:true;
  return {columns,rows,showSearch};
}

export function buildCategoryLayout(categories=[],value={}){
  const config=normalizeCategoryLayout(value),list=[...new Set((Array.isArray(categories)?categories:[]).filter(Boolean))];
  const capacity=config.columns*config.rows;
  const categoryCapacity=Math.max(1,capacity-(config.showSearch?1:0));
  const primary=list.slice(0,categoryCapacity),overflow=list.slice(categoryCapacity);
  const pages=[];
  for(let index=0;index<list.length;index+=categoryCapacity)pages.push(list.slice(index,index+categoryCapacity));
  if(!pages.length)pages.push([]);
  return {...config,capacity,categoryCapacity,primary,overflow,pages,searchSlot:config.showSearch?capacity:null};
}
