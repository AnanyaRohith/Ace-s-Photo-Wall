const $=s=>document.querySelector(s),KEY='littlewall1';
const D={portrait:[170,215,10,42],landscape:[230,190,10,42],mini:[108,138,6,26]};
const SZ=['portrait','landscape','mini'],NM=['Tall','Wide','Mini'];
const SI=['<rect x="7" y="4" width="10" height="16" rx="1.5"/>','<rect x="4" y="7" width="16" height="10" rx="1.5"/>','<rect x="9" y="8" width="6" height="8" rx="1"/>'];
/* star magnet with softly rounded points */
const SP=(()=>{const p=[];for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,r=k%2?6.6:13.6;p.push([15+r*Math.cos(a),15.6+r*Math.sin(a)])}
 let d='';p.forEach((V,k)=>{const P=p[(k+9)%10],N=p[(k+1)%10],rad=k%2?1.3:2.7,tp=rad/Math.hypot(P[0]-V[0],P[1]-V[1]),tn=rad/Math.hypot(N[0]-V[0],N[1]-V[1]),
  A=[V[0]+(P[0]-V[0])*tp,V[1]+(P[1]-V[1])*tp],B=[V[0]+(N[0]-V[0])*tn,V[1]+(N[1]-V[1])*tn];
  d+=(k?'L':'M')+A[0].toFixed(2)+' '+A[1].toFixed(2)+'Q'+V[0].toFixed(2)+' '+V[1].toFixed(2)+' '+B[0].toFixed(2)+' '+B[1].toFixed(2)});return d+'Z'})();
