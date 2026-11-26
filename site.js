(() => {
 document.documentElement.classList.add('js');
 const page=document.body.dataset.page;
 const themes=[['olive','Olive','#7a8c6a'],['parchment','Parchment','#c4a87c'],['rose','Rose','#b08a9e'],['lavender','Lavender','#8a80b8'],['evening','Evening','#d0b183']];
 const navigation=[['features','Features','features.html'],['story','Story','story.html'],['journal','Blog','journal.html'],['press','Press','press.html'],['recognition','Recognition','recognition.html']];
 document.getElementById('site-header').innerHTML=`
  <a class="brand" href="index.html" aria-label="Zolio home">zolio</a>
  <nav class="nav" aria-label="Main">${navigation.map(([id,label,href])=>`<a href="${href}" ${page===id||(page==='article'&&id==='journal')?'aria-current="page"':''}>${label}</a>`).join('')}</nav>
  <div class="colour-discovery"><button class="colour-toggle" id="colour-toggle" aria-expanded="false" aria-controls="colour-popover"><span class="ink-play" aria-hidden="true"></span>Try a colour <span aria-hidden="true">⌄</span></button>
   <div class="colour-popover" id="colour-popover" hidden><p id="colour-question">What colour feels like today?</p><div class="theme-group" role="radiogroup" aria-labelledby="colour-question">${themes.map(([id,name,colour])=>`<button class="theme-choice" data-theme="${id}" role="radio" aria-checked="${id==='olive'}" tabindex="${id==='olive'?0:-1}"><span class="swatch" style="--swatch:${colour}" aria-hidden="true"></span>${name}<span class="check" aria-hidden="true">✓</span></button>`).join('')}</div><button class="popover-close" id="colour-close">Done with colours</button></div>
  </div>`;
 document.getElementById('site-footer').innerHTML=`
  <div class="footer-top"><span>Zolio · Made by <a href="https://purposelabstudio.com/" rel="noopener">PurposeLab Studio</a>.</span><div class="footer-links">${navigation.map(([,label,href])=>`<a href="${href}">${label}</a>`).join('')}</div></div>
  <div class="footer-links"><a href="questions.html">FAQ</a><a href="privacy.html">Privacy and data</a><a href="community.html">Around Zolio</a><a href="community.html#updates">Updates</a><a href="https://purposelabstudio.com/privacy-policies/folio.html" rel="noopener">Privacy policy</a><a href="https://purposelabstudio.com/privacy-policies/folio-terms.html" rel="noopener">Terms</a></div>
  <p class="footer-note">© 2026 PurposeLab Studio. All rights reserved.</p>
  `;
 const toggle=document.getElementById('colour-toggle'),popover=document.getElementById('colour-popover'),choices=[...document.querySelectorAll('.theme-choice')];
 function closeColour(restore=false){popover.hidden=true;toggle.setAttribute('aria-expanded','false');if(restore)toggle.focus()}
 toggle.addEventListener('click',()=>{const open=popover.hidden;popover.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)choices.find(e=>e.getAttribute('aria-checked')==='true').focus()});
 document.getElementById('colour-close').addEventListener('click',()=>closeColour(true));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!popover.hidden){e.preventDefault();closeColour(true)}});
 document.addEventListener('click',e=>{if(!popover.hidden&&!document.querySelector('.colour-discovery').contains(e.target)){const restore=popover.contains(document.activeElement)||document.activeElement===document.body;closeColour(restore)}});
 function chooseTheme(name){document.documentElement.dataset.theme=name;choices.forEach(e=>{const selected=e.dataset.theme===name;e.setAttribute('aria-checked',String(selected));e.tabIndex=selected?0:-1})}
 choices.forEach((choice,index)=>{
  choice.addEventListener('click',()=>chooseTheme(choice.dataset.theme));
  choice.addEventListener('keydown',event=>{let next=index;if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%choices.length;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index+choices.length-1)%choices.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=choices.length-1;else return;event.preventDefault();chooseTheme(choices[next].dataset.theme);choices[next].focus()});
 });
 const carousel=document.getElementById('showcase');
 if(!carousel)return;
 const slides=[...carousel.querySelectorAll('.slide')],rotation=document.getElementById('rotation-toggle'),controls=carousel.querySelector('.showcase-controls'),position=document.getElementById('position'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,userPaused=false,focusPaused=false,hover=false,ignoreHover=false,visible=false,timer=null,pointerAction=null;
 function render(){
  const all=reduce.matches;
  carousel.classList.toggle('is-static',all);
  if(all)carousel.removeAttribute('aria-roledescription');else carousel.setAttribute('aria-roledescription','carousel');
  controls.hidden=all;position.hidden=all;
  slides.forEach((slide,index)=>{const active=index===current;slide.classList.toggle('active',active);slide.inert=!all&&!active;slide.setAttribute('aria-hidden',String(!all&&!active))});
  position.textContent=String(current+1).padStart(2,'0')+' / 03';
 }
 function running(){return !reduce.matches&&!userPaused&&!focusPaused&&(!hover||ignoreHover)&&!document.hidden&&visible}
 function sync(){
  clearTimeout(timer);timer=null;
  const paused=userPaused||focusPaused;
  rotation.textContent=paused?'Resume':'Pause';
  rotation.setAttribute('aria-label',paused?'Resume automatic examples':'Pause automatic examples');
  rotation.setAttribute('aria-pressed',String(paused));
  if(running())timer=setTimeout(()=>{current=(current+1)%slides.length;render();sync()},9000);
 }
 rotation.addEventListener('pointerdown',()=>{pointerAction=userPaused||focusPaused?'resume':'pause'});
 rotation.addEventListener('click',()=>{
  const action=pointerAction||(userPaused||focusPaused?'resume':'pause');pointerAction=null;
  if(action==='resume'){userPaused=false;focusPaused=false;ignoreHover=hover}else userPaused=true;
  sync();
 });
 carousel.addEventListener('pointermove',event=>{if((event.movementX||event.movementY)&&!hover){hover=true;ignoreHover=false;sync()}});
 carousel.addEventListener('pointerleave',()=>{hover=false;ignoreHover=false;sync()});
 carousel.addEventListener('focusin',event=>{if(!carousel.contains(event.relatedTarget)){focusPaused=true;sync()}});
 document.addEventListener('visibilitychange',sync);
 new IntersectionObserver(entries=>{const next=entries[0].isIntersecting&&entries[0].intersectionRatio>=.25;if(next!==visible){visible=next;sync()}},{threshold:[0,.25]}).observe(carousel);
 reduce.addEventListener('change',()=>{render();sync()});
 render();sync();
})();
