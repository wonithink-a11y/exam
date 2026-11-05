/* 중1 2학기 앱 자동 점검: node tools/check-app.js  (Playwright 필요, 저장소 루트에서 실행)
   - 페이지 오류, 과목별 요점 노트(빈 칸·끊긴 '관련 유형' 연결), 모든 문제 유형을 시드 200개로 생성해 정답 누락·중복 보기 검사 */
const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),TYPES={'.html':'text/html','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/\/$/,'/index.html'));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});r.end(d)})});
srv.listen(0,async()=>{const port=srv.address().port;const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(`http://localhost:${port}/index.html`);await p.waitForTimeout(1500);
 const out=await p.evaluate(()=>Object.keys(SJ).map(s=>{setSubject(s);show('note');const v=document.getElementById('v-note'),N=SJ[s].notes||[];let bad=[];
  for(const t of T){for(let sd=1;sd<=200;sd++){let d;try{d=gen(t.id,sd)}catch(e){bad.push(t.id+' 오류');break}if(!d.opts.includes(d.ans)||new Set(d.opts).size!==d.opts.length||/NaN|undefined/.test(JSON.stringify(d))){bad.push(t.id+' 시드'+sd);break}}}
  return{s,유형:T.length,노트:N.length,노트없는소단원:SUBS.filter(u=>!N.some(n=>n.u===u)).join(' '),끊긴연결:N.flatMap(n=>(n.go||[]).filter(id=>!TYPE[id])).join(' '),빈칸:/undefined|NaN/.test(v.innerHTML),문항오류:bad.slice(0,5).join(', ')}}));
 console.table(out);console.log(errs.length?'페이지 오류:\n'+errs.join('\n'):'페이지 오류 없음');await b.close();srv.close();process.exit(errs.length||out.some(o=>o.끊긴연결||o.빈칸||o.문항오류)?1:0)});