const STAR=`<div class="clip"><svg viewBox="0 0 30 30"><path d="${SP}" fill="url(#cg)" stroke="#bda57a" stroke-width="1" stroke-linejoin="round"/><ellipse cx="11.5" cy="10.5" rx="2.4" ry="1.3" transform="rotate(-30 11.5 10.5)" fill="#fff" opacity=".9"/><circle cx="19.5" cy="20" r=".9" fill="#fff" opacity=".7"/></svg></div>`;
const XI='<svg viewBox="0 0 10 10" width="10" height="10"><path d="M2 2l6 6M8 2L2 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg>';
let S={items:[],pos:null,dock:null,hid:0,fold:0,sz:0,title:'',ink:[],pen:{c:'#8a5a2b',w:4},font:0,tsz:1},Z=20,cur=null,mode='wall',dt;
try{Object.assign(S,JSON.parse(localStorage[KEY]))}catch(e){}
const save=()=>{try{localStorage[KEY]=JSON.stringify(S)}catch(e){toast('Storage is full — empty the dustbin or remove a few photos')}};
const dsave=()=>{clearTimeout(dt);dt=setTimeout(save,500)};
const get=id=>S.items.find(i=>i.id==id);
const dims=i=>i.t=='n'?[150,150]:i.t=='m'?[44,44]:D[i.s];
const onWall=i=>!i.jar&&!i.bin, inJar=i=>i.jar&&!i.bin;
function toast(t){const d=document.createElement('div');d.id='toast';d.textContent=t;document.body.append(d);setTimeout(()=>d.remove(),2600)}
function pulse(el){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')}
function ask(msg,yes){return new Promise(r=>{const m=$('#cf'),y=$('#cfy'),n=$('#cfn');$('#cft').textContent=msg;y.textContent=yes||'Delete';m.hidden=false;
 const end=v=>{m.hidden=true;y.onclick=n.onclick=m.onpointerdown=null;r(v)};
 y.onclick=()=>end(true);n.onclick=()=>end(false);m.onpointerdown=e=>{if(e.target===m)end(false)}})}

$('#grain').style.backgroundImage=`url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .55  0 0 0 0 .42  0 0 0 0 .2  1.1 0 0 0 -.42'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>")}")`;

/* ---------- dustbin art: wire mesh ---------- */
function meshBin(){const top=30,bot=120,rt=36,rb=28,ry=7,col='#8f7a58',R=y=>rt-(rt-rb)*(y-top)/(bot-top);
 let s='<ellipse cx="50" cy="129" rx="38" ry="5" fill="#00000026"/>';
 s+=`<path d="M${50-rt} ${top}L${50-rb} ${bot}Q50 ${bot+9} ${50+rb} ${bot}L${50+rt} ${top}Z" fill="#f4e8cc" fill-opacity=".45"/>`;
 [58,86].forEach(y=>{const r=R(y);s+=`<path d="M${50-r} ${y}A${r} ${ry*r/rt} 0 0 1 ${50+r} ${y}" fill="none" stroke="${col}" stroke-opacity=".35" stroke-width="1.2"/>`});
 s+='<g id="peek" fill="#f3e3bd" stroke="#b99a62" stroke-width="1"><circle cx="44" cy="108" r="8"/><circle cx="58" cy="111" r="7"/><circle cx="51" cy="96" r="7"/><circle cx="62" cy="98" r="6"/></g>';
 for(let k=-6;k<=6;k++){const a=k*Math.PI/14,c=Math.cos(a),xt=50+rt*Math.sin(a),xb=50+rb*Math.sin(a),e=Math.abs(k)>4;
  s+=`<line x1="${xt.toFixed(1)}" y1="${(top+ry*c).toFixed(1)}" x2="${xb.toFixed(1)}" y2="${(bot+ry*rb/rt*c).toFixed(1)}" stroke="${col}" stroke-width="${e?1.2:1.7}" stroke-opacity="${e?.7:1}"/>`}
 [58,86].forEach(y=>{const r=R(y);s+=`<path d="M${50-r} ${y}A${r} ${ry*r/rt} 0 0 0 ${50+r} ${y}" fill="none" stroke="${col}" stroke-width="1.8"/>`});
 s+=`<path d="M${50-rb} ${bot}A${rb} ${ry*rb/rt} 0 0 0 ${50+rb} ${bot}" fill="none" stroke="${col}" stroke-width="2.8"/>`;
 s+=`<ellipse cx="50" cy="${top}" rx="${rt}" ry="${ry}" fill="#ffffff22" stroke="${col}" stroke-width="2.8"/>`;
 s+='<g id="peek2" fill="#f3e3bd" stroke="#b99a62" stroke-width="1"><circle cx="42" cy="28" r="7"/><circle cx="55" cy="24" r="7.5"/><circle cx="65" cy="30" r="5.5"/></g>';
 return `<svg viewBox="0 0 100 134">${s}</svg>`}
function binArt(){$('#bsvg').innerHTML=meshBin()}

/* ---------- mini palette: movable, dockable, hideable ---------- */
const pal=$('#pal');
function ppos(){const w=pal.offsetWidth,h=pal.offsetHeight,p=S.pos||{x:16,y:16},d=S.dock;
 let x=Math.max(0,Math.min(p.x,innerWidth-w)),y=Math.max(0,Math.min(p.y,innerHeight-h));
 if(d=='L')x=0;if(d=='R')x=innerWidth-w;if(d=='T')y=0;if(d=='B')y=innerHeight-h;
 pal.style.left=x+'px';pal.style.top=y+'px';pal.dataset.dock=d||'';pal.classList.toggle('docked',!!d);pal.classList.toggle('hid',!!(d&&S.hid))}
$('#gp').addEventListener('pointerdown',e=>{const g=$('#gp'),r=pal.getBoundingClientRect(),ox=e.clientX-r.left,oy=e.clientY-r.top;g.setPointerCapture(e.pointerId);S.dock=null;S.hid=0;S.pos={x:r.left,y:r.top};ppos();
 const m=q=>{S.pos={x:q.clientX-ox,y:q.clientY-oy};ppos()},
 u=()=>{g.removeEventListener('pointermove',m);g.removeEventListener('pointerup',u);const b=pal.getBoundingClientRect(),T=14;
  S.dock=b.left<T?'L':innerWidth-b.right<T?'R':b.top<T?'T':innerHeight-b.bottom<T?'B':null;ppos();const q=pal.getBoundingClientRect();S.pos={x:q.left,y:q.top};save()};
 g.addEventListener('pointermove',m);g.addEventListener('pointerup',u)});
$('#gp').ondblclick=()=>{S.fold=S.fold?0:1;pal.classList.toggle('fold',!!S.fold);ppos();save()};
$('#pt').onclick=()=>{S.hid=S.hid?0:1;ppos();save()};
function sizeUI(){$('#szi').innerHTML=SI[S.sz];$('#szn').textContent=NM[S.sz]}
$('#sz').onclick=()=>{S.sz=(S.sz+1)%3;sizeUI();save()};

/* ---------- items on the wall ---------- */
function place(e,i){const[w,h]=dims(i);e.style.left=i.x*innerWidth-w/2+'px';e.style.top=i.y*innerHeight-h/2+'px';e.style.transform=`rotate(${i.r}deg)`}
function mk(i){const e=document.createElement('div');e.className='it';e.dataset.id=i.id;
 if(i.t=='m'){e.className='it mag';e.innerHTML=STAR;place(e,i);return e}
 if(i.t=='n'){e.innerHTML=STAR+`<div class="note"><textarea placeholder="write a note…" maxlength="300"></textarea><button class="x" title="Take down">${XI}</button></div>`;
  const ta=e.querySelector('textarea');ta.value=i.text||'';ta.oninput=()=>{i.text=ta.value;dsave()};
  e.querySelector('.x').onclick=()=>crumple(e,i)}
 else{const[w,h,m,b]=D[i.s];e.innerHTML=STAR+`<div class="pol" style="width:${w}px;height:${h}px;--m:${m}px;--b:${b}px"><div class="im" style="background-image:url(${i.img})"></div></div>`}
 place(e,i);return e}
function render(){const box=$('#items');box.innerHTML='';const L=S.items.filter(onWall);L.forEach(i=>box.append(mk(i)));$('#hint').hidden=!!L.length;jar();counts()}
function counts(){const j=S.items.filter(inJar).length,b=S.items.filter(i=>i.bin).length;
 $('#cnt').textContent=j||'';$('#jc').textContent=j||'';$('#bcnt').textContent=b||'';$('#bc').textContent=b||'';$('#bin').classList.toggle('full',b>0)}
function drop(i){i.x=.22+Math.random()*.62;i.y=.2+Math.random()*.45}
function add(o){const i=Object.assign({id:Date.now()+Math.random().toString(36).slice(2,5),r:+(Math.random()*8-4).toFixed(1)},o);drop(i);S.items.push(i)}
function back(i){i.jar=0;i.bin=0;S.items.splice(S.items.indexOf(i),1);S.items.push(i);drop(i);save();render()}

$('#items').addEventListener('pointerdown',ev=>{const e=ev.target.closest('.it');if(!e||ev.target.closest('textarea,button'))return;
 const i=get(e.dataset.id),sx=ev.clientX,sy=ev.clientY,ox=i.x*innerWidth,oy=i.y*innerHeight;let mv=false;
 S.items.splice(S.items.indexOf(i),1);S.items.push(i);e.style.zIndex=++Z;e.setPointerCapture(ev.pointerId);
 const m=q=>{const dx=q.clientX-sx,dy=q.clientY-sy;if(!mv&&Math.hypot(dx,dy)<5)return;mv=true;e.classList.add('drag');
  i.x=Math.min(.98,Math.max(.02,(ox+dx)/innerWidth));i.y=Math.min(.97,Math.max(.05,(oy+dy)/innerHeight));place(e,i)};
 const u=()=>{e.removeEventListener('pointermove',m);e.removeEventListener('pointerup',u);e.removeEventListener('pointercancel',u);e.classList.remove('drag');
  if(mv)save();else if(i.t=='p')openV(i,'wall')};
 e.addEventListener('pointermove',m);e.addEventListener('pointerup',u);e.addEventListener('pointercancel',u)});

function shrink(f){return new Promise((ok,no)=>{const r=new FileReader;r.onload=()=>{const im=new Image;im.onload=()=>{const k=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.8))};im.onerror=no;im.src=r.result};r.onerror=no;r.readAsDataURL(f)})}
$('#file').onchange=async e=>{for(const f of e.target.files){try{add({t:'p',s:SZ[S.sz],img:await shrink(f)})}catch(_){toast('Could not read that image')}}e.target.value='';save();render()};
$('#nt').onclick=()=>{add({t:'n',text:''});save();render()};
$('#mg').onclick=()=>{add({t:'m',r:+(Math.random()*50-25).toFixed(1)});save();render()};
$('#items').addEventListener('dblclick',ev=>{const e=ev.target.closest('.it.mag');if(!e)return;const i=get(e.dataset.id),tf=e.style.transform;
 e.animate([{transform:tf+' scale(1)',opacity:1},{transform:tf+' scale(1.7)',opacity:0}],{duration:200,fill:'forwards'}).finished.then(()=>{S.items.splice(S.items.indexOf(i),1);save();render()}).catch(()=>{})});

