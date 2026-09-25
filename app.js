const TOOL_META = {
  protein:{title:'Günlük Protein İhtiyacı',desc:'Hedefine göre günlük protein aralığını hesapla',icon:'protein.jpg',group:'Temel'},
  kreatin:{title:'Kreatin',desc:'Günlük doz ve yükleme aralığını gör',icon:'kreatin.jpg',group:'Temel'},
  kafein:{title:'Kafein',desc:'Kilo bazlı antrenman öncesi dozu hesapla',icon:'kafein.jpg',group:'Performans'},
  sitrulin:{title:'Sitrülin Malat',desc:'Antrenman öncesi doz aralığını hesapla',icon:'sitrulin.jpg',group:'Performans'},
  beta:{title:'Beta-Alanin',desc:'Kilo bazlı günlük doz hesabı',icon:'beta.jpg',group:'Performans'},
  karnitin:{title:'L-Karnitin',desc:'Kilo bazlı günlük doz hesabı',icon:'karnitin.jpg',group:'Performans'},
  eaa:{title:'EAA',desc:'Esansiyel amino asit doz hesabı',icon:'eaa.jpg',group:'Amino asitler'},
  bcaa:{title:'BCAA',desc:'Kilo bazlı BCAA doz hesabı',icon:'bcaa.jpg',group:'Amino asitler'},
  arjinin:{title:'Arjinin',desc:'Antrenman öncesi L-arjinin hesabı',icon:'arjinin.jpg',group:'Performans'},
  glutamin:{title:'Glutamin',desc:'Kilo bazlı glutamin doz hesabı',icon:'glutamin.jpg',group:'Amino asitler'},
  yag:{title:'Yağ Oranı & VKİ',desc:'Vücut kompozisyonu ve VKİ hesabı',icon:'yag.jpg',group:'Vücut'},
  kreatinin:{title:'Kreatinin Tahmini',desc:'Girdilere dayalı tahmini değer aralığı',icon:'kreatinin.jpg',group:'Vücut'},
  hepsi:{title:'Toplu Supplement',desc:'Birden fazla supplementi tek ekranda hesapla',icon:'hepsi.jpg',group:'Araç'},
};
const ORDER=['hepsi','protein','kreatin','kafein','sitrulin','beta','karnitin','eaa','bcaa','arjinin','glutamin','yag','kreatinin'];
const navDesktop=document.getElementById('desktopNav'), navMobile=document.getElementById('mobileNav'), homeCards=document.getElementById('homeCards');
const groups=[['Temel',['protein','kreatin']],['Performans',['kafein','sitrulin','beta','karnitin','arjinin']],['Amino asitler',['eaa','bcaa','glutamin']],['Vücut',['yag','kreatinin']],['Araç',['hepsi']]];
function iconHTML(k,large=false){const t=TOOL_META[k];return `<img src="icons/${t.icon}" alt="" class="tool-img ${large?'large':''}" loading="lazy" onerror="this.hidden=true">`;}
function buildNav(target){target.innerHTML=''; groups.forEach(([name,keys])=>{const head=document.createElement('div');head.className='nav-group-label';head.textContent=name;target.appendChild(head);keys.forEach(k=>{const b=document.createElement('button');b.className='nav-item';b.dataset.route=k;b.innerHTML=`<span class="nav-visual">${iconHTML(k)}</span><span>${TOOL_META[k].title}</span>`;target.appendChild(b)})});}
function buildCards(){homeCards.innerHTML=ORDER.map((k,i)=>{const t=TOOL_META[k];return `<button class="tool-card" data-route="${k}"><div class="tool-thumb">${iconHTML(k,true)}<span class="tool-num">${String(i+1).padStart(2,'0')}</span></div><div class="tool-copy"><div class="tool-group">${t.group}</div><strong>${t.title}</strong><p>${t.desc}</p></div><span class="tool-arrow">↗</span></button>`}).join('');}
buildNav(navDesktop);buildNav(navMobile);buildCards();
function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem('sl-theme',theme);document.getElementById('desktopThemeText').textContent=theme==='dark'?'Açık tema':'Koyu tema';}
setTheme(localStorage.getItem('sl-theme')||'light');
function toggleTheme(){setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');}
document.getElementById('desktopTheme').onclick=toggleTheme; document.getElementById('mobileTheme').onclick=toggleTheme;
const drawer=document.getElementById('mobileDrawer');
function drawerOpen(v){drawer.classList.toggle('open',v);drawer.setAttribute('aria-hidden',String(!v));document.body.classList.toggle('drawer-open',v);}
document.getElementById('mobileMenuBtn').onclick=()=>drawerOpen(true); drawer.querySelectorAll('[data-close-drawer]').forEach(x=>x.onclick=()=>drawerOpen(false));
function route(k){ if(k==='home'||!k){showHome(); history.replaceState(null,'',location.pathname+location.search); drawerOpen(false); return;} showTool(k); history.replaceState(null,'',location.pathname+'#'+k); drawerOpen(false); }
document.addEventListener('click',e=>{const el=e.target.closest('[data-route]'); if(el) route(el.dataset.route);});
window.addEventListener('popstate',()=>boot()); window.addEventListener('hashchange',()=>boot());
function showHome(){document.getElementById('homeView').classList.add('active');document.getElementById('toolView').classList.remove('active');window.scrollTo(0,0);}
function showTool(k){if(!TOOL_META[k]||!window.SECTIONS[k]){showHome();return;} document.getElementById('homeView').classList.remove('active');document.getElementById('toolView').classList.add('active');document.getElementById('crumbTitle').textContent=TOOL_META[k].title; const mount=document.getElementById('sectionMount');mount.innerHTML=window.SECTIONS[k]; decorateSection(mount,k); bindAccordions(mount); bindHedefAccordions(mount); bindEnterNavigation(mount); requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}));}
function decorateSection(mount,k){
  const section=mount.querySelector('.section'); if(!section)return;
  section.classList.add('lab-section');
  const h=section.querySelector(':scope > h3');
  const top=document.createElement('div'); top.className='section-hero';
  top.innerHTML=`<div class="section-hero-copy"><div class="kicker">${TOOL_META[k].group.toUpperCase()}</div><h1>${TOOL_META[k].title}</h1><p>${TOOL_META[k].desc}</p></div><div class="section-hero-image">${iconHTML(k,true)}</div>`;
  if(h) h.remove(); section.prepend(top);
  const infoWrap=section.querySelector('.supplement-section-info');
  if(infoWrap){
    infoWrap.classList.add('rich-info');
    infoWrap.querySelectorAll('.info-section').forEach(x=>{
      x.classList.add('feature-panel');
      const body=x.querySelector('.not-metin');
      if(body && !body.querySelector('.fact-grid')){
        const raw=body.innerHTML.split(/<br\s*\/?>(?:\s*)/i).map(s=>s.trim()).filter(Boolean);
        if(raw.length>=2){
          const grid=document.createElement('div'); grid.className='fact-grid';
          raw.forEach((part,i)=>{
            const card=document.createElement('div'); card.className='fact-card';
            card.innerHTML=`<span class="fact-index">${String(i+1).padStart(2,'0')}</span>${part}`;
            grid.appendChild(card);
          });
          body.replaceWith(grid);
        }
      }
    });
    infoWrap.querySelectorAll('.faq-section').forEach(x=>x.classList.add('faq-panel'));
    const badges=[];
    infoWrap.querySelectorAll('span.birikimli-vurgu,span.akut-vurgu,span.uzun-vade-vurgu,span.karma-vurgu').forEach(x=>badges.push(x.textContent.trim()));
    if(badges.length){const b=document.createElement('div');b.className='effect-strip';b.innerHTML=`<span class="effect-dot"></span><strong>Etki özeti</strong>${badges.slice(0,2).map(v=>`<span class="effect-pill">${v}</span>`).join('')}`; infoWrap.prepend(b);}
  }
  section.querySelectorAll('.doz-bilgisi').forEach((box,idx)=>{box.classList.add('risk-box'); if(box.classList.contains('danger')) box.dataset.type='danger'; else box.dataset.type='warning'; box.setAttribute('data-reveal','');});
  section.querySelectorAll('.disclaimer').forEach(x=>x.classList.add('section-disclaimer'));
  enhanceCalculator(section,k);
  section.querySelectorAll('table').forEach(t=>{const wrap=document.createElement('div');wrap.className='table-scroll';t.parentNode.insertBefore(wrap,t);wrap.appendChild(t);});
}
function enhanceCalculator(section,k){
  const inputArea=section.querySelector('input,select'); if(!inputArea)return;
  const firstFormChild=inputArea.closest('.section')?.querySelector('input,select');
  let firstGroup=inputArea.parentElement; while(firstGroup && firstGroup!==section && !firstGroup.classList.contains('form-group') && !firstGroup.classList.contains('checkbox-group')) firstGroup=firstGroup.parentElement;
  if(firstGroup) firstGroup.classList.add('lab-field');
  section.querySelectorAll('input:not([type="checkbox"]),select').forEach(el=>{el.classList.add('lab-control');const p=el.parentElement;p?.classList.add('lab-field-wrap');});
  section.querySelectorAll('button:not(.accordion-header):not(.hedef-option)').forEach(b=>b.classList.add('lab-calc-btn'));
  section.querySelectorAll('.result,.result-card').forEach(r=>r.classList.add('lab-result'));
}
function bindAccordions(root){root.querySelectorAll('.accordion-item').forEach(item=>{const head=item.querySelector('.accordion-header'),content=item.querySelector('.accordion-content');if(!head||!content)return;head.setAttribute('aria-expanded','false');content.style.maxHeight='0px';head.addEventListener('click',()=>{const open=item.classList.contains('active');item.parentElement.querySelectorAll('.accordion-item.active').forEach(other=>{if(other!==item){other.classList.remove('active');other.querySelector('.accordion-header')?.setAttribute('aria-expanded','false');other.querySelector('.accordion-content').style.maxHeight='0px';}});item.classList.toggle('active',!open);head.setAttribute('aria-expanded',String(!open));content.style.maxHeight=!open?content.scrollHeight+'px':'0px';});});}
function bindHedefAccordions(root){root.querySelectorAll('.hedef-accordion').forEach(wrap=>{const targetId=wrap.dataset.hedefTarget;const select=document.getElementById(targetId);if(!select)return;const options=wrap.querySelectorAll('.hedef-option');const headerLabel=wrap.querySelector('.accordion-header');const defaultLabel=headerLabel?headerLabel.textContent:'';function applySelection(value,text){select.value=value;options.forEach(o=>o.classList.toggle('active',o.dataset.value===value));if(headerLabel) headerLabel.textContent=value?text:defaultLabel;const warn=document.getElementById(targetId+'_warning');if(warn) warn.textContent='';}options.forEach(opt=>{opt.addEventListener('click',e=>{e.stopPropagation();applySelection(opt.dataset.value,opt.textContent);const item=wrap.querySelector('.accordion-item');if(item){item.classList.remove('active');item.querySelector('.accordion-header')?.setAttribute('aria-expanded','false');const content=item.querySelector('.accordion-content');if(content) content.style.maxHeight='0px';}});});if(select.value) applySelection(select.value,[...options].find(o=>o.dataset.value===select.value)?.textContent||defaultLabel);});}
function bindEnterNavigation(root){root.querySelectorAll('input,select:not(.hedef-select-hidden)').forEach(el=>el.addEventListener('keydown',e=>{if(e.key!=='Enter')return;e.preventDefault();const fields=[...root.querySelectorAll('input:not([type="hidden"]),select:not(.hedef-select-hidden)')].filter(x=>!x.disabled);const i=fields.indexOf(el);if(i>=0&&fields[i+1]) fields[i+1].focus(); else {const btn=[...root.querySelectorAll('button')].find(b=>/hesapla|hesapla|hesap/.test((b.textContent||'').toLowerCase()) && !b.classList.contains('accordion-header')); if(btn) btn.click();}}));}
function boot(){const k=location.hash.replace('#',''); if(k&&TOOL_META[k]) showTool(k); else showHome();}
boot();
