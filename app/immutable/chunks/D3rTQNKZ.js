import{x as R,p as u,w as g,Y as D,Z as S,H as h,z as F,o as H,A as I,D as A,E as b,F as v,_ as Y,B as k}from"./BHRGkEAq.js";function O(E,_,[t,s]=[0,0]){u&&t===0&&g();var a=E,f=null,e=null,i=Y,m=t>0?D:0,c=!1;const p=(n,l=!0)=>{c=!0,o(l,n)},o=(n,l)=>{if(i===(i=n))return;let T=!1;if(u&&s!==-1){if(t===0){const r=a.data;r===S?s=0:r===h?s=1/0:(s=parseInt(r.substring(1)),s!==s&&(s=i?1/0:-1))}const N=s>t;!!i===N&&(a=F(),H(a),I(!1),T=!0,s=-1)}i?(f?A(f):l&&(f=b(()=>l(a))),e&&v(e,()=>{e=null})):(e?A(e):l&&(e=b(()=>l(a,[t+1,s]))),f&&v(f,()=>{f=null})),T&&I(!0)};R(()=>{c=!1,_(p),c||o(null,null)},m),u&&(a=k)}export{O as i};
