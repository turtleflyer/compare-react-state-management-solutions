(this["webpackJsonpcompare-two-implementations"]=this["webpackJsonpcompare-two-implementations"]||[]).push([[0],{36:function(e,t,n){},37:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n(9),i=n.n(c),a=n(2),o=n(3),u=n(1),l={display:"flex",width:170,height:20,color:"white",backgroundColor:"gray",borderRadius:5,justifyContent:"center",alignItems:"center"},s={display:"flex",flexWrap:"nowrap",whiteSpace:"nowrap"},j={margin:"0 5px"},b=function(e){var t=e.info,n=Object(r.useState)(null),c=Object(o.a)(n,2),i=c[0],b=c[1];return t?Object(u.jsx)("div",{ref:function(e){if(e&&!i){var t=e.getBoundingClientRect().width;t>164&&b(1968/t)}},style:Object(a.a)(Object(a.a)(Object(a.a)({},l),s),{},{fontSize:null!==i&&void 0!==i?i:12}),children:t.map((function(e){var t;return"string"===typeof e?Object(r.createElement)("span",{style:j,key:e},e):Object(r.cloneElement)(e,Object(a.a)(Object(a.a)({},e.props),{},{style:Object(a.a)(Object(a.a)({},null!==(t=e.props.style)&&void 0!==t?t:{}),j)}))}))}):Object(u.jsx)("div",{style:Object(a.a)(Object(a.a)({},l),{},{backgroundColor:"transparent"})})},d=n(12),f=function(){var e=[];return{addTipHandler:function(t){e=[].concat(Object(d.a)(e),[t])},removeTipHandler:function(t){e=e.filter((function(e){return e!==t}))},hideOtherTips:function(t){e.forEach((function(e){return e!==t&&e()}))}}},O=Object(r.createContext)(null),h=function(e){var t=e.popupDelay,n=void 0===t?100:t,c=e.children,i=Object(r.useState)(f),a=Object(o.a)(i,1)[0];return Object(u.jsx)(O.Provider,{value:{tipsPoolMethods:a,popupDelay:n},children:c})},v={display:"flex",justifyContent:"center",alignItems:"center",flexShrink:0,fontSize:"1.2em",fontWeight:"bolder",color:"gray",backgroundColor:"rgb(228, 232, 255)",width:"1.2em",height:"1.2em",borderRadius:"0.6em",cursor:"default"},p={position:"absolute",whiteSpace:"normal",width:200,padding:10,color:"black",backgroundColor:"rgb(228, 232, 255)",fontSize:"14px",boxShadow:"3px 3px rgb(141, 144, 166)"},x=function(e){var t=e.popupInfo,n=e.left,r=e.bottom,c=e.clearDelay,i=e.toHide;return Object(u.jsx)("div",{style:Object(a.a)(Object(a.a)({},p),{},{left:n,bottom:r}),onMouseOver:c,onFocus:c,onMouseLeave:i,onBlur:i,children:t})},m=function(e){var t,n=e.style,c=void 0===n?{}:n,i=e.popupInfo,l=Object(r.useRef)(null),s=Object(r.useRef)(null),j=Object(r.useState)(null),b=Object(o.a)(j,2),d=b[0],f=b[1],h=Object(r.useCallback)((function(){return f(null)}),[]),p=null!==(t=Object(r.useContext)(O))&&void 0!==t?t:function(){throw Error("TipsPoolProvider should be in the root of the app")}(),m=p.tipsPoolMethods,g=p.popupDelay,y=function(){s.current=setTimeout((function(){return f(null)}),g)},S=function(){s.current&&clearTimeout(s.current),s.current=null},w=function(){if(d)S();else{if(!l.current)throw Error("(PerformanceInfo) Info tip mark must exist");m.hideOtherTips(h);var e=l.current.getBoundingClientRect(),t=e.x,n=e.y;f({x:t,y:n})}};return Object(r.useEffect)((function(){return m.addTipHandler(h),function(){return m.removeTipHandler(h)}}),[]),Object(u.jsxs)(u.Fragment,{children:[Object(u.jsx)("div",{ref:l,style:Object(a.a)(Object(a.a)({},v),c),onMouseOver:w,onFocus:w,onMouseLeave:y,onBlur:y,role:"link",tabIndex:0,children:"i"}),d&&Object(u.jsx)(x,{popupInfo:i,left:d.x+10,bottom:document.documentElement.clientHeight-document.documentElement.scrollTop-d.y+5,clearDelay:S,toHide:y})]})},g=function(){return Object(u.jsxs)(u.Fragment,{children:[Object(u.jsx)("strong",{children:"TTI (Time to Interactive)"})," metric measures the time until the main sub-resources of the page have rendered and it is capable of reliably responding to user input quickly (similar to ",Object(u.jsx)("a",{href:"https://web.dev/tti/",target:"blank",children:"that"}),").",Object(u.jsx)("br",{}),Object(u.jsx)("br",{}),Object(u.jsx)("strong",{children:"TBT (Total Blocking Time)"})," measures the total amount of time until TTI in the chunks where the main thread was blocked for long enough to prevent input responsiveness (similar to ",Object(u.jsx)("a",{href:"https://web.dev/tbt/",target:"blank",children:"that"}),")."]})},y=function(e){switch(e.status){case"done":var t=e.data,n=t.TTI,r=t.TBT;return Object(u.jsx)(b,{info:["TTI: ".concat(Math.round(n),"ms - TBT: ").concat(Math.round(r),"ms"),Object(u.jsx)(m,{popupInfo:Object(u.jsx)(g,{})},"InfoTip")]});case"pending":return Object(u.jsx)(b,{info:["performance measuring..."]});case"error":return Object(u.jsx)(b,{info:["error",Object(u.jsx)(m,{popupInfo:e.error.message},"InfoTip")]})}return Object(u.jsx)(b,{})},S=new Map;function w(e){var t,n=(null!==(t=S.get(e))&&void 0!==t?t:-1)+1;return S.set(e,n),"".concat(e,"-").concat(n)}var C=5e3;function E(e,t,n,r){return void 0===e||clearTimeout(e),r.scheduleNext?setTimeout((function(){t.disconnect(),n.useEffectRegistered&&r.finish()}),C):t.disconnect()}function T(e,t,n,r){var c=null!==r&&void 0!==r?r:{startTime:t,duration:0},i=c.startTime,a=c.duration,o=t-i,u=-o>=C;return{TTI:u?0:Math.max(0,n-t),TBT:u?0:e+Math.max(0,o<50?a-50:a-o)}}var I=PerformanceObserver.supportedEntryTypes,R=I&&I.includes("mark")&&I.includes("longtask");function k(e){return R}var P=function(e){var t=e.children,n=e.settings,c=e.updateStartMeasureCallback,i=n.measureFromCreating,a=n.name,u=Object(r.useState)((function(){return w(null!==a&&void 0!==a?a:"start-use-perf-metrics")})),l=Object(o.a)(u,1)[0],s=Object(r.useState)((function(){return R?{data:null,status:"never"}:{data:null,status:"error",error:Error("(usePerfObserver) The browser does not support the library")}})),j=Object(o.a)(s,2),b=j[0],d=j[1],f=Object(r.useRef)(!0),O=Object(r.useState)((function(){return R?function(e,t,n){var r,c,i,a=!0,u=0,l=0,s={useEffectRegistered:!1};function j(){t({data:T(u,c.startTime,l,i),status:"done"})}var b=new PerformanceObserver((function(n,b){var d=s.useEffectRegistered;if(r=E(r,b,s,{scheduleNext:!0,finish:j}),a||d){if(a=!1,!c){var f=n.getEntriesByName(e);if(!(f.length>0))return t({status:"error",data:null,error:Error("(usePerfObserver) No long task has been registered")}),void(r=E(r,b,s,{scheduleNext:!1}));var O=Object(o.a)(f,1);c=O[0],b.observe({entryTypes:["longtask"]})}var h=n.getEntriesByType("longtask");h.length>0&&h.every((function(e){var t=e.startTime,n=e.duration;if(i){if(t-l>=C)return r=E(r,b,s,{scheduleNext:!1}),j(),!1;u+=n-50}else i=e;return l=t+n,!0}))}else E(r,b,s,{scheduleNext:!1})}));return n((function(){u=0,l=0,c=void 0,i=void 0,t({status:"pending",data:null}),b.observe({entryTypes:["mark","longtask"]}),performance.mark(e)})),[b,function(){return s.useEffectRegistered=!0,function(){b.disconnect(),r=E(r,b,s,{scheduleNext:!1})}}]}(l,d,c):null})),h=Object(o.a)(O,1)[0];k()&&f.current&&i&&(Object(o.a)(h,1)[0].observe({entryTypes:["mark","longtask"]}),performance.mark(l));return Object(r.useEffect)((function(){if(k()){var e=Object(o.a)(h,2)[1];return f.current=!1,i&&d({status:"pending",data:null}),e()}}),[]),Object(r.useMemo)((function(){return Object(r.cloneElement)(t,b)}),[b])},A={measureFromCreating:!1};function z(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object(a.a)(Object(a.a)({},A),e),n=Object(r.useRef)((function(){})),c=Object(r.useState)([function(e){var r=e.children;return Object(u.jsx)(P,{settings:t,updateStartMeasureCallback:function(e){n.current=e},children:r})},function(){return n.current()}]),i=Object(o.a)(c,1),l=i[0];return l}var M=function(e){var t=e.label,n=e.onChange,r=e.value,c=void 0===r?"":r,i=e.width,o=void 0===i?65:i,l=e.addStyle,s=void 0===l?{}:l,j={width:o};return Object(u.jsx)("form",{style:Object(a.a)({display:"block"},s),children:Object(u.jsxs)("label",{children:[t,Object(u.jsx)("input",{type:"text",onChange:n,value:c,style:j})]})})},_={width:5,height:5,marginRight:5,borderRadius:"100%",backgroundColor:"#999",animationName:"jump-dot",animationDuration:"0.5s",animationIterationCount:"infinite"},B=function(e){var t=e.toShow;return Object(u.jsx)("div",{style:{display:"flex",width:30},children:t?Object(u.jsxs)(u.Fragment,{children:[Object(u.jsx)("div",{style:Object(a.a)(Object(a.a)({},_),{},{animationDelay:"0s"})}),Object(u.jsx)("div",{style:Object(a.a)(Object(a.a)({},_),{},{animationDelay:"0.1s"})}),Object(u.jsx)("div",{style:Object(a.a)(Object(a.a)({},_),{},{animationDelay:"0.2s"})})]}):null})},N=function(e){var t=e.label,n=e.inputCallback,c=e.value,i=void 0===c?"":c,l=e.width,s=void 0===l?65:l,j=e.addStyle,b=void 0===j?{}:j,d=Object(r.useRef)({}),f=Object(r.useState)(i),O=Object(o.a)(f,2),h=O[0],v=O[1],p=Object(r.useState)(!1),x=Object(o.a)(p,2),m=x[0],g=x[1];return Object(u.jsxs)("div",{style:Object(a.a)({display:"flex",alignItems:"center"},b),children:[Object(u.jsx)(M,{label:t,onChange:function(e){var t=e.target.value,r=d.current,c=d.current.activeTimeoutId;v(t),g(!0),c&&clearTimeout(c),r.activeTimeoutId=setTimeout((function(){g(!1),r.activeTimeoutId=void 0,n(t)}),3e3)},value:h,width:s,addStyle:{marginRight:10}}),Object(u.jsx)(B,{toShow:m})]})},H=function(e){var t,n=null!==(t=e.gridSize)&&void 0!==t?t:e.useGridSize(),r=z({measureFromCreating:!0}),c=Object(o.a)(r,2),i=c[0],a=c[1];return Object(u.jsxs)("div",{children:[Object(u.jsx)(N,{label:"input grid size: ",inputCallback:function(t){a();var r=parseInt(t,10);e.onGridChosen({gridSize:r>0?r:n})},value:"".concat(n),addStyle:{marginBottom:"2px"}}),Object(u.jsx)(i,{children:Object(u.jsx)(y,{data:null})})]})},L={width:200,height:20,display:"block",marginRight:5},W=function(e){var t=e.callback,n=e.addStyle,r=void 0===n?{}:n,c=e.name,i=void 0===c?"start":c,o=Object(a.a)(Object(a.a)({},L),r);return Object(u.jsx)("button",{style:o,type:"button",onClick:t,children:i})},G={display:"flex",margin:"5px 5px 5px 0"},D={margin:"-5px 0 0 5px",height:20},F=function(e){var t,n;if(e.paintRandomPixels){var c=[e.paintRandomPixels,[]];t=c[0],n=c[1]}else{var i=e.usePaintRandomPixels(),a=Array.isArray(i)?i:[i,[]],l=Object(o.a)(a,2);t=l[0],n=l[1]}var s=Object(r.useState)("".concat(30)),j=Object(o.a)(s,2),b=j[0],d=j[1],f=z(),O=Object(o.a)(f,2),h=O[0],v=O[1];return Object(u.jsxs)(u.Fragment,{children:[Object(u.jsxs)("div",{children:[Object(u.jsxs)("div",{style:G,children:[Object(u.jsx)(W,{callback:function(){v();var e=parseInt(b,10);e>=0&&e<=100?t(e):d("0")},name:"paint n% random pixels"}),Object(u.jsx)(M,{label:"n: ",value:b,onChange:function(e){var t=e.target.value;d(t)}})]}),Object(u.jsx)("div",{style:D,children:Object(u.jsx)(h,{children:Object(u.jsx)(y,{data:null})})})]}),n]})},X=function(e){var t,n=null!==(t=e.onPushButton)&&void 0!==t?t:e.useOnPushButton(),r=z(),c=Object(o.a)(r,2),i=c[0],a=c[1];return Object(u.jsxs)("div",{style:G,children:[Object(u.jsx)(W,{callback:function(){a(),n()},name:e.name}),Object(u.jsx)(i,{children:Object(u.jsx)(y,{data:null})})]})},U=function(e){return Object(u.jsxs)("div",{style:{margin:"10px 0 auto 5px"},children:[Object(u.jsx)("div",{style:{margin:"0 0 10px"},children:Object(u.jsx)("strong",{children:e.headline})}),Object(u.jsx)(X,Object(a.a)({},Object(a.a)({name:"re-paint"},e.repaintRow?{onPushButton:e.repaintRow}:{useOnPushButton:e.useRepaintRow}))),["enable/disable even rows","enable/disable odd rows"].map((function(t,n){return e.switchRows?Object(r.createElement)(X,{name:t,onPushButton:e.switchRows[n],key:t}):Object(r.createElement)(X,{name:t,useOnPushButton:e.switchRowsHooks[n],key:t})})),Object(u.jsx)(X,Object(a.a)({},Object(a.a)({name:"paint random pixel"},e.paintRandomSinglePixel?{onPushButton:e.paintRandomSinglePixel}:{useOnPushButton:e.usePaintRandomSinglePixel}))),Object(u.jsx)(F,Object(a.a)({},e.paintRandomPixels?{paintRandomPixels:e.paintRandomPixels}:{usePaintRandomPixels:e.usePaintRandomPixels})),Object(u.jsx)("div",{style:{borderTop:"0.5px solid gray",margin:"15px 0"}}),Object(u.jsx)(H,Object(a.a)({},Object(a.a)({onGridChosen:e.onGridChosen},void 0===e.gridSize?{useGridSize:e.useGridSize}:{gridSize:e.gridSize})))]})},V=n(4);function Y(e,t){if(e<t)throw Error("Number to draw must be less than total");for(var n=t<e/2?[!0,e-t]:[!1,t],r=Object(o.a)(n,2),c=r[0],i=r[1],a=Array(e).fill(null).map((function(e,t){return t})),u=[];a.length>i;){var l=Math.floor(Math.random()*a.length);c&&u.push(a[l]),l<a.length-1?a[l]=a.pop():a.pop()}return c?u:a}var J=16777215;function K(e){var t=Math.round(parseInt(e.slice(1),16)+J*(Math.random()/4+.5));return"#".concat((t=t>J?t-J:t).toString(16).padStart(6,"0"))}var q=[],Q=function(e){q.push(e)},Z=function(e){return q[e]},$=function(){q=[]};function ee(e){var t=Math.floor(Math.random()*e),n=Z(t);if(!n)throw Error("It should be defined");return n}var te=function(e,t){return Object(V.b)({key:w(e),default:t})},ne="choice-for-pixel",re="color-for-alternative",ce="grid-size",ie="#AAAAAA",ae=function(e){return te("".concat(re,"-").concat(e),K(ie))},oe=Object(V.b)({key:ne,default:0}),ue=Object(V.b)({key:re,default:ie}),le=Object(V.b)({key:ce,default:32}),se=function(){return le},je=Object(V.b)({key:"remember-active-choice",default:0}),be=[0,1].map((function(e){return"".concat("alternative-for-choice","-").concat(e)})),de=function(){return be.map((function(e,t){return Object(V.b)({key:e,default:{atom:ae(t)}})}))},fe=de(),Oe=function(){return fe},he=function(){return w("refresh-key")},ve=function(){var e=Oe().map(pe),t=Object(V.c)(je),n=Object(o.a)(t,2),r=n[0],c=n[1],i=e.map(xe);return function(){var t=i[r][0],n=1-r;null!==e[n]&&c(n),null!==e[r]&&i[r][1](K(t))}};function pe(e){return Object(V.d)(e)}function xe(e){var t;return Object(V.c)(null!==(t=null===e||void 0===e?void 0:e.atom)&&void 0!==t?t:ue)}var me,ge=[0,1].map((function(e){return function(){var t=Object(V.e)(je),n=Oe().map((function(e){return Object(V.c)(e)}));return function(){n[e][0]?(n[e][1](null),t(1-e)):(n[e][1]({atom:ae(e)}),t(e))}}})),ye=function(){var e=se(),t=Object(V.d)(e),n=Object(r.useState)({atom:oe}),c=Object(o.a)(n,2),i=c[0],a=c[1],u=Object(V.e)(i.atom);return Object(r.useEffect)((function(){u((function(e){return 1-e}))}),[i]),function(){a({atom:ee(Math.pow(t,2))})}},Se=function(e){var t=e.pixelChoiceAtom,n=Object(V.e)(t);return Object(r.useEffect)((function(){n((function(e){return 1-e}))}),[n]),Object(u.jsx)(u.Fragment,{})},we=function(){var e=se(),t=Object(V.d)(e),n=Object(r.useState)([]),c=Object(o.a)(n,2),i=c[0],a=c[1];return Object(r.useEffect)((function(){return a((function(e){return e.length>0?[]:e}))}),[i]),[function(e){var n=Math.pow(t,2);a(Y(n,n*e/100).map((function(e){var t;return Object(u.jsx)(Se,{pixelChoiceAtom:null!==(t=Z(e))&&void 0!==t?t:function(){throw Error("It must be defined")}()})})))},i]},Ce=function(){var e=se();return Object(V.d)(e)},Ee={height:"100%",width:"100%"},Te=function(e){var t=e.altControlAtom,n=Object(V.d)(t),r=Object(a.a)(Object(a.a)({},Ee),{},{backgroundColor:n});return Object(u.jsx)("div",{style:r})},Ie=function(e){var t=e.pixelSize,n=e.defChoice,c={height:t,width:t},i=Object(r.useState)(oe),a=Object(o.a)(i,2),l=a[0],s=a[1],j=Object(V.d)(l),b=Oe(),d=Object(V.d)(b[j]);return Object(r.useEffect)((function(){var e=te(ne,n);Q(e),s(e)}),[]),Object(u.jsx)("div",{style:c,children:d&&l!==oe&&Object(u.jsx)(Te,{altControlAtom:d.atom})})},Re={display:"flex"},ke=function(e){var t=e.children,n=e.length,c=e.pixelSize,i=e.defChoice,a=Object(r.useState)(null),l=Object(o.a)(a,2),s=l[0],j=l[1];return Object(r.useEffect)((function(){var e=Array(n).fill(null).map((function(){return Object(r.createElement)(Ie,{pixelSize:c,defChoice:i,key:w("c-key")})}));j(e)}),[i,n,c]),Object(u.jsxs)("div",{children:[Object(u.jsx)("div",{style:Re,children:s}),t]})},Pe=function(){var e=se(),t=Object(V.d)(e),n=Object(r.useState)(null),c=Object(o.a)(n,2),i=c[0],a=c[1];return Object(u.jsx)("div",{style:{flexGrow:1},ref:function(e){if(e&&!i){for(var n=e.getBoundingClientRect().height,r="".concat(n/t,"px"),c=null,o=0;o<t;o++)c=Object(u.jsx)(ke,{length:t,pixelSize:r,defChoice:(t+o+1)%2,children:c});$(),a(c)}},children:i})},Ae=function(){var e=function(){var e=Object(r.useState)(he),t=Object(o.a)(e,2),n=t[0],c=t[1];return[n,function(e){var t=e.gridSize;fe=de(),le=Object(V.b)({key:ce,default:t}),c(he)}]}(),t=Object(o.a)(e,2),n=t[0],c=t[1];return Object(u.jsx)(V.a,{children:Object(u.jsxs)("div",{style:{display:"flex",flexDirection:"column",margin:"10px auto 10px 10px"},key:n,children:[Object(u.jsx)(Pe,{}),Object(u.jsx)(U,{headline:'Implemented using "recoil" library',useRepaintRow:ve,switchRowsHooks:ge,usePaintRandomSinglePixel:ye,usePaintRandomPixels:we,useGridSize:Ce,onGridChosen:c})]})})},ze=n(6),Me=[],_e=function(e){Me.push(e)},Be=function(e){return Me[e]},Ne=function(){Me=[]};!function(e){e.CREATE_NEW_PIXEL_ENTRY="pixels/createNewPixelEntry",e.SWITCH_PIXEL_CHOICE="pixels/switchPixelChoice",e.SWITCH_MULTIPLE_PIXELS="pixels/switchMultiplePixels",e.SWITCH_ALTERNATIVES="alternatives/switchAlternatives",e.REPAINT_ROW="alternatives/repaintRow"}(me||(me={}));var He=function(e,t){return e[t]},Le=function(e,t){return e[t]},We=function(e,t){return e[t]},Ge=function(e){return e.gridSize};var De,Fe=function(){var e=Object(ze.b)();return function(){e({type:me.REPAINT_ROW})}},Xe=[0,1].map((function(e){return function(){var t=Object(ze.b)();return function(){var n;t((n=e,{type:me.SWITCH_ALTERNATIVES,payload:{choice:n}}))}}})),Ue=function(){var e=Object(ze.b)(),t=Object(ze.c)(Ge);return function(){var n;e((n=function(e){var t=Math.floor(Math.random()*e),n=Be(t);if(!n)throw Error("It should be defined");return n}(Math.pow(t,2)),{type:me.SWITCH_PIXEL_CHOICE,payload:{pixel:n}}))}},Ve=function(){var e=Object(ze.b)(),t=Object(ze.c)(Ge);return function(n){var r,c=Math.pow(t,2);e((r=Y(c,c*n/100).map((function(e){var t;return null!==(t=Be(e))&&void 0!==t?t:function(){throw Error("It must be defined")}()})),{type:me.SWITCH_MULTIPLE_PIXELS,payload:{pixels:r}}))}},Ye=function(){return Object(ze.c)(Ge)},Je=n(5),Ke="choice-for-pixel",qe=[0,1].map((function(e){return"".concat("alternative-for-choice","-").concat(e)})),Qe=function(e){var t,n=w("".concat("color-for-alternative","-").concat(e)),r=K("#AAAAAA");return t={},Object(Je.a)(t,qe[e],n),Object(Je.a)(t,n,r),t},Ze={rememberActiveChoice:0},$e={height:"100%",width:"100%"},et=function(e){var t=e.altControl,n=Object(ze.c)((function(e){return Le(e,t)})),r=Object(a.a)(Object(a.a)({},$e),{},{backgroundColor:n});return Object(u.jsx)("div",{style:r})},tt=function(e){var t=e.pixelSize,n=e.defChoice,c={height:t,width:t},i=Object(r.useState)(Ke),a=Object(o.a)(i,2),l=a[0],s=a[1],j=Object(ze.c)((function(e){return He(e,l)})),b=Object(ze.c)((function(e){return We(e,qe[j])})),d=Object(ze.b)();return Object(r.useEffect)((function(){var e=w(Ke);_e(e),d(function(e,t){return{type:me.CREATE_NEW_PIXEL_ENTRY,payload:{pixel:e,choice:t}}}(e,n)),s(e)}),[]),Object(u.jsx)("div",{style:c,children:b&&l[0]!==Ke&&Object(u.jsx)(et,{altControl:b})})},nt={display:"flex"},rt=function(e){var t=e.children,n=e.length,c=e.pixelSize,i=e.defChoice,a=Object(r.useState)(null),l=Object(o.a)(a,2),s=l[0],j=l[1];return Object(r.useEffect)((function(){var e=Array(n).fill(null).map((function(){return Object(r.createElement)(tt,{pixelSize:c,defChoice:i,key:w("c-key")})}));j(e)}),[i,n,c]),Object(u.jsxs)("div",{children:[Object(u.jsx)("div",{style:nt,children:s}),t]})},ct=function(){var e=Object(ze.c)(Ge),t=Object(r.useState)(null),n=Object(o.a)(t,2),c=n[0],i=n[1];return Object(u.jsx)("div",{style:{flexGrow:1},ref:function(t){if(t&&!c){for(var n=t.getBoundingClientRect().height,r="".concat(n/e,"px"),a=null,o=0;o<e;o++)a=Object(u.jsx)(rt,{length:e,pixelSize:r,defChoice:(e+o+1)%2,children:a});Ne(),i(a)}},children:c})},it=n(11),at=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:De,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case me.CREATE_NEW_PIXEL_ENTRY:var n=t.payload,r=n.choice,c=n.pixel;return Object(a.a)(Object(a.a)({},e),{},Object(Je.a)({},c,r));case me.SWITCH_PIXEL_CHOICE:var i=t.payload.pixel;return Object(a.a)(Object(a.a)({},e),v({},i));case me.SWITCH_MULTIPLE_PIXELS:var o=t.payload.pixels,u=o.reduce(v,{});return Object(a.a)(Object(a.a)({},e),u);case me.SWITCH_ALTERNATIVES:var l,s=t.payload.choice,j=qe[s],b=e[j];if(b)return Object(a.a)(Object(a.a)({},e),{},(l={},Object(Je.a)(l,j,null),Object(Je.a)(l,"rememberActiveChoice",1-s),l));var d=Qe(s);return Object(a.a)(Object(a.a)(Object(a.a)({},e),d),{},{rememberActiveChoice:s});case me.REPAINT_ROW:var f=e.rememberActiveChoice,O=e[qe[f]],h=1-f;return Object(a.a)(Object(a.a)(Object(a.a)({},e),null===e[qe[h]]?{}:{rememberActiveChoice:h}),null===O?{}:Object(Je.a)({},O,K(e[O])));default:return e}function v(t,n){var r=e[n];return Object(a.a)(Object(a.a)({},t),{},Object(Je.a)({},n,1-r))}},ot=function(e){De=Object(a.a)(Object(a.a)(Object(a.a)({},Ze),[0,1].reduce((function(e,t){return Object(a.a)(Object(a.a)({},e),Qe(t))}),{})),{},{gridSize:e})};function ut(){return w("refresh-key")}var lt=function(){var e=function(){var e=Object(r.useState)((function(){return ot(32),Object(it.b)(at)})),t=Object(o.a)(e,2),n=t[0],c=t[1],i=Object(r.useState)(ut),a=Object(o.a)(i,2),u=a[0],l=a[1];return[n,u,function(e){var t=e.gridSize;ot(t),c(Object(it.b)(at)),l(ut)}]}(),t=Object(o.a)(e,3),n=t[0],c=t[1],i=t[2];return Object(u.jsx)(ze.a,{store:n,key:c,children:Object(u.jsxs)("div",{style:{display:"flex",flexDirection:"column",margin:"10px auto 10px 10px"},children:[Object(u.jsx)(ct,{}),Object(u.jsx)(U,{headline:'Implemented using "react-redux" library',useRepaintRow:Fe,switchRowsHooks:Xe,usePaintRandomSinglePixel:Ue,usePaintRandomPixels:Ve,useGridSize:Ye,onGridChosen:i})]})})},st=[],jt=function(e){st.push(e)},bt=function(e){return st[e]},dt=function(){st=[]};var ft,Ot=n(21),ht="choice-for-pixel",vt="grid-size",pt="remember-active-choice",xt=[0,1].map((function(e){return"".concat("alternative-for-choice","-").concat(e)})),mt=Object(Ot.a)(),gt=mt.initInterstate,yt=mt.useInterstate,St=mt.readInterstate,wt=mt.setInterstate,Ct=function(e){var t,n=[w("".concat("color-for-alternative","-").concat(e)),K("#AAAAAA")],r=n[0],c=n[1];return t={},Object(Je.a)(t,xt[e],r),Object(Je.a)(t,r,c),t},Et=(ft={},Object(Je.a)(ft,ht,0),Object(Je.a)(ft,vt,32),Object(Je.a)(ft,pt,0),ft);gt(Object(a.a)(Object(a.a)({},Et),It()));var Tt=function(){return w("refresh-key")};function It(){return[0,1].reduce((function(e,t){return Object(a.a)(Object(a.a)({},e),Ct(t))}),{})}var Rt=function(){wt((function(e){var t=e["remember-active-choice"],n=e[xt[t]],r=1-t;return Object(a.a)(Object(a.a)({},null===e[xt[r]]?{}:Object(Je.a)({},pt,r)),null===n?{}:Object(Je.a)({},n,K(e[n])))}))},kt=[0,1].map((function(e){return function(){wt((function(t){var n,r=xt[e];if(t[r])return n={},Object(Je.a)(n,r,null),Object(Je.a)(n,pt,1-e),n;var c=Ct(e);return Object(a.a)(Object(a.a)({},c),{},Object(Je.a)({},pt,e))}))}})),Pt=function(){wt(function(e){var t=Math.floor(Math.random()*e),n=bt(t);if(!n)throw Error("It should be defined");return n}(Math.pow(St(vt),2)),(function(e){return 1-e}))},At=function(e){var t=Math.pow(St(vt),2);Y(t,t*e/100).map((function(e){var t;wt(null!==(t=bt(e))&&void 0!==t?t:function(){throw Error("It must be defined")}(),(function(e){return 1-e}))}))},zt={height:"100%",width:"100%"},Mt=function(e){var t=e.altControlKey,n=yt(t),r=Object(a.a)(Object(a.a)({},zt),{},{backgroundColor:n});return Object(u.jsx)("div",{style:r})},_t=function(e){var t=e.pixelSize,n=e.defChoice,c={height:t,width:t},i=Object(r.useState)(ht),a=Object(o.a)(i,2),l=a[0],s=a[1],j=yt(l),b=yt(xt[j]);return Object(r.useEffect)((function(){var e=w(ht);jt(e),wt(e,n),s(e)}),[]),Object(u.jsx)("div",{style:c,children:b&&l!==ht&&Object(u.jsx)(Mt,{altControlKey:b})})},Bt={display:"flex"},Nt=function(e){var t=e.children,n=e.length,c=e.pixelSize,i=e.defChoice,a=Object(r.useState)(null),l=Object(o.a)(a,2),s=l[0],j=l[1];return Object(r.useEffect)((function(){var e=Array(n).fill(null).map((function(){return Object(r.createElement)(_t,{pixelSize:c,defChoice:i,key:w("c-key")})}));j(e)}),[i,n,c]),Object(u.jsxs)("div",{children:[Object(u.jsx)("div",{style:Bt,children:s}),t]})},Ht=function(){var e=Object(r.useState)(null),t=Object(o.a)(e,2),n=t[0],c=t[1];return Object(u.jsx)("div",{style:{flexGrow:1},ref:function(e){if(e&&!n){for(var t=St(vt),r=e.getBoundingClientRect().height,i="".concat(r/t,"px"),a=null,o=0;o<t;o++)a=Object(u.jsx)(Nt,{length:t,pixelSize:i,defChoice:(t+o+1)%2,children:a});dt(),c(a)}},children:n})},Lt=function(){var e=function(){var e=Object(r.useState)(Tt),t=Object(o.a)(e,2),n=t[0],c=t[1];return[n,function(e){var t=e.gridSize;gt(Object(a.a)(Object(a.a)(Object(a.a)({},Et),It()),{},Object(Je.a)({},vt,t))),c(Tt)}]}(),t=Object(o.a)(e,2),n=t[0],c=t[1];return Object(u.jsxs)("div",{style:{display:"flex",flexDirection:"column",margin:"10px auto 10px 10px"},key:n,children:[Object(u.jsx)(Ht,{}),Object(u.jsx)(U,{headline:'Implemented using "use-interstate" library',repaintRow:Rt,switchRows:kt,paintRandomSinglePixel:Pt,paintRandomPixels:At,gridSize:St(vt),onGridChosen:c})]})},Wt={display:"flex"},Gt=function(){return Object(u.jsx)(h,{children:Object(u.jsxs)("div",{style:{display:"flex",flexDirection:"column",height:"calc(100vh - 20px)"},children:[Object(u.jsx)("div",{style:{margin:"5px 0 0 10px",fontWeight:"bold"},children:"v.1.5.0"}),Object(u.jsxs)("div",{style:{display:"flex",flexGrow:1},children:[Object(u.jsx)("div",{style:Wt,children:Object(u.jsx)(Ae,{})}),Object(u.jsx)("div",{style:Wt,children:Object(u.jsx)(Lt,{})}),Object(u.jsx)("div",{style:Wt,children:Object(u.jsx)(lt,{})})]})]})})};n(36);i.a.render(Object(u.jsx)(Gt,{}),document.getElementById("root"))}},[[37,1,2]]]);
//# sourceMappingURL=main.63117fae.chunk.js.map