/* généré par sync_defis.py : ne pas modifier ici */
window.MM = window.MM || {};
(function(){
'use strict';
var M=window.MM,G={};
M.G=G;

function ri(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function nz(a,b){var v;do{v=ri(a,b)}while(v===0);return v}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t}return a||1}
function fm(x,d){
  d=d===undefined?2:d;
  var s=(+x).toFixed(d);
  if(s.indexOf('.')>-1)s=s.replace(/0+$/,'').replace(/\.$/,'');
  s=s.replace('.',',').replace('-','−');
  return /^−0(,0*)?$/.test(s)?'0':s;
}
function sg(x){return fm(x,6)}
function rl(x){return x<0?'('+sg(x)+')':sg(x)}
function fr(n,d){if(d<0){n=-n;d=-d}return '<span class="fr"><span>'+sg(n)+'</span><span>'+d+'</span></span>'}
function fs(n,d){var g=gcd(n,d);n/=g;d/=g;if(d<0){n=-n;d=-d}return d===1?sg(n):fr(n,d)}
function sgn(x){return x<0?' − '+Math.abs(x):' + '+x}
function xs(a,b){
  var s=(a===1?'':(a===-1?'−':sg(a)))+'x';
  return b===0?s:s+sgn(b);
}
function remB(b){return b<0?'ajoute '+(-b):'retire '+b}
function num(q,a,e,h,o){o=o||{};return {t:'num',q:q,a:a,e:e,h:h||'',u:o.u||'',tol:o.tol===undefined?1e-6:o.tol,sol:o.sol||fm(a,4)}}
function qcm(q,right,wrong,e,h){
  var all=shuffle([right].concat(wrong)),i=all.indexOf(right);
  return {t:'qcm',q:q,o:all,a:i,e:e,h:h||''};
}
function distinct(r,list){var out=[],k;list.forEach(function(x){k=String(x);if(k!==String(r)&&out.indexOf(k)<0)out.push(k)});return out}

/* ---------- opérations ---------- */
G.ent=function(s){
  var a,b,r,t=ri(0,s===1?1:3);
  if(s===1){
    if(t===0){a=ri(12,89);b=ri(11,99-0);r=a+b;return num(a+' + '+b+' = ?',r,'On additionne les unités puis les dizaines, avec la retenue : '+a+' + '+b+' = '+r+'.','Pose l’addition en colonnes.')}
    a=ri(40,99);b=ri(11,a-1);r=a-b;return num(a+' − '+b+' = ?',r,a+' − '+b+' = '+r+'. Vérification : '+r+' + '+b+' = '+a+'.','Pense à ce qu’il faut ajouter à '+b+' pour obtenir '+a+'.');
  }
  if(s===2){
    if(t===0){a=ri(120,899);b=ri(120,899);return num(a+' + '+b+' = ?',a+b,'On additionne colonne par colonne, de droite à gauche : '+(a+b)+'.','Commence par les unités.')}
    if(t===1){a=ri(500,999);b=ri(120,499);return num(a+' − '+b+' = ?',a-b,'On soustrait colonne par colonne : '+(a-b)+'. Vérification : '+(a-b)+' + '+b+' = '+a+'.','Emprunte une dizaine si le chiffre du haut est trop petit.')}
    a=ri(12,99);b=ri(3,9);return num(a+' × '+b+' = ?',a*b,a+' × '+b+' = '+a*b+'.','Décompose '+a+' en dizaines et unités.');
  }
  if(t<2){a=ri(12,49);b=ri(12,29);return num(a+' × '+b+' = ?',a*b,a+' × '+b+' = ('+a+' × '+(b-b%10)+') + ('+a+' × '+(b%10)+') = '+a*b+'.','Multiplie d’abord par les unités, puis par les dizaines.')}
  b=ri(12,29);r=ri(12,49);a=b*r;return num(a+' ÷ '+b+' = ?',r,'Cherche le nombre qui, multiplié par '+b+', donne '+a+' : '+r+' × '+b+' = '+a+'.','Essaie de multiplier '+b+' par des dizaines.');
};
G.divr=function(s){
  var b=ri(3,s===1?9:(s===2?12:19)),q=ri(s===1?5:12,s===1?20:60),r=ri(1,b-1),a=b*q+r,ask=ri(0,1);
  return num('Division euclidienne de '+a+' par '+b+' : quel est le '+(ask?'reste':'quotient')+' ?',ask?r:q,a+' = '+b+' × '+q+' + '+r+' avec '+r+' &lt; '+b+'. Le quotient est '+q+' et le reste '+r+'.','Cherche le plus grand multiple de '+b+' inférieur ou égal à '+a+'.');
};
G.dec=function(s){
  var a,b,r,t=ri(0,s===1?1:3);
  if(s===1){
    a=ri(11,99)/10;b=ri(11,99)/10;
    if(t===0)return num(fm(a)+' + '+fm(b)+' = ?',+(a+b).toFixed(2),'On aligne les virgules : '+fm(a)+' + '+fm(b)+' = '+fm(a+b)+'.','Aligne les virgules.');
    if(a<b){var z=a;a=b;b=z}
    return num(fm(a)+' − '+fm(b)+' = ?',+(a-b).toFixed(2),'On aligne les virgules : '+fm(a)+' − '+fm(b)+' = '+fm(a-b)+'.','Aligne les virgules.');
  }
  if(s===2){
    if(t===0){a=ri(101,999)/100;b=ri(101,999)/100;return num(fm(a)+' + '+fm(b)+' = ?',+(a+b).toFixed(2),'On aligne les virgules : '+fm(a+b)+'.','Aligne les virgules.')}
    if(t===1){a=ri(300,999)/100;b=ri(101,299)/100;return num(fm(a)+' − '+fm(b)+' = ?',+(a-b).toFixed(2),'On aligne les virgules : '+fm(a-b)+'.','Aligne les virgules.')}
    a=ri(12,99)/10;b=ri(2,9);return num(fm(a)+' × '+b+' = ?',+(a*b).toFixed(2),'On calcule '+Math.round(a*10)+' × '+b+' = '+Math.round(a*10)*b+' puis on place la virgule : '+fm(a*b)+'.','Oublie la virgule, multiplie, puis remets-la.');
  }
  if(t<2){a=ri(12,99)/10;b=ri(12,99)/10;r=+(a*b).toFixed(2);return num(fm(a)+' × '+fm(b)+' = ?',r,'On calcule '+Math.round(a*10)+' × '+Math.round(b*10)+' = '+Math.round(a*10)*Math.round(b*10)+' puis on place deux décimales : '+fm(r)+'.','Compte le nombre de chiffres après la virgule dans les deux facteurs.')}
  b=ri(2,8);r=ri(12,99)/10;a=+(r*b).toFixed(2);return num(fm(a)+' ÷ '+b+' = ?',r,fm(r)+' × '+b+' = '+fm(a)+', donc '+fm(a)+' ÷ '+b+' = '+fm(r)+'.','Cherche le nombre qui multiplié par '+b+' donne '+fm(a)+'.');
};
G.decComp=function(s){
  var a=ri(10,99)/10,b=a+(Math.random()<.5?-1:1)*ri(1,9)/100*(s>1?1:10);b=+b.toFixed(2);if(b===a)b=+(a+0.01).toFixed(2);
  var r=a<b?'<':'>';
  return qcm('Compare : '+fm(a)+' ◻ '+fm(b),r,['<','>','='].filter(function(x){return x!==r}).slice(0,2),'On compare d’abord les parties entières, puis les dixièmes, puis les centièmes : '+fm(a)+' '+r+' '+fm(b)+'.','Écris les deux nombres avec le même nombre de décimales.');
};

/* ---------- fractions ---------- */
G.fsimp=function(s){
  var d=pick(s===1?[2,3,4,5]:[3,4,5,7,8]),n=ri(1,d-1),g=ri(2,s===3?9:5);
  if(gcd(n,d)!==1)n=1;
  return num('Simplifie '+fr(n*g,d*g)+' : quel est le dénominateur de la fraction irréductible ?',d,'On divise le numérateur et le dénominateur par '+g+' : '+fr(n*g,d*g)+' = '+fr(n,d)+'.','Cherche un nombre qui divise '+(n*g)+' et '+(d*g)+'.');
};
G.fadd=function(s){
  var a,b,c,d,r;
  if(s===1){d=ri(3,9);a=ri(1,d-2);b=ri(1,d-a-1);return numF(fr(a,d)+' + '+fr(b,d),a+b,d,'Même dénominateur : on additionne les numérateurs. '+fr(a,d)+' + '+fr(b,d)+' = '+fr(a+b,d))}
  var p=pick([2,3,4,5]),q=pick([2,3,4,5,6].filter(function(x){return x!==p}));
  c=p*q/gcd(p,q);a=ri(1,p-1);b=ri(1,q-1);
  var n=a*(c/p)+b*(c/q),op=s===3&&Math.random()<.5?-1:1;
  if(op<0){var x=a/p,y=b/q;if(x<y){var tt=a;a=b;b=tt;tt=p;p=q;q=tt}n=a*(c/p)-b*(c/q);return numF(fr(a,p)+' − '+fr(b,q),n,c,'On réduit au même dénominateur '+c+' : '+fr(a*(c/p),c)+' − '+fr(b*(c/q),c)+' = '+fs(n,c))}
  return numF(fr(a,p)+' + '+fr(b,q),n,c,'On réduit au même dénominateur '+c+' : '+fr(a*(c/p),c)+' + '+fr(b*(c/q),c)+' = '+fs(n,c));
};
function numF(expr,n,d,e){return num('Calcule '+expr+'. Réponse sous forme décimale ou fraction (ex. 3/4).',n/d,e+'.','Mets les deux fractions au même dénominateur.',{sol:fs(n,d)+' (≈ '+fm(n/d,3)+')',tol:6e-3})}
G.fmul=function(s){
  var b=ri(2,7),a=ri(1,b-1),d=ri(2,7),c=ri(1,d-1);
  if(s===1){var k=ri(2,6);return num('Calcule '+fr(a,b)+' × '+k+' (en nombre décimal ou fraction).',a*k/b,fr(a,b)+' × '+k+' = '+fr(a*k,b)+' = '+fs(a*k,b)+'.','Multiplie le numérateur par '+k+'.',{sol:fs(a*k,b),tol:6e-3})}
  if(s===2||Math.random()<.5)return num('Calcule '+fr(a,b)+' × '+fr(c,d)+' (décimal ou fraction).',a*c/(b*d),'On multiplie les numérateurs entre eux et les dénominateurs entre eux : '+fr(a*c,b*d)+' = '+fs(a*c,b*d)+'.','Numérateur × numérateur, dénominateur × dénominateur.',{sol:fs(a*c,b*d),tol:6e-3});
  return num('Calcule '+fr(a,b)+' ÷ '+fr(c,d)+' (décimal ou fraction).',a*d/(b*c),'Diviser par une fraction, c’est multiplier par son inverse : '+fr(a,b)+' × '+fr(d,c)+' = '+fs(a*d,b*c)+'.','Multiplie par la fraction inversée.',{sol:fs(a*d,b*c),tol:6e-3});
};
G.fcomp=function(s){
  var d1=ri(2,9),n1=ri(1,d1-1),d2=ri(2,9),n2=ri(1,d2-1);
  if(n1*d2===n2*d1)n2=n2%(d2-1)+1;
  if(n1*d2===n2*d1)d2++;
  var r=n1*d2<n2*d1?'<':(n1*d2>n2*d1?'>':'=');
  return qcm('Compare : '+fr(n1,d1)+' ◻ '+fr(n2,d2),r,['<','>','='].filter(function(x){return x!==r}),'Au même dénominateur '+(d1*d2)+' : '+fr(n1*d2,d1*d2)+' et '+fr(n2*d1,d1*d2)+', donc '+fr(n1,d1)+' '+r+' '+fr(n2,d2)+'.','Réduis au même dénominateur.');
};
G.fpart=function(s){
  var d=pick([4,5,8,10]),n=ri(1,d-1),T=d*ri(2,s===3?12:8);
  return num('Calcule les '+fr(n,d)+' de '+T+'.',T/d*n,'On divise '+T+' par '+d+' : '+(T/d)+', puis on multiplie par '+n+' : '+(T/d*n)+'.','Divise d’abord par le dénominateur.');
};

/* ---------- relatifs ---------- */
G.rel=function(s){
  var a,b,t=ri(0,s===1?1:3);
  if(s===1){a=nz(-9,9);b=nz(-9,9);
    if(t===0)return num(rl(a)+' + '+rl(b)+' = ?',a+b,'On place '+sg(a)+' sur la droite, puis on avance de '+sg(b)+' : '+sg(a+b)+'.','Imagine un déplacement sur la droite graduée.');
    return num(rl(a)+' − '+rl(b)+' = ?',a-b,'Soustraire '+rl(b)+', c’est ajouter son opposé '+sg(-b)+' : '+sg(a-b)+'.','Soustraire, c’est ajouter l’opposé.');}
  if(s===2){a=nz(-20,20);b=nz(-20,20);
    if(t===0)return num(rl(a)+' + '+rl(b)+' = ?',a+b,'Signes '+(a*b>0?'identiques : on additionne les distances et on garde le signe':'contraires : on soustrait les distances et on garde le signe du plus grand')+' : '+sg(a+b)+'.','Compare les distances à zéro.');
    if(t===1)return num(rl(a)+' − '+rl(b)+' = ?',a-b,rl(a)+' − '+rl(b)+' = '+rl(a)+' + '+rl(-b)+' = '+sg(a-b)+'.','Soustraire, c’est ajouter l’opposé.');
    a=nz(-9,9);b=nz(-9,9);return num(rl(a)+' × '+rl(b)+' = ?',a*b,'Signes '+(a*b>0?'identiques : le produit est positif':'différents : le produit est négatif')+' : '+sg(a*b)+'.','Règle des signes.');}
  if(t<2){a=nz(-12,12);b=nz(-12,12);return num(rl(a)+' × '+rl(b)+' = ?',a*b,'Règle des signes : '+(a*b>0?'+':'−')+' puis '+Math.abs(a)+' × '+Math.abs(b)+' = '+Math.abs(a*b)+'. Résultat : '+sg(a*b)+'.','Règle des signes.')}
  b=nz(-9,9);var q=nz(-9,9);a=b*q;return num(rl(a)+' ÷ '+rl(b)+' = ?',q,'Les signes '+(a*b>0?'sont identiques : le quotient est positif':'sont différents : le quotient est négatif')+' : '+sg(q)+'.','Divise les nombres sans signe, puis applique la règle des signes.');
};
G.relComp=function(s){
  var a=nz(-9,9),b=nz(-9,9);if(a===b)b=a+1;if(b===0)b=a>0?-1:1;
  var r=a<b?'<':'>';
  return qcm('Compare : '+rl(a)+' ◻ '+rl(b),r,['<','>'].filter(function(x){return x!==r}).concat(['=']),'Sur la droite graduée, le plus à gauche est le plus petit : '+sg(a)+' '+r+' '+sg(b)+'.','Place les deux nombres sur la droite graduée.');
};
G.prio=function(s){
  var a=ri(2,9),b=ri(2,9),c=ri(2,9),d=ri(2,6);
  if(s===1)return num(a+' + '+b+' × '+c+' = ?',a+b*c,'La multiplication est prioritaire : '+b+' × '+c+' = '+(b*c)+', puis '+a+' + '+(b*c)+' = '+(a+b*c)+'.','Multiplication avant addition.');
  if(s===2)return num('('+a+' + '+b+') × '+c+' − '+d+' = ?',(a+b)*c-d,'Les parenthèses d’abord : '+(a+b)+', puis × '+c+' = '+((a+b)*c)+', puis − '+d+' = '+((a+b)*c-d)+'.','Parenthèses, puis multiplication, puis soustraction.');
  var e=nz(-5,5);return num(a+' − '+b+' × '+rl(e)+' + '+c+' = ?',a-b*e+c,'On calcule d’abord le produit : '+b+' × '+rl(e)+' = '+sg(b*e)+'. Puis '+a+' − '+rl(b*e)+' + '+c+' = '+sg(a-b*e+c)+'.','Calcule d’abord le produit.');
};

/* ---------- puissances ---------- */
G.pow=function(s){
  var a,n,t=ri(0,s===1?0:2);
  if(s===1){a=ri(2,5);n=ri(2,4);return num(a+'<sup>'+n+'</sup> = ?',Math.pow(a,n),a+'<sup>'+n+'</sup> = '+new Array(n).fill(a).join(' × ')+' = '+Math.pow(a,n)+'.','Multiplie '+a+' par lui-même '+n+' fois.')}
  if(t===0){a=nz(-4,4);n=ri(2,4);return num(rl(a)+'<sup>'+n+'</sup> = ?',Math.pow(a,n),'Le signe est '+(Math.pow(a,n)<0?'négatif (exposant impair)':'positif (exposant pair)')+' : '+sg(Math.pow(a,n))+'.','Un exposant pair donne un résultat positif.')}
  if(t===1){a=pick([2,3,5,10]);var m=ri(2,5);n=ri(2,5);return num(a+'<sup>'+m+'</sup> × '+a+'<sup>'+n+'</sup> = '+a+'<sup>?</sup>',m+n,'Même base : on additionne les exposants : '+m+' + '+n+' = '+(m+n)+'.','a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup>.')}
  a=pick([2,3,5,10]);var m2=ri(6,9);n=ri(2,5);return num(a+'<sup>'+m2+'</sup> ÷ '+a+'<sup>'+n+'</sup> = '+a+'<sup>?</sup>',m2-n,'Même base : on soustrait les exposants : '+m2+' − '+n+' = '+(m2-n)+'.','a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup>.');
};
G.sci=function(s){
  var n=ri(2,6),m=ri(11,99)/10,N=Math.round(m*Math.pow(10,n)),neg=Math.random()<.4&&s>1;
  if(neg){var k=ri(2,5);return num('Écriture scientifique de '+fm(m/Math.pow(10,k+1),k+2)+' = '+fm(m)+' × 10<sup>?</sup> (donne l’exposant).',-(k+1),'On déplace la virgule de '+(k+1)+' rangs vers la droite pour obtenir '+fm(m)+' : l’exposant est '+sg(-(k+1))+'.','Combien de rangs faut-il décaler la virgule vers la droite ?')}
  return num(String(N).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' = '+fm(m)+' × 10<sup>?</sup> (donne l’exposant).',n,'Pour passer de '+fm(m)+' à '+String(N)+', on déplace la virgule de '+n+' rangs vers la droite : l’exposant est '+n+'.','Combien de rangs entre la virgule et le premier chiffre ?');
};

/* ---------- calcul littéral et équations ---------- */
G.lit=function(s){
  var a=ri(2,6),b=ri(1,9),x=ri(2,6),t=ri(0,s===1?1:3);
  if(s===1){
    if(t===0)return num('Calcule '+a+'x + '+b+' pour x = '+x+'.',a*x+b,'On remplace x par '+x+' : '+a+' × '+x+' + '+b+' = '+(a*x+b)+'.','Remplace x par '+x+'.');
    var c=ri(2,6);return num('Réduis '+a+'x + '+c+'x : quel est le coefficient de x ?',a+c,a+'x + '+c+'x = ('+a+' + '+c+')x = '+(a+c)+'x.','Additionne les coefficients.');
  }
  if(s===2){
    if(t===0)return num('Développe '+a+'(x + '+b+') = '+a+'x + ? (donne le nombre).',a*b,a+'(x + '+b+') = '+a+'x + '+a+' × '+b+' = '+a+'x + '+(a*b)+'.','Multiplie '+a+' par chaque terme.');
    if(t===1){var g=ri(2,6),p1=ri(2,5),q1=ri(2,5);while(gcd(p1,q1)!==1)q1=ri(2,7);return num('Factorise '+(g*p1)+'x + '+(g*q1)+' : quel est le plus grand facteur commun ?',g,(g*p1)+'x + '+(g*q1)+' = '+g+'('+p1+'x + '+q1+'). Le facteur commun est '+g+'.','Cherche le plus grand nombre qui divise '+(g*p1)+' et '+(g*q1)+'.')}
    return num('Calcule '+a+'x − '+b+' pour x = '+rl(-x)+'.',-a*x-b,'On remplace x par '+rl(-x)+' : '+a+' × '+rl(-x)+' − '+b+' = '+sg(-a*x-b)+'.','Remplace x par '+rl(-x)+'.');
  }
  var m=ri(2,6),n=ri(2,6);
  if(t<2)return num('Développe et réduis (x + '+m+')(x + '+n+') = x² + ?x + '+(m*n)+' (donne le coefficient de x).',m+n,'(x + '+m+')(x + '+n+') = x² + '+n+'x + '+m+'x + '+(m*n)+' = x² + '+(m+n)+'x + '+(m*n)+'.','Utilise la double distributivité.');
  return num('Développe (x + '+m+')² = x² + ?x + '+(m*m)+' (donne le coefficient de x).',2*m,'(a + b)² = a² + 2ab + b² : le terme du milieu est 2 × x × '+m+' = '+(2*m)+'x.','(a + b)² = a² + 2ab + b².');
};
G.eq1=function(s){
  var x=nz(-9,9),a=ri(2,s===1?5:9),b=nz(-12,12);
  if(s===1){x=ri(1,9);b=ri(1,12);return num('Résous '+a+'x + '+b+' = '+(a*x+b)+'. Donne x.',x,'On retire '+b+' : '+a+'x = '+(a*x)+', puis on divise par '+a+' : x = '+x+'.','Isole le terme en x.')}
  if(s===2)return num('Résous '+xs(a,b)+' = '+sg(a*x+b)+'. Donne x.',x,'On '+remB(b)+' des deux côtés : '+a+'x = '+sg(a*x)+', puis x = '+sg(x)+'.','Isole le terme en x.');
  a=-ri(2,9);x=nz(-9,9);var rhs=a*x+b;
  return num('Résous '+xs(a,b)+' = '+sg(rhs)+'. Donne x.',x,'On '+remB(b)+' des deux côtés : '+sg(a)+'x = '+sg(rhs-b)+'. On divise par '+sg(a)+' (négatif) : x = '+sg(x)+'.','Isole le terme en x, puis divise par le coefficient.');
};
G.eq2=function(s){
  var x=nz(-6,6),a=ri(3,7),c=ri(1,a-1),b=nz(-9,9),d=b+(a-c)*x;
  return num('Résous '+xs(a,b)+' = '+xs(c,d)+'. Donne x.',x,'On retire '+(c===1?'x':c+'x')+' des deux côtés : '+(a-c)+'x'+sgn(b)+' = '+sg(d)+'. Puis '+(a-c)+'x = '+sg(d-b)+' et x = '+sg(x)+'.','Regroupe les x d’un côté, les nombres de l’autre.');
};
G.eqp=function(s){
  var p=nz(-8,8),q=nz(-8,8);if(p===q)q=p+3;var big=Math.max(-p,-q),small=Math.min(-p,-q),ask=Math.random()<.5;
  return num('Résous (x '+sgn(p)+')(x '+sgn(q)+') = 0. Donne la '+(ask?'plus grande':'plus petite')+' solution.',ask?big:small,'Un produit est nul si l’un des facteurs est nul : x = '+sg(-p)+' ou x = '+sg(-q)+'. Les solutions sont '+sg(small)+' et '+sg(big)+'.','Un produit est nul si l’un des facteurs est nul.');
};
G.ineq=function(s){
  var a=ri(2,5)*(s>1&&Math.random()<.5?-1:1),b=nz(-8,8),x=nz(-5,5),d=a*x+b;
  var sign=a>0?'x &lt; '+sg(x):'x &gt; '+sg(x);
  return qcm('Résous '+xs(a,b)+' &lt; '+sg(d)+'.',sign,[a>0?'x &gt; '+sg(x):'x &lt; '+sg(x),'x &lt; '+sg(x+1),'x &gt; '+sg(x-1)],'On isole x : '+sg(a)+'x &lt; '+sg(d-b)+'. On divise par '+sg(a)+(a<0?' (négatif : le sens s’inverse)':' (positif : le sens est conservé)')+' : '+sign+'.','Attention au sens quand on divise par un nombre négatif.');
};
G.sys=function(s){
  var x=ri(1,9),y=ri(1,9),ask=Math.random()<.5;
  if(s===3){var a=ri(2,3);return num('Résous x + y = '+(x+y)+' et '+a+'x − y = '+sg(a*x-y)+'. Donne '+(ask?'x':'y')+'.',ask?x:y,'On additionne les deux équations : '+(a+1)+'x = '+((x+y)+(a*x-y))+', donc x = '+x+' puis y = '+y+'.','Additionne les deux équations pour éliminer y.')}
  return num('Résous x + y = '+(x+y)+' et x − y = '+sg(x-y)+'. Donne '+(ask?'x':'y')+'.',ask?x:y,'On additionne : 2x = '+(2*x)+', donc x = '+x+'. Puis y = '+(x+y)+' − '+x+' = '+y+'.','Additionne les deux équations.');
};

/* ---------- racines carrées ---------- */
/* ---------- séances explicites 2AC : puissances, carrés parfaits, racine carrée, monômes ---------- */
function sp(n){return '<sup>'+n+'</sup>'}
function isSq(n){var r=Math.round(Math.sqrt(n));return r*r===n}
G.pexp=function(s){
  var t=ri(0,2),a=ri(2,6),n=ri(2,4),b,k,r;
  if(s===1){
    if(t===0)return num(a+sp(n)+' = ?',Math.pow(a,n),'L’exposant est '+n+' : on écrit la base '+a+' '+n+' fois. '+a+sp(n)+' = '+new Array(n).fill(a).join(' × ')+' = '+Math.pow(a,n)+'.','Écris le produit de facteurs égaux à la base.');
    if(t===1)return num('Dans '+a+sp(n)+', quelle est la valeur de l’exposant ?',n,'L’exposant est le petit nombre écrit en haut à droite : '+n+'.','Regarde le petit nombre placé en haut.');
    return num('Combien de facteurs égaux à '+a+' y a-t-il dans '+a+sp(n)+' ?',n,'L’exposant '+n+' indique '+n+' facteurs égaux à la base '+a+'.','L’exposant dit combien de facteurs on multiplie.');
  }
  if(s===2){
    b=pick([2,3,5,10]);k=ri(3,5);r=new Array(k).fill(b).join(' × ');
    if(t===0)return qcm('Écris '+r+' sous forme de puissance.',b+sp(k),distinct(b+sp(k),[k+sp(b),b+sp(k-1),(b*k)+'']),'Le facteur '+b+' est répété '+k+' fois : '+b+sp(k)+'.','Quelle est la base ? Combien de fois est-elle répétée ?');
    if(t===1)return num(Math.pow(b,k)+' = '+b+'<sup>?</sup> (donne l’exposant).',k,'On décompose '+Math.pow(b,k)+' = '+r+'. La base '+b+' est répétée '+k+' fois, donc l’exposant est '+k+'.','Décompose le nombre en facteurs égaux à '+b+'.');
    var z=ri(3,7);return num('Combien de zéros y a-t-il dans 10'+sp(z)+' écrit en chiffres ?',z,'Pour une puissance de 10, l’exposant est le nombre de zéros : 10'+sp(z)+' = 1'+new Array(z+1).join('0')+'.','Écris 10 × 10 × … et compte.');
  }
  if(t===0){var c=ri(2,4),e=ri(2,4),v=Math.pow(-c,e);return num(rl(-c)+sp(e)+' = ?',v,'Le signe dépend du nombre de facteurs négatifs : '+e+' facteurs, donc le résultat est '+(v<0?'négatif':'positif')+' : '+sg(v)+'.','Compte les facteurs négatifs : pair donne positif, impair donne négatif.')}
  if(t===1){var u=ri(2,5),w=ri(2,4);return num('Calcule '+u+sp(w)+' − '+u+' × '+w+'.',Math.pow(u,w)-u*w,u+sp(w)+' = '+Math.pow(u,w)+' et '+u+' × '+w+' = '+(u*w)+'. Donc '+Math.pow(u,w)+' − '+(u*w)+' = '+(Math.pow(u,w)-u*w)+'.','Une puissance n’est pas une multiplication par l’exposant.')}
  var d1=ri(2,4),d2=ri(2,3);return num('Calcule '+d1+sp(d2)+' + '+d2+sp(d1)+'.',Math.pow(d1,d2)+Math.pow(d2,d1),d1+sp(d2)+' = '+Math.pow(d1,d2)+' et '+d2+sp(d1)+' = '+Math.pow(d2,d1)+'. La somme est '+(Math.pow(d1,d2)+Math.pow(d2,d1))+'.','Calcule chaque puissance séparément.');
};
G.cpar=function(s){
  var k,n,p,q,a,b,i,cnt,list;
  if(s===1){k=ri(3,12);n=k*k;return qcm('Lequel de ces nombres est un carré parfait ?',String(n),distinct(n,[n-1,n+2,n+k]),n+' = '+k+' × '+k+' = '+k+sp(2)+' : c’est le carré d’un entier.','Cherche le nombre qui s’écrit n × n avec n entier.')}
  if(s===2){k=ri(4,15);n=k*k;return num(n+' = n'+sp(2)+' avec n entier positif. Donne n.',k,k+' × '+k+' = '+n+', donc '+n+' = '+k+sp(2)+'.','Cherche un nombre dont le carré est '+n+'.')}
  p=ri(3,8);q=p+ri(3,6);a=p*p-ri(0,p-2);b=q*q+ri(0,q);cnt=q-p+1;list=[];
  for(i=p;i<=q;i++)list.push(i*i);
  return num('Combien y a-t-il de carrés parfaits entre '+a+' et '+b+' (bornes comprises) ?',cnt,'Les carrés parfaits sont '+list.join(', ')+' : il y en a '+cnt+'.','Liste les carrés des entiers qui tombent dans l’intervalle.');
};
G.rnec=function(s){
  var k,n,t,m;
  if(s===1){k=ri(3,13);return num('Le nombre positif dont le carré est '+(k*k)+' est ? (donne sa valeur)',k,k+' × '+k+' = '+(k*k)+', donc la racine carrée de '+(k*k)+' est '+k+'.','Teste des entiers jusqu’à trouver '+(k*k)+'.')}
  if(s===2){do{n=ri(3,60)}while(isSq(n));k=Math.floor(Math.sqrt(n));return num('Le nombre positif dont le carré est '+n+' est compris entre deux entiers consécutifs k et k + 1. Que vaut k ?',k,k+sp(2)+' = '+(k*k)+' et '+(k+1)+sp(2)+' = '+((k+1)*(k+1))+'. Comme '+(k*k)+' &lt; '+n+' &lt; '+((k+1)*(k+1))+', le nombre est entre '+k+' et '+(k+1)+'.','Encadre '+n+' entre deux carrés parfaits consécutifs.')}
  do{n=ri(2,60)}while(isSq(n));t=Math.floor(Math.sqrt(n)*10)/10;
  return num('Le nombre positif dont le carré est '+n+' est compris entre deux nombres à un chiffre après la virgule : t et t + 0,1. Que vaut t ?',t,'On teste : '+fm(t,1)+sp(2)+' = '+fm(t*t,2)+' &lt; '+n+' et '+fm(t+0.1,1)+sp(2)+' = '+fm((t+0.1)*(t+0.1),2)+' &gt; '+n+'. Donc t = '+fm(t,1)+'.','Teste les dixièmes un à un.');
};
function monoStr(c,vars,ex,showOne){
  var cs=(c===1&&!showOne)?'':(c===-1&&!showOne)?'−':(c<0?'−'+(-c):String(c)),out=cs;
  vars.forEach(function(v,i){out+=v+(ex[i]>1?sp(ex[i]):'')});
  return out;
}
G.mono=function(s){
  var pool=['x','y','z','a','b'],nv=s===3?3:ri(1,2),vars=shuffle(pool).slice(0,nv),ex=[],i,tot=0,c,m;
  if(s===3){ex=[ri(1,3),1,ri(2,4)]}else{for(i=0;i<nv;i++)ex.push(ri(1,4))}
  for(i=0;i<nv;i++)tot+=ex[i];
  if(s===1){c=ri(2,9);m=monoStr(c,vars,ex);return num('Quel est le coefficient du monôme '+m+' ?',c,'Le coefficient est le facteur numérique : '+c+'.','C’est le nombre qui multiplie les variables.')}
  if(s===2){c=nz(-9,9);if(Math.abs(c)===1)c=3;m=monoStr(c,vars,ex);var expl=vars.map(function(v,j){return 'l’exposant de '+v+' est '+ex[j]}).join(', ');return num('Quel est le degré du monôme '+m+' ?',tot,'On additionne les exposants : '+expl+'. Le degré est '+ex.join(' + ')+' = '+tot+'.','Additionne les exposants de toutes les variables, sans oublier ceux qui valent 1.')}
  c=nz(-9,9);if(Math.abs(c)===1)c=-2;m=monoStr(c,vars,ex);
  return num('Quel est le degré du monôme '+m+' ? Attention aux exposants qui ne sont pas écrits.',tot,'La variable '+vars[1]+' n’a pas d’exposant écrit : son exposant est 1. Degré : '+ex.join(' + ')+' = '+tot+'.','Une variable sans exposant écrit a l’exposant 1.');
};

/* ---------- polynômes : degré, réduction, addition, soustraction ---------- */
function tm(c,ex,vars,first){
  var vp='',i,a=Math.abs(c),body;
  for(i=0;i<vars.length;i++){if(ex[i]>0)vp+=vars[i]+(ex[i]>1?sp(ex[i]):'')}
  body=vp?((a===1?'':String(a))+vp):String(a);
  if(first)return (c<0?'−':'')+body;
  return (c<0?' − ':' + ')+body;
}
function pStr(terms,vars){
  var t=terms.filter(function(x){return x[0]!==0});
  if(!t.length)return '0';
  return t.map(function(x,i){return tm(x[0],x[1],vars,i===0)}).join('');
}
function tdeg(t){return t[1].reduce(function(a,b){return a+b},0)}
function pcomb(A,B,sign){
  var m={},keys=[];
  A.concat(B.map(function(t){return [sign*t[0],t[1]]})).forEach(function(t){
    var k=t[1].join(',');
    if(!(k in m)){m[k]=[0,t[1]];keys.push(k)}
    m[k][0]+=t[0];
  });
  return keys.sort(function(a,b){
    var da=m[a][1].reduce(function(x,y){return x+y},0),db=m[b][1].reduce(function(x,y){return x+y},0);
    return db-da||(a<b?1:-1);
  }).map(function(k){return m[k]});
}
function pwrongs(res,vars,extra){
  var c=(extra||[]).slice(),i;
  var nz2=res.filter(function(t){return t[0]!==0});
  nz2.forEach(function(t,j){
    var a=nz2.map(function(u){return [u[0],u[1]]});a[j][0]=-a[j][0];c.push(pStr(a,vars));
    var b=nz2.map(function(u){return [u[0],u[1]]});b[j][0]=b[j][0]+(t[0]>0?1:-1);c.push(pStr(b,vars));
    var b2=nz2.map(function(u){return [u[0],u[1]]});b2[j][0]=b2[j][0]+(t[0]>0?2:-2);c.push(pStr(b2,vars));
  });
  return c;
}
G.pdeg=function(s){
  var ex,i,terms,d,x;
  if(s===1){
    ex=shuffle([0,1,2,3,4,5]).slice(0,3);
    terms=ex.map(function(e){return [nz(-9,9),[e]]});
    d=Math.max.apply(null,ex);
    return num('Quel est le degré du polynôme '+pStr(terms,['x'])+' ?',d,'Degré de chaque terme : '+terms.map(tdeg).join(' ; ')+'. Le plus grand est '+d+'. Le degré du polynôme est donc '+d+'.','Cherche le plus grand des degrés des termes.');
  }
  if(s===2){
    var vs=['x','y'];
    terms=[];
    var seen={};
    while(terms.length<3){
      var e1=ri(0,3),e2=ri(0,3),k=e1+','+e2;
      if(seen[k]||e1+e2===0)continue;
      seen[k]=1;terms.push([nz(-9,9),[e1,e2]]);
    }
    d=Math.max.apply(null,terms.map(tdeg));
    return num('Quel est le degré du polynôme '+pStr(terms,vs)+' ?',d,'Degré de chaque terme (somme des exposants) : '+terms.map(tdeg).join(' ; ')+'. Le plus grand est '+d+'.','Additionne les exposants dans chaque terme, puis prends le plus grand.');
  }
  var m=ri(3,4),a=nz(-6,6),p=ri(1,m-2),q=p+ri(1,m-p-1);
  var t=shuffle([[a,[m]],[nz(-9,9),[q]],[-a,[m]],[nz(-9,9),[p]]]);
  return num('Réduis d’abord, puis donne le degré du polynôme '+pStr(t,['x'])+'.',q,'Les termes en x'+sp(m)+' se compensent : '+sg(a)+' + '+rl(-a)+' = 0. Il reste des termes de degrés '+q+' et '+p+'. Le degré est '+q+'.','Regroupe les termes semblables avant de chercher le degré.');
};
G.pred=function(s){
  var vs,a,b,c,d,e,f,t,res,right;
  if(s===1){
    a=ri(2,9);vs=['x','y'];var ex=[ri(1,3),ri(1,3)];
    var ok=nz(-9,9);if(ok===a)ok=-a;
    var w1=[ex[0]+1,ex[1]],w2=[ex[1],ex[0]],w3=[ex[0],0];
    if(w2[0]===ex[0]&&w2[1]===ex[1])w2=[ex[0],ex[1]+1];
    var ts=[tm(ok,ex,vs,true),tm(a,w1,vs,true),tm(a,w2,vs,true),tm(a,w3,vs,true)];
    return qcm('Quel terme est semblable à '+tm(a,ex,vs,true)+' ?',ts[0],ts.slice(1),'Deux termes sont semblables s’ils ont les mêmes variables avec les mêmes exposants. '+ts[0]+' a les variables x et y avec les exposants '+ex[0]+' et '+ex[1]+', comme '+tm(a,ex,vs,true)+'.','Compare les variables et les exposants, pas les coefficients.');
  }
  vs=['x'];
  if(s===2){
    a=nz(-9,9);c=nz(-9,9);b=nz(-9,9);d=nz(-9,9);
    while(a+c===0&&b+d===0){d=nz(-9,9)}
    t=shuffle([[a,[1]],[b,[0]],[c,[1]],[d,[0]]]);
    res=[[a+c,[1]],[b+d,[0]]];right=pStr(res,vs);
    return qcm('Réduis '+pStr(t,vs)+'.',right,distinct(right,pwrongs(res,vs,[pStr([[a+c+b+d,[1]]],vs)]).slice(0,8)).slice(0,3),'Je regroupe : ('+sg(a)+'x '+(c<0?'−':'+')+' '+Math.abs(c)+'x) + ('+sg(b)+' '+(d<0?'−':'+')+' '+Math.abs(d)+'). Je réduis : '+right+'.','Les termes en x vont ensemble, les nombres vont ensemble.');
  }
  do{a=nz(-6,6);b=nz(-9,9);c=nz(-9,9);d=nz(-6,6);e=nz(-9,9);f=nz(-9,9)}while(a+d===0&&b+e===0&&c+f===0);
  t=shuffle([[a,[2]],[b,[1]],[c,[0]],[d,[2]],[e,[1]],[f,[0]]]);
  res=[[a+d,[2]],[b+e,[1]],[c+f,[0]]];right=pStr(res,vs);
  return qcm('Réduis '+pStr(t,vs)+'.',right,distinct(right,[pStr([[a+d+b+e,[2]],[c+f,[0]]],vs)].concat(pwrongs(res,vs)).slice(0,10)).slice(0,3),'Termes en x'+sp(2)+' : '+sg(a)+' + '+rl(d)+' = '+(a+d)+'. Termes en x : '+sg(b)+' + '+rl(e)+' = '+(b+e)+'. Nombres : '+sg(c)+' + '+rl(f)+' = '+(c+f)+'. Résultat : '+right+'.','On ne regroupe que les termes qui ont le même exposant.');
};
function pPair(s){
  var vs,A,B;
  if(s===1){vs=['x'];A=[[nz(-9,9),[1]],[nz(-9,9),[0]]];B=[[nz(-9,9),[1]],[nz(-9,9),[0]]]}
  else if(s===2){vs=['x'];A=[[nz(-6,6),[2]],[nz(-9,9),[1]],[nz(-9,9),[0]]];B=[[nz(-6,6),[2]],[nz(-9,9),[1]],[nz(-9,9),[0]]]}
  else{vs=['x','y'];A=[[nz(-9,9),[1,0]],[nz(-9,9),[0,1]],[nz(-9,9),[0,0]]];B=[[nz(-9,9),[1,0]],[nz(-9,9),[0,1]],[nz(-9,9),[0,0]]]}
  return {vs:vs,A:A,B:B};
}
G.padd=function(s){
  var p,res,right;do{p=pPair(s);res=pcomb(p.A,p.B,1);right=pStr(res,p.vs)}while(right==='0');
  var ws=distinct(right,pwrongs(res,p.vs,[pStr(pcomb(p.A,p.B,-1),p.vs)]).slice(0,10)).slice(0,3);
  return qcm('Effectue l’addition : ('+pStr(p.A,p.vs)+') + ('+pStr(p.B,p.vs)+').',right,ws,'J’enlève les parenthèses (signe + : les signes ne changent pas). Je regroupe les termes semblables et j’additionne leurs coefficients. Résultat : '+right+'.','Pas de changement de signe quand les parenthèses sont précédées de +.');
};
G.psub=function(s){
  var p,res,right;do{p=pPair(s);res=pcomb(p.A,p.B,-1);right=pStr(res,p.vs)}while(right==='0');
  var oneSign=pcomb(p.A,[[-p.B[0][0],p.B[0][1]]].concat(p.B.slice(1)),1);
  var ws=distinct(right,[pStr(pcomb(p.A,p.B,1),p.vs),pStr(oneSign,p.vs)].concat(pwrongs(res,p.vs)).slice(0,10)).slice(0,3);
  return qcm('Effectue la soustraction : ('+pStr(p.A,p.vs)+') − ('+pStr(p.B,p.vs)+').',right,ws,'Je transforme la soustraction en addition de l’opposé : je change le signe de tous les termes de ('+pStr(p.B,p.vs)+'). J’enlève les parenthèses, je regroupe, je calcule. Résultat : '+right+'.','Le signe − change le signe de chaque terme du second polynôme, pas seulement du premier.');
};

/* ---------- multiplication de monômes et de polynômes, suites de motifs ---------- */
function fo(a,b){return tm(a,[1],['n'],true)+(b>0?' + '+b:b<0?' − '+(-b):'')}
G.pmon=function(s){
  var vs=s===1?['x']:['x','y'],c1,c2,e1,e2,res,right;
  if(s===1){c1=ri(2,9);c2=ri(2,9);e1=[ri(1,4)];e2=[ri(1,4)]}
  else if(s===2){c1=nz(-9,9);c2=nz(-9,9);e1=[ri(1,3),ri(0,2)];e2=[ri(0,3),ri(1,2)]}
  else{c1=nz(-9,-2);c2=nz(-9,9);if(Math.abs(c2)===1)c2=-3;e1=[ri(1,3),ri(1,3)];e2=[ri(1,3),ri(1,3)]}
  var es=e1.map(function(v,i){return v+e2[i]});
  res=[[c1*c2,es]];right=pStr(res,vs);
  var wr=[pStr([[c1+c2,es]],vs),pStr([[c1*c2,e1.map(function(v,i){return v*e2[i]})]],vs),pStr([[-c1*c2,es]],vs),pStr([[c1*c2,es.map(function(v,i){return i===0?v+1:v})]],vs)];
  return qcm('Calcule ('+tm(c1,e1,vs,true)+') × ('+tm(c2,e2,vs,true)+').',right,distinct(right,wr).slice(0,3),'Je multiplie les coefficients : '+rl(c1)+' × '+rl(c2)+' = '+(c1*c2)+'. Je multiplie les variables : j’additionne les exposants de chaque variable. Résultat : '+right+'.','Les coefficients se multiplient, les exposants de la même variable s’additionnent.');
};
G.pbim=function(s){
  var vs=s===3?['x','y']:['x'],cm,em,B,i,prod,right,wr,e0;
  if(s===1){cm=ri(2,5);em=[1];B=[[ri(1,3),[1]],[ri(1,6),[0]]]}
  else if(s===2){cm=nz(-5,5);em=[ri(1,2)];B=[[nz(-4,4),[1]],[nz(-7,7),[0]]]}
  else{cm=nz(-5,5);em=[1,1];B=[[nz(-4,4),[1,0]],[nz(-6,6),[0,1]]]}
  prod=B.map(function(t){return [cm*t[0],t[1].map(function(v,j){return v+em[j]})]});
  right=pStr(prod,vs);
  wr=[pStr([prod[0],[cm*B[1][0],B[1][1]]],vs),pStr([prod[0],[-prod[1][0],prod[1][1]]],vs),pStr([[-prod[0][0],prod[0][1]],prod[1]],vs),pStr([prod[0],[B[1][0],prod[1][1]]],vs),pStr([[cm+B[0][0],prod[0][1]],prod[1]],vs)];
  return qcm('Développe '+tm(cm,em,vs,true)+'('+pStr(B,vs)+').',right,distinct(right,wr).slice(0,3),'Je multiplie le monôme par chaque terme du binôme : '+prod.map(function(t){return '('+tm(t[0],t[1],vs,true)+')'}).join(' et ')+'. Résultat : '+right+'.','N’oublie pas de multiplier le second terme aussi, et surveille les signes.');
};
G.pbb=function(s){
  var a,b,c,d,res,right,wr,vs=['x'];
  if(s===1){a=1;c=1;b=ri(1,6);d=ri(1,6)}
  else if(s===2){a=ri(1,4);c=ri(1,4);b=ri(1,6);d=ri(1,6)}
  else{a=ri(1,4);c=ri(1,4);b=nz(-6,6);d=nz(-6,6)}
  res=[[a*c,[2]],[a*d+b*c,[1]],[b*d,[0]]];right=pStr(res,vs);
  wr=[pStr([[a*c,[2]],[b*d,[0]]],vs),pStr([[a*c,[2]],[a*d+b*c,[1]],[-b*d,[0]]],vs),pStr([[a*c,[2]],[a*d-b*c,[1]],[b*d,[0]]],vs),pStr([[a*c,[2]],[a*d+b*c+1,[1]],[b*d,[0]]],vs)];
  return qcm('Développe ('+pStr([[a,[1]],[b,[0]]],vs)+')('+pStr([[c,[1]],[d,[0]]],vs)+').',right,distinct(right,wr).slice(0,3),'Je distribue : ('+tm(a*c,[2],vs,true)+') + ('+tm(a*d,[1],vs,true)+') + ('+tm(b*c,[1],vs,true)+') + ('+tm(b*d,[0],vs,true)+'). J’additionne les termes de même degré : '+right+'.','Chaque terme du premier binôme multiplie chaque terme du second : quatre produits.');
};
G.ppat=function(s){
  var a,b,u1,it=pick(['carrés','jetons','points','bâtonnets']),k,right,wr,intro;
  if(s===1){
    a=ri(2,5);u1=a+ri(1,4);
    return num('Rang 1 : '+u1+' '+it+', rang 2 : '+(u1+a)+' '+it+', rang 3 : '+(u1+2*a)+' '+it+'. Combien y en a-t-il au rang 4 ?',u1+3*a,'D’un rang au suivant, on ajoute '+a+'. Rang 4 : '+(u1+2*a)+' + '+a+' = '+(u1+3*a)+'.','Cherche ce qu’on ajoute d’un rang au suivant.');
  }
  if(s===2){
    a=ri(2,5);b=ri(0,4);u1=a+b;right=fo(a,b);
    wr=[fo(a+1,b),fo(a,b+1),fo(a,b?b+2:2),fo(1,u1),fo(u1,0)];
    return qcm('Rang 1 : '+u1+' '+it+', rang 2 : '+(u1+a)+' '+it+', rang 3 : '+(u1+2*a)+' '+it+'. Quelle formule donne le nombre d’éléments au rang n ?',right,distinct(right,wr).slice(0,3),'On ajoute '+a+' à chaque rang : la formule commence par '+tm(a,[1],['n'],true)+'. Au rang 1 on a '+u1+', donc il faut ajouter '+b+'. Formule : '+right+'.','Teste ta formule avec n = 1 et n = 2.');
  }
  if(ri(0,1)){
    b=pick([2,3]);k=ri(4,6);
    return num('Ligne 1 : 1 lettre, ligne 2 : '+b+' lettres, ligne 3 : '+(b*b)+' lettres. À chaque ligne, le nombre est multiplié par '+b+'. Combien de lettres à la ligne '+k+' ?',Math.pow(b,k-1),'Ligne n : '+b+sp('n − 1')+'. Ligne '+k+' : '+b+sp(k-1)+' = '+Math.pow(b,k-1)+'.','On multiplie par '+b+' à chaque nouvelle ligne : combien de fois à partir de la ligne 1 ?');
  }
  a=ri(2,5);b=ri(0,4);u1=a+b;k=ri(8,15);
  return num('Rang 1 : '+u1+' '+it+', rang 2 : '+(u1+a)+' '+it+', rang 3 : '+(u1+2*a)+' '+it+'. Combien y en a-t-il au rang '+k+' ?',a*k+b,'Formule : '+fo(a,b)+'. Au rang '+k+' : '+a+' × '+k+(b?' + '+b:'')+' = '+(a*k+b)+'.','Trouve d’abord la formule au rang n, puis remplace n.');
};

/* ---------- division de monômes, équations à deux inconnues ---------- */
function eq2(a,b,c){
  return tm(a,[1],['x'],true)+(b<0?' − ':' + ')+(Math.abs(b)===1?'':Math.abs(b))+'y = '+sg(c);
}
G.pdm=function(s){
  var vs=s===1?['x']:['x','y'],b,k,a,q,m,i,dd=[],dv=[],dq=[];
  if(s===1){b=ri(2,6);k=ri(2,6);q=[ri(1,3)];m=[q[0]+ri(1,3)]}
  else if(s===2){do{b=nz(-6,6)}while(Math.abs(b)<2);k=nz(-6,6);q=[ri(1,2),ri(1,2)];m=[q[0]+ri(1,3),q[1]+ri(0,2)]}
  else{b=nz(-7,-2);k=nz(-7,7);q=[ri(1,3),ri(1,3)];m=[q[0]+ri(1,2),q[1]+ri(0,2)]}
  a=b*k;
  var d=m.map(function(v,j){return v-q[j]});
  var right=pStr([[k,d]],vs);
  var wr=[pStr([[k,m.map(function(v,j){return v+q[j]})]],vs),pStr([[a-b,d]],vs),pStr([[-k,d]],vs),pStr([[k,d.map(function(v,j){return j===0?v+1:v})]],vs)];
  return qcm('Effectue la division : ('+tm(a,m,vs,true)+') ÷ ('+tm(b,q,vs,true)+').',right,distinct(right,wr).slice(0,3),'Coefficients : '+sg(a)+' ÷ '+rl(b)+' = '+sg(k)+'. Pour chaque variable, j’enlève l’exposant du diviseur à celui du dividende. Résultat : '+right+'.','Les coefficients se divisent, les exposants de la même variable se soustraient.');
};
G.pdb=function(s){
  var vs,M,Q,d,q1,q2,e,a1,a2,T,right,wr;
  if(s===3){
    vs=['x','y'];d=ri(2,7);q1=nz(-6,6);q2=nz(-6,6);a1=ri(1,2);a2=ri(1,2);
    M=[d,[1,1]];Q=[[q1,[a1,0]],[q2,[0,a2]]];
  }else{
    vs=['x'];d=s===1?ri(2,6):ri(2,7);e=ri(1,2);
    q1=s===1?ri(1,6):nz(-6,6);q2=s===1?ri(1,6):nz(-6,6);a1=ri(1,3);a2=ri(0,a1-1);
    M=[d,[e]];Q=[[q1,[a1]],[q2,[a2]]];
  }
  T=Q.map(function(t){return [d*t[0],t[1].map(function(v,j){return v+M[1][j]})]});
  right=pStr(Q,vs);
  wr=[pStr([Q[0],[-q2,Q[1][1]]],vs),pStr([Q[0],T[1]],vs),pStr([[-q1,Q[0][1]],Q[1]],vs),pStr([Q[0],[q2*d,Q[1][1]]],vs),pStr([[q1,Q[0][1]],[q2+1,Q[1][1]]],vs)];
  return qcm('Effectue la division : ('+pStr(T,vs)+') ÷ ('+tm(d,M[1],vs,true)+').',right,distinct(right,wr).slice(0,3),'Je sépare en deux fractions en gardant le signe : ('+tm(T[0][0],T[0][1],vs,true)+') ÷ ('+tm(d,M[1],vs,true)+') et ('+tm(T[1][0],T[1][1],vs,true)+') ÷ ('+tm(d,M[1],vs,true)+'). Je simplifie chacune. Résultat : '+right+'.','Divise chaque terme du numérateur par le diviseur, et garde le signe entre les deux.');
};
G.peq=function(s){
  var a,b,c,x,y,t,right,wr;
  if(s===1){
    a=ri(2,9);b=ri(2,9);while(b===a)b=ri(2,9);x=ri(1,4);y=ri(1,4);c=a*x+b*y;
    right=eq2(a,b,c);
    wr=[eq2(b,a,c),'x + y = '+c,eq2(a,-b,c),eq2(a,b,x+y)];
    return qcm('Un cahier coûte '+a+' DH et un stylo coûte '+b+' DH. Karim paie '+c+' DH. Soit x le nombre de cahiers et y le nombre de stylos. Quelle équation traduit la situation ?',right,distinct(right,wr).slice(0,3),'Les cahiers coûtent '+a+'x DH et les stylos '+b+'y DH. Le total est '+c+' DH : '+right+'.','Prix d’un article × nombre d’articles, pour chaque sorte.');
  }
  if(s===2){
    x=ri(2,7);y=ri(2,7);c=4*x+2*y;right=eq2(4,2,c);
    wr=[eq2(2,4,c),'x + y = '+c,eq2(4,-2,c),eq2(4,2,x+y)];
    return qcm('Dans un parking, il y a des voitures (4 roues) et des motos (2 roues). On compte '+c+' roues. Soit x le nombre de voitures et y le nombre de motos. Quelle équation traduit la situation ?',right,distinct(right,wr).slice(0,3),'Les voitures ont 4x roues et les motos 2y roues. Au total : '+right+'.','Chaque voiture a 4 roues, chaque moto en a 2.');
  }
  var words={2:'double',3:'triple',4:'quadruple'},plus=ri(0,1)===1;
  a=ri(2,4);do{b=ri(2,4)}while(b===a);x=ri(1,6);y=ri(1,6);c=a*x+(plus?b*y:-b*y);
  right=eq2(a,plus?b:-b,c);
  wr=[eq2(b,plus?a:-a,c),eq2(a,plus?-b:b,c),'x '+(plus?'+':'−')+' y = '+sg(c),eq2(a,plus?b:-b,c+1)];
  return qcm('Le '+words[a]+' d’un nombre x '+(plus?'augmenté':'diminué')+' du '+words[b]+' d’un nombre y est égal à '+sg(c)+'. Quelle équation traduit cette phrase ?',right,distinct(right,wr).slice(0,3),'Le '+words[a]+' de x s’écrit '+a+'x et le '+words[b]+' de y s’écrit '+b+'y. Résultat : '+right+'.','Double = 2 fois, triple = 3 fois, quadruple = 4 fois.');
};
G.pvaly=function(s){
  var a,b,c,x,y,ask;
  if(s===1){a=ri(2,6);b=ri(2,6);x=ri(1,6);y=ri(1,6)}
  else if(s===2){a=ri(2,6);b=-ri(2,6);x=ri(1,6);y=ri(1,6)}
  else{a=nz(-7,7);if(Math.abs(a)<2)a=-3;b=nz(-7,7);if(Math.abs(b)<2)b=4;x=nz(-6,6);y=nz(-6,6)}
  c=a*x+b*y;ask=s===3&&ri(0,1)===1;
  if(!ask)return num('Dans l’équation '+eq2(a,b,c)+', calcule y pour x = '+sg(x)+'.',y,'Je remplace x par '+rl(x)+' : '+sg(a*x)+(b<0?' − ':' + ')+Math.abs(b)+'y = '+sg(c)+'. J’isole y : '+sg(b)+'y = '+sg(c-a*x)+', donc y = '+sg(y)+'. Vérification : '+sg(a)+' × '+rl(x)+' + '+rl(b)+' × '+rl(y)+' = '+sg(c)+'.','Remplace x, soustrais le terme en x aux deux membres, puis divise.');
  return num('Dans l’équation '+eq2(a,b,c)+', calcule x pour y = '+sg(y)+'.',x,'Je remplace y par '+rl(y)+' : '+sg(a)+'x '+(b*y<0?'− ':'+ ')+Math.abs(b*y)+' = '+sg(c)+'. J’isole x : '+sg(a)+'x = '+sg(c-b*y)+', donc x = '+sg(x)+'. Vérification : '+sg(a)+' × '+rl(x)+' + '+rl(b)+' × '+rl(y)+' = '+sg(c)+'.','Remplace y, déplace le terme connu de l’autre côté, puis divise.');
};

/* ---------- 1AC : nombres négatifs, droite graduée, valeur absolue, comparaison ---------- */
G.nneg=function(s){
  var k,a,i,list,cnt,d,t;
  if(s===1){
    k=ri(1,9);var others=shuffle([ri(1,9),ri(10,19),0,ri(2,8)]);
    return qcm('Lequel de ces nombres est inférieur à 0 ?',sg(-k),distinct(sg(-k),others),sg(-k)+' porte le signe − : il est inférieur à 0. Les autres sont positifs ou nuls.','Un nombre inférieur à 0 est un nombre négatif.');
  }
  if(s===2){
    list=[];cnt=0;
    for(i=0;i<6;i++){a=ri(0,3)===0?0:nz(-9,9);list.push(a);if(a<0)cnt++}
    return num('Combien de nombres négatifs y a-t-il dans la liste : '+list.map(sg).join(' ; ')+' ?',cnt,'Les nombres négatifs sont ceux qui sont strictement inférieurs à 0. Le nombre 0 n’est ni positif ni négatif. Il y en a '+cnt+'.','Compare chaque nombre à 0. Attention au nombre 0.');
  }
  d=ri(2,30);t=ri(0,4);
  var cases=[
    ['Un plongeur est à '+d+' m sous le niveau de la mer. Quel nombre exprime son altitude en mètres ?',-d,'« Sous le niveau de la mer » est en dessous de 0 : le nombre est négatif.'],
    ['Il fait '+d+' °C en dessous de zéro. Quelle est la température ?',-d,'« En dessous de zéro » se traduit par un nombre négatif.'],
    ['Le solde d’un compte est à découvert de '+d+' DH. Quel nombre exprime ce solde ?',-d,'Un découvert est une dette : le nombre est négatif.'],
    ['Un oiseau vole à '+d+' m au-dessus du niveau de la mer. Quel nombre exprime son altitude ?',d,'« Au-dessus » du niveau 0 se traduit par un nombre positif.'],
    ['Un ascenseur est descendu de '+d+' étages sous le rez-de-chaussée. Quel nombre exprime son étage ?',-d,'Sous le rez-de-chaussée (étage 0) : le nombre est négatif.']
  ][t];
  var r=cases[1];
  return qcm(cases[0],sg(r),distinct(sg(r),[sg(-r),'0',sg(r>0?r+2:r-2)]),cases[2]+' Réponse : '+sg(r)+'.','Au-dessus de 0 : positif. En dessous de 0 : négatif.');
};
G.nabs=function(s){
  var d,a,left;
  if(s===1){
    d=ri(1,9);left=ri(0,1)===1;
    return num('Sur une droite graduée de pas 1, un point est situé à '+d+' unités à '+(left?'gauche':'droite')+' de l’origine O. Quelle est son abscisse ?',left?-d:d,'À gauche de O, l’abscisse est négative. À droite de O, elle est positive. Ici : '+sg(left?-d:d)+'.','Gauche de O : négatif. Droite de O : positif.');
  }
  if(s===2){
    a=nz(-9,-1);d=ri(2,9);
    return num('Sur une droite graduée, le point A a pour abscisse '+sg(a)+'. Le point B est situé à '+d+' unités à droite de A. Quelle est l’abscisse de B ?',a+d,'On part de '+sg(a)+' et on avance de '+d+' vers la droite : '+sg(a)+' + '+d+' = '+sg(a+d)+'.','Aller vers la droite fait augmenter l’abscisse.');
  }
  a=nz(-5,5);d=ri(3,9);
  return num('Sur une droite graduée, le point A a pour abscisse '+sg(a)+'. Le point B est situé à '+d+' unités à gauche de A. Quelle est l’abscisse de B ?',a-d,'On part de '+sg(a)+' et on recule de '+d+' vers la gauche : '+sg(a)+' − '+d+' = '+sg(a-d)+'.','Aller vers la gauche fait diminuer l’abscisse.');
};
G.nval=function(s){
  var a,k,b;
  if(s===1){
    a=nz(-15,15);
    return num('Quelle est la valeur absolue de '+sg(a)+' ?',Math.abs(a),'La valeur absolue est la distance à 0. '+sg(a)+' est à '+Math.abs(a)+' unités de 0. Sa valeur absolue est '+Math.abs(a)+'.','Une distance n’est jamais négative.');
  }
  if(s===2){
    k=ri(2,12);b=k+ri(1,4);
    return qcm('Lequel de ces nombres n’a pas pour valeur absolue '+k+' ?',sg(b),distinct(sg(b),[sg(k),sg(-k)]),sg(k)+' et '+sg(-k)+' sont à '+k+' unités de 0. Le nombre '+sg(b)+' est à '+b+' unités de 0 : sa valeur absolue est '+b+'.','Deux nombres opposés ont la même valeur absolue.');
  }
  a=nz(-12,12);b=nz(-12,12);
  return num('Calcule la somme de la valeur absolue de '+sg(a)+' et de la valeur absolue de '+sg(b)+'.',Math.abs(a)+Math.abs(b),'Valeur absolue de '+sg(a)+' : '+Math.abs(a)+'. Valeur absolue de '+sg(b)+' : '+Math.abs(b)+'. Somme : '+(Math.abs(a)+Math.abs(b))+'.','Remplace chaque nombre par sa distance à 0, puis additionne.');
};
G.ncmp=function(s){
  var a,b,r,x,sorted,i;
  if(s===1){
    a=ri(1,9);b=ri(1,9);if(ri(0,1)){x=-a;a=b;b=x;}else{x=-b;b=a;a=x;}
    r=a<b?'<':'>';
    return qcm('Compare : '+sg(a)+' ◻ '+rl(b),r,['<','>','='].filter(function(c){return c!==r}),(a<0?sg(a)+' est négatif et '+sg(b)+' est positif':sg(a)+' est positif et '+sg(b)+' est négatif')+'. Un nombre négatif est inférieur à un nombre positif. Donc '+sg(a)+' '+r+' '+sg(b)+'.','Regarde d’abord les signes.');
  }
  if(s===2){
    a=ri(1,15);do{b=ri(1,15)}while(b===a);a=-a;b=-b;
    r=a<b?'<':'>';
    return qcm('Compare : '+sg(a)+' ◻ '+rl(b),r,['<','>','='].filter(function(c){return c!==r}),'Les deux nombres sont négatifs. Le plus éloigné de 0 est le plus petit : '+sg(Math.min(a,b))+' est à '+Math.abs(Math.min(a,b))+' unités de 0, '+sg(Math.max(a,b))+' à '+Math.abs(Math.max(a,b))+'. Donc '+sg(a)+' '+r+' '+sg(b)+'.','Pour deux négatifs, le plus petit est celui qui est le plus loin de 0.');
  }
  var pool=shuffle([-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9]),lst=pool.slice(0,4);
  if(lst.filter(function(v){return v<0}).length===0)lst[0]=-lst[0];
  sorted=lst.slice().sort(function(p,q){return p-q});
  var right=sorted.map(sg).join(' < ');
  var wr=[sorted.slice().reverse().map(sg).join(' < '),lst.slice().sort(function(p,q){return Math.abs(p)-Math.abs(q)||p-q}).map(sg).join(' < '),sorted.map(function(v){return sg(-v)}).join(' < '),lst.map(sg).join(' < ')];
  return qcm('Range dans l’ordre croissant : '+lst.map(sg).join(' ; ')+'.',right,distinct(right,wr).slice(0,3),'On sépare : négatifs '+sorted.filter(function(v){return v<0}).map(sg).join(' ; ')+' et positifs '+(sorted.filter(function(v){return v>0}).map(sg).join(' ; ')||'aucun')+'. Les négatifs sont avant les positifs ; entre négatifs, le plus éloigné de 0 est le plus petit. Ordre croissant : '+right+'.','Négatifs d’abord, du plus éloigné de 0 au plus proche, puis les positifs.');
};

/* ---------- 1AC : addition et soustraction des entiers relatifs ---------- */
function pl(list){return list.map(rl).join(' + ')}
G.nadd1=function(s){
  var a,b,c;
  if(s===1){a=nz(-6,6);b=nz(-5,5)}
  else if(s===2){a=nz(-12,12);b=nz(-12,12)}
  else{a=nz(-9,9);b=nz(-9,9);c=nz(-9,9);
    return num('On part du point d’abscisse '+sg(a)+', on se déplace de '+sg(b)+' puis de '+sg(c)+'. Quelle est l’abscisse du point d’arrivée ?',a+b+c,'Premier déplacement : '+sg(a)+' + '+rl(b)+' = '+sg(a+b)+'. Second déplacement : '+sg(a+b)+' + '+rl(c)+' = '+sg(a+b+c)+'.','Déplace-toi vers la droite pour un nombre positif et vers la gauche pour un nombre négatif.');}
  return num('Calcule '+rl(a)+' + '+rl(b)+' en utilisant la droite numérique.',a+b,'Je me place en '+sg(a)+'. Je me déplace de '+Math.abs(b)+' unités vers la '+(b>0?'droite':'gauche')+' car '+sg(b)+' est '+(b>0?'positif':'négatif')+'. J’arrive en '+sg(a+b)+'.','Positif : vers la droite. Négatif : vers la gauche.');
};
G.nadd2=function(s){
  var a,b,sgn,k;
  if(s===1){sgn=ri(0,1)?1:-1;a=sgn*ri(1,20);b=sgn*ri(1,20);return num('Calcule '+rl(a)+' + '+rl(b)+'.',a+b,'Les deux nombres ont le même signe ('+(sgn>0?'+':'−')+'). Règle 1 : je garde ce signe et j’additionne les valeurs absolues : '+Math.abs(a)+' + '+Math.abs(b)+' = '+(Math.abs(a)+Math.abs(b))+'. Résultat : '+sg(a+b)+'.','Même signe : on additionne les distances à 0 et on garde le signe.');}
  if(s===2){do{a=nz(-20,20);b=nz(-20,20)}while(a*b>0||Math.abs(a)===Math.abs(b));return num('Calcule '+rl(a)+' + '+rl(b)+'.',a+b,'Les signes sont contraires. Règle 2 : je garde le signe du nombre qui a la plus grande valeur absolue, puis je soustrais la plus petite valeur absolue de la plus grande : '+Math.max(Math.abs(a),Math.abs(b))+' − '+Math.min(Math.abs(a),Math.abs(b))+' = '+Math.abs(a+b)+'. Résultat : '+sg(a+b)+'.','Signes contraires : on soustrait les distances à 0 et on garde le signe du plus éloigné.');}
  k=ri(0,2);
  if(k===0){sgn=ri(0,1)?1:-1;a=sgn*ri(1,20);b=sgn*ri(1,20)}
  else if(k===1){do{a=nz(-20,20);b=nz(-20,20)}while(a*b>0||Math.abs(a)===Math.abs(b))}
  else{a=nz(-20,20);b=-a}
  var rules=['Règle 1 : même signe','Règle 2 : signes contraires','Règle 3 : nombres opposés (somme nulle)'];
  return qcm('Quelle règle faut-il appliquer pour calculer '+rl(a)+' + '+rl(b)+' ?',rules[k],rules.filter(function(x,i){return i!==k}),k===0?'Les deux nombres ont le même signe.':k===1?'Les deux nombres ont des signes contraires et des valeurs absolues différentes.':'Les deux nombres sont opposés : leur somme est 0.','Observe d’abord les signes des deux nombres.');
};
G.nadd3=function(s){
  var x,y,p1,n1,p2,n2,q,list,tot,ex;
  if(s===1){x=ri(5,40);y=nz(-30,30);list=shuffle([x,y,-x]);tot=y;ex='Les nombres '+sg(x)+' et '+sg(-x)+' sont opposés : leur somme est 0. Il reste '+sg(y)+'.'}
  else if(s===2){p1=ri(5,30);p2=ri(5,30);n1=-ri(5,30);n2=-ri(5,30);list=shuffle([p1,n1,p2,n2]);tot=p1+p2+n1+n2;ex='Je regroupe les positifs : '+p1+' + '+p2+' = '+(p1+p2)+'. Je regroupe les négatifs : '+sg(n1)+' + '+rl(n2)+' = '+sg(n1+n2)+'. Somme : '+sg(tot)+'.'}
  else{x=ri(5,30);p1=ri(2,20);n1=-ri(2,20);q=nz(-15,15);list=shuffle([x,-x,p1,n1,q]);tot=p1+n1+q;ex='Les nombres '+sg(x)+' et '+sg(-x)+' s’annulent. Il reste '+sg(p1)+' + '+rl(n1)+' + '+rl(q)+' = '+sg(tot)+'.'}
  return num('Calcule en regroupant les nombres bien choisis : '+pl(list)+'.',tot,ex,'Cherche des nombres opposés, ou regroupe les positifs puis les négatifs.');
};
G.nsub=function(s){
  var a,b,c;
  if(s===1){a=ri(1,15);b=ri(1,15);return num('Calcule '+a+' − '+b+'.',a-b,'Soustraire '+b+', c’est ajouter son opposé '+sg(-b)+' : '+a+' + '+rl(-b)+' = '+sg(a-b)+'.','Soustraire un nombre, c’est ajouter son opposé.');}
  if(s===2){a=nz(-15,15);b=nz(-15,15);return num('Calcule '+rl(a)+' − '+rl(b)+'.',a-b,'Soustraire '+rl(b)+', c’est ajouter son opposé '+sg(-b)+' : '+rl(a)+' + '+rl(-b)+' = '+sg(a-b)+'.','Soustraire un nombre, c’est ajouter son opposé.');}
  a=nz(-12,12);b=nz(-12,12);c=nz(-12,12);
  return num('Calcule '+rl(a)+' − '+rl(b)+' − '+rl(c)+'.',a-b-c,'Je remplace chaque soustraction par l’addition de l’opposé : '+rl(a)+' + '+rl(-b)+' + '+rl(-c)+' = '+sg(a-b-c)+'.','Soustraire un nombre, c’est ajouter son opposé, deux fois.');
};

/* ---------- 1AC : expressions, décimaux, fractions, problèmes, produit ---------- */
function pf(n,d){return n<0?'('+fr(n,d)+')':fr(n,d)}
G.nexp=function(s){
  var a,b,c,d,x,t,P,N,i,list,ex;
  if(s===1){
    a=ri(1,20);b=ri(1,20);c=ri(1,20);
    return num('Calcule '+a+' − '+b+' + '+c+'.',a-b+c,'Je transforme la soustraction : '+a+' + '+rl(-b)+' + '+c+'. Positifs : '+a+' + '+c+' = '+(a+c)+'. Négatif : '+sg(-b)+'. Résultat : '+(a+c)+' + '+rl(-b)+' = '+sg(a-b+c)+'.','Soustraire un nombre, c’est ajouter son opposé.');
  }
  if(s===2){
    a=nz(-12,12);b=nz(-12,12);c=nz(-12,12);d=nz(-12,12);
    list=[a,-b,c,-d];P=0;N=0;
    for(i=0;i<4;i++){if(list[i]>0)P+=list[i];else N+=list[i]}
    return num('Calcule '+rl(a)+' − '+rl(b)+' + '+rl(c)+' − '+rl(d)+'.',a-b+c-d,'Je transforme les soustractions : '+list.map(rl).join(' + ')+'. Somme des positifs : '+sg(P)+'. Somme des négatifs : '+sg(N)+'. Résultat : '+rl(P)+' + '+rl(N)+' = '+sg(P+N)+'.','Remplace chaque soustraction par l’addition de l’opposé, puis regroupe.');
  }
  x=ri(5,20);a=nz(-12,12);b=nz(-12,12);
  return num('Calcule '+rl(x)+' + '+rl(a)+' − '+rl(b)+' + '+rl(-x)+'.',a-b,'Les nombres '+sg(x)+' et '+sg(-x)+' sont opposés : ils s’annulent. Il reste '+rl(a)+' − '+rl(b)+' = '+rl(a)+' + '+rl(-b)+' = '+sg(a-b)+'.','Cherche d’abord les nombres opposés.');
};
G.ndec=function(s){
  var a,b,d,p,q,sub,r,sgn;
  function dc(){return nz(-99,99)/10}
  if(s===1){
    sgn=ri(0,1)?1:-1;a=sgn*ri(11,99)/10;b=sgn*ri(11,99)/10;
    r=Math.round((a+b)*10)/10;
    return num('Calcule '+rl(a)+' + '+rl(b)+'.',r,'Les deux nombres ont le même signe ('+(sgn>0?'+':'−')+'). Je garde ce signe et j’additionne les valeurs absolues : '+sg(Math.abs(a))+' + '+sg(Math.abs(b))+' = '+sg(Math.abs(r))+'. Résultat : '+sg(r)+'.','Même signe : on garde le signe et on additionne les distances à 0.');
  }
  if(s===2){
    do{a=dc();b=dc()}while(a*b>0||Math.abs(a)===Math.abs(b));
    sub=ri(0,1);
    if(sub){r=Math.round((a-b)*10)/10;
      if(a*(-b)>0)return num('Calcule '+rl(a)+' − '+rl(b)+'.',r,'Soustraire '+rl(b)+', c’est ajouter son opposé : '+rl(a)+' + '+rl(-b)+'. Les deux nombres ont le même signe : j’additionne '+sg(Math.abs(a))+' + '+sg(Math.abs(b))+' = '+sg(Math.abs(r))+'. Résultat : '+sg(r)+'.','Soustraire, c’est ajouter l’opposé.');
    }
    r=Math.round((a+b)*10)/10;
    return num('Calcule '+rl(a)+' + '+rl(b)+'.',r,'Les signes sont contraires. Je garde le signe du nombre de plus grande valeur absolue et je soustrais : '+sg(Math.max(Math.abs(a),Math.abs(b)))+' − '+sg(Math.min(Math.abs(a),Math.abs(b)))+' = '+sg(Math.abs(r))+'. Résultat : '+sg(r)+'.','Signes contraires : on soustrait les distances à 0.');
  }
  d=ri(3,9);p=nz(-9,9);q=nz(-9,9);sub=ri(0,1);
  if(sub){return num('Calcule '+pf(p,d)+' − '+pf(q,d)+' (décimal ou fraction).',(p-q)/d,'Soustraire, c’est ajouter l’opposé : '+pf(p,d)+' + '+pf(-q,d)+'. Même dénominateur : '+fr(p-q,d)+' = '+fs(p-q,d)+'.','Même dénominateur : on calcule avec les numérateurs.',{sol:fs(p-q,d),tol:6e-3});}
  return num('Calcule '+pf(p,d)+' + '+pf(q,d)+' (décimal ou fraction).',(p+q)/d,'Même dénominateur : j’additionne les numérateurs relatifs '+rl(p)+' + '+rl(q)+' = '+sg(p+q)+'. Résultat : '+fr(p+q,d)+' = '+fs(p+q,d)+'.','Même dénominateur : on calcule avec les numérateurs.',{sol:fs(p+q,d),tol:6e-3});
};
G.npb=function(s){
  var a,b,c,w,x,y,z;
  if(s===1){
    a=nz(-40,40);b=ri(10,60);c=ri(10,60);
    return num('Le solde d’un compte est de '+sg(a)+' €. Il reçoit '+b+' € puis paie '+c+' €. Quel est le solde final, en euros ?',a+b-c,'Un gain s’écrit avec + et une perte avec −. Expression : '+rl(a)+' + '+b+' − '+c+' = '+sg(a+b)+' − '+c+' = '+sg(a+b-c)+'.','Reçu : +. Payé : −.',{u:'€'});
  }
  if(s===2){
    a=nz(-10,10);b=ri(3,15);c=ri(3,15);
    return num('À 6 h, la température est de '+sg(a)+' °C. Elle baisse de '+b+' °C puis elle monte de '+c+' °C. Quelle est la température finale, en °C ?',a-b+c,'Une baisse s’écrit avec − et une hausse avec +. Expression : '+rl(a)+' − '+b+' + '+c+' = '+sg(a-b)+' + '+c+' = '+sg(a-b+c)+'.','Baisse : −. Hausse : +.',{u:'°C'});
  }
  x=ri(5,20);y=ri(5,20);z=ri(5,20);w=ri(5,20);
  return num('Dans un jeu, une équipe marque +'+x+' points, puis −'+y+' points, puis −'+z+' points, puis +'+w+' points. Quel est son score final ?',x-y-z+w,'Expression : '+sg(x)+' + '+rl(-y)+' + '+rl(-z)+' + '+sg(w)+'. Positifs : '+(x+w)+'. Négatifs : '+sg(-y-z)+'. Score : '+sg(x-y-z+w)+'.','Regroupe les gains, puis les pertes.');
};
G.nmul=function(s){
  var a,b,sa,r,opts;
  if(s===1){
    a=ri(2,9);b=ri(2,9);sa=ri(0,1)?1:-1;
    return num('Calcule '+rl(sa*a)+' × '+rl(-sa*b)+'.',-a*b,'Les signes sont différents : le produit est négatif. La valeur absolue est '+a+' × '+b+' = '+(a*b)+'. Résultat : '+sg(-a*b)+'.','Signes différents : le produit est négatif.');
  }
  if(s===2){
    a=ri(2,12);b=ri(2,12);sa=ri(0,1)?1:-1;
    opts=['positif','négatif','nul'];
    return qcm('Quel est le signe du produit '+rl(sa*a)+' × '+rl(-sa*b)+' ?','négatif',['positif','nul'],'Un nombre est '+(sa>0?'positif':'négatif')+' et l’autre est '+(sa>0?'négatif':'positif')+'. Deux signes différents donnent un produit négatif.','Signes différents : le produit est négatif.');
  }
  a=ri(6,15);b=ri(3,12);sa=ri(0,1)?1:-1;
  return num('Calcule '+rl(sa*a)+' × '+rl(-sa*b)+'.',-a*b,'Signe du produit : négatif. Valeur absolue : '+a+' × '+b+' = '+(a*b)+'. Résultat : '+sg(-a*b)+'.','Détermine le signe, puis la valeur absolue.');
};

/* ---------- 1AC semaine 4 : produit, quotient, décimaux et fractions ---------- */
G.nmuls=function(s){
  var a,b,sa,t;
  if(s===1||s===3){
    a=s===1?ri(2,9):ri(6,15);b=s===1?ri(2,9):ri(3,12);sa=ri(0,1)?1:-1;
    return num('Calcule '+rl(sa*a)+' × '+rl(sa*b)+'.',a*b,'Les signes sont identiques : le produit est positif. La valeur absolue est '+a+' × '+b+' = '+(a*b)+'. Résultat : '+sg(a*b)+'.','Signes identiques : le produit est positif.');
  }
  a=ri(2,12);b=ri(2,12);sa=ri(0,1)?1:-1;
  return qcm('Quel est le signe du produit '+rl(sa*a)+' × '+rl(sa*b)+' ?','positif',['négatif','nul'],'Les deux nombres sont '+(sa>0?'positifs':'négatifs')+'. Deux signes identiques donnent un produit positif.','Signes identiques : le produit est positif.');
};
G.ndiv=function(s){
  var b,q,sa,p,d,sg2;
  if(s===1||s===2){
    b=ri(2,9);q=ri(2,9);sa=ri(0,1)?1:-1;sg2=s===1?-sa:sa;
    return num('Calcule '+rl(sa*b*q)+' ÷ '+rl(sg2*b)+'.',sa*sg2*q,(s===1?'Les signes sont différents : le quotient est négatif. ':'Les signes sont identiques : le quotient est positif. ')+'La valeur absolue est '+(b*q)+' ÷ '+b+' = '+q+'. Résultat : '+sg(sa*sg2*q)+'.',s===1?'Signes différents : le quotient est négatif.':'Signes identiques : le quotient est positif.');
  }
  do{p=ri(1,9);d=ri(2,9)}while(p%d===0);
  sa=ri(0,1)?1:-1;sg2=ri(0,1)?1:-1;
  return num('Calcule '+rl(sa*p)+' ÷ '+rl(sg2*d)+' (décimal ou fraction).',sa*sg2*p/d,'Signe du quotient : '+(sa*sg2>0?'positif':'négatif')+'. Valeur absolue : '+fr(p,d)+'. Résultat : '+fs(sa*sg2*p,d)+'.','Détermine le signe, puis écris la valeur absolue sous forme de fraction.',{sol:fs(sa*sg2*p,d),tol:6e-3});
};
G.nmulc=function(s){
  var a,b,c,m,y,sa,sb,sc2,f,neg,i,arr;
  if(s===1){
    do{a=nz(-6,6);b=nz(-6,6);c=nz(-6,6)}while(Math.abs(a)===1&&Math.abs(b)===1&&Math.abs(c)===1);
    neg=[a,b,c].filter(function(v){return v<0}).length;
    return num('Calcule '+rl(a)+' × '+rl(b)+' × '+rl(c)+'.',a*b*c,'Il y a '+neg+' facteur'+(neg>1?'s':'')+' négatif'+(neg>1?'s':'')+' : le produit est '+(neg%2?'négatif':'positif')+'. Valeur absolue : '+Math.abs(a)+' × '+Math.abs(b)+' × '+Math.abs(c)+' = '+(Math.abs(a*b*c))+'. Résultat : '+sg(a*b*c)+'.','Compte les facteurs négatifs : nombre pair, produit positif.');
  }
  if(s===2){
    m=pick([[25,4],[5,2],[50,2],[20,5],[25,8],[5,20]]);y=ri(3,9);sa=ri(0,1)?1:-1;sb=ri(0,1)?1:-1;sc2=ri(0,1)?1:-1;
    a=sa*m[0];b=sb*y;c=sc2*m[1];
    return num('Calcule '+rl(a)+' × '+rl(b)+' × '+rl(c)+' en regroupant les facteurs bien choisis.',a*b*c,'Je regroupe '+rl(a)+' × '+rl(c)+' = '+sg(a*c)+'. Puis '+sg(a*c)+' × '+rl(b)+' = '+sg(a*b*c)+'.','Cherche deux facteurs dont le produit est simple.');
  }
  do{arr=[nz(-5,5),nz(-5,5),nz(-5,5),nz(-5,5)]}while(false);
  neg=arr.filter(function(v){return v<0}).length;
  return qcm('Quel est le signe du produit '+arr.map(rl).join(' × ')+' ?',neg%2?'négatif':'positif',neg%2?['positif','nul']:['négatif','nul'],'Il y a '+neg+' facteur'+(neg>1?'s':'')+' négatif'+(neg>1?'s':'')+' : '+(neg%2?'nombre impair, produit négatif.':'nombre pair, produit positif.'),'Un nombre pair de facteurs négatifs donne un produit positif.');
};
G.nmd=function(s){
  var a,b,q,r,sa,sb,p1,d1,p2,d2,mul,n,d;
  if(s===1){
    a=ri(2,19)/10;b=ri(2,19)/10;sa=ri(0,1)?1:-1;sb=ri(0,1)?1:-1;r=Math.round(sa*sb*a*b*100)/100;
    return num('Calcule '+rl(sa*a)+' × '+rl(sb*b)+'.',r,'Signe : '+(sa*sb>0?'positif':'négatif')+'. Valeur absolue : '+sg(a)+' × '+sg(b)+' = '+sg(Math.round(a*b*100)/100)+'. Résultat : '+sg(r)+'.','Règle des signes, puis calcul avec les décimaux positifs.');
  }
  if(s===2){
    b=ri(2,25)/10;q=ri(2,30)/10;sa=ri(0,1)?1:-1;sb=ri(0,1)?1:-1;a=Math.round(b*q*100)/100;
    return num('Calcule '+rl(sa*a)+' ÷ '+rl(sb*b)+'.',sa*sb*q,'Signe : '+(sa*sb>0?'positif':'négatif')+'. Valeur absolue : '+sg(a)+' ÷ '+sg(b)+' = '+sg(q)+'. Résultat : '+sg(sa*sb*q)+'.','Règle des signes, puis division des décimaux positifs.');
  }
  p1=nz(-7,7);d1=ri(2,7);p2=nz(-7,7);d2=ri(2,7);mul=ri(0,1);
  if(mul){n=p1*p2;d=d1*d2;
    return num('Calcule '+pf(p1,d1)+' × '+pf(p2,d2)+' (décimal ou fraction).',n/d,'Règle des signes : résultat '+(n>0?'positif':'négatif')+'. Je multiplie : '+fr(p1,d1)+' × '+fr(p2,d2)+' donne '+fr(n,d)+' = '+fs(n,d)+'.','Numérateur × numérateur, dénominateur × dénominateur.',{sol:fs(n,d),tol:6e-3});
  }
  n=p1*d2;d=d1*p2;
  return num('Calcule '+pf(p1,d1)+' ÷ '+pf(p2,d2)+' (décimal ou fraction).',n/d,'Diviser, c’est multiplier par l’inverse : '+pf(p1,d1)+' × '+(p2<0?'('+fr(d2,p2)+')':fr(d2,p2))+' donne '+fr(n,d)+' = '+fs(n,d)+'.','Diviser par une fraction, c’est multiplier par son inverse.',{sol:fs(n,d),tol:6e-3});
};

/* ---------- 3AC période 1 semaine 1 : diviseurs, critères, PGCD, PPCM ---------- */
function dvs(n){var out=[],i;for(i=1;i<=n;i++)if(n%i===0)out.push(i);return out}
function lcm2(a,b){return a*b/gcd(a,b)}
function mlist(k,upto){var out=[],i;for(i=1;i*k<=upto;i++)out.push(k*i);return out}
G.ndvd=function(s){
  var b,q,r,a,n,d,k,N,m,wrongs,pool;
  if(s===1){
    b=ri(3,9);q=ri(3,12);r=ri(1,b-1);a=b*q+r;
    return num('Quel est le reste de la division euclidienne de '+a+' par '+b+' ?',r,a+' = '+b+' × '+q+' + '+r+' avec '+r+' < '+b+'. Le reste est '+r+'.','Cherche le plus grand multiple de '+b+' qui ne dépasse pas '+a+'.');
  }
  if(s===2){
    d=ri(3,9);q=ri(4,9);N=d*q;pool=[];
    for(m=2;m<N;m++)if(N%m!==0)pool.push(m);
    wrongs=shuffle(pool).slice(0,3);
    return qcm('Lequel de ces nombres est un diviseur de '+N+' ?',String(d),wrongs.map(String),N+' = '+d+' × '+q+' : le reste de la division euclidienne de '+N+' par '+d+' est 0. Donc '+d+' est un diviseur de '+N+'.','Un diviseur donne un reste égal à 0.');
  }
  k=ri(3,9);N=ri(25,60);
  return num('Quel est le plus grand multiple de '+k+' strictement inférieur à '+N+' ?',k*Math.floor((N-1)/k),'Les multiples de '+k+' sont '+mlist(k,N+k).filter(function(v){return v<N}).slice(-4).join(' ; ')+' ... Le dernier inférieur à '+N+' est '+(k*Math.floor((N-1)/k))+'.','Calcule les produits de '+k+' par 1, 2, 3, ... jusqu’à dépasser '+N+'.');
};
function digs(n){return String(n).split('').map(Number)}
function dsum(n){return digs(n).reduce(function(x,y){return x+y},0)}
G.ncrit=function(s){
  var X,cands,i,v,div,non,right,lim,a,c,sm,d,N;
  if(s===1){
    X=pick([2,3,5,9]);div=null;non=[];lim=0;
    while((!div||non.length<3)&&lim++<400){
      v=ri(100,999);
      if(v%X===0){if(!div)div=v}
      else if(non.length<3&&non.indexOf(v)<0)non.push(v);
    }
    var why=X===2?'son chiffre des unités est pair':X===5?'son chiffre des unités est 0 ou 5':'la somme de ses chiffres '+dsum(div)+' est divisible par '+X;
    return qcm('Lequel de ces nombres est divisible par '+X+' ?',String(div),non.map(String),div+' est divisible par '+X+' car '+why+'.','Utilise le critère de divisibilité par '+X+'.');
  }
  if(s===2){
    do{a=ri(1,9);c=ri(1,9);sm=a+c}while(sm%9===0);
    d=(9-(sm%9))%9;
    return num('Quel chiffre faut-il écrire à la place de ? pour que le nombre '+a+'?'+c+' soit divisible par 9 ?',d,'La somme des chiffres doit être divisible par 9. '+a+' + '+c+' = '+sm+'. Il faut ajouter '+d+' pour obtenir '+(sm+d)+', multiple de 9.','Calcule la somme des chiffres connus, puis complète jusqu’au multiple de 9.');
  }
  div=null;non=[];lim=0;
  while((!div||non.length<3)&&lim++<600){
    v=ri(1000,9999);
    if(v%4===0){if(!div)div=v}
    else if(non.length<3&&non.indexOf(v)<0)non.push(v);
  }
  return qcm('Lequel de ces nombres est divisible par 4 ?',String(div),non.map(String),'Les deux derniers chiffres de '+div+' forment '+(div%100)+', qui est un multiple de 4. Donc '+div+' est divisible par 4.','Regarde le nombre formé par les deux derniers chiffres.');
};
G.npgcd=function(s){
  var g,p,q,a,b,k;
  function cop(){do{p=ri(2,9);q=ri(2,9)}while(p===q||gcd(p,q)!==1)}
  if(s===1){
    g=ri(2,6);cop();a=g*p;b=g*q;
    return num('Détermine le PGCD de '+a+' et '+b+'.',g,'Diviseurs de '+a+' : '+dvs(a).join(' ; ')+'. Diviseurs de '+b+' : '+dvs(b).join(' ; ')+'. Diviseurs communs : '+dvs(g).filter(function(v){return a%v===0&&b%v===0}).join(' ; ')+'. Le plus grand est '+g+'.','Écris les diviseurs de chaque nombre, puis cherche le plus grand diviseur commun.');
  }
  if(s===2){
    a=ri(3,15);k=ri(3,9);b=a*k;
    return num('Détermine le PGCD de '+a+' et '+b+'.',a,b+' = '+a+' × '+k+' : '+a+' divise '+b+'. Le PGCD est donc le plus petit des deux nombres : '+a+'.','Regarde si l’un des nombres divise l’autre.');
  }
  g=ri(3,12);cop();a=g*p;b=g*q;
  return num('Détermine le PGCD de '+a+' et '+b+'.',g,'Diviseurs communs de '+a+' et '+b+' : '+dvs(g).join(' ; ')+'. Le plus grand est '+g+'. Vérification : '+a+' = '+g+' × '+p+' et '+b+' = '+g+' × '+q+'.','Cherche le plus grand nombre qui divise les deux.');
};
G.nppcm=function(s){
  var a,b,g,p,q,k,l,la,lb;
  if(s===1){
    do{a=ri(2,9);b=ri(2,9)}while(a===b||a%b===0||b%a===0);
    l=lcm2(a,b);
    return num('Détermine le PPCM de '+a+' et '+b+'.',l,'Multiples de '+a+' : '+mlist(a,l).join(' ; ')+'. Multiples de '+b+' : '+mlist(b,l).join(' ; ')+'. Le premier multiple commun est '+l+'.','Écris les multiples de chaque nombre jusqu’au premier multiple commun.');
  }
  if(s===2){
    a=ri(3,12);k=ri(3,9);b=a*k;
    return num('Détermine le PPCM de '+a+' et '+b+'.',b,b+' est un multiple de '+a+' ('+b+' = '+a+' × '+k+'). Le PPCM est donc le plus grand des deux nombres : '+b+'.','Regarde si l’un des nombres est un multiple de l’autre.');
  }
  g=ri(2,9);do{p=ri(2,9);q=ri(2,9)}while(p===q||gcd(p,q)!==1);
  a=g*p;b=g*q;l=g*p*q;
  return num('Détermine le PPCM de '+a+' et '+b+' en utilisant leur PGCD.',l,'PGCD('+a+' ; '+b+') = '+g+'. PPCM = '+a+' × '+b+' ÷ '+g+' = '+(a*b)+' ÷ '+g+' = '+l+'.','PPCM = produit des deux nombres divisé par leur PGCD.');
};

/* ---------- 3AC période 1 semaine 2 : nombres premiers, décompositions, fractions, problèmes ---------- */
function isP(n){var i;if(n<2)return false;for(i=2;i*i<=n;i++)if(n%i===0)return false;return true}
function primesTo(n){var o=[],i;for(i=2;i<=n;i++)if(isP(i))o.push(i);return o}
function decStr(f){return f.map(function(x){return x[1]===1?String(x[0]):x[0]+sp(x[1])}).join(' × ')}
function decVal(f){return f.reduce(function(a,x){return a*Math.pow(x[0],x[1])},1)}
function randDec(primes,k,maxE,maxN){
  var f,lim=0,ps;
  do{ps=shuffle(primes).slice(0,k).sort(function(a,b){return a-b});f=ps.map(function(p){return [p,ri(1,maxE)]});lim++}while(decVal(f)>maxN&&lim<200);
  return f;
}
function decFacts(n){var f=[],p;for(p=2;p<=n;p++){if(n%p===0){var e=0;while(n%p===0){n/=p;e++}f.push([p,e])}}return f}
G.npre=function(s){
  var comp,primes,n,ps,lst,right,wr,p,i;
  if(s===1){
    right=pick(primesTo(97).filter(function(v){return v>10}));wr=[];
    while(wr.length<3){i=ri(4,99);if(!isP(i)&&wr.indexOf(i)<0)wr.push(i)}
    return qcm('Lequel de ces nombres est premier ?',String(right),wr.map(String),right+' n’a que deux diviseurs : 1 et '+right+'. Les autres nombres ont au moins un autre diviseur.','Un nombre premier a exactement deux diviseurs : 1 et lui-même.');
  }
  if(s===2){
    n=ri(100,300);ps=primesTo(Math.floor(Math.sqrt(n)));
    return num('Pour vérifier si '+n+' est premier, on teste les nombres premiers p tels que p × p ≤ '+n+'. Combien y en a-t-il ?',ps.length,'Les nombres premiers p tels que p × p ≤ '+n+' sont : '+ps.join(' ; ')+'. Il y en a '+ps.length+'.','Cherche le plus grand p dont le carré ne dépasse pas '+n+'.');
  }
  comp=[119,133,143,161,169,187,203,209,221,247,253,259,287,299];
  right=pick(comp);primes=shuffle(primesTo(199).filter(function(v){return v>100})).slice(0,3);
  p=2;while(right%p!==0)p++;
  return qcm('Lequel de ces nombres n’est pas premier ?',String(right),primes.map(String),right+' = '+p+' × '+(right/p)+' : '+right+' est divisible par '+p+'. Il n’est donc pas premier.','Teste la divisibilité par 2, 3, 5, 7, 11, 13.');
};
G.nfac=function(s){
  var f,right,wr,k,maxN,primes,w,idx,n,c,m;
  if(s===1){k=2;maxN=72;primes=[2,3,5]}
  else if(s===2){k=3;maxN=210;primes=[2,3,5,7]}
  else{k=3;maxN=600;primes=[2,3,5,7,11]}
  do{f=randDec(primes,k,s===2?1:3,maxN)}while(s!==2&&f.every(function(x){return x[1]===1}));
  right=decStr(f);n=decVal(f);wr=[];
  idx=ri(0,f.length-1);
  w=f.map(function(x){return x.slice()});w[idx][1]=w[idx][1]+1;wr.push(decStr(w));
  w=f.map(function(x){return x.slice()});if(w[idx][1]>1)w[idx][1]--;else w.splice(idx,1);wr.push(decStr(w));
  w=f.map(function(x){return x.slice()});w[idx][1]=w[idx][1]+2;wr.push(decStr(w));
  c=4;while(c<n&&(n%c!==0||isP(c)))c++;
  if(c<n){m=n/c;wr.push(c+' × '+m)}
  wr=distinct(right,wr);
  return qcm('Quelle est la décomposition de '+n+' en produit de facteurs premiers ?',right,wr.slice(0,3),'On divise successivement par le plus petit nombre premier possible jusqu’à obtenir 1 : '+n+' = '+right+'.','Les facteurs doivent tous être des nombres premiers.');
};
G.npp=function(s){
  var a,b,r,A,B,t,i,primes=[2,3,5,7],fa,fb,pg,pp,ps,e;
  if(s===1||s===2){
    do{fa=randDec(primes,3,3,600);fb=randDec(primes,3,3,600)}while(decVal(fa)===decVal(fb));
    A=decVal(fa);B=decVal(fb);
    t=s===1?'PGCD':'PPCM';
    r=s===1?gcd(A,B):A*B/gcd(A,B);
    return num('A = '+decStr(fa)+' et B = '+decStr(fb)+'. Calcule le '+t+' de A et de B.',r,s===1?'Je prends les facteurs premiers communs avec le plus petit exposant. Résultat : '+r+'.':'Je prends tous les facteurs premiers avec le plus grand exposant. Résultat : '+r+'.',s===1?'Facteurs communs, plus petits exposants.':'Tous les facteurs, plus grands exposants.');
  }
  do{fa=randDec(primes,3,3,600);fb=randDec(primes,3,3,600)}while(decVal(fa)===decVal(fb));
  A=decVal(fa);B=decVal(fb);
  return num('On donne A = '+A+' = '+decStr(decFacts(A))+' et B = '+B+' = '+decStr(decFacts(B))+'. Calcule le PGCD de '+A+' et de '+B+'.',gcd(A,B),'Facteurs premiers communs, plus petits exposants. Résultat : '+gcd(A,B)+'.','Facteurs communs, plus petits exposants.');
};
function fs2(n,d){return n+'/'+d}
G.nfrac=function(s){
  var g,p,q,a,b,right,wr,fr1,d,lst,lim,x,y;
  function cop(){do{p=ri(2,9);q=ri(2,9)}while(p===q||gcd(p,q)!==1)}
  if(s===1){
    do{g=ri(2,9);cop();a=g*p;b=g*q}while(a>99||b>99);
    wr=[fs2(q,p),fs2(p+1,q),fs2(p,q+1)];
    d=2;while(d<=g&&(g%d!==0||d===g))d++;
    if(d<g&&g%d===0)wr=[fs2(a/d,b/d),fs2(q,p),fs2(p+1,q)];
    return qcm('Quelle est la forme irréductible de '+fr(a,b)+' ?',fs2(p,q),distinct(fs2(p,q),wr),'PGCD('+a+' ; '+b+') = '+g+'. On divise le numérateur et le dénominateur par '+g+' : '+fr(a,b)+' = '+fr(p,q)+'.','Divise le numérateur et le dénominateur par leur PGCD.');
  }
  if(s===2){
    do{g=ri(2,12);cop();a=g*p;b=g*q}while(a>150||b>150);
    return num('On simplifie '+fr(a,b)+' pour obtenir une fraction irréductible. Quel est le dénominateur de cette fraction ?',q,'PGCD('+a+' ; '+b+') = '+g+'. '+b+' ÷ '+g+' = '+q+'. La fraction irréductible est '+fr(p,q)+'.','Divise le dénominateur par le PGCD.');
  }
  lst=[];lim=0;
  right=null;
  while((!right||lst.length<3)&&lim++<500){
    x=ri(2,40);y=ri(x+1,60);
    if(gcd(x,y)===1){if(!right)right=fs2(x,y)}
    else if(lst.length<3&&lst.indexOf(fs2(x,y))<0)lst.push(fs2(x,y));
  }
  var rp=right.split('/');
  return qcm('Laquelle de ces fractions est irréductible ?',right,lst,'PGCD('+rp[0]+' ; '+rp[1]+') = 1 : '+rp[0]+' et '+rp[1]+' sont premiers entre eux. La fraction ne peut pas être simplifiée.','Une fraction est irréductible quand le PGCD du numérateur et du dénominateur est 1.');
};
G.nden=function(s){
  var b,d,a,c,L;
  do{b=ri(2,12);d=ri(2,12)}while(b===d||gcd(b,d)===b||gcd(b,d)===d);
  L=b*d/gcd(b,d);a=ri(1,b-1);c=ri(1,d-1);
  if(s===1){
    return num('Quel est le plus petit dénominateur commun des fractions '+fr(a,b)+' et '+fr(c,d)+' ?',L,'C’est le PPCM de '+b+' et '+d+' : multiples de '+b+' et de '+d+' ... Le premier multiple commun est '+L+'.','Le plus petit dénominateur commun est le PPCM des dénominateurs.');
  }
  if(s===2){
    return num('On réduit '+fr(a,b)+' et '+fr(c,d)+' au plus petit dénominateur commun. Quel est le numérateur de la première fraction ?',a*L/b,'Le dénominateur commun est PPCM('+b+' ; '+d+') = '+L+'. '+L+' = '+b+' × '+(L/b)+', donc '+fr(a,b)+' = '+fr(a*L/b,L)+'.','Multiplie le numérateur et le dénominateur par PPCM ÷ dénominateur.');
  }
  return num('On réduit '+fr(a,b)+' et '+fr(c,d)+' au plus petit dénominateur commun. Quelle est la somme des deux numérateurs obtenus ?',a*L/b+c*L/d,'Le dénominateur commun est '+L+'. '+fr(a,b)+' = '+fr(a*L/b,L)+' et '+fr(c,d)+' = '+fr(c*L/d,L)+'. Somme des numérateurs : '+(a*L/b)+' + '+(c*L/d)+' = '+(a*L/b+c*L/d)+'.','Réduis chaque fraction au dénominateur commun, puis additionne les numérateurs.');
};
G.nparith=function(s){
  var g,p,q,A,B,m,n,L,names;
  if(s===1||s===2){
    do{g=ri(3,12);do{p=ri(2,9);q=ri(2,9)}while(p===q||gcd(p,q)!==1);A=g*p;B=g*q}while(A>120||B>120);
    if(s===1)return num('Léa a '+A+' fraises tagada et '+B+' bonbons au citron. Elle veut faire des paquets identiques avec tous ses bonbons, chaque paquet contenant des deux sortes. Quel est le plus grand nombre de paquets possible ?',g,'Partage maximal en paquets identiques : j’utilise le PGCD. PGCD('+A+' ; '+B+') = '+g+'. Le plus grand nombre de paquets est '+g+'.','Partage en paquets identiques : PGCD.');
    return num('Léa a '+A+' fraises tagada et '+B+' bonbons au citron. Elle fait le plus grand nombre possible de paquets identiques avec tous ses bonbons. Combien de fraises tagada y a-t-il dans un paquet ?',p,'PGCD('+A+' ; '+B+') = '+g+' paquets. Fraises par paquet : '+A+' ÷ '+g+' = '+p+'.','Divise le nombre de fraises par le PGCD.');
  }
  do{m=ri(4,15);n=ri(4,15)}while(m===n||gcd(m,n)===Math.min(m,n));
  L=m*n/gcd(m,n);
  return num('Deux cloches sonnent ensemble à 8 h. La première sonne toutes les '+m+' minutes et la seconde toutes les '+n+' minutes. Dans combien de minutes sonneront-elles de nouveau ensemble ?',L,'Événement qui se reproduit : j’utilise le PPCM. PPCM('+m+' ; '+n+') = '+L+'. Elles sonnent ensemble dans '+L+' minutes.','Événement qui se reproduit : PPCM.');
};

/* ---------- 3AC période 1 semaine 3 : racines carrées et nombres réels ---------- */
function isSq(n){var r=Math.round(Math.sqrt(n));return r*r===n}
var NSQ=[2,3,5,6,7,8,10,11,12,13,14,15,17,18,19,20,21,22,23,24,26,27,28,29,30,31,32,33,34,35,37,38,39,40,41,42,43,44,45,46,47,48,50];
G.nrac=function(s){
  var a,right,wr,k,v,sq,vals;
  if(s===1){
    a=ri(2,15);
    return num('Calcule √'+(a*a)+'.',a,a+' × '+a+' = '+(a*a)+' et la racine carrée est positive : √'+(a*a)+' = '+a+'.','Cherche le nombre positif dont le carré est '+(a*a)+'.');
  }
  if(s===2){
    right=pick([4,9,16,25,36,49,64,81,100,121,144,169,196,225]);wr=[];
    while(wr.length<3){v=ri(5,230);if(!isSq(v)&&wr.indexOf(v)<0)wr.push(v)}
    return qcm('Lequel de ces nombres est un carré parfait ?',String(right),wr.map(String),right+' = '+Math.round(Math.sqrt(right))+'² : c’est le carré d’un nombre entier.','Un carré parfait est le carré d’un entier.');
  }
  k=pick(NSQ);v=Math.round(Math.sqrt(k)*100)/100;
  return num('À l’aide de la calculatrice, donne la valeur approchée de √'+k+' arrondie au centième.',v,'Je tape la touche √, puis le nombre '+k+'. La calculatrice affiche environ '+fm(Math.sqrt(k),5)+'. Arrondi au centième : '+fm(v,2)+'.','Touche √, puis le nombre, puis arrondis.',{tol:1e-6,sol:fm(v,2)});
};
G.ncomp=function(s){
  var a,b,n,r,items,vals,right,perms,i,x,k,lst,shown,seen;
  if(s===1){
    do{a=ri(2,60);b=ri(2,60)}while(a===b);
    r=a<b?'<':'>';
    return qcm('Compare √'+a+' ◻ √'+b,r,['<','>','='].filter(function(c){return c!==r}),'Deux nombres positifs sont rangés comme leurs carrés : '+a+' '+r+' '+b+', donc √'+a+' '+r+' √'+b+'.','Compare les nombres sous les racines.');
  }
  if(s===2){
    n=ri(3,12);do{a=ri(5,160)}while(a===n*n);
    r=a<n*n?'<':'>';
    return qcm('Compare √'+a+' ◻ '+n,r,['<','>','='].filter(function(c){return c!==r}),'On compare les carrés : ('+'√'+a+')² = '+a+' et '+n+'² = '+(n*n)+'. Comme '+a+' '+r+' '+(n*n)+', on a √'+a+' '+r+' '+n+'.','Compare les carrés des deux nombres.');
  }
  items=[];seen={};
  while(items.length<4){
    if(Math.random()<.5){k=pick(NSQ);x=Math.sqrt(k);if(!seen[x.toFixed(6)]){seen[x.toFixed(6)]=1;items.push({t:'√'+k,v:x})}}
    else{k=ri(2,7);if(!seen[k.toFixed(6)]){seen[k.toFixed(6)]=1;items.push({t:String(k),v:k})}}
  }
  var sorted=items.slice().sort(function(p,q){return p.v-q.v});
  right=sorted.map(function(o){return o.t}).join(' < ');
  var wrongs=[],tries=0,perm;
  while(wrongs.length<3&&tries++<200){perm=shuffle(items).map(function(o){return o.t}).join(' < ');if(perm!==right&&wrongs.indexOf(perm)<0)wrongs.push(perm)}
  return qcm('Range dans l’ordre croissant : '+items.map(function(o){return o.t}).join(' ; ')+'.',right,wrongs,'Je compare les carrés : '+sorted.map(function(o){return o.t+' → '+fm(o.v*o.v,2)}).join(' ; ')+'. Ordre croissant : '+right+'.','Compare les carrés des nombres positifs.');
};
function decNat(a,b){var g=gcd(a,b),d=b/g;while(d%2===0)d/=2;while(d%5===0)d/=5;return d===1?'fin':'per'}
G.ndecim=function(s){
  var a,b,k,txt,nat,e,labels=['décimale finie','illimitée périodique','illimitée non périodique'],idx,mode,val;
  mode=s===1?'frac':s===2?'root':(ri(0,1)?'frac':'root');
  if(mode==='frac'){
    do{b=ri(3,12);a=ri(1,b-1)}while(gcd(a,b)===b||a%b===0);
    nat=decNat(a,b);val=a/b;
    txt='Quelle est la nature de l’écriture décimale de '+a+'/'+b+' ?';
    e=nat==='fin'?'La calculatrice affiche '+fm(val,6)+' : l’écriture s’arrête, elle est décimale finie.':'La calculatrice affiche '+fm(val,7)+'… : un groupe de chiffres se répète, l’écriture est illimitée périodique.';
    idx=nat==='fin'?0:1;
  }else{
    if(ri(0,1)){k=pick(NSQ);nat='non';val=Math.sqrt(k);txt='Quelle est la nature de l’écriture décimale de √'+k+' ?';e='La calculatrice affiche '+fm(val,7)+'… : les chiffres continuent sans motif qui se répète, l’écriture est illimitée non périodique.';idx=2}
    else{k=ri(2,15);txt='Quelle est la nature de l’écriture décimale de √'+(k*k)+' ?';e='√'+(k*k)+' = '+k+' : l’écriture s’arrête, elle est décimale finie.';idx=0}
  }
  return qcm(txt,labels[idx],labels.filter(function(l,i){return i!==idx}),e,'Utilise la calculatrice et observe les chiffres après la virgule.');
};
G.nreel=function(s){
  var kinds,mk,items,right,wr,labels=['un entier','un rationnel non entier','un irrationnel'],t,i,k,b,a,cnt;
  function mkN(kind){
    var k,b,a;
    if(kind==='int'){if(ri(0,1)){k=ri(2,12);return {t:'√'+(k*k),c:0}}return {t:sg(nz(-20,20)),c:0}}
    if(kind==='frac'){do{b=ri(3,12);a=ri(1,b-1)}while(gcd(a,b)!==1);return {t:a+'/'+b,c:1}}
    if(kind==='dec'){do{k=ri(11,99)}while(k%10===0);return {t:fm(k/10,1),c:1}}
    if(Math.random()<.2)return {t:'π',c:2};
    k=pick(NSQ);return {t:'√'+k,c:2};
  }
  if(s===1){
    t=pick(['int','frac','dec','irr']);var o=mkN(t);
    return qcm('Le nombre '+o.t+' est :',labels[o.c],labels.filter(function(l,i){return i!==o.c}),o.c===0?'Son écriture décimale est finie et sans partie décimale : c’est un entier.':o.c===1?'On peut l’écrire sous forme de fraction mais ce n’est pas un entier : c’est un rationnel non entier.':'Son écriture décimale est illimitée et non périodique : on ne peut pas l’écrire en fraction. C’est un irrationnel.','Un irrationnel a une écriture décimale illimitée non périodique.');
  }
  if(s===2){
    right=mkN('irr');wr=[mkN('int'),mkN('frac'),mkN('dec')];
    return qcm('Lequel de ces nombres est irrationnel ?',right.t,wr.map(function(o){return o.t}),right.t+' a une écriture décimale illimitée non périodique. Les autres nombres sont rationnels : on peut les écrire en fraction.','Les rationnels s’écrivent sous forme de fraction.');
  }
  items=[];cnt=0;
  for(i=0;i<5;i++){t=pick(['int','frac','dec','irr','irr']);var o2=mkN(t);items.push(o2.t);if(o2.c===2)cnt++}
  return num('Combien de nombres irrationnels y a-t-il dans la liste : '+items.join(' ; ')+' ?',cnt,'Les irrationnels sont les nombres à écriture décimale illimitée non périodique : racines de nombres qui ne sont pas des carrés parfaits, et π. Il y en a '+cnt+'.','Les entiers, fractions et décimaux sont rationnels.');
};

/* ---------- 3AC période 1 semaine 4 : calculs avec les racines carrées ---------- */
function divsOf(n){var o=[],i;for(i=2;i<n;i++)if(n%i===0)o.push(i);return o}
G.nrp=function(s){
  var r,a,b,sa,wr,k;
  if(s===1||s===2){
    r=ri(2,9);a=pick(divsOf(r*r));b=r*r/a;
    if(s===1)return num('Calcule √'+a+' × √'+b+'.',r,'Règle du produit : √'+a+' × √'+b+' = √('+a+' × '+b+') = √'+(r*r)+' = '+r+'.','Mets les deux nombres sous une seule racine.');
    sa=ri(0,1)?1:-1;
    return num('Calcule '+(sa<0?'(−√'+a+')':'√'+a)+' × √'+b+'.',sa*r,'Signe : '+(sa<0?'négatif':'positif')+'. √'+a+' × √'+b+' = √'+(r*r)+' = '+r+'. Résultat : '+sg(sa*r)+'.','Règle des signes, puis règle du produit.');
  }
  do{a=ri(2,9);b=ri(2,9)}while(a===b||isSq(a*b));
  wr=['√'+(a+b),String(a*b),'√'+(a*b*2)];
  wr=distinct('√'+(a*b),wr);
  return qcm('Écris √'+a+' × √'+b+' sous la forme d’une seule racine carrée.','√'+(a*b),wr,'Règle du produit : √'+a+' × √'+b+' = √('+a+' × '+b+') = √'+(a*b)+'.','On multiplie les nombres sous les racines.');
};
G.nrq=function(s){
  var r,b,a,sa,m,wr;
  if(s===1||s===2){
    r=ri(2,9);b=ri(2,9);a=b*r*r;
    if(s===1)return num('Calcule √'+a+' ÷ √'+b+'.',r,'Règle du quotient : √'+a+' ÷ √'+b+' = √('+a+' ÷ '+b+') = √'+(r*r)+' = '+r+'.','Mets les deux nombres sous une seule racine.');
    sa=ri(0,1)?1:-1;
    return num('Calcule '+(sa<0?'(−√'+a+')':'√'+a)+' ÷ √'+b+'.',sa*r,'Signe : '+(sa<0?'négatif':'positif')+'. √'+a+' ÷ √'+b+' = √'+(r*r)+' = '+r+'. Résultat : '+sg(sa*r)+'.','Règle des signes, puis règle du quotient.');
  }
  do{b=ri(2,9);m=ri(2,20)}while(isSq(m));
  a=b*m;
  wr=['√'+(a-b),String(m),'√'+(m+b)];
  wr=distinct('√'+m,wr);
  return qcm('Écris √'+a+' ÷ √'+b+' sous la forme d’une seule racine carrée.','√'+m,wr,'Règle du quotient : √'+a+' ÷ √'+b+' = √('+a+' ÷ '+b+') = √'+m+'.','On divise les nombres sous les racines.');
};
G.nrs=function(s){
  var ps=[2,3,5,7],p,q,r,n,e,pool;
  if(s===1){
    do{p=pick(ps);q=pick(ps)}while(p===q);
    n=p*p*q*q;
    return num('Écris √'+n+' sans le symbole radical.',p*q,n+' = '+p+'² × '+q+'². Donc √'+n+' = √('+p+'² × '+q+'²) = '+p+' × '+q+' = '+(p*q)+'.','Décompose en facteurs premiers, puis regroupe en carrés.');
  }
  if(s===2){
    pool=shuffle(ps).slice(0,3);p=pool[0];q=pool[1];r=pool[2];
    n=p*p*q*q*r*r;
    return num('Écris √'+n+' sans le symbole radical.',p*q*r,n+' = '+p+'² × '+q+'² × '+r+'². Donc √'+n+' = '+p+' × '+q+' × '+r+' = '+(p*q*r)+'.','Décompose en facteurs premiers, puis regroupe en carrés.');
  }
  do{p=pick(ps);q=pick(ps)}while(p===q);
  e=pick([2,3]);n=Math.pow(p,2*e)*q*q;
  return num('Écris √'+n+' sans le symbole radical.',Math.pow(p,e)*q,n+' = '+p+'<sup>'+(2*e)+'</sup> × '+q+'² = ('+p+'<sup>'+e+'</sup>)² × '+q+'². Donc √'+n+' = '+Math.pow(p,e)+' × '+q+' = '+(Math.pow(p,e)*q)+'.','Une puissance paire est un carré : p<sup>4</sup> = (p²)².');
};
G.nrb=function(s){
  var a,b;
  if(s===1){
    a=ri(2,12);
    return num('Écris '+a+' sous la forme √n. Quelle est la valeur de n ?',a*a,a+' = √'+(a*a)+' car '+a+'² = '+(a*a)+'. Donc n = '+(a*a)+'.','Un nombre positif a est égal à √(a²).');
  }
  if(s===2){
    a=ri(2,6);b=ri(2,7);
    return num('Écris '+a+'√'+b+' sous la forme √n. Quelle est la valeur de n ?',a*a*b,a+'√'+b+' = √'+(a*a)+' × √'+b+' = √('+(a*a)+' × '+b+') = √'+(a*a*b)+'. Donc n = '+(a*a*b)+'.','Écris d’abord '+a+' avec un radical : '+a+' = √'+(a*a)+'.');
  }
  a=ri(4,12);b=ri(2,6);
  return num('Écris '+a+'√'+b+' sous la forme √n. Quelle est la valeur de n ?',a*a*b,a+'√'+b+' = √'+(a*a)+' × √'+b+' = √'+(a*a*b)+'. Donc n = '+(a*a*b)+'.','Écris d’abord '+a+' avec un radical : '+a+' = √'+(a*a)+'.');
};

G.sqrt=function(s){
  var k=ri(2,9),m=pick([2,3,5,6,7]),t=ri(0,s===1?0:2);
  if(s===1||t===0){var a=ri(2,15);return num('√'+(a*a)+' = ?',a,a+' × '+a+' = '+(a*a)+' et la racine carrée est positive : '+a+'.','Cherche le nombre positif dont le carré est '+(a*a)+'.')}
  if(t===1)return num('√'+(k*k*m)+' = k√'+m+'. Quelle est la valeur de k ?',k,(k*k*m)+' = '+(k*k)+' × '+m+' donc √'+(k*k*m)+' = '+k+'√'+m+'.','Cherche un carré parfait qui divise '+(k*k*m)+'.');
  var u=ri(2,9),v=ri(2,9);return num('√'+(u*u)+' × √'+(v*v)+' = ?',u*v,'√'+(u*u)+' × √'+(v*v)+' = '+u+' × '+v+' = '+(u*v)+'.','Calcule chaque racine puis multiplie.');
};

/* ---------- ordre, encadrement ---------- */
G.enc=function(s){
  var a1=ri(1,5),a2=a1+ri(1,2),b1=ri(1,6),b2=b1+ri(1,2),t=ri(0,s===1?0:2);
  if(s===1||t===0)return num('On sait que '+a1+' ≤ a ≤ '+a2+' et '+b1+' ≤ b ≤ '+b2+'. Donne le minimum de a + b.',a1+b1,'On additionne les bornes inférieures : '+a1+' + '+b1+' = '+(a1+b1)+'.','Additionne les deux bornes inférieures.');
  if(t===1)return num('On sait que '+a1+' ≤ a ≤ '+a2+' et '+b1+' ≤ b ≤ '+b2+'. Donne le maximum de a + b.',a2+b2,'On additionne les bornes supérieures : '+a2+' + '+b2+' = '+(a2+b2)+'.','Additionne les deux bornes supérieures.');
  return num('On sait que '+a1+' ≤ a ≤ '+a2+' et '+b1+' ≤ b ≤ '+b2+' (nombres positifs). Donne le minimum de a × b.',a1*b1,'Pour des nombres positifs, on multiplie les bornes inférieures : '+a1+' × '+b1+' = '+(a1*b1)+'.','Multiplie les deux bornes inférieures.');
};
G.ordre=function(s){
  var a=ri(1,9),k=ri(2,6),kind=ri(0,1);
  if(kind===0){var b=a+ri(1,5);return qcm('On sait que '+a+' &lt; '+b+'. Quelle inégalité est vraie ?',(-a)+' &gt; '+(-b),[(-a)+' &lt; '+(-b),a+k+' &gt; '+(b+k),(-k*a)+' &lt; '+(-k*b)],'Quand on multiplie par un nombre négatif, l’ordre s’inverse.','Regarde ce qui se passe avec les opposés.')}
  var m=ri(1,4);return qcm('Si a &lt; b, alors a − '+m+' ◻ b − '+m+'.','&lt;',['&gt;','='],'On peut soustraire le même nombre aux deux membres sans changer le sens : a − '+m+' &lt; b − '+m+'.','Soustraire le même nombre ne change pas l’ordre.');
};

/* ---------- proportionnalité ---------- */
G.prop=function(s){
  var a=ri(2,6),p=ri(3,9),k=ri(2,9),T=a*p;
  return num(a+' cahiers coûtent '+T+' DH. Combien coûtent '+(a*k)+' cahiers ?',T*k,'Le prix d’un cahier est '+T+' ÷ '+a+' = '+p+' DH. '+(a*k)+' cahiers coûtent '+(a*k)+' × '+p+' = '+(T*k)+' DH.','Cherche d’abord le prix d’un cahier.',{u:'DH'});
};
G.pct=function(s){
  var p=pick(s===1?[10,50,25]:[5,15,20,30,40,60,75]),T=ri(2,20)*20;
  return num('Calcule '+p+' % de '+T+'.',T*p/100,p+' % de '+T+' = '+T+' × '+p+' ÷ 100 = '+fm(T*p/100)+'.',s===1?'Pense à la moitié, au quart ou au dixième.':'Multiplie par '+p+' puis divise par 100.');
};
G.vit=function(s){
  var v=pick([40,60,80,90,100,120]),t=pick([2,3,4,5]);
  if(s===1)return num('Une voiture roule à '+v+' km/h pendant '+t+' h. Quelle distance parcourt-elle ?',v*t,'d = v × t = '+v+' × '+t+' = '+(v*t)+' km.','d = v × t.',{u:'km'});
  return num('Une voiture parcourt '+(v*t)+' km en '+t+' h. Quelle est sa vitesse moyenne ?',v,'v = d ÷ t = '+(v*t)+' ÷ '+t+' = '+v+' km/h.','v = d ÷ t.',{u:'km/h'});
};
G.ech=function(s){
  var k=pick([100,200,500,1000]),c=ri(2,9);
  return num('Sur une carte à l’échelle 1/'+k+' (1 cm sur la carte = '+k+' cm dans la réalité), un segment mesure '+c+' cm. Quelle est sa longueur réelle, en mètres ?',c*k/100,c+' × '+k+' = '+(c*k)+' cm = '+(c*k/100)+' m.','Convertis les centimètres en mètres à la fin.',{u:'m'});
};

/* ---------- statistiques ---------- */
G.stat=function(s){
  var n=s===1?5:(s===2?5:7),L=[],i,t=ri(0,2);
  for(i=0;i<n;i++)L.push(ri(4,18));
  var sum=L.reduce(function(a,b){return a+b},0),srt=L.slice().sort(function(a,b){return a-b});
  if(s>1&&t===1){while(sum%n!==0){L[ri(0,n-1)]++;sum++}}
  var mean=sum/n;
  if(s===1||t===0){return num('Étendue de la série : '+L.join(' ; ')+'.',srt[n-1]-srt[0],'Étendue = plus grande valeur − plus petite valeur = '+srt[n-1]+' − '+srt[0]+' = '+(srt[n-1]-srt[0])+'.','Cherche le maximum et le minimum.')}
  if(t===1)return num('Moyenne de la série : '+L.join(' ; ')+'.',mean,'Somme = '+sum+', effectif = '+n+' : '+sum+' ÷ '+n+' = '+fm(mean)+'.','Additionne toutes les valeurs puis divise par '+n+'.');
  var med=n%2?srt[(n-1)/2]:(srt[n/2-1]+srt[n/2])/2;
  return num('Médiane de la série : '+L.join(' ; ')+'.',med,'Série rangée : '+srt.join(' ; ')+'. '+(n%2?'La valeur du milieu est '+fm(med)+'.':'La médiane est la moyenne des deux valeurs du milieu : '+fm(med)+'.'),'Range d’abord les valeurs dans l’ordre croissant.');
};
G.effC=function(s){
  var v=[ri(1,4),ri(2,6),ri(3,8),ri(2,6),ri(1,4)],cum=[],c=0;v.forEach(function(e){c+=e;cum.push(c)});
  var k=ri(2,4);
  return num('Effectifs des valeurs 1, 2, 3, 4, 5 : '+v.join(' ; ')+'. Quel est l’effectif cumulé de la valeur '+(k+1)+' ?',cum[k],'On additionne les effectifs jusqu’à la valeur '+(k+1)+' : '+v.slice(0,k+1).join(' + ')+' = '+cum[k]+'.','Additionne les effectifs depuis le début.');
};

/* ---------- géométrie numérique ---------- */
G.angTri=function(s){
  var a=ri(30,80),b=ri(30,80);
  return num('Dans un triangle, deux angles mesurent '+a+'° et '+b+'°. Combien mesure le troisième ?',180-a-b,'La somme des angles d’un triangle est 180° : 180 − '+a+' − '+b+' = '+(180-a-b)+'°.','La somme des angles d’un triangle est 180°.',{u:'°'});
};
G.angDroites=function(s){
  var a=ri(25,155),t=ri(0,2);
  if(t===0)return num('Deux angles adjacents forment un angle plat. L’un mesure '+a+'°. Combien mesure l’autre ?',180-a,'Angle plat = 180° : 180 − '+a+' = '+(180-a)+'°.','Un angle plat mesure 180°.',{u:'°'});
  if(t===1)return num('Deux droites se coupent. Un angle mesure '+a+'°. Combien mesure l’angle opposé par le sommet ?',a,'Deux angles opposés par le sommet ont la même mesure : '+a+'°.','Les angles opposés par le sommet sont égaux.',{u:'°'});
  return num('Deux droites parallèles sont coupées par une sécante. Un angle mesure '+a+'°. Combien mesure son angle alterne-interne ?',a,'Les angles alternes-internes formés par des droites parallèles sont égaux : '+a+'°.','Alternes-internes et droites parallèles : égaux.',{u:'°'});
};
G.perim=function(s){
  var L=ri(3,15),l=ri(2,L-1),t=ri(0,s===1?0:1);
  if(s===1||t===0)return num('Un rectangle mesure '+L+' cm sur '+l+' cm. Quel est son périmètre ?',2*(L+l),'P = 2 × ('+L+' + '+l+') = '+2*(L+l)+' cm.','P = 2 × (L + l).',{u:'cm'});
  return num('Un rectangle mesure '+L+' cm sur '+l+' cm. Quelle est son aire ?',L*l,'A = L × l = '+L+' × '+l+' = '+L*l+' cm².','A = L × l.',{u:'cm²'});
};
G.aire=function(s){
  var b=ri(3,14),h=ri(2,10),t=ri(0,2);
  if(t===0)return num('Aire d’un triangle de base '+b+' cm et de hauteur '+h+' cm.',b*h/2,'A = base × hauteur ÷ 2 = '+b+' × '+h+' ÷ 2 = '+fm(b*h/2)+' cm².','A = b × h ÷ 2.',{u:'cm²'});
  if(t===1)return num('Aire d’un parallélogramme de base '+b+' cm et de hauteur '+h+' cm.',b*h,'A = base × hauteur = '+b+' × '+h+' = '+b*h+' cm².','A = b × h.',{u:'cm²'});
  var B=b+ri(2,6);return num('Aire d’un trapèze de bases '+b+' cm et '+B+' cm et de hauteur '+h+' cm.',(b+B)*h/2,'A = (B + b) × h ÷ 2 = ('+B+' + '+b+') × '+h+' ÷ 2 = '+fm((b+B)*h/2)+' cm².','A = (B + b) × h ÷ 2.',{u:'cm²'});
};
G.cercle=function(s){
  var r=ri(2,12),t=ri(0,1);
  if(t===0)return num('Périmètre d’un cercle de rayon '+r+' cm (prends π ≈ 3,14).',+(2*3.14*r).toFixed(2),'P = 2 × π × r = 2 × 3,14 × '+r+' = '+fm(2*3.14*r)+' cm.','P = 2 × π × r.',{u:'cm',tol:0.05});
  return num('Aire d’un disque de rayon '+r+' cm (prends π ≈ 3,14).',+(3.14*r*r).toFixed(2),'A = π × r² = 3,14 × '+r+'² = '+fm(3.14*r*r)+' cm².','A = π × r².',{u:'cm²',tol:0.05});
};
G.pyth=function(s){
  var T=pick([[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15],[7,24,25]]),ask=ri(0,2);
  if(ask===0)return num('Triangle rectangle de côtés de l’angle droit '+T[0]+' cm et '+T[1]+' cm. Quelle est la longueur de l’hypoténuse ?',T[2],'Pythagore : h² = '+T[0]+'² + '+T[1]+'² = '+(T[0]*T[0]+T[1]*T[1])+', donc h = '+T[2]+' cm.','h² = a² + b².',{u:'cm'});
  return num('Triangle rectangle d’hypoténuse '+T[2]+' cm et d’un côté de '+T[0]+' cm. Quelle est la longueur de l’autre côté de l’angle droit ?',T[1],'Pythagore : c² = '+T[2]+'² − '+T[0]+'² = '+(T[2]*T[2]-T[0]*T[0])+', donc c = '+T[1]+' cm.','c² = h² − a².',{u:'cm'});
};
G.pythR=function(s){
  var T=pick([[3,4,5],[5,12,13],[6,8,10],[8,15,17]]),yes=Math.random()<.5,a=T[0],b=T[1],c=yes?T[2]:T[2]+1;
  return qcm('Un triangle a pour côtés '+a+' cm, '+b+' cm et '+c+' cm. Est-il rectangle ?',yes?'Oui':'Non',[yes?'Non':'Oui','On ne peut pas savoir'],'On compare '+c+'² = '+c*c+' et '+a+'² + '+b+'² = '+(a*a+b*b)+' : '+(yes?'les deux nombres sont égaux, le triangle est rectangle.':'les nombres sont différents, le triangle n’est pas rectangle.'),'Compare le carré du plus grand côté à la somme des carrés des deux autres.');
};
G.thal=function(s){
  var f=pick([[1,2],[1,3],[2,3],[3,4],[1,4]]),AB=f[1]*ri(1,3),AM=AB*f[0]/f[1],AC=f[1]*ri(2,4),AN=AC*f[0]/f[1];
  return num('(MN) // (BC), AB = '+AB+' cm, AM = '+fm(AM)+' cm et AC = '+AC+' cm. Calcule AN.',AN,'Thalès : AM/AB = AN/AC donc AN = AC × AM ÷ AB = '+AC+' × '+fm(AM)+' ÷ '+AB+' = '+fm(AN)+' cm.','AM/AB = AN/AC.',{u:'cm',tol:0.02});
};
G.trig=function(s){
  var a=pick([30,35,40,45,50,55,60]),H=ri(5,15),t=ri(0,2),f=[['sin',Math.sin],['cos',Math.cos],['tan',Math.tan]][t];
  if(t<2)return num('Dans un triangle rectangle, l’hypoténuse mesure '+H+' cm et un angle aigu mesure '+a+'°. Quelle est la longueur du côté '+(t===0?'opposé':'adjacent')+' à cet angle ? (arrondis au dixième)',+(H*f[1](a*Math.PI/180)).toFixed(1),f[0]+' '+a+'° = '+(t===0?'opposé':'adjacent')+' ÷ '+H+', donc '+(t===0?'opposé':'adjacent')+' = '+H+' × '+f[0]+' '+a+'° ≈ '+fm(H*f[1](a*Math.PI/180),1)+' cm.',(t===0?'sin = opposé ÷ hypoténuse.':'cos = adjacent ÷ hypoténuse.'),{u:'cm',tol:0.11});
  var o=ri(3,9),d=ri(3,9);return num('Dans un triangle rectangle, le côté opposé à l’angle α mesure '+o+' cm et le côté adjacent '+d+' cm. Donne α (arrondi au degré).',Math.round(Math.atan(o/d)*180/Math.PI),'tan α = '+o+' ÷ '+d+' ≈ '+fm(o/d,3)+', donc α = tan⁻¹('+fm(o/d,3)+') ≈ '+Math.round(Math.atan(o/d)*180/Math.PI)+'°.','tan α = opposé ÷ adjacent.',{u:'°',tol:1.01});
};
G.inscrit=function(s){
  var a=ri(15,80);
  if(Math.random()<.5)return num('Un angle inscrit mesure '+a+'°. Combien mesure l’angle au centre qui intercepte le même arc ?',2*a,'L’angle au centre est le double de l’angle inscrit : 2 × '+a+' = '+2*a+'°.','L’angle au centre est le double.',{u:'°'});
  var n=pick([5,6,8,9,10,12]);return num('Combien mesure l’angle au centre d’un polygone régulier à '+n+' côtés ?',360/n,'360 ÷ '+n+' = '+fm(360/n,1)+'°.','Divise 360° par le nombre de côtés.',{u:'°',tol:0.06});
};
G.sym=function(s){
  var x=nz(-6,6),y=nz(-6,6),t=ri(0,s===1?1:3),kind;
  if(t===0)return num('Quelle est l’abscisse du symétrique du point A('+sg(x)+' ; '+sg(y)+') par rapport à l’axe des ordonnées ?',-x,'La symétrie d’axe (Oy) change le signe de l’abscisse : '+sg(-x)+'.','L’axe des ordonnées est vertical.');
  if(t===1)return num('Quelle est l’ordonnée du symétrique du point A('+sg(x)+' ; '+sg(y)+') par rapport à l’axe des abscisses ?',-y,'La symétrie d’axe (Ox) change le signe de l’ordonnée : '+sg(-y)+'.','L’axe des abscisses est horizontal.');
  if(t===2)return num('Quelle est l’abscisse du symétrique du point A('+sg(x)+' ; '+sg(y)+') par rapport à l’origine O ?',-x,'La symétrie centrale de centre O change les deux signes : '+sg(-x)+' ; '+sg(-y)+'.','O est le milieu de [AA′].');
  var cx=nz(-4,4);return num('Quelle est l’abscisse du symétrique de A('+sg(x)+' ; '+sg(y)+') par rapport au point I('+sg(cx)+' ; 0) ?',2*cx-x,'I est le milieu de [AA′] : x′ = 2 × '+rl(cx)+' − '+rl(x)+' = '+sg(2*cx-x)+'.','I est le milieu de [AA′].');
};
G.vec=function(s){
  var xa=nz(-6,6),ya=nz(-6,6),xb=nz(-6,6),yb=nz(-6,6),ask=Math.random()<.5;
  return num('A('+sg(xa)+' ; '+sg(ya)+') et B('+sg(xb)+' ; '+sg(yb)+'). Quelle est '+(ask?'l’abscisse':'l’ordonnée')+' du vecteur AB ?',ask?xb-xa:yb-ya,'AB ('+sg(xb)+' − '+rl(xa)+' ; '+sg(yb)+' − '+rl(ya)+') = ('+sg(xb-xa)+' ; '+sg(yb-ya)+').','On soustrait les coordonnées de l’origine à celles de l’extrémité.');
};
G.rep=function(s){
  var xa=ri(-6,6),ya=ri(-6,6),dx=ri(-3,3)*2,dy=ri(-3,3)*2,t=ri(0,s===1?0:1);
  if(s===1||t===0)return num('Milieu de [AB] avec A('+sg(xa)+' ; '+sg(ya)+') et B('+sg(xa+dx)+' ; '+sg(ya+dy)+'). Quelle est l’abscisse du milieu ?',xa+dx/2,'('+sg(xa)+' + '+rl(xa+dx)+') ÷ 2 = '+sg(xa+dx/2)+'.','Calcule la moyenne des abscisses.');
  var p=pick([[3,4,5],[6,8,10],[5,12,13]]);return num('A(0 ; 0) et B('+p[0]+' ; '+p[1]+'). Calcule la distance AB.',p[2],'AB = √('+p[0]+'² + '+p[1]+'²) = √'+(p[0]*p[0]+p[1]*p[1])+' = '+p[2]+'.','AB = √((x<sub>B</sub> − x<sub>A</sub>)² + (y<sub>B</sub> − y<sub>A</sub>)²).');
};
G.droite=function(s){
  var m=nz(-4,4),p=nz(-6,6),x1=ri(-3,0),x2=ri(1,4),t=ri(0,s===1?0:2);
  if(s===1||t===0)return num('Pour la droite d’équation y = '+xs(m,p)+', quelle est la valeur de y quand x = '+x2+' ?',m*x2+p,'y = '+rl(m)+' × '+x2+(p<0?' − '+(-p):' + '+p)+' = '+sg(m*x2+p)+'.','Remplace x par '+x2+'.');
  if(t===1)return num('Une droite passe par A('+sg(x1)+' ; '+sg(m*x1+p)+') et B('+sg(x2)+' ; '+sg(m*x2+p)+'). Quel est son coefficient directeur ?',m,'m = (y<sub>B</sub> − y<sub>A</sub>) ÷ (x<sub>B</sub> − x<sub>A</sub>) = ('+sg(m*x2+p)+' − '+rl(m*x1+p)+') ÷ ('+x2+' − '+rl(x1)+') = '+sg(m*(x2-x1))+' ÷ '+(x2-x1)+' = '+sg(m)+'.','m = Δy ÷ Δx.');
  return num('Une droite passe par A('+sg(x1)+' ; '+sg(m*x1+p)+') et B('+sg(x2)+' ; '+sg(m*x2+p)+'). Quelle est son ordonnée à l’origine p ?',p,'On trouve m = '+sg(m)+', puis p = y<sub>A</sub> − m × x<sub>A</sub> = '+sg(m*x1+p)+' − '+rl(m)+' × '+rl(x1)+' = '+sg(p)+'.','p = y<sub>A</sub> − m × x<sub>A</sub>.');
};
G.vol=function(s){
  var a=ri(2,9),h=ri(2,9),t=ri(0,s===1?1:4);
  if(t===0)return num('Volume d’un pavé droit de dimensions '+a+' cm, '+h+' cm et '+ri(2,5)+' cm ? Donne la valeur pour un cube de côté '+a+' cm.',a*a*a,'V = c³ = '+a+'³ = '+(a*a*a)+' cm³.','V = côté × côté × côté.',{u:'cm³'});
  if(t===1)return num('Volume d’un prisme droit de base de '+(a*h)+' cm² et de hauteur '+h+' cm.',a*h*h,'V = aire de la base × hauteur = '+(a*h)+' × '+h+' = '+(a*h*h)+' cm³.','V = B × h.',{u:'cm³'});
  if(t===2){var B=3*ri(2,12);return num('Volume d’une pyramide de base '+B+' cm² et de hauteur '+h+' cm.',B*h/3,'V = ⅓ × B × h = ⅓ × '+B+' × '+h+' = '+fm(B*h/3)+' cm³.','V = ⅓ × B × h.',{u:'cm³'})}
  if(t===3)return num('Volume d’un cylindre de rayon '+a+' cm et de hauteur '+h+' cm (π ≈ 3,14).',+(3.14*a*a*h).toFixed(2),'V = π × r² × h = 3,14 × '+a+'² × '+h+' = '+fm(3.14*a*a*h)+' cm³.','V = π × r² × h.',{u:'cm³',tol:0.1});
  return num('Volume d’une boule de rayon '+a+' cm (π ≈ 3,14, arrondis à l’unité).',Math.round(4/3*3.14*a*a*a),'V = ⁴⁄₃ × π × r³ = ⁴⁄₃ × 3,14 × '+a+'³ ≈ '+Math.round(4/3*3.14*a*a*a)+' cm³.','V = ⁴⁄₃ × π × r³.',{u:'cm³',tol:1.01});
};
G.agr=function(s){
  var k=pick([2,3,4]),A=ri(2,9),t=ri(0,1);
  if(t===0)return num('On agrandit une figure avec un rapport k = '+k+'. Son aire initiale est '+A+' cm². Quelle est la nouvelle aire ?',A*k*k,'Les aires sont multipliées par k² = '+(k*k)+' : '+A+' × '+(k*k)+' = '+(A*k*k)+' cm².','Les aires sont multipliées par k².',{u:'cm²'});
  return num('On agrandit un solide avec un rapport k = '+k+'. Son volume initial est '+A+' cm³. Quel est le nouveau volume ?',A*k*k*k,'Les volumes sont multipliés par k³ = '+(k*k*k)+' : '+A+' × '+(k*k*k)+' = '+(A*k*k*k)+' cm³.','Les volumes sont multipliés par k³.',{u:'cm³'});
};
G.fonc=function(s){
  var a=nz(-5,5),b=nz(-6,6),x=ri(-4,5),t=ri(0,s===1?0:1);
  if(s===1||t===0)return num('f(x) = '+xs(a,b)+'. Calcule f('+sg(x)+').',a*x+b,'f('+sg(x)+') = '+rl(a)+' × '+rl(x)+' '+sgn(b)+' = '+sg(a*x+b)+'.','Remplace x par '+sg(x)+'.');
  return num('f(x) = '+xs(a,b)+'. Quel est l’antécédent de '+sg(a*x+b)+' ?',x,'On résout '+xs(a,b)+' = '+sg(a*x+b)+' : '+sg(a)+'x = '+sg(a*x)+', donc x = '+sg(x)+'.','Résous l’équation f(x) = '+sg(a*x+b)+'.');
};
G.iso=function(s){
  var k=pick([2,3,4]),a=ri(2,6),b=ri(3,8);
  return num('Deux triangles semblables ont un rapport de similitude '+k+'. Un côté du petit triangle mesure '+a+' cm. Quelle est la longueur du côté correspondant du grand triangle ?',a*k,'On multiplie par le rapport : '+a+' × '+k+' = '+(a*k)+' cm.','Longueur du grand = rapport × longueur du petit.',{u:'cm'});
};
G.pgcd=function(s){
  var g=pick([2,3,4,5,6]),a=g*ri(2,5),b=g*ri(2,5);
  if(a===b)b=a+g;
  var d=gcd(a,b);
  return num('Quel est le plus grand diviseur commun de '+a+' et '+b+' ?',d,'Les diviseurs communs de '+a+' et '+b+' vont jusqu’à '+d+' : PGCD('+a+' ; '+b+') = '+d+'.','Cherche le plus grand nombre qui divise les deux.');
};


G.dmil=function(s){
  var BC=2*ri(3,15),t=ri(0,1);
  if(t===0)return num('Dans un triangle ABC, I est le milieu de [AB] et J le milieu de [AC]. BC = '+BC+' cm. Quelle est la longueur IJ ?',BC/2,'La droite des milieux est parallèle au troisième côté et mesure la moitié : IJ = '+BC+' ÷ 2 = '+(BC/2)+' cm.','IJ = BC ÷ 2.',{u:'cm'});
  var IJ=ri(3,12);return num('Dans un triangle ABC, I est le milieu de [AB] et J le milieu de [AC]. IJ = '+IJ+' cm. Quelle est la longueur BC ?',2*IJ,'BC est le double de IJ : BC = 2 × '+IJ+' = '+(2*IJ)+' cm.','BC = 2 × IJ.',{u:'cm'});
};
G.tricerc=function(s){
  var h2=2*ri(3,12),t=ri(0,1);
  if(t===0)return num('ABC est rectangle en A et BC = '+h2+' cm. M est le milieu de [BC]. Quelle est la longueur AM ?',h2/2,'Dans un triangle rectangle, la médiane issue de l’angle droit mesure la moitié de l’hypoténuse : AM = '+h2+' ÷ 2 = '+(h2/2)+' cm.','AM = BC ÷ 2.',{u:'cm'});
  var r=ri(3,10);return num('Un triangle rectangle est inscrit dans un cercle de rayon '+r+' cm. Quelle est la longueur de son hypoténuse ?',2*r,'L’hypoténuse est un diamètre du cercle circonscrit : 2 × '+r+' = '+(2*r)+' cm.','L’hypoténuse est un diamètre.',{u:'cm'});
};
G.symc=function(s){
  var x=nz(-6,6),y=nz(-6,6),ask=Math.random()<.5;
  if(s===1)return num('Quelle est l’abscisse du symétrique de A('+sg(x)+' ; '+sg(y)+') par rapport à l’origine O ?',-x,'O est le milieu de [AA′] : on change les deux signes. A′('+sg(-x)+' ; '+sg(-y)+').','A′ est de l’autre côté de O, à la même distance.');
  var cx=nz(-4,4),cy=nz(-4,4);
  return num('Quelle est '+(ask?'l’abscisse':'l’ordonnée')+' du symétrique de A('+sg(x)+' ; '+sg(y)+') par rapport au point I('+sg(cx)+' ; '+sg(cy)+') ?',ask?2*cx-x:2*cy-y,'I est le milieu de [AA′] : '+(ask?'x′ = 2 × '+rl(cx)+' − '+rl(x):'y′ = 2 × '+rl(cy)+' − '+rl(y))+' = '+sg(ask?2*cx-x:2*cy-y)+'.','Le centre est le milieu de [AA′].');
};

/* ---------- accès ---------- */
M.genItem=function(key,s){
  var f=G[key];if(!f)throw new Error('générateur inconnu '+key);
  var it=f(s||1);it.k=key;return it;
};
})();
/* Configuration des défis : Maths en mouvement */
(function () {
  'use strict';
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function fm(x, d) {
    d = d === undefined ? 2 : d; var s = (+x).toFixed(d);
    if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
    s = s.replace('.', ',').replace('-', '−'); return /^−0(,0*)?$/.test(s) ? '0' : s;
  }
  function num(q, a, e, h, o) { o = o || {}; return { t: 'num', q: q, a: a, e: e, h: h || '', u: o.u || '', tol: o.tol === undefined ? 1e-6 : o.tol, sol: o.sol || fm(a, 3) + (o.u ? ' ' + o.u : '') }; }

  /* générateurs du niveau Défi : plusieurs étapes, aucune aide */
  var HARD = {
    eq2: function () {
      var x = ri(-9, 9), m = ri(2, 5), p = ri(2, 5), n = ri(1, 6);
      if (m === p) return HARD.eq2();
      var r = m * x + n - p * x;
      var q = m + 'x + ' + n + ' = ' + p + 'x ' + (r < 0 ? '− ' + (-r) : '+ ' + r);
      return num('Résous l’équation ' + q + '. Que vaut 2x + 1 ?', 2 * x + 1, 'On regroupe : (' + m + ' − ' + p + ')x = ' + r + ' − ' + n + ', donc x = ' + x + ' et 2x + 1 = ' + (2 * x + 1) + '.', 'Commence par trouver x.');
    },
    sys: function () {
      var x = ri(-5, 6), y = ri(-5, 6), a = ri(1, 4), b = ri(1, 4), c = ri(1, 4), d = ri(1, 4);
      if (a * d - b * c === 0) return HARD.sys();
      var e = a * x + b * y, f = c * x - d * y;
      // système : a x + b y = e ; c x - d y = f  => déterminant a*(-d) - b*c
      if (a * (-d) - b * c === 0) return HARD.sys();
      return num('Résous le système { ' + a + 'x + ' + b + 'y = ' + e + ' ; ' + c + 'x − ' + d + 'y = ' + f + ' }. Que vaut x × y ?', x * y, 'Par substitution ou combinaison, on trouve x = ' + x + ' et y = ' + y + ', donc x × y = ' + (x * y) + '.', 'Résous d’abord le système.');
    },
    pyth: function () {
      var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), k = ri(1, 3), a = t[0] * k, b = t[1] * k, c = t[2] * k;
      var kind = ri(0, 1);
      if (kind) return num('Un rectangle mesure ' + a + ' cm sur ' + b + ' cm. Calcule le périmètre du triangle formé par deux côtés consécutifs et une diagonale.', a + b + c, 'La diagonale mesure √(' + a + '² + ' + b + '²) = ' + c + ' cm. Périmètre : ' + a + ' + ' + b + ' + ' + c + ' = ' + (a + b + c) + ' cm.', 'Trouve d’abord la diagonale.', { u: 'cm' });
      return num('Dans un triangle ABC rectangle en A, AB = ' + a + ' cm et BC = ' + c + ' cm. Calcule l’aire du triangle.', a * b / 2, 'AC = √(' + c + '² − ' + a + '²) = ' + b + ' cm. Aire = ' + a + ' × ' + b + ' ÷ 2 = ' + (a * b / 2) + ' cm².', 'Calcule AC avec le théorème de Pythagore.', { u: 'cm²' });
    },
    thal: function () {
      var k = ri(2, 4), ab = ri(3, 7) * k, ad = ri(2, ab / k + 1), ac = ri(3, 8) * k;
      var ae = Math.round(ac * ad / ab * 100) / 100;
      return num('Dans le triangle ABC, D est sur [AB] et E sur [AC] avec (DE) // (BC). On donne AB = ' + ab + ' cm, AD = ' + ad + ' cm et AC = ' + ac + ' cm. Calcule EC (en cm, arrondi au centième).', Math.round((ac - ac * ad / ab) * 100) / 100, 'Thalès : AE/AC = AD/AB, donc AE = ' + ac + ' × ' + ad + ' ÷ ' + ab + ' ≈ ' + fm(ac * ad / ab) + ' cm. Alors EC = AC − AE ≈ ' + fm(ac - ac * ad / ab) + ' cm.', 'Calcule d’abord AE, puis EC = AC − AE.', { u: 'cm', tol: 0.011 });
    },
    trig: function () {
      var ang = pick([20, 25, 30, 35, 40, 50, 55, 60]), hyp = ri(8, 20), s = Math.round(hyp * Math.sin(ang * Math.PI / 180) * 10) / 10;
      return num('Un échelle de ' + hyp + ' m est appuyée contre un mur et forme un angle de ' + ang + '° avec le mur. À quelle hauteur du sol touche-t-elle le mur ? (arrondi au dixième)', Math.round(hyp * Math.cos(ang * Math.PI / 180) * 10) / 10, 'La hauteur est le côté adjacent à l’angle de ' + ang + '° : h = ' + hyp + ' × cos(' + ang + '°) ≈ ' + fm(hyp * Math.cos(ang * Math.PI / 180), 1) + ' m.', 'cos = adjacent ÷ hypoténuse.', { u: 'm', tol: 0.06 });
    },
    sqrt: function () {
      var a = ri(2, 6), b = pick([2, 3, 5, 6, 7]), n = a * a * b;
      return num('On écrit √' + n + ' = a√b avec b le plus petit possible. Que vaut a + b ?', a + b, '√' + n + ' = √(' + (a * a) + ' × ' + b + ') = ' + a + '√' + b + ', donc a + b = ' + (a + b) + '.', 'Cherche le plus grand carré qui divise ' + n + '.');
    },
    lit: function () {
      var a = ri(2, 4), b = ri(1, 5), x = ri(-3, 4);
      var v = (a * x + b) * (a * x + b) - (a * x - b) * (a * x - b);
      return num('Pour x = ' + x + ', calcule A = (' + a + 'x + ' + b + ')² − (' + a + 'x − ' + b + ')².', v, 'A = 4 × ' + a + 'x × ' + b + ' = ' + (4 * a * b) + 'x. Pour x = ' + x + ' : ' + v + '.', 'Utilise a² − b² = (a − b)(a + b) ou développe.');
    },
    pct: function () {
      var p = pick([10, 20, 25, 30, 40, 50]);
      var net = Math.round(((1 + p / 100) * (1 - p / 100) - 1) * 10000) / 100;
      return num('Un prix augmente de ' + p + ' %, puis baisse de ' + p + ' %. Quelle est la variation totale en % ? (réponds avec le signe)', net, 'Coefficient : ' + fm(1 + p / 100, 2) + ' × ' + fm(1 - p / 100, 2) + ' = ' + fm((1 + p / 100) * (1 - p / 100), 4) + '. Variation : ' + fm(net, 2) + ' %.', 'Multiplie les deux coefficients multiplicateurs.', { u: '%', tol: 0.011 });
    },
    vit: function () {
      var d = ri(2, 8) * 30, v1 = pick([30, 40, 60]), v2 = pick([60, 80, 120]);
      if (v1 === v2) return HARD.vit();
      var vm = 2 * d / (d / v1 + d / v2);
      return num('Un trajet aller de ' + d + ' km se fait à ' + v1 + ' km/h, le retour à ' + v2 + ' km/h. Quelle est la vitesse moyenne sur l’aller-retour ? (arrondie au dixième)', Math.round(vm * 10) / 10, 'Durée totale : ' + d + '/' + v1 + ' + ' + d + '/' + v2 + ' h ; distance totale ' + (2 * d) + ' km. v = ' + fm(vm, 2) + ' km/h. Ce n’est pas la moyenne des vitesses.', 'Vitesse moyenne = distance totale ÷ durée totale.', { u: 'km/h', tol: 0.06 });
    },
    stat: function () {
      var n = ri(4, 6), vals = [], i; for (i = 0; i < n; i++) vals.push(ri(8, 18));
      var s = vals.reduce(function (a, b) { return a + b; }, 0), m = ri(11, 15), x = m * (n + 1) - s;
      if (x < 0 || x > 20) return HARD.stat();
      return num('Les notes de ' + n + ' contrôles sont : ' + vals.join(' ; ') + '. Quelle note faut-il obtenir au prochain contrôle pour que la moyenne des ' + (n + 1) + ' notes soit ' + m + ' ?', x, 'Somme nécessaire : ' + m + ' × ' + (n + 1) + ' = ' + (m * (n + 1)) + '. Somme actuelle : ' + s + '. Note à obtenir : ' + x + '.', 'Moyenne × effectif = somme des notes.');
    },
    vol: function () {
      var k = pick([2, 3, 0.5]), v = ri(2, 9) * 8;
      var res = Math.round(v * k * k * k * 100) / 100;
      return num('Un solide a un volume de ' + v + ' cm³. On l’agrandit (ou on le réduit) avec le rapport k = ' + fm(k, 1) + '. Quel est le volume du nouveau solide ?', res, 'Les volumes sont multipliés par k³ = ' + fm(k * k * k, 3) + '. Volume : ' + v + ' × ' + fm(k * k * k, 3) + ' = ' + fm(res, 2) + ' cm³.', 'Les longueurs sont multipliées par k, les volumes par k³.', { u: 'cm³', tol: 0.011 });
    },
    pow: function () {
      var a = ri(2, 5), b = ri(2, 6), c = ri(1, 4), base = pick([2, 3, 5]);
      var e = a + b - c;
      return num('Écris ' + base + '<sup>' + a + '</sup> × ' + base + '<sup>' + b + '</sup> ÷ ' + base + '<sup>' + c + '</sup> sous la forme ' + base + '<sup>n</sup>. Que vaut n ?', e, 'On additionne les exposants pour le produit : ' + (a + b) + ', puis on soustrait pour le quotient : ' + (a + b) + ' − ' + c + ' = ' + e + '.', 'a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup> et a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup>.');
    },
    prop: function () {
      var w = ri(2, 6), days = ri(4, 12) * 2, nw = w * ri(2, 3);
      return num(w + ' ouvriers terminent un chantier en ' + days + ' jours. Combien de jours faut-il à ' + nw + ' ouvriers (même rythme) ?', days * w / nw, 'Le travail total est ' + w + ' × ' + days + ' = ' + (w * days) + ' ouvrier-jours. Avec ' + nw + ' ouvriers : ' + (w * days) + ' ÷ ' + nw + ' = ' + fm(days * w / nw, 2) + ' jours.', 'Plus il y a d’ouvriers, moins il faut de jours : situation inversement proportionnelle.', { u: 'jours', tol: 0.01 });
    },
    ineq: function () {
      var a = ri(-6, 0), b = a + ri(6, 12), k = 1;
      return num('Combien de nombres entiers x vérifient ' + (a < 0 ? '−' + (-a) : a) + ' ≤ x < ' + b + ' ?', b - a, 'Les entiers vont de ' + a + ' à ' + (b - 1) + ' : il y en a ' + (b - a) + '.', 'Attention : l’inégalité est large à gauche et stricte à droite.');
    }
  };

  /* générateurs propres aux chapitres ajoutés pour la 2e année (sommaire du manuel) */
  function sgn2(n) { return n < 0 ? '−' + (-n) : String(n); }
  function fs(f) { return f[1] === 1 ? sgn2(f[0]) : sgn2(f[0]) + '/' + f[1]; }
  function fn(n, d) { var g = gcd(n, d); return [n / g, d / g]; }
  function fadd2(a, b) { return fn(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function fmul2(a, b) { return fn(a[0] * b[0], a[1] * b[1]); }
  function finv2(a) { return a[0] < 0 ? [-a[1], -a[0]] : [a[1], a[0]]; }
  function fneg(a) { return [-a[0], a[1]]; }
  function rf(neg) { var n = pick([1, 2, 3, 4, 5]), d = pick([2, 3, 4, 5, 6]); if (neg && Math.random() < 0.5) n = -n; return fn(n, d); }
  function fnum(q, f, e, h) { return num(q, f[0] / f[1], e, h, { tol: 0.006, sol: fs(f) }); }
  function par(f) { return f[0] < 0 ? '(' + fs(f) + ')' : fs(f); }
  var EXTRA = {
    ops4: function (d) {
      var a, b, c, r, t;
      if (d === 1) {
        a = ri(2, 9); b = ri(2, 6); c = ri(2, 6);
        return num('Calcule ' + a + ' + ' + b + ' × ' + c + '.', a + b * c, 'La multiplication est prioritaire : ' + b + ' × ' + c + ' = ' + (b * c) + ', puis ' + a + ' + ' + (b * c) + ' = ' + (a + b * c) + '.', 'Multiplie avant d’additionner.');
      }
      if (d === 2) {
        a = rf(false); b = rf(false); c = rf(false);
        r = fadd2(a, fmul2(b, c));
        return fnum('Calcule ' + fs(a) + ' + ' + fs(b) + ' × ' + fs(c) + '. Écris le résultat sous forme de fraction (ou en décimal arrondi au centième).', r, 'Priorité à la multiplication : ' + fs(b) + ' × ' + fs(c) + ' = ' + fs(fmul2(b, c)) + ', puis on additionne : ' + fs(r) + '.', 'Multiplie d’abord.');
      }
      if (d === 3) {
        a = rf(true); b = rf(true); c = rf(false);
        r = fmul2(fadd2(a, fneg(b)), finv2(c));
        return fnum('Calcule (' + fs(a) + ' − ' + par(b) + ') ÷ ' + fs(c) + '. Écris le résultat sous forme de fraction (ou en décimal arrondi au centième).', r, 'Parenthèse : ' + fs(a) + ' − ' + par(b) + ' = ' + fs(fadd2(a, fneg(b))) + '. Diviser par ' + fs(c) + ', c’est multiplier par son inverse : résultat ' + fs(r) + '.', 'Calcule la parenthèse, puis multiplie par l’inverse.');
      }
      a = rf(true); b = rf(true); c = rf(true); t = rf(false);
      r = fadd2(fmul2(a, fadd2(b, c)), fneg(t));
      return fnum('Calcule ' + par(a) + ' × (' + fs(b) + ' + ' + par(c) + ') − ' + fs(t) + '. Écris le résultat sous forme de fraction (ou en décimal arrondi au centième).', r, 'Parenthèse : ' + fs(fadd2(b, c)) + '. Produit : ' + fs(fmul2(a, fadd2(b, c))) + '. Puis on retranche ' + fs(t) + ' : ' + fs(r) + '.', '');
    },
    rem: function (d) {
      var x, y, k, t;
      if (d === 4) {
        x = 3 * ri(2, 8); y = 3 * ri(2, 8);
        return num('G est le centre de gravité du triangle ABC. Les médianes [AA′] et [BB′] mesurent ' + x + ' cm et ' + y + ' cm. Calcule AG + BG.', 2 * (x + y) / 3, 'G est aux deux tiers de chaque médiane : AG = ⅔ × ' + x + ' = ' + (2 * x / 3) + ' et BG = ⅔ × ' + y + ' = ' + (2 * y / 3) + '.', 'AG = ⅔ AA′ et BG = ⅔ BB′.', { u: 'cm' });
      }
      t = ri(0, d === 1 ? 1 : 3);
      if (t === 0) { x = 3 * ri(2, 10); return num('G est le centre de gravité de ABC et A′ le milieu de [BC]. AA′ = ' + x + ' cm. Calcule AG.', 2 * x / 3, 'AG = ⅔ × AA′ = ⅔ × ' + x + ' = ' + (2 * x / 3) + ' cm.', 'G est aux deux tiers de la médiane.', { u: 'cm' }); }
      if (t === 1) { x = 3 * ri(2, 10); return num('G est le centre de gravité de ABC et A′ le milieu de [BC]. AA′ = ' + x + ' cm. Calcule GA′.', x / 3, 'GA′ = AA′ − AG = ⅓ × AA′ = ' + (x / 3) + ' cm.', 'GA′ est le tiers de AA′.', { u: 'cm' }); }
      if (t === 2) { x = ri(2, 12); return num('G est le centre de gravité de ABC et A′ le milieu de [BC]. GA′ = ' + x + ' cm. Calcule AA′.', 3 * x, 'GA′ est le tiers de AA′, donc AA′ = 3 × ' + x + ' = ' + (3 * x) + ' cm.', 'AA′ = 3 × GA′.', { u: 'cm' }); }
      k = ri(3, 15); return num('ABC est rectangle en A et BC = ' + (2 * k) + ' cm. Quel est le rayon de son cercle circonscrit ?', k, 'Le centre du cercle circonscrit est le milieu de l’hypoténuse : rayon = ' + (2 * k) + ' ÷ 2 = ' + k + ' cm.', 'Le centre est le milieu de [BC].', { u: 'cm' });
    },
    cos: function (d) {
      var p, H, a, t;
      if (d === 1) {
        p = pick([[3, 5], [4, 5], [6, 10], [8, 10], [9, 15], [12, 15], [12, 20], [16, 20]]);
        return num('ABC est rectangle en A, AB = ' + p[0] + ' cm et BC = ' + p[1] + ' cm. Calcule cos B.', p[0] / p[1], 'cos B = côté adjacent ÷ hypoténuse = AB ÷ BC = ' + p[0] + ' ÷ ' + p[1] + ' = ' + fm(p[0] / p[1], 3) + '.', 'cos = adjacent ÷ hypoténuse.', { tol: 0.006 });
      }
      if (d === 2) {
        H = 2 * ri(2, 10);
        return num('ABC est rectangle en A, BC = ' + H + ' cm et l’angle B mesure 60°. Sachant que cos 60° = 0,5, calcule AB.', H / 2, 'AB = BC × cos B = ' + H + ' × 0,5 = ' + (H / 2) + ' cm.', 'AB = BC × cos B.', { u: 'cm' });
      }
      if (d === 3) {
        H = ri(5, 20); a = pick([30, 35, 40, 45, 50, 55]);
        return num('ABC est rectangle en A, BC = ' + H + ' cm et l’angle B mesure ' + a + '°. Calcule AB (arrondi au dixième).', +(H * Math.cos(a * Math.PI / 180)).toFixed(1), 'AB = BC × cos B = ' + H + ' × cos ' + a + '° ≈ ' + fm(H * Math.cos(a * Math.PI / 180), 1) + ' cm.', 'Calculatrice en mode degrés.', { u: 'cm', tol: 0.06 });
      }
      if (Math.random() < 0.5) {
        H = ri(4, 9); a = pick([40, 50, 55, 65]);
        return num('Une échelle de ' + H + ' m est appuyée contre un mur. Elle forme avec le sol un angle de ' + a + '°. À quelle distance du mur se trouve son pied ? (arrondis au dixième)', +(H * Math.cos(a * Math.PI / 180)).toFixed(1), 'Le pied est le côté adjacent à l’angle : ' + H + ' × cos ' + a + '° ≈ ' + fm(H * Math.cos(a * Math.PI / 180), 1) + ' m.', 'Dessine le triangle rectangle : l’échelle est l’hypoténuse.', { u: 'm', tol: 0.06 });
      }
      p = pick([[4, 6], [5, 8], [3, 7], [6, 9], [2, 5], [7, 10]]);
      return num('ABC est rectangle en A, AB = ' + p[0] + ' cm et BC = ' + p[1] + ' cm. Calcule l’angle B, arrondi au degré.', Math.round(Math.acos(p[0] / p[1]) * 180 / Math.PI), 'cos B = ' + p[0] + ' ÷ ' + p[1] + ' ≈ ' + fm(p[0] / p[1], 3) + ', donc B = cos⁻¹(' + fm(p[0] / p[1], 3) + ') ≈ ' + Math.round(Math.acos(p[0] / p[1]) * 180 / Math.PI) + '°.', 'Utilise cos⁻¹ sur la calculatrice.', { u: '°', tol: 0.6 });
    },
    pyr: function (d) {
      var B, h, c, V, tr, ap, lat;
      if (d === 1) { B = 3 * ri(2, 12); h = ri(2, 9); return num('Volume d’une pyramide de base ' + B + ' cm² et de hauteur ' + h + ' cm.', B * h / 3, 'V = ⅓ × B × h = ⅓ × ' + B + ' × ' + h + ' = ' + fm(B * h / 3) + ' cm³.', 'V = ⅓ × B × h.', { u: 'cm³' }); }
      if (d === 2) { c = 3 * ri(1, 4); h = ri(2, 9); return num('Une pyramide a pour base un carré de côté ' + c + ' cm et pour hauteur ' + h + ' cm. Calcule son volume.', c * c * h / 3, 'B = ' + c + '² = ' + (c * c) + ' cm², puis V = ⅓ × ' + (c * c) + ' × ' + h + ' = ' + fm(c * c * h / 3) + ' cm³.', 'Calcule d’abord l’aire de la base.', { u: 'cm³' }); }
      if (d === 3) { B = ri(2, 10) * 3; h = ri(2, 8); V = B * h / 3; return num('Une pyramide de volume ' + V + ' cm³ a une base de ' + B + ' cm². Calcule sa hauteur.', h, 'V = ⅓ × B × h donc h = 3 × V ÷ B = 3 × ' + V + ' ÷ ' + B + ' = ' + h + ' cm.', 'h = 3V ÷ B.', { u: 'cm' }); }
      tr = pick([[4, 3, 5], [3, 4, 5], [12, 5, 13], [6, 8, 10]]); h = tr[0]; c = 2 * tr[1]; ap = tr[2]; lat = 2 * c * ap;
      return num('Une pyramide régulière a pour base un carré de côté ' + c + ' cm et pour hauteur ' + h + ' cm. L’apothème (hauteur d’une face triangulaire) mesure ' + ap + ' cm. Calcule son aire totale (base + faces).', c * c + lat, 'Aire latérale = 4 × (' + c + ' × ' + ap + ' ÷ 2) = ' + lat + ' cm². Base : ' + c + '² = ' + (c * c) + ' cm². Total : ' + (c * c + lat) + ' cm².', 'Quatre faces triangulaires de base ' + c + ' cm et de hauteur ' + ap + ' cm.', { u: 'cm²' });
    }
  };

  function expo() { return window.MM && window.MM.G; }

  var M1 = {};
  function T(id, topics) { M1[id] = { topics: topics }; }
  T('c1-1', ['ent', 'divr', 'dec', 'prio']);
  T('c1-2', ['fsimp', 'fadd', 'fmul', 'fcomp', 'fpart']);
  T('c1-3', ['rel']);
  T('c1-4', ['rel', 'sci', 'pow']);
  T('c1-5', ['lit']);
  T('c1-6', ['eq1']);
  T('c1-11', ['perim', 'aire']);
  T('c1-13', ['cercle']);
  T('c1-14', ['rep']);
  T('c1-15', ['vol']);
  T('c1-16', ['prop', 'pct', 'ech']);
  T('c1-17', ['stat']);
  T('c1-18', ['perim', 'aire', 'cercle']);
  T('c2-1', ['rel', 'fcomp']);
  T('c2-2', ['fadd']);
  T('c2-3', ['fmul']);
  T('c2-4', ['pow']);
  T('c2-5', ['lit']);
  T('c2-6', ['eq1', 'eq2']);
  T('c2-7', ['ordre', 'enc']);
  T('c2-8', ['sym']);
  T('c2-10', ['thal']);
  T('c2-11', ['pyth', 'cercle']);
  T('c2-12', ['vec']);
  T('c2-13', ['pyr', 'vol']);
  T('c2-14', ['prop', 'pct', 'ech']);
  T('c2-15', ['stat']);
  T('c2-9', ['rem']);
  T('c2-16', ['ops4', 'fadd', 'fmul']);
  T('c2-17', ['pyth']);
  T('c2-18', ['cos']);
  T('c3-1', ['sqrt']);
  T('c3-2', ['lit', 'pow', 'sci']);
  T('c3-3', ['ordre', 'enc']);
  T('c3-4', ['eq2', 'ineq']);
  T('c3-5', ['sys']);
  T('c3-6', ['pyth', 'trig']);
  T('c3-7', ['thal']);
  T('c3-8', ['inscrit']);
  T('c3-9', ['thal']);
  T('c3-10', ['vec']);
  T('c3-11', ['rep']);
  T('c3-12', ['droite']);
  T('c3-13', ['vol']);
  T('c3-14', ['droite', 'prop']);
  T('c3-15', ['stat']);

  window.LAB_CONFIG = {
    riddles: [
      {
        "q": "Je pense à un nombre, je le double, j’ajoute 6, puis je divise par 2. J’obtiens 11. Quel est mon nombre ?",
        "qa": "فكرت في عدد، ضاعفته، أضفت 6 ثم قسمت على 2 فوجدت 11. ما هو العدد؟",
        "o": [
          "5",
          "8",
          "11",
          "14"
        ],
        "a": 1,
        "e": "(2x + 6) ÷ 2 = x + 3. Donc x + 3 = 11 et x = 8.",
        "ea": "(2x + 6) ÷ 2 = x + 3. إذن x + 3 = 11 و x = 8."
      },
      {
        "q": "Combien de diagonales a un hexagone ?",
        "qa": "كم قطرا للسداسي؟",
        "o": [
          "6",
          "12",
          "9",
          "18"
        ],
        "a": 2,
        "e": "Chaque sommet se relie à 3 autres sommets non voisins : 6 × 3 ÷ 2 = 9.",
        "ea": "كل رأس يتصل بثلاثة رؤوس غير مجاورة: 6 × 3 ÷ 2 = 9."
      },
      {
        "q": "Un carré a un périmètre de 20 cm. Quelle est son aire ?",
        "qa": "محيط مربع 20 سم. ما مساحته؟",
        "o": [
          "20 cm²",
          "40 cm²",
          "100 cm²",
          "25 cm²"
        ],
        "a": 3,
        "e": "Le côté vaut 20 ÷ 4 = 5 cm. L’aire vaut 5 × 5 = 25 cm².",
        "ea": "الضلع = 20 ÷ 4 = 5 سم. المساحة = 5 × 5 = 25 سم²."
      },
      {
        "q": "Quel est le plus petit entier positif divisible à la fois par 2, 3 et 4 ?",
        "qa": "ما هو أصغر عدد صحيح موجب يقبل القسمة على 2 و3 و4 معا؟",
        "o": [
          "12",
          "6",
          "24",
          "9"
        ],
        "a": 0,
        "e": "Les multiples de 4 sont 4, 8, 12… Le premier qui est aussi multiple de 3 est 12.",
        "ea": "مضاعفات 4: 4 و8 و12... أول مضاعف منها يقبل القسمة على 3 هو 12."
      },
      {
        "q": "On multiplie le côté d’un carré par 3. Par combien l’aire est-elle multipliée ?",
        "qa": "ضربنا ضلع مربع في 3. في كم تضرب مساحته؟",
        "o": [
          "3",
          "6",
          "12",
          "9"
        ],
        "a": 3,
        "e": "Le nouveau côté est 3c, donc l’aire est (3c)² = 9c².",
        "ea": "الضلع الجديد 3c إذن المساحة (3c)² = 9c²."
      },
      {
        "q": "La moyenne de 4, 8 et x est égale à 8. Que vaut x ?",
        "qa": "معدل الأعداد 4 و8 و x يساوي 8. كم قيمة x؟",
        "o": [
          "8",
          "10",
          "12",
          "14"
        ],
        "a": 2,
        "e": "La somme vaut 3 × 8 = 24. Donc x = 24 − 4 − 8 = 12.",
        "ea": "المجموع = 3 × 8 = 24. إذن x = 24 − 4 − 8 = 12."
      }
    ],
    app: 'maths', appName: 'Maths en mouvement', map: M1,
    gen: function (key, d) {
      var G = expo();
      if (EXTRA[key]) return EXTRA[key](d);
      if (d === 4 && HARD[key]) return HARD[key]();
      if (!G || !G[key]) return null;
      return G[key](d === 4 ? 3 : d);
    }
  };
})();

window.LAB_CONFIG && (window.LAB_CONFIG.embed = true);
