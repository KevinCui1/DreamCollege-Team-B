const http=require('http'),fs=require('fs'),path=require('path');
http.createServer((req,res)=>{
  let p=path.join(__dirname, req.url==='/'?'preview.html':req.url.split('?')[0]);
  fs.readFile(p,(e,d)=>{ if(e){res.writeHead(404);res.end('nf');return;} res.writeHead(200,{'Content-Type':'text/html'});res.end(d);});
}).listen(4599,()=>console.log('up on 4599'));