/* ---------- paper crumple + toss into the bin ---------- */
const poly=a=>'polygon('+a.map(p=>p[0]+'% '+p[1]+'%').join(',')+')';
const PR=[[0,0],[33,0],[66,0],[100,0],[100,33],[100,66],[100,100],[66,100],[33,100],[0,100],[0,66],[0,33]];
const PM=[[6,10],[30,2],[58,12],[94,4],[97,32],[86,60],[95,94],[62,86],[34,97],[8,90],[14,60],[3,34]];
const PC=[[16,18],[34,8],[56,14],[80,10],[90,30],[84,54],[88,80],[66,88],[40,92],[18,84],[12,58],[10,34]];
const RB=[40,44,38,45,41,37,44,40,46,39,43,38];
const PB=RB.map((r,k)=>{const a=(225+k*30)*Math.PI/180;return[50+r*.92*Math.cos(a),50+r*.92*Math.sin(a)]});
function toss(el,rot0,spin,dur,end){const r=el.getBoundingClientRect(),b=$('#bin').getBoundingClientRect(),
 dx=b.left+b.width/2-(r.left+r.width/2),dy=b.top+b.height*.22-(r.top+r.height/2),H=Math.max(120,Math.min(260,Math.abs(dy)*.5+100)),kf=[];
 for(let k=0;k<=14;k++){const t=k/14;kf.push({transform:`translate(${dx*t}px,${dy*t-H*4*t*(1-t)}px) rotate(${rot0+spin*t}deg) scale(${1-(1-end)*t*t})`,opacity:t>.88?Math.max(0,1-(t-.88)/.12):1})}
 return el.animate(kf,{duration:dur,easing:'linear',fill:'forwards'})}
