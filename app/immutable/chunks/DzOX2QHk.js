import{s as M,h as I,g as ae,i as se,a as fe,b as ie,j as K,k as ne,H as ue,r as V,c as D,f as y,l as le,d as Q,e as W,p as te,m as Z,n as ve,o as _e,q as z,I as H,t as F,u as L,v as J,w as de,x as oe,y as ce,z as he,A as O,B as pe,C as Ae,D as $,F as Ee,G as ge,J as Ie,K as Te,L as Ne,M as we}from"./DOlIlF4o.js";import{a as xe}from"./BZWCcjCa.js";function De(r,e){return e}function ke(r,e,a,n){for(var u=[],t=e.length,_=0;_<t;_++)de(e[_].e,u,!0);var o=t>0&&u.length===0&&a!==null;if(o){var E=a.parentNode;oe(E),E.append(a),n.clear(),w(r,e[0].prev,e[t-1].next)}ce(u,()=>{for(var h=0;h<t;h++){var d=e[h];o||(n.delete(d.k),w(r,d.prev,d.next)),he(d.e,!o)}})}function He(r,e,a,n,u,t=null){var _=r,o={flags:e,items:new Map,first:null},E=(e&$)!==0;if(E){var h=r;_=I?M(ae(h)):h.appendChild(se())}I&&fe();var d=null,x=!1,i=ne(()=>{var v=a();return ve(v)?v:v==null?[]:Z(v)});ie(()=>{var v=K(i),s=v.length;if(x&&s===0)return;x=s===0;let T=!1;if(I){var p=_.data===ue;p!==(s===0)&&(_=V(),M(_),D(!1),T=!0)}if(I){for(var A=null,g,c=0;c<s;c++){if(y.nodeType===8&&y.data===le){_=y,T=!0,D(!1);break}var f=v[c],l=n(f,c);g=j(y,o,A,null,f,l,c,u,e,a),o.items.set(l,g),A=g}s>0&&M(V())}I||ye(v,o,_,u,e,n,a),t!==null&&(s===0?d?Q(d):d=W(()=>t(_)):d!==null&&te(d,()=>{d=null})),T&&D(!0),K(i)}),I&&(_=y)}function ye(r,e,a,n,u,t,_){var q,B,G,Y;var o=(u&ge)!==0,E=(u&(O|L))!==0,h=r.length,d=e.items,x=e.first,i=x,v,s=null,T,p=[],A=[],g,c,f,l;if(o)for(l=0;l<h;l+=1)g=r[l],c=t(g,l),f=d.get(c),f!==void 0&&((q=f.a)==null||q.measure(),(T??(T=new Set)).add(f));for(l=0;l<h;l+=1){if(g=r[l],c=t(g,l),f=d.get(c),f===void 0){var ee=i?i.e.nodes_start:a;s=j(ee,e,s,s===null?e.first:s.next,g,c,l,n,u,_),d.set(c,s),p=[],A=[],i=s.next;continue}if(E&&Ce(f,g,l,u),(f.e.f&H)!==0&&(Q(f.e),o&&((B=f.a)==null||B.unfix(),(T??(T=new Set)).delete(f))),f!==i){if(v!==void 0&&v.has(f)){if(p.length<A.length){var C=A[0],N;s=C.prev;var b=p[0],R=p[p.length-1];for(N=0;N<p.length;N+=1)P(p[N],C,a);for(N=0;N<A.length;N+=1)v.delete(A[N]);w(e,b.prev,R.next),w(e,s,b),w(e,R,C),i=C,s=R,l-=1,p=[],A=[]}else v.delete(f),P(f,i,a),w(e,f.prev,f.next),w(e,f,s===null?e.first:s.next),w(e,s,f),s=f;continue}for(p=[],A=[];i!==null&&i.k!==c;)(i.e.f&H)===0&&(v??(v=new Set)).add(i),A.push(i),i=i.next;if(i===null)continue;f=i}p.push(f),s=f,i=f.next}if(i!==null||v!==void 0){for(var k=v===void 0?[]:Z(v);i!==null;)(i.e.f&H)===0&&k.push(i),i=i.next;var S=k.length;if(S>0){var re=(u&$)!==0&&h===0?a:null;if(o){for(l=0;l<S;l+=1)(G=k[l].a)==null||G.measure();for(l=0;l<S;l+=1)(Y=k[l].a)==null||Y.fix()}ke(e,k,re,d)}}o&&Ee(()=>{var m;if(T!==void 0)for(f of T)(m=f.a)==null||m.apply()}),F.first=e.first&&e.first.e,F.last=s&&s.e}function Ce(r,e,a,n){(n&O)!==0&&J(r.v,e),(n&L)!==0?J(r.i,a):r.i=a}function j(r,e,a,n,u,t,_,o,E,h){var d=(E&O)!==0,x=(E&pe)===0,i=d?x?_e(u):z(u):u,v=(E&L)===0?_:z(_),s={i:v,v:i,k:t,a:null,e:null,prev:a,next:n};try{return s.e=W(()=>o(r,i,v,h),I),s.e.prev=a&&a.e,s.e.next=n&&n.e,a===null?e.first=s:(a.next=s,a.e.next=s.e),n!==null&&(n.prev=s,n.e.prev=s.e),s}finally{}}function P(r,e,a){for(var n=r.next?r.next.e.nodes_start:a,u=e?e.e.nodes_start:a,t=r.e.nodes_start;t!==n;){var _=Ae(t);u.before(t),t=_}}function w(r,e,a){e===null?r.first=a:(e.next=a,e.e.next=a&&a.e),a!==null&&(a.prev=e,a.e.prev=e&&e.e)}function Le(r){if(I){var e=!1,a=()=>{if(!e){if(e=!0,r.hasAttribute("value")){var n=r.value;U(r,"value",null),r.value=n}if(r.hasAttribute("checked")){var u=r.checked;U(r,"checked",null),r.checked=u}}};r.__on_r=a,we(a),xe()}}function Oe(r,e){var a=r.__attributes??(r.__attributes={});a.value===(a.value=e??void 0)||r.value===e&&(e!==0||r.nodeName!=="PROGRESS")||(r.value=e??"")}function U(r,e,a,n){var u=r.__attributes??(r.__attributes={});I&&(u[e]=r.getAttribute(e),e==="src"||e==="srcset"||e==="href"&&r.nodeName==="LINK")||u[e]!==(u[e]=a)&&(e==="style"&&"__styles"in r&&(r.__styles={}),e==="loading"&&(r[Ne]=a),a==null?r.removeAttribute(e):typeof a!="string"&&Re(r).includes(e)?r[e]=a:r.setAttribute(e,a))}var X=new Map;function Re(r){var e=X.get(r.nodeName);if(e)return e;X.set(r.nodeName,e=[]);for(var a,n=r,u=Element.prototype;u!==n;){a=Te(n);for(var t in a)a[t].set&&e.push(t);n=Ie(n)}return e}export{Oe as a,He as e,De as i,Le as r,U as s};
