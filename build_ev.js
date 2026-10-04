// build_ev.js  — run with: node build_ev.js
const fs = require('fs');
const OUT = __dirname + '/ethan_vale.html';

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
const FILM = CDN + 'hf_20260922_195107_ed3f055a-3a13-4a71-b743-e10310454246.mp4';
const AV_ID = 'hf_20260922_194417_a455843c-d8db-461c-8ef6-74a325d2472c';

const SHOTS = [
  {id:'hf_20260922_194349_26ffdbfd-ac5e-49e9-a07d-c06d3f7cb4cb',title:'Before the Dust Settled',place:'South Africa \u00b7 Limpopo Province',note:'Wildlife photography is rarely about pressing the shutter. Most of the work happens earlier \u2014 waiting, staying still, and accepting that nature decides if the frame exists. This encounter lasted less than a minute.'},
  {id:'hf_20260922_194350_5546ea3d-6336-42c7-a59f-06165c5802be',title:'The Long Walk Home',place:'Kenya \u00b7 Maasai Mara',note:'A matriarch leading her herd across open grass at the end of the day. I stayed low and let them close the distance on their own terms.'},
  {id:'hf_20260922_194349_b4533691-cb49-41d4-b56c-51f0fdcbe250',title:'Something Understood',place:'Botswana \u00b7 Okavango Delta',note:'He held the look for about four seconds. Long enough to be certain neither of us intended to move first.'},
  {id:'hf_20260922_194349_e588abd3-1bfa-4918-894f-05632cc51ccc',title:'Nine Hours of Nothing',place:'Finland \u00b7 Lapland',note:'A full day in a hide for a single turn of the head. That ratio is normal and I have stopped resenting it.'},
  {id:'hf_20260922_194350_28d92c80-de66-41cb-911e-b3b44aebe1f5',title:'Borrowed Trust',place:'Scotland \u00b7 Cairngorms',note:'She had learned the shape of a person and decided it was uninteresting. That indifference is the rarest thing in this work.'},
  {id:'hf_20260922_194349_04e89718-4214-4aff-bac5-490462bbfe2f',title:'Small Weather',place:'Costa Rica \u00b7 Osa Peninsula',note:'Rain had just stopped. Everything on that branch was the size of a thumbnail and lit like a stage.'},
  {id:'hf_20260922_194417_2c031e22-2fad-4c81-a544-83cd6bba1c33',title:'Against the Weather',place:'Alaska \u00b7 Chilkat Valley',note:'Shot at a thousandth of a second into a rising storm. The light lasted eleven minutes.'},
  {id:'hf_20260922_194349_a39c3226-7848-4b15-b840-98ad8aec467b',title:'The Pale Edge',place:'India \u00b7 Bandhavgarh',note:'Almost entirely hidden. I only found the frame because the foliage stopped moving in the wrong place.'},
  {id:'hf_20260922_194417_555e4d90-f35f-4a1a-8c75-def1e8b71988',title:'Perfect Arithmetic',place:'Indonesia \u00b7 Raja Ampat',note:'Coiled with a precision that looks designed. Nothing about it is \u2014 it is just the cheapest way to hold heat.'},
  {id:'hf_20260922_194417_e525a243-03c8-454b-83b4-60f541baf70a',title:'Shallow Water',place:'French Polynesia \u00b7 Fakarava',note:'Three metres down on a single breath. It passed close enough that I stopped composing and simply held the camera still.'},
  {id:'hf_20260922_194349_ec830e6f-b8e6-4569-8540-ee7f33902c53',title:'Two of Nine',place:'India \u00b7 Ranthambore',note:'Siblings resting out the afternoon heat. The second one never opened its eyes.'},
  {id:'hf_20260922_194417_35a9af5f-bd07-45a7-bb73-08b47d19d530',title:'Low Ground',place:'Nepal \u00b7 Chitwan',note:'Flat on the ground at her eye level, which is the only honest angle for an animal that hunts from there.'},
  {id:'hf_20260922_194416_30e307a9-1265-45c3-a1a0-5c6fa5bb9f8d',title:'Everything at Once',place:'Iceland \u00b7 Southern Coast',note:'Free horses on a black beach at dusk. I panned and accepted whatever the frame gave back.'},
  {id:'hf_20260922_194417_ff5cb9f8-8eed-4bfb-bb08-11256da92eae',title:'White on White',place:'Canada \u00b7 Ellesmere Island',note:'Snow removes every reference for exposure. The only reliable meter left is the eyes.'},
  {id:'hf_20260922_194418_1d9bff4a-4971-4944-9e49-d72e755ceeb0',title:'Census',place:'Namibia \u00b7 Etosha',note:'Two of roughly sixteen thousand left. The number is the reason the frame exists.'},
  {id:'hf_20260922_194349_75e53821-0807-4ebc-992d-34bae0ec2ce6',title:'The Whole Field',place:'France \u00b7 Provence',note:'Four millimetres of animal. At this magnification a breath of wind is an earthquake.'},
  {id:'hf_20260922_194417_5a227847-3796-4438-805d-7e66e9538205',title:'First Season',place:'Germany \u00b7 Bavarian Forest',note:'Days old and already still enough to disappear. Stillness is the first thing anything here learns.'},
  {id:'hf_20260922_194350_b49aa67e-0401-4029-af4f-f6ac3ee83398',title:'Listening Posture',place:'Tanzania \u00b7 Serengeti',note:'Ears forward, weight on the back legs. She heard something I never did.'},
  {id:'hf_20260922_194349_89b82779-3a46-4c55-b7c5-f4a0fd955874',title:'A Line of Red',place:'Spain \u00b7 Fuente de Piedra',note:'Underexposed by two stops until only the shape survived.'},
  {id:'hf_20260922_194416_47e18c62-253a-42e1-97a9-9e5f6a6b8d59',title:'Left Behind',place:'Studio \u00b7 Reykjav\u00edk',note:'Found beneath a roost at first light. The only frame in this archive an animal agreed to in advance.',tall:true},
  {id:'hf_20260922_194417_a455843c-d8db-461c-8ef6-74a325d2472c',title:'The Other Side',place:'Uganda \u00b7 Kibale Forest',note:'Taken by a colleague between two long waits. Proof, mostly, that someone is holding the camera.'}
];