function crumple(e,i){e.style.pointerEvents='none';
 const n=e.querySelector('.note'),ta=n.querySelector('textarea'),cl=e.querySelector('.clip'),cr=document.createElement('div');cr.className='cr';n.append(cr);n.querySelector('.x').style.visibility='hidden';
 cl.animate([{transform:'none',opacity:1},{transform:'translate(16px,-30px) rotate(55deg)',opacity:0}],{duration:320,easing:'ease-in',fill:'forwards'});
 ta.animate([{opacity:1},{opacity:1,offset:.15},{opacity:0,offset:.5},{opacity:0}],{duration:700,fill:'forwards'});
 cr.animate([{opacity:0},{opacity:.85,offset:.4},{opacity:1}],{duration:700,fill:'forwards'});
 n.animate([
  {clipPath:poly(PR),transform:'scale(1) rotate(0deg) skew(0deg,0deg)'},
  {clipPath:poly(PM),transform:'scale(.8,.72) rotate(-7deg) skew(-5deg,3deg)',offset:.3},
  {clipPath:poly(PC),transform:'scale(.6,.62) rotate(10deg) skew(4deg,-3deg)',offset:.62},
  {clipPath:poly(PB),transform:'scale(.36) rotate(-6deg)'}],{duration:700,easing:'cubic-bezier(.5,0,.3,1)',fill:'forwards'}).finished
 .then(()=>{const a=toss(e,i.r,520+Math.random()*200,650,.7);setTimeout(()=>pulse($('#bin')),400);return a.finished})
 .then(()=>{i.bin=1;save();render()}).catch(()=>{})}

