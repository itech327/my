/* généré par sync_defis.py : ne pas modifier ici */
(function(){
var PC=window.PC=window.PC||{};
function fmt(x,d){
  d=d===undefined?1:d;
  var s=(+x).toFixed(d);
  if(d>0&&s.indexOf('.')>-1)s=s.replace(/0+$/,'').replace(/\.$/,'');
  return s.replace('.',',').replace('-','−');
}
function clamp(x,a,b){return Math.min(b,Math.max(a,x))}
PC.fmt=fmt;PC.clamp=clamp;
PC.rnd=function(a,b){return a+Math.floor(Math.random()*(b-a+1))};
PC.pick=function(a){return a[Math.floor(Math.random()*a.length)]};
PC.shuffle=function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a};
var L=PC.lib=PC.lib||{};
var AT={H:{r:7,c:'#f2eff9',t:'#150f1c'},C:{r:11,c:'#8f88a8',t:'#150f1c'},O:{r:10,c:'#f27b60',t:'#150f1c'},N:{r:10,c:'#7fa7ff',t:'#150f1c'}};
var MOL={
 O2:{f:'O₂',n:'dioxygène',c:{O:2},a:[['O',-14,0],['O',14,0]],b:[[0,1]]},
 H2:{f:'H₂',n:'dihydrogène',c:{H:2},a:[['H',-10,0],['H',10,0]],b:[[0,1]]},
 N2:{f:'N₂',n:'diazote',c:{N:2},a:[['N',-14,0],['N',14,0]],b:[[0,1]]},
 H2O:{f:'H₂O',n:'eau',c:{H:2,O:1},a:[['O',0,-5],['H',-18,12],['H',18,12]],b:[[0,1],[0,2]]},
 CO2:{f:'CO₂',n:'dioxyde de carbone',c:{C:1,O:2},a:[['C',0,0],['O',-27,0],['O',27,0]],b:[[0,1],[0,2]]},
 CH4:{f:'CH₄',n:'méthane',c:{C:1,H:4},a:[['C',0,0],['H',0,-25],['H',0,25],['H',-25,0],['H',25,0]],b:[[0,1],[0,2],[0,3],[0,4]]},
 C:{f:'C',n:'carbone',c:{C:1},a:[['C',0,0]],b:[]},
 CO:{f:'CO',n:'monoxyde de carbone',c:{C:1,O:1},a:[['C',-12,0],['O',12,0]],b:[[0,1]]}
};
L.MOL=MOL;L.AT=AT;
})();
(function(){
'use strict';
var PC=window.PC,fmt=PC.fmt,R=PC.rnd,pick=PC.pick,MOL=PC.lib.MOL;
var G=PC.gen={};

function num(q,a,u,e,steps,hint,tol){
  var d=Math.abs(a)>=100?0:(Math.abs(a)>=10?1:3);
  return {t:'num',q:q,a:a,u:u||'',tol:tol===undefined?Math.max(.0006,Math.abs(a)*.004):tol,sol:fmt(a,d)+(u?' '+u:''),e:e,steps:steps||[],h:hint};
}
function f(x){return fmt(x,3)}

/* ---------- remise à niveau ---------- */
G.convm=function(s){
  var n,a;
  if(s===1){n=R(2,9);a=n*1000;return num('Convertis '+n+' kg en grammes.',a,'g','1 kg = 1000 g, donc '+n+' × 1000 = '+a+' g.',[['Je sais que','1 kg = 1000 g'],['Je calcule',n+' × 1000 = '+a],['Réponse',n+' kg = '+a+' g']],'1 kg = 1000 g.')}
  if(s===2){n=R(1,9)*500;a=n/1000;return num('Convertis '+n+' g en kilogrammes.',a,'kg','Pour passer des g aux kg on divise par 1000 : '+n+' ÷ 1000 = '+f(a)+' kg.',[['Je sais que','1000 g = 1 kg'],['Je divise par 1000',n+' ÷ 1000 = '+f(a)],['Réponse',n+' g = '+f(a)+' kg']],'Divise par 1000.')}
  n=pick([250,400,750,1200,1500,2500]);a=n/1000;
  return num('Convertis '+n+' mg en grammes.',a,'g','1 g = 1000 mg, donc '+n+' ÷ 1000 = '+f(a)+' g.',[['Je sais que','1 g = 1000 mg'],['Je divise par 1000',n+' ÷ 1000 = '+f(a)],['Réponse',n+' mg = '+f(a)+' g']],'1 g = 1000 mg.');
};
G.convl=function(s){
  var n,a;
  if(s===1){n=R(2,9);a=n*1000;return num('Convertis '+n+' L en millilitres.',a,'mL','1 L = 1000 mL, donc '+n+' × 1000 = '+a+' mL.',[['Je sais que','1 L = 1000 mL'],['Je calcule',n+' × 1000 = '+a],['Réponse',n+' L = '+a+' mL']],'1 L = 1000 mL.')}
  if(s===2){n=R(1,9)*250;a=n/1000;return num('Convertis '+n+' mL en litres.',a,'L','On divise par 1000 : '+n+' ÷ 1000 = '+f(a)+' L.',[['Je sais que','1000 mL = 1 L'],['Je divise par 1000',n+' ÷ 1000 = '+f(a)],['Réponse',n+' mL = '+f(a)+' L']],'Divise par 1000.')}
  n=pick([1.5,2.5,0.5,3.5]);a=n*1000;
  return num('Convertis '+fmt(n,1)+' L en cm³. (1 L = 1 dm³)',a,'cm³','1 L = 1 dm³ = 1000 cm³, donc '+fmt(n,1)+' × 1000 = '+a+' cm³.',[['Je sais que','1 L = 1 dm³ = 1000 cm³'],['Je calcule',fmt(n,1)+' × 1000 = '+a],['Réponse',fmt(n,1)+' L = '+a+' cm³']],'1 L = 1000 cm³.');
};
G.convt=function(s){
  var n,a;
  if(s===1){n=R(2,6);a=n*60;return num('Convertis '+n+' h en minutes.',a,'min','1 h = 60 min, donc '+n+' × 60 = '+a+' min.',[['Je sais que','1 h = 60 min'],['Je calcule',n+' × 60 = '+a],['Réponse',n+' h = '+a+' min']],'1 h = 60 min.')}
  if(s===2){n=pick([30,45,90,120,150]);a=n/60;return num('Convertis '+n+' min en heures.',a,'h','On divise par 60 : '+n+' ÷ 60 = '+f(a)+' h.',[['Je sais que','60 min = 1 h'],['Je divise par 60',n+' ÷ 60 = '+f(a)],['Réponse',n+' min = '+f(a)+' h']],'Divise par 60.')}
  var hh=R(1,3),mm=pick([15,30,45]);a=hh*60+mm;
  return num('Convertis '+hh+' h '+mm+' min en minutes.',a,'min',hh+' × 60 + '+mm+' = '+a+' min.',[['Je convertis les heures',hh+' h = '+hh*60+' min'],['J’ajoute les minutes',hh*60+' + '+mm+' = '+a],['Réponse',hh+' h '+mm+' min = '+a+' min']],'Convertis d’abord les heures en minutes.');
};
G.convd=function(s){
  var n,a;
  if(s===1){n=R(2,9);a=n*100;return num('Convertis '+n+' m en centimètres.',a,'cm','1 m = 100 cm, donc '+n+' × 100 = '+a+' cm.',[['Je sais que','1 m = 100 cm'],['Je calcule',n+' × 100 = '+a],['Réponse',n+' m = '+a+' cm']],'1 m = 100 cm.')}
  if(s===2){n=pick([1.5,2,2.5,3,4.2]);a=n*1000;return num('Convertis '+fmt(n,1)+' km en mètres.',a,'m','1 km = 1000 m, donc '+fmt(n,1)+' × 1000 = '+a+' m.',[['Je sais que','1 km = 1000 m'],['Je calcule',fmt(n,1)+' × 1000 = '+a],['Réponse',fmt(n,1)+' km = '+a+' m']],'1 km = 1000 m.')}
  n=pick([150,250,350,450,620]);a=n/100;
  return num('Convertis '+n+' cm en mètres.',a,'m','On divise par 100 : '+n+' ÷ 100 = '+f(a)+' m.',[['Je sais que','100 cm = 1 m'],['Je divise par 100',n+' ÷ 100 = '+f(a)],['Réponse',n+' cm = '+f(a)+' m']],'Divise par 100.');
};
G.prop=function(s){
  var C=pick([['cahiers','DH'],['kg de tomates','DH'],['L d’essence','DH']]),p=R(3,9),k=R(2,5),n=k*(s===1?1:2);
  var n2=s===1?k+R(2,4):(s===2?n+R(1,4)*k:(n+R(3,5)));
  if(s===3){k=pick([2.5,1.5]);n=k;p=pick([12,16,20]);n2=pick([4,6]);}
  var tot=s===3?p*k:p*n,res=s===3?p*n2:p*n2;
  if(s===3){return num(fmt(k,1)+' '+C[0]+' coûtent '+fmt(p*k,1)+' '+C[1]+'. Combien coûtent '+n2+' '+C[0]+' ?',res,C[1],'Prix de 1 : '+fmt(p*k,1)+' ÷ '+fmt(k,1)+' = '+p+' '+C[1]+'. Prix de '+n2+' : '+p+' × '+n2+' = '+res+' '+C[1]+'.',[['Prix d’une unité',fmt(p*k,1)+' ÷ '+fmt(k,1)+' = '+p],['Prix de '+n2,p+' × '+n2+' = '+res],['Réponse',res+' '+C[1]]],'Cherche d’abord le prix d’une unité.')}
  return num(n+' '+C[0]+' coûtent '+tot+' '+C[1]+'. Combien coûtent '+n2+' '+C[0]+' ?',res,C[1],'Prix de 1 : '+tot+' ÷ '+n+' = '+p+'. Prix de '+n2+' : '+p+' × '+n2+' = '+res+' '+C[1]+'.',[['Prix d’une unité',tot+' ÷ '+n+' = '+p],['Prix de '+n2,p+' × '+n2+' = '+res],['Réponse',res+' '+C[1]]],'Cherche d’abord le prix d’une unité.');
};
G.pct=function(s){
  var N=R(2,12)*20,p;
  if(s===1){p=pick([10,20,25,50]);var a=N*p/100;return num('Calcule '+p+' % de '+N+'.',a,'','On calcule '+N+' × '+p+' ÷ 100 = '+fmt(a,2)+'.',[['Je sais que',p+' % = '+p+' ÷ 100'],['Je calcule',N+' × '+p+' ÷ 100 = '+fmt(a,2)],['Réponse',fmt(a,2)]],'p % de N = N × p ÷ 100.')}
  if(s===2){p=pick([15,30,40,60,75]);var b=N*p/100;return num('Calcule '+p+' % de '+N+'.',b,'','N × p ÷ 100 = '+N+' × '+p+' ÷ 100 = '+fmt(b,2)+'.',[['Je sais que','p % de N = N × p ÷ 100'],['Je calcule',N+' × '+p+' ÷ 100 = '+fmt(b,2)],['Réponse',fmt(b,2)]],'p % de N = N × p ÷ 100.')}
  p=pick([10,20,25,30]);var fin=N*(100-p)/100;
  return num('Un article coûte '+N+' DH. Il est soldé avec '+p+' % de remise. Quel est le nouveau prix ?',fin,'DH','Remise : '+N+' × '+p+' ÷ 100 = '+fmt(N*p/100,2)+' DH. Nouveau prix : '+N+' − '+fmt(N*p/100,2)+' = '+fmt(fin,2)+' DH.',[['Je calcule la remise',N+' × '+p+' ÷ 100 = '+fmt(N*p/100,2)],['Je soustrais',N+' − '+fmt(N*p/100,2)+' = '+fmt(fin,2)],['Réponse',fmt(fin,2)+' DH']],'Calcule d’abord le montant de la remise.');
};

/* ---------- 1re année ---------- */
var RHO=[[.8,'alcool'],[2.7,'aluminium'],[7.9,'fer'],[8.9,'cuivre'],[11.3,'plomb']];
function dD(n){return /^[aeiouéh]/i.test(n)?'d’'+n:'de '+n}
function dDu(n){return /^[aeiouéh]/i.test(n)?'de l’'+n:'du '+n}
G.rho=function(s){
  var r=pick(RHO),V=pick([10,20,50,100]),m=Math.round(r[0]*V*10)/10;
  if(s===1)return num('Un bloc '+dD(r[1])+' a un volume de '+V+' cm³ et une masse de '+fmt(m,1)+' g. Calcule sa masse volumique en g/cm³.',r[0],'g/cm³','ρ = m ÷ V = '+fmt(m,1)+' ÷ '+V+' = '+fmt(r[0],1)+' g/cm³.',[['Formule','ρ = m ÷ V'],['Je remplace','ρ = '+fmt(m,1)+' ÷ '+V],['Résultat','ρ = '+fmt(r[0],1)+' g/cm³']],'ρ = m ÷ V.');
  if(s===2)return num('La masse volumique '+dDu(r[1])+' est '+fmt(r[0],1)+' g/cm³. Quelle est la masse de '+V+' cm³ '+dD(r[1])+' ?',m,'g','m = ρ × V = '+fmt(r[0],1)+' × '+V+' = '+fmt(m,1)+' g.',[['Formule','m = ρ × V'],['Je remplace','m = '+fmt(r[0],1)+' × '+V],['Résultat','m = '+fmt(m,1)+' g']],'m = ρ × V.');
  return num('Un objet en '+r[1]+' (ρ = '+fmt(r[0],1)+' g/cm³) a une masse de '+fmt(m/1000,3)+' kg. Quel est son volume en cm³ ?',V,'cm³','m = '+fmt(m/1000,3)+' kg = '+fmt(m,1)+' g. V = m ÷ ρ = '+fmt(m,1)+' ÷ '+fmt(r[0],1)+' = '+V+' cm³.',[['Je convertis','m = '+fmt(m,1)+' g'],['Formule','V = m ÷ ρ'],['Résultat','V = '+fmt(m,1)+' ÷ '+fmt(r[0],1)+' = '+V+' cm³']],'Convertis d’abord la masse en g, puis V = m ÷ ρ.');
};
G.node=function(s){
  var a=R(1,5)*.1,b=R(1,5)*.1;a=Math.round(a*100)/100;b=Math.round(b*100)/100;
  if(s===1)return num('Dans un nœud, I₁ = '+fmt(a,2)+' A et I₂ = '+fmt(b,2)+' A partent vers deux branches. Quelle est l’intensité I qui arrive ?',a+b,'A','I = I₁ + I₂ = '+fmt(a,2)+' + '+fmt(b,2)+' = '+fmt(a+b,2)+' A.',[['Loi des nœuds','I = I₁ + I₂'],['Je remplace','I = '+fmt(a,2)+' + '+fmt(b,2)],['Résultat','I = '+fmt(a+b,2)+' A']],'I = I₁ + I₂.');
  if(s===2)return num('Une intensité I = '+fmt(a+b,2)+' A arrive à un nœud. I₁ = '+fmt(a,2)+' A part dans une branche. Quelle est l’intensité I₂ dans l’autre branche ?',b,'A','I₂ = I − I₁ = '+fmt(a+b,2)+' − '+fmt(a,2)+' = '+fmt(b,2)+' A.',[['Loi des nœuds','I = I₁ + I₂'],['J’isole I₂','I₂ = I − I₁'],['Résultat','I₂ = '+fmt(a+b,2)+' − '+fmt(a,2)+' = '+fmt(b,2)+' A']],'I₂ = I − I₁.');
  return num('I = '+Math.round((a+b)*1000)+' mA arrive à un nœud et I₁ = '+fmt(a,2)+' A en repart. Calcule I₂ en mA.',Math.round(b*1000),'mA','I₁ = '+Math.round(a*1000)+' mA. I₂ = '+Math.round((a+b)*1000)+' − '+Math.round(a*1000)+' = '+Math.round(b*1000)+' mA.',[['Je convertis','I₁ = '+fmt(a,2)+' A = '+Math.round(a*1000)+' mA'],['Je soustrais','I₂ = '+Math.round((a+b)*1000)+' − '+Math.round(a*1000)],['Résultat','I₂ = '+Math.round(b*1000)+' mA']],'Mets toutes les valeurs dans la même unité.');
};
G.tens=function(s){
  var a=R(1,4)*1.5,b=R(1,4)*1.5,c=R(1,3)*1.5;
  if(s===1)return num('Deux lampes en série ont pour tensions U₁ = '+fmt(a,1)+' V et U₂ = '+fmt(b,1)+' V. Quelle est la tension U aux bornes de la pile ?',a+b,'V','U = U₁ + U₂ = '+fmt(a,1)+' + '+fmt(b,1)+' = '+fmt(a+b,1)+' V.',[['Additivité','U = U₁ + U₂'],['Je remplace','U = '+fmt(a,1)+' + '+fmt(b,1)],['Résultat','U = '+fmt(a+b,1)+' V']],'En série les tensions s’additionnent.');
  if(s===2)return num('Une pile de '+fmt(a+b,1)+' V alimente deux lampes en série. U₁ = '+fmt(a,1)+' V. Quelle est la tension U₂ ?',b,'V','U₂ = U − U₁ = '+fmt(a+b,1)+' − '+fmt(a,1)+' = '+fmt(b,1)+' V.',[['Additivité','U = U₁ + U₂'],['J’isole U₂','U₂ = U − U₁'],['Résultat','U₂ = '+fmt(b,1)+' V']],'U₂ = U − U₁.');
  return num('Trois lampes en série : U₁ = '+fmt(a,1)+' V, U₂ = '+fmt(b,1)+' V et U₃ = '+fmt(c,1)+' V. Quelle est la tension aux bornes de la pile ?',a+b+c,'V','U = U₁ + U₂ + U₃ = '+fmt(a+b+c,1)+' V.',[['Additivité','U = U₁ + U₂ + U₃'],['Je remplace','U = '+fmt(a,1)+' + '+fmt(b,1)+' + '+fmt(c,1)],['Résultat','U = '+fmt(a+b+c,1)+' V']],'Additionne les trois tensions.');
};

/* ---------- 2e année ---------- */
var ATM=[['H2O','H','hydrogène'],['H2O','O','oxygène'],['CO2','O','oxygène'],['CO2','C','carbone'],['CH4','H','hydrogène'],['CH4','C','carbone'],['O2','O','oxygène'],['H2','H','hydrogène'],['N2','N','azote']];
G.atoms=function(s){
  if(s===1){var k=pick(['H2O','CO2','CH4','O2']),d=MOL[k],tot=0;Object.keys(d.c).forEach(function(a){tot+=d.c[a]});
    return num('Combien d’atomes contient une molécule de '+d.f+' ?',tot,'atomes','Dans '+d.f+' : '+Object.keys(d.c).map(function(a){return d.c[a]+' '+a}).join(' + ')+' = '+tot+' atomes.',[['Je lis la formule',d.f+' : '+Object.keys(d.c).map(function(a){return d.c[a]+' atome(s) '+a}).join(', ')],['J’additionne',Object.keys(d.c).map(function(a){return d.c[a]}).join(' + ')+' = '+tot],['Réponse',tot+' atomes']],'Additionne les nombres de la formule.')}
  if(s===2){var r=pick(ATM),n=R(2,5),d2=MOL[r[0]],a2=d2.c[r[1]]*n;
    return num('Combien d’atomes de '+r[2]+' y a-t-il dans '+n+' '+d2.f+' ?',a2,'atomes',n+' × '+d2.c[r[1]]+' = '+a2+' atomes '+r[1]+'.',[['Dans 1 molécule',d2.c[r[1]]+' atome(s) '+r[1]],['Pour '+n+' molécules',n+' × '+d2.c[r[1]]+' = '+a2],['Réponse',a2+' atomes']],'Multiplie le coefficient par le nombre d’atomes de la formule.')}
  var n1=R(1,3),n2=R(1,3),t=2*n1+n2;
  return num('Combien d’atomes d’oxygène y a-t-il dans '+n1+' CO₂ + '+n2+' H₂O ?',t,'atomes','CO₂ : 2 × '+n1+' = '+2*n1+' ; H₂O : 1 × '+n2+' = '+n2+' ; total '+t+'.',[['Dans '+n1+' CO₂','2 × '+n1+' = '+2*n1],['Dans '+n2+' H₂O','1 × '+n2+' = '+n2],['Total',2*n1+' + '+n2+' = '+t+' atomes O']],'Compte séparément chaque molécule.');
};
G.mass=function(s){
  var a=R(2,9)*3,b=Math.round(a*8/3);
  if(s===1)return num('Dans une réaction, '+a+' g de carbone réagissent avec '+b+' g de dioxygène. Quelle masse de dioxyde de carbone se forme ?',a+b,'g','La masse se conserve : '+a+' + '+b+' = '+(a+b)+' g.',[['Loi de conservation','m(réactifs) = m(produits)'],['Je calcule',a+' + '+b+' = '+(a+b)],['Réponse',(a+b)+' g']],'La masse totale se conserve.');
  if(s===2)return num('On forme '+(a+b)+' g de dioxyde de carbone à partir de '+a+' g de carbone et de dioxygène. Quelle masse de dioxygène a été consommée ?',b,'g','m(O₂) = '+(a+b)+' − '+a+' = '+b+' g.',[['Loi de conservation','m(C) + m(O₂) = m(CO₂)'],['J’isole m(O₂)','m(O₂) = '+(a+b)+' − '+a],['Réponse',b+' g']],'Soustrais la masse de carbone.');
  var k=pick([2,3,4,5,6,8,10]);
  return num('6 g de carbone consomment 16 g de dioxygène. Quelle masse de dioxygène consomment '+6*k+' g de carbone ?',16*k,'g','Les masses sont proportionnelles : '+6*k+' g = '+k+' × 6 g, donc '+k+' × 16 = '+16*k+' g.',[['Je compare',6*k+' g de carbone = '+k+' × 6 g'],['Je multiplie',k+' × 16 g = '+16*k+' g'],['Réponse',16*k+' g de dioxygène']],'Cherche par combien on a multiplié la masse de carbone.');
};
G.air=function(s){
  var v;
  if(s===1){v=pick([25,50,75,100,125,150,175,200,250,300]);return num('Dans '+v+' L d’air, quel est le volume de dioxygène ? (environ 1/5 de l’air)',v/5,'L',v+' ÷ 5 = '+fmt(v/5,1)+' L.',[['Je sais que','O₂ ≈ 1/5 du volume de l’air'],['Je calcule',v+' ÷ 5 = '+fmt(v/5,1)],['Réponse',fmt(v/5,1)+' L']],'Divise par 5.')}
  if(s===2){v=pick([1,2,3,4,5,6,8,10,12,15]);return num('Une pièce contient '+v+' m³ de dioxygène. Quel est le volume d’air correspondant ? (O₂ ≈ 1/5 de l’air)',v*5,'m³','Le volume d’air est 5 fois plus grand : '+v+' × 5 = '+v*5+' m³.',[['Je sais que','V(O₂) = V(air) ÷ 5'],['Donc','V(air) = V(O₂) × 5'],['Réponse',v*5+' m³']],'V(air) = 5 × V(O₂).')}
  v=pick([10,20,30,40,50,60,70,80,90,100]);return num('Un récipient de '+v+' L d’air est placé sous une cloche et on y brûle une bougie. Quel volume de dioxygène a été consommé au maximum ?',v/5,'L','Environ 1/5 du volume : '+v+' ÷ 5 = '+v/5+' L.',[['Je sais que','O₂ ≈ 1/5 de l’air'],['Je calcule',v+' ÷ 5 = '+v/5],['Réponse',v/5+' L']],'Prends 1/5 du volume d’air.');
};
G.shadow=function(s){
  var d,D,hh,H;
  if(s===1){d=10;D=pick([20,30,40]);hh=pick([2,3,4,5]);H=hh*D/d;return num('Un objet de hauteur '+hh+' cm est à '+d+' cm d’une source ponctuelle. L’écran est à '+D+' cm de la source. Quelle est la hauteur de l’ombre ?',H,'cm','H = h × D ÷ d = '+hh+' × '+D+' ÷ '+d+' = '+H+' cm.',[['Formule (Thalès)','H = h × D ÷ d'],['Je remplace','H = '+hh+' × '+D+' ÷ '+d],['Résultat','H = '+H+' cm']],'H = h × D ÷ d.')}
  if(s===2){d=pick([5,10,20]);D=d*pick([2,3,4]);hh=pick([2,3,5]);H=hh*D/d;return num('L’ombre d’un objet mesure '+H+' cm sur un écran à '+D+' cm de la source. L’objet est à '+d+' cm de la source. Quelle est sa hauteur ?',hh,'cm','h = H × d ÷ D = '+H+' × '+d+' ÷ '+D+' = '+hh+' cm.',[['Formule','H = h × D ÷ d'],['J’isole h','h = H × d ÷ D'],['Résultat','h = '+H+' × '+d+' ÷ '+D+' = '+hh+' cm']],'h = H × d ÷ D.')}
  d=20;D=50;hh=pick([2,4,6,8,10,12]);H=hh*D/d;return num('Un objet de '+hh+' cm est à '+d+' cm de la source, l’écran à '+D+' cm. Quelle est la hauteur de l’ombre ?',H,'cm','H = '+hh+' × '+D+' ÷ '+d+' = '+H+' cm.',[['Formule','H = h × D ÷ d'],['Je remplace','H = '+hh+' × '+D+' ÷ '+d],['Résultat','H = '+H+' cm']],'H = h × D ÷ d.');
};

/* ---------- 3e année ---------- */
G.speed=function(s){
  var t=pick([1,2,3,4,5]),v=pick([40,50,60,80,90]),d=v*t;
  if(s===1)return num('Une voiture parcourt '+d+' km en '+t+' h. Quelle est sa vitesse moyenne en km/h ?',v,'km/h','v = d ÷ t = '+d+' ÷ '+t+' = '+v+' km/h.',[['Formule','v = d ÷ t'],['Je remplace','v = '+d+' ÷ '+t],['Résultat','v = '+v+' km/h']],'v = d ÷ t.');
  if(s===2)return num('Un train roule à '+v+' km/h pendant '+t+' h. Quelle distance parcourt-il ?',d,'km','d = v × t = '+v+' × '+t+' = '+d+' km.',[['Formule','d = v × t'],['Je remplace','d = '+v+' × '+t],['Résultat','d = '+d+' km']],'d = v × t.');
  var t2=pick([.5,1.5,2.5]),d3=v*t2;
  return num('Un cycliste roule à '+v+' km/h. Combien de temps met-il pour parcourir '+fmt(d3,0)+' km ? (en heures)',t2,'h','t = d ÷ v = '+fmt(d3,0)+' ÷ '+v+' = '+fmt(t2,1)+' h.',[['Formule','t = d ÷ v'],['Je remplace','t = '+fmt(d3,0)+' ÷ '+v],['Résultat','t = '+fmt(t2,1)+' h']],'t = d ÷ v.');
};
G.kmh=function(s){
  var a;
  if(s===1){a=pick([5,10,15,20,25]);return num('Convertis '+a+' m/s en km/h.',a*3.6,'km/h','1 m/s = 3,6 km/h : '+a+' × 3,6 = '+fmt(a*3.6,1)+' km/h.',[['Je sais que','1 m/s = 3,6 km/h'],['Je multiplie par 3,6',a+' × 3,6 = '+fmt(a*3.6,1)],['Réponse',fmt(a*3.6,1)+' km/h']],'Multiplie par 3,6.')}
  if(s===2){a=pick([36,54,72,90,108]);return num('Convertis '+a+' km/h en m/s.',a/3.6,'m/s','On divise par 3,6 : '+a+' ÷ 3,6 = '+fmt(a/3.6,1)+' m/s.',[['Je sais que','1 m/s = 3,6 km/h'],['Je divise par 3,6',a+' ÷ 3,6 = '+fmt(a/3.6,1)],['Réponse',fmt(a/3.6,1)+' m/s']],'Divise par 3,6.')}
  var d=pick([100,200,300]),t=pick([10,20,25]);
  return num('Un coureur parcourt '+d+' m en '+t+' s. Quelle est sa vitesse moyenne en m/s ?',d/t,'m/s','v = d ÷ t = '+d+' ÷ '+t+' = '+fmt(d/t,1)+' m/s.',[['Formule','v = d ÷ t'],['Je remplace','v = '+d+' ÷ '+t],['Résultat','v = '+fmt(d/t,1)+' m/s']],'v = d ÷ t, avec d en m et t en s.');
};
G.weight=function(s){
  var m=R(2,12),pl;
  if(s===1)return num('Quel est le poids d’un objet de '+m+' kg sur Terre ? (g = 10 N/kg)',m*10,'N','P = m × g = '+m+' × 10 = '+m*10+' N.',[['Formule','P = m × g'],['Je remplace','P = '+m+' × 10'],['Résultat','P = '+m*10+' N']],'P = m × g.');
  if(s===2){var P=m*10;return num('Un objet a un poids de '+P+' N sur Terre (g = 10 N/kg). Quelle est sa masse ?',m,'kg','m = P ÷ g = '+P+' ÷ 10 = '+m+' kg.',[['Formule','P = m × g'],['J’isole m','m = P ÷ g'],['Résultat','m = '+P+' ÷ 10 = '+m+' kg']],'m = P ÷ g.')}
  pl=pick([['la Lune',1.6],['Mars',3.7]]);
  return num('Quel est le poids d’un objet de '+m+' kg sur '+pl[0]+' ? (g = '+fmt(pl[1],1)+' N/kg)',m*pl[1],'N','P = m × g = '+m+' × '+fmt(pl[1],1)+' = '+fmt(m*pl[1],1)+' N.',[['Formule','P = m × g'],['Je remplace','P = '+m+' × '+fmt(pl[1],1)],['Résultat','P = '+fmt(m*pl[1],1)+' N']],'Utilise la valeur de g de l’astre.');
};
G.ohm=function(s){
  var R1=pick([20,40,50,100,200]),I=pick([.05,.1,.2,.25]),U=Math.round(R1*I*100)/100;
  if(s===1)return num('Un conducteur ohmique de '+R1+' Ω est traversé par un courant de '+fmt(I,2)+' A. Quelle est la tension à ses bornes ?',U,'V','U = R × I = '+R1+' × '+fmt(I,2)+' = '+fmt(U,2)+' V.',[['Loi d’Ohm','U = R × I'],['Je remplace','U = '+R1+' × '+fmt(I,2)],['Résultat','U = '+fmt(U,2)+' V']],'U = R × I.');
  if(s===2)return num('La tension aux bornes d’un conducteur de '+R1+' Ω est '+fmt(U,2)+' V. Quelle est l’intensité du courant en A ?',I,'A','I = U ÷ R = '+fmt(U,2)+' ÷ '+R1+' = '+fmt(I,2)+' A.',[['Loi d’Ohm','U = R × I'],['J’isole I','I = U ÷ R'],['Résultat','I = '+fmt(U,2)+' ÷ '+R1+' = '+fmt(I,2)+' A']],'I = U ÷ R.');
  var Rr=pick([100,150,300,450]),Im=pick([20,30,40]),Uu=Rr*Im/1000;
  return num('Un conducteur est soumis à '+fmt(Uu,2)+' V et traversé par '+Im+' mA. Calcule sa résistance en Ω.',Rr,'Ω','I = '+Im+' mA = '+fmt(Im/1000,3)+' A. R = U ÷ I = '+fmt(Uu,2)+' ÷ '+fmt(Im/1000,3)+' = '+Rr+' Ω.',[['Je convertis','I = '+Im+' mA = '+fmt(Im/1000,3)+' A'],['Formule','R = U ÷ I'],['Résultat','R = '+fmt(Uu,2)+' ÷ '+fmt(Im/1000,3)+' = '+Rr+' Ω']],'Convertis I en ampères avant de calculer.');
};
G.power=function(s){
  var U=pick([12,110,220,230]),I=pick([.5,1,2,4,5]),P=U*I;
  if(s===1)return num('Un appareil fonctionne sous '+U+' V avec une intensité de '+fmt(I,1)+' A. Quelle est sa puissance ?',P,'W','P = U × I = '+U+' × '+fmt(I,1)+' = '+fmt(P,0)+' W.',[['Formule','P = U × I'],['Je remplace','P = '+U+' × '+fmt(I,1)],['Résultat','P = '+fmt(P,0)+' W']],'P = U × I.');
  if(s===2)return num('Un appareil de '+fmt(P,0)+' W fonctionne sous '+U+' V. Quelle est l’intensité du courant ?',I,'A','I = P ÷ U = '+fmt(P,0)+' ÷ '+U+' = '+fmt(I,1)+' A.',[['Formule','P = U × I'],['J’isole I','I = P ÷ U'],['Résultat','I = '+fmt(P,0)+' ÷ '+U+' = '+fmt(I,1)+' A']],'I = P ÷ U.');
  var Pk=pick([.5,1,1.5,2]),h2=pick([2,3,4,5]);
  return num('Un appareil de '+fmt(Pk,1)+' kW fonctionne '+h2+' h. Quelle énergie consomme-t-il en kWh ?',Pk*h2,'kWh','E = P × t = '+fmt(Pk,1)+' × '+h2+' = '+fmt(Pk*h2,1)+' kWh.',[['Formule','E = P × t'],['Je remplace','E = '+fmt(Pk,1)+' kW × '+h2+' h'],['Résultat','E = '+fmt(Pk*h2,1)+' kWh']],'E = P × t, avec P en kW et t en h.');
};
G.energy=G.power;
})();
(function(){
'use strict';
var PC=window.PC;
var B=PC.bank={};
/* [niveau, question, options, indice de la bonne réponse, explication] */

/* ---------- 1re année ---------- */
B.eau={look:['L’eau du robinet est un <b>mélange</b> : elle contient de l’eau et des sels minéraux dissous.','On rend l’eau potable en la traitant : <b>décantation</b>, <b>filtration</b>, puis <b>désinfection</b> (chlore).'],
 q:[
 [1,'L’eau du robinet est :',['un corps pur','un mélange','un gaz'],1,'Elle contient des sels minéraux dissous.'],
 [1,'Pour retirer les grosses particules d’une eau trouble, on la laisse :',['bouillir','décanter','geler'],1,'La décantation laisse les particules se déposer au fond.'],
 [2,'Le filtre retient :',['les particules solides en suspension','les sels dissous','le dioxygène'],0,'Les sels dissous passent à travers le filtre.'],
 [2,'On ajoute du chlore à l’eau pour :',['lui donner un goût','tuer les microbes','la rendre plus froide'],1,'C’est l’étape de désinfection.'],
 [3,'L’eau distillée est :',['un corps pur','un mélange homogène','un mélange hétérogène'],0,'Elle ne contient que de l’eau.'],
 [3,'On ne peut pas boire l’eau de mer directement car elle :',['est trop froide','contient trop de sels dissous','est un gaz'],1,'Les sels dissous la rendent impropre à la consommation.']],
 ar:'ماء الحنفية <b>خليط</b> لأنه يحتوي على الماء وأملاح معدنية ذائبة. لجعل الماء صالحاً للشرب نعالجه بالتصفيق (decantation) ثم الترشيح (filtration) ثم التعقيم بالكلور.',
 w:[['eau potable','ماء صالح للشرب'],['décantation','تصفيق'],['filtration','ترشيح'],['désinfection','تعقيم']]};

B.etat={look:['Solide : forme et volume propres. Liquide : volume propre, forme du récipient. Gaz : ni forme ni volume propres.','<b>Fusion</b> solide → liquide ; <b>solidification</b> liquide → solide ; <b>vaporisation</b> liquide → gaz ; <b>liquéfaction</b> gaz → liquide.','Pendant un changement d’état d’un corps pur, la température reste <b>constante</b>.'],
 q:[
 [1,'Un liquide :',['a une forme propre','prend la forme de son récipient','est toujours compressible'],1,'Il garde son volume mais pas sa forme.'],
 [1,'Le passage de l’état liquide à l’état solide s’appelle :',['la fusion','la solidification','la vaporisation'],1,'C’est le contraire de la fusion.'],
 [2,'La glace fond à :',['0 °C','10 °C','100 °C'],0,'La température de fusion de la glace est 0 °C.'],
 [2,'Un gaz est :',['non compressible','compressible','toujours coloré'],1,'On peut diminuer son volume en le comprimant.'],
 [3,'Pendant l’ébullition de l’eau, la température :',['augmente','reste à 100 °C','diminue'],1,'Il y a un palier de température.'],
 [3,'Le passage direct de l’état solide à l’état gazeux est :',['la sublimation','la liquéfaction','la fusion'],0,'Exemple : la naphtaline.']],
 ar:'للمادة ثلاث حالات: صلبة وسائلة وغازية. الانصهار: صلب ← سائل، التجمّد: سائل ← صلب، التبخّر: سائل ← غاز، التسييل: غاز ← سائل. وخلال تحول الحالة تبقى الحرارة ثابتة.',
 w:[['fusion','انصهار'],['solidification','تجمّد'],['vaporisation','تبخّر'],['liquéfaction','تسييل'],['palier','هضبة (حرارة ثابتة)']]};

B.part={look:['Dans un <b>solide</b> les particules sont serrées et ordonnées. Dans un <b>liquide</b> elles sont serrées et désordonnées. Dans un <b>gaz</b> elles sont éloignées et très agitées.','Quand on <b>chauffe</b>, l’agitation des particules augmente.'],
 q:[
 [1,'Dans un solide, les particules sont :',['serrées et ordonnées','éloignées','très agitées'],0,'Elles vibrent sur place.'],
 [1,'Quand on chauffe un liquide, l’agitation de ses particules :',['augmente','diminue','ne change pas'],0,'Plus la température est élevée, plus l’agitation est grande.'],
 [2,'Un gaz est compressible car ses particules sont :',['très éloignées les unes des autres','collées','immobiles'],0,'Il y a beaucoup de vide entre elles.'],
 [2,'Une goutte d’encre se répartit dans l’eau car :',['les particules sont agitées','l’encre est plus lourde','l’eau est froide'],0,'L’agitation des particules provoque la diffusion.'],
 [3,'Lors d’un changement d’état, les particules :',['changent de nature','gardent leur nature, seul leur arrangement change','disparaissent'],1,'La nature des particules ne change pas.'],
 [3,'Quand l’eau gèle dans un récipient fermé, la masse :',['augmente','se conserve','diminue'],1,'La masse se conserve lors d’un changement d’état.']],
 ar:'في الحالة الصلبة تكون الدقائق متراصة ومنتظمة، وفي السائلة متراصة وغير منتظمة، وفي الغازية متباعدة وسريعة الحركة. كلما ارتفعت الحرارة زادت حركة الدقائق. وخلال تغير الحالة لا تتغير طبيعة الدقائق وتنحفظ الكتلة.',
 w:[['particule','دقيقة'],['agitation','حركة (اهتزاز)'],['diffusion','انتشار (تفشي)'],['compressible','قابل للانضغاط']]};

B.mel={look:['Un mélange <b>homogène</b> : on ne distingue pas ses constituants à l’œil nu (eau sucrée, air).','Un mélange <b>hétérogène</b> : on distingue plusieurs constituants (eau et huile, eau et sable).','Un <b>corps pur</b> ne contient qu’une seule espèce chimique.'],
 q:[
 [1,'L’eau sucrée est un mélange :',['homogène','hétérogène','gazeux'],0,'On ne voit plus le sucre.'],
 [1,'Un mélange d’eau et d’huile est :',['homogène','hétérogène','un corps pur'],1,'On distingue deux phases.'],
 [2,'Dans un mélange homogène, on distingue ses constituants :',['à l’œil nu','pas à l’œil nu','au toucher'],1,'Il n’a qu’une seule phase visible.'],
 [2,'Le sable dans l’eau forme un mélange :',['homogène','hétérogène','pur'],1,'Le sable se voit et se dépose.'],
 [3,'L’air est :',['un corps pur','un mélange homogène de gaz','un liquide'],1,'Il est formé de plusieurs gaz.'],
 [3,'Un corps pur est constitué :',['d’une seule espèce chimique','de plusieurs espèces chimiques','de sel et d’eau'],0,'Exemple : l’eau distillée.']],
 ar:'الخليط المتجانس لا نميّز مكوناته بالعين المجردة (ماء وسكر، الهواء). الخليط غير المتجانس نميّز مكوناته (ماء وزيت، ماء ورمل). الجسم الخالص يتكوّن من نوع كيميائي واحد.',
 w:[['mélange homogène','خليط متجانس'],['mélange hétérogène','خليط غير متجانس'],['corps pur','جسم خالص'],['constituant','مكوّن']]};

B.sep={look:['<b>Filtration</b> : sépare un solide d’un liquide. <b>Décantation</b> : sépare deux liquides non miscibles. <b>Évaporation</b> : récupère le solide dissous. <b>Distillation</b> : sépare des liquides selon leurs températures d’ébullition.'],
 q:[
 [1,'Pour séparer le sable de l’eau on utilise :',['la filtration','la distillation','l’évaporation'],0,'Le filtre retient le sable.'],
 [1,'Pour séparer l’eau et l’huile on utilise :',['la décantation','la filtration','l’évaporation'],0,'On utilise l’ampoule à décanter.'],
 [2,'Pour récupérer le sel d’une eau salée, on peut :',['filtrer','laisser l’eau s’évaporer','décanter'],1,'L’eau s’évapore, le sel reste.'],
 [2,'La distillation sépare les constituants selon :',['leur couleur','leur température d’ébullition','leur masse'],1,'Chaque liquide bout à une température différente.'],
 [3,'Le liquide recueilli après filtration s’appelle :',['le filtrat','le résidu','le précipité'],0,'Le résidu est ce qui reste sur le filtre.'],
 [3,'Dans l’ampoule à décanter, l’huile se place :',['au-dessus de l’eau','au-dessous de l’eau','au milieu'],0,'L’huile est moins dense que l’eau.']],
 ar:'الترشيح يفصل صلباً عن سائل. التصفيق (بواسطة قمع الفصل) يفصل سائلين غير ممتزجين. التبخير يسمح باسترجاع المادة الصلبة الذائبة. التقطير يفصل السوائل حسب درجات غليانها.',
 w:[['filtration','ترشيح'],['décantation','تصفيق'],['évaporation','تبخير'],['distillation','تقطير'],['résidu','راسب (ما يبقى على المرشح)']]};

B.circ={look:['Un circuit simple : <b>pile</b> (générateur), <b>lampe</b> (récepteur), fils, parfois un <b>interrupteur</b>.','Le courant circule seulement si le circuit est <b>fermé</b>.','Sens conventionnel : de la borne <b>+</b> vers la borne <b>−</b> à l’extérieur de la pile.'],
 q:[
 [1,'La lampe s’allume si le circuit est :',['ouvert','fermé','coupé'],1,'Il faut un circuit fermé.'],
 [1,'Dans un circuit simple, la pile est :',['le générateur','le récepteur','un isolant'],0,'Elle fournit l’énergie électrique.'],
 [2,'Quand l’interrupteur est ouvert :',['la lampe brille','le courant ne passe pas','la pile se recharge'],1,'Le circuit est ouvert.'],
 [2,'Le sens conventionnel du courant, hors de la pile, va de :',['− vers +','+ vers −','gauche vers droite'],1,'De la borne + vers la borne −.'],
 [3,'Un fil qui relie directement les deux bornes d’une pile provoque :',['un court-circuit dangereux','une lampe plus brillante','rien'],0,'Le courant est très grand : risque d’échauffement.'],
 [3,'La lampe est :',['un générateur','un récepteur','un interrupteur'],1,'Elle reçoit de l’énergie électrique.']],
 ar:'الدارة البسيطة: عمود (مولّد) ومصباح (مستقبل) وأسلاك وقاطع. يمر التيار فقط إذا كانت الدارة مغلقة. اتجاه التيار الاصطلاحي خارج المولّد من القطب + إلى القطب −.',
 w:[['circuit fermé','دارة مغلقة'],['générateur','مولّد'],['récepteur','مستقبل'],['court-circuit','دارة قصيرة (تماس)']]};

B.cond={look:['<b>Conducteurs</b> : métaux, graphite, eau salée. <b>Isolants</b> : plastique, bois sec, verre, caoutchouc.','Le corps humain est conducteur : il faut éviter tout contact avec le courant du secteur.'],
 q:[
 [1,'Le cuivre est :',['un conducteur','un isolant','un gaz'],0,'Les métaux conduisent le courant.'],
 [1,'Le plastique est :',['un conducteur','un isolant','un métal'],1,'Il ne laisse pas passer le courant.'],
 [2,'L’eau salée est :',['conductrice','isolante','un métal'],0,'Les ions transportent le courant.'],
 [2,'Les fils électriques sont recouverts de plastique pour :',['les isoler','les alourdir','les colorer seulement'],0,'Le plastique est isolant.'],
 [3,'Il est dangereux de toucher un appareil avec les mains mouillées car :',['l’eau est conductrice','l’eau est froide','l’eau est isolante'],0,'L’eau (surtout salée ou du robinet) conduit le courant.'],
 [3,'Le corps humain est :',['conducteur','isolant','toujours protégé'],0,'Un courant peut le traverser et être dangereux.']],
 ar:'الموصلات: الفلزات والغرافيت والماء المالح. العوازل: البلاستيك والخشب الجاف والزجاج والمطاط. جسم الإنسان موصل للكهرباء، لذلك يجب تجنب لمس التيار الكهربائي.',
 w:[['conducteur','موصل'],['isolant','عازل'],['mains mouillées','أيدٍ مبللة'],['danger','خطر']]};

B.res={look:['Plus la <b>résistance</b> d’un circuit est grande, plus l’<b>intensité</b> du courant est petite (pour la même pile).','La résistance se mesure en <b>ohms (Ω)</b>.'],
 q:[
 [1,'L’unité de la résistance est :',['le volt','l’ohm','l’ampère'],1,'L’ohm, de symbole Ω.'],
 [1,'Si on augmente la résistance, l’intensité du courant :',['augmente','diminue','ne change pas'],1,'Avec la même pile, I diminue.'],
 [2,'On mesure l’intensité avec :',['un voltmètre','un ampèremètre','un ohmmètre'],1,'L’ampèremètre se place en série.'],
 [2,'Une lampe brille moins quand on ajoute une résistance en série car :',['l’intensité diminue','la pile est vide','la tension augmente'],0,'Le courant est plus faible.'],
 [3,'L’ampèremètre se branche :',['en série','en dérivation','n’importe comment'],0,'Le courant doit le traverser.'],
 [3,'Un fil très fin et très long a une résistance :',['plus grande','plus petite','nulle'],0,'La résistance augmente avec la longueur et diminue avec la section.']],
 ar:'كلما كبرت مقاومة الدارة صغرت شدة التيار. وحدة المقاومة الأوم (Ω). يُركَّب الأمبيرمتر على التوالي في الدارة.',
 w:[['résistance','مقاومة'],['ampèremètre','أمبيرمتر'],['intensité','شدة التيار'],['ohm','أوم']]};

B.secu={look:['Règles de sécurité : ne pas toucher aux fils dénudés, ne pas utiliser d’appareil électrique avec les mains mouillées, utiliser des prises protégées.','Le <b>fusible</b> et le <b>disjoncteur</b> coupent le courant en cas de surintensité.'],
 q:[
 [1,'Un fusible sert à :',['couper le courant en cas de surintensité','augmenter la tension','éclairer'],0,'Il protège l’installation.'],
 [1,'Avec les mains mouillées, on :',['peut toucher une prise','ne doit pas toucher un appareil électrique','doit débrancher avec le pied'],1,'C’est dangereux.'],
 [2,'Un fil dénudé est :',['sans danger','dangereux','toujours isolé'],1,'Il n’est plus protégé par la gaine.'],
 [2,'Le disjoncteur :',['ouvre le circuit en cas de problème','augmente l’intensité','remplace la lampe'],0,'Il coupe automatiquement le courant.'],
 [3,'Un court-circuit provoque :',['une intensité très grande','une intensité nulle','une tension infinie'],0,'Risque d’échauffement et d’incendie.'],
 [3,'Que faire si une personne est électrisée ?',['la toucher tout de suite','couper le courant avant de l’aider','lui jeter de l’eau'],1,'On coupe le courant d’abord, puis on appelle les secours.']],
 ar:'قواعد السلامة: لا تلمس الأسلاك العارية ولا تستعمل جهازاً كهربائياً بأيدٍ مبللة. الصهيرة (fusible) والقاطع التلقائي (disjoncteur) يقطعان التيار عند ارتفاع الشدة. إذا تعرّض شخص للصعق فاقطع التيار أولاً.',
 w:[['fusible','منصهر'],['disjoncteur','قاطع تلقائي'],['court-circuit','تماس (دارة قصيرة)'],['électrisation','صعق كهربائي']]};

/* ---------- 2e année ---------- */
B.air={look:['L’air est un <b>mélange</b> : 4/5 de diazote et 1/5 de dioxygène (environ).','Le dioxygène <b>entretient</b> la combustion ; le diazote ne l’entretient pas.','L’air a une masse : 1 L d’air pèse environ 1,2 g.'],
 q:[
 [1,'L’air est :',['un corps pur','un mélange de gaz','un liquide'],1,'Il contient du diazote, du dioxygène, etc.'],
 [1,'Quelle fraction de l’air est du dioxygène ?',['environ 1/5','environ 1/2','environ 4/5'],0,'21 % ≈ 1/5.'],
 [2,'Quel gaz entretient la combustion ?',['le diazote','le dioxygène','l’argon'],1,'C’est le comburant.'],
 [2,'1 L d’air a une masse d’environ :',['0,012 g','1,2 g','120 g'],1,'L’air a une masse, faible mais non nulle.'],
 [3,'On comprime l’air dans une seringue bouchée : son volume :',['diminue','augmente','ne change pas'],0,'L’air est compressible.'],
 [3,'Le diazote est un gaz qui :',['n’entretient pas la combustion','brûle très bien','est toxique'],0,'Il ne réagit presque pas.']],
 ar:'الهواء خليط: حوالي 4/5 من ثنائي الأزوت و1/5 من ثنائي الأكسجين. ثنائي الأكسجين يساعد على الاحتراق. للهواء كتلة: لتر من الهواء كتلته حوالي 1,2 غ، وهو قابل للانضغاط.',
 w:[['air','هواء'],['diazote','ثنائي الأزوت'],['dioxygène','ثنائي الأكسجين'],['comburant','مادة مؤكسِدة']]};

B.mol={look:['La matière est formée de <b>molécules</b> faites d’<b>atomes</b>.','Une formule indique les atomes de la molécule : <span class="math">H₂O</span> = 2 H + 1 O.','Corps pur <b>simple</b> : un seul type d’atome. Corps pur <b>composé</b> : plusieurs types.'],
 q:[
 [1,'La molécule d’eau H₂O contient :',['2 atomes de H et 1 atome de O','1 atome de H et 2 atomes de O','3 atomes de H'],0,'H₂ : deux atomes d’hydrogène.'],
 [1,'Le dioxygène a pour formule :',['O','O₂','O₃'],1,'Il est formé de deux atomes d’oxygène.'],
 [2,'CO₂ est :',['un corps pur simple','un corps pur composé','un atome'],1,'Il contient C et O.'],
 [2,'Le nombre d’atomes dans une molécule de CH₄ est :',['4','5','6'],1,'1 C + 4 H = 5.'],
 [3,'Le coefficient 3 dans 3 H₂O indique :',['3 atomes','3 molécules','3 grammes'],1,'On a trois molécules d’eau.'],
 [3,'Le diazote N₂ est :',['un corps pur simple','un corps pur composé','un mélange'],0,'Un seul type d’atome.']],
 ar:'المادة مكوّنة من جزيئات، والجزيئات مكوّنة من ذرات. الصيغة H₂O تعني ذرتين من الهيدروجين وذرة أكسجين. الجسم الخالص البسيط يحتوي نوعاً واحداً من الذرات، والمركّب يحتوي عدة أنواع.',
 w:[['atome','ذرة'],['molécule','جزيء'],['formule','صيغة'],['corps pur simple','جسم خالص بسيط']]};

B.comb={look:['Combustion = <b>combustible + comburant (O₂) + énergie</b>.','CO₂ trouble l’<b>eau de chaux</b>. L’eau bleuit le <b>sulfate de cuivre anhydre</b>.','Combustion incomplète : du <b>monoxyde de carbone CO</b>, gaz toxique.'],
 q:[
 [1,'Pour qu’il y ait combustion il faut :',['combustible, comburant et énergie','seulement un combustible','seulement de l’air'],0,'Les trois éléments sont nécessaires.'],
 [1,'Le comburant dans l’air est :',['le dioxygène','le diazote','l’eau'],0,'Le dioxygène.'],
 [2,'Le CO₂ trouble :',['l’eau de chaux','le sulfate de cuivre','l’eau salée'],0,'Test d’identification du CO₂.'],
 [2,'Pour éteindre un feu de poêle d’huile, on :',['jette de l’eau','le couvre avec un couvercle','souffle dessus'],1,'On supprime le comburant.'],
 [3,'Une combustion incomplète produit :',['du monoxyde de carbone, gaz toxique','seulement de l’eau','du diazote'],0,'D’où l’importance d’aérer.'],
 [3,'La combustion du méthane forme :',['CO₂ et H₂O','O₂ et N₂','H₂ seulement'],0,'CH₄ + 2 O₂ → CO₂ + 2 H₂O.']],
 ar:'الاحتراق يحتاج إلى وقود ومادة مؤكسِدة (ثنائي الأكسجين) وطاقة. ثنائي أوكسيد الكربون يعكّر ماء الجير، والماء يحوّل كبريتات النحاس اللامائية إلى الأزرق. الاحتراق غير التام يعطي غاز CO السام.',
 w:[['combustion','احتراق'],['eau de chaux','ماء الجير'],['sulfate de cuivre anhydre','كبريتات النحاس اللامائية'],['monoxyde de carbone','أحادي أوكسيد الكربون']]};

B.lum={look:['Dans un milieu <b>transparent et homogène</b>, la lumière se propage en <b>ligne droite</b>.','Source primaire : produit de la lumière (Soleil, lampe). Objet diffusant : renvoie la lumière reçue (Lune).','<b>Éclipse de Soleil</b> : la Lune est entre le Soleil et la Terre.'],
 q:[
 [1,'Dans un milieu transparent et homogène, la lumière se propage :',['en ligne droite','en courbe','en cercle'],0,'Propagation rectiligne.'],
 [1,'Un objet opaque :',['laisse passer toute la lumière','ne laisse pas passer la lumière','produit de la lumière'],1,'Il forme une ombre.'],
 [2,'Une source primaire de lumière est :',['la Lune','le Soleil','un miroir'],1,'Le Soleil produit sa lumière.'],
 [2,'Une éclipse de Soleil se produit quand :',['la Lune est entre le Soleil et la Terre','la Terre est entre le Soleil et la Lune','le Soleil s’éteint'],0,'La Lune cache le Soleil.'],
 [3,'Une chambre noire donne une image :',['renversée','droite et agrandie','colorée en rouge'],0,'Les rayons se croisent au trou.'],
 [3,'La lumière se propage dans le vide à environ :',['300 000 km/s','340 m/s','300 km/h'],0,'C’est la vitesse de la lumière.']],
 ar:'ينتشر الضوء في خط مستقيم داخل وسط شفاف ومتجانس. المصدر الأولي ينتج الضوء (الشمس، المصباح). كسوف الشمس يحدث عندما يمر القمر بين الشمس والأرض. سرعة الضوء في الفراغ حوالي 300 000 km/s.',
 w:[['propagation rectiligne','انتشار مستقيم'],['source primaire','مصدر أولي'],['opaque','معتم'],['éclipse','كسوف / خسوف']]};

B.col={look:['La lumière blanche est <b>décomposée</b> par un prisme : c’est la <b>dispersion</b>.','Couleurs primaires de la lumière : <b>rouge, vert, bleu</b>. R + V = jaune ; V + B = cyan ; R + B = magenta ; R + V + B = blanc.'],
 q:[
 [1,'Un prisme décompose :',['la lumière blanche','la lumière rouge','la lumière du noir'],0,'Il disperse la lumière blanche.'],
 [1,'Les trois couleurs primaires de la lumière sont :',['rouge, vert, bleu','rouge, jaune, bleu','noir, blanc, gris'],0,'RVB.'],
 [2,'Rouge + vert donne :',['jaune','cyan','magenta'],0,'Synthèse additive.'],
 [2,'Une lumière rouge traversant un prisme :',['est décomposée en sept couleurs','reste rouge','devient blanche'],1,'Une lumière colorée simple n’est pas décomposée.'],
 [3,'L’arc-en-ciel est dû à :',['la dispersion de la lumière du Soleil par les gouttes d’eau','la pollution','la Lune'],0,'Gouttes d’eau = petits prismes.'],
 [3,'Rouge + vert + bleu donne :',['du noir','du blanc','du jaune'],1,'Les trois primaires se combinent en blanc.']],
 ar:'يحلّل الموشور الضوء الأبيض إلى طيف ألوان (التبدّد). الألوان الأساسية للضوء: الأحمر والأخضر والأزرق. أحمر + أخضر = أصفر، أخضر + أزرق = سماوي، أحمر + أزرق = أرجواني، والثلاثة = أبيض.',
 w:[['prisme','موشور'],['spectre','طيف'],['synthèse additive','تركيب جمعي'],['arc-en-ciel','قوس قزح']]};

B.pol={look:['Les matières <b>naturelles</b> viennent de la nature ; les matières <b>synthétiques</b> sont fabriquées par l’homme (plastique).','Le <b>pétrole</b> donne des carburants et des plastiques. Les combustions polluent l’air (CO₂, CO, particules).'],
 q:[
 [1,'Le plastique est une matière :',['naturelle','synthétique','vivante'],1,'Il est fabriqué à partir du pétrole.'],
 [1,'Le coton est une matière :',['naturelle','synthétique','toxique'],0,'Il vient d’une plante.'],
 [2,'Le gaz à effet de serre principal est :',['le dioxyde de carbone','le diazote','l’argon'],0,'Il retient la chaleur de la Terre.'],
 [2,'Une combustion incomplète d’un moteur produit :',['du monoxyde de carbone','de l’eau pure','de l’oxygène'],0,'Gaz toxique.'],
 [3,'Pour réduire la pollution de l’air, on peut :',['utiliser les transports en commun','brûler plus de plastique','laisser tourner les moteurs'],0,'Moins de combustions de carburants.'],
 [3,'Le pétrole est :',['une ressource renouvelable','une ressource fossile','un gaz'],1,'Il met des millions d’années à se former.']],
 ar:'المواد الطبيعية مصدرها الطبيعة والمواد الاصطناعية يصنعها الإنسان (البلاستيك). البترول مصدر الوقود والبلاستيك. احتراق الوقود يلوّث الهواء بـ CO₂ وCO وجسيمات.',
 w:[['matière naturelle','مادة طبيعية'],['matière synthétique','مادة اصطناعية'],['pétrole','البترول'],['pollution','تلوث']]};

B.dom={look:['Une prise comporte une <b>phase</b>, un <b>neutre</b> et la <b>terre</b>. La tension du secteur est de <b>230 V</b>.','La <b>prise de terre</b> et le <b>disjoncteur</b> protègent les personnes.'],
 q:[
 [1,'La tension du secteur domestique au Maroc est :',['12 V','230 V','2 000 V'],1,'Environ 230 V alternatifs (50 Hz).'],
 [1,'La prise de terre sert à :',['protéger les personnes','allumer les lampes','chauffer'],0,'Elle évacue un défaut vers la terre.'],
 [2,'Le fil de phase est :',['dangereux : il est à potentiel élevé','sans danger','un isolant'],0,'On ne le touche jamais.'],
 [2,'Le courant du secteur est :',['continu','alternatif','nul'],1,'Il change de sens périodiquement.'],
 [3,'La fréquence du courant du secteur est :',['50 Hz','5 Hz','500 Hz'],0,'50 périodes par seconde.'],
 [3,'Le disjoncteur différentiel coupe le courant quand :',['il y a une fuite de courant','la lampe est allumée','il fait chaud'],0,'Il protège contre l’électrocution.']],
 ar:'القابس يتضمن سلك الطور وسلك الحياد وسلك التأريض. توتر القطاع 230 V وهو تيار متناوب بتردد 50 Hz. التأريض والقاطع التفاضلي يحميان الأشخاص.',
 w:[['phase','الطور'],['neutre','الحياد'],['terre','التأريض'],['courant alternatif','تيار متناوب']]};

/* ---------- 3e année ---------- */
B.ph={look:['<b>pH &lt; 7</b> : acide · <b>pH = 7</b> : neutre · <b>pH &gt; 7</b> : basique.','Diluer une solution acide fait augmenter son pH, sans dépasser 7.'],
 q:[
 [1,'Une solution de pH = 3 est :',['acide','neutre','basique'],0,'pH < 7.'],
 [1,'L’eau pure a un pH égal à :',['0','7','14'],1,'Elle est neutre.'],
 [2,'Une solution de pH = 10 est :',['acide','neutre','basique'],2,'pH > 7.'],
 [2,'On mesure le pH avec :',['du papier pH','un thermomètre','une balance'],0,'Ou avec un pH-mètre.'],
 [3,'On dilue une solution acide : son pH :',['augmente sans dépasser 7','diminue','devient 14'],0,'Elle reste acide.'],
 [3,'Le jus de citron a un pH :',['inférieur à 7','égal à 7','supérieur à 7'],0,'C’est un acide.']],
 ar:'pH أصغر من 7: محلول حمضي، يساوي 7: متعادل، أكبر من 7: أساسي. تخفيف محلول حمضي يرفع pH دون أن يتجاوز 7.',
 w:[['solution acide','محلول حمضي'],['solution basique','محلول أساسي'],['neutre','متعادل'],['pH-mètre','جهاز قياس pH']]};

B.ion={look:['Avec la <b>soude</b> : Cu²⁺ → précipité <b>bleu</b> ; Fe²⁺ → <b>vert</b> ; Fe³⁺ → <b>rouille</b> ; Zn²⁺ et Al³⁺ → <b>blanc</b>.','Cl⁻ + nitrate d’argent → précipité <b>blanc</b> qui noircit à la lumière.'],
 q:[
 [1,'Cu²⁺ + soude donne un précipité :',['bleu','vert','rouille'],0,'Hydroxyde de cuivre II.'],
 [1,'Fe²⁺ + soude donne un précipité :',['vert','bleu','blanc'],0,'Hydroxyde de fer II.'],
 [2,'Fe³⁺ + soude donne un précipité :',['rouille','blanc','bleu'],0,'Hydroxyde de fer III.'],
 [2,'Pour identifier Cl⁻ on utilise :',['le nitrate d’argent','la soude','le papier pH'],0,'Précipité blanc de chlorure d’argent.'],
 [3,'Un précipité blanc avec la soude peut être :',['Zn²⁺ ou Al³⁺','Cu²⁺','Fe³⁺'],0,'Il faut d’autres tests pour les distinguer.'],
 [3,'Le précipité de chlorure d’argent, exposé à la lumière :',['noircit','devient bleu','disparaît'],0,'Il noircit.']],
 ar:'مع الصودا: Cu²⁺ راسب أزرق، Fe²⁺ راسب أخضر، Fe³⁺ راسب لونه صدأ، Zn²⁺ وAl³⁺ راسب أبيض. وللتعرف على Cl⁻ نستعمل نترات الفضة فيتكوّن راسب أبيض يسودّ بالضوء.',
 w:[['précipité','راسب'],['soude','الصودا'],['nitrate d’argent','نترات الفضة'],['ion','أيون']]};

B.mat={look:['Le <b>fer</b> rouille en présence de dioxygène et d’humidité.','L’<b>aluminium</b> est protégé par une fine couche d’alumine.','Fer + acide chlorhydrique → <b>dihydrogène</b> + ions fer II.'],
 q:[
 [1,'Les métaux sont :',['conducteurs','isolants','toujours liquides'],0,'Ils conduisent le courant.'],
 [1,'La rouille se forme sur :',['le fer','le plastique','le verre'],0,'Le fer réagit avec O₂ en milieu humide.'],
 [2,'Fer + acide chlorhydrique libère :',['du dihydrogène','du dioxygène','du diazote'],0,'On observe un dégagement gazeux.'],
 [2,'Le dihydrogène produit une petite détonation :',['près d’une flamme','dans l’eau','dans le noir'],0,'C’est son test d’identification.'],
 [3,'L’aluminium résiste à la corrosion car :',['il est protégé par une couche d’alumine','il est plus lourd','il est liquide'],0,'Cette couche empêche la réaction de continuer.'],
 [3,'Pour protéger l’acier de la rouille on peut :',['le recouvrir de zinc ou de peinture','le laisser mouillé','le chauffer'],0,'Zinc (galvanisation) ou peinture.']],
 ar:'الفلزات موصلة للكهرباء. يصدأ الحديد بوجود ثنائي الأكسجين والرطوبة، والألومنيوم يحميه غشاء رقيق من الألومين. الحديد مع حمض الكلوريدريك يعطي غاز ثنائي الهيدروجين الذي يُحدث فرقعة قرب لهب.',
 w:[['rouille','صدأ'],['corrosion','تآكل'],['dihydrogène','ثنائي الهيدروجين'],['alumine','الألومين']]};

B.meca={look:['Le mouvement dépend du <b>référentiel</b>.','Une <b>force</b> se caractérise par son point d’application, sa droite d’action, son sens et son intensité (en newtons).','Un solide soumis à deux forces est en équilibre si elles ont même droite d’action, sens opposés, même intensité.'],
 q:[
 [1,'L’unité de la force est :',['le newton','le kilogramme','le mètre'],0,'Le newton, N.'],
 [1,'Le mouvement d’un objet dépend :',['du référentiel','de la couleur','de la masse seulement'],0,'Un passager de bus est au repos pour le bus.'],
 [2,'Une force peut :',['mettre un objet en mouvement ou le déformer','seulement le colorer','seulement le chauffer'],0,'Effets d’une force.'],
 [2,'Le poids d’un objet est dirigé :',['verticalement vers le bas','vers le haut','horizontalement'],0,'Vers le centre de la Terre.'],
 [3,'Une force est caractérisée par :',['point d’application, droite d’action, sens et intensité','couleur et forme','masse et volume'],0,'Quatre caractéristiques.'],
 [3,'L’attraction de la Terre sur un objet est une action :',['à distance','de contact uniquement','nulle'],0,'Elle s’exerce sans contact.']],
 ar:'الحركة نسبية بالنسبة للمرجع. القوة تُميَّز بنقطة التأثير وخط التأثير والمنحى والشدة (بالنيوتن). يكون جسم صلب خاضع لقوتين في توازن إذا كان لهما نفس خط التأثير ومنحيان متعاكسان ونفس الشدة.',
 w:[['force','قوة'],['référentiel','المرجع'],['intensité','شدة'],['action à distance','فعل عن بعد']]};

B.chal={look:['Le <b>thermomètre</b> mesure la <b>température</b> en degrés Celsius (°C).','<b>0 °C</b> : fusion de la glace. <b>100 °C</b> : ébullition de l’eau (pression normale).','La <b>chaleur</b> est une énergie qui passe du corps chaud vers le corps froid.'],
 q:[
 [1,'L’appareil qui mesure la température est :',['le thermomètre','la balance','l’éprouvette'],0,'Le thermomètre donne la température en °C.'],
 [1,'L’unité usuelle de la température est :',['le degré Celsius','le newton','le litre'],0,'On la note °C.'],
 [1,'La glace fond à :',['0 °C','37 °C','100 °C'],0,'La fusion de la glace a lieu à 0 °C.'],
 [2,'Dans un thermomètre à alcool, quand la température augmente, l’alcool :',['se dilate et monte','se contracte','change de couleur sans bouger'],0,'Le liquide se dilate : son niveau monte dans le tube.'],
 [2,'La chaleur passe spontanément :',['du corps chaud vers le corps froid','du corps froid vers le corps chaud','dans les deux sens à la fois'],0,'La chaleur se transfère du chaud vers le froid.'],
 [2,'La température de l’eau qui bout (pression normale) vaut :',['100 °C','50 °C','0 °C'],0,'C’est la température d’ébullition de l’eau.'],
 [3,'Même chaleur reçue : lequel s’échauffe le plus ?',['100 mL d’eau','300 mL d’eau','ils s’échauffent pareil'],0,'La petite quantité d’eau s’échauffe davantage.'],
 [3,'Pendant la fusion de la glace, la température du mélange :',['reste constante','augmente','diminue'],0,'C’est un palier de température pour un corps pur.'],
 [3,'Il faut placer le réservoir d’un thermomètre :',['dans le liquide sans toucher les parois','hors du liquide','contre le fond du récipient chauffé'],0,'On mesure la température du liquide lui-même.']],
 ar:'درجة الحرارة تقاس بالمحرار بالدرجة السلسيوسية. الحرارة طاقة تنتقل من الجسم الساخن إلى الجسم الأبرد. الجليد ينصهر عند 0 درجة والماء يغلي عند 100 درجة، وخلال تغيّر الحالة تبقى الحرارة ثابتة.',
 w:[['thermomètre','محرار'],['température','درجة الحرارة'],['chaleur','حرارة'],['dilatation','تمدد']]};

B.masse2={look:['Lors d’un changement d’état, la <b>masse se conserve</b>.','Le <b>volume ne se conserve pas</b> : l’eau qui gèle augmente de volume.','Dissolution : <b>m(solution) = m(eau) + m(sel)</b>.'],
 q:[
 [1,'Un bloc de glace de 100 g fond. La masse de l’eau obtenue est :',['100 g','90 g','110 g'],0,'La masse se conserve.'],
 [1,'Quand la glace fond, sa masse :',['ne change pas','augmente','diminue'],0,'La masse se conserve lors d’un changement d’état.'],
 [2,'Quand l’eau gèle, son volume :',['augmente','diminue','ne change pas'],0,'L’eau qui gèle augmente d’environ 9 % de volume.'],
 [2,'On dissout 10 g de sel dans 100 g d’eau. La masse de la solution est :',['110 g','100 g','90 g'],0,'100 + 10 = 110 g.'],
 [2,'Une bouteille pleine d’eau peut éclater au congélateur parce que :',['la glace occupe plus de volume','l’eau perd de la masse','l’eau devient un gaz'],0,'Le volume augmente à la congélation.'],
 [3,'Lors d’un changement d’état, la grandeur qui se conserve est :',['la masse','le volume','la masse volumique'],0,'La masse se conserve ; le volume et la masse volumique changent.'],
 [3,'On dissout 25 g de sucre dans 200 g d’eau. La masse de la solution est :',['225 g','200 g','175 g'],0,'Masse de la solution = 200 + 25 = 225 g.'],
 [3,'Le sel dissous dans l’eau :',['est toujours présent mais invisible','a disparu','est devenu un gaz'],0,'La balance montre que sa masse est toujours là.']],
 ar:'عند تغيّر حالة الماء تنحفظ الكتلة ولا ينحفظ الحجم. الماء الذي يتجمد يزداد حجمه. وفي الإذابة: كتلة المحلول تساوي كتلة الماء زائد كتلة المذاب.',
 w:[['masse','كتلة'],['volume','حجم'],['conservation','انحفاظ'],['dissolution','إذابة']]};

B.rint={look:['La résistance se mesure en <b>ohms (Ω)</b> avec un <b>ohmmètre</b>.','Même pile : plus la résistance est <b>grande</b>, plus l’intensité est <b>petite</b>.'],
 q:[
 [1,'L’unité de la résistance électrique est :',['l’ohm','l’ampère','le volt'],0,'Le symbole de l’ohm est Ω.'],
 [1,'L’appareil qui mesure une résistance est :',['l’ohmmètre','l’ampèremètre','le voltmètre'],0,'On le branche hors du circuit alimenté.'],
 [2,'Avec la même pile, quand la résistance augmente, l’intensité :',['diminue','augmente','ne change pas'],0,'R grande, I petite.'],
 [2,'On remplace 20 Ω par 40 Ω (même pile). L’intensité :',['est divisée par 2','double','reste la même'],0,'La résistance double, l’intensité est divisée par 2.'],
 [2,'Le symbole Ω désigne :',['l’ohm','l’ampère','le watt'],0,'Ω est le symbole de l’ohm.'],
 [3,'On remplace 10 Ω par 30 Ω (même pile). L’intensité :',['est divisée par 3','est multipliée par 3','ne change pas'],0,'La résistance est multipliée par 3 : l’intensité est divisée par 3.'],
 [3,'Avec une pile de 6 V, laquelle donne la plus grande intensité ?',['10 Ω','50 Ω','100 Ω'],0,'La plus petite résistance donne la plus grande intensité.'],
 [3,'L’intensité dans un circuit est de 200 mA avec 30 Ω. Avec 60 Ω et la même pile, elle vaut :',['100 mA','400 mA','200 mA'],0,'La résistance double : 200 ÷ 2 = 100 mA.']],
 ar:'تقاس المقاومة بالأوم Ω بجهاز الأومتر. في دارة بالعمود نفسه، كلما زادت المقاومة نقصت شدة التيار.',
 w:[['résistance','مقاومة'],['ohm','أوم'],['intensité','شدة التيار'],['ohmmètre','أومتر']]};

B.mvt={look:['La <b>trajectoire</b> est la ligne décrite par un point dans un référentiel.','<b>Type</b> : translation ou rotation. <b>Nature</b> : uniforme, accéléré ou retardé.','Chronophotographie : distances égales → uniforme ; croissantes → accéléré ; décroissantes → retardé.'],
 q:[
 [1,'La trajectoire d’un point est :',['la ligne qu’il décrit dans un référentiel','sa masse','sa durée de mouvement'],0,'C’est la ligne décrite par ce point.'],
 [1,'Le mouvement d’un cheval de manège est :',['une rotation','une translation rectiligne','un repos'],0,'Il tourne autour d’un axe.'],
 [2,'Distances égales entre positions à intervalles de temps égaux : le mouvement est :',['uniforme','accéléré','retardé'],0,'La vitesse est constante.'],
 [2,'Distances de plus en plus grandes : le mouvement est :',['accéléré','uniforme','retardé'],0,'La vitesse augmente.'],
 [2,'Distances de plus en plus petites : le mouvement est :',['retardé','uniforme','accéléré'],0,'La vitesse diminue.'],
 [3,'Un point décrit une ligne droite. Sa trajectoire est :',['rectiligne','circulaire','curviligne non droite'],0,'Une droite : trajectoire rectiligne.'],
 [3,'Quelle paire donne le type puis la nature d’un mouvement ?',['translation, uniforme','uniforme, rotation','accéléré, curviligne'],0,'Le type est translation ou rotation ; la nature est uniforme, accéléré ou retardé.'],
 [3,'La trajectoire d’un même point change selon :',['le référentiel choisi','la couleur du point','l’heure de la journée'],0,'Le mouvement est relatif au référentiel.']],
 ar:'المسار هو الخط الذي ترسمه نقطة بالنسبة إلى مرجع. نميز بين نوع الحركة (إزاحة أو دوران) وطبيعتها (منتظمة أو متسارعة أو متباطئة).',
 w:[['trajectoire','المسار'],['translation','إزاحة'],['rotation','دوران'],['mouvement uniforme','حركة منتظمة']]};
})();
/* Configuration des défis : Physique-Chimie en mouvement */
(function () {
  'use strict';
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i], a2 = a; a[i] = a[j]; a[j] = t; } return a; }
  function fm(x, d) { var s = (+x).toFixed(d === undefined ? 2 : d); if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s.replace('.', ','); }
  function num(q, a, u, e, h, tol) { return { t: 'num', q: q, a: a, u: u || '', e: e, h: h || '', tol: tol === undefined ? Math.max(.0006, Math.abs(a) * .004) : tol, sol: fm(a, Math.abs(a) >= 100 ? 0 : (Math.abs(a) >= 10 ? 1 : 3)) + (u ? ' ' + u : '') }; }

  /* niveau Défi : problèmes en plusieurs étapes */
  var HARD = {
    ohm: function () {
      var r1 = ri(2, 9) * 10, r2 = ri(2, 9) * 10, u = ri(3, 12) * 2, i = u / (r1 + r2);
      return num('Deux conducteurs ohmiques de ' + r1 + ' Ω et ' + r2 + ' Ω sont montés en série aux bornes d’un générateur de ' + u + ' V. Quelle est la tension aux bornes du conducteur de ' + r1 + ' Ω ?', i * r1, 'V', 'Résistance totale : ' + (r1 + r2) + ' Ω. Intensité : I = ' + u + ' ÷ ' + (r1 + r2) + ' = ' + fm(i, 3) + ' A. Tension : U = R × I = ' + r1 + ' × ' + fm(i, 3) + ' = ' + fm(i * r1, 2) + ' V.', 'En série, on additionne les résistances, puis on utilise U = R × I.', 0.02);
    },
    power: function () {
      var p = pick([100, 200, 500, 1000, 1500, 2000]), hh = ri(2, 8), price = pick([1.2, 1.4, 1.6]);
      var kwh = p / 1000 * hh;
      return num('Un appareil de ' + p + ' W fonctionne ' + hh + ' h par jour pendant 30 jours. Le prix du kWh est de ' + fm(price, 1) + ' DH. Quel est le coût du mois, en DH ?', kwh * 30 * price, 'DH', 'Énergie : E = P × t = ' + fm(p / 1000, 2) + ' kW × ' + hh + ' h × 30 = ' + fm(kwh * 30, 2) + ' kWh. Coût : ' + fm(kwh * 30, 2) + ' × ' + fm(price, 1) + ' = ' + fm(kwh * 30 * price, 2) + ' DH.', 'Convertis les watts en kilowatts avant de multiplier par la durée.', 0.02);
    },
    speed: function () {
      var d1 = ri(2, 6) * 20, v1 = pick([40, 60, 80]), d2 = ri(2, 6) * 20, v2 = pick([30, 50, 100]);
      var t = d1 / v1 + d2 / v2, v = (d1 + d2) / t;
      return num('Un car roule ' + d1 + ' km à ' + v1 + ' km/h, puis ' + d2 + ' km à ' + v2 + ' km/h. Quelle est sa vitesse moyenne sur tout le trajet ?', v, 'km/h', 'Durées : ' + d1 + '/' + v1 + ' + ' + d2 + '/' + v2 + ' = ' + fm(t, 3) + ' h. Distance : ' + (d1 + d2) + ' km. v = ' + fm(v, 1) + ' km/h.', 'Vitesse moyenne = distance totale ÷ durée totale.', 0.2);
    },
    weight: function () {
      var m = ri(2, 9) * 10, gt = 10, gl = 1.6, gm = 3.7;
      var astre = pick([['la Lune', 1.6], ['Mars', 3.7]]);
      return num('Sur Terre (g = 10 N/kg), un astronaute avec son équipement pèse ' + (m * 10) + ' N. Quel est son poids sur ' + astre[0] + ' (g = ' + fm(astre[1], 1) + ' N/kg) ?', m * astre[1], 'N', 'Masse : m = P ÷ g = ' + (m * 10) + ' ÷ 10 = ' + m + ' kg (la masse ne change pas). Poids : P = ' + m + ' × ' + fm(astre[1], 1) + ' = ' + fm(m * astre[1], 1) + ' N.', 'Calcule d’abord la masse, qui ne dépend pas du lieu.', 0.2);
    },
    rho: function () {
      var rho = pick([2.7, 7.8, 8.9, 11.3]), v = ri(2, 9) * 5;
      var m = rho * v;
      return num('Un bloc de métal de masse volumique ' + fm(rho, 1) + ' g/cm³ occupe un volume de ' + v + ' cm³. Quelle est sa masse en kilogrammes ?', m / 1000, 'kg', 'm = ρ × V = ' + fm(rho, 1) + ' × ' + v + ' = ' + fm(m, 1) + ' g, soit ' + fm(m / 1000, 4) + ' kg.', 'Calcule en grammes, puis convertis en kilogrammes.', 0.0006);
    },
    node: function () {
      var i1 = ri(2, 6) / 2, i2 = ri(2, 6) / 2, i3 = ri(1, 4) / 2, i4 = i1 + i2 - i3;
      if (i4 <= 0) return HARD.node();
      return num('À un nœud, les courants arrivants sont ' + fm(i1, 1) + ' A et ' + fm(i2, 1) + ' A. Deux courants repartent : un de ' + fm(i3, 1) + ' A et un autre. Quelle est l’intensité de cet autre courant ?', i4, 'A', 'Loi des nœuds : somme des courants arrivants = somme des courants sortants. ' + fm(i1 + i2, 1) + ' = ' + fm(i3, 1) + ' + I, donc I = ' + fm(i4, 1) + ' A.', 'Courants arrivants = courants sortants.', 0.02);
    },
    tens: function () {
      var u = ri(4, 12) * 2, u1 = ri(1, 3), u2 = ri(1, 3), u3 = u - u1 - u2;
      if (u3 <= 0) return HARD.tens();
      return num('Trois lampes en série sont alimentées par un générateur de ' + u + ' V. Les tensions aux bornes de deux lampes sont ' + u1 + ' V et ' + u2 + ' V. Quelle est la tension aux bornes de la troisième lampe ?', u3, 'V', 'Additivité des tensions en série : ' + u + ' = ' + u1 + ' + ' + u2 + ' + U₃, donc U₃ = ' + u3 + ' V.', 'En série, les tensions s’additionnent.', 0.02);
    },
    mass: function () {
      var m0 = ri(2, 9) * 10, mf = m0 - ri(1, 5) * 2;
      return num('On brûle de la laine d’acier (fer) dans l’air : sa masse passe de ' + m0 + ' g à ' + (m0 + 6) + ' g. Quelle masse de dioxygène a réagi ?', 6, 'g', 'Conservation de la masse : masse de fer + masse de dioxygène consommé = masse du produit. ' + (m0 + 6) + ' − ' + m0 + ' = 6 g.', 'La masse augmente car le fer se combine avec le dioxygène.', 0.02);
    }
  };

  function B() { return window.PC && window.PC.bank; }
  function G() { return window.PC && window.PC.gen; }
  function fromBank(key, d) {
    var bk = B() && B()[key]; if (!bk) return null;
    var pool = bk.q.filter(function (x) { return d === 1 ? x[0] <= 2 : (d === 2 ? true : x[0] >= 2); });
    if (!pool.length) pool = bk.q;
    var x = pick(pool), idx = shuffle(x[2].map(function (_, i) { return i; }));
    return { t: 'mcq', q: x[1], o: idx.map(function (i) { return x[2][i]; }), a: idx.indexOf(x[3]), e: x[4], h: 'Relis « ' + (bk.look ? 'Je regarde' : 'le cours') + ' » du chapitre.' };
  }

  var M1 = {};
  function T(id, topics) { M1[id] = { topics: topics }; }
  T('c1-1', ['b:eau']);
  T('c1-2', ['b:etat', 'b:part']);
  T('c1-3', ['g:rho', 'g:convm', 'g:convl']);
  T('c1-7', ['b:mel']);
  T('c1-8', ['b:sep']);
  T('c1-9', ['b:eau']);
  T('c1-10', ['b:circ']);
  T('c1-11', ['b:circ', 'b:cond']);
  T('c1-14', ['b:circ']);
  T('c1-15', ['b:res']);
  T('c1-16', ['g:node', 'g:tens']);
  T('c1-17', ['b:secu']);
  T('c1-18', ['b:chal']);
  T('c1-19', ['b:masse2']);
  T('c1-20', ['b:rint']);
  T('c2-2', ['b:air', 'g:air']);
  T('c2-3', ['b:mol', 'g:atoms']);
  T('c2-4', ['b:comb', 'g:mass']);
  T('c2-5', ['g:mass', 'b:comb']);
  T('c2-7', ['b:pol']);
  T('c2-9', ['b:col']);
  T('c2-10', ['b:lum', 'g:shadow']);
  T('c2-14', ['b:dom', 'g:power']);
  T('c3-1', ['b:mat']);
  T('c3-3', ['b:mat']);
  T('c3-4', ['b:ph']);
  T('c3-5', ['b:ph', 'b:mat']);
  T('c3-6', ['b:ion']);
  T('c3-9', ['g:speed', 'g:kmh']);
  T('c3-10', ['b:meca']);
  T('c3-11', ['b:meca']);
  T('c3-12', ['b:meca']);
  T('c3-13', ['g:weight']);
  T('c3-14', ['g:ohm', 'b:res']);
  T('c3-16', ['g:power']);
  T('c3-17', ['b:mvt']);

  window.LAB_CONFIG = {
    riddles: [
      {
        "q": "Un glaçon flotte dans un verre d’eau rempli à ras bord. Quand il a fondu, le verre déborde-t-il ?",
        "qa": "قطعة ثلج تطفو في كأس ماء ممتلئ حتى الحافة. عند ذوبانها هل ينسكب الماء؟",
        "o": [
          "Oui, un peu",
          "Non, le niveau ne change pas",
          "Oui, beaucoup",
          "Le verre se vide"
        ],
        "a": 1,
        "e": "Le glaçon déplace un volume d’eau de même masse que lui. En fondant, il donne exactement ce volume d’eau liquide.",
        "ea": "قطعة الثلج تزيح حجما من الماء له نفس كتلتها. عند الذوبان تعطي بالضبط هذا الحجم من الماء السائل."
      },
      {
        "q": "Comment s’appelle le passage de l’état liquide à l’état solide ?",
        "qa": "ماذا نسمي الانتقال من الحالة السائلة إلى الحالة الصلبة؟",
        "o": [
          "La fusion",
          "La vaporisation",
          "La solidification",
          "La condensation"
        ],
        "a": 2,
        "e": "Liquide vers solide : solidification. Solide vers liquide : fusion.",
        "ea": "من سائل إلى صلب: التصلب. ومن صلب إلى سائل: الانصهار."
      },
      {
        "q": "Quelle grandeur est conservée quand la glace fond ?",
        "qa": "ما المقدار الذي يبقى ثابتا عندما يذوب الثلج؟",
        "o": [
          "Le volume",
          "La masse",
          "La forme",
          "La masse volumique"
        ],
        "a": 1,
        "e": "La masse se conserve lors d’un changement d’état. Le volume et la masse volumique changent.",
        "ea": "تبقى الكتلة ثابتة خلال تغيّر الحالة. أما الحجم والكتلة الحجمية فيتغيران."
      },
      {
        "q": "Une voiture parcourt 90 km en 1 h 30. Quelle est sa vitesse moyenne ?",
        "qa": "قطعت سيارة 90 كم في ساعة ونصف. ما سرعتها المتوسطة؟",
        "o": [
          "45 km/h",
          "60 km/h",
          "90 km/h",
          "135 km/h"
        ],
        "a": 1,
        "e": "v = d ÷ t = 90 ÷ 1,5 = 60 km/h.",
        "ea": "v = d ÷ t = 90 ÷ 1,5 = 60 كم/س."
      },
      {
        "q": "On dissout du sel dans de l’eau. Quel type de mélange obtient-on ?",
        "qa": "أذبنا ملحا في الماء. ما نوع الخليط الناتج؟",
        "o": [
          "Un mélange hétérogène",
          "Un corps pur",
          "Un mélange homogène",
          "Un élément chimique"
        ],
        "a": 2,
        "e": "On ne distingue plus le sel de l’eau à l’œil nu : le mélange est homogène.",
        "ea": "لا نميّز الملح عن الماء بالعين المجردة: الخليط متجانس."
      },
      {
        "q": "Un seul fil relie directement les deux bornes d’une pile. Comment nomme-t-on cette situation, à ne jamais reproduire ?",
        "qa": "سلك واحد يصل مباشرة بين قطبي عمود. ماذا نسمي هذه الوضعية التي يجب ألا نكررها؟",
        "o": [
          "Un circuit en série",
          "Un circuit en dérivation",
          "Un circuit ouvert",
          "Un court-circuit"
        ],
        "a": 3,
        "e": "C’est un court-circuit : le courant est très intense, le fil et la pile chauffent. Il est dangereux.",
        "ea": "هذا هو القصر الكهربائي: تصبح الشدة كبيرة جدا فيسخن السلك والعمود. وهو خطير."
      }
    ],
    app: 'pc', appName: 'Physique-Chimie en mouvement', map: M1,
    gen: function (key, d) {
      var kind = key.slice(0, 1), k = key.slice(2);
      if (kind === 'b') return fromBank(k, d === 4 ? 3 : d);
      if (d === 4 && HARD[k]) return HARD[k]();
      var g = G(); if (!g || !g[k]) return null;
      return g[k](d === 4 ? 3 : d);
    }
  };
})();

window.LAB_CONFIG && (window.LAB_CONFIG.embed = true);
