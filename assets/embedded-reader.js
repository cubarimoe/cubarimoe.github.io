
const params=new URLSearchParams(location.search);
const id=params.get('id'), number=params.get('chapter');
const area=document.querySelector('#readerArea'), status=document.querySelector('#readerStatus');
const back=document.querySelector('#backToTitle'), external=document.querySelector('#openCubari');
function titleUrl(){return `title.html?id=${encodeURIComponent(id)}`}
function safeCubariURL(value){try{const u=new URL(value);return u.origin==='https://cubari.moe'&&!u.username&&!u.password&&/^\/read\/[^/]+\/[^/]+\/[^/]+\/[^/]+\/?$/.test(u.pathname)?u:null}catch{return null}}
async function openChapter(){
  if(!id||!number)throw new Error('Missing title or chapter. Return to the catalogue and select a chapter.');
  back.href=titleUrl();back.textContent='Back to manga';
  const r=await fetch(`data/titles/${encodeURIComponent(id)}.json`,{cache:'no-store'});if(!r.ok)throw new Error('Title not found.');
  const t=await r.json(),ch=(t.chapters||[]).find(c=>String(c.number)===number);
  if(!ch)throw new Error('Chapter not found.');
  if(ch.reader_kind==='native'){location.replace(`reader.html${location.search}`);return}
  const url=safeCubariURL(ch.cubari_url);if(!url)throw new Error('No valid Cubari reader link is available for this chapter.');
  const page=params.get('page');if(page&&/^[1-9]\d*$/.test(page)){url.pathname=url.pathname.replace(/\/[^/]+\/?$/,`/${page}/`)}
  back.textContent=t.title;document.title=`${t.title} — Chapter ${number}`;
  external.href=url.href;external.hidden=false;
  const frame=document.createElement('iframe');frame.title=`Cubari reader: ${t.title}, Chapter ${number}`;
  frame.allow='fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
  frame.src=url.href;area.replaceChildren(frame);
}
openChapter().catch(e=>{status.textContent=e.message;status.setAttribute('role','alert')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&id)location.href=titleUrl()});
