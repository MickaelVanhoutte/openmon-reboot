import{h as m,j as y,e as w,q as P,S as g}from"./C7FQ2LN7.js";function E(e,r){return e===r||(e==null?void 0:e[g])===r}function B(e={},r,o,h){return m(()=>{var c,s;return y(()=>{c=s,s=[],w(()=>{e!==o(...s)&&(r(e,...s),c&&E(o(...c),e)&&r(null,...c))})}),()=>{P(()=>{s&&E(o(...s),e)&&r(null,...s)})}}),e}const v="modulepreload",L=function(e,r){return new URL(e,r).href},S={},A=function(r,o,h){let c=Promise.resolve();if(o&&o.length>0){const a=document.getElementsByTagName("link"),t=document.querySelector("meta[property=csp-nonce]"),d=(t==null?void 0:t.nonce)||(t==null?void 0:t.getAttribute("nonce"));c=Promise.allSettled(o.map(n=>{if(n=L(n,h),n in S)return;S[n]=!0;const l=n.endsWith(".css"),k=l?'[rel="stylesheet"]':"";if(!!h)for(let f=a.length-1;f>=0;f--){const u=a[f];if(u.href===n&&(!l||u.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${n}"]${k}`))return;const i=document.createElement("link");if(i.rel=l?"stylesheet":v,l||(i.as="script"),i.crossOrigin="",i.href=n,d&&i.setAttribute("nonce",d),document.head.appendChild(i),l)return new Promise((f,u)=>{i.addEventListener("load",f),i.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${n}`)))})}))}function s(a){const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=a,window.dispatchEvent(t),!t.defaultPrevented)throw a}return c.then(a=>{for(const t of a||[])t.status==="rejected"&&s(t.reason);return r().catch(s)})};export{A as _,B as b};