/* ---------- viewer ---------- */
function openV(i,m){mode=m;cur=i;const c=$('#card'),f=$('.front'),note=i.t=='n',[w,h,mm,b]=note?[150,150,0,0]:D[i.s],
 z=Math.min(innerWidth*.86/w,(innerHeight-130)*.9/h,2.4);
 c.className=m=='bin'?'unf':'';c.style.width=w*z+'px';c.style.height=h*z+'px';
 if(note){f.style.cssText='';f.innerHTML=STAR;const n=document.createElement('div'),t=document.createElement('div');n.className='note';n.style.cssText=`width:100%;height:100%;padding:${20*z}px ${12*z}px`;
  t.style.cssText=`font:600 ${14*z}px/1.35 Quicksand;color:#5a3a22;white-space:pre-wrap;overflow:hidden;height:100%`;t.textContent=i.text||'(empty note)';n.append(t);f.append(n)}
 else{f.style.setProperty('--m',mm*z+'px');f.style.setProperty('--b',b*z+'px');f.innerHTML=STAR+`<div class="im" style="background-image:url(${i.img})"></div>`;$('#msg').value=i.msg||''}
 $('#fl').hidden=note;$('#rm').textContent=m=='bin'?'Retrieve':'Remove from wall';$('#dl').textContent=m=='bin'?'Delete forever':'Delete';$('#vw').hidden=false;
 if(!note){const s=$('#sig'),r=s.getBoundingClientRect();s.width=r.width*2;s.height=r.height*2;redraw()}}
function redraw(){const c=$('#sig'),x=c.getContext('2d'),W=c.width,H=c.height;x.clearRect(0,0,W,H);x.lineCap=x.lineJoin='round';x.strokeStyle='#4a2540';x.lineWidth=W/160;
 (cur.sig||[]).forEach(s=>{x.beginPath();s.forEach((p,k)=>k?x.lineTo(p[0]*W,p[1]*H):x.moveTo(p[0]*W,p[1]*H));if(s.length==1)x.lineTo(s[0][0]*W+.1,s[0][1]*H);x.stroke()})}
(()=>{const c=$('#sig');let on=false;const pt=e=>{const r=c.getBoundingClientRect();return[+((e.clientX-r.left)/r.width).toFixed(3),+((e.clientY-r.top)/r.height).toFixed(3)]};
 c.onpointerdown=e=>{on=true;c.setPointerCapture(e.pointerId);(cur.sig=cur.sig||[]).push([pt(e)]);redraw()};
 c.onpointermove=e=>{if(!on)return;cur.sig[cur.sig.length-1].push(pt(e));redraw()};
 c.onpointerup=c.onpointercancel=()=>{if(on){on=false;save()}}})();
$('#csg').onclick=()=>{cur.sig=[];redraw();save()};
$('#msg').oninput=()=>{if(cur){cur.msg=$('#msg').value;dsave()}};
$('.front').onclick=()=>{if(cur&&cur.t=='p')$('#card').classList.toggle('flip')};
$('#fl').onclick=()=>$('#card').classList.toggle('flip');
function closeV(){if(!cur)return;if(cur.t=='p')cur.msg=$('#msg').value;save();$('#vw').hidden=true;cur=null}
$('#dn').onclick=closeV;
$('#vw').addEventListener('pointerdown',e=>{if(e.target.id=='vw')closeV()});
$('#rm').onclick=()=>{const i=cur;if(i.t=='p')i.msg=$('#msg').value;
 if(mode=='bin'){closeV();back(i);bpanel();return}
 const s=$('#stage');s.classList.add('out');
 setTimeout(()=>{i.jar=1;s.classList.remove('out');$('#vw').hidden=true;cur=null;save();render();pulse($('#jar'))},500)};
