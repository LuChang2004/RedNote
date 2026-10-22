import { shanghaiRoute, routeSource } from './shanghai-route.js';
const asset = name => new URL(`./public/assets/publish/${name}.svg`, import.meta.url).href;
const icon = name => `<img class="route-icon" src="${asset(name)}" alt=""/>`;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let savedDraft = null;
let previewState = null;

export function openRouteEditor(root, photos, onBack, restore = false, initialPage = null) {
 const state = initialPage && previewState ? previewState : restore && savedDraft ? structuredClone(savedDraft) : {
  ...structuredClone(shanghaiRoute), photos:shanghaiRoute.stops.flatMap(stop=>stop.photos), selectedPhotos:photos, page:'route'
 };
 if(restore && photos.length){state.selectedPhotos=photos;state.page='route';}
 if(initialPage)state.page=initialPage;
 previewState=state;
 root.hidden=false;
 root.className='creation-editor route-creation';
 const host=document.createElement('section');host.className='route-host';root.replaceChildren(host);
 const notify = message => {const el=document.createElement('div');el.className='creation-notice';el.setAttribute('role','status');el.textContent=message;host.append(el);setTimeout(()=>el.remove(),2600);};
 const stopHeading = (stop,i) => `<div class="route-stop-heading">${icon(state.page==='route'?'routeLocation':'location')}<input title="${esc(stop.name)} · ${esc(stop.address)}" aria-label="第${i+1}站地点" data-stop="${i}" data-field="name" value="${esc(stop.name)}"/><span class="route-cost">${/^\d+$/.test(stop.cost)?'¥ '+esc(stop.cost)+'/人':esc(stop.cost)}</span><input class="route-duration" aria-label="第${i+1}站时长" data-stop="${i}" data-field="duration" value="${esc(stop.duration)}"/></div>`;
 const photoStrip = (items, numbered=false) => items.map((p,i)=>`<div class="route-photo"><img src="${esc(p.src)}" alt="${esc(p.alt||'路线照片')}"/>${numbered?`<span>${i+1}</span>`:''}</div>`).join('');
 function render(){
  const route=state.page==='route';
  host.innerHTML=`<header class="route-header"><button data-route-action="back" aria-label="${route?'返回相册':'返回路线编辑'}">${icon(route?'routeBack':'back')}</button></header>
  <div class="route-scroll ${route?'route-planning':'route-publishing'}">
   ${route?'':`<div class="route-media">${photoStrip(state.photos,true)}<button class="route-add-photo" data-route-action="photos" aria-label="添加照片">${icon('add')}</button></div>`}
   <input class="route-title" aria-label="笔记标题" maxlength="40" data-note="title" value="${esc(state.title)}"/>
   <textarea class="route-body" aria-label="笔记正文" data-note="body">${esc(state.body)}</textarea>
   ${route?`<div class="route-stops">${state.stops.map((stop,i)=>`<article class="route-stop">${stopHeading(stop,i)}<div class="route-stop-content"><img class="route-connector" src="${asset('line')}" alt=""/><textarea aria-label="第${i+1}站描述" data-stop="${i}" data-field="description">${esc(stop.description)}</textarea><div class="route-stop-photos">${photoStrip(stop.photos)}</div></div></article>`).join('')}</div>`:
   `<div class="route-summary">${state.stops.map((stop,i)=>stopHeading(stop,i)).join('')}</div>
   <div class="route-topics">${['#上海小众路线','#虹口Citywalk','#咖啡探店','#上海老字号'].map(t=>`<button data-insert="${t}">${t}</button>`).join('')}</div>
   <div class="route-tools">${['# 话题','@ 用户','◉ 投票'].map(t=>`<button data-insert="${t}">${t}</button>`).join('')}</div>
   <div class="route-options">${[['lock','公开可见'],['grid','添加组件'],['gear','高级选项']].map(([name,label])=>`<button data-option-label="${label}">${icon(name)}<span>${label}</span>${icon('chevron')}</button>`).join('')}</div>
   <button class="route-notice" data-option-label="笔记内容声明">笔记内容声明 ${icon('notice')}</button>`}
   <p class="route-source">预算单位：元/人，非菜单报价 · 时长为建议停留<br/>参考与实景图：<a href="${routeSource}" target="_blank" rel="noopener noreferrer">上海文旅</a> · <a href="https://www.shhk.gov.cn/xwzx/002008/002008045/002008045002/20260817/74d808cc-53ce-4fc0-8798-934fb4e867aa.html" target="_blank" rel="noopener noreferrer">上海虹口·咖啡</a> · <a href="https://www.shobserver.cn/sgh/detail?id=1711450" target="_blank" rel="noopener noreferrer">上观·四新食苑</a> · <a href="https://www.ccphistory.org.cn/shds/hsly/content/fcc9e947-2f20-4296-bb9c-502ed55ceb3f.html" target="_blank" rel="noopener noreferrer">上海党史网</a>。非实时营业信息，图片仅作原型展示，商用需确认授权。</p>
  </div>
  ${route?`<div class="route-ai-input">${icon('mic')}<input aria-label="添加描述，AI自动识别" placeholder="添加描述，AI自动识别"/><button data-route-action="description" aria-label="添加描述">完成</button></div>`:''}
  <footer class="route-footer"><button data-route-action="draft">存草稿</button><button data-route-action="${route?'next':'publish'}">${route?'下一步':'发布笔记'}</button></footer>`;
 }
 host.addEventListener('input',e=>{const t=e.target;if(t.dataset.note)state[t.dataset.note]=t.value;if(t.dataset.stop!==undefined)state.stops[Number(t.dataset.stop)][t.dataset.field]=t.value;});
 host.addEventListener('click',e=>{
  e.stopPropagation();const button=e.target.closest('button');if(!button)return;
  if(button.dataset.insert){state.body+=(state.body?' ':'')+button.dataset.insert;host.querySelector('[data-note="body"]').value=state.body;return;}
  if(button.dataset.optionLabel){notify(`${button.dataset.optionLabel}：此处为原型入口`);return;}
  switch(button.dataset.routeAction){
   case 'back':if(state.page==='publish'){state.page='route';render();}else {savedDraft=structuredClone(state);onBack();}break;
   case 'photos':savedDraft=structuredClone(state);onBack();break;
   case 'next':state.page='publish';render();break;
   case 'draft':savedDraft=structuredClone(state);notify('已保存草稿（当前浏览会话）');break;
   case 'publish':notify(state.title.trim()||state.body.trim()?'发布演示完成（不会真实发布）':'请先填写标题或正文');break;
   case 'description':{const input=host.querySelector('.route-ai-input input');if(input.value.trim()){state.body+='\n'+input.value.trim();host.querySelector('[data-note="body"]').value=state.body;input.value='';notify('描述已添加，AI识别暂未接入');}else input.focus();break;}
  }
 });
 host.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.closest('.route-ai-input')){e.preventDefault();host.querySelector('[data-route-action="description"]').click();}});
 render();
}

export const hasRouteDraft = () => Boolean(savedDraft);