const shotsJS = JSON.stringify(SHOTS);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Ethan Vale \u2014 I See Through the Wild</title>
<meta name="description" content="Wildlife photography archive by Ethan Vale. Field notes from natural encounters, captured without intervention.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{
  --serif:"Playfair Display","Times New Roman",serif;
  --sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
  --bg:#000;--ink:#f4f2ef;--dim:#8c8783;
  --line:rgba(244,242,239,.28);
  --pad:clamp(14px,2.6vw,34px);
  --ease:cubic-bezier(.22,.61,.36,1);
  --hw:min(56vw,640px);
  --persp:1150px;
  --safe-top:env(safe-area-inset-top,0px);
  --safe-right:env(safe-area-inset-right,0px);
  --safe-bottom:env(safe-area-inset-bottom,0px);
  --safe-left:env(safe-area-inset-left,0px);
  --tap:44px;
}
html{background:#000;scrollbar-gutter:stable;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--ink);overflow-x:hidden;min-height:100vh;min-height:100dvh;overscroll-behavior-y:none;font-family:var(--sans);font-weight:300;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
body.locked{overflow:hidden;height:100vh;height:100dvh;}
img{display:block;max-width:100%;}
button{font:inherit;color:inherit;background:none;border:none;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}
a{-webkit-tap-highlight-color:transparent;}
#scrolltrack{height:116vh;pointer-events:none;}
.vig{position:fixed;inset:0;z-index:12;pointer-events:none;background:radial-gradient(ellipse 88% 92% at 50% 50%,transparent 48%,rgba(0,0,0,.26) 80%,rgba(0,0,0,.72) 100%);transition:opacity .6s ease;}
body.gridview .vig,body.lit .vig{opacity:0;}
#splash{position:fixed;inset:0;z-index:250;background:#000;display:grid;place-items:center;align-content:center;gap:26px;transition:opacity .6s ease;}
#splash.out{opacity:0;pointer-events:none;}
.mark{font-family:var(--serif);font-size:clamp(28px,4.4vw,52px);letter-spacing:.005em;color:#f4f2ef;opacity:0;animation:riseIn 1.25s ease .15s forwards;}
.mark em{font-style:normal;}
.bar{width:clamp(120px,17vw,210px);height:1px;background:rgba(244,242,239,.16);overflow:hidden;}
#bar{display:block;width:100%;height:100%;background:#f4f2ef;transform:scaleX(0);transform-origin:left;transition:transform .55s ease;}
.tag{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:rgba(244,242,239,.38);opacity:0;animation:riseIn .9s ease .7s forwards;}
@keyframes riseIn{from{opacity:0;transform:translateY(9px);}to{opacity:1;transform:none;}}
#intro{position:fixed;inset:0;z-index:200;background:#000;display:grid;place-items:center;overflow:hidden;}
#intro.gone{opacity:0;pointer-events:none;transition:opacity .5s linear;}
video#film{width:100%;height:100%;object-fit:cover;}
.veil{position:absolute;inset:0;background:#000;opacity:0;transition:opacity 1.15s ease;pointer-events:none;}
#intro.closing .veil{opacity:1;}
.fallback{position:absolute;inset:0;background:radial-gradient(circle at 50% 46%,#14301a 0%,#060c07 42%,#000 72%);opacity:0;pointer-events:none;}
#intro.novideo .fallback{opacity:1;}
button#skip{position:absolute;right:calc(var(--pad) + var(--safe-right));bottom:calc(var(--pad) + var(--safe-bottom));font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(244,242,239,.6);min-height:44px;padding:10px 18px;border:1px solid rgba(244,242,239,.25);border-radius:999px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:color .25s ease,border-color .25s ease,opacity .3s ease;}
button#skip.vis{opacity:1;pointer-events:auto;}
#intro.closing button#skip{opacity:0;pointer-events:none;}
button#skip:hover{color:#fff;border-color:rgba(255,255,255,.7);}
header.chrome{position:fixed;top:0;left:0;right:0;z-index:60;display:flex;justify-content:space-between;align-items:flex-start;padding-top:calc(var(--pad)*.8 + var(--safe-top));padding-right:calc(var(--pad) + var(--safe-right));padding-bottom:calc(var(--pad)*.35);padding-left:calc(var(--pad) + var(--safe-left));mix-blend-mode:difference;opacity:0;transition:opacity 1.2s ease .15s;}
body.revealed header.chrome{opacity:1;}
body.menu-open header.chrome{z-index:90;mix-blend-mode:normal;}
a.wordmark{font-family:var(--serif);font-size:clamp(19px,2.1vw,27px);letter-spacing:.005em;line-height:1;color:#fff;text-decoration:none;white-space:nowrap;}
a.wordmark em{font-style:normal;}
body.menu-open a.wordmark{color:#f4f2ef;}
button#menuBtn{display:flex;flex-direction:column;align-items:flex-end;gap:5px;min-width:44px;min-height:44px;padding:8px 0 4px;}
.menu-label{font-size:clamp(12px,1.25vw,15px);letter-spacing:.01em;color:#fff;opacity:1;transition:opacity .35s ease;}
body.menu-open .menu-label{opacity:0;}
.bars{position:relative;width:clamp(42px,4.4vw,62px);height:clamp(16px,2vw,22px);}
.bars i{display:block;position:absolute;left:0;right:0;top:50%;height:1px;background:#fff;transition:transform .35s ease,width .35s ease;}
.bars i:first-child{transform:translateY(-5px);}
.bars i:last-child{width:clamp(34px,3.6vw,50px);transform:translateY(5px);margin-left:auto;}
button#menuBtn:hover .bars i:last-child{transform:translateY(5px) translateX(-8px);}
body.menu-open .bars i:first-child{width:100%;transform:translateY(0) rotate(45deg);}
body.menu-open .bars i:last-child{width:100%;transform:translateY(0) rotate(-45deg);}
body.menu-open .bars i{background:#f4f2ef;}
.bio.chrome{position:fixed;left:calc(var(--pad) + var(--safe-left));bottom:calc(var(--pad) + var(--safe-bottom));z-index:55;max-width:min(320px,46vw);opacity:0;transition:opacity 1.2s ease .15s,transform .5s ease;}
body.revealed .bio.chrome{opacity:1;}
body.deep .bio.chrome,body.gridview .bio.chrome,body.lit .bio.chrome{opacity:0;transform:translateY(10px);pointer-events:none;}
.who{display:flex;align-items:center;gap:14px;margin-bottom:14px;}
img#avatar{width:52px;height:52px;border-radius:3px;object-fit:cover;filter:grayscale(.15);flex-shrink:0;}
.who b{font-family:var(--serif);font-weight:400;font-size:19px;letter-spacing:.01em;}
.bio p{font-size:12.5px;line-height:1.62;color:rgba(244,242,239,.72);}
.colophon.chrome{position:fixed;right:calc(var(--pad) + var(--safe-right));bottom:calc(var(--pad) + var(--safe-bottom));z-index:55;font-size:12.5px;color:rgba(244,242,239,.72);opacity:0;transition:opacity 1.2s ease .15s;}
body.revealed .colophon.chrome{opacity:1;}
body.gridview .colophon.chrome,body.lit .colophon.chrome{opacity:0;pointer-events:none;}
button#gridBtn{position:fixed;left:calc(var(--pad) + var(--safe-left));bottom:calc(var(--pad) + var(--safe-bottom));z-index:56;width:44px;height:44px;padding:5px;display:grid;grid-template-columns:1fr 1fr;gap:4px;opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .5s ease,transform .5s ease;}
body.deep button#gridBtn,body.gridview button#gridBtn{opacity:1;transform:translateY(0);pointer-events:auto;}
#gridBtn b{display:block;background:#f4f2ef;border-radius:2px;transition:background .25s ease,transform .25s ease;}
#gridBtn:hover b{background:#fff;transform:scale(.86);}
body.gridview #gridBtn b:first-child{transform:translate(3px,3px);}
body.gridview #gridBtn b:last-child{transform:translate(-3px,-3px);}
body.gridview #gridBtn:hover b:first-child{transform:translate(3px,3px) scale(.86);}
body.gridview #gridBtn:hover b:last-child{transform:translate(-3px,-3px) scale(.86);}
.cue.chrome{position:fixed;left:50%;bottom:calc(var(--pad) + var(--safe-bottom) + 4px);transform:translateX(-50%);z-index:54;display:flex;align-items:center;gap:10px;font-size:10px;text-transform:uppercase;letter-spacing:.24em;color:rgba(244,242,239,.42);white-space:nowrap;opacity:0;transition:opacity 1.2s ease .15s;}
body.revealed .cue.chrome{opacity:1;}
body.deep .cue.chrome,body.gridview .cue.chrome,body.lit .cue.chrome{opacity:0;pointer-events:none;}
.cue s{display:block;width:44px;height:1px;background:rgba(244,242,239,.28);overflow:hidden;text-decoration:none;}
.cue s::after{content:'';display:block;width:100%;height:100%;background:#f4f2ef;animation:sweep 2.6s ease infinite;}
@keyframes sweep{0%{transform:translateX(-100%);}55%{transform:translateX(0);}100%{transform:translateX(100%);}}
#stage{position:fixed;inset:0;z-index:10;perspective:var(--persp);perspective-origin:50% 50%;overflow:hidden;touch-action:none;transition:opacity .6s ease,filter .6s ease;}
@media(pointer:coarse){#stage{touch-action:pan-y;}}
body.gridview #stage{opacity:0;filter:blur(14px);pointer-events:none;}
#world{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform;}
#orb{position:absolute;top:0;left:0;width:0;height:0;transform-style:preserve-3d;opacity:1;transform:none;}
#headline{position:absolute;top:0;left:0;width:var(--hw);margin-left:calc(var(--hw)/ -2);text-align:center;font-family:var(--serif);font-weight:400;font-size:clamp(25px,3.7vw,55px);line-height:1.06;letter-spacing:-.005em;color:#fff;text-shadow:0 2px 34px rgba(0,0,0,.55);pointer-events:none;user-select:none;-webkit-user-select:none;}
#headline .inner{position:absolute;top:0;left:0;width:100%;transform:translateY(-50%);}
#headline .inner span{display:inline-block;opacity:0;transform:translateY(.42em);filter:blur(7px);}
body.revealed #headline .inner span{opacity:1;transform:none;filter:blur(0);transition:opacity 1.05s ease calc(.9s + var(--i,0)*.085s),transform 1.15s ease calc(.9s + var(--i,0)*.085s),filter 1.05s ease calc(.9s + var(--i,0)*.085s);}
.card{position:absolute;top:0;left:0;}
.card figure{width:100%;height:100%;overflow:hidden;border-radius:3px;background:#0a0a0a;margin:0;position:relative;transition:transform .5s ease;}
.card figure:hover{transform:scale(1.045);}
.card figure img{width:100%;height:100%;object-fit:cover;display:block;opacity:0;}
body.revealed .card figure img{transition:opacity .8s ease-out;}
.card figure img.in{opacity:1;}
.card figure::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,var(--d,0));box-shadow:inset 0 0 0 1px rgba(255,255,255,.07);border-radius:3px;pointer-events:none;}
#grid{position:fixed;inset:0;z-index:20;overflow-y:auto;background:#000;padding:calc(var(--pad)*3.4) var(--pad) calc(var(--pad)*4);opacity:0;pointer-events:none;transition:opacity .6s ease;}
body.gridview #grid{opacity:1;pointer-events:auto;}
.rows{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:clamp(10px,1.4vw,20px);max-width:1680px;margin:0 auto;}
.rows figure{aspect-ratio:3/2;border-radius:3px;background:#0b0b0b;cursor:pointer;overflow:hidden;position:relative;margin:0;}
.rows figure img{width:100%;height:100%;object-fit:cover;opacity:.82;transition:opacity .8s ease,transform .8s ease;}
.rows figure:hover img{transform:scale(1.05);opacity:1;}
.rows figcaption{position:absolute;inset:auto 0 0 0;background:linear-gradient(transparent,rgba(0,0,0,.82));padding:26px 14px 12px;font-family:var(--serif);font-size:15px;color:var(--ink);opacity:0;transform:translateY(6px);transition:opacity .3s ease,transform .3s ease;}
.rows figure:hover figcaption{opacity:1;transform:none;}
#lit{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:clamp(56px,8vh,84px) var(--pad);opacity:0;pointer-events:none;transition:opacity .42s ease;}
body.lit #lit{opacity:1;pointer-events:auto;}
.scrim{position:absolute;inset:0;cursor:default;}
.plate{position:relative;z-index:1;width:min(72vw,860px,calc((100vh - 230px)*1.5));transition:transform .62s var(--ease),opacity .42s ease;}
.shot{position:relative;width:100%;aspect-ratio:3/2;border-radius:2px;background:#0b0b0b;box-shadow:0 30px 90px rgba(0,0,0,.75);overflow:hidden;}
.shot img{width:100%;height:100%;object-fit:cover;border-radius:2px;display:block;}
button.close-btn{position:absolute;top:12px;right:14px;z-index:2;font-size:12.5px;min-height:44px;padding:10px 14px;border:1px solid rgba(244,242,239,.78);border-radius:6px;background:rgba(0,0,0,.35);color:#f4f2ef;transition:border-color .25s ease,background .25s ease;}
button.close-btn:hover{border-color:#fff;background:rgba(0,0,0,.55);}
.meta{display:grid;grid-template-columns:minmax(0,.78fr) minmax(0,1.22fr);gap:clamp(22px,3.2vw,48px);padding-top:16px;}
h2#litTitle{font-family:var(--serif);font-weight:400;font-size:clamp(22px,2.15vw,32px);line-height:1.08;letter-spacing:-.01em;margin-bottom:6px;color:var(--ink);}
.where#litWhere{font-size:13px;color:rgba(244,242,239,.62);}
.note#litNote{font-size:13.5px;line-height:1.55;color:rgba(244,242,239,.92);}
#menu{position:fixed;inset:0;z-index:80;background:#050505;display:grid;place-items:center;clip-path:inset(0 0 100% 0);transition:clip-path .85s var(--ease);pointer-events:none;}
#menu.open{clip-path:inset(0);pointer-events:auto;}
#menu nav{display:flex;flex-direction:column;align-items:center;gap:clamp(4px,1vw,10px);text-align:center;}
#menu nav a{font-family:var(--serif);font-size:clamp(34px,7.6vw,78px);line-height:1.08;color:#f4f2ef;text-decoration:none;opacity:.55;letter-spacing:0;transition:opacity .25s ease,letter-spacing .25s ease;}
#menu nav a:hover{opacity:1;letter-spacing:.012em;}
.addr{position:absolute;left:calc(var(--pad) + var(--safe-left));right:calc(var(--pad) + var(--safe-right));bottom:calc(var(--pad) + var(--safe-bottom));font-size:12.5px;color:var(--dim);line-height:1.7;}
#dot{position:fixed;top:0;left:0;z-index:300;width:19px;height:19px;margin:-9.5px 0 0 -9.5px;border-radius:50%;background:rgba(214,212,209,.9);mix-blend-mode:difference;border:1px solid transparent;pointer-events:none;transition:width .35s ease,height .35s ease,margin .35s ease,background .35s ease,border-color .35s ease;}
#dot.wide{width:52px;height:52px;margin:-26px 0 0 -26px;background:rgba(244,242,239,.14);border-color:rgba(244,242,239,.75);}
@media(hover:none),(pointer:coarse){#dot{display:none;}}
@media(max-width:900px){.bio.chrome{max-width:min(420px,calc(100vw - 2*var(--pad) - var(--safe-left) - var(--safe-right)));}.bio p{font-size:12px;}.colophon.chrome{font-size:11px;}.meta{grid-template-columns:1fr;gap:10px;padding-top:14px;}.plate{width:min(92vw,calc((100dvh - 220px)*1.5));}.rows{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));}#grid{padding-top:calc(var(--pad)*2.8 + var(--safe-top));}}
@media(max-width:768px){.colophon.chrome{display:none;}.bio.chrome{max-width:calc(100vw - 2*var(--pad) - var(--safe-left) - var(--safe-right));}#headline{font-size:clamp(22px,6.4vw,34px);}#menu nav a{font-size:clamp(28px,9vw,54px);}.addr{font-size:11.5px;}}
@media(max-width:640px){:root{--hw:min(84vw,360px);--pad:clamp(12px,4vw,18px);}img#avatar{width:42px;height:42px;}.who b{font-size:17px;}.bio p{font-size:11.5px;line-height:1.55;}.cue.chrome{display:none;}#lit{display:block;overflow-y:auto;padding:calc(52px + var(--safe-top)) calc(var(--pad) + var(--safe-right)) calc(var(--pad) + var(--safe-bottom)) calc(var(--pad) + var(--safe-left));}.plate{width:100%;max-width:560px;margin:0 auto;}h2#litTitle{font-size:clamp(20px,5.6vw,26px);}.note#litNote{font-size:12.5px;line-height:1.58;}button.close-btn{top:8px;right:8px;}.rows{grid-template-columns:1fr 1fr;gap:8px;}.rows figcaption{opacity:1;transform:none;font-size:13px;}#grid{padding:calc(var(--safe-top) + var(--pad)*2.8) calc(var(--pad) + var(--safe-right)) calc(var(--pad) + var(--safe-bottom)) calc(var(--pad) + var(--safe-left));}}
@media(max-width:380px){:root{--hw:min(88vw,320px);}.who{gap:10px;margin-bottom:10px;}.bio p{display:none;}.rows{grid-template-columns:1fr;}#menu nav{gap:2px;}#menu nav a{font-size:clamp(24px,10vw,40px);}}
@media(max-height:520px) and (orientation:landscape){.bio.chrome,.colophon.chrome,.cue.chrome{display:none!important;}#headline{font-size:clamp(18px,4.8vh,28px);}#lit{padding-top:calc(36px + var(--safe-top));}.meta{padding-top:10px;}.plate{width:min(58vw,calc((100dvh - 80px)*1.5));}header.chrome{padding-top:calc(8px + var(--safe-top));}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.14s!important;}}
</style>
</head>
<body class="locked">
<div id="splash"><p class="mark">Ethan<em>Vale</em></p><div class="bar"><s id="bar"></s></div><p class="tag">Field Notes 2026</p></div>
<div id="intro"><video id="film" playsinline webkit-playsinline preload="auto" disablepictureinpicture></video><div class="veil"></div><div class="fallback"></div><button id="skip">Skip</button></div>
<div class="vig"></div>
<header class="chrome"><a href="#" class="wordmark" aria-label="Ethan Vale">Ethan<em>Vale</em></a><button id="menuBtn" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span class="menu-label">Menu</span><span class="bars"><i></i><i></i></span></button></header>
<div id="stage"><div id="world"><div id="orb"></div><h1 id="headline"><span class="inner"></span></h1></div></div>
<div id="grid"><div class="rows"></div></div>
<div id="lit"><div class="scrim" data-close></div><div class="plate"><div class="shot"><img id="litImg" src="" alt=""><button class="close-btn" data-close>Close</button></div><div class="meta"><div><h2 id="litTitle"></h2><p class="where" id="litWhere"></p></div><p class="note" id="litNote"></p></div></div></div>
<div class="bio chrome"><div class="who"><img id="avatar" src="" alt="Ethan Vale" width="52" height="52"><b>Ethan Vale</b></div><p>Wildlife photography is less about taking pictures and more about learning when not to move. Every frame in this archive was captured in natural conditions without intervention.</p></div>
<p class="colophon chrome">Field Notes 2026</p>
<button id="gridBtn" aria-label="Toggle grid view"><b></b><b></b><b></b><b></b></button>
<p class="cue chrome"><s></s> Drag to rotate</p>
<div id="menu"><nav><a href="#" data-grid>The Archive</a><a href="#">Field Notes</a><a href="#">Studio</a><a href="#" data-close-menu>Contact</a></nav><div class="addr">Nairobi \u00b7 Cape Town \u00b7 Reykjav\u00edk<br>studio@ethanvale.photo</div></div>
<div id="dot"></div>
<div id="scrolltrack"></div>
<script>
(function(){
'use strict';
var CDN='${CDN}';
var FILM='${FILM}';
var AV_ID='${AV_ID}';
var SHOTS=${shotsJS};
function g(id){return document.getElementById(id);}
var splEl=g('splash'),barEl=g('bar'),introEl=g('intro'),filmEl=g('film'),skipEl=g('skip');
var stEl=g('stage'),wldEl=g('world'),orbEl=g('orb'),hdEl=g('headline');
var litEl=g('lit'),litImg=g('litImg'),litTi=g('litTitle'),litWh=g('litWhere'),litNo=g('litNote');
var plEl=litEl.querySelector('.plate'),gridEl=g('grid'),rowsEl=gridEl.querySelector('.rows');
var gBtn=g('gridBtn'),mBtn=g('menuBtn'),menuEl=g('menu'),dotEl=g('dot'),avEl=g('avatar');
var inner=hdEl.querySelector('.inner');
inner.innerHTML=['I','See','Through','the','Wild'].map(function(w,i){return '<span style="--i:'+i+'">'+w+'</span>';}).join(' ');
var GA=Math.PI*(3-Math.sqrt(5));
var PTS=SHOTS.map(function(_,i){
  var y=1-(i/(SHOTS.length-1))*2,rad=Math.sqrt(Math.max(0,1-y*y)),th=i*GA;
  var x=Math.cos(th)*rad,z=Math.sin(th)*rad;
  return{x:x,y:y,z:z,lat:Math.asin(y)*180/Math.PI,lon:Math.atan2(x,z)*180/Math.PI};
});
var R=300,CW=140,PERSP=1150,DMAX=640;
function compLayout(){
  var w=window.innerWidth,h=window.innerHeight;
  PERSP=w<=380?620:w<=640?760:w<=900?920:1150;
  var hr=w<=380?.38:w<=640?.42:.46,wr=w<=380?.48:w<=640?.52:.58,fl=w<=380?108:w<=640?120:155;
  R=Math.floor(Math.max(fl,Math.min(480,h*hr,w*wr)));
  CW=Math.round(Math.max(72,R*(w<=380?.44:w<=640?.46:.47)));
  DMAX=w<=380?420:w<=640?520:w<=900?640:760;
  document.documentElement.style.setProperty('--persp',PERSP+'px');
}
compLayout();
var blobMap={};
function thumb(id){return CDN+id+'_min.webp';}
function full(id){return CDN+id+'.png';}
function decodeImg(id,maxW,cb){
  if(blobMap[id]){cb(blobMap[id]);return;}
  var url=thumb(id),img=new Image();
  img.crossOrigin='anonymous';
  img.onload=function(){
    if(img.naturalWidth<=maxW){blobMap[id]=url;cb(url);return;}
    try{
      var c=document.createElement('canvas'),ratio=img.naturalHeight/img.naturalWidth;
      c.width=maxW;c.height=Math.round(maxW*ratio);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      c.toBlob(function(blob){var bu=URL.createObjectURL(blob);blobMap[id]=bu;cb(bu);},'image/webp',.88);
    }catch(e){blobMap[id]=url;cb(url);}
  };
  img.onerror=function(){blobMap[id]=url;cb(url);};
  img.src=url;
}
var CARDS=[],GFIGS=[];
SHOTS.forEach(function(s,i){
  var card=document.createElement('div');
  card.className='card'+(s.tall?' tall':'');card.dataset.idx=i;
  var fig=document.createElement('figure'),img=document.createElement('img');
  img.alt=s.title;img.decoding='async';
  fig.appendChild(img);card.appendChild(fig);orbEl.appendChild(card);
  CARDS.push({el:card,fig:fig,img:img,s:s,pt:PTS[i]});
  var gf=document.createElement('figure');gf.dataset.idx=i;
  var gi=document.createElement('img');gi.alt=s.title;gi.decoding='async';
  var gc=document.createElement('figcaption');gc.textContent=s.title;
  gf.appendChild(gi);gf.appendChild(gc);rowsEl.appendChild(gf);
  GFIGS.push({fig:gf,img:gi});
});
function layoutCards(){
  CARDS.forEach(function(c){
    var cw=CW,tall=c.s.tall,ch=tall?Math.round(cw*1.25):Math.round(cw/1.5),mt=tall?-cw*.625:-cw/3;
    c.el.style.cssText='width:'+cw+'px;height:'+ch+'px;margin-left:'+(-cw/2)+'px;margin-top:'+mt+'px;'+
      'transform:translate3d('+(c.pt.x*R)+'px,'+(-c.pt.y*R)+'px,'+(c.pt.z*R)+'px)'+
      ' rotateY('+c.pt.lon+'deg) rotateX('+c.pt.lat+'deg);';
  });
}
layoutCards();
var spin=0,tilt=-4,camZ=0,camZT=0,dragX=0,dragY=0,velX=0,velY=0,PLIM=32,focIdx=-1,isLit=false,isDrag=false;
var lastD={},lastO={};
function rotZ(px,py,pz,sy,sx){
  var yr=sy*Math.PI/180,xr=sx*Math.PI/180;
  var rx=px*Math.cos(yr)+pz*Math.sin(yr),ry=py,rz=-px*Math.sin(yr)+pz*Math.cos(yr);
  return ry*Math.sin(xr)+rz*Math.cos(xr);
}
function frame(){
  requestAnimationFrame(frame);
  if(!isDrag&&!isLit){
    dragX+=velX;dragY+=velY;velX*=.94;velY*=.94;
    if(Math.abs(velX)<.002)velX=0;if(Math.abs(velY)<.002)velY=0;
    var tot=tilt+dragY;if(tot>PLIM)dragY=PLIM-tilt;if(tot<-PLIM)dragY=-PLIM-tilt;
  }
  var sY=window.scrollY,sd=window.innerHeight*.16,p=Math.min(1,Math.max(0,sY/sd));
  if(sY>sd*1.05)window.scrollTo(0,sd);
  camZT=p*Math.min(64,R*.12);camZ+=(camZT-camZ)*.075;
  var sx=tilt+dragY,sy=spin+dragX;
  wldEl.style.transform='translateZ('+camZ+'px) rotateY('+sy+'deg) rotateX('+sx+'deg)';
  hdEl.style.transform='rotateX('+(-sx)+'deg) rotateY('+(-sy)+'deg) translateZ('+(R*.62)+'px)';
  hdEl.style.opacity=String(Math.max(0,1-p*.55));
  document.body.classList.toggle('deep',p>.08);
  var near=PERSP*.66;
  CARDS.forEach(function(c,i){
    var zf=rotZ(c.pt.x,c.pt.y,c.pt.z,sy,sx);
    var base=.14+.86*Math.pow((zf+1)/2,.85),shade=1-Math.min(1,p*1.6),dim=shade*(1-base);
    if(isLit){
      if(i===focIdx){if(lastO[i]!==0){c.fig.style.opacity='0';lastO[i]=0;}return;}
      dim=Math.min(1,dim+.78);
    }
    var absZ=zf*R+camZ,fade=absZ>near?Math.max(0,1-(absZ-near)/190):1;
    var d=Math.round(dim*100)/100,o=Math.round(fade*100)/100;
    if(lastD[i]!==d){c.el.style.setProperty('--d',String(d));lastD[i]=d;}
    if(lastO[i]!==o){c.fig.style.opacity=String(o);lastO[i]=o;}
  });
}
wldEl.style.transform='translateZ(0px) rotateY('+spin+'deg) rotateX('+tilt+'deg)';
hdEl.style.transform='rotateX('+(-tilt)+'deg) rotateY('+(-spin)+'deg) translateZ('+(R*.62)+'px)';
requestAnimationFrame(frame);
var dSX=0,dSY=0,lMX=0,lMY=0,totMv=0,tAxis=null,dnIdx=-1;
stEl.addEventListener('pointerdown',function(e){
  if(isLit)return;
  var c=e.target.closest('.card');dnIdx=c?+c.dataset.idx:-1;
  dSX=lMX=e.clientX;dSY=lMY=e.clientY;totMv=0;tAxis=null;velX=0;velY=0;
  if(e.pointerType!=='touch'){stEl.setPointerCapture(e.pointerId);isDrag=true;}
},{passive:true});
stEl.addEventListener('pointermove',function(e){
  if(!e.isPrimary)return;
  var dx=e.clientX-dSX,dy=e.clientY-dSY;
  totMv=Math.max(totMv,Math.sqrt(dx*dx+dy*dy));
  if(e.pointerType==='touch'&&!isDrag){
    if(totMv>10){
      if(Math.abs(dy)>Math.abs(dx)*1.15){tAxis='v';return;}
      tAxis='h';isDrag=true;
      try{stEl.setPointerCapture(e.pointerId);}catch(x){}
    }
    if(!isDrag)return;
  }
  if(!isDrag)return;
  var mdx=e.clientX-lMX,mdy=e.clientY-lMY;
  dragX+=mdx*.13;dragY+=mdy*.13;velX=mdx*.13;velY=mdy*.13;
  var tot=tilt+dragY;
  if(tot>PLIM){dragY=PLIM-tilt;velY=0;}
  if(tot<-PLIM){dragY=-PLIM-tilt;velY=0;}
  lMX=e.clientX;lMY=e.clientY;
},{passive:true});
stEl.addEventListener('pointerup',function(e){
  if(!e.isPrimary)return;
  var slop=window.matchMedia('(pointer:coarse)').matches?14:6;
  isDrag=false;
  if(totMv<slop&&dnIdx>=0)openLit(dnIdx,CARDS[dnIdx].fig);
  dnIdx=-1;
});
stEl.addEventListener('pointercancel',function(){isDrag=false;dnIdx=-1;});
var litTok=0,litSrc=null;
function openLit(idx,srcEl){
  focIdx=idx;isLit=true;litSrc=srcEl;
  var s=SHOTS[idx];
  litImg.src=blobMap[s.id]||thumb(s.id);litImg.alt=s.title;
  litTi.textContent=s.title;litWh.textContent=s.place;litNo.textContent=s.note;
  var tok=++litTok;
  document.body.classList.add('lit');
  requestAnimationFrame(function(){
    var sr=srcEl.getBoundingClientRect(),dr=plEl.getBoundingClientRect();
    var dx=sr.left+sr.width/2-(dr.left+dr.width/2),dy=sr.top+sr.height/2-(dr.top+dr.height/2);
    var sx=Math.max(.04,sr.width/dr.width),sy=Math.max(.04,sr.height/dr.height);
    plEl.style.transition='none';
    plEl.style.transform='translate('+dx+'px,'+dy+'px) scale('+sx+','+sy+')';
    plEl.style.opacity='0';
    plEl.offsetHeight;
    plEl.style.transition='';plEl.style.transform='';plEl.style.opacity='';
  });
  document.body.style.overflow='hidden';
  var fi=new Image();
  fi.onload=function(){if(litTok===tok)litImg.src=fi.src;};
  fi.src=full(s.id);
}
function closeLit(){
  if(!isLit)return;
  var src=litSrc,sr2=plEl.getBoundingClientRect();
  focIdx=-1;isLit=false;
  document.body.classList.remove('lit');document.body.style.overflow='';
  if(src){
    requestAnimationFrame(function(){
      var sr=src.getBoundingClientRect();
      var dx=sr.left+sr.width/2-(sr2.left+sr2.width/2),dy=sr.top+sr.height/2-(sr2.top+sr2.height/2);
      var sx=Math.max(.04,sr.width/sr2.width),sy=Math.max(.04,sr.height/sr2.height);
      plEl.style.transition='';
      plEl.style.transform='translate('+dx+'px,'+dy+'px) scale('+sx+','+sy+')';
      plEl.style.opacity='0';
      setTimeout(function(){plEl.style.transition='none';plEl.style.transform='';plEl.style.opacity='';plEl.offsetHeight;plEl.style.transition='';},640);
    });
  }
}
litEl.addEventListener('click',function(e){if(e.target.closest('[data-close]'))closeLit();});
rowsEl.addEventListener('click',function(e){var f=e.target.closest('figure');if(f)openLit(+f.dataset.idx,f);});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    if(document.body.classList.contains('lit'))closeLit();
    else if(document.body.classList.contains('menu-open'))closeMenu();
    else if(document.body.classList.contains('gridview'))toggleGrid();
  }
});
function openMenu(){document.body.classList.add('menu-open');menuEl.classList.add('open');mBtn.setAttribute('aria-expanded','true');mBtn.setAttribute('aria-label','Close menu');}
function closeMenu(){document.body.classList.remove('menu-open');menuEl.classList.remove('open');mBtn.setAttribute('aria-expanded','false');mBtn.setAttribute('aria-label','Open menu');}
mBtn.addEventListener('click',function(){document.body.classList.contains('menu-open')?closeMenu():openMenu();});
menuEl.querySelectorAll('a').forEach(function(a){
  a.addEventListener('click',function(e){
    e.preventDefault();closeMenu();
    if(a.hasAttribute('data-grid')&&!document.body.classList.contains('gridview'))toggleGrid();
  });
});
function toggleGrid(){document.body.classList.toggle('gridview');}
gBtn.addEventListener('click',toggleGrid);
var lRW=window.innerWidth,lRH=window.innerHeight,rTm=null;
function onRsz(){
  var w=window.innerWidth,h=window.innerHeight;
  if(Math.abs(w-lRW)<20&&Math.abs(h-lRH)<20)return;
  lRW=w;lRH=h;compLayout();layoutCards();
}
window.addEventListener('resize',function(){clearTimeout(rTm);rTm=setTimeout(onRsz,60);});
window.addEventListener('orientationchange',function(){setTimeout(onRsz,220);});
if(window.visualViewport){window.visualViewport.addEventListener('resize',onRsz);window.visualViewport.addEventListener('scroll',onRsz);}
if(window.matchMedia('(pointer:fine)').matches){
  var cx=0,cy=0,ddx=0,ddy=0;
  document.addEventListener('mousemove',function(e){cx=e.clientX;cy=e.clientY;});
  document.addEventListener('mouseover',function(e){if(e.target.closest('.card,a,button,#grid figure'))dotEl.classList.add('wide');});
  document.addEventListener('mouseout',function(e){if(e.target.closest('.card,a,button,#grid figure'))dotEl.classList.remove('wide');});
  (function dl(){ddx+=(cx-ddx)*.2;ddy+=(cy-ddy)*.2;dotEl.style.transform='translate3d('+ddx+'px,'+ddy+'px,0)';requestAnimationFrame(dl);})();
}
var loaded=0,TOTAL=SHOTS.length+1,birth=performance.now(),spOut=false;
function tick(){loaded++;barEl.style.transform='scaleX('+Math.min(1,loaded/TOTAL)+')';if(loaded>=TOTAL)trySplash();}
function trySplash(){var w=Math.max(0,1150-(performance.now()-birth));setTimeout(exitSplash,w);}
setTimeout(function(){if(!spOut){barEl.style.transform='scaleX(1)';exitSplash();}},9000);
function exitSplash(){
  if(spOut)return;spOut=true;barEl.style.transform='scaleX(1)';
  setTimeout(function(){splEl.classList.add('out');setTimeout(function(){splEl.remove();beginFilm();},950);},150);
}
decodeImg(AV_ID,160,function(u){avEl.src=u;});
SHOTS.forEach(function(s,i){
  decodeImg(s.id,DMAX,function(u){
    CARDS[i].img.src=u;
    if(CARDS[i].img.complete)CARDS[i].img.classList.add('in');
    else CARDS[i].img.onload=function(){CARDS[i].img.classList.add('in');};
    GFIGS[i].img.src=u;
    tick();
  });
});
var ftk=false;
function filmTick(){if(ftk)return;ftk=true;tick();}
filmEl.addEventListener('canplaythrough',filmTick,{once:true});
filmEl.addEventListener('loadeddata',filmTick,{once:true});
filmEl.addEventListener('error',filmTick,{once:true});
filmEl.muted=false;filmEl.defaultMuted=false;filmEl.playsInline=true;
filmEl.setAttribute('webkit-playsinline','');
filmEl.src=FILM;filmEl.preload='auto';
filmEl.addEventListener('play',function(){filmEl.playbackRate=2;});
filmEl.addEventListener('error',function(){introEl.classList.add('novideo');});
var rvld=false,rvTm=null;
function doReveal(){
  if(rvld)return;rvld=true;clearTimeout(rvTm);
  introEl.classList.add('closing');
  document.body.classList.remove('locked');
  document.documentElement.style.overflow='';
  compLayout();layoutCards();
  requestAnimationFrame(function(){
    compLayout();layoutCards();
    setTimeout(function(){
      compLayout();layoutCards();
      document.body.classList.add('revealed');
      introEl.classList.add('gone');
      setTimeout(function(){introEl.remove();},700);
    },1000);
  });
}
function beginFilm(){
  filmEl.playbackRate=2;
  if(filmEl.currentTime>.05)filmEl.currentTime=0;
  filmEl.addEventListener('playing',function(){
    skipEl.classList.add('vis');
    var dur=filmEl.duration||0,cur=filmEl.currentTime;
    var delay=Math.max(300,((dur-cur-.45)/2)*1000);
    rvTm=setTimeout(doReveal,delay);
  },{once:true});
  filmEl.addEventListener('ended',doReveal,{once:true});
  rvTm=setTimeout(doReveal,14000);
  var pp=filmEl.play();
  if(pp)pp.catch(function(){
    skipEl.classList.add('vis');
    function unbl(){
      document.removeEventListener('pointerdown',unbl);
      document.removeEventListener('keydown',unbl);
      document.removeEventListener('touchstart',unbl);
      filmEl.play().catch(function(){});
      setTimeout(function(){if(filmEl.paused)doReveal();},2600);
    }
    document.addEventListener('pointerdown',unbl,{once:true});
    document.addEventListener('keydown',unbl,{once:true});
    document.addEventListener('touchstart',unbl,{once:true});
  });
}
skipEl.addEventListener('click',doReveal);
})();
<\/script>
</body>
</html>`;

fs.writeFileSync(OUT, html, 'utf8');
console.log('Written:', OUT, 'size:', fs.statSync(OUT).size, 'bytes');
