(()=>{var e,t={399:e=>{e.exports=function(e,t){return e.replace("<title>AFront</title>","<title>".concat(t.title||"AFront","</title>")).replace(/<meta name="title" content="[^"]*">/,t.description?'<meta name="title" content="'.concat(t.title,'">'):'<meta name="title" content="Default description">').replace(/<meta name="description" content="[^"]*">/,t.description?'<meta name="description" content="'.concat(t.description,'">'):'<meta name="description" content="Default description">').replace(/<meta name="keywords" content="[^"]*">/,t.keywords?'<meta name="keywords" content="'.concat(t.keywords,'">'):'<meta name="keywords" content="default, keywords">')}},973:(e,t,r)=>{function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a,i,c=[],l=!0,s=!1;try{if(a=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;l=!1}else for(;!(l=(n=a.call(r)).done)&&(c.push(n.value),c.length!==t);l=!0);}catch(e){s=!0,o=e}finally{try{if(!l&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(s)throw o}}return c}}(e,t)||function(e,t){if(e){if("string"==typeof e)return a(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?a(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}function i(){"use strict";i=function(){return t};var e,t={},r=Object.prototype,o=r.hasOwnProperty,a=Object.defineProperty||function(e,t,r){e[t]=r.value},c="function"==typeof Symbol?Symbol:{},l=c.iterator||"@@iterator",s=c.asyncIterator||"@@asyncIterator",u=c.toStringTag||"@@toStringTag";function f(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{f({},"")}catch(e){f=function(e,t,r){return e[t]=r}}function m(e,t,r,n){var o=t&&t.prototype instanceof E?t:E,i=Object.create(o.prototype),c=new F(n||[]);return a(i,"_invoke",{value:j(e,r,c)}),i}function h(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}t.wrap=m;var p="suspendedStart",d="suspendedYield",v="executing",y="completed",g={};function E(){}function b(){}function w(){}var x={};f(x,l,(function(){return this}));var N=Object.getPrototypeOf,k=N&&N(N(P([])));k&&k!==r&&o.call(k,l)&&(x=k);var S=w.prototype=E.prototype=Object.create(x);function L(e){["next","throw","return"].forEach((function(t){f(e,t,(function(e){return this._invoke(t,e)}))}))}function _(e,t){function r(a,i,c,l){var s=h(e[a],e,i);if("throw"!==s.type){var u=s.arg,f=u.value;return f&&"object"==n(f)&&o.call(f,"__await")?t.resolve(f.__await).then((function(e){r("next",e,c,l)}),(function(e){r("throw",e,c,l)})):t.resolve(f).then((function(e){u.value=e,c(u)}),(function(e){return r("throw",e,c,l)}))}l(s.arg)}var i;a(this,"_invoke",{value:function(e,n){function o(){return new t((function(t,o){r(e,n,t,o)}))}return i=i?i.then(o,o):o()}})}function j(t,r,n){var o=p;return function(a,i){if(o===v)throw Error("Generator is already running");if(o===y){if("throw"===a)throw i;return{value:e,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var l=A(c,n);if(l){if(l===g)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===p)throw o=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var s=h(t,r,n);if("normal"===s.type){if(o=n.done?y:d,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=y,n.method="throw",n.arg=s.arg)}}}function A(t,r){var n=r.method,o=t.iterator[n];if(o===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,A(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=h(o,t.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function O(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function C(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function F(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(O,this),this.reset(!0)}function P(t){if(t||""===t){var r=t[l];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var a=-1,i=function r(){for(;++a<t.length;)if(o.call(t,a))return r.value=t[a],r.done=!1,r;return r.value=e,r.done=!0,r};return i.next=i}}throw new TypeError(n(t)+" is not iterable")}return b.prototype=w,a(S,"constructor",{value:w,configurable:!0}),a(w,"constructor",{value:b,configurable:!0}),b.displayName=f(w,u,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===b||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,f(e,u,"GeneratorFunction")),e.prototype=Object.create(S),e},t.awrap=function(e){return{__await:e}},L(_.prototype),f(_.prototype,s,(function(){return this})),t.AsyncIterator=_,t.async=function(e,r,n,o,a){void 0===a&&(a=Promise);var i=new _(m(e,r,n,o),a);return t.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},L(S),f(S,u,"Generator"),f(S,l,(function(){return this})),f(S,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=P,F.prototype={constructor:F,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(C),!t)for(var r in this)"t"===r.charAt(0)&&o.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function n(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var l=o.call(i,"catchLoc"),s=o.call(i,"finallyLoc");if(l&&s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),C(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;C(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:P(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),g}},t}function c(e,t,r,n,o,a,i){try{var c=e[a](i),l=c.value}catch(e){return void r(e)}c.done?t(l):Promise.resolve(l).then(n,o)}function l(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var a=e.apply(t,r);function i(e){c(a,n,o,i,l,"next",e)}function l(e){c(a,n,o,i,l,"throw",e)}i(void 0)}))}}r(708)({presets:["@babel/preset-env","@babel/preset-react"]});var s=r(252),u=r(896).promises,f=r(928),m=r(15),h=r(468),p=r(12).StaticRouter,d=r(559).A,v=r(399);r(818).config();var y=s(),g=process.env.PORT,E=process.env.HOST,b=f.resolve(__dirname,"../build-prod");y.get("/",function(){var e=l(i().mark((function e(t,r){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,w(t.url,r);case 3:e.next=9;break;case 5:e.prev=5,e.t0=e.catch(0),console.error("Error reading index file:",e.t0),r.status(500).send("Error loading the index file");case 9:case"end":return e.stop()}}),e,null,[[0,5]])})));return function(t,r){return e.apply(this,arguments)}}()),y.use(s.static(b)),y.get("*",function(){var e=l(i().mark((function e(t,r){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,w(t.url,r);case 3:e.next=9;break;case 5:e.prev=5,e.t0=e.catch(0),console.error("Error rendering app:",e.t0),r.status(500).send("Internal Server Error");case 9:case"end":return e.stop()}}),e,null,[[0,5]])})));return function(t,r){return e.apply(this,arguments)}}());var w=function(){var e=l(i().mark((function e(t,r){var n,a,c;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n={},a=!1,c=h.renderToPipeableStream(m.createElement(p,{location:t,context:n},m.createElement(d,{context:n})),{onShellReady:function(){r.statusCode=a?500:200,r.setHeader("Content-type","text/html"),u.readFile(f.resolve(b,"index.html"),"utf8").then((function(e){var t=o(v(e,n).split('<asggenapp id="asggen"></asggenapp>'),1)[0];r.write(t+'<asggenapp id="asggen">'),c.pipe(r,{end:!1})})).catch((function(e){console.error("Error reading index file:",e),r.status(500).send("Internal Server Error")}))},onShellError:function(e){a=!0,console.error("Error during onShellError:",e),r.status(500).send("Internal Server Error")},onError:function(e){a=!0,console.error("Error during streaming:",e)}});case 3:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}();y.listen(g,E,(function(){console.log("Server is running on port http://".concat(E,":").concat(g))}))},559:(e,t,r)=>{"use strict";r.d(t,{A:()=>v});var n=r(15),o=r.n(n);const a=require("react-router-dom");const i=[{path:"/",element:(0,n.lazy)((function(){return r.e(41).then(r.bind(r,488))}))},{path:"/support",element:(0,n.lazy)((function(){return r.e(3).then(r.bind(r,3))}))},{path:"/*",element:(0,n.lazy)((function(){return r.e(573).then(r.bind(r,573))}))}];const c=r.p+"static/media/52f06bb716d4ecad087a.png";const l=function(){return o().createElement("div",{className:"loadingContainer"},o().createElement("img",{src:c,alt:"Loading...",className:"loadingLogo"}))};const s=function(e){var t=e.context;return o().createElement(n.Suspense,{fallback:o().createElement(l,null)},o().createElement(a.Routes,null,i.map((function(e,r){var n=e.path,i=e.element;return o().createElement(a.Route,{key:r,path:n,element:o().createElement(i,{context:t})})}))))};function u(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a,i,c=[],l=!0,s=!1;try{if(a=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;l=!1}else for(;!(l=(n=a.call(r)).done)&&(c.push(n.value),c.length!==t);l=!0);}catch(e){s=!0,o=e}finally{try{if(!l&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(s)throw o}}return c}}(e,t)||function(e,t){if(e){if("string"==typeof e)return f(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?f(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}const m=function(){var e=u((0,n.useState)(!1),2),t=e[0],r=e[1],a=u((0,n.useState)(!1),2),i=a[0],c=a[1],l=function(){r(!1)};return(0,n.useEffect)((function(){var e=function(){c(window.scrollY>=5)};return window.addEventListener("scroll",e),function(){window.removeEventListener("scroll",e)}}),[]),(0,n.useEffect)((function(){var e=function(){window.innerWidth>768&&t&&r(!1)};return window.addEventListener("resize",e),function(){window.removeEventListener("resize",e)}}),[t]),(0,n.useEffect)((function(){return document.body.style.overflow=t?"hidden":"auto",function(){document.body.style.overflow="auto"}}),[t]),o().createElement("header",{className:"header  ".concat(t?"off-scroll":"".concat(i?"on-scroll":"")," "),id:"header"},o().createElement("nav",{className:"navbar container"},o().createElement("a",{href:"/",className:"brand"},"AFront"),o().createElement("div",{className:"burger ".concat(t?"is-active":""),id:"burger",onClick:function(){r(!t)}},o().createElement("span",{className:"burger-line"}),o().createElement("span",{className:"burger-line"}),o().createElement("span",{className:"burger-line"})),o().createElement("div",{className:"menu ".concat(t?"is-active ":"is-inactive"),id:"menu"},o().createElement("ul",{className:"menu-inner"},o().createElement("li",{className:"menu-item"},o().createElement("a",{href:"#",className:"menu-link ".concat(t?"menu-link-mobile":""),onClick:l},"Learn")),o().createElement("li",{className:"menu-item"},o().createElement("a",{href:"#",className:"menu-link ".concat(t?"menu-link-mobile":""),onClick:l},"Feature")),o().createElement("li",{className:"menu-item"},o().createElement("a",{href:"#",className:"menu-link ".concat(t?"menu-link-mobile":""),onClick:l},"Blog")),o().createElement("li",{className:"menu-item"},o().createElement("a",{href:"/support",className:"menu-link ".concat(t?"menu-link-mobile":""),onClick:l},"Support")),t&&o().createElement(o().Fragment,null,o().createElement("li",{className:"menu-item"},o().createElement("a",{href:"#",className:"menu-link ".concat(t?"menu-link-mobile":""),onClick:l},"demo"))))),o().createElement("a",{href:"/",className:"menu-block"},"Get Started")))};var h=r(833);const p=function(){return o().createElement("footer",{className:h.qr},o().createElement("div",{className:h.xQ},o().createElement("div",{className:h.TW},o().createElement("a",{href:"/",className:h.V4},"AFront"),o().createElement("p",{className:h.yM},"Empowering front-end development with cutting-edge tools and services.")),o().createElement("div",{className:h.hF},o().createElement("div",{className:h.nc},o().createElement("h4",{className:h.K8},"Company"),o().createElement("ul",{className:h.x8},o().createElement("li",null,o().createElement("a",{href:"/about",className:h.nf},"About Us")),o().createElement("li",null,o().createElement("a",{href:"/careers",className:h.nf},"Careers")),o().createElement("li",null,o().createElement("a",{href:"/contact",className:h.nf},"Contact Us")))),o().createElement("div",{className:h.nc},o().createElement("h4",{className:h.K8},"Resources"),o().createElement("ul",{className:h.x8},o().createElement("li",null,o().createElement("a",{href:"/blog",className:h.nf},"Blog")),o().createElement("li",null,o().createElement("a",{href:"/docs",className:h.nf},"Documentation")),o().createElement("li",null,o().createElement("a",{href:"/community",className:h.nf},"Community")))),o().createElement("div",{className:h.nc},o().createElement("h4",{className:h.K8},"Products"),o().createElement("ul",{className:h.x8},o().createElement("li",null,o().createElement("a",{href:"/features",className:h.nf},"Features")),o().createElement("li",null,o().createElement("a",{href:"/pricing",className:h.nf},"Pricing")),o().createElement("li",null,o().createElement("a",{href:"/support",className:h.nf},"Support")))))),o().createElement("div",{className:h.LD},o().createElement("p",{className:h.xP},"© ",(new Date).getFullYear()," AFront by Asggen Inc. All rights reserved."),o().createElement("div",{className:h.lj},o().createElement("a",{href:"https://twitter.com",className:h.oW},"Twitter"),o().createElement("a",{href:"https://facebook.com",className:h.oW},"Facebook"),o().createElement("a",{href:"https://www.linkedin.com/showcase/asggenchat/",className:h.oW},"LinkedIn"))))};var d=function(){return o().createElement("asggen",{style:{display:"none"},dangerouslySetInnerHTML:{__html:"Rendering Asggen DOM...</asggen></asggenapp></body></html>"}})};const v=function(e){var t=e.context;return o().createElement(o().Fragment,null,o().createElement(m,null),o().createElement(s,{context:t}),o().createElement(p,null),o().createElement(d,null))}},833:(e,t,r)=>{"use strict";r.d(t,{K8:()=>f,LD:()=>o,TW:()=>a,V4:()=>u,hF:()=>s,lj:()=>v,nc:()=>h,nf:()=>m,oW:()=>d,qr:()=>n,x8:()=>p,xP:()=>c,xQ:()=>i,yM:()=>l});var n="footer",o="footerBottom",a="footerBrand",i="footerContainer",c="footerCopy",l="footerDescription",s="footerLinks",u="footerLogo",f="footerTitle",m="link",h="linkColumn",p="linkList",d="socialLink",v="socialLinks"},708:e=>{"use strict";e.exports=require("@babel/register")},411:e=>{"use strict";e.exports=require("asggen-headtags")},818:e=>{"use strict";e.exports=require("dotenv")},252:e=>{"use strict";e.exports=require("express")},791:e=>{"use strict";e.exports=require("ignore-styles")},15:e=>{"use strict";e.exports=require("react")},468:e=>{"use strict";e.exports=require("react-dom/server")},12:e=>{"use strict";e.exports=require("react-router-dom/server")},896:e=>{"use strict";e.exports=require("fs")},928:e=>{"use strict";e.exports=require("path")}},r={};function n(e){var o=r[e];if(void 0!==o)return o.exports;var a=r[e]={exports:{}};return t[e](a,a.exports,n),a.exports}n.m=t,n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((t,r)=>(n.f[r](e,t),t)),[])),n.u=e=>e+".ssr.prod.js",n.miniCssF=e=>"static/css/"+e+"-"+{3:"9b9bcf0b9b877caf80c6",41:"1bd05b5a5a70ee2fc084",573:"7b8794ea227293d474c9"}[e]+".css",n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.p="",(()=>{if("undefined"!=typeof document){var e=e=>new Promise(((t,r)=>{var o=n.miniCssF(e),a=n.p+o;if(((e,t)=>{for(var r=document.getElementsByTagName("link"),n=0;n<r.length;n++){var o=(i=r[n]).getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(o===e||o===t))return i}var a=document.getElementsByTagName("style");for(n=0;n<a.length;n++){var i;if((o=(i=a[n]).getAttribute("data-href"))===e||o===t)return i}})(o,a))return t();((e,t,r,o,a)=>{var i=document.createElement("link");i.rel="stylesheet",i.type="text/css",n.nc&&(i.nonce=n.nc),i.onerror=i.onload=r=>{if(i.onerror=i.onload=null,"load"===r.type)o();else{var n=r&&r.type,c=r&&r.target&&r.target.href||t,l=new Error("Loading CSS chunk "+e+" failed.\n("+n+": "+c+")");l.name="ChunkLoadError",l.code="CSS_CHUNK_LOAD_FAILED",l.type=n,l.request=c,i.parentNode&&i.parentNode.removeChild(i),a(l)}},i.href=t,r?r.parentNode.insertBefore(i,r.nextSibling):document.head.appendChild(i)})(e,a,null,t,r)})),t={792:0};n.f.miniCss=(r,n)=>{t[r]?n.push(t[r]):0!==t[r]&&{3:1,41:1,573:1}[r]&&n.push(t[r]=e(r).then((()=>{t[r]=0}),(e=>{throw delete t[r],e})))}}})(),e={792:1},n.f.require=(t,r)=>{e[t]||(t=>{var r=t.modules,o=t.ids,a=t.runtime;for(var i in r)n.o(r,i)&&(n.m[i]=r[i]);a&&a(n);for(var c=0;c<o.length;c++)e[o[c]]=1})(require("./"+n.u(t)))};n(791),n(708)({ignore:[/(node_modules)/],presets:["@babel/preset-env","@babel/preset-react"],extensions:[".js",".jsx",".ts",".tsx",".css"],plugins:[["babel-plugin-css-modules-transform",{extensions:[".css",".scss"],generateScopedName:"[name]__[local]___[hash:base64:5]"}]]}),n(973),module.exports={}})();