$('#dl').onclick=()=>{const i=cur;
 if(mode=='bin'){ask('Delete this forever? This cannot be undone.','Delete forever').then(ok=>{if(ok){S.items.splice(S.items.indexOf(i),1);cur=null;$('#vw').hidden=true;save();render();bpanel()}});return}
 if(i.t=='p')i.msg=$('#msg').value;const s=$('#stage'),a=toss(s,0,300,750,.1);setTimeout(()=>pulse($('#bin')),470);
 a.finished.then(()=>{a.cancel();i.bin=1;$('#vw').hidden=true;cur=null;save();render()}).catch(()=>{})};

/* ---------- jar ---------- */
function th(i,big){const d=document.createElement('div');d.className='th'+(i.t=='n'?' tn':'')+(big?' big':'');
 if(i.t=='p'){const x=document.createElement('i');x.style.backgroundImage=`url(${i.img})`;d.append(x)}else d.textContent=(i.text||'').slice(0,60);return d}
function jar(){const J=S.items.filter(inJar),st=$('#stk');st.innerHTML='';
 J.slice(-6).forEach((i,k)=>{const d=th(i);d.style.cssText=`position:absolute;left:50%;margin-left:-23px;bottom:${6+k*9}px;transform:rotate(${Math.sin(k*7+J.length)*14}deg)`;st.append(d)})}
function jpanel(){const g=$('#jg');g.innerHTML='';const L=S.items.filter(inJar);
 if(!L.length){g.textContent='The jar is empty. Polaroids you remove from the wall land here.';return}
 L.forEach(i=>{const c=document.createElement('div');c.className='c';c.append(th(i,1));
  const b1=document.createElement('button');b1.className='bt';b1.textContent='Back to wall';b1.onclick=()=>{back(i);jpanel()};
  const b2=document.createElement('button');b2.className='bt';b2.textContent='Delete';b2.onclick=()=>{i.jar=0;i.bin=1;save();render();jpanel();pulse($('#bin'))};
  c.append(b1,b2);g.append(c)})}
$('#jar').onclick=$('#oj').onclick=()=>{jpanel();$('#jp').hidden=false};
$('#jx').onclick=()=>$('#jp').hidden=true;
$('#jp').addEventListener('pointerdown',e=>{if(e.target.id=='jp')$('#jp').hidden=true});

/* ---------- dustbin panel ---------- */
function bpanel(){const g=$('#bg');g.innerHTML='';const L=S.items.filter(i=>i.bin);
 if(!L.length){g.textContent='The dustbin is empty.';$('#be').hidden=true;return}
 $('#be').hidden=false;
 L.forEach(i=>{const c=document.createElement('div'),b=document.createElement('div'),t=document.createElement('div');c.className='c';b.className='ball'+(i.t=='p'?' pb':'');
  if(i.t=='p')b.style.setProperty('--img',`url(${i.img})`);
  t.className='cap';t.textContent=i.t=='n'?((i.text||'').trim().slice(0,24)||'empty note'):'photo';
  c.append(b,t);c.onclick=()=>openV(i,'bin');g.append(c)})}
$('#bin').onclick=$('#ob').onclick=()=>{bpanel();$('#bp').hidden=false};
$('#bx').onclick=()=>$('#bp').hidden=true;
$('#bp').addEventListener('pointerdown',e=>{if(e.target.id=='bp')$('#bp').hidden=true});
$('#be').onclick=async()=>{if(await ask('Empty the whole dustbin? Everything in it will be gone for good.','Empty it')){S.items=S.items.filter(i=>!i.bin);save();render();bpanel()}};

