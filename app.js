import { openCreationMenu, navigateCreation } from './creation.js?v=3';
const $ = (s) => document.querySelector(s);
const paths = {
  heart:'<path d="M12 21S2 14.8 2 8.3C2 2.9 8.5 1.3 12 5.5c3.5-4.2 10-2.6 10 2.8C22 14.8 12 21 12 21Z"/>',
  star:'<path d="m12 2 3.1 6.3 7 1-5.1 5 .9 7L12 18l-6.2 3.3 1-7-5.1-5 7-1Z"/>',
  comment:'<path d="M4.6 17.4A9.4 9.4 0 1 1 12 21.3c-1.5 0-2.8-.3-4-.9L2 22l1.5-6"/><circle cx="8.4" cy="11.8" r=".9" fill="currentColor" stroke="none"/><circle cx="15.7" cy="11.8" r=".9" fill="currentColor" stroke="none"/>',
  search:'<circle cx="10.5" cy="10.5" r="8.3"/><path d="m17 17 5 5"/>',
  menu:'<path d="M3 21V12a9 9 0 1 1 9 9H3Z"/>',
  back:'<path d="m15 3-9 9 9 9"/>',
  share:'<path d="m13 3 9 7-9 8v-5C7 13 3.8 17 2 21c0-8 3.6-13 11-14V3Z"/>',
  plus:'<path d="M12 4v16M4 12h16"/>',
  edit:'<path d="m5 16 11-12a2 2 0 0 1 3 3L8 19l-5 1 2-4ZM2 23h18"/>',
  neutral:'<circle cx="12" cy="12" r="9.6"/><path d="M7 8.5q2 2 4 0m3 0q2 2 4 0M8 16h8"/>',
  mic:'<rect x="8" y="2" width="8" height="14" rx="4"/><path d="M4 10v2a8 8 0 0 0 16 0v-2M12 20v3"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m4 17 5-5 4 4 4-6 4 5"/>',
  sort:'<path d="M4 6h16M7 12h10M10 18h4"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.heart}</svg>`;
function hydrateIcons(root=document){ root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon)); }
const esc = (str) => String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const photo = (id,w=800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const coffeeImages = [photo('photo-1442512595331-e89e73853f31'),photo('photo-1501339847302-ac426a4a7cbb'),photo('photo-1495474472287-4d71bcdd2085'),photo('photo-1447933601403-0c6688de566e')];
const notes = [
  {id:'anthropic-claude',title:'第一反应是Anthropic和ClaudeAI',user:'日常碎片',likes:0,image:'./public/assets/anthropic-claude.jpg',images:['./public/assets/anthropic-claude.jpg'],body:[],tags:['Anthropic','ClaudeAI','日常碎片'],ratio:'3/4'},
  {id:'apple-jingan-duo',title:'全球只有4个的 DUO 雕塑，就在 Apple 静安❓',user:'城市漫游',likes:0,image:'./public/assets/apple-jingan-duo.jpg',images:['./public/assets/apple-jingan-duo.jpg'],body:[],tags:['Apple静安','上海Citywalk','城市雕塑'],ratio:'3/4'},
  {id:'coffee',title:'M Stand新出的盲盒有人懂吗！好可爱！！',user:'小可的日常',likes:478,reference:true,avatar:5},
  {id:'walk',title:'在城市里，找一个下午慢慢走',user:'走走停停',likes:1068,image:photo('photo-1519501025264-65ba15a82390'),ratio:'3/4',avatar:44},
  {id:'cafe',title:'把周末留给咖啡和阳光☕️',user:'一只栗子',likes:289,image:coffeeImages[1],ratio:'1/1',avatar:25},
  {id:'sea',title:'海边的日落，是今天的小确幸',user:'小岛来信',likes:2046,image:photo('photo-1475924156734-496f6cac6ec1'),ratio:'3/4',avatar:49},
  {id:'interior',title:'喜欢这样的房间，安静又有温度',user:'住在好天气里',likes:756,image:photo('photo-1600210492486-724fe5c67fb0'),ratio:'4/5',avatar:32},
  {id:'mountain',title:'山野里没有答案，但有自由',user:'山间有风',likes:1324,image:photo('photo-1464822759023-fed622ff2c3b'),ratio:'3/4',avatar:15}
];
let activeTab='发现',currentNote=notes[0],slide=0,savedScroll=0,commentCount=29;
const likes=new Set(),saves=new Set(),follows=new Set(),postedComments=new Map();
function card(note){
  let media=note.crop?`<div class="card-media reference-crop crop-${note.crop}"><img src="./public/assets/feed-reference.jpg" alt="${esc(note.title)}"/></div>`:note.reference?`<div class="card-media" style="aspect-ratio:3/4"><div class="gallery-slide hero-reference"><img src="./public/assets/note-reference.jpg" alt="咖啡与毛绒盲盒"/></div></div>`:`<div class="card-media" style="aspect-ratio:${note.ratio}"><img loading="lazy" src="${note.image}" alt="${esc(note.title)}"/></div>`;
  return `<article class="note-card" tabindex="0" role="button" aria-label="打开笔记 ${esc(note.title)}" data-note="${note.id}">${media}${note.video?'<span class="video-mark"></span>':''}<div class="card-content">${note.following?'<div class="card-following"><span class="following-badge">●</span>你的关注</div>':''}<h2 class="card-title">${note.title}</h2><div class="card-meta"><img class="card-avatar" src="./public/assets/avatar.svg" alt=""/><span class="card-user">${note.user}</span><button class="card-like ${likes.has(note.id)?'liked':''}" data-card-like="${note.id}" aria-label="点赞这篇笔记">${icon('heart')}<span>${note.likes+(likes.has(note.id)?1:0)}</span></button></div></div></article>`;
}
function renderFeed(){
  let list=notes.filter(n=>!$('#search-input').value||`${n.title}${n.user}`.toLowerCase().includes($('#search-input').value.toLowerCase()));
  if(activeTab==='关注')list=list.filter(n=>n.following||follows.has(n.user));
  if(activeTab==='附近')list=list.filter(n=>['coffee','walk','cafe','map'].includes(n.id));
  $('#feed').innerHTML=list.length?`<div class="feed-column">${list.filter((_,i)=>i%2===0).map(card).join('')}</div><div class="feed-column">${list.filter((_,i)=>i%2===1).map(card).join('')}</div>`:'<div class="empty-state">暂时没有相关笔记，换个关键词试试吧</div>';
}
const coffeeBody=['🙋🏻‍♀️新鸡蛋已领！！','M Stand和fuwala联名出毛绒盲盒了！！','小小一只真的太可爱了，带它一起喝秋天的第一杯咖啡☕️','这次点了荞麦乌龙水牛乳拿铁，搭配毛绒小挂件，拍照也太出片了～','入口丝滑绵密～细品荞麦乌龙焦香咖啡香 还有黑糖奶香','风味层次很柔和～一点都不腻，我很喜欢！！','记得喝之前一定要搅拌均匀再大口喝，麦香混着咖啡香双重暴击，真绝了！'];
function openNote(id,updateHistory=true){
  currentNote=notes.find(n=>n.id===id)||notes[0];
  savedScroll=$('#feed-scroll').scrollTop;
  $('#feed-screen').hidden=true;$('#detail-screen').hidden=false;
  $('.clock').firstChild.textContent='16:22 ';
  $('.author-name').textContent=currentNote.user;
  $('.author-avatar').classList.toggle('reference-avatar',id==='coffee');
  $('.author-avatar').style.backgroundImage=id==='coffee'?'':`url(./public/assets/avatar.svg)`;
  $('.author-avatar').style.backgroundSize=id==='coffee'?'':'cover';
  $('#note-title').textContent=currentNote.title;
  const isCoffee=id==='coffee';
  $('#note-body').innerHTML=(currentNote.body??(isCoffee?coffeeBody:['把生活里的小小发现记录下来，分享给同样喜欢的你。','不用着急，留一点时间给自己，感受今天的好天气。','照片里都是我喜欢的瞬间，欢迎在评论区一起聊聊。'])).map(t=>`<p>${esc(t)}</p>`).join('');
  const tags=currentNote.tags??(isCoffee?['MStand','MStand联名','Fuwala','MStand荞麦乌龙水牛乳系列','MStand联名盲盒','MStandFuwala联名盲盒','天津咖啡','我的咖啡日记','咖啡探店']:['生活记录','日常碎片','发现生活的美好']);
  $('#hashtags').innerHTML=tags.map(t=>`<button data-tag="${t}">#${t}</button>`).join(' ');
  const images=currentNote.images??(isCoffee?[null,...Array.from({length:10},(_,i)=>coffeeImages[i%4])]:[currentNote.image||coffeeImages[0],coffeeImages[1],coffeeImages[2]]);
  $('#gallery-track').innerHTML=images.map((src,i)=>src?`<div class="gallery-slide"><img src="${src}" alt="笔记图片 ${i+1}" ${i?'loading="lazy"':''}/></div>`:`<div class="gallery-slide hero-reference"><img src="./public/assets/note-reference.jpg" alt="M Stand咖啡与毛绒盲盒"/></div>`).join('');
  if(currentNote.crop)$('#gallery-track').firstElementChild.innerHTML=`<div class="card-media reference-crop crop-${currentNote.crop}" style="height:100%"><img src="./public/assets/feed-reference.jpg" alt="${esc(currentNote.title)}"/></div>`;
  slide=0;updateGallery();updateActions();renderComments();$('#detail-scroll').scrollTop=0;
  if(updateHistory)history.pushState({note:id},'',`#note/${id}`);
}
function updateGallery(){let total=$('#gallery-track').children.length;$('#gallery-track').style.transform=`translateX(-${slide*100}%)`;$('#image-counter').textContent=`${slide+1}/${total}`;$('#gallery-dots').innerHTML=Array.from({length:Math.min(5,total)},(_,i)=>`<button class="${i===Math.min(slide,4)?'active':''}" data-slide="${i}" aria-label="查看第${i+1}张图片"></button>`).join('');}
function updateActions(){const liked=likes.has(currentNote.id),saved=saves.has(currentNote.id),followed=follows.has(currentNote.user);$('[data-action=like]').setAttribute('aria-pressed',liked);$('[data-action=save]').setAttribute('aria-pressed',saved);$('#like-count').textContent=currentNote.likes+Number(liked);$('#save-count').textContent=330+Number(saved);$('.follow-button').textContent=followed?'已关注':'关注';$('.follow-button').classList.toggle('followed',followed);}
function renderComments(){
 const posted=postedComments.get(currentNote.id)||[];commentCount=29+posted.length;$('#comment-total').textContent=commentCount;$('#bottom-comment-count').textContent=commentCount;
 $('#comment-list').innerHTML=posted.map(text=>`<div class="comment"><img class="avatar" src="/public/assets/avatar.svg" alt="我的头像"/><div class="comment-content"><div class="comment-user">我</div><p class="comment-text">${esc(text)}</p><div class="comment-meta">刚刚</div></div></div>`).join('')+`<div class="comment"><img class="avatar" src="/public/assets/avatar.svg" alt="爱福桃的lucky"/><div class="comment-content"><div class="comment-user">爱福桃的lucky</div><p class="comment-text">${currentNote.id==='coffee'?'这个要去店里买吗？':'好喜欢！请问是在哪里呀？'}</p><div class="comment-meta"><span>5小时前 天津</span><button class="reply-button" data-reply="爱福桃的lucky">回复</button><div class="comment-reactions"><button data-action="comment-like" aria-label="赞这条评论">${icon('heart')}</button><button data-action="comment-dislike" aria-label="不喜欢这条评论">${icon('neutral')}</button></div></div><div class="reply"><div class="avatar reference-avatar"></div><div class="comment-content"><div class="comment-user">${esc(currentNote.user)}<span class="author-label">作者</span></div><p class="comment-text">${currentNote.id==='coffee'?'我是在店里买的呢 线上应该也有吧':'谢谢喜欢！笔记里有详细介绍哦'}</p><div class="comment-meta"><span>4小时前 天津</span><button class="reply-button" data-reply="${esc(currentNote.user)}">回复</button><div class="comment-reactions"><button data-action="comment-like" aria-label="赞作者回复">${icon('heart')}</button><button data-action="comment-dislike" aria-label="不喜欢作者回复">${icon('neutral')}</button></div></div><button class="expand-replies" data-action="expand">展开 1 条回复</button><div class="extra-reply" hidden><div class="comment-user">爱福桃的lucky</div><p class="comment-text">好哒，谢谢分享！周末就去看看～</p></div></div></div></div></div>`;
 document.querySelectorAll('#comment-list img[src="/public/assets/avatar.svg"]').forEach(img=>img.src='./public/assets/avatar.svg');
}
function back(){if(location.hash.startsWith('#note/'))history.back();else showFeed();}
function showFeed(){$('#detail-screen').hidden=true;$('#feed-screen').hidden=false;$('.clock').firstChild.textContent='16:21 ';renderFeed();$('#feed-scroll').scrollTop=savedScroll;}
let toastTimer;function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2200);}
function sheet(html){$('#sheet-content').innerHTML=html;$('#overlay').hidden=false;hydrateIcons($('#sheet-content'));}
function closeSheet(){$('#overlay').hidden=true;}
function composer(name=''){sheet(`<h2>${name?'回复 '+esc(name):'说点什么'}</h2><form id="comment-form"><textarea id="comment-text" aria-label="评论内容" placeholder="友善表达，认真分享" maxlength="500" required></textarea><button class="sheet-primary" type="submit">发布</button></form>`);$('#comment-text').focus();$('#comment-form').onsubmit=e=>{e.preventDefault();const value=$('#comment-text').value.trim();if(!value)return;const list=postedComments.get(currentNote.id)||[];list.unshift(name?`回复 ${name}：${value}`:value);postedComments.set(currentNote.id,list);renderComments();closeSheet();$('#comments').scrollIntoView({behavior:'smooth',block:'start'});toast('评论发布成功');};}
document.addEventListener('click',async e=>{
 const cardLike=e.target.closest('[data-card-like]');if(cardLike){const id=cardLike.dataset.cardLike;likes.has(id)?likes.delete(id):likes.add(id);renderFeed();return;}
 const tab=e.target.closest('[data-tab]');if(tab){activeTab=tab.dataset.tab;document.querySelectorAll('[data-tab]').forEach(t=>t.classList.toggle('active',t===tab));renderFeed();return;}
 const cardEl=e.target.closest('[data-note]');if(cardEl){openNote(cardEl.dataset.note);return;}
 const dot=e.target.closest('[data-slide]');if(dot){slide=Number(dot.dataset.slide);updateGallery();return;}
 const reply=e.target.closest('[data-reply]');if(reply){composer(reply.dataset.reply);return;}
 const tag=e.target.closest('[data-tag]');if(tag){sheet(`<h2>#${esc(tag.dataset.tag)}</h2><p>话题里的相关笔记</p>${notes.filter(n=>['coffee','cafe'].includes(n.id)).map(n=>`<button class="sheet-row" data-topic-note="${n.id}">${esc(n.title)}</button>`).join('')}`);return;}
 const topic=e.target.closest('[data-topic-note]');if(topic){closeSheet();openNote(topic.dataset.topicNote);return;}
 const btn=e.target.closest('[data-action]');if(!btn)return;
 switch(btn.dataset.action){
 case 'back':back();break;
 case 'home':showFeed();$('#feed-scroll').scrollTo({top:0,behavior:'smooth'});break;
 case 'like':likes.has(currentNote.id)?likes.delete(currentNote.id):likes.add(currentNote.id);updateActions();break;
 case 'save':saves.has(currentNote.id)?saves.delete(currentNote.id):saves.add(currentNote.id);updateActions();toast(saves.has(currentNote.id)?'已收藏到默认收藏夹':'已取消收藏');break;
 case 'follow':follows.has(currentNote.user)?follows.delete(currentNote.user):follows.add(currentNote.user);updateActions();break;
 case 'comment':composer();break;
 case 'jump-comments':$('#comments').scrollIntoView({behavior:'smooth',block:'start'});break;
 case 'expand':$('.extra-reply').hidden=!$('.extra-reply').hidden;btn.textContent=$('.extra-reply').hidden?'展开 1 条回复':'收起回复';break;
 case 'comment-like':btn.classList.toggle('liked');break;
 case 'comment-dislike':toast('已记录你的反馈');break;
 case 'dislike':btn.innerHTML='已反馈';toast('将减少类似内容推荐');break;
 case 'sort-comments':sheet('<h2>评论排序</h2><button class="sheet-row" data-action="sort-hot">按热度排序</button><button class="sheet-row" data-action="sort-new">按时间排序</button>');break;
 case 'sort-hot':case 'sort-new':closeSheet();toast('当前为精选示例，完整排序需接入真实数据');break;
 case 'search':$('.search-panel').hidden=false;$('#search-input').focus();break;
 case 'close-search':$('.search-panel').hidden=true;$('#search-input').value='';renderFeed();break;
 case 'share':sheet('<h2>分享这篇笔记</h2><button class="sheet-row" data-action="copy">复制链接</button><button class="sheet-row" data-action="system-share">更多分享方式</button>');break;
 case 'copy':try{await navigator.clipboard.writeText(location.href);toast('链接已复制');}catch{toast('请复制浏览器地址栏中的链接');}closeSheet();break;
 case 'system-share':if(navigator.share){try{await navigator.share({title:currentNote.title,url:location.href});closeSheet();}catch{}}else toast('当前浏览器不支持系统分享，请复制链接');break;
 case 'menu':sheet('<h2>小红书</h2><button class="sheet-row" data-action="saved">我的收藏</button><button class="sheet-row" data-action="recent">最近浏览</button><p>生活的兴趣社区</p>');break;
 case 'saved':sheet('<h2>我的收藏</h2>'+(notes.filter(n=>saves.has(n.id)).map(n=>`<button class="sheet-row" data-topic-note="${n.id}">${esc(n.title)}</button>`).join('')||'<p>还没有收藏，去笔记里点亮星星吧。</p>'));break;
 case 'recent':sheet(`<h2>最近浏览</h2><button class="sheet-row" data-topic-note="${currentNote.id}">${esc(currentNote.title)}</button>`);break;
 case 'author':sheet(`<h2>${esc(currentNote.user)}</h2><p>记录生活里的每一个小美好。</p><button class="sheet-row" data-topic-note="${currentNote.id}">${esc(currentNote.title)}</button>`);break;
 case 'profile':sheet('<h2>我的主页</h2><p>发现生活，记录日常。</p><button class="sheet-row" data-action="saved">查看我的收藏</button>');break;
 case 'messages':sheet('<h2>消息</h2><p>暂时没有新消息。</p>');break;
 case 'market':toast('市集暂未包含在本次界面原型中');break;
 case 'publish':openCreationMenu();break;
 }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#overlay').hidden)closeSheet();else if(!$('#detail-screen').hidden)back();}if(e.key==='Enter'&&e.target.matches('[data-note]'))openNote(e.target.dataset.note);});
$('#overlay').addEventListener('click',e=>{if(e.target===$('#overlay'))closeSheet();});
$('#search-input').addEventListener('input',renderFeed);
let startX=0;$('#gallery').addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});$('#gallery').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>35){slide=Math.max(0,Math.min($('#gallery-track').children.length-1,slide+(dx<0?1:-1)));updateGallery();}},{passive:true});
$('#gallery').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();slide=Math.max(0,Math.min($('#gallery-track').children.length-1,slide+(e.key==='ArrowRight'?1:-1)));updateGallery();}});
window.addEventListener('popstate',()=>location.hash.startsWith('#note/')?openNote(location.hash.split('/')[1],false):showFeed());
hydrateIcons();renderFeed();if(location.hash.startsWith('#note/'))openNote(location.hash.split('/')[1],false);

