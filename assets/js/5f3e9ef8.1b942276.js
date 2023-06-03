"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7956],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=o.createContext({}),s=function(e){var t=o.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=s(e.components);return o.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=s(n),m=r,f=d["".concat(p,".").concat(m)]||d[m]||c[m]||i;return n?o.createElement(f,a(a({ref:t},u),{},{components:n})):o.createElement(f,a({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=d;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:r,a[1]=l;for(var s=2;s<i;s++)a[s]=n[s];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1288:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>a,default:()=>c,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var o=n(7462),r=(n(7294),n(3905));const i={title:"window.location"},a=void 0,l={unversionedId:"lab/runtime-location",id:"lab/runtime-location",title:"window.location",description:"This guide refers to upcoming Expo Router features, all of which are experimental. You may need to use Expo CLI on main to use these features.",source:"@site/docs/lab/runtime-location.md",sourceDirName:"lab",slug:"/lab/runtime-location",permalink:"/router/docs/lab/runtime-location",draft:!1,editUrl:"https://github.com/expo/router/tree/main/docs/docs/lab/runtime-location.md",tags:[],version:"current",frontMatter:{title:"window.location"},sidebar:"tutorialSidebar",previous:{title:"Root HTML",permalink:"/router/docs/lab/root-html"},next:{title:"Static Rendering",permalink:"/router/docs/lab/static-rendering"}},p={},s=[{value:"Setup",id:"setup",level:2},{value:"Native",id:"native",level:3},{value:"Usage",id:"usage",level:2},{value:"Disable Polyfill",id:"disable-polyfill",level:2}],u={toc:s};function c(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"This guide refers to upcoming Expo Router features, all of which are experimental. You may need to ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/expo/expo/tree/main/packages/%40expo/cli#contributing"},"use Expo CLI on ",(0,r.kt)("inlineCode",{parentName:"a"},"main"))," to use these features.")),(0,r.kt)("p",null,"To support relative invocations that work both on the web and in native, across development and production, Expo Router polyfills the ",(0,r.kt)("inlineCode",{parentName:"p"},"window.location")," API when needed. This can be used to access the current URL."),(0,r.kt)("p",null,"By default, the global ",(0,r.kt)("inlineCode",{parentName:"p"},"fetch")," instance is polyfilled to support ",(0,r.kt)("inlineCode",{parentName:"p"},"window.location"),", other networking APIs will need to be polyfilled manually, e.g. ",(0,r.kt)("inlineCode",{parentName:"p"},'<Image source={{ uri: location.origin + "/img.png" }} />'),". We may polyfill these in the future to support more use cases."),(0,r.kt)("h2",{id:"setup"},"Setup"),(0,r.kt)("p",null,"No setup is required on web, and no polyfill is needed."),(0,r.kt)("h3",{id:"native"},"Native"),(0,r.kt)("p",null,"In development, the ",(0,r.kt)("inlineCode",{parentName:"p"},"window.location")," API is polyfilled to point to the development server. In production, the ",(0,r.kt)("inlineCode",{parentName:"p"},"window.location")," API is polyfilled to point to the URL that your static assets are ",(0,r.kt)("a",{parentName:"p",href:"/router/docs/guides/hosting"},"hosted at"),", this must be configured manually."),(0,r.kt)("p",null,"In order to polyfill in production, the ",(0,r.kt)("inlineCode",{parentName:"p"},"expo-router")," config plugin must be used, and the ",(0,r.kt)("inlineCode",{parentName:"p"},"origin")," prop must be provided in the ",(0,r.kt)("inlineCode",{parentName:"p"},"app.config.js")," (or ",(0,r.kt)("inlineCode",{parentName:"p"},"app.json"),"). ",(0,r.kt)("inlineCode",{parentName:"p"},"origin")," must be set to the URL that your static assets are ",(0,r.kt)("a",{parentName:"p",href:"/router/docs/guides/hosting"},"hosted at"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js",metastring:"title=app.config.js",title:"app.config.js"},'module.exports = {\n  plugins: [\n    [\n      "expo-router",\n      {\n        origin: "https://acme.com",\n      },\n    ],\n  ],\n};\n')),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Recommend using ",(0,r.kt)("inlineCode",{parentName:"p"},"app.config.js")," to support dynamically swapping the URL before bundling.")),(0,r.kt)("p",null,"You can host your ",(0,r.kt)("inlineCode",{parentName:"p"},"public/")," directory and other public resources by deploying the expo website to a server that supports HTTPS. For instance, running ",(0,r.kt)("inlineCode",{parentName:"p"},"npx expo export && netlify deploy --dir dist --prod")," will collect your resources and deploy them to netlify, ",(0,r.kt)("strong",{parentName:"p"},"we plan to automate this in the future.")," See the ",(0,r.kt)("a",{parentName:"p",href:"/router/docs/guides/hosting"},"hosting guide for more"),"."),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Public assets will not be bundled into your native app or available offline (with exception for network caching).")),(0,r.kt)("h2",{id:"usage"},"Usage"),(0,r.kt)("p",null,"The following example demonstrates how to use ",(0,r.kt)("inlineCode",{parentName:"p"},"window.location")," to fetch a JSON file in the root ",(0,r.kt)("inlineCode",{parentName:"p"},"public/")," directory."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:"title=public/hello.json",title:"public/hello.json"},'{\n  "hello": "world"\n}\n')),(0,r.kt)("p",null,"In one of the routes, use the polyfilled ",(0,r.kt)("inlineCode",{parentName:"p"},"fetch")," to fetch the JSON file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js",metastring:"title=app/index.js",title:"app/index.js"},'import { Text } from "react-native";\n\nexport default function Page() {\n  useEffect(() => {\n    fetch("/hello.json", {})\n      .then((res) => res.json())\n      .then(console.log);\n  }, []);\n\n  return <Text>Hello World</Text>;\n}\n')),(0,r.kt)("p",null,"If you run this, you should see the following output in the console:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{ "hello": "world" }\n')),(0,r.kt)("h2",{id:"disable-polyfill"},"Disable Polyfill"),(0,r.kt)("p",null,"Setting the field ",(0,r.kt)("inlineCode",{parentName:"p"},"origin: false")," in the ",(0,r.kt)("inlineCode",{parentName:"p"},"app.config.js")," (or ",(0,r.kt)("inlineCode",{parentName:"p"},"app.json"),") will disable the ",(0,r.kt)("inlineCode",{parentName:"p"},"window.location")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"fetch")," polyfills."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:"title=app.json",title:"app.json"},'{\n  "expo": {\n    "plugins": [\n      [\n        "expo-router",\n        {\n          "origin": false\n        }\n      ]\n    ]\n  }\n}\n')))}c.isMDXComponent=!0}}]);