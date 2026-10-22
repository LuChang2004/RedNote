const root = document.createElement('div');
root.id = 'creation';
root.hidden = true;
document.querySelector('#app').append(root);
const svg = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const icons = {
 close:svg('<path d="m5 5 14 14M19 5 5 19"/>'),
 down:svg('<path d="m6 9 6 6 6-6"/>'),
 back:svg('<path d="m15 4-8 8 8 8"/>'),
 draft:svg('<path d="m3 10 3-7h12l3 7v10H3V10Z"/><path d="M3 11h6l1 3h4l1-3h6"/>'),
 film:svg('<path d="M8 3C3 4 1 9 3 14m2 5c4 4 10 3 14-1m3-5c1-5-2-9-7-11"/><path d="m9 7 8 5-8 5Z"/>'),
 live:svg('<circle cx="12" cy="12" r="9" stroke-dasharray="1 3"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="3"/>')
};
const imageIds = ['photo-1501339847302-ac426a4a7cbb','photo-1519501025264-65ba15a82390','photo-1475924156734-496f6cac6ec1','photo-1442512595331-e89e73853f31','photo-1464822759023-fed622ff2c3b','photo-1600210492486-724fe5c67fb0','photo-1495474472287-4d71bcdd2085','photo-1447933601403-0c6688de566e'];
const media = Array.from({length:18},(_,i)=>({id:'sample-'+i,src:`https://images.unsplash.com/${imageIds[i%imageIds.length]}?auto=format&fit=crop&w=500&q=85`,type:i%7===0?'视频':i%4===0?'实况图':'照片'}));
let selected=[], filter='全部', mode='normal', stage='menu', draft=null, title='',body='';
const escape = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function close(){root.hidden=true;root.innerHTML='';document.querySelectorAll('.screen').forEach(el=>el.inert=false);document.querySelector('[data-action="publish"]').focus();}
export function openCreationMenu(){stage='menu';root.hidden=false;root.className='creation-menu-overlay';root.innerHTML=`<section class="creation-actions" role="dialog" aria-modal="true" aria-label="选择创作方式"><button data-create="album">从相册选择</button><button data-create="camera">相机<small>拍摄与直播</small></button><button data-create="text">写文字</button><button data-create="travel">写出游<span class="new-entry">新</span></button><button class="creation-cancel" data-create="close">取消</button></section>`;}
function album(reset=false){
 if(reset){selected=[];filter='全部';title='';body='';}
 stage='album';root.hidden=false;root.className='creation-full';
 root.innerHTML=`<header class="album-header"><button class="creation-icon" data-create="close" aria-label="关闭相册">${icons.close}</button><button class="album-source" data-create="source">Recents ${icons.down}</button><button class="draft-button" data-create="draft">${icons.draft} 草稿箱</button></header>${mode==='travel'?'<div class="travel-context">写出游 <span>选几张旅途照片，记录你的出游</span></div>':''}<nav class="album-tabs" aria-label="媒体类型">${['全部','视频','照片','实况图','全屏图'].map(t=>`<button data-filter="${t}" class="${filter===t?'active':''}">${t}</button>`).join('')}</nav><div class="album-grid"></div><footer class="album-footer"><div class="selected-media"></div><div class="album-buttons"><button class="auto-film" data-create="film">${icons.film} 一键成片</button><button class="album-next" data-create="next"></button></div><p class="album-hint">示例相册 · 可从 Recents 导入本地照片</p></footer>`;
 renderGrid();renderSelection();
}
function renderGrid(){
 const list=media.filter(m=>filter==='全部'||(filter==='全屏图'?m.type==='照片':m.type===filter));
 root.querySelector('.album-grid').innerHTML=list.map(m=>`<button class="album-cell" data-media="${m.id}" aria-label="${selected.includes(m.id)?'取消选择':'选择'}素材 ${media.indexOf(m)+1}" aria-pressed="${selected.includes(m.id)}"><img src="${m.src}" alt="${m.type}素材" loading="lazy"/>${m.type==='实况图'?`<span class="live-label">${icons.live} 实况</span>`:''}${m.type==='视频'?'<span class="video-duration">00:12</span>':''}<span class="selection-number ${selected.includes(m.id)?'checked':''}">${selected.includes(m.id)?selected.indexOf(m.id)+1:''}</span></button>`).join('');
}
function renderSelection(){
 root.querySelector('.selected-media').innerHTML=selected.map((id,i)=>{const m=media.find(m=>m.id===id);return `<div class="selected-thumb"><img src="${m.src}" alt="已选素材 ${i+1}"/><span>${i+1}</span><button data-remove="${id}" aria-label="移除第${i+1}张">${icons.close}</button></div>`;}).join('');
 const next=root.querySelector('.album-next');next.textContent=`下一步${selected.length?' ('+selected.length+')':''}`;next.disabled=!selected.length;
 root.querySelector('.auto-film').disabled=!selected.length;
}
function editor(){stage='editor';root.className='creation-editor';root.innerHTML=`<header class="editor-header"><button class="creation-icon" data-create="back" aria-label="返回素材选择">${icons.back}</button><strong>${mode==='travel'?'写出游':'写笔记'}</strong><button data-create="save-draft">存草稿</button></header><div class="editor-scroll"><div class="editor-media">${selected.map(id=>`<img src="${media.find(m=>m.id===id).src}" alt="所选照片"/>`).join('')}<button data-create="back" aria-label="添加照片">+</button></div><input id="creation-title" aria-label="笔记标题" maxlength="40" placeholder="${mode==='travel'?'给这次出游起个名字':'填写标题会有更多赞哦'}" value="${escape(title)}"/><textarea id="creation-body" aria-label="笔记正文" placeholder="${mode==='travel'?'去过哪里，有哪些喜欢的瞬间？像平常一样写下来…':'分享你的生活瞬间…'}">${escape(body)}</textarea>${mode==='travel'?'<div class="travel-design-note"><strong>从记录出发，让路线自然成形</strong><p>先自由写、自由选图，不需要填写路线模板。</p><small>路线识别与确认将在下一步设计中接入；当前不会进行 AI 分析。</small></div>':''}</div><footer class="editor-footer"><button data-create="save-draft">保存到草稿箱</button><p>前端创作原型 · 不会发布到小红书</p></footer>`;}
function importFiles(camera=false){const input=document.createElement('input');input.type='file';input.accept=camera?'image/*':'image/*';input.multiple=!camera;if(camera)input.setAttribute('capture','environment');input.onchange=()=>{for(const f of input.files){if(!f.type.startsWith('image/'))continue;const id='local-'+Date.now()+'-'+media.length;media.unshift({id,src:URL.createObjectURL(f),type:'照片'});if(selected.length<18)selected.push(id);}album();};input.click();}
function notice(text){const el=document.createElement('div');el.className='creation-notice';el.setAttribute('role','status');el.textContent=text;root.append(el);setTimeout(()=>el.remove(),2600);}
root.addEventListener('click',e=>{
 if(e.target===root&&stage==='menu'){close();return;}
 const item=e.target.closest('[data-media]');if(item){const id=item.dataset.media;if(selected.includes(id))selected=selected.filter(x=>x!==id);else if(selected.length<18)selected.push(id);else notice('最多选择 18 个素材');renderGrid();renderSelection();return;}
 const remove=e.target.closest('[data-remove]');if(remove){selected=selected.filter(id=>id!==remove.dataset.remove);renderGrid();renderSelection();return;}
 const tab=e.target.closest('[data-filter]');if(tab){filter=tab.dataset.filter;root.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===tab));renderGrid();return;}
 const action=e.target.closest('[data-create]')?.dataset.create;
 switch(action){
 case 'close':close();break;
 case 'album':mode='normal';album(true);break;
 case 'travel':mode='travel';album(true);break;
 case 'camera':mode='normal';album(true);importFiles(true);break;
 case 'text':mode='normal';selected=[];title='';body='';editor();break;
 case 'source':importFiles();break;
 case 'next':if(selected.length)editor();break;
 case 'back':title=root.querySelector('#creation-title')?.value||title;body=root.querySelector('#creation-body')?.value||body;album();break;
 case 'save-draft':title=root.querySelector('#creation-title').value;body=root.querySelector('#creation-body').value;draft={title,body,mode,selected:[...selected]};notice('已保存草稿（当前浏览会话）');break;
 case 'draft':if(draft){({title,body,mode}=draft);selected=[...draft.selected];editor();}else notice('还没有草稿');break;
 case 'film':notice('一键成片尚未接入视频生成');break;
 }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!root.hidden){e.stopImmediatePropagation();if(stage==='album')openCreationMenu();else if(stage==='editor')album();else close();}},true);