// Prototype-only navigator stays outside phone overlays and inert screens.
const previewNav=document.createElement('aside');
previewNav.className='preview-nav';
previewNav.setAttribute('aria-label','原型页面导航');
const previewPages=[['feed','首页 · 信息流'],['note','笔记详情'],['comments','笔记评论'],['menu','创作入口'],['album','相册选图'],['route','路线编辑'],['publish','路线发布'],['text','普通笔记发布']];
previewNav.innerHTML=`<button class="preview-nav-toggle" aria-expanded="false" aria-controls="preview-nav-panel">☷ 页面导航</button><nav id="preview-nav-panel" hidden><header><strong>原型页面</strong><button aria-label="收起导航">×</button></header><p>直接跳转，无需逐步操作</p>${previewPages.map(([id,label])=>`<button data-preview-page="${id}">${label}</button>`).join('')}</nav>`;
document.body.append(previewNav);
const navToggle=previewNav.querySelector('.preview-nav-toggle');
const navPanel=previewNav.querySelector('nav');
function togglePreviewNav(open){navPanel.hidden=!open;navToggle.setAttribute('aria-expanded',String(open));}
previewNav.addEventListener('click',e=>{
 if(e.target.closest('.preview-nav-toggle')){togglePreviewNav(navPanel.hidden);return;}
 if(e.target.closest('header button')){togglePreviewNav(false);navToggle.focus();return;}
 const target=e.target.closest('[data-preview-page]');if(!target)return;
 const page=target.dataset.previewPage;closeSheet();navigateCreation('close');
 history.replaceState(null,'',location.pathname+location.search);
 showFeed();
 if(page==='note'||page==='comments'){
  openNote('coffee',false);
  if(page==='comments')requestAnimationFrame(()=>$('#comments').scrollIntoView({block:'start'}));
 }else if(page!=='feed')navigateCreation(page);
 togglePreviewNav(false);
 navToggle.focus();
});
document.addEventListener('pointerdown',e=>{if(!previewNav.contains(e.target))togglePreviewNav(false);});
previewNav.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();togglePreviewNav(false);navToggle.focus();}});
