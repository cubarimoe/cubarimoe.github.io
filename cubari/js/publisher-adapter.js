// Cubari Site Publisher adapter, AGPL-3.0.
const BASE_API_PATH = "../data/cubari-reader/";
const IS_FIRST_PARTY = false, IS_INDEXED = false, IMAGE_PROXY_URL = "";
const publisherParams = new URLSearchParams(location.search);
function publisherSCP(){return {series:publisherParams.get('id')||'',chapter:publisherParams.get('chapter')||'1',page:Math.max(0,(parseInt(publisherParams.get('page'),10)||1)-1),group:null};}
function publisherURL(scp){const u=new URL(location.href);u.searchParams.set('id',scp.series);u.searchParams.set('chapter',scp.chapter);u.searchParams.set('page',scp.page+1);return u.pathname+u.search;}
function publisherFallback(chapter,page){const u=new URL('../reader.html',location.href);u.searchParams.set('id',publisherParams.get('id')||'');u.searchParams.set('chapter',chapter);u.searchParams.set('embedded','1');if(Number.isInteger(page))u.searchParams.set('page',page+1);location.replace(u.href);}
function publisherReaderError(err){console.error(err);publisherFallback(publisherSCP().chapter,publisherSCP().page);}
function publisherEscape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const globalHistoryHandler={addChapter(series,source,chapter){try{localStorage.setItem('publisher-read:'+series+':'+chapter,'1')}catch(e){}}};

window.addEventListener("error",e=>{if(!window.publisherStarted && e.error) publisherReaderError(e.error)});