/* ---------- heading ---------- */
const hd=$('#hd');hd.textContent=S.title||'';
hd.oninput=()=>{S.title=hd.textContent.replace(/\n/g,' ').trim();dsave()};
hd.onkeydown=e=>{if(e.key=='Enter'){e.preventDefault();hd.blur()}};
const BM="'Bodoni Moda','Bodoni 72',Didot,'Bodoni MT',Georgia,serif",PF="'Playfair Display',Didot,'Bodoni 72',Georgia,serif";
const FN=[['Bodoni Moda Bold · caps',BM,'normal',700,.95,'-.01em','uppercase'],
 ['Bodoni Moda Italic',BM,'italic',500,1.1,'-.01em','none'],
 ['Bodoni Moda',BM,'normal',500,1.05,'-.02em','none'],
 ['Playfair Display Bold',PF,'normal',700,.95,'-.015em','none'],
 ['Playfair Display Italic',PF,'italic',700,1,'-.01em','none']];
function applyFont(){const f=FN[S.font]||FN[0],t=hd.style;t.fontFamily=f[1];t.fontStyle=f[2];t.fontWeight=f[3];t.letterSpacing=f[5];t.textTransform=f[6];
 t.fontSize=`calc(clamp(26px,4.2vw,52px)*${(f[4]*S.tsz).toFixed(3)})`;const b=$('#tf');b.style.fontFamily=f[1];b.style.fontStyle=f[2];b.style.fontWeight=f[3];b.title=f[0]+' · click to change'}
$('#tf').onmousedown=e=>e.preventDefault();
$('#tf').onclick=()=>{S.font=(S.font+1)%FN.length;applyFont();toast(FN[S.font][0]);save()};
$('#tw').value=Math.round(S.tsz*100);$('#tw').oninput=e=>{S.tsz=e.target.value/100;applyFont();dsave()};
applyFont();
$('#ht').onclick=()=>{const o=$('#topt');o.hidden=!o.hidden;$('#ht').classList.toggle('on',!o.hidden);ppos();
 if(!o.hidden){hd.focus();const r=document.createRange();r.selectNodeContents(hd);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r)}};

/* ---------- drawing ---------- */
const dc=$('#dc'),dg=dc.getContext('2d');let cs=null;
function sizeC(){const d=Math.min(2,devicePixelRatio||1);dc.width=innerWidth*d;dc.height=innerHeight*d;dg.setTransform(d,0,0,d,0,0);inkDraw()}
function inkDraw(){dg.clearRect(0,0,innerWidth,innerHeight);dg.lineCap=dg.lineJoin='round';
 S.ink.forEach(s=>{dg.strokeStyle=s.c;dg.lineWidth=s.w;const p=s.p.map(q=>[q[0]*innerWidth,q[1]*innerHeight]);dg.beginPath();dg.moveTo(p[0][0],p[0][1]);
  for(let k=1;k<p.length-1;k++)dg.quadraticCurveTo(p[k][0],p[k][1],(p[k][0]+p[k+1][0])/2,(p[k][1]+p[k+1][1])/2);
  const L=p[p.length-1];dg.lineTo(L[0]+(p.length==1?.1:0),L[1]);dg.stroke()})}
const nrm=e=>[+(e.clientX/innerWidth).toFixed(4),+(e.clientY/innerHeight).toFixed(4)];
dc.onpointerdown=e=>{dc.setPointerCapture(e.pointerId);cs={c:S.pen.c,w:S.pen.w,p:[nrm(e)]};S.ink.push(cs);inkDraw()};
dc.onpointermove=e=>{if(cs){cs.p.push(nrm(e));inkDraw()}};
dc.onpointerup=dc.onpointercancel=()=>{if(cs){cs=null;save()}};
function drawMode(on){document.body.classList.toggle('draw',on);$('#dr').classList.toggle('on',on);$('#dopt').hidden=!on;ppos()}
$('#dr').onclick=()=>drawMode(!document.body.classList.contains('draw'));
$('#pc').value=S.pen.c;$('#pw').value=S.pen.w;
$('#pc').oninput=e=>{S.pen.c=e.target.value;dsave()};$('#pw').oninput=e=>{S.pen.w=+e.target.value;dsave()};
$('#du').onclick=()=>{S.ink.pop();inkDraw();save()};
$('#dx').onclick=()=>{S.ink=[];inkDraw();save()};

