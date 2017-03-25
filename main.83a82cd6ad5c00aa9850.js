webpackJsonp([1,2],{6:function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var i=n(70),a=_interopRequireDefault(i),r=n(69),o=_interopRequireDefault(r),l=n(16),c=_interopRequireDefault(l),u=n(40),f=_interopRequireDefault(u),s=n(73),d=_interopRequireDefault(s),v=n(72),p=_interopRequireDefault(v),m=(0,a.default)({container:"#main-canvas",attributes:{alpha:!0}}),g=(0,o.default)({regl:m}),h=(Date.now(),c.default.create()),y=c.default.create(),_=c.default.create(),x=m({frag:p.default,vert:d.default,attributes:{position:[[-1,-1],[-1,4],[4,-1]]},count:3,uniforms:{time:function(e){return e.time%1},invProjection:function(e){var t=e.projection;return c.default.invert(h,t)},invView:function(e){var t=e.view;return c.default.invert(y,t)},invModel:function(){return c.default.invert(_,w)}}}),w=c.default.create(),D=c.default.create(),b=c.default.lookAt(c.default.create(),[0,0,0],[0,0,-1],[0,1,0]),P=m({context:{projection:function(e){var t=e.viewportWidth,n=e.viewportHeight;return c.default.perspective(D,Math.PI/4,t/n,.01,1e4)},view:b}}),R=m.frame(function(){return P(x)}),q=R.cancel;navigator.getVRDisplays&&navigator.getVRDisplays().then(function(e){if(0!==e.length){var t=e[0];console.log("VR display detected: "+t.displayName);var n=document.getElementById("vr-button");n.style.display="block";var i=void 0;i=function(e){n.removeEventListener("click",i),delete n.style.display,e.preventDefault(),q();var a=t.getEyeParameters("left"),r=t.getEyeParameters("right"),o={width:2*Math.max(a.renderWidth,r.renderWidth),height:Math.max(a.renderHeight,r.renderHeight)};t.requestPresent([{source:m._gl.canvas}]).then(function(){var e=void 0,n=new VRFrameData,i=new Float32Array(3),a=f.default.create(),r=m({context:{time:m.prop("time")}}),l={vrDisplay:t},u=function(){return g(l,x)},s=0,d={depth:1},v={time:0};e=function(l){t.requestAnimationFrame(e),Object.assign(m._gl.canvas,o);var p=l-s;s=l,t.getFrameData(n);var g=n.pose;if(g){var h=Math.min(25e-5*p,1),y=g.position;if(y)for(var _=0;_<3;_++)i[_]+=(y[_]-i[_])*h;var x=g.orientation;x&&f.default.slerp(a,a,x,h),c.default.fromRotationTranslation(w,a,i)}m.clear(d),v.time=l/1e3,r(v,u),m._refresh()},t.requestAnimationFrame(e)})},n.addEventListener("click",i,!1)}})},72:function(e,t){e.exports="precision mediump float;\n#define GLSLIFY 1\n\nconst float c_TubeWidth = 3.0;\nconst float c_Pi = 3.14159265358979;\nconst float c_MaxDepth = 10000.0;\n\nuniform float time;\n\nvarying vec3 worldPos;\n\nvoid main() {\n  vec3 ray = normalize(worldPos);\n  float a = dot(ray.xy, ray.xy);\n  float b = 2.0 * dot(ray.xy, vec2(0.0, 0.0));\n  float c = -c_TubeWidth * c_TubeWidth;\n  float test = b * b - 4.0 * a * c;\n  if (test < 0.0) {\n    gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);\n  } else {\n    vec2 intersection = ray.xy * (-b - sqrt(test)) / (2.0 * a);\n    float angle = atan(intersection.y, intersection.x);\n    float depth = min(ray.z * length(intersection) / length(ray.xy), c_MaxDepth);\n    float color = step(0.5, mod(depth * 0.1 + angle / c_Pi - time, 1.0)) * 2.0 / max(1.0, pow(abs(depth), 0.75));\n    gl_FragColor = vec4(vec3(color), 1.0);\n  }\n}\n"},73:function(e,t){e.exports="precision mediump float;\n#define GLSLIFY 1\n\nuniform mat4 invProjection, invView, invModel;\n\nattribute vec2 position;\n\nvarying vec3 worldPos;\n\nvoid main() {\n  gl_Position = vec4(position, -1.0, 1.0);\n  worldPos = (invModel * (invView * vec4((invProjection * vec4(position, -1.0, 1.0)).xy, -1, 0.0))).xyz;\n}\n"},74:function(e,t,n){n(5),e.exports=n(6)}},[74]);