const entry=document.getElementById('dev-preview-entry');
if(entry&&new URLSearchParams(location.search).get('embedded-preview')==='1')entry.hidden=true;