/* ---------- photo mode ---------- */
let pt;
function snap(on){if(on){drawMode(false);$('#jp').hidden=$('#bp').hidden=true;const r=pal.getBoundingClientRect();pal.dataset.side=r.left+r.width/2<innerWidth/2?'L':'R';hd.blur()}
 document.body.classList.toggle('photo',on);if(on)showPx()}
function showPx(){const b=$('#px');b.classList.add('show');clearTimeout(pt);pt=setTimeout(()=>b.classList.remove('show'),2200)}
$('#pm').onclick=()=>snap(true);$('#px').onclick=()=>snap(false);
addEventListener('mousemove',()=>{if(document.body.classList.contains('photo'))showPx()});
addEventListener('keydown',e=>{if(e.key!='Escape')return;if(!$('#cf').hidden){$('#cfn').click();return}if(document.body.classList.contains('photo'))snap(false);else if(cur)closeV();else{$('#jp').hidden=true;$('#bp').hidden=true}});

/* ---------- star cursor (matches the magnets) ---------- */
(()=>{const svg=(px,rot)=>`<svg xmlns='http://www.w3.org/2000/svg' width='${px}' height='${px}' viewBox='-2 -2 34 34'><defs><radialGradient id='g' cx='.35' cy='.3'><stop offset='0' stop-color='#fffdf6'/><stop offset='.6' stop-color='#f3e6c8'/><stop offset='1' stop-color='#cdb587'/></radialGradient><filter id='s' x='-30%' y='-30%' width='160%' height='170%'><feDropShadow dx='0' dy='1.2' stdDeviation='1' flood-color='#5a3a10' flood-opacity='.5'/></filter></defs><g filter='url(#s)'><path transform='rotate(${rot} 15 15.6)' d='${SP}' fill='url(#g)' stroke='#a98c5c' stroke-width='1.3' stroke-linejoin='round'/></g><ellipse cx='11.5' cy='10.5' rx='2.4' ry='1.3' transform='rotate(${-30+rot} 15 15.6) translate(0 0)' fill='#fff' opacity='.95'/></svg>`;
 const u=(px,rot)=>`url("data:image/svg+xml,${encodeURIComponent(svg(px,rot))}")`;
 const c=(px,rot,fb)=>{const h=px/2,a=u(px,rot),b=u(px*2,rot);return `cursor:${a} ${h} ${h},${fb}!important;cursor:-webkit-image-set(${a} 1x,${b} 2x) ${h} ${h},${fb}!important;cursor:image-set(${a} 1x,${b} 2x) ${h} ${h},${fb}!important;`};
 const st=document.createElement('style');
 st.textContent=`html,html *{${c(24,0,'auto')}}
button,label,select,.it,.th,.c,#jar,#bin,#gp,#pt,.pb2,.bt,input[type=color],input[type=range],.front{${c(30,14,'pointer')}}
html *:active:not(textarea):not([contenteditable]):not(#dc):not(#sig){${c(20,14,'pointer')}}
html textarea,html [contenteditable]{cursor:text!important}
#sig,body.draw #dc{cursor:crosshair!important}`;
 document.head.append(st);window.__cursorSvg=svg})();

/* ---------- init ---------- */
addEventListener('resize',()=>{document.querySelectorAll('.it').forEach(e=>place(e,get(e.dataset.id)));ppos();sizeC()});
pal.classList.toggle('fold',!!S.fold);sizeUI();binArt();render();ppos();sizeC();
