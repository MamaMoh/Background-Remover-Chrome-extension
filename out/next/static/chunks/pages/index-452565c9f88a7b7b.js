(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5557:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return a(8640)}])},8640:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return m}});var s=a(5893),n=a(7294),l=a(6467),o=a.n(l),r=a(2339),i=a(5093),u=a(1163),_=a(3454);_.env.REPLICATE_API_TOKEN,_.env.REPLICATE_MODEL_VERSION;let c=(0,i.Uploader)({apiKey:_.env.NEXT_PUBLIC_UPLOAD_API_TOKEN?_.env.NEXT_PUBLIC_UPLOAD_API_TOKEN:"free"}),d={apiKey:"free",maxFileCount:1},p=e=>{let{navigateToPage:t}=e,[a,l]=(0,n.useState)(!1),[i,_]=(0,n.useState)(null),[p,m]=(0,n.useState)(null),[g,h]=(0,n.useState)(null),[f,w]=(0,n.useState)(null),[P,N]=(0,n.useState)(!1),[v,T]=(0,n.useState)(void 0),[S,x]=(0,n.useState)(!1),[j,E]=(0,n.useState)(!0),[U,b]=(0,n.useState)(""),k=(0,u.useRouter)();(0,n.useEffect)(()=>{let e=localStorage.getItem("apiToken");b(e)},[]);let I=async e=>{console.log("file to be sent:",U);let t=Date.now();T(void 0),N(!0);let a=await fetch("https://background-remover-chrome-extension.vercel.app/api/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imageUrl:e})}),s=await a.json();if(201!==a.status){_(s.detail),N(!1);return}for(w(s);"succeeded"!==s.status&&"failed"!==s.status;){let e=await fetch("https://background-remover-chrome-extension.vercel.app/api/remove/"+s.id);if(s=await e.json(),200!==e.status){_(s.detail),N(!1);return}w(s)}console.log("API Response:",s),"failed"===s.status&&_(!0),("succeeded"===s.status||"failed"===s.status)&&N(!1);let n=Date.now();T((n-t)/1e3),localStorage.setItem("resultImageUrl",s.output),k.push({pathname:"/New",query:{imageUrl:s.output}})},y=e=>{E(!1),e>=4?window.open("https://www.google.com","_blank"):window.open("https://www.youtube.com/hashtag/funnyvideo","_blank")};return(0,s.jsx)("div",{className:o().container,children:(0,s.jsxs)("main",{className:o().main,children:[(0,s.jsx)("h1",{className:o().title,children:"Background Remover"}),(0,s.jsx)("p",{className:o().description,children:"This is AI that removes the background any image for you!"}),(0,s.jsx)(r.UploadButton,{uploader:c,options:d,onComplete:e=>{0!==e.length&&(m(e[0].originalFile.originalFileName),h(e[0].fileUrl.replace("raw","thumbnail")),I(e[0].fileUrl.replace("raw","thumbnail")))},children:e=>{let{onClick:t}=e;return(0,s.jsx)("button",{className:o().uploadButton,onClick:t,disabled:a,children:a?"Uploading...":"click to remove"})}}),i&&(0,s.jsx)("p",{className:o().error,children:i}),j&&(0,s.jsxs)("div",{className:o().rateUs,children:[(0,s.jsx)("h2",{className:o().rateUsTitle,children:"Rate Us:"}),(0,s.jsx)("div",{className:o().stars,children:[1,2,3,4,5].map(e=>(0,s.jsx)("span",{onClick:()=>y(e),className:o().star,children:"⭐️"},e))})]})]})})};function m(){let[e,t]=(0,n.useState)("index"),a=e=>{t(e)};return(0,s.jsx)(s.Fragment,{children:"index"===e&&(0,s.jsx)(p,{navigateToPage:a})})}},6467:function(e){e.exports={container:"Pages_container__SbWhT",main:"Pages_main__5_Vsf",title:"Pages_title__5_zk8",description:"Pages_description__Vsj9E",code:"Pages_code__vzNOX",rateUs:"Pages_rateUs__a0VgZ",rateUsTitle:"Pages_rateUsTitle__y_FNp",stars:"Pages_stars__SLMR1",star:"Pages_star__m7e3F",uploadButton:"Pages_uploadButton__wyTj8",resultContainer:"Pages_resultContainer__Tdd_c",resultTitle:"Pages_resultTitle___c8th",resultImage:"Pages_resultImage__YR_Hf",fullScreenButton:"Pages_fullScreenButton__n01qB",downloadButton:"Pages_downloadButton__dfF9w"}}},function(e){e.O(0,[510,883,736,774,888,179],function(){return e(e.s=5557)}),_N_E=e.O()}]);