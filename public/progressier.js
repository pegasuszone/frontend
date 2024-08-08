var progressier;
if (!("progressier" in window)) {
    window.progressier = progressier
}
var currentScriptNode = document && document.currentScript;
var allScriptsInPage = document.querySelectorAll('script[src*="/client/script.js?id="], script[src*="5000/client/script"], script[src*="progressier.com/myapp/"], script[src*="f.firebaseapp.com/myapp/"], script[src*="progressier.app/"]') || [];
if (allScriptsInPage[0] !== currentScriptNode && allScriptsInPage.length > 1) {
    throw "You are initializing the Progressier script more than once. Please remove the additional instances to ensure Progressier works properly."
}
if (window.location.hostname === "localhost") {
    console.warn("Testing Progressier on localhost is strongly not recommended. Instead, use the equivalent IP address, i.e. http://" + window.location.host.replace("localhost", "127.0.0.1"))
}
progressier = new ProgressierObj;

function ProgressierObj() {
    try {
        var t = this;
        this.debug = function() {
            return window.location.href.includes("ddbug=true")
        };
        window.addEventListener("beforeinstallprompt", function(e) {
            if (t.debug()) {
                console.log(e)
            }
            e.preventDefault();
            t.nativePrompt = e
        });
        this.scriptNode = document && document.currentScript;
        this.script = t.scriptNode && t.scriptNode.getAttribute("src") && t.scriptNode.getAttribute("src") ? t.scriptNode.getAttribute("src") : null;
        if (!t.script) {
            throw "Progressier Error: Couldn't retrieve currentScript. You may be using a browser that's incompatible with Progressier"
        }
        this.appId = 'd1YRu9dGZ3sSjIKB6Xrk'
        t.appId = 'd1YRu9dGZ3sSjIKB6Xrk'

        this.helpArticle = function(e) {
            return "https://intercom.help/progressier/en/articles/" + e
        };
        this.domain = window.location.origin;
        this.detection = new ProgressierDetection;
        this.initializing = new Promise(function(e, t) {
            var i = setInterval(function() {
                if (!document.querySelector("body")) {
                    return
                }
                clearInterval(i);
                return e()
            }, 100)
        });
        this.fetchdomain = "https://progressier.com";
        t.fetchdomain = "https://progressier.com";
        this.cookies = new ProgressierCookies;
        this.wording = new ProgressierText(t);
        this.utils = new ProgressierUtils(t);
        this.theming = new ProgressierTheming(t);
        this.flow = new ProgressierFlow(t);
        this.data = new ProgressierData(t);
        this.manifest = new ProgressierManifest(t);
        this.sw = new ProgressierSw(t);
        this["native"] = new ProgressierNative(t);
        this.user = new ProgressierUser(t);
        this.analytics = new ProgressierAnalytics(t);
        this.installbuttons = new ProgressierInstallButtons(t);
        this.promote = t["native"].promote;
        this.meta = new ProgressierMeta(t);
        this.add = t.user.add;
        this.toolbox = new ProgressierToolbox(t);
        this.offlineAlert = new ProgressierOfflineAlert(t);
        this.reloadPrompt = new ProgressierReloadPrompt(t);
        this.install = async function() {
            await t["native"].promote()
        };
        this.welcome = new ProgressierWelcomeScreen(t);
        this.bubbleData = new ProgressierBubbleData(t);
        this.banners = new ProgressierBanners(t);
        this.events = new ProgressierCustomEvents(t);
        this.protocol = new ProgressierProtocol(t);
        this.newsfeed = new ProgressierNewsfeed(t);
        this.initialized = true
    } catch (e) {
        console.log(e)
    }
}

function ProgressierTheming(e) {
    var i = this;
    this.parent = e;
    this.className = "progressier-theme-settings";
    this.light = `
	 :root{
		 --progressierBg: #ffffff;
		 --progressierElement: #fafafa;
		 --progressierTxt: #142a37;
		 --progressierBorderColor:#eaeaea;
		 --progressierHover:#f6f6f6;
		 --progressierBoxShadow: 0 2px 8px rgba(15,41,14,.08), 0 3px 35px rgba(7,21,41,.20);
		 --progressierIconShadow:0 2px 9px 0 rgba(82, 79, 79, 0.15);
		 --progressierBackdrop:rgba(255, 255, 255, 0.90);
		 --progressierFont:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif;
		 --progressierLetterSpacing:0.1px;
		 --progressierTextFontWeight:400;
		 --progressierHeadingFontWeight:500;
		 --progressierBtnFontWeight:400;
	}`;
    this.dark = `
		:root {
		--progressierBg: #202124;
		--progressierElement: #29292e;
		--progressierTxt: #bdc1c6;
		--progressierBorderColor: #313137;
		--progressierHover: #191a1e;
		--progressierBackdrop:rgba(0, 0, 0, 0.90);
		--progressierIconShadow: none;
	 }
	`;
    this.def = i.light + `
	@media (prefers-color-scheme: dark) {
		` + i.dark + `
	}
	`;
    this.add = function(t) {
        let e = document.getElementById(i.className);
        if (e) {
            e.innerHTML = t
        } else {
            let e = document.createElement("style");
            e.setAttribute("id", i.className);
            e.innerHTML = t;
            document.querySelector("head").appendChild(e)
        }
    };
    this.darkOnly = async function() {
        i.add(i.light + " " + i.dark);
        document.querySelector("body").setAttribute("data-progressier-forced-theme", "dark")
    };
    this.lightOnly = async function() {
        i.add(i.light);
        document.querySelector("body").setAttribute("data-progressier-forced-theme", "light")
    };
    this.init = async function() {
        i.add(i.def)
    };
    this.init()
}

function ProgressierBackdrop(e) {
    var n = this;
    this.parent = e;
    this.className = "progressier-backdrop";
    this.styling = `
		.` + n.className + `{position:fixed;z-index: 2147483642;left:0px;top:0px;width:100vw;height:100vh;background:var(--progressierBackdrop);}
		body:not(.progressier-blurring)  .` + n.className + `{display:none !important;z-index:-1 !important;}
		.` + n.className + ` svg{display:none !important;}
		body.progressier-blurring > *:not(.no-blurring){-webkit-filter:grayscale(1)  url(#backdropBlur);filter: grayscale(1) url(#backdropBlur);pointer-events:none;z-index: 888 !important;}
		body.progressier-blurring::-webkit-scrollbar{ width:0px !important; height:0px !important;}
		body.progressier-blurring *::-webkit-scrollbar{ width:0px !important; height:0px !important;}
		@media (min-width:992px){
			body.progressier-blurring > *:not(.no-blurring){-webkit-filter:grayscale(1)  blur(8px);filter: grayscale(1) blur(8px);pointer-events:none;z-index: 888 !important;}	
		}
		@supports (-webkit-touch-callout: none) {
		  -webkit-filter:grayscale(1)  blur(3px);filter: grayscale(1) blur(3px);
		}
	`;
    this.hide = function() {
        document.querySelector("body").classList.remove("progressier-blurring");
        if (!n.previousColor) {
            return
        }
        document.querySelector('meta[name="theme-color"]').setAttribute("content", n.previousColor)
    };
    this.show = function() {
        document.querySelector("body").classList.add("progressier-blurring");
        let e = document.querySelector('meta[name="theme-color"]');
        if (!e) {
            return
        }
        let t = e.getAttribute("content");
        let i = getComputedStyle(document.documentElement).getPropertyValue("--progressierBg").trim();
        if (!i || i.length < 3) {
            return
        }
        e.setAttribute("content", i);
        if (t) {
            n.previousColor = t
        }
    };
    this.init = async function() {
        await n.parent.parent.initializing;
        n.parent.styling(n.styling, n.className);
        n.element = n.parent.node("div", n.className + " no-blurring", {
            parent: document.querySelector("body"),
            html: `<svg>
		  <filter id='backdropBlur'>
			<feGaussianBlur stdDeviation='5'></feGaussianBlur>
			<feColorMatrix type='matrix' values='1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 9 0'></feColorMatrix>
			<feComposite in2='SourceGraphic' operator='in'></feComposite>
		  </filter>
		</svg>`
        })
    };
    this.init()
}

function ProgressierBanners(e) {
    let l = this;
    this.parent = e;
    this.installready = false;
    this.interval = 1500;
    this.timer = null;
    this.data = {};
    this.installCookie = "progressierinstallbanner";
    this.showInstall = function() {
        if (!l.installready) {
            return false
        }
        if (l.parent.detection.isStandalone()) {
            return false
        }
        if (l.parent.flow.functionalityEnabled) {
            return false
        }
        if (!l.data.installBannerPlatforms || l.data.installBannerPlatforms === "none") {
            return false
        }
        if (l.data.installBannerPlatforms === "mobile" && l.parent.detection.isDesktop()) {
            return false
        }
        if (l.data.installBannerPlatforms === "desktop" && !l.parent.detection.isDesktop()) {
            return false
        }
        if (l.parent.utils.urlMatchFailed(l.data.installBannerUrls)) {
            return false
        }
        if (!l.cookieAllows(l.installCookie, l.data.installBannerInterval)) {
            return false
        }
        return true
    };
    this.cookieName = function(e) {
        try {
            return e + l.parent.appId + (l.data.startUrl || "")
        } catch (t) {
            return e
        }
    };
    this.cookieAllows = function(e, t) {
        try {
            var i = l.parent.cookies.get(l.cookieName(e));
            if (!i) {
                return true
            }
            var n = new Date(i);
            var a = new Date;
            var r = (a.getTime() - n.getTime()) / 1e3;
            var s = r / 3600;
            if (s > t - 1) {
                return true
            }
            return false
        } catch (o) {
            return true
        }
    };
    this.deny = function(e) {
        l.parent.cookies.set(l.cookieName(e), (new Date).toISOString(), 365)
    };
    this.icon = function() {
        return l.data.icon512 || l.data.icon520 || l.parent.utils.emptyLogo()
    };
    this.startListening = async function() {
        await l.parent.data.waitForData();
        l.data = l.parent.data.params;
        if (!l.installTimer) {
            l.installTimer = setInterval(function() {
                if (!l.showInstall()) {
                    return
                }
                if (l.showed) {
                    return
                }
                l.showed = true;
                new ProgressierInstallBanner({
                    icon: l.icon(),
                    color: l.data.buttonColor,
                    btnColor: l.data.buttonTextColor,
                    text: l.data.installBannerPitch
                }, function() {
                    l.deny(l.installCookie)
                }).init();
                clearInterval(l.installTimer)
            }, l.interval)
        }
    };
    this.init = async function() {
        window.addEventListener("installready", function(e) {
            l.installready = true;
            l.startListening()
        })
    };
    this.init()
}

function ProgressierInstallBanner(e, t) {
    var r = this;
    this.data = e;
    this.deny = t;
    this.color = r.data && r.data.color ? r.data.color : "#1a73e8";
    this.btnColor = r.data && r.data.btnColor ? r.data.btnColor : "#ffffff";
    this.className = "progressier-install-banner";
    this.defaultText = progressier.wording.get("wannaSuggestApp");
    this.styling = `
		.` + r.className + `{position:fixed;top:-200px;width:100vw !important;background:var(--progressierBg);box-shadow: var(--progressierBoxShadow) !important;transition:top 0.3s ease-in-out; -webkit-transition:top 0.3s ease-in-out;padding:10px 0px !important;display: flex; align-items: center;z-index: 2147483644 !important; left:0px !important;}
		.` + r.className + `.in{top:0px;}
		.` + r.className + ` *{font-family:var(--progressierFont) !important;letter-spacing: var(--progressierLetterSpacing) !important;font-weight:var(--progressierTextFontWeight) !important;font-size:15px !important;}
		.` + r.className + `-inner{width:100%;display:flex;align-items:center;justify-content:space-between;height:100%;}
		.` + r.className + `-close{margin-right:20px;font-size:16px;display:flex;align-items:center;justify-content:center;width:40px;height:40px;cursor:pointer;border-radius:50%;flex:none;}
		.` + r.className + `[dir="rtl"] .` + r.className + `-close{margin-left:20px;margin-right:0px;}
		.` + r.className + `-close:hover{background:var(--progressierHover);}
		.` + r.className + `-close svg{width:20px;height:20px;flex:none;color:var(--progressierTxt) !important;}
		.` + r.className + `-close svg *{color:var(--progressierTxt) !important;}
		.` + r.className + `-details{display:flex;align-items:center;margin-left: 15px;}
		.` + r.className + `[dir="rtl"] .` + r.className + `-details{margin-left:0px;margin-right:15px;}
		.` + r.className + `-icon{flex:none !important;}
		.` + r.className + `-text{color:var(--progressierTxt) !important;line-height: 22px !important;word-break:break-word;}
		.` + r.className + `-icon img{width:45px;height:45px;flex:none !important;margin-left:20px;border-radius:10px;position:relative !important;}
		.` + r.className + `[dir="rtl"] .` + r.className + `-icon img{margin-left:0px;margin-right:20px;}
		.` + r.className + `-btns{display:flex;align-items:center;margin-left:30px;}
		.` + r.className + `[dir="rtl"] .` + r.className + `-btns{margin-right:30px;margin-left:0px;}
		.` + r.className + `-btns, .` + r.className + `-btns *{font-weight:var(--progressierBtnFontWeight) !important;}
		.` + r.className + `-btns button{padding:0px 30px !important;margin:0px 5px !important;outline:0px !important;border:0px !important;height:40px !Important;border-radius:5px !important;cursor:pointer !important;white-space:nowrap !important;box-shadow:none !important;display: flex !important; justify-content: center !important;align-items:center !important;-webkit-box-sizing: border-box !important; box-sizing: border-box !important;}
		.` + r.className + `-btns button:after, .` + r.className + `-btns button:before{display:none !important;}
		.` + r.className + `-btns button:nth-child(2){background:transparent !important;color:var(--progressierTxt) !important;}
		.` + r.className + `-btns button:nth-child(2):hover{background:var(--progressierHover) !important;}
		.` + r.className + `-btns button:first-child{background:` + r.color + ` !important;color:` + r.btnColor + ` !important;}
		.` + r.className + `-btns button:first-child *{color:` + r.btnColor + ` !important;}
		.` + r.className + `-btns button:first-child:hover{filter:brightness(0.9) !important;}
		.` + r.className + `-btns button.disabled{pointer-events:none !important;opacity:1 !important;}
		@media (min-width:992px){	
			.` + r.className + `{max-height:100px;}
		}
		@media (max-width:800px){		
			.` + r.className + `-btns{flex-direction:column !important;}
			.` + r.className + `-details{width: 100%; justify-content: space-between;}
			.` + r.className + `-btns button{width:100% !important;height:40px !important;max-width:120px !important;}
			.` + r.className + `-close{position: absolute;}
			.` + r.className + `-close{margin-right:10px;}
			.` + r.className + `[dir="rtl"] .` + r.className + `-close{margin-left:10px;margin-right:0px;}
			.` + r.className + `-icon{margin-left:20px;}
			.` + r.className + `[dir="rtl"] .` + r.className + `-icon{margin-left:0px;margin-right:20px;}
			.` + r.className + `-btns{margin:0px 10px !important;}
			.` + r.className + `{height:auto !important;padding:10px 0px !important;}
			.` + r.className + `-btns button:nth-child(2){display: none !important;}
			.` + r.className + `-text{line-height: 18px !important;}
		}
		@media (max-width:550px){	
			.` + r.className + ` *{font-size:13px !important;}
		}
		@media (prefers-color-scheme: dark) {
			body:not([data-progressier-forced-theme="light"]) div.` + r.className + `-btns button:nth-child(2){color:var(--progressierTxt) !important;}
		}
	`;
    this.remove = async function() {
        if (r.deny && !r.data.preview) {
            r.deny()
        }
        r.element.classList.remove("in");
        await progressier.utils.wait(1e3);
        r.element.remove()
    };
    this.render = async function() {
        var e = r.data.text || r.defaultText;
        var t = r.data.icon;
        var i = progressier.utils.node("div", r.className + "-inner", {
            parent: r.element
        });
        progressier.utils.node("div", r.className + "-icon", {
            parent: i,
            html: `<img src="` + t + `" alt="app icon"  style="color:transparent !important;"/>`
        });
        var n = progressier.utils.node("div", r.className + "-details", {
            parent: i
        });
        progressier.utils.node("div", r.className + "-text", {
            parent: n,
            html: e
        });
        var a = progressier.utils.node("div", r.className + "-btns", {
            parent: n
        });
        if (r.data.preview) {
            progressier.utils.node("button", "disabled", {
                parent: a,
                html: progressier.wording.get("install")
            })
        } else {
            progressier.utils.node("button", "progressier-install-button", {
                parent: a,
                click: r.remove
            })
        }
        progressier.utils.node("button", {
            parent: a,
            html: progressier.wording.get("notNow"),
            click: r.remove
        });
        progressier.utils.node("div", r.className + "-close", {
            parent: i,
            html: progressier.utils.svg_x(),
            click: r.remove
        });
        await progressier.utils.wait(500);
        r.element.classList.add("in")
    };
    this.make = function() {
        document.querySelectorAll("." + r.className).forEach(function(e) {
            e.remove()
        });
        r.element = progressier.utils.node("div", r.className, {
            parent: document.querySelector("body")
        });
        if (progressier.wording.rtl()) {
            r.element.setAttribute("dir", "rtl")
        }
    };
    this.init = async function() {
        progressier.utils.styling(r.styling, r.className);
        r.make();
        r.render()
    }
}

function ProgressierCustomEvents(e) {
    var c = this;
    this.parent = e;
    this.emit = function(e, t) {
        var i = new CustomEvent(e, t);
        window.dispatchEvent(i)
    };
    this.installReady = async function() {
        try {
            var e = await c.parent["native"].installationStatus();
            var t = c.parent["native"].installed;
            var i = c.parent["native"].installable;
            var n = c.parent.detection.isInAppBrowser();
            var a = c.parent.detection.isFromTwitter();
            var r = e === "noengag";
            var s = c.parent.detection.isIOS();
            var o = c.parent.detection.isSafari();
            var l = c.parent.detection.recentiOS();
            if (n) {
                return false
            }
            if (a) {
                return false
            }
            if (l) {
                return "ios"
            }
            if (r) {
                return false
            }
            if (t) {
                return false
            }
            if (s && o) {
                return "ios"
            }
            if (i) {
                return "native"
            }
            return false
        } catch (p) {
            console.log(p);
            return false
        }
    };
    this.installEvent = async function() {
        if (c.parent.detection.isIframe()) {
            return
        }
        var e = await ProgressierForPromoOnly();
        if (e && !progressier["native"].standalone) {
            c.emit("installready")
        }
        var t = await c.installReady();
        if (t) {
            c.emit("installready", {
                detail: {
                    ios: t === "ios" ? true : false
                }
            })
        }
    };
    this.extractUrlFromString = function(e) {
        if (!e) {
            return null
        }
        var t = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g;
        var i = e.match(t);
        if (i && i[0]) {
            return i[0]
        }
        return null
    };
    this.getPotentialFile = function() {
        return new Promise(function(i, e) {
            try {
                var t = new URL(window.location.href);
                var n = t.searchParams.get("fileid");
                if (!n) {
                    return i(null)
                }
                var a = "progressiersharedfiles";
                var r = window.indexedDB.open(a, 1);
                r.onerror = function(e) {
                    return i(null)
                };
                r.onsuccess = function(e) {
                    var t = e.target.result;
                    t.transaction(a).objectStore(a).get(n).onsuccess = function(e) {
                        return i(e.target.result)
                    }
                }
            } catch (s) {
                return i(null)
            }
        })
    };
    this.shareEvent = async function() {
        try {
            var e = new URL(window.location.href);
            var t = {
                title: e.searchParams.get("title") || "",
                text: e.searchParams.get("text") || "",
                url: e.searchParams.get("url") || "",
                file: null
            };
            var i = await c.getPotentialFile() || null;
            if (i && i.title) {
                t.title = i.title
            }
            if (i && i.text) {
                t.text = i.text
            }
            if (i && i.url) {
                t.url = i.url
            }
            if (i && i.buffer) {
                t.file = new File([new Uint8Array(i.buffer)], i.filename || "file", {
                    type: i.type
                })
            }
            if (!t.url) {
                t.url = c.extractUrlFromString(t.text) || c.extractUrlFromString(t.title) || "";
                if (t.url === t.text) {
                    t.text = ""
                }
                if (t.url === t.title) {
                    t.title = ""
                }
            }
            if (!t.url && !t.title && !t.text && !t.file) {
                return
            }
            c.emit("webcontentshared", {
                detail: t
            })
        } catch (n) {
            console.log(n)
        }
    };
    this.init = function() {
        c.installEvent();
        c.shareEvent()
    };
    this.init()
}

function ProgressierBubbleData() {
    var o = this;
    this.email = null;
    this.searching = null;
    this.idSearch = "current-user-email";
    this.validEmail = function(e) {
        var t = /^[\w\+-\.]+@([\w-]+\.)+[\w-]{2,15}$/.test(e);
        return t
    };
    this.search = function() {
        try {
            if (!window.progressier || !window.progressier.data || !window.progressier.data.params || !window.progressier.data.params.hostingProvider) {
                return
            }
            if (window.progressier.data.params.hostingProvider !== "bubble" || !window.progressier.data.params.bubbleAutoSync) {
                clearInterval(o.searching);
                return
            }
            var e = window.localStorage || {};
            if (!e) {
                return
            }
            var t = null;
            for (var i in e) {
                if (!i.includes("_bubble_saved_email")) {
                    continue
                }
                if (!i.includes("_live")) {
                    continue
                }
                t = e[i]
            }
            var n = null;
            if (t) {
                var a = JSON.parse(t);
                n = a.email
            }
            if (!n) {
                var r = document.getElementById(o.idSearch);
                if (!r) {
                    return
                }
                n = r.textContent
            }
            if (!n) {
                return
            }
            if (!o.validEmail(n)) {
                return
            }
            if (o.email) {
                return
            }
            o.email = n;
            if (!window.progressier || !window.progressier.add) {
                return
            }
            window.progressier.add({
                email: o.email
            });
            clearInterval(o.searching)
        } catch (s) {}
    };
    this.init = function() {
        o.searching = setInterval(o.search, 1500);
        setInterval(async function() {
            if (!window.progressier || !window.progressier.add) {
                return
            }
            let e = document.getElementById("current-user-progressier-tags");
            if (!e) {
                return
            }
            let t = e.textContent;
            if (!t || window.currentUserTags === t) {
                return
            }
            window.currentUserTags = t;
            let i = window.currentUserTags.split(",");
            let n = [];
            i.forEach(function(e) {
                let t = e.trim();
                n.push(t)
            });
            progressier.add({
                tags: n
            })
        }, 1500)
    };
    this.init()
}

function ProgressierDetection() {
    var s = this;
    this.isAndroid = function() {
        try {
            var e = /Android/.test(window.navigator.userAgent);
            return e
        } catch (t) {
            return false
        }
    };
    this.isIOS = function() {
        try {
            var e = ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"];
            var t = e.includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
            return t
        } catch (i) {
            return false
        }
    };
    this.isMacOs = function() {
        try {
            return window.navigator.platform.toLowerCase().includes("mac") && !s.isIOS()
        } catch (e) {
            return false
        }
    };
    this.isWindows = function() {
        try {
            return window.navigator.platform.toLowerCase().includes("win")
        } catch (e) {
            return false
        }
    };
    this.isSafari = function() {
        try {
            return navigator.vendor && navigator.vendor.includes("Apple") && navigator.userAgent && !navigator.userAgent.includes("CriOS") && !navigator.userAgent.includes("FxiOS") && !navigator.userAgent.includes("EdgiOS")
        } catch (e) {
            return false
        }
    };
    this.isFirefox = function() {
        try {
            var e = navigator.userAgent.toLowerCase().includes("firefox");
            if (!e) {
                return false
            }
            var t = window.navigator.platform.toLowerCase();
            var i = t.includes("mac") || t.includes("win");
            if (!i) {
                return false
            }
            return true
        } catch (n) {
            return false
        }
    };
    this.isSamsungInternet = function() {
        try {
            return navigator.userAgent.toLowerCase().includes("samsungbrowser")
        } catch (e) {
            return false
        }
    };
    this.isChromeEdgeOnMacOs = function() {
        try {
            return navigator.vendor.toLowerCase().includes("google") && window.navigator.platform.toLowerCase().includes("mac")
        } catch (e) {
            return false
        }
    };
    this.isArc = function() {
        try {
            return getComputedStyle(document.documentElement).getPropertyValue("--arc-palette-title")
        } catch (e) {
            return false
        }
    };
    this.isEdge = function() {
        try {
            return window.navigator.userAgent.includes("Edge") || window.navigator.userAgent.includes("Edg/") || window.navigator.userAgent.includes("EdgiOS")
        } catch (e) {
            return false
        }
    };
    this.isChrome = function() {
        try {
            var e = window.navigator.userAgent.toLowerCase();
            var t = window.chrome || e.includes("chrome");
            if (!t) {
                return false
            }
            var i = s.isEdge();
            if (i) {
                return false
            }
            var n = e.includes("opr");
            if (n) {
                return false
            }
            var a = s.isArc();
            if (a) {
                return false
            }
            return true
        } catch (r) {
            return false
        }
    };
    this.isOpera = function() {
        try {
            return window.navigator.userAgent.toLowerCase().includes("opr")
        } catch (e) {
            return false
        }
    };
    this.supportsNativeiOSPush = function() {
        if (!window.webkit) {
            return false
        }
        if (!window.webkit.messageHandlers) {
            return false
        }
        if (!window.webkit.messageHandlers["progressier-requests-push-status"]) {
            return false
        }
        return true
    };
    this.appstore = function() {
        return s.supportsNativeiOSPush()
    };
    this.supportsPush = function() {
        if (s.supportsNativeiOSPush()) {
            return true
        }
        if (!window.PushManager) {
            return false
        }
        if (!navigator.serviceWorker) {
            return false
        }
        if (!window.Notification) {
            return false
        }
        return true
    };
    this.isFromTwitter = function() {
        if (s.definitelyNotTwitter) {
            return false
        }
        if (!s.isIOS() && !s.isAndroid()) {
            return false
        }
        if (s.isIOS() && !s.isSafari()) {
            return false
        }
        return document.referrer.includes("https://t.co") || window.location.href.includes("progressierreferrer=twitter")
    };
    this.isInAppBrowser = function() {
        try {
            var t = window.navigator.userAgent;
            var e = ["wv", "Line/", "FBAN", "FBBV", "FBAV", "FB_IAB", "Instagram", "MicroMessenger", "Twitter", "Kakao", "KAKAO"];
            var i = false;
            e.forEach(function(e) {
                if (!t.includes(e)) {
                    return
                }
                i = true
            });
            return i
        } catch (n) {
            return false
        }
    };
    this.isChromeOS = function() {
        try {
            return window.navigator.platform.toLowerCase().includes("linux") && window.navigator.userAgent.toLowerCase().includes("cros")
        } catch (e) {
            return false
        }
    };
    this.isDesktop = function() {
        try {
            if (s.isWindows()) {
                return true
            }
            if (s.isIOS()) {
                return false
            }
            if (s.isAndroid()) {
                return false
            }
            if (s.isMacOs()) {
                return true
            }
            if (s.isChromeOS()) {
                return true
            }
            return false
        } catch (e) {
            return false
        }
    };
    this.isSafariWithPushOnMacOs = function() {
        if (!s.isSafari()) {
            return false
        }
        if (!s.isMacOs()) {
            return false
        }
        if (!s.supportsPush()) {
            return false
        }
        return true
    };
    this.isSafariWithInstallationMacOS = function() {
        try {
            if (!s.isSafari()) {
                return false
            }
            if (!s.isMacOs()) {
                return false
            }
            var e = navigator.userAgent;
            var t = /Safari\//i.test(e);
            if (!t) {
                return false
            }
            var i = e.match(/Version\/(\d+)/i);
            if (i && i[1]) {
                var n = parseInt(i[1], 10);
                if (n >= 17) {
                    return true
                }
            }
            return false
        } catch (a) {
            return false
        }
    };
    this.canBePushPrompted = function() {
        if (!s.isIOS() && !s.isAndroid()) {
            return false
        }
        if (!s.supportsPush()) {
            return false
        }
        var e = Notification.permission;
        if (e === "denied" || e === "granted") {
            return false
        }
        return true
    };
    this.isStandalone = function() {
        try {
            if (window.location.href.includes("launchedfrom=homescreen") || window.sessionStorage.getItem("launched-from-homescreen")) {
                window.sessionStorage.setItem("launched-from-homescreen", true);
                return true
            }
        } catch (e) {}
        return navigator.standalone || window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches && (s.isAndroid() || s.isIOS()) || window.matchMedia("(display-mode: minimal-ui)").matches || window.matchMedia("(display-mode: window-controls-overlay)").matches
    };
    this.iosVersion = function() {
        if (!s.isIOS()) {
            return false
        }
        var e = navigator.userAgent;
        if (!/iP(hone|od|ad)/.test(e)) {
            return false
        }
        var t = e.match(/OS (\d+)_(\d+)_?(\d+)?/);
        if (!t || !t[1]) {
            return false
        }
        var i = parseFloat(t[1] + "." + (t[2] || 0));
        return i
    };
    this.recentiOS = function() {
        try {
            let e = s.iosVersion();
            if (!e) {
                return false
            }
            if (e < 16.7) {
                return false
            }
            let t = navigator.userAgent.match(/CriOS\/(\d+)/);
            if (!t) {
                return false
            }
            let i = parseInt(t[1], 10);
            if (i < 116) {
                return false
            }
            return true
        } catch (e) {
            return false
        }
    };
    this.isTWA = function() {
        if (!s.isAndroid()) {
            return false
        }
        if (!s.isStandalone()) {
            return false
        }
        try {
            if (document.referrer.startsWith("android-app://") || window.sessionStorage.getItem("opened-from-twa")) {
                window.sessionStorage.setItem("opened-from-twa", true);
                return true
            }
        } catch (e) {}
        return false
    };
    this.requiresInScopeSw = function() {
        try {
            if (s.isIOS()) {
                return false
            }
            if (s.isSafari()) {
                return false
            }
            if (s.isFirefox()) {
                return false
            }
            if (s.isOpera()) {
                return false
            }
            if (s.isArc()) {
                return false
            }
            if (s.isSamsungInternet()) {
                return true
            }
            let e = window.navigator.userAgent;
            let t = e.match(/Chrome\/(\d+)/);
            let i = parseInt(t[1]);
            if (i >= 111 && e.includes("Android")) {
                return false
            }
            if (i >= 114) {
                return false
            }
            return true
        } catch (e) {
            return true
        }
    };
    this.isIframe = function() {
        try {
            if (window.self !== window.top) {
                return true
            }
            return false
        } catch (e) {
            return true
        }
    };
    try {
        s.result = {};
        for (var e in s) {
            if (typeof s[e] !== "function") {
                continue
            }
            s.result[e] = s[e]()
        }
    } catch (t) {}
}

function ProgressierProtocol(e) {
    var o = this;
    this.parent = e;
    this.goToRightUrl = function() {
        var e = new URL(window.location.href).searchParams.get("pwaprotocolredirect");
        if (!e) {
            return
        }
        var t = e.split("//");
        let i = t[t.length - 1];
        var n = "https://" + i;
        try {
            new URL(n);
            if (!n.startsWith(window.location.origin)) {
                return
            }
            let e = new URL(window.location.href);
            e.searchParams["delete"]("pwaprotocolredirect");
            if (n === e.href) {
                return
            }
        } catch (a) {
            return
        }
        window.location.href = n
    };
    this.launchInstalledApp = async function() {
        if (o.parent["native"].standalone) {
            return
        }
        if (o.parent["native"].justInstalled) {
            return
        }
        if (o.parent.detection.isIOS()) {
            return
        }
        if (o.parent.detection.isSamsungInternet()) {
            return
        }
        if (o.parent.data.params.wrapperOnlyMode) {
            return
        }
        var e = "web+" + o.parent.data.params.customProtocol;
        var t = new URL(window.location.href);
        t.searchParams["delete"]("pswutlzoq");
        var i = t.href;
        if (o.parent.detection.isAndroid()) {
            if (!i.includes(o.parent.data.params.manifestJson.scope)) {
                return
            }
            var n = await o.parent["native"].installationStatus();
            var a = o.parent["native"].installed;
            if (!a) {
                return
            }
            window.open(i, "_blank")
        } else if (o.parent.detection.isDesktop()) {
            try {
                document.querySelectorAll("#protocol-detector").forEach(function(e) {
                    e.remove()
                });
                var r = document.createElement("iframe");
                r.setAttribute("id", "protocol-detector");
                r.setAttribute("src", "");
                r.setAttribute("style", "display:none !important;height:1px;width:1px;border:none;z-index:-1 !important;opacity:0 !important;visibility:hidden !important;");
                document.body.appendChild(r);
                r.contentWindow.location = e + "://" + i
            } catch (s) {
                console.log(s)
            }
        }
    };
    this.init = async function() {
        if (o.parent.detection.isIOS()) {
            return
        }
        o.goToRightUrl();
        await o.parent.data.waitForData()
    };
    this.init()
}

function ProgressierText(e) {
    var n = this;
    this.parent = e;
    this.cookieName = "progressier-language-preference";
    this.strings = {
        install: {
            en: "Install",
            fr: "Installer",
            es: "Instalar app",
            ru: "Установить",
            uk: "Встановити",
            it: "Installa",
            pt: "Instalar",
            sk: "Inštalovať",
            cs: "Instalovat",
            de: "App installieren",
            ja: "インストール",
            vi: "Cài đặt",
            sv: "Installera",
            bg: "Инсталирай",
            zh: "安裝",
            ko: "앱 설치",
            fi: "Asenna",
            nl: "Installeren",
            no: "Installer",
            tr: "Yükle",
            pl: "Instaluj",
            da: "Installér",
            sl: "Namesti",
            id: "Pasang",
            he: "התקנה",
            hr: "Instaliraj",
            hu: "Telepítés",
            ro: "Instalează",
            et: "Installi",
            ar: "تثبيت",
            hi: "ऐप इंस्टॉल करें",
            el: "Εγκατάσταση",
            max: 20
        },
        resetPermissions: {
            en: "How to reset notifications?",
            fr: "Comment réinitialiser les notifications?",
            es: "¿Cómo restablecer las notificaciones?",
            ru: "Как сбросить уведомления?",
            uk: "Як скинути сповіщення?",
            it: "Come reimpostare le notifiche?",
            pt: "Como redefinir notificações?",
            sk: "Ako obnoviť notifikácie?",
            cs: "Jak obnovit upozornění?",
            de: "Wie Benachrichtigungen zurücksetzen?",
            ja: "通知をリセットする方法は？",
            vi: "Làm thế nào để đặt lại thông báo?",
            sv: "Hur återställer man notifikationer?",
            bg: "Как да нулираме известията?",
            zh: "如何重置通知？",
            ko: "알림을 재설정하는 방법?",
            fi: "Kuinka nollata ilmoitukset?",
            nl: "Hoe meldingen te resetten?",
            no: "Hvordan tilbakestille varslinger?",
            tr: "Bildirimleri nasıl sıfırlarım?",
            pl: "Jak zresetować powiadomienia?",
            da: "Sådan nulstilles notifikationer?",
            sl: "Kako ponastaviti obvestila?",
            id: "Cara mengatur ulang notifikasi?",
            he: "איך לאפס התראות?",
            hr: "Kako resetirati obavijesti?",
            hu: "Hogyan állítsuk vissza az értesítéseket?",
            ro: "Cum să resetezi notificările?",
            et: "Kuidas lähtestada teavitusi?",
            ar: "كيفية إعادة تعيين الإشعارات؟",
            hi: "नोटिफिकेशन कैसे रीसेट करें?",
            el: "Πώς να επαναφέρετε τις ειδοποιήσεις;",
            max: 40
        },
        allowNotifications: {
            en: "Get notifications",
            fr: "Activer les notifications",
            es: "Permitir notificaciones",
            ru: "Получать уведомления",
            uk: "Отримувати сповіщення",
            it: "Ricevi notifiche",
            pt: "Receber notificações",
            sk: "Dostávať oznámenia",
            cs: "Dostávat oznámení",
            de: "Benachrichtigungen erhalten",
            ja: "通知オン",
            vi: "Nhận thông báo",
            sv: "Få notiser",
            bg: "Включи известия",
            zh: "獲得系統通知",
            ko: "알림을 받아보세요",
            fi: "Ilmoituksen käyttöön",
            nl: "Ontvang pushberichten",
            no: "Få varsler",
            tr: "Bildirim Al",
            pl: "Otrzymuj powiadomienia",
            da: "Få notifikationer",
            sl: "Dobi obvestila",
            id: "Dapatkan notifikasi",
            he: "קבלת התראות",
            hr: "Dobivaj obavijesti",
            hu: "Értesítések fogadása",
            ro: "Primește notificări",
            et: "Saa teavitusi",
            ar: "الحصول على الإشعارات",
            hi: "सूचनाएं प्राप्त करें",
            el: "Λάβετε ειδοποιήσεις",
            max: 40
        },
        installed: {
            en: "App installed",
            fr: "Application installée",
            es: "App instalada",
            ru: "Приложение установлено",
            uk: "Додаток встановлено",
            it: "App installata",
            pt: "App instalado",
            sk: "Aplikácia nainštalovaná",
            cs: "Aplikace nainstalována",
            de: "App installiert",
            ja: "アプリがインストールされました",
            vi: "Đã cài đặt ứng dụng",
            sv: "Appen är installerad",
            bg: "Приложението беше инсталирано",
            zh: "已安裝應用",
            ko: "앱 설치 완료",
            fi: "Asennettu",
            nl: "App geïnstalleerd",
            no: "Appen er installert",
            tr: "Uygulama yüklendi",
            pl: "Aplikacja zainstalowana",
            da: "App installeret",
            sl: "Aplikacija nameščena",
            id: "Aplikasi diinstal",
            he: "האפליקציה מותקנת",
            hr: "Aplikacija instalirana",
            hu: "Alkalmazás telepítve",
            ro: "Aplicație instalată",
            et: "Rakendus installitud",
            ar: "تم تثبيت التطبيق",
            hi: "ऐप इंस्टॉल हो गया",
            el: "Η εφαρμογή εγκαταστάθηκε",
            max: 30
        },
        tapToInstall: {
            en: "Tap to install",
            fr: "Appuyez pour installer",
            es: "Pulsa para instalar",
            ru: "Нажмите, чтобы установить",
            uk: "Торкніться, щоб встановити",
            it: "Tocca per installare",
            pt: "Toque para instalar",
            sk: "Klepnutím nainštalujete",
            cs: "Klepnutím nainstalujte",
            de: "Zum Installieren tippen",
            ja: "タップしてインストール",
            vi: "Nhấn để cài đặt",
            sv: " Kicka för att installera",
            bg: "Натиснете, за да инсталирате",
            zh: "點擊安裝",
            ko: "탭하여 설치하기",
            fi: "Napauta tästä asentaaksesi",
            nl: "Tik om te installeren",
            no: "Trykk for å installere",
            tr: "Yüklemek için tıkla",
            pl: "Naciśnij, aby zainstalować",
            da: "Tryk for installere",
            sl: "Tapnite za namestitev",
            id: "Ketuk untuk menginstal",
            he: "לחץ להתקנה",
            hr: "Pritisni za instalaciju",
            hu: "Koppints a telepítéshez",
            ro: "Apasă pentru a instala",
            et: "Puuduta installimiseks",
            ar: "انقر للتثبيت",
            hi: "इंस्टॉल करने के लिए टैप करें",
            el: "Πατήστε για εγκατάσταση",
            max: 35
        },
        launchTheApp: {
            en: "Launch the app",
            fr: "Lancer l'application",
            es: "Abrir app",
            ru: "Запустить приложение",
            uk: "Запустіть програму",
            it: "Avvia l'app",
            pt: "Iniciar o aplicativo",
            sk: "Spustite aplikáciu",
            cs: "Spusťte aplikaci",
            de: "App öffnen",
            ja: "アプリを起動します",
            vi: "Khởi chạy ứng dụng",
            sv: "Starta appen",
            bg: "Стартирайте приложението",
            zh: "啟動應用程序",
            ko: "앱 열기",
            fi: "Avaa Sovellus",
            nl: "Open de app",
            no: "Start appen",
            tr: "Uygulamayı başlat",
            pl: "Uruchom aplikację",
            da: "Åben denne app",
            sl: "Zaženi aplikacijo",
            id: "Luncurkan aplikasi",
            he: "הפעל את האפליקציה",
            hr: "Pokreni aplikaciju",
            hu: "Applikáció indítása",
            ro: "Deschide aplicația",
            et: "Ava rakendus",
            ar: "قم بتشغيل التطبيق",
            hi: "ऐप लॉन्च करें",
            el: "Εκκινήστε την εφαρμογή",
            max: 30
        },
        incompatible: {
            en: "Browser change required",
            fr: "Changement de navigateur requis",
            es: "Cambio de navegador requerido",
            ru: "Требуется изменение браузера",
            uk: "Потрібно змінити браузер",
            it: "È richiesta la modifica del browser",
            pt: "Mudança de navegador necessária",
            sk: "Vyžaduje sa zmena prehliadača",
            cs: "Je nutná změna prohlížeče",
            de: "Browserwechsel erforderlich",
            ja: "ブラウザの変更が必要",
            vi: "Yêu cầu thay đổi trình duyệt",
            sv: "Byte av webbläsare krävs",
            bg: "Изисква се промяна на браузъра",
            zh: "需要更改瀏覽器",
            ko: "브라우저 변경 필요",
            fi: "Selaimen vaihto vaaditaan",
            nl: "Browserwijziging vereist",
            no: "Nettleserbytte kreves",
            tr: "Tarayıcı değişikliği gerekli",
            pl: "Wymagana zmiana przeglądarki",
            da: "Det er nødvendigt, at du skifter til en anden browser",
            sl: "Potrebna je sprememba brskalnika",
            id: "Perlu perubahan browser",
            he: "נדרש שינוי דפדפן",
            hr: "Potrebna je promjena preglednika",
            hu: "Másik böngészőre van szükség",
            ro: "Schimbați motorul de căutare",
            et: "Vaheta brauserit",
            ar: "تغيير المتصفح مطلوب",
            hi: "ब्राउज़र परिवर्तन आवश्यक है",
            el: "Απαιτείται αλλαγή περιηγητή",
            max: 100
        },
        incompatibleFunctionality: {
            en: "Your current browser is not compatible with this functionality. Open this page with {X} to continue.",
            fr: "Votre navigateur actuel n'est pas compatible avec cette fonctionnalité. Ouvrez cette page avec {X} pour continuer.",
            es: "Este navegador no es compatible con esta funcionalidad. Intenta abrir esta página en {X}.",
            ru: "Похоже, ваш браузер несовместим с этой функцией. Попробуйте снова открыть эту страницу с помощью {X}.",
            uk: "Схоже, ваш браузер несумісний з цією функцією. Спробуйте знову відкрити цю сторінку за допомогою {X}.",
            it: "Sembra che il tuo browser non sia compatibile con questa funzionalità. Prova invece ad aprire di nuovo questa pagina con {X}.",
            pt: "Parece que seu navegador é incompatível com esta funcionalidade. Tente abrir esta página novamente com {X}.",
            sk: "Zdá sa, že váš prehliadač nie je kompatibilný s touto funkciou. Skúste namiesto toho otvoriť túto stránku znova pomocou {X}.",
            cs: "Zdá se, že váš prohlížeč není s touto funkcí kompatibilní. Zkuste místo toho otevřít tuto stránku znovu pomocí {X}.",
            de: "Anscheinend ist Ihr Browser nicht mit dieser Funktion kompatibel. Versuchen Sie stattdessen erneut, diese Seite mit {X} zu öffnen.",
            ja: "お使いのブラウザはこの機能と互換性がないようです。 代わりに{X}を使用してこのページをもう一度開いてみてください。",
            vi: "Có vẻ như trình duyệt của bạn không tương thích với chức năng này. Thay vào đó, hãy thử mở lại trang này bằng {X}.",
            sv: "Det verkar som om din webbläsare är inkompatibel med den här funktionen. Försök att öppna den här sidan igen med {X} istället.",
            bg: "Изглежда, че браузърът ви е несъвместим с тази функционалност. Опитайте да отворите тази страница отново с {X}.",
            zh: "您的瀏覽器似乎與此功能不兼容。 請嘗試使用 {X} 再次打開此頁面。",
            ko: "현재 브라우저에서는 본 기능을 사용할 수 없습니다. 대신 {X}으로 이 페이지를 다시 열어보세요.",
            fi: "Näyttää siltä, että selaimesi ei ole yhteensopiva tämän toiminnon kanssa. Yritä avata tämä sivu uudelleen käyttämällä {X}.",
            nl: "Het lijkt erop of deze browser niet compatibel is. Probeer om het in {X} te openen.",
            no: "Det ser ut til at nettleseren din er inkompatibel med denne funksjonaliteten. Prøv å åpne denne siden igjen med {X} i stedet.",
            tr: "Tarayıcınız bu işlevle uyumlu değil gibi görünüyor. Bunun yerine bu sayfayı {X} ile tekrar açmayı deneyin.",
            pl: "Twoja przeglądarka nie obsługuje tej funkcji. Otwórz tę stronę za pomocą {X}, aby kontynuować.",
            da: "Din nuværende browser er ikke kompatibel med denne funktionalitet. Åben denne side med {X} for at fortsætte.",
            sl: "Vaš trenutni brskalnik ni združljiv s to funkcijo. Za nadaljevanje odprite to stran z {X}.",
            id: "Browser Anda saat ini tidak kompatibel dengan fungsi ini. Buka halaman ini dengan {X} untuk melanjutkan.",
            he: "הדפדפן הנוכחי שלך אינו תואם לפונקציונליות זו. פתח את הדף הזה עם {X} כדי להמשיך.",
            hr: "Vaš trenutni preglednik nije kompatibilan s ovom funkcijom. Otvorite ovu stranicu s {X} za nastavak.",
            hu: "A jelenlegi böngésződ nem támogatja ezt a szolgáltatást. Nyisd meg ezt az oldalt {X}, hogy folytasd",
            ro: "Acest browser nu este compatibil cu această funcționalitate. Deschideți această pagină cu {X} pentru a continua.",
            et: "Sinu praegune brauser ei ole ühilduv. Jätkamiseks ava see leht brauseriga {X}.",
            ar: "متصفحك الحالي غير متوافق مع هذه الخدمة . افتح هذه الصفحة باستخدام {X} للمتابعة.",
            hi: "आपका वर्तमान ब्राउज़र इस कार्यक्षमता के अनुकूल नहीं है. जारी रखने के लिए इस पेज को {X} से खोलें।",
            el: "Ο τρέχων περιηγητής σας δεν είναι συμβατός με αυτή τη λειτουργία. Ανοίξτε αυτήν τη σελίδα με τον {X} για να συνεχίσετε.",
            max: 400
        },
        subscribed: {
            en: "Notifications enabled",
            fr: "Notifications activées",
            es: "Notificaciones habilitadas",
            ru: "Уведомления включены",
            uk: "Сповіщення ввімкнено",
            it: "Notifiche abilitate",
            pt: "Notificações ativadas",
            sk: "Upozornenia sú povolené",
            cs: "Oznámení povolena",
            de: "Benachrichtigungen aktiviert",
            ja: "通知を許可しました",
            vi: "Đã bật thông báo",
            sv: "Aviseringar aktiverade",
            bg: "Известията са активирани",
            zh: "已啟用通知",
            ko: "알림이 활성화되었습니다",
            fi: "Ilmoitukset sallittu",
            nl: "Meldingen ingeschakeld",
            no: "Varsler aktivert",
            tr: "Bildirimler etkinleştirildi",
            pl: "Powiadomienia włączone",
            da: "Notifikationer aktiveret",
            sl: "Obvestila omogočena",
            id: "Notifikasi diaktifkan",
            he: "התראות מופעלות",
            hr: "Obavijesti omogućene",
            hu: "Értesítések engedélyezve",
            ro: "Notificări activate",
            et: "Märguanded on lubatud",
            ar: "تم تمكين الإخطارات",
            hi: "सूचनाएं सक्षम हैं",
            el: "Οι ειδοποιήσεις ειναι ενεργές",
            max: 30
        },
        allowedNotificationsFrom: {
            en: "This app can send you push notifications.",
            fr: "Cette application peut vous envoyer des notifications push.",
            es: "Esta app te puede enviar notificaciones.",
            ru: "Вы разрешили этому приложению отправлять вам push-уведомления.",
            uk: "Ви дозволили цьому додатку надсилати вам push-сповіщення.",
            it: "Hai autorizzato questa app a inviarti notifiche push.",
            pt: "Você autorizou este aplicativo a enviar notificações push.",
            sk: "Autorizovali ste túto aplikáciu, aby vám posielala upozornenia push.",
            cs: "Povolili jste této aplikaci, aby vám zasílala oznámení push.",
            de: "Sie haben diese App autorisiert, Ihnen Push-Benachrichtigungen zu senden.",
            ja: "このアプリがプッシュ通知を送信することを承認しました。",
            vi: "Bạn đã cho phép ứng dụng này gửi thông báo đẩy cho bạn.",
            sv: "Du har auktoriserat den här appen att skicka push-meddelanden till dig.",
            bg: "Упълномощихте това приложение да ви изпраща насочени известия.",
            zh: "您已授權此應用向您發送推送通知。",
            ko: "알림 수신에 동의하셨습니다.",
            fi: "Olet valtuuttanut tämän sovelluksen lähettämään sinulle push-ilmoituksia.",
            nl: "Je hebt deze app geautoriseerd om pushmeldingen te sturen.",
            no: "Du har autorisert denne appen til å sende deg push-varsler.",
            tr: "Bu uygulamaya, size anında iletme bildirimleri göndermesi için yetki verdiniz.",
            pl: "Ta aplikacja została przez Ciebie zezwolona na wysyłanie Ci powiadomień push.",
            da: "Du har autoriseret denne app til at sende dig push notifikationer.",
            sl: "To aplikacijo ste pooblastili, da vam pošilja potisna obvestila.",
            id: "Anda telah mengotorisasi aplikasi ini untuk mengirimi Anda pemberitahuan push.",
            he: "אישרת לאפליקציה הזו לשלוח לך הודעות דחיפה.",
            hr: "Ovlastili ste ovu aplikaciju da vam šalje push obavijesti.",
            hu: "Engedélyezted ennek az alkalmazásnak, hogy értesítéseket küldjön neked.",
            ro: "Ati autorizat aplicația să vă trimită notificări.",
            et: "Andsid sellele rakendusele loa saata sulle teavitusi.",
            ar: "لقد سمحت لهذا التطبيق بإرسال إشعارات إليك.",
            hi: "यह ऐप आपको पुश नोटिफिकेशन भेज सकता है।",
            el: "Αυτή η εφαρμογή μπορεί να σας στέλνει ειδοποιήσεις push.",
            max: 250
        },
        sendTestNotification: {
            en: "Send test notification",
            fr: "Envoyer une notification de test",
            es: "Enviar notificación de prueba",
            ru: "Отправить тестовое уведомление",
            uk: "Надіслати тестове повідомлення",
            it: "Invia notifica di prova",
            pt: "Enviar notificação de teste",
            sk: "Poslať testovacie oznámenie",
            cs: "Odeslat testovací oznámení",
            de: "Testbenachrichtigung senden",
            ja: "テスト通知を送信",
            vi: "Gửi thông báo thử nghiệm",
            sv: "Skicka testnotifikation",
            bg: "Изпрати тестово известие",
            zh: "發送測試通知",
            ko: "테스트 알림 보내기",
            fi: "Lähetä testi-ilmoitus",
            nl: "Testmelding versturen",
            no: "Send testvarsel",
            tr: "Test bildirimi gönder",
            pl: "Wyślij powiadomienie testowe",
            da: "Send testnotifikation",
            sl: "Pošlji testno obvestilo",
            id: "Kirim notifikasi tes",
            he: "שלח הודעת ניסיון",
            hr: "Pošalji testnu obavijest",
            hu: "Teszt értesítés küldése",
            ro: "Trimite notificare de test",
            et: "Saada testteade",
            ar: "إرسال إشعار تجريبي",
            hi: "परीक्षण अधिसूचना भेजें",
            el: "Στείλτε δοκιμαστική ειδοποίηση",
            max: 100
        },
        manageNotifications: {
            en: "Manage notifications",
            fr: "Gérer les notifications",
            es: "Administrar notificaciones",
            ru: "Управление уведомлениями",
            uk: "Керувати сповіщеннями",
            it: "Gestisci le notifiche",
            pt: "Gerenciar notificações",
            sk: "Spravovať upozornenia",
            cs: "Spravujte oznámení",
            de: "Benachrichtigungen verwalten",
            ja: "通知を管理する",
            vi: "Quản lý thông báo",
            sv: "Hantera aviseringar",
            bg: "Управление на известията",
            zh: "管理通知",
            ko: "알림 관리",
            fi: "Hallinnoi ilmoituksia",
            nl: "Meldingen beheren",
            no: "Administrer varsler",
            tr: "Bildirimleri yönet",
            pl: "Zarządzaj powiadomieniami",
            da: "Administrer notifikationer",
            sl: "Upravljanje obvestil",
            id: "Kelola notifikasi",
            he: "נהל התראות",
            hr: "Upravljaj obavijestima",
            hu: "Értesítések kezelése",
            ro: "Control notificări",
            et: "Halda teavitusi",
            ar: "إدارة الإشعارات",
            hi: "सूचनाएं प्रबंधित करें",
            el: "Διαχείριση ειδοποιήσεων",
            max: 40
        },
        blocked: {
            en: "Notifications blocked",
            fr: "Notifications bloquées",
            es: "Notificaciones bloqueadas",
            ru: "Уведомления заблокированы",
            uk: "Сповіщення заблоковано",
            it: "Notifiche bloccate",
            pt: "Notificações bloqueadas",
            sk: "Upozornenia sú blokované",
            cs: "Oznámení blokována",
            de: "Benachrichtigungen blockiert",
            ja: "通知がブロックされました",
            vi: "Thông báo bị chặn",
            sv: "Notiser blockerade",
            bg: "Известията са блокирани",
            zh: "通知被阻止",
            ko: "알림 수신이 거부되었습니다",
            fi: "Ilmoitukset ovat estetty",
            nl: "Pushberichten geblokkeerd",
            no: "Varslinger er blokkert",
            tr: "Bildirimler engellendi",
            pl: "Powiadomienia zablokowane",
            da: "Notifikationer er blokeret",
            sl: "Obvestila blokirana",
            id: "Notifikasi diblokir",
            he: "הודעות נחסמו",
            hr: "Obavijesti blokirane",
            hu: "Értesítések blokkolva",
            ro: "Notificări blocate",
            et: "Teavitused blokeeritud",
            ar: "تم حظر الإشعارات",
            hi: "सूचनाएं अवरुद्ध कर दी गई हैं",
            el: "Οι ειδοποιήσεις έχουν αποκλειστεί",
            max: 35
        },
        installFinished: {
            en: "Tap on {X} in the URL bar to launch the app",
            fr: "Appuyez sur {X} dans la barre d'URL pour lancer l'application",
            es: "Para abrir la app, pulsa {X} en la barra de URL",
            ru: "Нажмите на {X} чтобы запустить приложение",
            uk: "Натисніть {X} щоб запустити додаток",
            it: "Tocca {X} nella barra degli indirizzi per avviare l'app",
            pt: "Toque em {X} na barra de URL para iniciar o aplicativo",
            sk: "Aplikáciu spustíte klepnutím na {X}",
            cs: "Klepnutím na {X} spustíte aplikaci",
            de: "Tippen Sie auf {X} um die App zu starten",
            ja: "{X}をタップしてアプリを起動します",
            vi: "Nhấn vào {X} để khởi chạy ứng dụng",
            sv: "Klicka på {X} för att starta appen",
            bg: "Натиснете на {X} за да стартирате приложението",
            zh: "點擊 URL 欄中的 {X} 以啟動應用程序",
            ko: "URL바에서 {X}를(을) 눌러 앱을 실행하세요",
            fi: "Käynnistä sovellus napauttamalla URL-palkissa {X}",
            nl: "Klik op de {X} in de URL-balk om de app te openen",
            no: "Trykk på {X} i URL-linjen for å starte appen",
            tr: "Uygulamayı başlatmak için URL çubuğunda {X} üzerine dokunun",
            pl: "Stuknij w {X} na pasku adresu URL, aby uruchomić aplikację",
            da: "Tryk på {X} i URL baren for at åbne denne app",
            sl: "Dotaknite se {X} v URL vrstici, da zaženete aplikacijo",
            id: "Ketuk {X} di bilah URL untuk meluncurkan aplikasi",
            he: "הקש על {X} בסרגל הכתובות כדי להפעיל את האפליקציה",
            hr: "Dodirnite {X} na adresnoj traci za pokretanje aplikacije",
            hu: "Az alkalmazás elindításához koppints a {X}-ra az URL sávon.",
            ro: "Apăsați pe {X} în bara URL pentru a deschide aplicația",
            et: "Rakenduse avamiseks puuduta aadressiribal {X}",
            ar: "اضغط على {X} في شريط URL لتشغيل التطبيق",
            hi: "ऐप लॉन्च करने के लिए यूआरएल बार में {X} पर टैप करें",
            el: "Πατήστε στο {X} στη γραμμή διευθύνσεων για να εκκινήσετε την εφαρμογή",
            max: 120
        },
        openFromHome: {
            en: "Look for the {X} icon on your home screen",
            fr: "Cherchez l'icône {X} sur votre écran d'accueil",
            es: "Busca el ícono {X} en tu pantalla de inicio",
            ru: "Откройте приложение {X} с главного экрана",
            uk: "Відкрийте програму {X} на головному екрані",
            it: "Apri l'app {X} dalla schermata iniziale",
            pt: "Procure o ícone {X} na tela inicial",
            sk: "Otvorte aplikáciu {X} z domovskej obrazovky",
            cs: "Otevřete aplikaci {X} z domovské obrazovky",
            de: "Öffnen Sie die {X}-App von Ihrem Home-Bildschirm aus",
            ja: "ホーム画面から{X}アプリを開きます",
            vi: "Mở ứng dụng {X} từ màn hình chính của bạn",
            sv: "Öppna {X}-appen från hemskärmen",
            bg: "Отворете приложението {X} от началния екран",
            zh: "從主屏幕打開 {X} 應用程序",
            ko: "홈스크린에서 {X} 아이콘을 찾으세요",
            fi: "Etsi aloitusnäytöltäsi kuvake {X}",
            nl: "Ga naar het {X} icoon op je home scherm",
            no: "Se etter {X}-ikonet på startskjermen",
            tr: "Ana ekranınızda {X} simgesini bulun",
            pl: "Poszukaj ikony {X} na ekranie głównym",
            da: "Kig efter {X} ikonet på din hjemmeskærm",
            sl: "Na domačem zaslonu poiščite ikono {X}",
            id: "Cari ikon {X} di layar utama Anda",
            he: "חפש את הסמל {X} במסך הבית שלך",
            hr: "Potražite ikonu {X} na početnom zaslonu",
            hu: "Keresd meg a {X} ikont a kezdőképernyődön.",
            ro: "Găsiți iconița {X} pe ecranul principal",
            et: "Otsi oma avakuvalt üles ikoon {X}",
            ar: "ابحث عن الرمز {X} على شاشتك الرئيسية",
            hi: "अपनी होम स्क्रीन पर {X} आइकन देखें",
            el: "Αναζητήστε το εικονίδιο {X} στην αρχική σας οθόνη",
            max: 120
        },
        openPermissionsPush: {
            en: "Tap on {X} in the URL bar to allow notifications",
            fr: "Appuyez sur {X} dans la barre d'URL pour autoriser les notifications",
            es: "Para permitir notificaciones, pulsa {X} en la barra de URL",
            ru: "Нажмите на {X} в строке URL, чтобы разрешить уведомления",
            uk: "Натисніть {X} у рядку URL, щоб дозволити сповіщення",
            it: "Tocca {X} nella barra degli indirizzi per consentire le notifiche",
            pt: "Toque em {X} na barra de URL para permitir notificações",
            sk: "Klepnutím na {X} na paneli s adresou URL povolíte upozornenia",
            cs: "Klepnutím na {X} v adresním řádku povolíte oznámení",
            de: "Tippen Sie auf {X} in der URL-Leiste, um Benachrichtigungen zuzulassen",
            ja: "通知を許可するには、URLバーの{X}をタップします",
            vi: "Nhấn vào {X} trong thanh URL để cho phép thông báo",
            sv: "Klicka på {X} i adressfönstret för att tillåta noiser",
            bg: "Натиснете на {X} в адресния бар, за да разрешите известия",
            zh: "點擊 URL 欄中的 {X} 以允許通知",
            ko: "URL 바에서 {X}를(을) 눌러 알림수신을 허용하세요",
            fi: "Salli ilmoitukset napauttamalla {X} URL-palkissa",
            nl: "Klik op {X} in de adresbalk om meldingen toe te staan",
            no: "Trykk på {X} i URL-linjen for å tillate varsler",
            tr: "Bildirimlere izin vermek için URL çubuğunda {X} üzerine dokunun",
            pl: "Stuknij w {X} na pasku adresu URL, aby zezwolić na powiadomienia",
            da: "Tryk på {X} i URL baren for at tillade notifikationer",
            sl: "Dotaknite se {X} v URL vrstici, da omogočite obvestila",
            id: "Ketuk {X} di bilah URL untuk mengizinkan pemberitahuan",
            he: "הקש על {X} בסרגל הכתובות כדי לאפשר התראות",
            hr: "Dodirnite {X} na adresnoj traci da omogućite obavijesti",
            hu: "Az értesítések engedélyezéséhez koppints a {X}-ra az URL sávon.",
            ro: "Apăsați pe {X} în bara URL pentru a permite notificări",
            et: "Teavituste lubamiseks puuduta aadressiribal nuppu {X}",
            ar: "اضغط على {X} في شريط URL للسماح بالإشعارات",
            hi: "सूचनाओं की अनुमति देने के लिए यूआरएल बार में {X} पर टैप करें",
            el: "Πατήστε στο {X} στη γραμμή διευθύνσεων για να επιτρέψετε τις ειδοποιήσεις.",
            max: 120
        },
        tapOn: {
            en: "Tap on {X} in the browser menu",
            fr: "Appuyez sur l'icône {X} de votre navigateur",
            es: "Pulsa {X} en la barra de menús",
            ru: "Нажать на {X} панели вкладок.",
            uk: "Торкніться {X} на панелі вкладок",
            it: "Tap su {X} nella barra delle schede",
            pt: "Toque em {X} no menu do navegador",
            sk: "Klepnite na {X}",
            cs: "Klepněte na {X}",
            de: "Tippen Sie auf {X}",
            ja: "{X}をタップします",
            vi: "Nhấn vào {X}",
            sv: "Klicka på {X}",
            bg: "Натиснете на {X}",
            zh: "點擊 {X}",
            ko: "{X}를(을) 누르세요",
            fi: "Napauta {X}",
            nl: "Klik op {X}",
            no: "Trykk på {X} i fanelinjen",
            tr: "Sekme çubuğunda {X} üzerine dokunun",
            pl: "Stuknij w {X} na pasku kart",
            da: "Tryk på {X} i fane baren",
            sl: "Dotaknite se {X} v zavihkih",
            id: "Ketuk {X} di bilah tab",
            he: "הקש על {X} בסרגל הכרטיסיות",
            hr: "Dodirnite {X} na traci s karticama",
            hu: "Koppints a {X}-ra a menüben.",
            ro: "Apăsați {X} în meniul browserului",
            et: "Puuduta brauseri menüüs nuppu {X}",
            ar: "اضغط على {X} في قائمة المتصفح",
            hi: "ब्राउज़र मेनू में {X} पर टैप करें",
            el: "Πατήστε στο {X} στο browser μενού",
            max: 35
        },
        tapOnUrl: {
            en: "Tap on {X} in the URL bar",
            fr: "Appuyez sur {X} dans la barre d'URL",
            es: "Pulsa {X} en la barra de URL",
            ru: "Нажмите на {X} в адресной строке",
            uk: "Натисніть {X} у рядку URL",
            it: "Tocca {X} nella barra degli indirizzi",
            pt: "Toque em {X} na barra de URL",
            sk: "Klepnite na {X} na paneli s adresou URL",
            cs: "Klepněte na {X} v adresním řádku",
            de: "Tippen Sie auf {X} in der URL-Leiste",
            ja: "URLバーの{X}をタップします",
            vi: "Nhấn vào {X} trong thanh URL",
            sv: "Klicka på {X} i adressfönstret",
            bg: "Натиснете на {X} в адресния бар",
            zh: "點擊網址欄中的 {X}",
            ko: "URL바에서 {X}를 누르세요",
            fi: "Napauta {X} URL-palkissa",
            nl: "Klik op {X} in de adresbalk",
            no: "Trykk på {X} i URL-linjen",
            tr: "URL çubuğunda {X} üzerine dokunun",
            pl: "Stuknij w {X} na pasku adresu",
            da: "Tryk på {X} i URL baren",
            sl: "Dotaknite se {X} v URL vrstici",
            id: "Ketuk {X} di bilah URL",
            he: "הקש על {X} בסרגל הכתובות",
            hr: "Dodirnite {X} na adresnoj traci",
            hu: "Koppints a {X}-ra az URL sávon.",
            ro: "Apăsați pe {X} în bara URL",
            et: "Puuduta aadressiribal nuppu {X}",
            ar: "اضغط على {X} في شريط URL",
            hi: "यूआरएल बार में {X} पर टैप करें",
            el: "Πατήστε στο {X} στη γραμμή διευθύνσεων",
            max: 40
        },
        cantSeeSam: {
            en: "Can't see the icon in your URL bar? Open this page with Chrome instead.",
            fr: "Si vous ne voyez pas l'icône dans votre barre d'URL, essayez plutôt d'ouvrir cette page avec Chrome.",
            es: "Si no puedes ver el ícono en la barra de URL, intenta abrir esta página en Chrome.",
            ru: "Если вы не видите значок в строке URL-адреса, попробуйте вместо этого открыть эту страницу в Chrome",
            uk: "Якщо ви не бачите значок у рядку URL -адреси, спробуйте відкрити цю сторінку за допомогою Chrome",
            it: "Se non riesci a vedere l'icona nella barra degli indirizzi, prova invece ad aprire questa pagina con Chrome",
            pt: "Se você não consegue ver o ícone na barra de URL, tente abrir esta página com o Chrome",
            sk: "Ak sa vám ikona na paneli s adresou URL nezobrazuje, skúste namiesto toho otvoriť túto stránku v prehliadači Chrome",
            cs: "Pokud se vám v adresním řádku nezobrazuje ikona, zkuste místo toho otevřít tuto stránku pomocí prohlížeče Chrome",
            de: "Wenn Sie das Symbol in Ihrer URL-Leiste nicht sehen können, versuchen Sie, diese Seite stattdessen mit Chrome zu öffnen",
            ja: "URLバーにアイコンが表示されない場合は、代わりにChromeでこのページを開いてみてください",
            vi: "Nếu bạn không thể thấy biểu tượng trên thanh URL của mình, hãy thử mở trang này bằng Chrome",
            sv: "Om du inte kan se ikonen i adressfönstret så testa att öppna sidan i Chrome istället",
            bg: "Ако не можете да видите иконката в адресния бар опитайте с Chrome",
            zh: "如果您在網址欄中看不到該圖標，請嘗試使用 Chrome 打開此頁面",
            ko: "만약 URL바에서 해당 아이콘을 찾을 수 없으면 크롬 브라우저에서 본 페이지를 다시 여세요",
            fi: "Jos et näe kuvaketta URL-palkissasi, yritä avata tämä sivu Chromella",
            nl: "Als je het pictogram niet in je adresbalk ziet, probeer dan deze pagina te openen met Chrome",
            no: "Hvis du ikke kan se ikonet i nettadresselinjen, kan du prøve å åpne denne siden med Chrome i stedet",
            tr: "URL çubuğunuzda simgeyi göremiyorsanız, bunun yerine bu sayfayı Chrome ile açmayı deneyin.",
            pl: "Jeśli nie widzisz ikony na pasku adresu URL, spróbuj zamiast tego otworzyć tę stronę w Chrome",
            da: "Hvis du ikke kan se ikonet i URL baren, kan du i stedet prøve at åbne denne side med Chrome",
            sl: "Če ne vidite ikone v vrstici URL, poskusite to stran odpreti s Chromom",
            id: "Jika Anda tidak dapat melihat ikon di bilah URL, coba buka laman ini dengan Chrome",
            he: "אם אינך יכול לראות את הסמל בסרגל הכתובות שלך, נסה לפתוח את הדף הזה עם Chrome במקום זאת",
            hr: "Ako ne možete vidjeti ikonu na adresnoj traci, pokušajte otvoriti ovu stranicu u pregledniku Chrome",
            hu: "Ha nem látod az ikont az URL sávban, próbáld meg ezt az oldalt a Chrome böngészővel megnyitni helyette",
            ro: "Dacă nu vedeți iconița în bara URL, încercați să deschideți pagina cu Chrome.",
            et: "Kui sa enda aadressiribal seda ikooni ei näe, proovi avada leht Chrome‘iga.",
            ar: "إذا لم تتمكن من رؤية الرمز في شريط URL، فحاول فتح هذه الصفحة باستخدام Chrome بدلاً من ذلك.",
            hi: "यदि आप अपने यूआरएल बार में आइकन नहीं देख पा रहे हैं, तो इसके बजाय क्रोम के साथ इस पेज को खोलने का प्रयास करें।",
            el: "Δεν βλέπετε το εικονίδιο στη γραμμή διευθύνσεων; Ανοίξτε αυτήν τη σελίδα με το Chrome.",
            max: 140
        },
        addToHomeScreen: {
            en: "Add to Home Screen",
            fr: "Sur l'écran d'accueil",
            es: "Añadir a pantalla de inicio",
            ru: "на экран «Домой»",
            uk: "На Початковий екран",
            it: "Aggiungi alla schermata Home",
            pt: "Adicionar à Tela de Início",
            sk: "Pridať na plochu",
            cs: "Přidat na plochu",
            de: "Zum Home-Bildschirm",
            ja: "ホーム画面に追加",
            vi: "Thêm vào MH chính",
            sv: "Lägg till på hemskärmen",
            bg: "Добави в Начален екран",
            zh: "加入主畫面",
            ko: "홈 화면에 추가",
            fi: "Lisää Koti-valikkoon",
            nl: "Zet op beginscherm",
            no: "Legg til på Hjem-skjerm",
            tr: "Ana Ekrana Ekle",
            pl: "Do ekranu początk",
            da: "Føj til hjemmeskærm",
            sl: "Dodaj na začetni zaslon",
            id: "Tambahkan ke Layar Utama",
            he: "הוספה למסך הבית",
            hr: "Dodaj na početni zaslon",
            hu: "Főképernyőhöz adás",
            ro: "Adăugați la ecranul principal",
            et: "Add to Home Screen",
            ar: "أضف إلى الشاشة الرئيسية",
            hi: "होम स्क्रीन पर जोड़ें",
            el: "Προσθήκη στην οθόνη Αφετηρίας",
            max: 50
        },
        scrollAndSelect: {
            en: "Scroll down and select {X}",
            fr: "Scrollez et sélectionnez {X}",
            es: "Desplázate hacia abajo y selecciona {X}",
            ru: "Прокрутите и выберите {X}",
            uk: "Прокрутіть і виберіть {X}",
            it: "Scorri e seleziona {X}",
            pt: "Role e selecione {X}",
            sk: "Prejdite a vyberte {X}",
            cs: "Přejděte a vyberte {X}",
            de: "Blättern Sie und wählen Sie {X}",
            ja: "スクロールして{X}を選択します",
            vi: "Cuộn và chọn {X}",
            sv: "Bläddra och välj {X}",
            bg: "Превъртете и изберете {X}",
            zh: "滾動並選擇 {X}",
            ko: "스크롤하여 {X}를 선택합니다",
            fi: "Vieritä ja valitse {X}",
            nl: "Scroll en selecteer {X}",
            no: "Rull og velg {X}",
            tr: "Kaydırın ve {X}'i seçin",
            pl: "Przewiń i wybierz {X}",
            da: "Scoll og vælg {X}",
            sl: "Pomaknite se in izberite {X}",
            id: "Gulir ke bawah dan pilih {X}",
            he: "גלול מטה ובחר {X}",
            hr: "Pomaknite se prema dolje i odaberite {X}",
            hu: "Görgess lefelé, majd válaszd ki a {X}-t",
            ro: "Rulați mai jos și selectează {X}",
            et: "Keri alla ja vali {X}",
            ar: "قم بالتمرير لأسفل وحدد {X}",
            hi: "नीचे स्क्रॉल करें और {X} चुनें",
            el: "Κάντε κύλιση προς τα κάτω και επιλέξτε {X}",
            max: 40
        },
        select: {
            en: "Select {X}",
            fr: "Sélectionnez {X}",
            es: "Selecciona {X}",
            ru: "Выбрать {X}",
            uk: "Оберіть {X}",
            it: "Seleziona {X}",
            pt: "Selecione {X}",
            sk: "Vyberte {X}",
            cs: "Vyberte {X}",
            de: "Wählen Sie {X}",
            ja: "{X}選択する",
            vi: "Chọn {X}",
            sv: "Välj {X}",
            bg: "изберете {X}",
            zh: "選擇 {X}",
            ko: "{X}를(을) 선택하세요",
            fi: "Valitse {X}",
            nl: "Selecteer {X}",
            no: "Velg {X}",
            tr: "{X}'i seçin",
            pl: "Wybierz {X}",
            da: "Vælg {X}",
            sl: "Izberi {X}",
            id: "Pilih {X}",
            he: "בחר {X}",
            hr: "Odaberite {X}",
            hu: "{X} kiválasztása",
            ro: "Selectează {X}",
            et: "Vali {X}",
            ar: "حدد {X}",
            hi: "{X} चुनें",
            el: "Επιλέξτε {X}",
            max: 30
        },
        installTheApp: {
            en: "Install the app",
            fr: "Installez l'application",
            es: "Instala la app",
            ru: "Установите приложение",
            uk: "Встановіть додаток",
            it: "Installa l'app",
            pt: "Instale o aplicativo",
            sk: "Nainštalujte si aplikáciu",
            cs: "Nainstalujte si aplikaci",
            de: "App installieren",
            ja: "アプリをインストールします",
            vi: "Cài đặt ứng dụng",
            sv: "Installera appen",
            bg: "Инсталирай приложението",
            zh: "安裝應用程序",
            ko: "앱 설치하기",
            fi: "Asenna sovellus",
            nl: "Installeer de app",
            no: "Installer appen",
            tr: "Uygulamayı yükle",
            pl: "Zainstaluj aplikację",
            da: "Installér denne app",
            sl: "Namesti aplikacijo",
            id: "Install app",
            he: "התקן אפליקציה",
            hr: "Instaliraj aplikaciju",
            hu: "Applikáció telepítése",
            ro: "Instalează aplicația",
            et: "Installi rakendus",
            ar: "تثبيت التطبيق",
            hi: "एप्लिकेशन इंस्टॉल करें",
            el: "Εγκαταστήστε την εφαρμογή",
            max: 40
        },
        installApp: {
            en: "Add to Home screen",
            fr: "Ajouter à l'écran d'accueil",
            es: "Añadir a la pantalla principal",
            zh: "加到主畫面",
            it: "Aggiungi a schermata Home",
            pt: "Adicionar à tela inicial",
            id: "Tambahkan ke Layar utama",
            de: "Zum Startbildschirm hinzufügen",
            no: "Legg til på startsiden",
            nl: "Toevoegen aan startscherm",
            hu: "Kezdőképernyőre",
            da: "Føj til startskærm",
            tr: "Ana ekrana ekle",
            fi: "Lisää aloitusnäyttöön",
            vi: "Thêm vào Màn hình chính",
            sv: "Lägg till på startskärmen",
            pl: "Dodaj do ekranu głównego",
            el: "Προσθήκη στην αρχική οθόνη",
            ro: "Adaugă pe ecran pornire",
            cs: "Přidat na plochu",
            sk: "Pridať na plochu",
            sl: "Dodajanje na začetni zaslon",
            hr: "Dodaj na početni zaslon",
            et: "Avaekraanile lisamine",
            ar: "إضافة إلى الشاشة الرئيسية",
            he: "הוסף למסך הבית",
            ru: "Добавить на главный экран",
            uk: "Додати на головний екран",
            ja: "ホーム画面に追加",
            bg: "Добави в началния екран",
            ko: "홈 화면에 추가",
            hi: "होम स्क्रीन में जोड़ें",
            max: 40
        },
        youreOffline: {
            en: "You're offline...",
            fr: "Vous êtes hors-ligne...",
            es: "¡No tienes conexión a internet!",
            ru: "Ты не в сети!",
            uk: "Ви офлайн!",
            it: "Sei offline...",
            pt: "Você está offline...",
            sk: "Ste offline!",
            cs: "Jste offline!",
            de: "Sie sind offline...",
            ja: "オフライン状態です",
            vi: "Bạn đang ngoại tuyến ...",
            sv: "Du är offline...",
            bg: "Вие сте офлайн",
            zh: "你下線了...",
            ko: "연결이 끊어졌습니다...",
            fi: "Olet offline-tilassa...",
            nl: "Je bent offline...",
            no: "Du er frakoblet...",
            tr: "Çevrimdışısınız...",
            pl: "Jesteś offline...",
            da: "Du er offline...",
            sl: "Nisi povezan s spletom...",
            id: "Anda offline...",
            he: "אתה במצב לא מקוון...",
            hr: "Niste povezani s internetom...",
            hu: "Offline vagy",
            ro: "Nu este internet...",
            et: "Internetiühendus puudub...",
            ar: "أنت غير متصل..",
            hi: "इंटरनेट की सुविधा नहीं है...",
            el: "Είστε εκτός σύνδεσης...",
            max: 40
        },
        getBackOnline: {
            en: "Get back online to continue using this app",
            fr: "Reconnectez-vous pour continuer à utiliser cette application",
            es: "Para seguir usando esta app, conéctate a internet",
            ru: "Вернитесь в Интернет, чтобы продолжить использование этого приложения",
            uk: "Поверніться в Інтернет, щоб продовжувати користуватися цим додатком",
            it: "Torna online per continuare a utilizzare questa app",
            pt: "Fique online novamente para continuar usando este aplicativo",
            sk: "Ak chcete naďalej používať túto aplikáciu, vráťte sa online",
            cs: "Vraťte se online a pokračujte v používání této aplikace",
            de: "Gehen Sie wieder online, um diese App weiterhin zu verwenden",
            ja: "このアプリを使い続けるには、オンラインに戻ってください",
            vi: "Trực tuyến trở lại để tiếp tục sử dụng ứng dụng này",
            sv: "Anslut till ett nätverk för att fortsätta använda appen",
            bg: "Проверете интернет връзката си, за да продължите да използвате приложението.",
            zh: "重新上線以繼續使用此應用",
            ko: "이 앱을 계속 사용하시려면 다시 연결하세요",
            fi: "Palaa verkkoon jatkaaksesi tämän sovelluksen käyttöä",
            nl: "Ga terug online om de app te gebruiken",
            no: "Koble til nett for å fortsette å bruke appen",
            tr: "Bu uygulamayı kullanmaya devam etmek için tekrar çevrimiçi olun",
            pl: "Wróć do trybu online, aby dalej korzystać z tej aplikacji",
            da: "For at bruge denne app skal du være online",
            sl: "Če želite še naprej uporabljati to aplikacijo, vzpostavite povezavo",
            id: "Kembali online untuk terus menggunakan aplikasi ini",
            he: "חזור לחיבור אינטרנט כדי להמשיך להשתמש באפליקציה זו",
            hr: "Povežite se s internetom da nastavite koristiti ovu aplikaciju",
            hu: "Internetkapcsolatra van szükséged, hogy tovább használhasd az alkalmazást",
            ro: "Conectați-vă la internet pentru a folosi aplicația",
            et: "Rakenduse kasutamiseks ühenda seade internetiga",
            ar: "يمكنك العودة إلى الإنترنت لمواصلة استخدام هذا التطبيق",
            hi: "इस ऐप का उपयोग जारी रखने के लिए आपको इंटरनेट की आवश्यकता है",
            el: "Συνδεθείτε ξανά για να συνεχίσετε να χρησιμοποιείτε αυτήν την εφαρμογή",
            max: 200
        },
        mayNotWorkOffline: {
            en: "Some features of this app may be unavailable until you come back online",
            fr: "Certaines fonctionnalités peuvent ne pas fonctionner correctement sans connexion Internet",
            es: "Es posible que esta app no funcione correctamente sin una conexión a internet",
            ru: "Некоторые функции этого приложения могут не работать должным образом без подключения к Интернету",
            uk: "Деякі функції цього додатка можуть не працювати належним чином без підключення до Інтернету",
            it: "Alcune funzionalità di questa app potrebbero non funzionare correttamente senza una connessione Internet",
            pt: "Alguns recursos deste aplicativo podem não funcionar corretamente sem uma conexão com a Internet",
            sk: "Niektoré funkcie tejto aplikácie nemusia správne fungovať bez pripojenia na internet",
            cs: "Některé funkce této aplikace nemusí správně fungovat bez připojení k internetu",
            de: "Einige Funktionen dieser App funktionieren möglicherweise ohne Internetverbindung nicht richtig",
            ja: "このアプリの一部の機能は、オンラインに戻るまで利用できない場合があります",
            vi: "Một số tính năng của ứng dụng này có thể không khả dụng cho đến khi bạn trực tuyến trở lại",
            sv: "Vissa funktioner i appen kan sluta fungera tills du än online igen",
            bg: "Някои от функционалностите на приложението може да не работят докато не се свържете с интернет.",
            zh: "在您重新上線之前，此應用的某些功能可能無法使用",
            ko: "다시 연결될 때 까지 일부 기능이 제한될 수 있습니다",
            fi: "Jotkin tämän sovelluksen ominaisuudet eivät ehkä ole käytettävissä, ennen kuin palaat verkkoon",
            nl: "Sommige functies van deze app zijn mogelijk niet beschikbaar totdat je weer online bent",
            no: "Noen funksjoner i appen kan være utilgjengelige når du er frakoblet",
            tr: "Bu uygulamanın bazı özellikleri, siz tekrar çevrimiçi olana kadar kullanılamayabilir",
            pl: "Niektóre funkcje tej aplikacji mogą być niedostępne, dopóki nie wrócisz do trybu online",
            da: "Enkelte funktioner i denne app kan være utilgængelig, så længe du ikke er online",
            sl: "Nekatere funkcije te aplikacije morda ne bodo na voljo, dokler ne vzpostavite povezave",
            id: "Beberapa fitur aplikasi ini mungkin tidak tersedia hingga Anda kembali online",
            he: "ייתכן שחלק מהתכונות של האפליקציה הזו לא יהיו זמינות עד לחיבור אינטרנט",
            hr: "Neke značajke ove aplikacije možda neće biti dostupne bez povezanosti s internetom",
            hu: "Néhány funkciója ennek az alkalmazásnak nem érhető el, amíg újra online módban lesz",
            ro: "Anumite funcții sunt indisponibile până se restabilește conexiunea la internet",
            et: "Mõned selle rakenduse funktsioonid pole seni saadaval, kuni sul puudub internetiühendus",
            ar: "قد تكون بعض ميزات هذا التطبيق غير متاحة حتى تتصل بالإنترنت مرة أخرى",
            hi: "आपके वापस ऑनलाइन आने तक इस ऐप की कुछ सुविधाएं अनुपलब्ध हो सकती हैं",
            el: "Ορισμένες λειτουργίες αυτής της εφαρμογής ενδέχεται να μην είναι διαθέσιμες μέχρι να επιστρέψετε στο διαδίκτυο",
            max: 200
        },
        learnMore: {
            en: "Learn more",
            fr: "En savoir plus",
            es: "Más información",
            ru: "Узнать больше",
            uk: "Дізнатися більше",
            it: "Scopri di più",
            pt: "Saiba mais",
            sk: "Zistite viac",
            cs: "Zjistit více",
            de: "Mehr erfahren",
            ja: "詳細",
            vi: "Tìm hiểu thêm",
            sv: "Läs mer",
            bg: "Научете повече",
            zh: "了解更多",
            ko: "더 알아보기",
            fi: "Lue lisää",
            nl: "Lees meer",
            no: "Lær mer",
            tr: "Fazlasını öğren",
            pl: "Ucz się więcej",
            da: "Læs mere",
            sl: "Izvedi več",
            id: "Belajarlah lagi",
            he: "למד עוד",
            hr: "Nauči više",
            hu: "Tudj meg többet",
            ro: "Citește mai mult",
            et: "Uuri lisa",
            ar: "المزيد",
            hi: "ऐप के बारे में और जानें",
            el: "Μάθε περισσότερα",
            max: 50
        },
        tapToReload: {
            en: "Refresh",
            fr: "Mettre à jour",
            es: "Actualizar",
            ru: "Обновить",
            uk: "Оновити",
            it: "Aggiornare",
            pt: "Atualizar",
            sk: "Aktualizujte",
            cs: "Aktualizujte",
            de: "Aktualisieren",
            ja: "更新",
            vi: "Nhấn để cập nhật",
            sv: "Uppdatera",
            bg: "обновите",
            zh: "刷新",
            ko: "탭하여 업데이트 하기",
            fi: "Päivitä",
            nl: "Vernieuw",
            no: "Oppdatere",
            tr: "Yenile",
            pl: "Odświeżać",
            da: "Opdater",
            sl: "Osveži",
            id: "Menyegarkan",
            he: "רענן",
            hr: "Osvježi",
            hu: "Frissítés",
            ro: "Reîncarcă",
            et: "Värskenda",
            ar: "إعادة التحميل",
            hi: "पृष्ठ पुनः लोड करें",
            el: "Φρεσκάρω",
            max: 50
        },
        rightClickDock: {
            en: "Now, right-click the {X} icon in your Dock/Taskbar",
            fr: "Maintenant, faites un clic droit sur l'icône {X} dans votre Dock/Barre des tâches",
            es: "Ahora, haz clic derecho en el ícono {X} en la parte inferior de la pantalla",
            ru: "Теперь щелкните правой кнопкой мыши значок {X} в нижней части экрана",
            uk: "Тепер клацніть правою кнопкою миші піктограму {X} у нижній частині екрана",
            it: "Ora, fai clic con il pulsante destro del mouse sull'icona {X} nella parte inferiore dello schermo",
            pt: "Agora, clique com o botão direito do mouse no ícone {X} na parte inferior da tela",
            sk: "Teraz kliknite pravým tlačidlom myši na ikonu {X} v spodnej časti obrazovky",
            cs: "Nyní klikněte pravým tlačítkem na ikonu {X} v dolní části obrazovky",
            de: "Klicken Sie nun mit der rechten Maustaste auf das Symbol {X} unten auf Ihrem Bildschirm",
            ja: "次に、画面の下部にある{X}アイコンを右クリックします",
            vi: "Bây giờ, hãy nhấp chuột phải vào biểu tượng {X} ở cuối màn hình của bạn",
            sv: "Högerklicka nu på ikonen {X} längst ned på skärmen",
            bg: "Сега щракнете с десния бутон върху иконата {X} в долната част на екрана",
            zh: "現在，右鍵單擊屏幕底部的 {X} 圖標",
            ko: "{X} 아이콘에서 마우스 우측 클릭하세요",
            fi: "Napsauta nyt hiiren kakkospainikkeella {X}-kuvaketta näytön alareunassa",
            nl: "Klik nu met de rechtermuisknop op het {X}-pictogram onder aan je scherm",
            no: "Høyreklikk nå på {X}-ikonet nederst på skjermen",
            tr: "Şimdi, ekranınızın altındaki {X} simgesine sağ tıklayın",
            pl: "Teraz kliknij prawym przyciskiem myszy ikonę {X} u dołu ekranu",
            da: "Nu, højreklik på {X} ikonet i bunden af din skærm",
            sl: "Zdaj z desno miškino tipko kliknite ikono {X} na dnu zaslona",
            id: "Sekarang, klik kanan ikon {X} di bagian bawah layar Anda",
            he: "כעת, לחץ לחיצה ימנית על הסמל {X} בתחתית המסך",
            hr: "Sada desnom tipkom miša kliknite ikonu {X} pri dnu zaslona",
            hu: "Most kattints jobb gombbal a képernyő alján lévő {X} ikonra",
            ro: "Acum, click-dreapta pe iconița {X} în partea de jos a ecranului",
            et: "Nüüd tee paremklõps ekraani allosas oleval ikoonil {X}",
            ar: "الآن، انقر بزر الماوس الأيمن فوق الرمز {X} في شريط المهام/Dock",
            hi: "अब, अपने डॉक/टास्कबार में {X} आइकन पर दायां-क्लिक करें",
            el: "Τώρα, κάντε δεξί κλικ στο εικονίδιο {X} στο Dock/Taskbar",
            max: 200
        },
        selectPintoTaskBar: {
            en: "Select <span>{X} Pin to taskbar</span> for quick access to this app",
            fr: "Choisissez <span>{X} Épingler à la barre des tâches</span> pour accéder facilement à cette application",
            es: "Para acceder fácilmente a esta app, selecciona <span>{X} Anclar a la barra de tareas</span>",
            ru: "Выберите <span>{X} Закрепить на панели задач</span>, чтобы легко получить доступ к этому приложению.",
            uk: "Виберіть <span>{X} Закріпити на панелі завдань</span>, щоб легко отримати доступ до цієї програми",
            it: "Seleziona <span>{X} Aggiungi alla barra delle applicazioni</span> per accedere facilmente a questa app",
            pt: "Selecione <span>{X} Fixar na barra de tarefas</span> para acessar facilmente este aplicativo",
            sk: "Vyberte <span>{X} Pripnúť na panel úloh</span> na jednoduchý prístup k tejto aplikácii",
            cs: "Pro snadný přístup k této aplikaci vyberte <span>{X} Připnout na hlavní panel</span>",
            de: "Wählen Sie <span>{X} An Taskleiste anheften</span>, um einfach auf diese App zuzugreifen",
            ja: "このアプリに簡単にアクセスするには、[<span> {X}タスク バーにピン留めする</span>]を選択します",
            vi: "Chọn <span> {X} Ghim vào thanh tác vụ </span> để dễ dàng truy cập ứng dụng này",
            sv: "Välj <span>{X} Fäst i Aktivitetsfältet</span> för att enkelt komma åt den här appen",
            bg: "Изберете <span>{X} Закачи към лентата на задачите</span> за лесен достъп до това приложение",
            zh: "選擇<span>{X}釘選至工作列</span>以輕鬆訪問此應用",
            ko: "이 앱에 쉽게 액세스하려면 <span>{X} 작업 표시줄에 고정</span>을 선택하세요.",
            fi: "Valitse <span>{X} Kiinnitä tehtäväpalkkiin</span> käyttääksesi tätä sovellusta helposti",
            nl: "Selecteer <span>{X} Vastmaken aan taakbalk</span> om eenvoudig toegang te krijgen tot deze app",
            no: "Velg <span>{X} Fest til oppgavelinjen</span> for enkel tilgang til denne appen",
            tr: "Bu uygulamaya kolayca erişmek için <span>{X} Görev çubuğuna sabitle</span>'i seçin",
            pl: "Wybierz <span>{X} Przypnij do paska zadań</span>, aby uzyskać szybki dostęp do tej aplikacji",
            da: "Vælg <span>{X} Fastgør til proceslinje</span> for hurtig adgang til denne app",
            sl: "Izberite <span>{X} Pripni v opravilno vrstico</span> za hiter dostop do te aplikacije",
            id: "Pilih <span>{X} Sematkan ke taskbar</span> untuk akses cepat ke aplikasi ini",
            he: "בחר <span>{X} הצמד לשורת המשימות</span> לגישה מהירה לאפליקציה זו",
            hr: "Odaberite <span>{X} Prikvači na programsku traku</span> za brzi pristup ovoj aplikaciji",
            hu: "Válaszd ki a <span>{X} Rögzítés a tálcán</span> lehetőséget az alkalmazás gyors eléréséhez",
            ro: "Selectează <span>{X} Fixare în bara de activități</span> pentru acces rapid la aplicație",
            et: "Kiireks ligipääsuks äpile vali <span>{X} Kinnita tegumiribale</span>",
            ar: "حدد <span>{X} تثبيت على شريط المهام</span> للوصول السريع إلى هذا التطبيق",
            hi: "इस ऐप तक तुरंत पहुंच के लिए <span>{X} Pin to taskbar</span> चुनें",
            el: "Επιλέξτε <span>{X} Καρφίτσωμα στη γραμμή εργασιών</span> για γρήγορη πρόσβαση σε αυτήν την εφαρμογή",
            max: 200
        },
        keepInDock: {
            en: "Select <span>Options</span> > <span>Keep In Dock</span> from the pop-up menu",
            fr: "Sélectionnez <span>Options</span> > <span>Garder dans le Dock</span> dans le menu contextuel",
            es: "Selecciona <span>Opciones</span> > <span>Mantener en Dock</span> en el menú emergente",
            ru: "Выберите <span>Параметры</span> > <span>Оставить в Dock</span> во всплывающем меню.",
            uk: "Виберіть <span>Параметри</span> > <span>Зберігати в док-станції</span> зі спливаючого меню",
            it: "Seleziona <span>Opzioni</span> > <span>Mantieni nel Dock</span> dal menu a comparsa",
            pt: "Selecione <span>Opções</span> ><span>Manter na Dock</span> no menu pop-up",
            sk: "Z kontextovej ponuky vyberte <span>Možnosti</span> > <span>Ponechať v Docku</span>",
            cs: "Z rozbalovací nabídky vyberte <span>Volby</span> > <span>Ponechat v Docku</span>",
            de: "Wählen Sie <span>Optionen</span> > <span>Im Dock behalten</span> aus dem Popup-Menü",
            ja: "ポップアップメニューから<span>オプション</span> > <span>Dock に追加</span>を選択します",
            vi: "Chọn <span>Tùy chọn</span> > <span>Giữ trong Dock</span> từ menu bật lên",
            sv: "Välj <span>Alternativ</span> > <span>Behåll i Dock</span> från popup-menyn",
            bg: "Изберете <span>Настройки</span> > <span>Съхранявайте в Dock</span> от изскачащото меню",
            zh: "從彈出菜單中選擇 <span>選項</span> > <span>保留在 Dock 上</span>",
            ko: "팝업 메뉴에서 <span>옵션</span> > <span>Dock에 유지</span>를 선택하세요",
            fi: "Valitse ponnahdusvalikosta <span>Asetukset</span> > <span>Pidä Dockissa</span>.",
            nl: "Selecteer <span>Opties</span> > <span>Permanent in Dock</span> in het pop-upmenu",
            no: "Velg <span>Alternativer</span> > <span>Behold i Dock</span> fra hurtigmenyen",
            tr: "Açılır menüden <span>Seçenekler</span> > <span>Dock'ta Tut</span>'u seçin",
            pl: "Wybierz <span>Opcje</span> > <span>Zatrzymaj w Docku</span> z wyskakującego menu",
            da: "Vælg <span>Indstillinger</span> > <span>Behold i Dock</span> fra pop-up menuen",
            sl: "V pojavnem meniju izberite <span>Možnosti</span> > <span>Ohrani v doku</span>",
            id: "Pilih <span>Pilihan</span> > <span>Taruh di Dock</span> dari menu pop-up",
            he: "בחר <span>אפשרויות</span> > <span>שמור בסרגל הכלים</span> מהתפריט המוקפץ",
            hr: "Na skočnom izborniku odaberite <span>Opcije</span> > <span>Zadrži na docku</span>",
            hu: "Válaszd ki a <span>Beállítások</span> > <span>Megtartás a Dockban</span> lehetőséget a felugró menüből",
            ro: "Selectează <span>Opțiuni</span> > <span>Păstrați în Dock</span> din meniul care apare",
            et: "Vali pop-up menüüst <span>Options</span> > <span>Keep In Dock</span>",
            ar: "حدد <span>الخيارات</span> > <span>Keep In Dock</span> من القائمة المنبثقة",
            hi: "पॉप-अप मेनू से <span>विकल्प</span> > <span>Keep In Dock</span> चुनें",
            el: "Επιλέξτε <span>Επιλογές</span> > <span>Διατήρηση στο Dock</span> από το αναδυόμενο μενού",
            max: 150
        },
        addToDockMac: {
            en: "Click <em>File</em> > <em>Add to Dock</em> in the menu bar to install this app on your Mac.",
            fr: "Cliquez sur <em>Fichier</em> > <em>Ajouter au Dock</em> dans la barre de menu pour installer cette application sur votre Mac.",
            es: "Para instalar esta app en macOS, pulsa <em>Archivo</em> > <em>Agregar al Dock</em> en la barra de menús.",
            ru: "Нажмите на <em>Файл</em> > <em>Добавить в Dock</em> в строке меню, чтобы установить это приложение на вашем Mac.",
            uk: "Натисніть на <em>Файл</em> > <em>Додати в Dock</em> у рядку меню, щоб встановити цей додаток на ваш Mac.",
            it: "Clicca su <em>File</em> > <em>Aggiungi al Dock</em> nella barra dei menu per installare questa app sul tuo Mac.",
            pt: "Clique em <em>Arquivo</em> > <em>Adicionar ao Dock</em> na barra de menu para instalar este aplicativo no seu Mac.",
            sk: "Kliknite na <em>Súbor</em> > <em>Pridať do Docku</em> v menu, aby ste nainštalovali túto aplikáciu na svojom Macu.",
            cs: "Klikněte na <em>Soubor</em> > <em>Přidat do Docku</em> v nabídce, abyste nainstalovali tuto aplikaci na svém Macu.",
            de: "Klicken Sie auf <em>Datei</em> > <em>Zum Dock hinzufügen</em> in der Menüleiste, um diese App auf Ihrem Mac zu installieren.",
            ja: "メニューバーで<em>ファイル</em> > <em>ドックに追加</em>をクリックして、このアプリをMacにインストールしてください。",
            vi: "Nhấp vào <em>File</em> > <em>Thêm vào Dock</em> trên thanh menu để cài đặt ứng dụng này vào Mac của bạn.",
            sv: "Klicka på <em>Fil</em> > <em>Lägg till i Dock</em> i menyraden för att installera den här appen på din Mac.",
            bg: "Кликнете върху <em>Файл</em> > <em>Добавяне към Dock</em> в менюто, за да инсталирате това приложение на вашия Mac.",
            zh: "在選單中點擊<em>文件</em> > <em>新增到 Dock</em>以在您的 Mac 上安裝此應用程式。",
            ko: "메뉴 바에서 <em>파일</em> > <em>도크에 추가</em>를 클릭하여 이 앱을 Mac에 설치하세요.",
            fi: "Napsauta <em>Tiedosto</em> > <em>Lisää Dockiin</em> valikkorivillä asentaaksesi tämän sovelluksen Maciisi.",
            nl: "Klik op <em>Bestand</em> > <em>Toevoegen aan Dock</em> in de menubalk om deze app op je Mac te installeren.",
            no: "Klikk på <em>Fil</em> > <em>Legg til i Dock</em> i menylinjen for å installere denne appen på Mac-en din.",
            tr: "Bu uygulamayı Mac'inize yüklemek için menü çubuğunda <em>Dosya</em> > <em>Dock'a Ekle</em> seçeneklerini tıklayın.",
            pl: "Kliknij <em>Plik</em> > <em>Dodaj do Docka</em> na pasku menu, aby zainstalować tę aplikację na swoim Macu.",
            da: "Klik på <em>Fil</em> > <em>Tilføj til Dock</em> i menulinjen for at installere denne app på din Mac.",
            sl: "Kliknite na <em>Datoteka</em> > <em>Dodaj v Dock</em> v menijski vrstici, da namestite to aplikacijo na vaš Mac.",
            id: "Klik pada <em>File</em> > <em>Tambahkan ke Dock</em> di bilah menu untuk menginstal aplikasi ini di Mac Anda.",
            he: "לחץ על <em>קובץ</em> > <em>הוסף ל-Dock</em> בסרגל התפריטים כדי להתקין את האפליקציה הזו על ה-Mac שלך.",
            hr: "Kliknite na <em>Datoteka</em> > <em>Dodaj Dock-u</em> u traci izbornika da biste instalirali ovu aplikaciju na svoj Mac.",
            hu: "Kattintson a <em>Fájl</em> > <em>Hozzáadás a Dockhoz</em> menüpontra a menüsoron, hogy telepítse ezt az alkalmazást Mac-jére.",
            ro: "Faceți clic pe <em>Fișier</em> > <em>Adăugați la Dock</em> în bara de meniu pentru a instala această aplicație pe Mac.",
            et: "Selle äpi installimiseks Macil vali menüüribalt <em>File</em> > <em>Add to Dock</em>.",
            ar: "انقر فوق <em>ملف</em> > <em>إضافة إلى Dock</em> في شريط القائمة لتثبيت هذا التطبيق على جهاز Mac الخاص بك.",
            hi: "अपने Mac पर इस ऐप को इंस्टॉल करने के लिए मेनू बार में <em>फ़ाइल</em> > <em>Add to Dock</em> पर क्लिक करें।",
            el: "Κάντε κλικ στο <em>Αρχείο</em> > <em>Προσθήκη στο Dock</em> στη γραμμή μενού για να εγκαταστήσετε αυτήν την εφαρμογή στο Mac σας.",
            max: 350
        },
        clickOnHamburgerMenu: {
            en: "Tap on {X} to open the menu",
            fr: "Appuyez sur {X} pour ouvrir le menu",
            es: "Para abrir el menú, pulsa {X}",
            ru: "Нажмите на {X} чтобы открыть меню",
            uk: "Торкніться {X} щоб відкрити меню",
            it: "Tocca {X} per aprire il menu",
            pt: "Toque em {X} para abrir o menu",
            sk: "Klepnutím na {X} otvoríte ponuku",
            cs: "Klepnutím na {X} otevřete nabídku",
            de: "Tippen Sie auf {X} um das Menü zu öffnen",
            ja: "{X}をタップしてメニューを開きます",
            vi: "Nhấn vào {X} để mở menu",
            sv: "Tryck på {X} för att öppna menyn",
            bg: "Докоснете {X} за да отворите менюто",
            zh: "點擊 {X} 打開選單",
            ko: "{X}를 탭하여 메뉴를 여세요",
            fi: "Avaa valikko napauttamalla {X}",
            nl: "Tik op {X} om het menu te openen",
            no: "Trykk på {X} for å åpne menyen",
            tr: "Menüyü açmak için {X} üzerine dokunun",
            pl: "Stuknij w {X}, aby otworzyć menu",
            da: "Tryk på {X} for at åbne menuen",
            sl: "Dotaknite se {X}, da odprete meni",
            id: "Ketuk {X} untuk membuka menu",
            he: "הקש על {X} כדי לפתוח את התפריט",
            hr: "Dodirnite {X} za otvaranje izbornika",
            hu: "Koppints a {X}-ra a menü megnyitásához",
            ro: "Apasă pe {X} pentru a deschide meniul",
            et: "Menüü avamiseks puuduta nuppu {X}",
            ar: "اضغط على {X} لفتح القائمة",
            hi: "मेनू खोलने के लिए {X} पर टैप करें",
            el: "Πατήστε στο {X} για να ανοίξετε το μενού",
            max: 50
        },
        noButtonRefresh: {
            en: "Pro tip: If you can't see the button, make sure you're not browsing in Incognito mode and refresh the page.",
            fr: "Astuce: Si vous ne voyez pas le bouton, assurez-vous que vous ne naviguez pas en mode navigation privée et actualisez la page.",
            es: "Sugerencia: si no puedes ver el botón, asegúrate de no estar navegando en modo incógnito/navegación privada y actualiza la página.",
            ru: "Совет для профессионалов: если вы не видите кнопку, убедитесь, что вы не просматриваете страницу в режиме инкогнито, и обновите страницу.",
            uk: "Порада професіонала: якщо ви не бачите кнопку, переконайтеся, що ви не переглядаєте сторінку в режимі анонімного перегляду, і оновіть сторінку.",
            it: "Suggerimento: se non riesci a vedere il pulsante, assicurati di non navigare in modalità di navigazione in incognito e aggiorna la pagina.",
            pt: "Dica profissional: se você não conseguir ver o botão, verifique se não está navegando no modo de navegação anônima e atualize a página.",
            sk: "Tip: Ak tlačidlo nevidíte, uistite sa, že neprechádzate v režime inkognito, a obnovte stránku.",
            cs: "Tip: Pokud tlačítko nevidíte, ujistěte se, že neprocházíte v anonymním režimu, a obnovte stránku.",
            de: "Profi-Tipp: Wenn Sie die Schaltfläche nicht sehen können, vergewissern Sie sich, dass Sie nicht im Inkognito-Modus surfen, und aktualisieren Sie die Seite.",
            ja: "上級者向けのヒント：ボタンが表示されない場合は、シークレットモードで閲覧していないことを確認し、ページを更新してください。",
            vi: "Mẹo chuyên nghiệp: Nếu bạn không thể nhìn thấy nút, hãy đảm bảo rằng bạn không duyệt ở chế độ Ẩn danh và làm mới trang.",
            sv: "Proffstips: Om du inte kan se knappen, se till att du inte surfar i inkognitoläge och uppdatera sidan.",
            bg: "Професионален съвет: Ако не виждате бутона, уверете се, че не сърфирате в режим „инкогнито“ и опреснете страницата.",
            zh: "專業提示：如果您看不到該按鈕，請確保您沒有在隱身模式下瀏覽並刷新頁面。",
            ko: "프로팁: 버튼을 찾을 수 없는 경우 혹시 Incognito 모드를 사용중인지 확인하시고 본 페이지를 리프레쉬 하세요",
            fi: "Vinkki ammattilaiselle: Jos et näe painiketta, varmista, että et selaa incognito-tilassa, ja päivitä sivu.",
            nl: "Pro-tip: als je de knop niet ziet, zorg er dan voor dat je niet in de incognitomodus browst en vernieuw de pagina.",
            no: "Tips: Hvis du ikke kan se knappen, sørg for at du ikke surfer i inkognitomodus og oppdater siden.",
            tr: "Profesyonel ipucu: Düğmeyi göremiyorsanız, Gizli modda gezinmediğinizden emin olun ve sayfayı yenileyin.",
            pl: "Wskazówka: jeśli nie widzisz przycisku, upewnij się, że nie przeglądasz w trybie incognito i odśwież stronę.",
            da: "Tip: Hvis du ikke kan se knappen, skal du sikre dig, at du ikke benytter browseren i Inkognitio tilstand og derefter opdatere siden.",
            sl: "Profesionalni nasvet: če ne vidite gumba, se prepričajte, da ne brskate v načinu brez beleženja zgodovine, in osvežite stran.",
            id: "Kiat pro: Jika Anda tidak dapat melihat tombolnya, pastikan Anda tidak menjelajah dalam mode Penyamaran dan segarkan laman.",
            he: "טיפ מקצועי: אם אינך יכול לראות את הכפתור, ודא שאינך גולש במצב גלישה בסתר ורענן את העמוד.",
            hr: "Stručni savjet: ako ne možete vidjeti gumb, provjerite ne pregledavate li anonimno i osvježite stranicu.",
            hu: "Szakértői tipp: Ha nem látod a gombot, győződj meg róla, hogy nem inkognitó módban böngészel, majd frissítsd az oldalt.",
            ro: "Tip: Dacă nu vezi butonul asigură-te că nu ai activat modul Incognito și reîncarcă pagina.",
            et: "Vihje: kui sa nuppu ei näe, veendu, et su brauser pole privaatses (Incognito) režiimis ja värskenda lehte.",
            ar: "نصيحة احترافية: إذا لم تتمكن من رؤية الزر، فتأكد من أنك لا تتصفح في وضع التصفح المتخفي وقم بتحديث الصفحة.",
            hi: "पेशेवर सुझाव: यदि आप बटन नहीं देख पा रहे हैं, तो सुनिश्चित करें कि आप गुप्त मोड में ब्राउज़ नहीं कर रहे हैं और पृष्ठ को ताज़ा करें।",
            el: "Επαγγελματική συμβουλή: Εάν δεν μπορείτε να δείτε το κουμπί, βεβαιωθείτε ότι δεν κάνετε περιήγηση σε κατάσταση ανώνυμης περιήγησης και ανανεώστε τη σελίδα.",
            max: 200
        },
        clickOnIconUrlBar: {
            en: "Click on the {X} icon in the URL bar",
            fr: "Cliquez sur l'icône {X} dans la barre d'URL",
            es: "Haz clic en el ícono {X} en la barra de URL",
            ru: "Нажмите на значок {X} в адресной строке.",
            uk: "Натисніть значок {X} у рядку URL",
            it: "Fare clic sull'icona {X} nella barra degli indirizzi",
            pt: "Clique no ícone {X} na barra de URL",
            sk: "Kliknite na ikonu {X} na paneli s adresou URL",
            cs: "Klikněte na ikonu {X} v adresním řádku",
            de: "Klicken Sie auf das Symbol {X} in der URL-Leiste",
            ja: "URLバーの{X}アイコンをクリックします",
            vi: "Nhấp vào biểu tượng {X} trên thanh URL",
            sv: "Klicka på ikonen {X} i URL-fältet",
            bg: "Кликнете върху иконата {X} в URL лентата",
            zh: "單擊 URL 欄中的 {X} 圖標",
            ko: "URL바에서 {X} 아이콘을 클릭하세요",
            fi: "Napsauta {X}-kuvaketta URL-palkissa",
            nl: "Klik op het {X}-pictogram in de adresbalk",
            no: "Klikk på {X}-ikonet i URL-linjen",
            tr: "URL çubuğundaki {X} simgesine tıklayın",
            pl: "Kliknij ikonę {X} na pasku adresu",
            da: "Klik på {X} ikonet i URL baren",
            sl: "Kliknite ikono {X} v URL vrstici",
            id: "Klik ikon {X} di bilah URL",
            he: "לחץ על הסמל {X} בסרגל הכתובות",
            hr: "Kliknite na ikonu {X} na adresnoj traci",
            hu: "Kattints a {X} ikonra az URL sávon.",
            ro: "Apasă pe iconița {X} în bara URL",
            et: "Puuduta aadressiribal ikooni {X}",
            ar: "انقر على أيقونة {X} في شريط URL",
            hi: "यूआरएल बार में {X} आइकन पर क्लिक करें",
            el: "Κάντε κλικ στο εικονίδιο {X} στη γραμμή URL",
            max: 80
        },
        copyLink: {
            en: "Copy Link",
            fr: "Copier le lien",
            es: "Copiar enlace",
            ru: "Копировать ссылку",
            uk: "Копіювати посилання",
            it: "Copia link",
            pt: "Link para copiar",
            sk: "Skopírovať odkaz",
            cs: "Kopírovat odkaz",
            de: "Link kopieren",
            ja: "リンクをコピーする",
            vi: "Sao chép đường dẫn",
            sv: "Kopiera länk",
            bg: "Копирай връзка",
            zh: "複製連結",
            ko: "링크를 복사하세요",
            fi: "Kopioi linkki",
            nl: "Kopieer link",
            no: "Kopier linken",
            tr: "Link kopyalandı",
            pl: "Skopiuj link",
            da: "Kopiér Link",
            sl: "Kopiraj povezavo",
            id: "Salin Tautan",
            he: "העתק קישור",
            hr: "Kopiraj poveznicu",
            hu: "Link másolása",
            ro: "Copiază link",
            et: "Kopeeri linki",
            ar: "نسخ الرابط",
            hi: "लिंक पता कॉपी करें",
            el: "Αντιγραφή συνδέσμου",
            max: 80
        },
        copied: {
            en: "Link Copied",
            fr: "Lien copié",
            es: "Enlace copiado",
            ru: "Ссылка скопирована",
            uk: "Посилання скопійовано",
            it: "Collegamento copiato",
            pt: "Link copiado",
            sk: "Skopírované",
            cs: "Zkopírováno",
            de: "Kopiert",
            ja: "リンクがコピーされました",
            vi: "Đã sao chép",
            sv: "Länk kopierad",
            bg: "Връзката е копирана",
            zh: "連結已複製",
            ko: "링크가 복사되었습니다",
            fi: "Linkki kopioitu",
            nl: "Link gekopieerd",
            no: "Linken er kopiert",
            tr: "Linki kopyala",
            pl: "Skopiowano link",
            da: "Link Kopieret",
            sl: "Povezava kopirana",
            id: "Tautan Disalin",
            he: "הקישור הועתק",
            hr: "Poveznica kopirana",
            hu: "Link másolva",
            ro: "Linkul a fost copiat",
            et: "Link kopeeritud",
            ar: "تم نسخ الرابط",
            hi: "लिंक कॉपी कर लिया गया है",
            el: "Ο σύνδεσμος αντιγράφηκε",
            max: 80
        },
        inappBrowserWarning: {
            en: "It looks like you may be using an in-app browser. Open this page with {X} to install this app.",
            fr: "Il semble que vous utilisiez un navigateur intégré à une application. Ouvrez cette page avec {X} pour installer cette application.",
            es: "Estás usando un navegador integrado en la app. Para instalar esta app, abre esta página con {X}.",
            ru: "Похоже, вы используете встроенный в приложение браузер. Откройте эту страницу, нажав {X}, чтобы установить приложение.",
            uk: "Схоже, ви використовуєте браузер у програмі. Відкрийте цю сторінку за допомогою {X} безпосередньо, щоб встановити програму.",
            it: "Sembra che tu stia utilizzando un browser in-app. Apri questa pagina direttamente con {X} per installare l'app.",
            pt: "Parece que você pode estar usando um navegador no aplicativo. Abra esta página com {X} diretamente para instalar o aplicativo.",
            sk: "Zdá sa, že možno používate prehliadač v aplikácii. Ak chcete aplikáciu nainštalovať, otvorte túto stránku priamo pomocou {X}.",
            cs: "Zdá se, že možná používáte prohlížeč v aplikaci. Otevřete tuto stránku pomocí {X} přímo a nainstalujte aplikaci.",
            de: "Anscheinend verwenden Sie einen In-App-Browser. Öffnen Sie diese Seite direkt mit {X}, um die App zu installieren.",
            ja: "アプリ内ブラウザを使用しているようです。 {X}でこのページを直接開いて、アプリをインストールします。",
            vi: "Có vẻ như bạn đang sử dụng trình duyệt trong ứng dụng. Mở trực tiếp trang này bằng {X} để cài đặt ứng dụng.",
            sv: "Det verkar som att du använder en webbläsare i appen. Öppna den här sidan med {X} direkt för att installera appen.",
            bg: "Изглежда, че може да използвате браузър в приложението. Отворете тази страница с {X} директно, за да инсталирате приложението.",
            zh: "看起來您可能正在使用應用內瀏覽器。 使用 {X} 直接打開此頁面以安裝應用程序。",
            ko: "인앱 브라우저를 사용 중인 것 같습니다. 이 앱을 설치하려면 {X}로 이 페이지를 여세요.",
            fi: "Näyttää siltä, että käytät sovelluksen sisäistä selainta. Asenna tämä sovellus avaamalla tämä sivu sovelluksella {X}.",
            nl: "Het lijkt erop dat je een in-app-browser gebruikt. Open deze pagina met {X} om deze app te installeren.",
            no: "Det ser ut til at du bruker en nettleser for appen. Åpne denne siden med {X} for å installere appen.",
            tr: "Bir uygulama içi tarayıcı kullanıyor olabilirsiniz. Bu uygulamayı yüklemek için bu sayfayı {X} ile açın.",
            pl: "Wygląda na to, że używasz przeglądarki w aplikacji. Otwórz tę stronę za pomocą {X}, aby zainstalować tę aplikację.",
            da: "Det ser ud til, at du bruger en in-app browser. Åben denne side med {X} for at installere appen.",
            sl: "Videti je, da morda uporabljate brskalnik v aplikaciji. Odprite to stran z {X}, da namestite to aplikacijo.",
            id: "Sepertinya Anda mungkin menggunakan browser dalam aplikasi. Buka halaman ini dengan {X} untuk menginstal aplikasi ini.",
            he: "נראה שאתה משתמש בדפדפן בתוך האפליקציה. פתח את הדף הזה עם {X} כדי להתקין את האפליקציה הזו.",
            hr: "Čini se da možda koristite preglednik unutar aplikacije. Otvorite ovu stranicu s {X} da instalirate ovu aplikaciju.",
            hu: "Úgy tűnik, hogy alkalmazásbeli böngészőt használsz. Nyisd meg ezt az oldalt a {X}-ra kattintva, hogy telepítsd az alkalmazást.",
            ro: "Aparent folosești o aplicație a browserului. Deschide această pagină cu {X} pentru a instala aplicația.",
            et: "Paistab, et sa kasutad rakendusesisest brauserit. Äpi installimiseks ava see leht brauseriga {X}.",
            ar: "يبدو أنك تستخدم متصفحًا داخل التطبيق. افتح هذه الصفحة باستخدام {X} لتثبيت هذا التطبيق.",
            hi: "ऐसा लगता है कि आप इन-ऐप ब्राउज़र का उपयोग कर रहे होंगे। इस ऐप को इंस्टॉल करने के लिए इस पेज को {X} से खोलें।",
            el: "Φαίνεται ότι μπορεί να χρησιμοποιείτε πρόγραμμα περιήγησης εντός εφαρμογής. Ανοίξτε αυτήν τη σελίδα με το {X} για να εγκαταστήσετε αυτήν την εφαρμογή.",
            max: 200
        },
        fromTwitter: {
            en: "Looks like you're coming from X (Twitter). To install this app, make sure to open this page from {X} — not Twitter's in-app browser.",
            fr: "Il semblerait que vous veniez de X (Twitter). Pour installer cette application, assurez-vous d'ouvrir cette page depuis {X} - et non pas via le navigateur intégré de Twitter.",
            es: "Parece que estás accediendo desde X (antes Twitter). Para instalar esta app, asegúrate de abrir esta página desde {X} - no desde el navegador integrado en X.",
            ru: "Похоже, что вы заходите с Twitter. Для установки данного приложения убедитесь, что открываете эту страницу с {X}, а не с помощью встроенного браузера в приложении Twitter.",
            uk: "Здається, ви заходите з Twitter. Для встановлення цього додатку переконайтеся, що відкриваєте цю сторінку з {X} - а не з вбудованого браузера Twitter.",
            it: "Sembra che tu stia accedendo da Twitter. Per installare questa app, assicurati di aprire questa pagina da {X} - non dal browser in-app di Twitter.",
            pt: "Parece que está vindo do Twitter. Para instalar este aplicativo, certifique-se de abrir esta página a partir de {X} - e não do navegador in-app do Twitter.",
            sk: "Zdá sa, že prichádzate z Twitteru. Pre nainštalovanie tejto aplikácie si uistite, že otvárate túto stránku z {X} - a nie z vstavaného prehliadača Twitteru.",
            cs: "Vypadá to, že přicházíte z Twitteru. Pro nainstalování této aplikace se ujistěte, že otevřete tuto stránku z {X} - nikoli z Twitterova vestavěného prohlížeče.",
            de: "Es sieht so aus, als kämst du von Twitter. Um diese App zu installieren, öffne diese Seite bitte von {X} - nicht über den in-App-Browser von Twitter.",
            ja: "Twitterから来たようですね。このアプリをインストールするには、Twitterのアプリ内ブラウザではなく、{X} からこのページを開くようにしてください。",
            vi: "Có vẻ như bạn đang đến từ Twitter. Để cài đặt ứng dụng này, hãy đảm bảo mở trang này từ {X} - không phải từ trình duyệt trong ứng dụng của Twitter.",
            sv: "Det verkar som att du kommer från Twitter. För att installera den här appen, se till att öppna den här sidan från {X} - inte från Twitter's inbyggda webbläsare.",
            bg: "Изглежда, че идвате от Twitter. За да инсталирате това приложение, уверете се, че отваряте тази страница от {X}, а не от вградения браузър на Twitter.",
            zh: "看起來您來自 Twitter。為了安裝此應用程式，請確保從 {X} 開啟此頁面，而不是從 Twitter 的應用程式內瀏覽器開啟。",
            ko: "트위터에서 접속하고 계시는 것 같습니다. 이 앱을 설치하려면 Twitter의 앱 내 브라우저가 아닌 {X}에서 이 페이지를 열어야합니다.",
            fi: "Näyttää siltä, että tulet Twitteristä. Asentaaksesi tämän sovelluksen, varmista, että avaat tämän sivun {X}:stä - ei Twitterin sisäisestä selaimesta.",
            nl: "Het lijkt erop dat je van Twitter komt. Om deze app te installeren, moet je de pagina vanaf {X} openen - niet vanuit de in-app-browser van Twitter.",
            no: "Ser ut som du kommer fra Twitter. For å installere denne appen, sørg for å åpne denne siden fra {X} - ikke Twitter's in-app nettleser.",
            tr: "Twitter'dan geliyormuşsunuz gibi görünüyor. Bu uygulamayı yüklemek için, Twitter'ın uygulama içi tarayıcısından değil {X} üzerinden bu sayfayı açtığınızdan emin olun.",
            pl: "Wygląda na to, że pochodzisz z Twittera. Aby zainstalować tę aplikację, upewnij się, że otwierasz tę stronę z {X}, a nie z wewnętrznej przeglądarki Twittera.",
            da: "Det ser ud til, at du kommer fra Twitter. For at installere denne app skal du sørge for at åbne denne side fra {X} - ikke Twitter's in-app-browser.",
            sl: "Izgleda, da prihajate s Twitterja. Za namestitev te aplikacije, se prepričajte, da odprete to stran iz {X} - ne iz Twitterjeve vgrajene brskalnika.",
            id: "Sepertinya Anda berasal dari Twitter. Untuk menginstal aplikasi ini, pastikan untuk membuka halaman ini dari {X} — bukan dari browser dalam aplikasi Twitter.",
            he: "נראה שאתה מגיע מטוויטר. כדי להתקין את האפליקציה הזו, הקפד לפתוח את הדף הזה מ-{X} - לא מהדפדפן בתוך האפליקציה של Twitter.",
            hr: "Čini se da dolazite s Twittera. Da biste instalirali ovu aplikaciju, svakako otvorite ovu stranicu iz {X} — ne iz preglednika unutar Twitter aplikacije.",
            hu: "Úgy tűnik, hogy a Twitterről érkeztél. Az alkalmazás telepítéséhez győződj meg róla, hogy ezt az oldalt a {X} segítségével nyitod meg - nem a Twitter alkalmazásbeli böngészőjén keresztül.",
            ro: "Încerci să accesezi din Twitter. Pentru a instala aplicația, asigură-te ca deschizi pagina din {X} - nu din browserul de Twitter.",
            et: "Paistab, et sa tuled Twitterist. Äpi installimiseks ava see leht brauseriga {X} – mitte Twitteri rakendusesisese brauseriga.",
            ar: "يبدو أنك قادم من تويتر. لتثبيت هذا التطبيق، تأكد من فتح هذه الصفحة من {X} — وليس من متصفح Twitter داخل التطبيق.",
            hi: "ऐसा लगता है जैसे आप Twitter से आ रहे हैं। इस ऐप को इंस्टॉल करने के लिए, सुनिश्चित करें कि यह पेज {X} से खुले - ट्विटर के इन-ऐप ब्राउज़र से नहीं।",
            el: "Φαίνεται ότι έρχεστε από το X (Twitter). Για να εγκαταστήσετε αυτήν την εφαρμογή, φροντίστε να ανοίξετε αυτήν τη σελίδα από το {X} — όχι από το πρόγραμμα περιήγησης εντός εφαρμογής του Twitter.",
            max: 250
        },
        imInBrowser: {
            en: "I'm using {X}",
            fr: "J'utilise {X}",
            es: "Estoy usando {X}",
            ru: "Я использую {X}",
            uk: "Я використовую {X}",
            it: "Sto usando {X}",
            pt: "Estou usando {X}",
            sk: "Používam {X}",
            cs: "Používám {X}",
            de: "Ich benutze {X}",
            ja: "私は{X}を使用しています",
            vi: "Tôi đang sử dụng {X}",
            sv: "Jag använder {X}",
            bg: "Аз използвам {X}",
            zh: "我正在使用 {X}",
            ko: "{X}를 사용 중입니다",
            fi: "Käytän {X}",
            nl: "Ik gebruik {X}",
            no: "Jeg bruker {X}",
            tr: "{X} kullanıyorum",
            pl: "Używam {X}",
            da: "Jeg bruger {X}",
            sl: "Uporabljam {X}",
            id: "Saya menggunakan {X}",
            he: "אני משתמש ב-{X}",
            hr: "Koristim {X}",
            hu: "{X} használok",
            ro: "Folosesc {X}",
            et: "Kasutusel on {X}",
            ar: "أنا أستخدم {X}",
            hi: "मैं {X} का उपयोग कर रहा हूं",
            el: "χρησιμοποιώ το {X}",
            max: 50
        },
        scanCode: {
            en: "Scan the QR code below to install the app on your iPhone or Android smartphone.",
            fr: "Scannez le code QR ci-dessous pour installer l'application sur votre iPhone ou smartphone Android.",
            es: "Para instalar la app en tu dispositivo digital, escanea el código QR.",
            ru: "Отсканируйте приведенный ниже QR-код, чтобы установить приложение на свой iPhone или Android-смартфон.",
            uk: "Відскануйте QR-код нижче, щоб встановити програму на свій iPhone або смартфон Android.",
            it: "Scansiona il codice QR qui sotto per installare l'app sul tuo iPhone o smartphone Android.",
            pt: "Digitalize o código QR abaixo para instalar o aplicativo em seu iPhone ou smartphone Android.",
            sk: "Naskenujte QR kód nižšie a nainštalujte si aplikáciu na svoj iPhone alebo smartfón so systémom Android.",
            cs: "Naskenujte QR kód níže a nainstalujte si aplikaci na svůj iPhone nebo smartphone se systémem Android.",
            de: "Scannen Sie den unten stehenden QR-Code, um die App auf Ihrem iPhone oder Android-Smartphone zu installieren.",
            ja: "以下のQRコードをスキャンして、iPhoneまたはAndroidスマートフォンにアプリをインストールします。",
            vi: "Quét mã QR bên dưới để cài đặt ứng dụng trên iPhone hoặc điện thoại thông minh Android của bạn.",
            sv: "Skanna QR-koden nedan för att installera appen på din iPhone eller Android smartphone.",
            bg: "Сканирайте QR кода по-долу, за да инсталирате приложението на вашия iPhone или смартфон с Android.",
            zh: "掃描下方二維碼(QR Code)，在您的 iPhone 或 Android 智慧手機上安裝該應用程序。",
            ko: "아래 QR 코드를 스캔하여 iPhone 또는 Android 스마트폰에 앱을 설치하세요.",
            fi: "Asenna sovellus iPhone- tai Android-älypuhelimeesi skannaamalla alla oleva QR-koodi.",
            nl: "Scan onderstaande QR-code om de app op je iPhone of Android-smartphone te installeren.",
            no: "Skann QR-koden nedenfor for å installere appen på din iPhone eller Android-smarttelefon.",
            tr: "Uygulamayı iPhone veya Android akıllı telefonunuza yüklemek için aşağıdaki QR kodunu tarayın.",
            pl: "Zeskanuj poniższy kod QR, aby zainstalować aplikację na swoim telefonie iPhone lub smartfonie z systemem Android.",
            da: "Scan QR koden herunder for at installere denne app på din iPhone eller Android smartphone.",
            sl: "Skenirajte spodnjo kodo QR, da namestite aplikacijo na svoj pametni telefon.",
            id: "Pindai kode QR di bawah ini untuk menginstal aplikasi di iPhone atau smartphone Android Anda.",
            he: "סרוק את קוד ה-QR למטה כדי להתקין את האפליקציה בסמארטפון האייפון או האנדרואיד שלך.",
            hr: "Skenirajte QR kod ispod kako biste instalirali aplikaciju na svoj iPhone ili Android pametni telefon.",
            hu: "Az alkalmazás telepítéséhez szkenneld be az alábbi QR-kódot az iPhone vagy Android okostelefonodon.",
            ro: "Scanează codul QR de mai jos pentru a instala aplicația pe telefonul tău iPhone sau Android.",
            et: "Skänni allolevat QR-koodi, et installida äpp oma iPhone‘i või Androidi telefonisse.",
            ar: "قم بمسح رمز الاستجابة السريعة أدناه لتثبيت التطبيق على هاتفك الذكي الذي يعمل بنظام iPhone أو Android.",
            hi: "अपने iPhone या Android स्मार्टफोन पर ऐप इंस्टॉल करने के लिए नीचे दिए गए QR कोड को स्कैन करें।",
            el: "Σαρώστε τον κωδικό QR παρακάτω για να εγκαταστήσετε την εφαρμογή στο iPhone ή το smartphone Android σας.",
            max: 250
        },
        wannaShowNotifications: {
            en: "We'd like to show you notifications for the latest news and updates.",
            fr: "Nous aimerions vous montrer des notifications pour les dernières nouvelles et mises à jour.",
            es: "Nos gustaría mostrarte notificaciones de las últimas actualizaciones y noticias.",
            ru: "Мы хотели бы показывать вам уведомления о последних новостях и обновлениях.",
            uk: "Ми хочемо показувати вам сповіщення про останні новини та оновлення.",
            it: "Vorremmo mostrarti le notifiche per le ultime novità ed aggiornamenti.",
            pt: "Gostaríamos de mostrar notificações para nossas últimas atualizações.",
            sk: "Radi by sme vám zobrazovali upozornenia na najnovšie správy a aktualizácie.",
            cs: "Rádi bychom vám zobrazovali upozornění na nejnovější zprávy a aktualizace.",
            de: "Wir möchten Ihnen Benachrichtigungen für die neuesten Nachrichten und Updates anzeigen.",
            ja: "最新のニュースやアップデートの通知を表示したいと思います。",
            vi: "Chúng tôi muốn hiển thị cho bạn thông báo về những tin tức và cập nhật mới nhất.",
            sv: "Vi vill visa dig aviseringar om de senaste nyheterna och uppdateringarna.",
            bg: "Бихме искали да ви показваме известия за най-новите новини и актуализации.",
            zh: "我們希望向您顯示有關最新消息和更新的通知。",
            ko: "최신 뉴스 및 업데이트에 대한 알림을 표시하고자 합니다.",
            fi: "Haluamme näyttää sinulle ilmoituksia viimeisimmistä uutisista ja päivityksistä.",
            nl: "We willen je graag pushberichten sturen met het laatste nieuws en updates.",
            no: "Vi vil gjerne vise deg varsler for de siste nyhetene og oppdateringene.",
            tr: "En son haberler ve güncellemeler için size bildirimler göstermek istiyoruz.",
            pl: "Chcielibyśmy pokazywać Ci powiadomienia o najnowszych wiadomościach i aktualizacjach.",
            da: "Vi vil gerne vise dig notifikationer med seneste nyt og opdateringer.",
            sl: "Radi bi vam pokazali obvestila o najnovejših novicah in posodobitvah.",
            id: "Kami ingin menunjukkan kepada Anda pemberitahuan untuk berita dan pembaruan terkini.",
            he: "ברצוננו להציג לך התראות על חדשות והעדכונים האחרונים.",
            hr: "Željeli bismo vam pokazati obavijesti o najnovijim vijestima i ažuriranjima.",
            hu: "Szeretnénk neked értesítéseket megjeleníteni a legújabb hírekről és frissítésekről.",
            ro: "Am dori să îți trimitem notificări despre ultimele noutăți și actualizări.",
            et: "Soovime saata sulle teavitusi värskete uudiste ja uuenduste kohta.",
            ar: "نود أن نعرض لك إشعارات لآخر الأخبار والتحديثات.",
            hi: "हम आपको नवीनतम समाचार और अपडेट के लिए सूचनाएं दिखाना चाहते हैं।",
            el: "Θα θέλαμε να σας δείχνουμε ειδοποιήσεις για τα πιο πρόσφατα νέα και ενημερώσεις.",
            max: 250
        },
        wannaSuggestApp: {
            en: "Get quick access to our app — install it on your device now.",
            fr: "Accédez rapidement à notre application — installez-la maintenant sur votre appareil.",
            es: "Para acceder más fácilmente, instala la app en tu dispositivo digital.",
            ru: "Получите быстрый доступ к нашему приложению — установите его прямо сейчас на свое устройство.",
            uk: "Отримайте швидкий доступ до нашої програми — встановіть її зараз на своєму пристрої.",
            it: "Ottieni un rapido accesso alla nostra app: installala ora sul tuo dispositivo.",
            pt: "Obtenha acesso rápido ao nosso aplicativo — instale-o agora no seu dispositivo.",
            sk: "Získajte rýchly prístup k našej aplikácii — nainštalujte si ju teraz do svojho zariadenia.",
            cs: "Získejte rychlý přístup k naší aplikaci — nainstalujte si ji nyní do svého zařízení.",
            de: "Erhalten Sie schnellen Zugriff auf unsere App — installieren Sie sie jetzt auf Ihrem Gerät.",
            ja: "アプリにすばやくアクセスできます—今すぐデバイスにインストールしてください。",
            vi: "Truy cập nhanh vào ứng dụng của chúng tôi — cài đặt ngay trên thiết bị của bạn.",
            sv: "Få snabb åtkomst till vår app — installera den nu på din enhet.",
            bg: "Получете бърз достъп до нашето приложение — инсталирайте го сега на вашето устройство.",
            zh: "快速訪問我們的應用程序 — 立即將其安裝在您的設備上。",
            ko: "앱에 빠르게 액세스하세요. 지금 기기에 설치하세요.",
            fi: "Pääset nopeasti sovellukseemme — asenna se nyt laitteellesi.",
            nl: "Krijg snel toegang tot onze app — installeer deze nu op je apparaat.",
            no: "Få rask tilgang til appen vår — installer den nå på enheten din.",
            tr: "Uygulamamıza hızlıca erişin — hemen cihazınıza yükleyin.",
            pl: "Uzyskaj szybki dostęp do naszej aplikacji — zainstaluj ją na swoim urządzeniu już teraz.",
            da: "Få hurtig adgang til vores app – installér den på din enhed nu.",
            sl: "Zagotovite si hiter dostop do naše aplikacije – namestite jo v svojo napravo zdaj.",
            id: "Dapatkan akses cepat ke aplikasi kami — instal di perangkat Anda sekarang.",
            he: "קבל גישה מהירה לאפליקציה שלנו - התקן אותה במכשיר שלך עכשיו.",
            hr: "Brzo pristupite našoj aplikaciji — instalirajte je na svoj uređaj sada.",
            hu: "A jobb élményhez és könnyebb eléréshez - telepítsd az alkalmazásunkat.",
            ro: "Accesează rapid aplicația - instaleaz-o pe dispozitivul tău.",
            et: "Pääse meie äpile kiiresti ligi – installi see oma seadmesse.",
            ar: "احصل على وصول سريع إلى تطبيقنا - قم بتثبيته على جهازك الآن.",
            hi: "हमारे ऐप को तुरंत एक्सेस करने के लिए इसे अभी अपने डिवाइस पर इंस्टॉल करें।",
            el: "Αποκτήστε γρήγορη πρόσβαση στην εφαρμογή μας — εγκαταστήστε την στη συσκευή σας τώρα.",
            max: 250
        },
        notNow: {
            en: "Not now",
            fr: "Pas maintenant",
            es: "Ahora no",
            ru: "Не сейчас",
            uk: "Не зараз",
            it: "Non adesso",
            pt: "Agora não",
            sk: "Teraz nie",
            cs: "Teď ne",
            de: "Nicht jetzt",
            ja: "今は結構です",
            vi: "Không phải bây giờ",
            sv: "Inte nu",
            bg: "Не сега",
            zh: "現在不要",
            ko: "지금은 아닙니다",
            fi: "Ei nyt",
            nl: "Niet nu",
            no: "Ikke nå",
            tr: "Şimdi değil",
            pl: "Nie teraz",
            da: "Ikke nu",
            sl: "Pozneje",
            id: "Tidak sekarang",
            he: "לא עכשיו",
            hr: "Ne sada",
            hu: "Most nem",
            ro: "Nu acum",
            et: "Mitte praegu",
            ar: "ليس الآن",
            hi: "अभी नहीं",
            el: "Οχι τώρα",
            max: 40
        },
        newsfeed: {
            en: "Newsfeed",
            fr: "Actualités",
            es: "Actualizaciones",
            ru: "Лента новостей",
            uk: "Стрічка новин",
            it: "Rassegna stampa",
            pt: "Atualizações",
            sk: "Správy",
            cs: "Zprávy",
            de: "Neuigkeiten",
            ja: "ニュースフィード",
            vi: "Dòng thời gian",
            sv: "Nyhetsflöde",
            bg: "Новини",
            zh: "新聞動態",
            ko: "뉴스 피드",
            fi: "Uutissyöte",
            nl: "Nieuwsfeed",
            no: "Nyhetsstrøm",
            tr: "Haber akışı",
            pl: "Aktualności",
            da: "Nyhedsfeed",
            sl: "Novičarski vir",
            id: "Berita Terbaru",
            he: "פיד חדשות",
            hr: "Novosti",
            hu: "Hírfolyam",
            ro: "Știri",
            et: "Uudisvoog",
            ar: "تغذية الأخبار",
            hi: "समाचार फ़ीड",
            el: "Ροή ειδήσεων",
            max: 20
        },
        notifications: {
            en: "Notifications",
            fr: "Notifications",
            es: "Notificaciones",
            ru: "Уведомления",
            uk: "Сповіщення",
            it: "Notifiche",
            pt: "Notificações",
            sk: "Upozornenia",
            cs: "Oznámení",
            de: "Benachrichtigungen",
            ja: "通知",
            vi: "Thông báo",
            sv: "Aviseringar",
            bg: "Известия",
            zh: "通知",
            ko: "알림",
            fi: "Ilmoitukset",
            nl: "Meldingen",
            no: "Varsler",
            tr: "Bildirimler",
            pl: "Powiadomienia",
            da: "Underretninger",
            sl: "Obvestila",
            id: "Notifikasi",
            he: "התראות",
            hr: "Obavijesti",
            hu: "Értesítések",
            ro: "Notificări",
            et: "Teavitused",
            ar: "إشعارات",
            hi: "सूचनाएं",
            el: "Ειδοποιήσεις"
        },
        y: {
            en: "X year[s] ago",
            fr: "Il y a X an[s]",
            es: "Hace X año[s]",
            ru: "X лет назад",
            uk: "X років тому",
            it: "X anno[i] fa",
            pt: "Há X ano[s]",
            sk: "Pred X rokmi",
            cs: "Před X lety",
            de: "Vor X Jahr[en]",
            ja: "X年前",
            vi: "X năm trước",
            sv: "För X år sedan",
            bg: "Преди X години",
            zh: "X年前",
            ko: "X년 전",
            fi: "X vuott[a] sitten",
            nl: "X jaar geleden",
            no: "X år siden",
            tr: "X yıl önce",
            pl: "X lat temu",
            da: "For X år siden",
            sl: "Pred X leti",
            id: "X tahun yang lalu",
            he: "לפני X שנים",
            hr: "Prije X godina",
            hu: "X év[vel] ezelőtt",
            ro: "Acum X ani",
            et: "X aastat tagasi",
            ar: "منذ X سنوات",
            hi: "X साल पहले",
            el: "πριν από X έτο[ς]",
            max: 40
        },
        m: {
            en: "X month[s] ago",
            fr: "Il y a X mois",
            es: "Hace X mes[es]",
            ru: "X месяцев назад",
            uk: "X місяців тому",
            it: "X mese[i] fa",
            pt: "Há X mês[es]",
            sk: "Pred X mesiacmi",
            cs: "Před X měsíci",
            de: "Vor X Monat[en]",
            ja: "Xヶ月前",
            vi: "X tháng trước",
            sv: "För X månad[er] sedan",
            bg: "Преди X месеца",
            zh: "X個月前",
            ko: "X개월 전",
            fi: "X kuukautta sitten",
            nl: "X maand[en] geleden",
            no: "X måned[er] siden",
            tr: "X ay önce",
            pl: "X miesięcy temu",
            da: "For X måned[er] siden",
            sl: "Pred X meseci",
            id: "X bulan yang lalu",
            he: "לפני X חודשים",
            hr: "Prije X mjeseci",
            hu: "X hónappal ezelőtt",
            ro: "Acum X luni",
            et: "X kuud tagasi",
            ar: "منذ X أشهر",
            hi: "X महीने पहले",
            el: "πριν από X μήνα[ς]",
            max: 40
        },
        d: {
            en: "X day[s] ago",
            fr: "Il y a X jour[s]",
            es: "Hace X día[s]",
            ru: "X дней назад",
            uk: "X днів тому",
            it: "X giorno[i] fa",
            pt: "Há X dia[s]",
            sk: "Pred X dňami",
            cs: "Před X dny",
            de: "Vor X Tag[en]",
            ja: "X日前",
            vi: "X ngày trước",
            sv: "För X dag[ar] sedan",
            bg: "Преди X дни",
            zh: "X天前",
            ko: "X일 전",
            fi: "X päivää sitten",
            nl: "X dag[en] geleden",
            no: "X dag[er] siden",
            tr: "X gün önce",
            pl: "X dni temu",
            da: "For X dag[e] siden",
            sl: "Pred X dnevi",
            id: "X hari yang lalu",
            he: "לפני X ימים",
            hr: "Prije X dana",
            hu: "X nappal ezelőtt",
            ro: "Acum X zile",
            et: "X päeva tagasi",
            ar: "منذ X أيام",
            hi: "X दिन पहले",
            el: "πριν από X ημέρα[ς]",
            max: 40
        },
        h: {
            en: "X hour[s] ago",
            fr: "Il y a X heure[s]",
            es: "Hace X hora[s]",
            ru: "X часов назад",
            uk: "X годин тому",
            it: "X ora[e] fa",
            pt: "Há X hora[s]",
            sk: "Pred X hodinami",
            cs: "Před X hodinami",
            de: "Vor X Stund[en]",
            ja: "X時間前",
            vi: "X giờ trước",
            sv: "För X timm[ar] sedan",
            bg: "Преди X часа",
            zh: "X小時前",
            ko: "X시간 전",
            fi: "X tuntia sitten",
            nl: "X uur geleden",
            no: "X time[r] siden",
            tr: "X saat önce",
            pl: "X godzin temu",
            da: "For X time[r] siden",
            sl: "Pred X urami",
            id: "X jam yang lalu",
            he: "לפני X שעות",
            hr: "Prije X sati",
            hu: "X órával ezelőtt",
            ro: "Acum X ore",
            et: "X tundi tagasi",
            ar: "منذ X ساعات",
            hi: "X घंटे पहले",
            el: "πριν από X ώρα[ς]",
            max: 40
        },
        mm: {
            en: "X minute[s] ago",
            fr: "Il y a X minute[s]",
            es: "Hace X minuto[s]",
            ru: "X минут назад",
            uk: "X хвилин тому",
            it: "X minut[i] fa",
            pt: "Há X minuto[s]",
            sk: "Pred X minútami",
            cs: "Před X minutami",
            de: "Vor X Minut[en]",
            ja: "X分前",
            vi: "X phút trước",
            sv: "För X minut[er] sedan",
            bg: "Преди X минути",
            zh: "X分鐘前",
            ko: "X분 전",
            fi: "X minuuttia sitten",
            nl: "X minuten geleden",
            no: "X minutt[er] siden",
            tr: "X dakika önce",
            pl: "X minut temu",
            da: "For X minut[ter] siden",
            sl: "Pred X minutami",
            id: "X menit yang lalu",
            he: "לפני X דקות",
            hr: "Prije X minuta",
            hu: "X perccel ezelőtt",
            ro: "Acum X minute",
            et: "X minutit tagasi",
            ar: "منذ X دقائق",
            hi: "X मिनट पहले",
            el: "πριν από X λεπτά",
            max: 40
        },
        ss: {
            en: "Just now",
            fr: "À l'instant",
            es: "Justo ahora",
            ru: "Только что",
            uk: "Щойно",
            it: "Proprio adesso",
            pt: "Agora mesmo",
            sk: "Práve teraz",
            cs: "Právě teď",
            de: "Gerade eben",
            ja: "ちょうど今",
            vi: "Vừa xong",
            sv: "Just nu",
            bg: "Току-що",
            zh: "剛剛",
            ko: "방금",
            fi: "Juuri nyt",
            nl: "Zojuist",
            no: "Akkurat nå",
            tr: "Az önce",
            pl: "Właśnie teraz",
            da: "Lige nu",
            sl: "Pravkar",
            id: "Baru saja",
            he: "הרגע",
            hr: "Upravo sada",
            hu: "Éppen most",
            ro: "Chiar acum",
            et: "Just nüüd",
            ar: "الآن فقط",
            hi: "अभी अभी",
            el: "μόλις τώρα",
            max: 40
        },
        noneYet: {
            en: "Nothing here just yet",
            fr: "Rien ici pour l'instant",
            es: "Nada aquí todavía",
            ru: "Пока ничего нет",
            uk: "Поки що нічого",
            it: "Niente qui per ora",
            pt: "Nada aqui ainda",
            sk: "Zatiaľ nič tu",
            cs: "Zatím nic tady",
            de: "Noch nichts hier",
            ja: "まだ何もありません",
            vi: "Chưa có gì ở đây",
            sv: "Inget här än",
            bg: "Все още нищо тук",
            zh: "這裡還沒有任何東西",
            ko: "아직 아무것도 없음",
            fi: "Ei vielä mitään täällä",
            nl: "Nog niets hier",
            no: "Ingenting her ennå",
            tr: "Henüz burada hiçbir şey yok",
            pl: "Jeszcze nic tutaj",
            da: "Intet her endnu",
            sl: "Nič tukaj še",
            id: "Belum ada apa-apa di sini",
            he: "עדיין אין כאן כלום",
            hr: "Još nema ništa ovdje",
            hu: "Még semmi sincs itt",
            ro: "Nimic aici deocamdată",
            et: "Siin pole veel midagi",
            ar: "لا يوجد شيء هنا حتى الآن",
            hi: "यहां अभी कुछ भी नहीं है",
            el: "Τίποτα εδώ ακόμα",
            max: 40
        }
    };
    this.supportedLanguages = function() {
        var e = [];
        for (var t in n.strings) {
            for (var i in n.strings[t]) {
                if (e.includes(i) || i === "max") {
                    continue
                }
                e.push(i)
            }
        }
        return e
    };
    this.setLanguage = function(e) {
        var t = n.supportedLanguages();
        if (!t.includes(e)) {
            return
        }
        n.parent.cookies.set(n.cookieName, e, 720)
    };
    this.getLanguage = function() {
        return n.parent.cookies.get(n.cookieName) || null
    };
    this.getForced = function() {
        try {
            var e = n.parent.data.params.forcedLanguage;
            if (e === "none") {
                return null
            }
            return e
        } catch (t) {
            return null
        }
    };
    this.language = function() {
        var t = (n.getForced() || n.getLanguage() || navigator.language || navigator.userLanguage || "en").toLowerCase();
        if (t === "nn" || t === "nb") {
            t = "no"
        }
        var i = "";
        n.supportedLanguages().forEach(function(e) {
            if (i) {
                return
            }
            if (e === t || t.includes(e + "-")) {
                i = e
            }
        });
        return i
    };
    this.get = function(e) {
        var t = n.language();
        if (!n.strings[e]) {
            throw "This textId does not exist"
        }
        return n.strings[e][t] || n.strings[e].en
    };
    this.rtl = function() {
        var e = n.language();
        return e === "he" || e === "ar"
    }
}

function ProgressierReloadPrompt(e) {
    var a = this;
    this.parent = e;
    this.loadTime = new Date;
    this.timer = null;
    this.displayAfter = null;
    this.element = null;
    this.check = function() {
        var e = new Date;
        var t = parseInt(Math.abs(e.getTime() - a.loadTime.getTime()) / (1e3 * 60));
        if (t < a.displayAfter) {
            return
        }
        if (a.autoReload) {
            a.reloadPage()
        } else {
            a.show()
        }
        clearInterval(a.timer)
    };
    this.reloadPage = function() {
        window.location.reload(true)
    };
    this.show = function(e) {
        var t = e || progressier.data.params.reloadPromptColor || "#1a73e8";
        var i = a.parent.utils.node("div", {
            parent: document.querySelector("body"),
            style: `display:flex;position:fixed;top:0px;left:0px;width:100vw;height:100vh;z-index:2147483647 !important;background:rgba(0,0,0,0.33);align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif !important;`,
            click: a.reloadPage
        });
        var n = `<style>.progressier-prompt-reload-button:hover{filter:brightness(0.9);}</style><div>`;
        n += a.parent.wording.get("tapToReload");
        n += `</div>`;
        a.parent.utils.node("div", "progressier-prompt-reload-button", {
            parent: i,
            html: n,
            style: `cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;background:` + t + `;position:fixed;bottom:20px;padding: 10px 20px;border-radius:20px;font-size: 12px;font-weight: 600;`
        })
    };
    this.init = async function() {
        a.displayAfter = await a.parent.data.get("reloadPromptTime");
        a.autoReload = await a.parent.data.get("reloadPromptAuto");
        if (!a.displayAfter || typeof a.displayAfter !== "number" || a.displayAfter < 30) {
            return
        }
        a.timer = setInterval(a.check, 3e4)
    };
    a.init()
}

function ProgressierFlow(e) {
    var g = this;
    this.parent = e;
    this.captured = false;
    this.installation = false;
    this.subscription = false;
    this.source = null;
    this.className = g.parent.utils.randomId(10);
    this.styling = `
		.` + g.className + `{z-index:2147483645 !important;display:flex;align-items:center;justify-content:center;position:fixed;top:0px;left:0px;width:100vw;height:100vh;}
		.` + g.className + ` *{text-align:start;color:var(--progressierTxt) !important;font-family:var(--progressierFont) !important; font-weight:var(--progressierTextFontWeight); letter-spacing:var(--progressierLetterSpacing);line-height:26px;font-size:15px !important;-webkit-box-sizing: content-box !important;-moz-box-sizing: content-box !important; box-sizing: content-box !important;}
		.` + g.className + ` svg path[fill="currentColor"]{fill:currentColor !important;}
		.` + g.className + ` svg path[fill="rgb(0,122,255)"]{fill:rgb(0,122,255) !important;}
		.` + g.className + ` svg path[fill="none"]{fill:none !important;}
		.` + g.className + `-inner{overflow:hidden;position:relative;background:var(--progressierBg);width:100%;max-width:500px;max-height:500px;border-radius:20px;justify-content: center; align-items: center; display: flex; flex-direction: column;min-height:250px;border:1px solid var(--progressierBorderColor);}
		.` + g.className + `-btn svg{margin-right:10px;width:18px;height:18px;flex:none;color:inherit !important;}
		.` + g.className + `[dir="rtl"] .` + g.className + `-btn svg{margin-left:10px;margin-right:10px;}
		.` + g.className + `-btn svg *{color:inherit !important;}
		.` + g.className + `-btn *{color:inherit !important;}
		.` + g.className + `-header{display:flex;justify-content:space-between;align-items:center;width:90%;position:relative;padding:20px;}
		.` + g.className + `-details{  display: flex; align-items: center; width: calc(90% - 40px); border: 1px solid var(--progressierBorderColor); justify-content: flex-start; padding: 20px; border-radius: 5px;background:var(--progressierElement);}
		.` + g.className + `-text{width:100%;}
		.` + g.className + `-text >div{ white-space: nowrap; overflow: hidden; max-width: 90%; text-overflow: ellipsis; }
		.` + g.className + `-text > div:first-child{ font-weight:600 !important; }
		.` + g.className + `-text > div:nth-child(2){ font-size:13px !important; }
		.` + g.className + `-close{border-radius: 50%; width:40px;height: 40px; display: flex; align-items: center; justify-content: center;cursor:pointer;margin-right: -10px;}
		.` + g.className + `[dir="rtl"] .` + g.className + `-close{margin-left:-10px;margin-right:0px;}
		.` + g.className + `-close:hover{background:var(--progressierHover);}
		.` + g.className + `-close.hide-close{display:none !important;}
		.` + g.className + `-title{ font-weight: var(--progressierHeadingFontWeight) !important;  font-size: 17px !important; }
		.` + g.className + `-li{flex-wrap:wrap;margin:10px 0px;display: inline-block;position: relative;    line-height: 30px;}
		.` + g.className + `-li svg{width: 13px;height:13px; flex: none; padding: 3px; border-radius: 3px; margin-left: 5px; margin-right:5px;}
		.` + g.className + `-li.small svg{margin-bottom:-5px;}
		.` + g.className + `-li span{  font-size: 0.8em !important; white-space: nowrap; padding: 0px 10px; border-radius: 5px; margin-left: 5px; margin-right:5px;display: inline-flex; align-items: center;}
		.` + g.className + `-li span > svg{margin:0px;padding:0px;width:19px;height:19px;margin-left:-4px;margin-right:5px;border:0px;}
		.` + g.className + `[dir="rtl"] .` + g.className + `-li span > svg{margin-right:-4px;margin-left:5px;}
		.` + g.className + `-li svg, .` + g.className + `-li span{  background: var(--progressierElement); border: 1px solid var(--progressierBorderColor); font-weight: 600 !important;line-height:20px; }
		.` + g.className + `-li:first-child:last-child{ justify-content:center; margin-top:20px; }
		.` + g.className + `-li[data-li]{ padding-left: 40px; width:90%;}
		.` + g.className + `[dir="rtl"] .` + g.className + `-li[data-li]{padding-right:40px;padding-left:0px;}
		.` + g.className + `-li[data-li]:before{ content: attr(data-li); margin-right: 10px; width: 20px; display: inline-flex; border-radius: 50%; padding: 0px; font-weight: 600 !important; justify-content: flex-start; position: absolute; margin-left: -30px; top: 0px; height: 100%; line-height:26px;}
		.` + g.className + `[dir="rtl"] .` + g.className + `-li[data-li]:before{margin-right:-30px;margin-left:10px;}
		.` + g.className + `-li.dashed{margin-top: 0px!important; padding: 80px 0px; display: flex;  font-weight: 600 !important;}
		.` + g.className + `-li.dashed-clicked{ border:3px dashed var(--progressierBorderColor); margin-top: 0px!important; height:200px; display: flex; font-weight:600 !important; cursor:pointer; flex-direction: column-reverse; align-items: center;}
		.` + g.className + `-li.dashed-clicked svg{ background:transparent !important; border:0px !important; margin-bottom:10px; width:25px; height:25px; margin-top:10px;}
		.` + g.className + `-li.dashed-clicked:hover{ background:var(--progressierHover); }
		.` + g.className + `-li.dashed-clicked *{font-weight:600 !important;}
		.` + g.className + `-li.dashed-clicked.loading{ pointer-events:none; opacity:0.8; }
		.` + g.className + `-li.dashed-clicked .` + g.className + `-loading-icon{ width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;  position: relative;}
		.` + g.className + `-li.dashed-clicked .` + g.className + `-loading-icon svg{width:35px;height:35px;margin: 0px !important;padding:0px !important;}
		.` + g.className + `-li.dashed-clicked.loading > *:not(.` + g.className + `-loading-icon){ display:none !important; }
		.` + g.className + `-li.dashed-clicked:not(.loading) .` + g.className + `-loading-icon{ display:none; }
		.` + g.className + `-li.bold{	text-align: center; width: 100%; font-weight: 600 !important;}
		.` + g.className + `-li.small{  margin-top:10px !important;width:100%; }
		.` + g.className + `-li.small *{font-size:14px !important;}
		.` + g.className + `-li > div{display:flex;flex-wrap:wrap;align-items:center;}
		.` + g.className + `-li.small > div{display:block;text-align:center;}
		.` + g.className + `-li.bold > div{justify-content:center;flex-wrap:wrap;}
		.` + g.className + `-li.second-btn{background: var(--progressierElement); width: 100%; height: 50px; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 0px; margin-left: 0%;}
		.` + g.className + `-li.second-btn *{color:inherit !important;}
		.` + g.className + `-li svg ~ span{margin-left: -9px; height: 19px; display: inline-flex; align-items: center; justify-content: center;border-left:0px;padding-left:7px;z-index:2;padding-right:6px;}
		.` + g.className + `[dir="rtl"] .` + g.className + `-li svg ~ span{margin-right:-9px;margin-left:0px;}
		*[dir="rtl"] .` + g.className + `-li svg ~ span{border-right:0px;}
		.` + g.className + `-li > div span ~ svg{margin-leftt: -16px; height: 14px; border-left: 0px; padding-left: 7px; z-index: 2;padding-right:8px;}
		.` + g.className + `[dir="rtl"] .` + g.className + `-li > div span ~ svg{margin-right:-16px;margin-left:0px;}
		.` + g.className + `-li svg{display:inline-flex !important;max-width:none !important;-webkit-box-sizing: content-box !important;-moz-box-sizing: content-box !important; box-sizing: content-box !important;}
		.` + g.className + `-content{ width:90%; margin:10px 0px; }
		.` + g.className + `-img{ position: relative; width: 55px; height: 55px; border-radius: 10px; overflow: hidden; flex: none;}
		.` + g.className + `-li .apple-share-sheet-icon{display:flex;}
		.` + g.className + `-li .apple-share-sheet-icon svg{width:17px;height:17px;}
		.` + g.className + `-img img{ width: 100%; height: 100%; flex: none; display:inline-flex;position:relative !important;}
		.` + g.className + `-text{ margin-left:20px;display:flex;flex-direction:column; }	
		.` + g.className + `[dir="rtl"] .` + g.className + `-text{margin-right:20px;margin-left:0px;}
		.` + g.className + `[dir="rtl"] .progressier-absolute-line-end-icon{right:unset !important;left:10px !important;}
		.` + g.className + ` div a{ display: inline !important; font-weight:600 !important; margin-left: 4px !important; color:#ff5252 !important; background:transparent !important; border:0px !important; outline:0px !important; }
		.` + g.className + ` div strong{font-weight:600 !important;}
		.` + g.className + ` div a:after{display:none !important;}
		.` + g.className + ` div a:before{display:none !important;}
		.` + g.className + `-more{  width: 100%; padding: 20px; border-top: 1px solid var(--progressierBorderColor); background:var(--progressierElement); display:flex; align-items:center; justify-content:center; text-align:center;}
		.` + g.className + `-more > div{ width:calc(90% - 10px); font-size: 0.8em !important; }
		.` + g.className + `-more span{ background: var(--progressierElement); border: 1px solid var(--progressierBorderColor); font-size: 0.8em !important;  font-weight: 600; padding: 2px 4px;}
		.` + g.className + `-btn{width:90%;height:50px;border-radius:10px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;font-weight:var(--progressierBtnFontWeight) !important;cursor:pointer;color:#fff !important;background:var(--progressierTxt) !important;position:relative;}
		.` + g.className + `-inline-logo{flex:none;width:26px;height:26px;border-radius:7px;margin-left:8px;margin-right:8px; margin-top: 0px;position:relative !important;}
		.` + g.className + `-btn:hover{filter:brightness(0.9) !important;}
		.` + g.className + `-loader{width:50px;flex:none;position: absolute;height:50px;}
		.` + g.className + `-loader svg{width:50px;flex:none;height:50px;}
		.` + g.className + `-inner.qrcode .` + g.className + `-details{display:none !important;}
		.` + g.className + `-inner.qrcode .` + g.className + `-content{margin-top:-10px;}
		.` + g.className + `-qr{height:250px;width:250px;display:flex;justify-content:center;align-items:center;margin-top:-10px;margin-bottom:20px;position:relative;}
		.` + g.className + `-qr:after{content:"";background:var(--progressierElement);    animation-duration: 1.25s; animation-fill-mode: forwards; animation-iteration-count: infinite; animation-name: qrcodeplaceholder; animation-timing-function: linear; background: var(--progressierElement); background: linear-gradient(to right, var(--progressierElement) 10%, var(--progressierBorderColor) 18%, var(--progressierElement) 33%); background-size: 800px 230px; height: 210px; width:210px; position: relative;}
		.` + g.className + `-checkbox-els{padding:10px 20px 0px 20px;}
		.` + g.className + `-checkbox-el{display:flex;margin-bottom:13px;cursor:pointer;position:relative;align-items:center;}
		.` + g.className + `-checkbox-el input{ display:none;}
		.` + g.className + `-checkbox-el:before{ content: ""; width: 22px; height: 22px; margin-inline-end:20px;display:inline-block; border-radius:5px; background:#ececec;background: var(--progressierElement);
		border: 1px solid var(--progressierBorderColor);}
		.` + g.className + `-checkbox-el > span, .` + g.className + `-checkbox-el > span svg{width:20px; height:20px;position:absolute;left:1px;color:#fff;top:1px;}
		.` + g.className + `[dir="rtl"] .` + g.className + `-checkbox-el > span, .` + g.className + `[dir="rtl"] .` + g.className + `-checkbox-el > span svg{right:1px;left:unset;}
		.` + g.className + `-checkbox-el > span svg, .` + g.className + `-checkbox-el > span svg *{color:#fff !important;}
		.` + g.className + `-checkbox-el[data-checked="true"]:before{ background:#6ceeff;border-color:#6ceeff;}
		.` + g.className + `-checkbox-el:not([data-checked="true"]) > span{ display:none !important;}
		@keyframes qrcodeplaceholder{ 0%{  background-position: -468px 0 } 100%{  background-position: 468px 0 }}
		.` + g.className + `-qr img{width:250px;height:250px;position:relative;}
		@media (min-width:992px){
			.` + g.className + `-inner{min-height:200px;}
			.` + g.className + `-inner.qrcode{max-height:700px !important;}
			.` + g.className + `-inner.qrcode .` + g.className + `-li *{text-align:center;}
			.` + g.className + `-li.second-btn{margin-bottom:0px;width:100%;margin-left:0%;}
			.` + g.className + `[dir="rtl"] .` + g.className + `-li.second-btn{margin-left:0%;margin-right:0%;}
			.` + g.className + `-header{padding:10px 20px 10px 20px;}
		}
		@media (max-width:991px){
			.` + g.className + `-inner{background:var(--progressierBg);border-radius:0px;border-top-left-radius:40px;border-top-right-radius:40px;height:unset;max-height:unset;width:100%;position:absolute;bottom:0px;left:0px;max-width:100%;justify-content:flex-end;box-shadow:var(--progressierBoxShadow);padding-bottom:120px;padding-bottom:calc(100vh - 100svh);min-height:210px;}
			body.progressier-standalone .` + g.className + `-inner{padding-bottom:40px;}
			body.progressier-standalone .` + g.className + `-inner.iosviewportcover{padding-bottom:30px;padding-top:10px;}
			.` + g.className + `-inner.loading{min-height:260px;}
			.` + g.className + `-li.dashed-clicked{background:var(--progressierElement);}
			.` + g.className + `-content, .` + g.className + `-header, .` + g.className + `-btn{width:85%;}
			.` + g.className + `-content{margin: 10px 0px 20px 0px;}
			.` + g.className + `-details{width:calc(85% - 40px);}
			.` + g.className + `-loader{top:100px;}
			.` + g.className + `-inner{justify-content:flex-start !important;border:0px !important;}
			.` + g.className + `-img.bordered{ box-shadow: var(--progressierIconShadow);background:#fff;}
			.` + g.className + `-inline-logo{box-shadow: var(--progressierIconShadow); -webkit-box-shadow: var(--progressierIconShadow);}
			.` + g.className + `-text{width:85%;}
			.` + g.className + `-text >div{max-width: 55vw;}
			.` + g.className + `-more{margin-bottom:-10px;}
		}
		@media (max-height:500px){
			.` + g.className + `-inner{border-radius:0px;}
		}
	`;
    this.getString = function(e) {
        return g.parent.wording.get(e)
    };
    this.isSamsungInternet = function() {
        return g.parent.detection.isSamsungInternet()
    };
    this.isIOS = function() {
        return g.parent.detection.isIOS()
    };
    this.isSafari = function() {
        return g.parent.detection.isSafari()
    };
    this.isFirefox = function() {
        return g.parent.detection.isFirefox()
    };
    this.isAndroid = function() {
        return g.parent.detection.isAndroid()
    };
    this.isChromeWindows = function() {
        if (!g.parent.detection.isWindows()) {
            return false
        }
        if (g.parent.detection.isEdge()) {
            return false
        }
        if (!g.parent.detection.isChrome()) {
            return false
        }
        return true
    };
    this.isChromeEdgeOnMacOs = function() {
        return g.parent.detection.isChromeEdgeOnMacOs()
    };
    this.preventAutoTranslate = function() {
        var e = document.querySelector("html");
        e.classList.add("notranslate");
        e.setAttribute("translate", "no")
    };
    this.waitInitialization = function() {
        return new Promise(function(e, t) {
            var i = setInterval(function() {
                if (!g.parent.initialized) {
                    return
                }
                clearInterval(i);
                return e()
            }, 100)
        })
    };
    this.isStandaloneHidden = function(t) {
        var e = g.options.find(e => e.id === t);
        if (!e) {
            return false
        }
        if (e.standaloneHidden) {
            return true
        }
        if (e.closesItself) {
            return false
        }
        return false
    };
    this.removeOnStandalone = function() {
        var e = function() {
            var e = (g.currentOption || "").includes("install");
            if (progressier["native"].standalone && g.isChromeEdgeOnMacOs() && e) {
                g.render("confirm-dock-add");
                clearInterval(t);
                return
            }
            if (progressier["native"].standalone && g.isChromeWindows() && e) {
                g.render("add-to-task-bar");
                clearInterval(t);
                return
            } else if (progressier["native"].standalone && g.isStandaloneHidden(g.currentOption)) {
                g.remove();
                clearInterval(t);
                return
            }
        };
        var t = setInterval(e, 500);
        e()
    };
    this.goInstall = async function() {
        var e = await progressier["native"].installationStatus();
        if (!e || e === "noengag") {
            return
        }
        var t = await progressier["native"].install();
        if (!t) {
            g.render("install-ready")
        }
    };
    this.install = async function() {
        var e = setInterval(function() {
            if (!window.progressier || !window.progressier["native"] || !window.progressier["native"].installationStatus || !window.progressier["native"].install) {
                return
            }
            g.goInstall();
            clearInterval(e)
        }, 200)
    };
    this.isLastStepDesktop = function() {
        if (!progressier["native"].standalone) {
            return false
        }
        if (!g.parent.detection.isDesktop()) {
            return false
        }
        if (!["confirm-dock-add", "add-to-task-bar"].includes(g.currentOption || "") && !g.parent.detection.isEdge()) {
            return false
        }
        return true
    };
    this.remove = async function() {
        if (!g.element || !g.element.remove) {
            return
        }
        g.element.remove();
        window.name = "";
        var e = new URL(window.location.href);
        e.searchParams["delete"]("pswutlzoq");
        progressier.utils.backdrop.hide();
        window.history.replaceState({}, document.title, e.href);
        g.functionalityEnabled = false;
        try {
            if (progressier.data.params.forceRefreshPostInstall && progressier.data.params.startUrl && g.isLastStepDesktop()) {
                window.location.href = window.location.origin + "/" + progressier.data.params.startUrl
            }
        } catch (t) {}
    };
    this.appLogo = function() {
        try {
            return g.parent.data.getDisplayableLogo()
        } catch (e) {
            return ""
        }
    };
    this.smallLogo = function() {
        return `<img alt="app icon" class="` + g.className + `-inline-logo" src="` + g.appLogo() + `"  style="color:transparent !important;"/>`
    };
    this.getBestAlternativeBrowser = function() {
        try {
            var e = g.isIOS();
            if (e) {
                return "Safari"
            } else {
                return "Chrome"
            }
        } catch (t) {
            return "Chrome"
        }
    };
    this.getBestInstallIcon = function() {
        try {
            var e = window.screen.width > 991;
            if (!e) {
                return g.parent.utils.svg_install_mobile()
            }
            var t = g.parent.detection.isEdge();
            if (t) {
                return g.parent.utils.svg_install_edge()
            }
            return g.parent.utils.svg_install_desktop()
        } catch (i) {
            return g.parent.utils.svg_install_desktop()
        }
    };
    this.rerenderSamsung = function() {
        g.rerenderInstalled();
        g.tryAutoPromptInstall()
    };
    this.rerenderInstalled = function() {
        if (g.testing) {
            return
        }
        var e = setInterval(function() {
            if (!progressier["native"].installed) {
                return
            }
            if (!g.isAndroid()) {
                return
            }
            g.render("already-installed");
            clearInterval(e)
        }, 1e3)
    };
    this.rerenderInstall = function() {
        if (g.testing) {
            return
        }
        var e = setInterval(function() {
            if (!progressier["native"].installable) {
                return
            }
            g.render("install-ready");
            clearInterval(e)
        }, 1e3)
    };
    this.tryAutoPromptInstall = function() {
        try {
            if (!progressier.detection.isAndroid()) {
                return
            }
            progressier["native"].install()
        } catch (e) {}
    };
    this.rerenderInstallAndInstalled = function() {
        g.rerenderInstalled();
        g.rerenderInstall()
    };
    this.renderPushCategories = function(e) {
        let t = g.parent.data.params.pushCategories || [];
        if (t.length < 1) {
            return
        }
        let i = g.parent.user.getDataLocally() || {};
        let n = i.selftagged;
        let r = [];
        if (i.tags && typeof i.tags === "object" && i.tags.length > 0) {
            r = i.tags
        }
        if (!n) {
            r = JSON.parse(JSON.stringify(t));
            setTimeout(function() {
                g.parent.user.add({
                    tags: t.join(","),
                    selftagged: true
                })
            }, 1500)
        }
        let a = e.querySelector("." + g.className + "-content");
        let s = progressier.utils.node("div", g.className + "-checkbox-els", {
            parent: a
        });
        r.forEach(function(e, t) {
            r[t] = e.trim()
        });
        t.forEach(function(i) {
            let e = r.includes(i);
            let t = "progressierpushtag" + i;
            let n = progressier.utils.node("label", g.className + "-checkbox-el", {
                "data-checked": e,
                "for": t,
                parent: s
            });
            let a = {
                type: "checkbox",
                id: t,
                parent: n,
                change: function(e) {
                    let t = e.currentTarget.checked ? i : "%" + i + "%";
                    n.setAttribute("data-checked", e.currentTarget.checked);
                    setTimeout(function() {
                        g.parent.user.add({
                            tags: t,
                            selftagged: true
                        })
                    }, 1500)
                }
            };
            if (e) {
                a.checked = true
            }
            progressier.utils.node("input", a);
            progressier.utils.node("div", {
                style: "max-width:80%;",
                html: i,
                parent: n
            });
            progressier.utils.node("span", {
                html: g.parent.utils.svg_simple_check(),
                parent: n
            })
        })
    };
    this.makeInstallReadyFunctionality = function(e) {
        g.tryAutoPromptInstall();
        var t = e.querySelector(".dashed-clicked");
        t.addEventListener("click", function() {
            t.classList.add("loading");
            g.install()
        });
        g.rerenderInstalled()
    };
    this.launchApp = function() {
        if (g.parent["native"].standalone) {
            window.location.href = g.parent.data.params.embedUrl
        } else {
            g.renderInstallation()
        }
    };
    this.goToPushResetTutorial = function() {
        let e = "6806398";
        if (g.parent.detection.supportsNativeiOSPush()) {
            e = "8978762"
        } else if (g.parent.detection.isStandalone() && g.parent.detection.isAndroid()) {
            e = "8462083"
        } else if (g.parent.detection.isStandalone() && g.parent.detection.isIOS()) {
            e = "8462095"
        } else if (g.parent.detection.isSafariWithPushOnMacOs()) {
            e = "8462093"
        } else if (g.parent.detection.isStandalone() && g.parent.detection.isDesktop()) {
            e = "8462094"
        } else if (g.parent.detection.isAndroid()) {
            e = "8462085"
        } else if (g.parent.detection.isDesktop()) {
            e = "8462091"
        }
        window.open("https://intercom.help/progressier/en/articles/" + e, "_blank")
    };
    this.copyCurrentPage = function(e) {
        e.currentTarget.innerHTML = progressier.utils.svg_check() + " " + g.getString("copied");
        var t = document.createElement("input");
        var i = new URL(window.location.href);
        i.searchParams["delete"]("progressierreferrer");
        i.searchParams.append("pswutlzoq", g.installation ? "install" : "subscribe");
        t.value = i.href;
        t.setAttribute("style", "opacity:0 !important;z-index:-1;position:fixed;bottom:-1000px;");
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        document.body.removeChild(t)
    };
    this.attemptOpeningViaProtocol = function() {
        g.parent.protocol.launchInstalledApp()
    };
    this.sendTestNotification = async function(e) {
        try {
            g.notificationTestClick += 1;
            if (g.notificationTestClick > 10) {
                return
            }
            let e = await progressier.sw.reg.pushManager.getSubscription();
            if (!e) {
                return g.render("push-blocked")
            }
            await g.parent.utils.lets("POST", progressier.fetchdomain + "/myapp/" + progressier.appId + "/test-notification", e);
            let t = document.querySelector("." + g.className + "-btn");
            if (!t) {
                return
            }
            t.innerHTML = `<span style="display:flex;justify-content:center;align-items:center;">` + g.parent.utils.svg_simple_check() + `</span>`;
            t.style.opacity = "0.5";
            t.style["pointer-events"] = "none"
        } catch (t) {
            console.log(t);
            g.remove()
        }
    };
    this.options = [{
        id: "install-ready",
        standaloneHidden: true,
        title: "installTheApp",
        fn: g.makeInstallReadyFunctionality,
        li: [{
            string: "tapToInstall",
            className: "dashed-clicked",
            add: g.getBestInstallIcon() + `<div class="` + g.className + `-loading-icon">` + g.parent.utils.svg_loader() + `</div>`
        }]
    }, {
        id: "already-installed",
        standaloneHidden: true,
        success: true,
        title: "installed",
        fn: function() {
            g.rerenderInstall();
            g.attemptOpeningViaProtocol()
        },
        li: [{
            string: window.screen.width > 991 ? "installFinished" : "openFromHome",
            className: "bold",
            icon: window.screen.width > 991 ? g.parent.utils.svg_open() : g.smallLogo
        }]
    }, {
        id: "incompatible",
        info: true,
        title: "incompatible",
        btnHtml: function() {
            return g.parent.utils.svg_copy() + g.getString("copyLink")
        },
        btnClick: g.copyCurrentPage,
        li: [{
            string: "incompatibleFunctionality",
            className: "small",
            icon: function() {
                return "<strong>" + g.getBestAlternativeBrowser() + "</strong>"
            }
        }]
    }, {
        id: "android-manual-install",
        standaloneHidden: true,
        title: "installTheApp",
        more: "noButtonRefresh",
        fn: g.rerenderInstallAndInstalled,
        li: [{
            string: "clickOnHamburgerMenu",
            icon: g.parent.utils.svg_more()
        }, {
            string: "select",
            icon: function() {
                return g.getBestInstallIcon() + `<span>` + g.getString("installApp") + `</span>`
            }
        }, {
            string: "openFromHome",
            icon: g.smallLogo
        }]
    }, {
        id: "desktop-manual-install",
        standaloneHidden: true,
        title: "installTheApp",
        more: "noButtonRefresh",
        noapp: true,
        fn: g.rerenderInstallAndInstalled,
        li: [{
            string: "clickOnIconUrlBar",
            className: "dashed",
            icon: g.getBestInstallIcon()
        }]
    }, {
        id: "samsung-install",
        standaloneHidden: true,
        title: "installTheApp",
        more: "cantSeeSam",
        fn: g.rerenderSamsung,
        li: [{
            string: "tapOnUrl",
            icon: g.parent.utils.svg_samsung_install()
        }, {
            string: "openFromHome",
            icon: g.smallLogo
        }]
    }, {
        id: "ios-install",
        standaloneHidden: true,
        title: "installTheApp",
        li: [{
            string: "tapOn",
            icon: g.parent.utils.svg_apple_share(g.parent.detection.isSafari())
        }, {
            string: "scrollAndSelect",
            icon: function() {
                return `<span>` + g.getString("addToHomeScreen") + `</span>`
            }
        }, {
            string: "openFromHome",
            icon: g.smallLogo
        }]
    }, {
        id: "macos-safari-install",
        standaloneHidden: true,
        title: "installTheApp",
        li: [{
            string: "addToDockMac",
            className: "small"
        }]
    }, {
        id: "push-blocked",
        error: true,
        icon: "error",
        title: "blocked",
        btnHtml: function() {
            return `<span style="position:absolute;right:10px;display:flex;justify-content:center;align-items:center;" class="progressier-absolute-line-end-icon">` + g.parent.utils.svg_external_link() + `</span><div style="max-width:80%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left: -10px;margin-right: 10px;">` + g.getString("resetPermissions") + `</div>`
        },
        btnClick: g.goToPushResetTutorial
    }, {
        id: "safari-mac-with-btn",
        title: "allowNotifications",
        btnClick: function() {},
        btnHtml: function() {
            return g.getString("allowNotifications")
        },
        btnClass: "progressier-subscribe-button",
        li: []
    }, {
        id: "push-auto-blocked",
        error: true,
        icon: "error",
        title: "blocked",
        li: [{
            string: "openPermissionsPush",
            className: "small",
            icon: g.parent.utils.svg_bell_off()
        }]
    }, {
        id: "push-auto-test",
        success: true,
        title: "subscribed",
        btnClick: function(e) {
            g.sendTestNotification(e)
        },
        btnHtml: function() {
            return `<span class="progressier-absolute-line-end-icon" style="position:absolute;right:10px;display:flex;justify-content:center;align-items:center;">` + g.parent.utils.svg_send_test() + `</span><div style="max-width:80%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left: -10px;margin-right: 10px;">` + g.getString("sendTestNotification") + `</div>`
        },
        li: []
    }, {
        id: "push-allowed",
        success: true,
        title: "subscribed",
        li: [{
            string: "allowedNotificationsFrom",
            className: "small"
        }]
    }, {
        id: "confirm-dock-add",
        success: true,
        closesItself: true,
        title: "installed",
        btnHtml: function() {
            return g.getString("launchTheApp")
        },
        btnClick: g.remove,
        li: [{
            string: "rightClickDock",
            icon: g.smallLogo
        }, {
            string: "keepInDock"
        }]
    }, {
        id: "add-to-task-bar",
        success: true,
        closesItself: true,
        title: "installed",
        btnHtml: function() {
            return g.getString("launchTheApp")
        },
        btnClick: g.remove,
        li: [{
            string: "rightClickDock",
            icon: g.smallLogo
        }, {
            string: "selectPintoTaskBar",
            icon: g.parent.utils.svg_pin()
        }]
    }, {
        id: "inapp-browser",
        title: "installTheApp",
        fn: g.rerenderInstallAndInstalled,
        btnHtml: function() {
            return g.parent.utils.svg_copy() + g.getString("copyLink")
        },
        btnClick: g.copyCurrentPage,
        li: [{
            string: "inappBrowserWarning",
            className: "small",
            icon: function() {
                return "<strong>" + (g.isIOS() ? "Safari" : "Chrome") + "</strong>"
            }
        }]
    }, {
        id: "from-twitter",
        title: "installTheApp",
        btnHtml: function() {
            return g.parent.utils.svg_copy() + g.getString("copyLink")
        },
        btnClick: g.copyCurrentPage,
        noLi: true,
        li: [{
            string: "fromTwitter",
            className: "small",
            icon: function() {
                return "<strong>" + (g.isIOS() ? "Safari" : "Chrome") + "</strong>"
            }
        }, {
            string: "imInBrowser",
            className: "second-btn",
            onclick: function() {
                g.parent.detection.definitelyNotTwitter = true;
                g.renderInstallation()
            },
            icon: function() {
                return g.isIOS() ? "Safari" : "Chrome"
            }
        }]
    }, {
        id: "qr-code",
        title: "installTheApp",
        qrCode: true,
        li: [{
            string: "scanCode"
        }]
    }, {
        id: "config-tags",
        title: "subscribed",
        fn: g.renderPushCategories
    }];
    this.prompt = function(e) {
        g.make();
        g.render(e)
    };
    this.next = function(e, t) {
        g.testing = true;
        var i = g.options.findIndex(e => e.id === g.currentOption) || 0;
        var n = i + 1;
        var a = g.options[n] || g.options[0];
        g.currentOption = a.id;
        if (e) {
            g.currentOption = e
        }
        g.customMeta = t;
        g.prompt(g.currentOption)
    };
    this.make = function() {
        var e = document.querySelector("body");
        g.parent.utils.styling(g.styling, g.className);
        progressier.utils.backdrop.show();
        document.querySelectorAll("." + g.className).forEach(function(e) {
            e.remove()
        });
        g.element = g.parent.utils.node("div", g.className + " no-blurring", {
            parent: e
        });
        if (g.parent.wording.rtl()) {
            g.element.setAttribute("dir", "rtl")
        }
        g.inner = g.parent.utils.node("div", g.className + "-inner loading", {
            parent: g.element
        });
        g.parent.utils.node("div", g.className + "-loader", {
            html: g.parent.utils.svg_loader(),
            parent: g.inner
        })
    };
    this.generateQRCode = async function(e) {
        var t = window.location.href;
        var i = g.appLogo();
        if (g.customMeta) {
            t = g.customMeta.url;
            i = g.customMeta.icon
        } else {
            var n = new URL(t);
            n.searchParams.set("pswutlzoq", "install");
            t = n.href
        }
        e.classList.add("qrcode");
        var a = g.parent.utils.node("div", g.className + "-qr", {
            parent: e
        });
        var r = await g.parent.utils.qrCode(t, i);
        g.parent.utils.node("img", {
            parent: a,
            alt: "Scan to install",
            style: "color:transparent !important;",
            src: r
        })
    };
    this.render = function(t) {
        g.inner.innerHTML = "";
        try {
            let e = document.querySelector('meta[name="viewport"]').getAttribute("content").includes("viewport-fit=cover");
            if (g.isIOS() && e) {
                g.inner.classList.add("iosviewportcover")
            }
        } catch (f) {}
        g.currentOption = t;
        if (g.isIOS() && g.isSafari()) {
            g.inner.classList.add("iossafari")
        }
        var r = g.options.find(e => e.id === t);
        var e = g.parent.utils.node("div", g.className + "-header", {
            parent: g.inner
        });
        g.parent.utils.node("div", g.className + "-title", {
            parent: e,
            html: g.getString(r.title)
        });
        var i = g.parent.utils.node("div", g.className + "-close", {
            parent: e,
            html: g.parent.utils.svg_x(),
            click: g.remove
        });
        if (g.parent.data.params.wrapperOnlyMode && !g.parent["native"].standalone) {
            i.classList.add("hide-close")
        }
        if (!r.noapp) {
            var n = g.parent.utils.node("div", g.className + "-details", {
                parent: g.inner
            });
            var a = g.appLogo();
            if (r.success) {
                a = g.parent.fetchdomain + `/assets/img/checkmark-success-primary.svg`
            }
            if (r.error) {
                a = g.parent.fetchdomain + `/assets/img/checkmark-error.svg`
            }
            if (r.info) {
                var s = g.getBestAlternativeBrowser() === "Safari" ? "safari-icon" : "chrome-icon";
                a = g.parent.fetchdomain + `/assets/img/` + s + `.svg?v=4`
            }
            var o = r.success || r.error || r.info ? "unbordered" : "bordered";
            var l = g.parent.data.params.name;
            var p = g.parent.data.params.wrapperOnlyMode ? g.parent.data.params.domain : window.location.host;
            g.parent.utils.node("div", g.className + "-img " + o, {
                parent: n,
                html: `<img alt="app icon" style="color:transparent !important;" src="` + a + `" />`
            });
            g.parent.utils.node("div", g.className + "-text", {
                parent: n,
                html: `<div>` + l + `</div><div>` + p + `</div>`
            })
        }
        var c = `color: ` + g.parent.data.params.buttonTextColor + ` !important;background:` + g.parent.data.params.buttonColor + ` !important;`;
        var d = g.parent.utils.node("div", g.className + "-content", {
            parent: g.inner
        });
        if (r.li) {
            r.li.forEach(function(e, t) {
                var i = g.getString(e.string);
                if (e.icon) {
                    i = i.replace("{X}", typeof e.icon === "function" ? e.icon() : e.icon)
                }
                if (e.txt) {
                    i = i.replace("{X}", `<span>` + g.getString(e.txt) + `</span>`)
                }
                var n = {
                    parent: d,
                    html: `<div>` + i + `</div>`
                };
                if (e.className === "second-btn") {
                    n.style = c
                }
                var a = g.parent.utils.node("div", g.className + "-li", n);
                if (e.onclick) {
                    a.addEventListener("click", e.onclick)
                }
                if (r.li.length > 1 && !r.noLi) {
                    a.setAttribute("data-li", t + 1 + ".")
                }
                if (e.className) {
                    a.classList.add(e.className)
                }
                if (e.add) {
                    a.innerHTML += e.add
                }
            })
        }
        if (r.more) {
            var u = typeof r.more === "function" ? r.more() : r.more;
            if (u) {
                var m = g.getString(u);
                if (r.moreReplace) {
                    m = m.replace("{X}", typeof r.moreReplace === "function" ? r.moreReplace() : r.moreReplace)
                }
                g.parent.utils.node("div", g.className + "-more", {
                    parent: g.inner,
                    html: `<div>` + m + `</div>`
                })
            }
        }
        if (r.fn) {
            r.fn(g.inner)
        }
        if (r.btnHtml && r.btnClick) {
            var d = r.btnHtml();
            var h = g.className + "-btn";
            if (r.btnClass) {
                h += " " + r.btnClass
            }
            g.parent.utils.node("div", h, {
                style: c,
                "data-icons": true,
                parent: g.inner,
                html: d,
                click: r.btnClick
            })
        }
        if (r.qrCode) {
            g.generateQRCode(g.inner)
        }
        g.inner.classList.remove("loading")
    };
    this.renderInstallation = async function() {
        var e = await progressier["native"].installationStatus(true);
        var t = progressier["native"].installed;
        var i = progressier["native"].installable;
        var n = g.parent.detection.isInAppBrowser();
        var a = g.parent.detection.isFromTwitter();
        var r = e === "noengag";
        var s = g.isAndroid();
        var o = g.isIOS();
        var l = g.isSafari();
        var p = g.parent.detection.isSafariWithInstallationMacOS();
        var c = g.parent.detection.isDesktop();
        var d = g.parent.data.params.desktopQRCode;
        var u = g.parent.data.params.itunesAppId && g.parent.data.params.itunesAppId.includes("https://apps.apple.com");
        if (o && u) {
            window.location.href = g.parent.data.params.itunesAppId;
            g.remove()
        } else if (d && c) {
            g.render("qr-code")
        } else if (a && (s || o)) {
            g.render("from-twitter")
        } else if (r && s && n) {
            g.render("inapp-browser")
        } else if (g.parent.detection.isArc() || g.parent.detection.isOpera()) {
            g.render("incompatible")
        } else if (r && s) {
            g.render("android-manual-install")
        } else if (r) {
            g.render("desktop-manual-install")
        } else if (o && l && n) {
            g.render("inapp-browser")
        } else if (p && (!g.parent.data.params.isEmbed || g.parent.data.params.hostingProvider === "twitter")) {
            g.render("macos-safari-install")
        } else if (o && l) {
            g.render("ios-install")
        } else if (g.parent.detection.recentiOS()) {
            g.render("ios-install")
        } else if (g.isSamsungInternet()) {
            g.render("samsung-install")
        } else if (i) {
            g.render("install-ready")
        } else if (t) {
            g.render("already-installed")
        } else {
            g.render("incompatible")
        }
    };
    this.init = async function(e, t) {
        if (g.parent.detection.isStandalone() && e !== "subscribe") {
            return
        }
        g.isPromoOnly = await ProgressierForPromoOnly();
        if (g.isPromoOnly && !t) {
            window.name = "";
            return
        }
        var i = window.location.href;
        if (!window.name) {
            window.name = ""
        }
        var n = i.includes("pswutlzoq=install") || window.name === "pswutlzoq=install" || e === "install";
        var a = i.includes("pswutlzoq=subscribe") || window.name === "pswutlzoq=subscribe" || e === "subscribe";
        if (a && g.isIOS() && !g.parent.detection.isStandalone()) {
            a = false;
            n = true
        }
        if (i.includes("pswutlzoq=") && !g.beenRedirected) {
            g.beenRedirected = "now"
        }
        if (!n && !a) {
            return
        }
        if (n) {
            if (!e) {
                window.name = "pswutlzoq=install"
            }
            g.installation = true;
            g.subscription = false
        }
        if (a) {
            if (!e) {
                window.name = "pswutlzoq=subscribe"
            }
            g.subscription = true;
            g.installation = false
        }
        g.functionalityEnabled = true;
        g.preventAutoTranslate();
        await g.parent.initializing;
        g.make();
        await g.waitInitialization();
        await g.parent.data.waitForData();
        g.removeOnStandalone();
        if (g.parent.data.params.forceRemoval) {
            g.remove();
            return
        }
        if (g.installation) {
            g.renderInstallation()
        }
    };
    this.init()
}

function ProgressierWelcomeScreen(e) {
    var s = this;
    this.parent = e;
    this.className = s.parent.utils.randomId(12);
    this.styling = ` 
		.` + s.className + `{background: var(--themecolor); z-index: 2147483646 !important; display: flex; align-items: center;justify-content: center; position: fixed;  top: 0px; left: 0px; width: 100vw; height: 100vh;}
		.` + s.className + ` *{  font-family:var(--progressierFont) !important;letter-spacing:var(--progressierLetterSpacing); }
		.` + s.className + `-inner{  overflow: hidden; position: relative; background: var(--themecolor); width: 100%; max-width: 500px;border-radius: 20px; justify-content: center; align-items: center; display: flex; flex-direction: column; min-height: 250px;padding:50px 0px 30px 0px;height:100vh;}
		.` + s.className + `-title{ font-weight: var(--progressierHeadingFontWeight) !important; font-size: 17px !important; margin-bottom:30px;text-align: center; max-width: 80%;color:var(--progressierTxt);}
		.` + s.className + `-icon{ position: relative; width: 65px; height: 65px; border-radius: 10px; overflow: hidden; flex: none; margin-bottom:20px;-webkit-box-shadow:0 2px 9px 0 rgba(82, 79, 79, 0.15);box-shadow:0 2px 9px 0 rgba(82, 79, 79, 0.15);}
		.` + s.className + `-icon img{ width: 100%; height: 100%; flex: none;  display: inline-flex;}
		.` + s.className + `-btns{width:90%;position:relative;max-width:280px;}
		.` + s.className + `-btns.single{position:absolute;bottom:150px;}
		.` + s.className + `-btns.single button{justify-content:space-between;}
		.` + s.className + `-btn{height:55px !important;overflow:hidden;}
		.` + s.className + `-btn *{font-weight:600;}
		.` + s.className + ` button{width: 100%; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: var(--progressierBtnFontWeight) !important; cursor: pointer; color: inherit !important; background: #fff !important; outline:0px !important; border: 0px !important;box-shadow:0 -10px 28px rgba(159, 159, 159, 0.1), 0 3px 10px rgba(81, 76, 76, 0.22);-webkit-box-shadow:0 -10px 28px rgba(159, 159, 159, 0.1), 0 3px 10px rgba(81, 76, 76, 0.22);padding: 0px 20px !important;}
		.` + s.className + ` button, .` + s.className + ` button *{font-size:15px !important;}
		.` + s.className + ` button:nth-child(2){margin-top:20px;}
		.` + s.className + ` button:hover{ filter:brightness(0.95);}
		.` + s.className + ` button svg{width:15px;height:15px;}
		.` + s.className + ` button:nth-child(2) svg{width:17px;height:17px;}
	  @media (max-width:991px){
		   .` + s.className + `-inner{max-width:100%; max-height:100%; height:100%;border-radius:0px;}
		   .` + s.className + `-icon{margin-top:0px;}
	  }
	`;
    this.standaloneStatus = false;
    this.functionalityStatus = false;
    this.remove = function() {
        s.element.innerHTML = ""
    };
    this.getEmbedUrl = function() {
        var e = s.parent.data.params.embedUrl;
        try {
            var t = s.parent.data.params.delegateEmbedPath;
            if (t) {
                var i = new URL(e);
                i.pathname = window.location.pathname;
                return i.href
            }
            return e
        } catch (n) {
            return e
        }
    };
    this.launchWelcomeScreen = function() {
        return s.parent.utils.getUrlParam("launchwelcomescreen")
    };
    this.updateUrlForRedirect = function() {
        s.parent.utils.setUrlParam({
            launchwelcomescreen: true
        })
    };
    this.go = async function() {
        s.updateUrlForRedirect();
        if (!s.visibilityChangeListenerAdded) {
            s.visibilityChangeListenerAdded = true;
            document.addEventListener("visibilitychange", function() {
                s.updateUrlForRedirect();
                if (s.parent.detection.isIOS()) {
                    s.render()
                } else {
                    window.location.reload()
                }
            })
        }
        if (window.isBeingRedirectedNow) {
            return
        }
        window.location.href = s.getEmbedUrl()
    };
    this.make = function() {
        s.element = s.parent.utils.node("div", s.className, {
            parent: document.querySelector("body")
        });
        if (s.parent.wording.rtl()) {
            s.element.setAttribute("dir", "rtl")
        }
    };
    this.iosPushPermissionDenied = function() {
        return s.parent.cookies.get("iospermissiondenied") && s.parent.detection.isIOS()
    };
    this.shouldGo = async function() {
        if (s.launchWelcomeScreen()) {
            return false
        }
        if (s.parent.data.params.isInvalid) {
            return false
        }
        if (s.parent.data.params.forbidWrapperMode) {
            return true
        }
        if (!s.parent.data.params.usePromoMethod) {
            return true
        }
        if (!s.parent.data.params.pushAutoPromptStandalone) {
            return true
        }
        if (s.iosPushPermissionDenied()) {
            return true
        }
        var e = s.parent.detection.canBePushPrompted();
        if (!e) {
            return true
        }
        return false
    };
    this.chevronRight = `<svg class="progressier-welcome-screen-chevron" style="position:absolute;width:22px;height:22px;right:10px;"xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg><style>*[dir="rtl"] .progressier-welcome-screen-chevron{right:unset !important;left:10px !important;transform:rotate(180deg);</style>`;
    this.render = async function() {
        s.element.innerHTML = "";
        s.functionalityStatus = s.parent.flow.functionalityEnabled;
        s.standaloneStatus = s.parent["native"].standalone;
        if (s.functionalityStatus) {
            return
        }
        if (s.standaloneStatus) {
            var e = await s.shouldGo();
            if (e) {
                s.go();
                return
            }
        }
        var t = s.parent.utils.node("div", s.className + "-inner", {
            parent: s.element
        });
        var i = s.parent.data.getDisplayableLogo();
        s.parent.utils.node("div", s.className + "-icon", {
            html: `<img alt="app icon"  style="color:transparent !important;" src="` + i + `" />`,
            parent: t
        });
        var n = s.parent.utils.textIsDark(s.parent.data.params.themeColor || "#ffffff") ? "#142a37" : "#ffffff";
        s.parent.utils.node("div", s.className + "-title", {
            style: "color:" + n + " !important;",
            text: s.parent.data.params.name,
            parent: t
        });
        var a = s.parent.utils.node("div", s.className + "-btns", {
            parent: t
        });
        if (s.standaloneStatus) {
            var r = s.parent.utils.textIsDark(s.parent.data.params.buttonColor || "#ffffff") ? "#142a37" : "#ffffff";
            s.parent.utils.node("button", s.className + "-btn", {
                style: "color:" + r + " !important;justify-content: space-between;background:" + s.parent.data.params.buttonColor + " !important;",
                html: "<span>" + s.parent.wording.get("launchTheApp") + "</span>" + s.chevronRight,
                parent: a,
                click: s.go
            });
            if (!s.parent.data.params.pushAutoPromptStandalone || !s.parent.detection.supportsPush()) {
                a.classList.add("single")
            } else {
                s.parent.utils.node("button", "progressier-subscribe-button", {
                    parent: a,
                    "data-icons": true
                })
            }
        } else {
            if (s.parent.utils.getUrlParam("pswutlzoq")) {
                return
            }
            s.parent.flow.init("install")
        }
    };
    this.renderWelcome = function() {
        var e = new URL(window.location.href);
        var t = s.parent.data.params.progressierDomains[2];
        if (!e.host.includes(t)) {
            return
        }
        s.render("welcome-home")
    };
    this.displayable = function() {
        var e = new URL(window.location.href);
        var t = s.parent.data.params.progressierDomains[2];
        var i = e.host.includes(t);
        if (!i) {
            return false
        }
        var n = s.parent.data.params.wrapperOnlyMode;
        if (!n) {
            return false
        }
        return true
    };
    this.build = function() {
        s.parent.utils.styling(s.styling, s.className);
        s.make();
        s.render()
    };
    this.init = async function() {
        await s.parent.data.waitForData();
        if (!s.displayable()) {
            return
        }
        s.build();
        var e = setInterval(function() {
            if (s.parent["native"].standalone === s.standaloneStatus && s.functionalityStatus === s.parent.flow.functionalityEnabled) {
                return
            }
            s.render()
        }, 500)
    };
    this.init()
}

function ProgressierOfflineAlert(e) {
    var s = this;
    this.parent = e;
    this.data = {};
    this.className = "progressier-offline-alert";
    this.element = null;
    this.styling = `
		.` + s.className + `-full{ position: fixed;top:0px !important;left:0px !important;width:100vw !important;height:100vh !important;z-index:2147483647 !important;background:rgba(255,255,255,0.93);outline: 0px !important; border: 0px !important;backdrop-filter: blur(25px);}
		body iframe.` + s.className + `-simple{position:fixed !important;bottom:-200px !important;left:10px !important;background: #fff;width:470px !important;height:150px !important;border-radius:10px;transition:all 0.3s ease-in-out;-webkit-transition:all 0.3s ease-in-out;z-index:2147483647 !important;outline:0px !important;border: 2px solid #f5f5f5 !important;box-shadow:rgba(228, 228, 234, 0.22) 0px 22px 25px 0px; overflow:hidden;cursor:pointer;top:unset !important;}
		body iframe.` + s.className + `-simple.added{ bottom: 10px !important;}
		@media (max-width:991px){
			body iframe.` + s.className + `-simple{ width:calc(100vw - 20px) !important;height:170px !important; }
		}
	`;
    this.waitIframe = function() {
        return new Promise(function(e, t) {
            var i = setInterval(function() {
                if (!s.element || !s.element.contentWindow || !s.element.contentWindow.document || !s.element.contentWindow.document.body) {
                    return
                }
                clearInterval(i);
                return e()
            }, 200)
        })
    };
    this.offlineIcon = function() {
        return s.parent.utils.svg_dino()
    };
    this.wifiOff = function() {
        return s.parent.utils.svg_wifi_off()
    };
    this.launchSimple = async function() {
        s.element = s.parent.utils.node("iframe", s.className + "-simple", {
            title: "Progressier offline alert",
            src: "about:blank",
            parent: document.querySelector("body")
        });
        await s.waitIframe();
        var e = s.element.contentWindow.document;
        var t = e.body;
        e.querySelector("html").setAttribute("style", `height:100%;`);
        var i = `display:flex;align-items:center;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif !important;overflow:hidden;padding-right:30px;position:relative;margin:0px;height:100%;`;
        if (s.data.offlineAlertDismissible) {
            i += "cursor:pointer;"
        }
        t.setAttribute("style", i);
        if (s.data.offlineAlertDismissible) {
            t.addEventListener("click", s.dismiss)
        }
        var n = "";
        n += `<div style="width:22px;height:22px;flex:none;position:absolute;bottom:10px;right:10px;">` + s.wifiOff() + `</div>`;
        if (s.data.offlineAlertDismissible) {
            n += `<div clasThe Aver-icon" style="position:absolute;top:0px;right:0px;border-bottom-left-radius:50%;padding:5px;">` + s.parent.utils.svg_x() + `</div>`
        }
        if (s.data.offlineAlertDino) {
            n += `<div style="background: #f5f5f5;height: 100%;position:relative;display:flex;align-items:center;justify-content:center;max-width: 30vw;"><div style="transform: scale(0.75);margin-top: -25%;">` + s.offlineIcon() + `</div></div>`
        }
        var a = progressier.wording.rtl() ? "rtl" : "ltr";
        n += `<div style="padding-left:30px;" dir="` + a + `"><h2 style="color:#535353;font-size:18px;margin-bottom:5px;">` + s.parent.wording.get("youreOffline") + `</h2><p style="margin-top: 0px;color: #858585; font-size: 14px; font-weight: 300;">` + s.parent.wording.get("mayNotWorkOffline") + `</p></div>`;
        t.innerHTML = n;
        var r = e.createElement("style");
        r.innerHTML = `.hover-icon:hover{background:#f5f5f5;}`;
        t.appendChild(r);
        s.element.classList.add("added")
    };
    this.launchFullScreen = async function() {
        s.element = s.parent.utils.node("iframe", s.className + "-full", {
            title: "Progressier offline alert",
            src: "about:blank",
            parent: document.querySelector("body")
        });
        await s.waitIframe();
        var e = s.element.contentWindow.document;
        var t = e.body;
        var i = `display:flex;align-items:center;height:100%;overflow:hidden;justify-content:center;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif !important;text-align:center;width:80%;margin-left:10%;`;
        if (s.data.offlineAlertDismissible) {
            i += "cursor:pointer;"
        }
        t.setAttribute("style", i);
        var n = "";
        if (s.data.offlineAlertDino) {
            n += `<div style="margin-bottom: 20px;margin-top:-40px;position:relative;">` + s.offlineIcon() + `<div style="width:30px;height:30px;flex:none;position:absolute;top:40px;right:0px;">` + s.wifiOff() + `</div></div>`
        }
        if (s.data.offlineAlertDismissible) {
            n += `<div class="hover-icon" style="position:absolute;top:20px;right:20px;border-radius:50%;padding:5px;">` + s.parent.utils.svg_x() + `</div>`;
            if (s.data.offlineAlertDismissible) {
                t.addEventListener("click", s.dismiss)
            }
        }
        n += `<h2 style="color:#535353">` + s.parent.wording.get("youreOffline") + `</h2><p style="margin-top: 0px;color: #858585; font-size: 18px; font-weight: 300;">` + s.parent.wording.get("getBackOnline") + `</p>`;
        t.innerHTML = n;
        var a = e.createElement("style");
        a.innerHTML = `.hover-icon:hover{background:#ccd6e3;}`;
        t.appendChild(a)
    };
    this.dismiss = async function() {
        if (!s.element) {
            return
        }
        s.element.classList.remove("added");
        await s.parent.utils.wait(300);
        s.element.remove();
        s.element = null
    };
    this.launch = async function(e, t, i) {
        if (typeof t !== "undefined") {
            s.data.offlineAlertDino = t
        }
        if (typeof i !== "undefined") {
            s.data.offlineAlertDismissible = i
        }
        if (s.element && typeof e === "undefined") {
            return
        } else if (s.element) {
            s.element.remove()
        }
        s.parent.utils.styling(s.styling, s.className);
        if (s.data.offlineAlertStrict && typeof e === "undefined" || e) {
            s.launchFullScreen()
        } else {
            s.launchSimple()
        }
    };
    this.status = function() {
        if (navigator.onLine) {
            s.dismiss()
        } else {
            s.launch()
        }
    };
    this.init = async function() {
        s.data = await s.parent.data.waitForData();
        if (!s.data.offlineAlert) {
            return
        }
        s.status();
        window.addEventListener("online", s.status);
        window.addEventListener("offline", s.status)
    };
    this.init()
}

function ProgressierToolbox(e) {
    var a = this;
    this.parent = e;
    this.data = {};
    this.className = "progressier-widget";
    this.styling = `
		.` + a.className + `{ position: fixed;z-index: 2147483643; }
		body.force-fixed{overflow: hidden !important; height: 100vh !important; position: fixed !important;}
		.` + a.className + `.off, .` + a.className + `.off *{display:none !important;visibility:hidden !important;opacity:0 !important;}
		.` + a.className + `-icon{cursor:pointer;transition:all 0.3s ease-in-out;-webkit-transition:all 0.3s ease-in-out;  bottom: 17px; width: 65px; height: 65px; border-radius: 50%;  display: flex; align-items:center;justify-content:center;position: fixed; background: #fff;box-shadow: 0 2px 9px 0 rgba(82, 79, 79, 0.15);-webkit-box-shadow:0 2px 9px 0 rgba(82, 79, 79, 0.15);overflow:hidden;}
		.` + a.className + `.progressier-left .` + a.className + `-icon{left:20px; right:unset;}
		.` + a.className + `.progressier-right .` + a.className + `-icon{right:20px; left:unset;}
		.` + a.className + `.progressier-center .` + a.className + `-icon{left: calc(50% - 32px); right:unset;}
		.` + a.className + `.progressier-top .` + a.className + `-icon{bottom:unset !important;top:17px;}
		.` + a.className + `.progressier-middle .` + a.className + `-icon{bottom:unset !important;top:calc(50% - 32px) !important;}
		.` + a.className + `-icon:hover {transform:scale(1.08) !important;}
		.` + a.className + `-logo{width:100%;height:100%;border-radius:50%;overflow:hidden;margin:0px !important;}
		@media (max-width:350px){
			.` + a.className + `-icon{width:52px;height:52px;}
		}
	`;
    this.on = async function() {
        try {
            if (a.element) {
                a.element.classList.remove("off")
            }
        } catch (e) {}
    };
    this.off = async function() {
        try {
            if (a.element) {
                a.element.classList.add("off")
            }
            if (a.modal) {
                a.modal.remove()
            }
        } catch (e) {}
    };
    this.ready = function() {
        return new Promise(function(t, e) {
            var i = setInterval(function() {
                var e = document.querySelector("body");
                if (!e) {
                    return
                }
                clearInterval(i);
                return t()
            }, 100)
        })
    };
    this.launchInstallPage = async function() {
        window.open(a.data.installPageLocation)
    };
    this.positionString = function() {
        var e = a.data.toolboxPosition || "right";
        var i = e.split("-");
        var n = "";
        i.forEach(function(e, t) {
            n += "progressier-" + e;
            if (i[t + 1]) {
                n += " "
            }
        });
        return n
    };
    this.make = async function() {
        var e = a.positionString();
        a.element = progressier.utils.node("div", a.className + " " + e + " off", {
            parent: document.querySelector("body")
        })
    };
    this.forceFixed = function() {
        if (window.innerWidth > 992) {
            return false
        }
        if (a.data.hostingProvider.includes("squarespace")) {
            return true
        }
        return false
    };
    this.startInstallationFlow = async function() {
        var e = await ProgressierForPromoOnly();
        if (e) {
            return progressierRedirectToEmbedPage("install")
        }
        a.parent.flow.init("install", true)
    };
    this.processClick = function() {
        if (a.data.toolboxLinksToInstallPage) {
            a.launchInstallPage()
        } else {
            a.startInstallationFlow()
        }
    };
    this.iconBackground = function() {
        return a.data.toolboxColor || a.data.themeColor || "#ffffff"
    };
    this.iconImage = function() {
        var e = a.data.icon200 || a.data.icon520 || a.data.icon512 || progressier.utils.emptyLogo();
        var t = a.data.toolboxImg || e;
        return a.data.toolboxUseLogo ? e : t
    };
    this.render = async function() {
        if (!a.element) {
            return
        }
        a.element.innerHTML = "";
        var e = a.iconImage();
        var t = a.iconBackground();
        a.icon = progressier.utils.node("div", a.className + "-icon", {
            background: t,
            parent: a.element
        });
        a.icon.addEventListener("click", a.processClick);
        progressier.utils.node("img", a.className + "-logo", {
            alt: "app icon",
            style: "color:transparent !important;",
            parent: a.icon,
            src: e
        })
    };
    this.shouldHide = function() {
        if (a.parent.detection.isIframe()) {
            return true
        }
        if (!window.progressier || !window.progressier.scriptNode) {
            return null
        }
        if (!a.data) {
            return null
        }
        if (!a.data.showToolbox) {
            return true
        }
        if (progressier.scriptNode.getAttribute("data-toolbox-off")) {
            return true
        }
        if (document.querySelector("body.no-toolbox")) {
            return true
        }
        if (a.parent.detection.isStandalone() && a.data.toolboxHideStandalone) {
            return true
        }
        var e = a.parent.detection.isDesktop();
        if (e && a.data.toolboxShowPlatforms === "mobile") {
            return true
        }
        if (!e && a.data.toolboxShowPlatforms === "desktop") {
            return true
        }
        if (progressier.utils.urlMatchFailed(a.data.toolboxShowUrls)) {
            return true
        }
        if (a.data.hostingProvider === "sqrspc") {
            return true
        }
        if (!a.parent.sw.reg && !a.data.usePromoMethod) {
            return true
        }
        if (a.data.isEmbed && a.data.wrapperOnlyMode && a.data.currentlyOnEmbeddablePage) {
            return true
        }
        return false
    };
    this.updateVisibility = function() {
        var e = a.shouldHide();
        if (e === null) {
            return
        } else if (e === true) {
            a.off()
        } else {
            a.on()
        }
    };
    this.init = async function() {
        a.data = await a.parent.data.waitForData();
        await a.ready();
        if (a.data.forceRemoval) {
            return
        }
        if (!a.data.showToolbox) {
            return
        }
        progressier.utils.styling(a.styling, a.className);
        a.make();
        a.render();
        a.updateVisibility();
        setInterval(a.updateVisibility, 1e3)
    };
    this.init()
}

function ProgressierMeta(e) {
    var v = this;
    this.parent = e;
    this.data = {};
    this.getData = async function(e) {
        var t = await v.parent.data.get(e);
        return t || null
    };
    this.createMeta = async function(e, t, i, n) {
        try {
            var a = await v.getData("overwriteExistingMeta");
            var r = document.querySelector(e + "[" + t + '="' + i + '"]');
            if (r && !a) {
                return
            }
            if (r && a) {
                for (var s in n) {
                    r.setAttribute(s, n[s])
                }
                return
            }
            n[t] = i;
            n.parent = document.querySelector("head");
            v.parent.utils.node(e, n)
        } catch (o) {
            console.log(o)
        }
    };
    this.extractAppleAppIdFromUrl = function(e) {
        try {
            var t = new URL(e);
            var i = t.pathname;
            var n = i.split("/id");
            var a = n[1];
            if (a && a.length === 9) {
                return a
            }
            return null
        } catch (r) {
            return null
        }
    };
    this.createAppleMeta = async function() {
        var e = await v.getData("mobileDisplay");
        var t = e === "fullscreen" ? "black-translucent" : "default";
        var i = await v.getData("overwriteExistingMeta");
        v.createMeta("meta", "name", "apple-touch-fullscreen", {
            content: "yes"
        });
        v.createMeta("meta", "name", "apple-mobile-web-app-capable", {
            content: "yes"
        });
        v.createMeta("meta", "name", "apple-mobile-web-app-status-bar-style", {
            content: t
        });
        var n = await v.getData("name");
        if (n) {
            v.createMeta("meta", "name", "apple-mobile-web-app-title", {
                content: n
            })
        }
        var a = await v.getData("itunesAppId");
        var r = v.extractAppleAppIdFromUrl(a);
        if (a && r) {
            v.createMeta("meta", "name", "apple-itunes-app", {
                content: "app-id=" + r
            })
        }
        if (e === "fullscreen" && i && v.parent.detection.isIOS()) {
            let t = document.querySelector('meta[name="viewport"]');
            if (t) {
                let e = t.getAttribute("content");
                if (!e.includes("viewport-fit=cover")) {
                    t.setAttribute("content", e + ", viewport-fit=cover")
                }
            }
        }
    };
    this.createAppleLogo = async function() {
        var e = await v.getData("icon180");
        if (e) {
            v.createMeta("link", "rel", "apple-touch-icon", {
                sizes: "180x180",
                href: e
            })
        } else {
            var t = await v.getData("icon520") || await v.getData("icon512");
            var n = await v.getData("themeColor");
            if (!t || !n) {
                return
            }
            var a = new Image;
            a.onload = function() {
                var e = v.parent.utils.node("canvas", {
                    width: 180,
                    height: 180
                });
                var t = e.getContext("2d");
                t.fillStyle = n;
                t.fillRect(0, 0, 180, 180);
                t.drawImage(a, 0, 0, 180, 180);
                var i = e.toDataURL();
                v.createMeta("link", "rel", "apple-touch-icon", {
                    sizes: "180x180",
                    href: i
                })
            };
            a.setAttribute("crossorigin", "anonymous");
            a.src = t
        }
    };
    this.screens = [{
        orientation: "landscape",
        w: 430,
        h: 932,
        r: 3,
        d: `iPhone 15 Pro Max, iPhone 15 Plus, iPhone 14 Pro Max`
    }, {
        orientation: "landscape",
        w: 393,
        h: 852,
        r: 3,
        d: `iPhone 15 Pro, iPhone 15, iPhone 14 Pro`
    }, {
        orientation: "landscape",
        w: 428,
        h: 926,
        r: 3,
        d: `iPhone 14 Plus, iPhone 13 Pro Max, iPhone 12 Pro Max`
    }, {
        orientation: "landscape",
        w: 390,
        h: 844,
        r: 3,
        d: `iPhone 14, iPhone 13 Pro, iPhone 13, iPhone 12 Pro, iPhone 12`
    }, {
        orientation: "landscape",
        w: 375,
        h: 812,
        r: 3,
        d: `iPhone 13 mini, iPhone 12 mini, iPhone 11 Pro, iPhone XS, iPhone X`
    }, {
        orientation: "landscape",
        w: 414,
        h: 896,
        r: 3,
        d: `iPhone 11 Pro Max, iPhone XS Max`
    }, {
        orientation: "landscape",
        w: 414,
        h: 896,
        r: 2,
        d: `iPhone 11, iPhone XR`
    }, {
        orientation: "landscape",
        w: 414,
        h: 736,
        r: 3,
        d: `iPhone 8 Plus, iPhone 7 Plus, iPhone 6s Plus, iPhone 6 Plus`
    }, {
        orientation: "landscape",
        w: 375,
        h: 667,
        r: 2,
        d: `iPhone 8, iPhone 7, iPhone 6s, iPhone 6, 4.7" iPhone SE`
    }, {
        orientation: "landscape",
        w: 320,
        h: 568,
        r: 2,
        d: `4" iPhone SE, iPod touch 5th generation and later`
    }, {
        orientation: "landscape",
        w: 1032,
        h: 1376,
        r: 2,
        d: `13" iPad Pro M4`
    }, {
        orientation: "landscape",
        w: 1024,
        h: 1366,
        r: 2,
        d: `12.9" iPad Pro`
    }, {
        orientation: "landscape",
        w: 834,
        h: 1210,
        r: 2,
        d: `11" iPad Pro M4`
    }, {
        orientation: "landscape",
        w: 834,
        h: 1194,
        r: 2,
        d: `11" iPad Pro, 10.5" iPad Pro`
    }, {
        orientation: "landscape",
        w: 820,
        h: 1180,
        r: 2,
        d: `10.9" iPad Air`
    }, {
        orientation: "landscape",
        w: 834,
        h: 1112,
        r: 2,
        d: `10.5" iPad Air`
    }, {
        orientation: "landscape",
        w: 810,
        h: 1080,
        r: 2,
        d: `10.2" iPad`
    }, {
        orientation: "landscape",
        w: 768,
        h: 1024,
        r: 2,
        d: `9.7" iPad Pro, 7.9" iPad mini, 9.7" iPad Air, 9.7" iPad`
    }, {
        orientation: "landscape",
        w: 744,
        h: 1133,
        r: 2,
        d: `8.3" iPad Mini`
    }];
    this.createAppleSplashScreens = async function() {
        try {
            if (!v.parent.detection.isIOS()) {
                return
            }
            if (v.parent.detection.isStandalone()) {
                return
            }
            var t = await v.getData("icon520") || await v.getData("icon512");
            var i = await v.getData("themeColor");
            var e = v.screens;
            var n = window.matchMedia("(-webkit-device-pixel-ratio: 2)").matches ? 2 : 3;
            var a = window.screen.height;
            var r = window.screen.width;
            var s = [];
            e.forEach(function(e) {
                if (e.r !== n) {
                    return
                }
                if (e.w !== r) {
                    return
                }
                if (e.h !== a) {
                    return
                }
                s.push(e);
                var t = JSON.parse(JSON.stringify(e));
                t.orientation = "portrait";
                s.push(t)
            });
            s.forEach(function(e) {
                v.createAppleSplashScreen(e, t, i)
            })
        } catch (o) {
            console.log(o)
        }
    };
    this.generateSplashScreenDataUrl = function(h, n, f, g) {
        return new Promise(function(u, e) {
            var t = .18;
            var i = h.orientation === "portrait" ? true : false;
            h.imageWidth = (i ? h.w : h.h) * h.r;
            h.imageHeight = (i ? h.h : h.w) * h.r;
            if (i) {
                h.innerHeight = parseInt(h.imageHeight * t);
                h.innerWidth = h.innerHeight
            } else {
                h.innerWidth = parseInt(h.imageWidth * t);
                h.innerHeight = h.innerWidth
            }
            h.top = parseInt((h.imageHeight - h.innerHeight) / 2);
            h.left = parseInt((h.imageWidth - h.innerWidth) / 2);
            h.mediaString = "screen and (device-width: " + h.w + "px) and (device-height: " + h.h + "px) and (-webkit-device-pixel-ratio: " + h.r + ") and (orientation: " + h.orientation + ")";
            var m = new Image;
            m.onload = function() {
                var e = h.imageWidth;
                var t = h.imageHeight;
                var i = v.parent.utils.node("canvas", {
                    width: e,
                    height: t
                });
                var n = i.getContext("2d");
                n.fillStyle = f;
                n.fillRect(0, 0, e, t);
                n.save();
                var a = h.left;
                var r = h.top;
                var s = h.innerWidth;
                var o = h.innerHeight;
                var l = 100;
                n.beginPath();
                n.moveTo(a + l, r);
                n.lineTo(a + s - l, r);
                n.quadraticCurveTo(a + s, r, a + s, r + l);
                n.lineTo(a + s, r + o - l);
                n.quadraticCurveTo(a + s, r + o, a + s - l, r + o);
                n.lineTo(a + l, r + o);
                n.quadraticCurveTo(a, r + o, a, r + o - l);
                n.lineTo(a, r + l);
                n.quadraticCurveTo(a, r, a + l, r);
                n.closePath();
                n.clip();
                n.drawImage(m, a, r, s, o);
                n.restore();
                if (g) {
                    var p = v.parent.utils.textIsDark(f || "#ffffff") ? "#000000" : "#ffffff";
                    n.fillStyle = p;
                    n.font = "50px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif";
                    var c = n.measureText(g).width;
                    n.fillText(g, i.width / 2 - c / 2, i.height - 150)
                }
                var d = i.toDataURL();
                return u(d)
            };
            m.setAttribute("crossorigin", "anonymous");
            m.src = n
        })
    };
    this.createAppleSplashScreen = async function(i, e, t) {
        try {
            var n = document.querySelectorAll(`link[rel="apple-touch-startup-image"]`);
            if (n && n.length > 0) {
                var a = false;
                n.forEach(function(e) {
                    if (a) {
                        return
                    }
                    var t = e.getAttribute("media");
                    if (t && t.includes(i.w + "px") && t.includes(i.h + "px") && t.includes(i.r) && t.includes(i.orientation)) {
                        a = true
                    }
                });
                if (a) {
                    return
                }
            }
            var r = await v.generateSplashScreenDataUrl(i, e, t, "");
            v.parent.utils.node("link", {
                rel: "apple-touch-startup-image",
                media: i.mediaString,
                href: r,
                parent: document.querySelector("head")
            })
        } catch (s) {
            console.log(s)
        }
    };
    this.createAndroidMeta = async function() {
        var e = await v.getData("toolbarColor");
        var t = await v.getData("wrapperOnlyMode");
        if (!e || t) {
            e = await v.getData("themeColor")
        }
        let i = await v.getData("currentlyOnEmbeddablePage");
        if (i && t) {
            return
        }
        v.createMeta("meta", "name", "mobile-web-app-capable", {
            content: "yes"
        });
        v.createMeta("meta", "name", "theme-color", {
            content: e
        })
    };
    this.getStartUrl = async function() {
        var e = window.location.origin;
        var t = await v.getData("startUrl");
        var i = t ? e + "/" + t : e;
        return i
    };
    this.createMsMeta = async function() {
        var e = await v.getStartUrl();
        var t = await v.getData("name");
        var i = await v.getData("themeColor");
        var n = await v.getData("icon512");
        if (t) {
            v.createMeta("meta", "name", "application-name", {
                content: t
            })
        }
        if (e) {
            v.createMeta("meta", "name", "msapplication-starturl", {
                content: e
            })
        }
        if (i) {
            v.createMeta("meta", "name", "msapplication-navbutton-color", {
                content: i
            })
        }
        if (n) {
            v.createMeta("meta", "name", "msapplication-TileImage", {
                content: n
            })
        }
        if (i) {
            v.createMeta("meta", "name", "msapplication-TileColor", {
                content: i
            })
        }
    };
    this.createMiscMeta = async function() {
        var e = await v.getStartUrl();
        var t = await v.getData("name");
        v.createMeta("meta", "name", "x5-fullscreen", {
            content: "true"
        });
        v.createMeta("meta", "name", "x5-page-mode", {
            content: "app"
        });
        v.createMeta("meta", "name", "browsermode", {
            content: "application"
        });
        v.createMeta("meta", "name", "full-screen", {
            content: "yes"
        });
        v.createMeta("meta", "property", "al:web:url", {
            content: e
        })
    };
    this.init = async function() {
        await v.createAppleSplashScreens();
        await v.createMiscMeta();
        await v.createAndroidMeta();
        await v.createMsMeta();
        await v.createAppleMeta();
        await v.createAppleLogo()
    };
    this.init()
}

function ProgressierManifest(e) {
    var a = this;
    this.parent = e;
    this.id = a.parent.data.id;
    this.file = {};
    this.checkExisting = async function() {
        var e = document.querySelectorAll(`head link[rel="manifest"]`);
        var t = e[0] || null;
        var i = t && t.getAttribute("href") ? t.getAttribute("href") || "" : "";
        if (i.includes(a.parent.fetchdomain)) {
            throw ""
        }
        if (i.includes("progressier.app")) {
            throw ""
        }
        if (e.length > 0) {
            console.log("%c[DEVELOPER ACTION REQUIRED] 👇 Manifest(s) to remove 👇", "font-weight:bold;font-size:14px;");
            e.forEach(function(e) {
                let t = e && e.getAttribute("href") ? e.getAttribute("href") || "" : "";
                if (t.includes(a.parent.fetchdomain)) {
                    return
                }
                if (t.includes("progressier.app")) {
                    return
                }
                console.log(e)
            });
            throw "Please delete the line(s) of code above from your app to use the manifest generated by Progressier. For more information, please check https://intercom.help/progressier/en/articles/6810512-why-do-i-need-to-delete-additional-app-manifests."
        }
    };
    this.init = async function() {
        try {
            await a.checkExisting();
            await a.parent.data.waitForData();
            if (a.parent.data.params.forceRemoval) {
                return
            }
            var e = await ProgressierForPromoOnly();
            if (e) {
                return
            }
            var t = a.parent.fetchdomain + "/myapp/" + a.id + "/progressier.json";
            if (a.parent.data.params.manifestCaching) {
                t = "https://progressier.app/" + a.id + "/progressier.json"
            }
            var i = a.parent.utils.runtimeSettings(t);
            a.parent.utils.node("link", {
                rel: "manifest",
                href: i || t,
                parent: document.querySelector("head")
            })
        } catch (n) {
            if (n) {
                console.log(n)
            }
        }
    };
    this.init()
}

function ProgressierAnalytics(e) {
    var p = this;
    this.parent = e;
    this.appId = function() {
        return p.parent.data.id
    };
    this.domain = function() {
        return p.parent.fetchdomain
    };
    this.installRegistered = false;
    this.c = function() {
        return p.parent["native"].compatible
    };
    this.a = function() {
        return p.parent["native"].installed
    };
    this.f = function() {
        return p.parent["native"].standalone
    };
    this.m = function() {
        return p.parent.utils.isMobile()
    };
    this.o = function() {
        return p.parent.detection.isIOS()
    };
    this.n = function() {
        return p.parent.detection.isAndroid()
    };
    this.w = function() {
        return p.parent.detection.isWindows()
    };
    this.s = function() {
        return p.parent.detection.isMacOs()
    };
    this.h = function() {
        var e = false;
        var t = window.chrome;
        var i = window.navigator;
        var n = typeof window.opr !== "undefined";
        var a = i.userAgent.indexOf("Edge") > -1;
        var r = i.userAgent.match("CriOS");
        if (r || t !== null && typeof t !== "undefined" && i.vendor === "Google Inc." && n === false && a === false) {
            e = true
        }
        return e
    };
    this.registerPushSubscription = function() {
        if (p.pushSubscriptionRegistered) {
            return
        }
        p.pushSubscriptionRegistered = true;
        p.register({
            e: true
        })
    };
    this.registerInstall = function() {
        if (p.installRegistered) {
            return
        }
        p.installRegistered = true;
        var e = {
            i: true
        };
        if (p.o()) {
            e.z = true
        }
        if (p.n()) {
            e.y = true
        }
        if (p.w()) {
            e.x = true
        }
        if (p.s()) {
            e.u = true
        }
        if (p.h()) {
            e.t = true
        }
        p.register(e)
    };
    this.registerAppLaunch = function() {
        try {
            if (!p.parent.detection.isStandalone()) {
                return
            }
            var e = "launchregistered-";
            var t = new Date;
            var i = 4;
            if (window.name && window.name.includes(e)) {
                var n = window.name.replace(e, "");
                var a = new Date(n);
                var r = (t.getTime() - a.getTime()) / 1e3;
                var s = r / 3600;
                if (s < i) {
                    return
                }
            }
            window.name = e + t.toISOString();
            var o = {};
            if (p.o()) {
                o.a = true
            }
            if (p.n()) {
                o.b = true
            }
            if (p.s()) {
                o.c = true
            }
            if (p.w()) {
                o.d = true
            }
            p.register(o)
        } catch (l) {
            console.log(l)
        }
    };
    this.register = async function(e) {
        if (!window.location.origin.includes("installable.app") && !window.location.origin.includes("progressierdev2.xyz")) {
            var t = await ProgressierForPromoOnly();
            if (t) {
                return
            }
        }
        await p.parent.utils.lets("POST", p.domain() + "/analytics/collect?id=" + p.appId(), e)
    };
    this.registerAppLaunch()
}

function ProgressierUtils(e) {
    var c = this;
    this.parent = e;
    this.isMobile = function() {
        return screen.width < 991 && screen.height > screen.width
    };
    this.emptyLogo = function() {
        return `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgc3R5bGU9ImJhY2tncm91bmQ6ICAwJSAwJSAvIDQwMCUgNDAwJSByZ2IoMjM2LCAyMzYsIDIzNik7IHdpZHRoOiAxMDBweDsgaGVpZ2h0OiAxMDBweDsgYm9yZGVyLXJhZGl1czogMHB4OyI+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeT0iNTAlIiB4PSI1MCUiIGR5PSIwLjM1ZW0iIHBvaW50ZXItZXZlbnRzPSJhdXRvIiBmaWxsPSIjZmZmZmZmIiBmb250LWZhbWlseT0iSGVsdmV0aWNhTmV1ZS1MaWdodCxIZWx2ZXRpY2EgTmV1ZSBMaWdodCxIZWx2ZXRpY2EgTmV1ZSxIZWx2ZXRpY2EsIEFyaWFsLEx1Y2lkYSBHcmFuZGUsIHNhbnMtc2VyaWYiIHN0eWxlPSJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6IDYwcHg7Ij4/PC90ZXh0Pjwvc3ZnPg==`
    };
    this.prepareDestinationUrl = function(e, t) {
        var i = btoa(e);
        return progressier.fetchdomain + "/install-code.svg?dark=" + c.getTextColorTheme() + "&light=" + c.getBgColorTheme() + "&to=" + i
    };
    this.getBgColorTheme = function() {
        var e = "ffffff";
        try {
            var t = getComputedStyle(document.documentElement).getPropertyValue("--progressierBg").trim();
            if (t && t.length === 7) {
                return t.slice(1, 7)
            }
            return e
        } catch (i) {
            return e
        }
    };
    this.getTextColorTheme = function() {
        var e = "142a37";
        try {
            var t = getComputedStyle(document.documentElement).getPropertyValue("--progressierTxt").trim();
            if (t && t.length === 7) {
                return t.slice(1, 7)
            }
            return e
        } catch (i) {
            return e
        }
    };
    this.qrCode = function(s, o) {
        return new Promise(async function(a, e) {
            var t = null;
            try {
                var i = c.prepareDestinationUrl(s);
                var r = new Image;
                r.onload = function() {
                    var n = new Image;
                    n.onload = function() {
                        var e = c.node("canvas", {
                            width: 300,
                            height: 300
                        });
                        var t = e.getContext("2d");
                        t.fillRect(0, 0, 300, 300);
                        t.drawImage(r, 0, 0, 300, 300);
                        t.fillStyle = "#" + c.getBgColorTheme();
                        t.fillRect(115, 115, 70, 70);
                        t.drawImage(n, 125, 125, 50, 50);
                        var i = e.toDataURL();
                        return a(i)
                    };
                    n.onerror = function() {
                        var e = c.node("canvas", {
                            width: 300,
                            height: 300
                        });
                        var t = e.getContext("2d");
                        t.fillRect(0, 0, 300, 300);
                        t.drawImage(r, 0, 0, 300, 300);
                        var i = e.toDataURL();
                        return a(i)
                    };
                    n.setAttribute("crossorigin", "anonymous");
                    n.src = o
                };
                r.setAttribute("crossorigin", "anonymous");
                r.src = i
            } catch (n) {
                return e(n)
            }
        })
    };
    this.urlBase64ToUint8Array = function(e) {
        var t = "=".repeat((4 - e.length % 4) % 4);
        var i = (e + t).replace(/\-/g, "+").replace(/_/g, "/");
        var n = window.atob(i);
        var a = new Uint8Array(n.length);
        for (var r = 0; r < n.length; ++r) {
            a[r] = n.charCodeAt(r)
        }
        return a
    };
    this.getUrlParam = function(e) {
        var t = new URLSearchParams(window.location.search);
        var i = t.get(e);
        return i
    };
    this.setUrlParam = function(e) {
        var t = new URL(window.location.href);
        var i = t.searchParams;
        for (var n in e) {
            if (e[n] === null) {
                i["delete"](n)
            } else {
                i.set(n, e[n])
            }
        }
        window.history.replaceState(null, null, t.href)
    };
    this.wait = function(i) {
        return new Promise(function(e, t) {
            setTimeout(function() {
                return e()
            }, i)
        })
    };
    this.svg_loader = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="currentColor" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>`
    };
    this.svg_x = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    };
    this.svg_pin = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_AyW4lPP0jYEkMZSowQzPGUEHBIu0DemG"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_AyW4lPP0jYEkMZSowQzPGUEHBIu0DemG)"><path d=" M 9 7 L 9 12 L 3 12 L 2 14 L 9 14 L 9 19 L 12 19 L 14 16 L 18 16 L 20 18 L 22 18 L 22 8 L 20 8 L 18 10 L 14 10 L 12 7 L 9 7 Z  M 11 9 L 11 17 L 13 14 L 18 14 L 19 15 L 20 15 L 20 11 L 19 11 L 18 12 L 13 12 L 11 9 Z " fill-rule="evenodd" fill="currentColor"/></g></svg>`
    };
    this.svg_dino = function() {
        return `<svg width="144" height="144" viewBox="0 0 128 144" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0,142L8,142L8,144L0,144L0,142ZM28,142L32,142L32,144L28,144L28,142ZM96,142L104,142L104,144L96,144L96,142ZM80,100L76,100L76,114L72,114L72,120L68,120L68,124L64,124L64,140L68,140L68,144L60,144L60,132L56,132L56,128L52,128L52,132L48,132L48,136L44,136L44,140L48,140L48,144L40,144L40,128L36,128L36,124L32,124L32,120L28,120L28,116L24,116L24,112L20,112L20,88L24,88L24,96L28,96L28,100L32,100L32,104L40,104L40,100L44,100L44,96L50,96L50,92L56,92L56,88L60,88L60,62L64,62L64,58L96,58L96,62L100,62L100,80L80,80L80,84L92,84L92,88L76,88L76,96L84,96L84,104L80,104L80,100ZM82,140L84,140L84,142L82,142L82,140ZM12,136L20,136L20,138L12,138L12,136ZM110,134L116,134L116,136L110,136L110,134ZM0,128L32,128L32,130L0,130L0,128ZM72,128L128,128L128,130L72,130L72,128ZM68,64L68,68L72,68L72,64L68,64Z" stroke="none" fill="#535353"/></svg>`
    };
    this.svg_wifi_off = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 180 180" width="60pt" height="60pt"><defs><clipPath id="_clipPath_QptDs"><rect width="60" height="60"/></clipPath></defs><g clip-path="url(#_clipPath_QptDs)"><path d=" M 3.25 17.917 L 31.556 55.667 L 40.594 42.822 L 44.222 37.667 L 44.222 32.083 L 44.222 22.667 C 44.39 19.807 48.178 19.262 55.556 21 C 56.15 20.943 56.833 20.567 57.573 19.844 C 58.182 19.213 58.409 18.498 58.222 17.667 C 39.76 5.176 21.456 5.279 3.25 17.917 Z  M 48.021 24.344 L 48.021 42.906 C 50.223 44.616 52.233 44.689 54.271 43.094 L 54.302 24.219 C 52.21 22.588 50.118 22.622 48.021 24.344 Z  M 48 49.625 C 48 47.883 49.412 46.469 51.151 46.469 C 52.89 46.469 54.302 47.883 54.302 49.625 C 54.302 51.367 52.89 52.781 51.151 52.781 C 49.412 52.781 48 51.367 48 49.625 Z " fill-rule="evenodd" fill="rgb(255,57,57)"/></g></svg>`
    };
    this.svg_chevron = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`
    };
    this.svg_copy = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_bE8lc3TNJVW1c4c3dUe1Gph6VIDAmlrS"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_bE8lc3TNJVW1c4c3dUe1Gph6VIDAmlrS)"><path d=" M 11 8 L 20 8 C 20.8 8 21.56 8.32 22.12 8.88 C 22.68 9.44 23 10.2 23 11 L 23 20 C 23 20.8 22.68 21.56 22.12 22.12 C 21.56 22.68 20.8 23 20 23 L 11 23 C 10.2 23 9.44 22.68 8.88 22.12 C 8.32 21.56 8 20.8 8 20 L 8 11 C 8 10.2 8.32 9.44 8.88 8.88 C 9.44 8.32 10.2 8 11 8 Z  M 11 10 L 20 10 C 20.27 10 20.52 10.11 20.71 10.29 C 20.89 10.48 21 10.73 21 11 L 21 20 C 21 20.27 20.89 20.52 20.71 20.71 C 20.52 20.89 20.27 21 20 21 L 11 21 C 10.73 21 10.48 20.89 10.29 20.71 C 10.11 20.52 10 20.27 10 20 L 10 11 C 10 10.73 10.11 10.48 10.29 10.29 C 10.48 10.11 10.73 10 11 10 Z  M 14.021 6.176 C 14.01 5.399 14.03 4.76 14.021 4.225 C 14.058 3.657 13.693 3.239 12.844 3.172 L 4.516 3.145 C 3.655 3.195 3.266 3.738 3.268 4.418 L 3.284 12.23 C 3.384 12.932 3.736 13.446 4.211 13.504 L 6.109 13.504 L 6.122 15.844 L 3.552 15.844 C 2.289 15.844 1.266 14.82 1.266 13.558 L 1.266 3.27 C 1.266 2.008 2.289 0.984 3.552 0.984 L 13.839 0.984 C 15.101 0.984 16.125 2.008 16.125 3.27 L 16.089 6.182 L 14.021 6.176 Z " fill-rule="evenodd" fill="currentColor"/></g></svg>`
    };
    this.svg_simple_check = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_C0LbCtC6Z3aGBCC5uAE06I95HdncSnY8"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_C0LbCtC6Z3aGBCC5uAE06I95HdncSnY8)"><path d=" M 2.533 13.31 L 5.284 9.871 L 9.118 13.998 L 18.322 4.531 Q 22.253 7.185 21.271 7.972 Q 20.288 8.758 9.182 19.469 L 2.533 13.31 Z " fill-rule="evenodd" fill="currentColor"/></g></svg>`
    };
    this.svg_check = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_c8K2Vv4np0Agkz34gnKy3cmUgbsZgeai"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_c8K2Vv4np0Agkz34gnKy3cmUgbsZgeai)"><path d=" M 6.081 2.094 L 18.231 2.094 C 20.467 2.094 22.281 3.908 22.281 6.144 L 22.281 18.294 C 22.281 20.529 20.467 22.344 18.231 22.344 L 6.081 22.344 C 3.846 22.344 2.031 20.529 2.031 18.294 L 2.031 6.144 C 2.031 3.908 3.846 2.094 6.081 2.094 Z  M 6.08 4.09 L 18.23 4.09 C 18.77 4.09 19.3 4.31 19.68 4.69 C 20.07 5.08 20.28 5.6 20.28 6.14 L 20.28 18.29 C 20.28 18.84 20.07 19.36 19.68 19.74 C 19.3 20.13 18.77 20.34 18.23 20.34 L 6.08 20.34 C 5.54 20.34 5.02 20.13 4.63 19.74 C 4.25 19.36 4.03 18.84 4.03 18.29 L 4.03 6.14 C 4.03 5.6 4.25 5.08 4.63 4.69 C 5.02 4.31 5.54 4.09 6.08 4.09 Z  M 6.354 13.083 L 8.104 10.896 L 10.542 13.521 L 16.396 7.5 Q 18.896 9.188 18.271 9.688 Q 17.646 10.188 10.583 17 L 6.354 13.083 Z " fill-rule="evenodd" fill="currentColor"/></g></svg>`
    };
    this.svg_open = function() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_ImEZVJV2b97pMBVsYeaWxHXUfw9oHYFj"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_ImEZVJV2b97pMBVsYeaWxHXUfw9oHYFj)"><path d=" M 20.391 11.703 L 20.28 18.29 C 20.28 18.84 20.07 19.36 19.68 19.74 C 19.3 20.13 18.77 20.34 18.23 20.34 L 6.08 20.34 C 5.54 20.34 5.02 20.13 4.63 19.74 C 4.25 19.36 4.03 18.84 4.03 18.29 L 4.03 6.14 C 4.03 5.6 4.25 5.08 4.63 4.69 C 5.02 4.31 5.54 4.09 6.08 4.09 L 11.672 4.09 C 11.748 4.09 11.625 3.016 11.672 2.094 Q 9.688 2.094 6.081 2.094 C 3.846 2.094 2.031 3.908 2.031 6.144 L 2.031 18.294 C 2.031 20.529 3.846 22.344 6.081 22.344 L 18.231 22.344 C 20.467 22.344 22.281 20.529 22.281 18.294 L 22.281 11.703 L 20.391 11.703 Z  M 8.208 14.59 L 18.766 4.09 L 14.08 4.09 L 14.08 2.094 L 22.281 2.094 L 22.281 9.557 L 20.391 9.557 L 20.391 5.288 L 9.672 16.016 L 8.208 14.59 Z " fill-rule="evenodd" fill="currentColor"/></g></svg>`
    };
    this.svg_bell_off = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_g5Ts0Q9OWmIUDk4QXVieo6EF2ihulNQo"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_g5Ts0Q9OWmIUDk4QXVieo6EF2ihulNQo)"><path d=" M 20.84 22.73 L 18.11 20 L 3 20 L 3 19 L 5 17 L 5 11 C 5 9.86 5.29 8.73 5.83 7.72 L 1.11 3 L 2.39 1.73 L 22.11 21.46 L 20.84 22.73 Z  M 19 15.8 L 19 11 C 19 7.9 16.97 5.17 14 4.29 C 14 4.19 14 4.1 14 4 C 14 2.895 13.105 2 12 2 C 10.895 2 10 2.895 10 4 C 10 4.1 10 4.19 10 4.29 C 9.39 4.47 8.8 4.74 8.26 5.09 L 19 15.8 Z  M 12 23 C 13.105 23 14 22.105 14 21 L 10 21 C 10 22.105 10.895 23 12 23 Z " fill="currentColor"/></g></svg>`
    };
    this.svg_bell_on = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_g5wSlMrSB9SJLHpZKiGDZLCTzjt60SbH"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_g5wSlMrSB9SJLHpZKiGDZLCTzjt60SbH)"><path d=" M 21 18 L 3 18 C 2.57 18 2.18 17.72 2.05 17.31 C 1.92 16.89 2.07 16.44 2.42 16.19 C 2.53 16.11 2.64 16.01 2.73 15.91 C 3.08 15.53 3.38 15.11 3.62 14.66 C 4.04 13.86 4.36 13.01 4.56 12.14 C 4.87 10.78 5.02 9.4 5 8.01 C 5 6.15 5.74 4.37 7.05 3.05 C 8.36 1.74 10.14 1 12 1 C 13.86 1 15.64 1.74 16.95 3.05 C 18.26 4.37 19 6.15 19 8.01 C 18.98 9.4 19.13 10.78 19.44 12.14 C 19.64 13.01 19.96 13.86 20.38 14.66 C 20.62 15.11 20.92 15.53 21.27 15.91 C 21.36 16.01 21.47 16.11 21.58 16.19 C 21.93 16.44 22.08 16.89 21.95 17.31 C 21.82 17.72 21.43 18 21 18 Z  M 8.47 4.46 M 14.817 20.714 L 13.982 20.057 Q 13.622 20.042 13.556 20.123 C 13.18 20.585 12.612 20.859 12.006 20.859 C 11.399 20.859 10.832 20.585 10.456 20.123 C 10.424 19.993 10.302 19.972 10.06 20.032 L 9.215 20.695 C 9.063 20.913 9.04 21.071 9.115 21.14 C 10.076 23.151 14.196 23.152 14.911 21.264 C 14.946 21.126 14.925 20.952 14.817 20.714 Z  M 1.973 6.053 L 2.965 5.67 Q 3.16 5.367 3.124 5.269 C 2.919 4.71 2.972 4.082 3.281 3.56 C 3.59 3.038 4.115 2.69 4.704 2.602 C 4.832 2.641 4.912 2.546 4.984 2.308 L 4.844 1.243 C 4.734 1.001 4.61 0.9 4.512 0.93 C 2.293 0.732 0.192 4.276 1.453 5.854 C 1.553 5.955 1.713 6.025 1.973 6.053 Z  M 19.086 1.343 L 19 2.403 Q 19.187 2.711 19.291 2.721 C 19.884 2.779 20.426 3.1 20.761 3.605 C 21.097 4.111 21.182 4.735 21.005 5.304 C 20.914 5.402 20.964 5.515 21.148 5.684 L 22.167 6.021 C 22.433 6.028 22.578 5.96 22.594 5.859 C 23.738 3.947 21.461 0.513 19.492 0.962 C 19.358 1.008 19.225 1.122 19.086 1.343 Z " fill-rule="evenodd" fill="currentColor"/></g></svg>`
    };
    this.svg_bell = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> `
    };
    this.svg_install_desktop = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24"><defs><clipPath id="_clipPath_RlisKLeHsmtiDxZ3ALcrHgOFzqly1u7x"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_RlisKLeHsmtiDxZ3ALcrHgOFzqly1u7x)"><line x1="8" y1="12" x2="16" y2="12"/><g><path d=" M 5.356 20.008 L 4.937 22.1 L 4.447 22.869 C 4.138 23.203 4.214 23.335 4.658 23.247 L 19.975 23.147 C 20.268 23.134 20.323 23.048 20.131 22.88 L 19.68 22.204 L 19.471 20.008 L 5.356 20.008 Z " fill="currentColor"/><path d=" M 22.609 13.5 C 22.294 13.489 21.516 13.718 21.706 14.73 L 21.64 17.05 C 21.831 18.195 21.247 18.691 19.88 18.528 L 3.511 18.44 C 2.642 18.634 2.226 18.173 2.254 17.046 L 2.254 5.206 C 2.165 4.588 2.477 4.19 3.183 4.004 L 9.364 4.004 C 11.416 3.948 11.416 2.311 9.306 2.356 L 1.766 2.489 C 0.968 2.514 0.603 2.913 0.661 3.678 L 0.398 18.661 C 0.512 19.719 0.973 20.213 1.773 20.134 L 22.215 20.043 C 23.091 20.188 23.576 19.752 23.663 18.727 L 23.598 14.803 C 23.59 13.936 22.924 13.512 22.609 13.5 Z " fill="currentColor"/><path d=" M 15.324 1.459 C 14.844 2.04 15.743 10.347 15.115 10.033 C 14.775 9.863 14.112 9.278 13.127 8.278 C 12.795 7.422 12.345 7.359 11.768 8.083 L 11.018 8.749 C 10.255 9.21 10.269 9.554 11.05 9.772 L 15.47 14.519 C 16.347 15.68 16.383 15.643 17.147 14.443 L 22.023 9.789 C 22.46 9.458 22.509 9.11 22.161 8.738 L 21.005 7.64 C 20.698 7.29 20.423 7.304 20.171 7.675 L 18.675 9.496 L 18.129 10.187 L 18.093 1.457 Q 15.838 0.839 15.324 1.459 Z " fill="currentColor"/></g></g></svg>`
    };
    this.svg_install_mobile = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_rnpDcv3XSHoXzye5ycAxBn1N5nbiy1UP"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_rnpDcv3XSHoXzye5ycAxBn1N5nbiy1UP)"><path d=" M 18.011 16.254 L 18.011 22.001 C 18.011 23.052 17.157 23.906 16.105 23.906 L 4.671 23.906 C 3.62 23.906 2.766 23.052 2.766 22.001 L 2.766 1.999 C 2.766 0.948 3.62 0.094 4.671 0.094 L 12.517 0.094 L 12.517 5.617 L 4.992 5.617 L 4.992 18.383 L 15.784 18.383 L 15.784 16.309 L 18.011 16.254 L 18.011 16.254 Z  M 11.426 8.938 L 17.081 14.444 L 22.798 8.756 L 20.908 7.112 L 18.166 10.043 L 18.011 2.11 L 15.784 2.11 L 15.87 9.937 L 13.047 7.112 L 11.426 8.938 Z " fill-rule="evenodd" fill="currentColor"/></g></svg>`
    };
    this.svg_install_edge = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_J38nC66kfLd7VZNsgbcAi4PGOi7DRRg3"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_J38nC66kfLd7VZNsgbcAi4PGOi7DRRg3)"><path d=" M 4.093 3.659 L 12.367 3.602 L 12.47 11.53 L 19.708 11.589 C 20.491 11.88 20.978 12.333 21.14 12.916 L 21.185 18.948 C 20.776 19.982 20.21 20.563 19.458 20.661 L 4.365 20.707 C 3.555 20.556 3.091 20.096 2.943 19.297 L 2.918 4.703 C 3.083 4.113 3.485 3.775 4.093 3.659 Z  M 5.365 5.49 L 10.865 5.49 L 11 13.109 L 18.146 13.06 C 19.067 13.229 19.489 13.601 19.382 14.146 L 19.439 17.77 C 19.318 18.51 18.887 18.922 18.114 18.978 L 5.583 18.873 C 4.954 18.809 4.63 18.462 4.583 17.802 L 4.583 6.365 C 4.531 5.906 4.802 5.625 5.365 5.49 Z  M 12.677 18.922 Q 11.197 18.906 11.107 18.914 C 11.107 18.844 11.018 13.193 11.01 13.12 L 12.615 13.084 L 12.677 18.922 Z  M 4.599 13.099 L 4.591 11.529 L 10.945 11.502 L 10.953 13.113 L 4.599 13.099 Z  M 16.906 2.836 Q 16.883 2.93 16.887 5.844 L 14.039 5.832 L 14.063 6.758 L 16.934 6.77 L 16.922 9.207 L 18.164 9.195 L 18.141 6.758 L 20.93 6.734 L 20.906 5.785 L 18.117 5.809 L 18.055 2.789 Q 16.93 2.742 16.906 2.836 Z " fill-rule="evenodd" fill="currentColor"/></g></svg>`
    };
    this.svg_apple_share = function(e) {
        let t = e ? "rgb(0,122,255)" : "var(--progressierTxt)";
        return `<div class="apple-share-sheet-icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_1sSIM60gYe6pwlZAeBP3QLTk5j8EPtsR"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_1sSIM60gYe6pwlZAeBP3QLTk5j8EPtsR)"><clipPath id="_clipPath_6qRU20enGGXkl32V2q7xhx6EpHZn10bb"><rect x="0" y="0" width="24" height="24" transform="matrix(1,0,0,1,0,0)" fill="rgb(255,255,255)"/></clipPath><g clip-path="url(#_clipPath_6qRU20enGGXkl32V2q7xhx6EpHZn10bb)"><g/></g><path d=" M 15.7 4.98 L 12.033 2.36 L 8.344 4.99 L 6.761 3.84 L 12.022 0.07 L 17.416 3.86 L 15.7 4.98 Z " fill="` + t + `"/><path d=" M 11.481 2.884 L 12.519 2.884 L 12.519 13.766 L 11.481 13.766 L 11.481 2.884 Z " fill="` + t + `" vector-effect="non-scaling-stroke" stroke-width="1" stroke="` + t + `" stroke-linejoin="miter" stroke-linecap="butt" stroke-miterlimit="4"/><path d=" M 18.603 23.687 L 5.397 23.687 C 4.741 23.687 4.114 23.427 3.649 22.963 C 3.193 22.489 2.936 21.851 2.946 21.184 L 2.946 9.093 C 2.946 8.435 3.202 7.797 3.658 7.324 C 4.124 6.86 4.751 6.599 5.397 6.599 L 8.819 6.599 L 8.819 8.909 L 5.397 8.909 C 5.349 8.909 5.302 8.928 5.264 8.957 C 5.235 8.996 5.216 9.044 5.216 9.093 L 5.216 21.184 C 5.216 21.232 5.235 21.281 5.264 21.319 C 5.302 21.358 5.349 21.377 5.397 21.377 L 18.603 21.377 C 18.603 21.377 18.613 21.377 18.613 21.377 C 18.66 21.377 18.708 21.358 18.746 21.329 C 18.774 21.29 18.793 21.252 18.784 21.203 C 18.784 21.194 18.784 21.194 18.784 21.184 L 18.784 9.093 C 18.784 9.044 18.765 8.996 18.736 8.957 C 18.698 8.928 18.651 8.909 18.603 8.909 L 15.273 8.909 L 15.273 6.599 L 18.603 6.599 C 19.259 6.589 19.886 6.85 20.351 7.314 C 20.807 7.788 21.064 8.435 21.054 9.093 L 21.054 21.184 C 21.064 21.851 20.807 22.489 20.351 22.963 C 19.886 23.427 19.259 23.687 18.603 23.687 Z " fill="` + t + `"/></g></svg></div>`
    };
    this.svg_samsung_install = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_73NeHNlK2mYJFMPR6hz9zt5UHlo9uJKs"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_73NeHNlK2mYJFMPR6hz9zt5UHlo9uJKs)"><clipPath id="_clipPath_R5pMYMQLiJhSmwzGJlESt6pUpab4E8dI"><rect x="0" y="0" width="24" height="24" transform="matrix(1,0,0,1,0,0)" fill="rgb(255,255,255)"/></clipPath><g clip-path="url(#_clipPath_R5pMYMQLiJhSmwzGJlESt6pUpab4E8dI)"><g><path d=" M 16.567 23.533 C 16.006 23.635 9.461 23.683 6.51 23.522 C 6.341 23.522 5.431 23.273 5.323 23.14 C 3.234 22.322 1.169 20.341 0.274 17.498 C -0.017 14.641 -0.159 11.418 0.274 6.936 C 0.523 3.584 3.96 0.776 6.009 0.378 C 6.092 0.121 15.959 -0.106 17.454 0.276 C 20.848 1.152 22.952 3.456 23.733 7.148 C 24.444 11.524 23.581 19.279 22.938 18.911 C 22.888 21.16 17.401 24.037 16.567 23.533 Z  M 16.573 21.595 C 13.881 21.802 8.852 21.829 6.722 21.783 C 4.262 20.935 2.584 19.153 2.056 16.989 L 2.098 7.106 C 2.506 4.662 4.317 3.06 6.624 2.192 C 6.855 1.918 12.579 1.795 16.969 2.025 C 19.515 2.873 20.052 3.298 21.833 6.861 C 22.078 10.96 21.946 14.835 21.889 16.363 C 21.866 17.071 21.418 17.82 21.409 17.777 C 20.876 19.355 19.175 21.82 16.573 21.595 Z  M 10.577 7.162 C 10.634 8.52 10.663 14.459 10.634 14.798 Q 10.617 15.001 8.203 12.479 C 7.139 12.426 6.726 13.012 6.93 14.204 L 10.55 18.163 C 11.229 18.446 11.929 18.438 12.614 18.106 L 16.573 13.836 C 16.372 12.744 15.753 12.351 14.679 12.62 L 12.84 14.77 L 12.928 6.927 C 12.331 5.833 11.171 5.664 10.577 7.162 Z " fill-rule="evenodd" fill="currentColor"/></g></g></g></svg>`
    };
    this.svg_send_test = function() {
        return `<svg class="progressier-send-icon-plane" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m2.72112607 2.05149449 15.35446653 7.565969c.247703.12205658.3495596.42180601.227503.66950901-.048698.0988284-.1286747.1788051-.227503.2275031l-15.3541508 7.5658134c-.24770306.1220566-.54745246.0202-.66950904-.227503-.0533719-.1083136-.06574404-.2322825-.03483109-.3490077l1.52125123-5.7446792c.05030971-.1899839.20725125-.3328751.40110728-.3651979l6.88094892-1.1473027c.0842946-.0140491.1539978-.0697032.1874987-.1453514l.018-.0601474c.0194561-.11673645-.0453599-.22804672-.1500414-.27176154l-.0554573-.01593664-6.91980045-1.15330008c-.1939323-.03232205-.35092201-.17529727-.401185-.36537116l-1.48266862-5.60684181c-.07063055-.26695681.08852333-.54062543.35548014-.61125598.11669248-.03087411.24061464-.01849152.3488909.034862z" fill="currentColor"/></svg><style>*[dir="rtl"] .progressier-send-icon-plane{transform: rotate(180deg);}</style>`
    };
    this.svg_external_link = function() {
        return `<svg class="progressier-external-link-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_W2zItRoo6HVO13gfSLotYNiKjMCIPrUc"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_W2zItRoo6HVO13gfSLotYNiKjMCIPrUc)"><path d=" M 17.396 19.583 L 17.458 12.74 C 18.146 11.757 18.864 11.746 19.583 12.677 L 19.49 19.74 C 19.218 21.007 18.426 21.954 17.083 22.552 L 4.333 22.49 C 3.213 22.217 2.369 21.477 1.771 20.24 C 1.678 17.815 1.771 10.771 1.771 7.177 C 2.148 5.816 3.196 5.19 4.052 4.74 L 11.406 4.688 C 12.486 5.34 12.382 6.132 11.271 6.802 L 4.49 6.865 C 4.149 7.068 3.908 7.254 3.833 7.552 L 3.771 19.615 L 4.521 20.427 L 16.833 20.365 L 17.396 19.583 Z  M 9.927 12.802 Q 19.646 3.521 19.083 3.583 Q 18.521 3.646 16.083 3.646 C 13.708 3.802 13.615 1.302 15.865 1.49 L 21.958 1.427 C 22.394 1.512 22.654 1.751 22.708 2.115 Q 22.702 8.177 22.708 8.552 C 22.74 10.552 20.458 10.615 20.646 8.302 L 20.552 5.115 L 11.24 14.49 C 9.396 15.865 8.333 14.271 9.927 12.802 Z " fill-rule="evenodd" fill="currentColor"/></g></svg><style>*[dir="rtl"] .progressier-external-link-icon{transform: rotate(270deg);}</style>`
    };
    this.svg_more = function() {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24pt" height="24pt"><defs><clipPath id="_clipPath_fQ9bSYlzLjk9WzfgGZrLJAaAh0nWRgan"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_fQ9bSYlzLjk9WzfgGZrLJAaAh0nWRgan)"><path d=" M 9.774 6.211 C 9.774 4.982 10.772 3.984 12 3.984 C 13.229 3.984 14.227 4.982 14.227 6.211 C 14.227 7.439 13.229 8.437 12 8.437 C 10.772 8.437 9.774 7.439 9.774 6.211 Z  M 9.747 12.212 C 9.747 10.983 10.744 9.986 11.973 9.986 C 13.202 9.986 14.2 10.983 14.2 12.212 C 14.2 13.441 13.202 14.438 11.973 14.438 C 10.744 14.438 9.747 13.441 9.747 12.212 Z  M 9.732 18.31 C 9.732 17.081 10.729 16.084 11.958 16.084 C 13.187 16.084 14.184 17.081 14.184 18.31 C 14.184 19.539 13.187 20.536 11.958 20.536 C 10.729 20.536 9.732 19.539 9.732 18.31 Z " fill-rule="evenodd" fill="currentColor"/></g></svg>`
    };
    this.randomId = function() {
        var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var t = "";
        for (var i = 0; i < 15; i++) {
            t += e.substr(Math.floor(Math.random() * e.length), 1)
        }
        return t
    };
    this.textIsDark = function(e) {
        try {
            var t = e.charAt(0) === "#" ? e.substring(1, 7) : e;
            var i = parseInt(t.substring(0, 2), 16);
            var n = parseInt(t.substring(2, 4), 16);
            var a = parseInt(t.substring(4, 6), 16);
            var r = 160;
            var s = i * .299 + n * .587 + a * .114;
            var o = s > r ? true : false;
            return o
        } catch (l) {
            return true
        }
    };
    this.styling = function(e, t, i) {
        var n = i || document;
        var a = n.getElementById(t) || c.node("style", {
            id: t,
            parent: n.querySelector("body")
        });
        a.innerHTML = e
    };
    this.lets = async function(e, t, i, n) {
        if (e !== "GET" && e !== "POST") {
            throw "the type should be GET or POST"
        }
        var a = {
            "Content-Type": "application/json"
        };
        if (n) {
            for (var r in n) {
                if (n.hasOwnProperty(r)) {
                    a[r] = n[r]
                }
            }
        }
        var s = {
            method: e,
            headers: a
        };
        if (i) {
            s.body = i ? JSON.stringify(i) : {}
        }
        var o = await fetch(t, s);
        var l = await o.text();
        var p = JSON.parse(l);
        if (o.status !== 200 && o.status !== 201) {
            throw p.error
        }
        return p
    };
    this.node = function(e, t, i) {
        var n = document.createElement(e);
        if (t && typeof t === "object" && Array.isArray(t) && t.length > 0) {
            t.forEach(function(e) {
                n.classList.add(e)
            })
        } else if (t && typeof t === "string") {
            var a = t.split(" ");
            a.forEach(function(e) {
                n.classList.add(e)
            })
        } else if (t && typeof t === "object") {
            i = t
        }
        if (i && typeof i === "object") {
            for (var r in i) {
                if (i.hasOwnProperty(r)) {
                    switch (r) {
                        case "text":
                            n.textContent = i[r];
                            break;
                        case "html":
                            n.innerHTML = i[r];
                            break;
                        case "classes":
                            i[r].forEach(function(e) {
                                n.classList.add(e)
                            });
                            break;
                        case "class":
                            n.classList.add(i[r]);
                            break;
                        case "background":
                            n.style.background = i[r];
                            break;
                        case "color":
                            n.style.color = i[r];
                            break;
                        case "parent":
                            i[r].appendChild(n);
                            break;
                        case "click":
                            n.addEventListener("click", i[r]);
                            break;
                        case "touchstart":
                            n.addEventListener("touchstart", i[r]);
                            break;
                        case "hover":
                            n.addEventListener("hover", i[r]);
                            break;
                        case "change":
                            n.addEventListener("change", i[r]);
                            break;
                        case "focus":
                            n.addEventListener("focus", i[r]);
                            break;
                        case "mouseenter":
                            n.addEventListener("mouseenter", i[r]);
                            break;
                        case "scroll":
                            n.addEventListener("scroll", i[r]);
                            break;
                        case "input":
                            n.addEventListener("input", i[r]);
                            break;
                        case "value":
                            n.value = i[r];
                            break;
                        case "animate":
                            setTimeout(function() {
                                for (var e in i[r]) {
                                    if (i[r].hasOwnProperty(r)) {
                                        if (e === "ms") {
                                            continue
                                        }
                                        n.style[e] = i[r][e]
                                    }
                                }
                            }, i[r].ms);
                            break;
                        default:
                            n.setAttribute(r, i[r])
                    }
                }
            }
        }
        return n
    };
    this.runtimeSettings = function(e) {
        try {
            if (!window.progressierAppRuntimeSettings || typeof window.progressierAppRuntimeSettings !== "object") {
                return e
            }
            window.progressierAppRuntimeSettings.currentDomain = window.location.host;
            var t = JSON.stringify(window.progressierAppRuntimeSettings);
            var i = (new TextEncoder).encode(t);
            var n = btoa(String.fromCodePoint(...i));
            var a = new URL(e);
            a.searchParams.append("runtimesettings", n);
            return a.href
        } catch (r) {
            return e
        }
    };
    this.queryStringsAreEqual = function(e, t) {
        try {
            if (!e & t || e && !t) {
                return false
            }
            var i = new URLSearchParams(e);
            var n = new URLSearchParams(t);
            var a = 0;
            var r = 0;
            for (var s of n.entries()) {
                r += 1;
                if (i.get(s[0]) === s[1]) {
                    a += 1
                }
            }
            if (r === a) {
                return true
            }
            return false
        } catch (o) {
            return false
        }
    };
    this.wildCardMatchCurrent = function(e) {
        if (!e) {
            return false
        }
        if (!e.includes("*")) {
            return false
        }
        var t = new URL(window.location.href);
        var i = e.toLowerCase().trim().replace(/\*/g, "[^ ]*");
        var n = (t.origin + t.pathname).toLowerCase().trim();
        if (n[n.length - 1] === "/") {
            n = n.slice(0, n.length - 1)
        }
        var a = new RegExp(i).test(n);
        return a
    };
    this.urlMatchFailed = function(e) {
        try {
            if (!e || typeof e !== "object" || e.length < 1) {
                return false
            }
            var r = new URL(window.location.href);
            var s = r.pathname;
            var o = "%&%";
            if (s && s[s.length - 1] === "/") {
                s = s.slice(0, s.length - 1)
            }
            var l = false;
            var p = false;
            var t = e.filter(e => e.startsWith(o));
            if (e.length > 0 && t.length === e.length) {
                l = true
            }
            e.forEach(function(e) {
                try {
                    var t = e.startsWith(o);
                    if (t) {
                        e = e.replace(o, "")
                    }
                    var i = new URL(e, window.location);
                    if (c.wildCardMatchCurrent(e)) {
                        l = true;
                        if (t) {
                            p = true
                        }
                        return
                    }
                    var n = i.pathname;
                    if (n && n[n.length - 1] === "/") {
                        n = n.slice(0, n.length - 1)
                    }
                    if (n !== s) {
                        return
                    }
                    if (i.origin !== r.origin) {
                        return
                    }
                    if (!i.search) {
                        l = true;
                        if (t) {
                            p = true
                        }
                    }
                    if (c.queryStringsAreEqual(r.search, i.search)) {
                        l = true;
                        if (t) {
                            p = true
                        }
                    }
                } catch (a) {
                    console.log(a)
                }
            });
            if (p) {
                return true
            }
            return l ? false : true
        } catch (i) {}
    };
    this.timeFromNow = function(e) {
        let t = new Date(e).getTime();
        if (!t) return;
        let i = (new Date).getTime();
        let n = t / 1e3 - i / 1e3;
        let a = {};
        a.when = "now";
        if (n > 0) {
            a.when = "future"
        } else if (n < -1) {
            a.when = "past"
        }
        n = Math.abs(n);
        if (n / (60 * 60 * 24 * 365) > 1) {
            a.unitOfTime = c.parent.wording.get("y");
            a.time = Math.floor(n / (60 * 60 * 24 * 365))
        } else if (n / (60 * 60 * 24 * 30) > 1) {
            a.unitOfTime = c.parent.wording.get("m");
            a.time = Math.floor(n / (60 * 60 * 24 * 30))
        } else if (n / (60 * 60 * 24) > 1) {
            a.unitOfTime = c.parent.wording.get("d");
            a.time = Math.floor(n / (60 * 60 * 24))
        } else if (n / (60 * 60) > 1) {
            a.unitOfTime = c.parent.wording.get("h");
            a.time = Math.floor(n / (60 * 60))
        } else {
            a.unitOfTime = c.parent.wording.get("mm");
            a.time = Math.ceil(n / 60)
        }
        if (a.time === 1) {
            a.unitOfTime = a.unitOfTime.replace(/\[.*?\]/, "")
        } else {
            a.unitOfTime = a.unitOfTime.replace(/[\[\]]/g, "")
        }
        if (a.when === "now" || a.when === "future") {
            return c.parent.wording.get("ss")
        } else {
            return a.unitOfTime.replace("X", a.time)
        }
    };
    this.backdrop = new ProgressierBackdrop(c)
}

function ProgressierAttribution(e, t, i) {
    var r = this;
    this.parent = e || progressier;
    this.position = t || "left";
    this.previewing = i || false;
    this.remove = function() {
        r.element.remove()
    };
    this.init = function() {
        var e = r.parent.fetchdomain;
        var t = r.previewing ? e + "?force=true" : e + "?poweredby=true";
        r.element = r.parent.utils.node("div", {
            click: r.remove,
            style: `overflow:hidden !important;filter: none !important;transform: scale(1) !important;box-shadow:0 2px 8px rgba(15,41,14,0.08), 0 3px 35px rgba(7,21,41,0.20) !important;visibility:visible !important;opacity:1 !important;position:fixed !important;` + r.position + `:20px !important;bottom:20px !important;width:180px !important;height:35px !important;text-align:center !important;z-index:2147483647 !important;border-radius: 20px !important;font-size:14px !important;background:#fff !important;color:#363131 !important;display:flex!important;align-items:center !important;justify-content:center !important;flex-direction:row !important;text-decoration:none !important;outline:0px !important;border:0px !important;`,
            html: `<a href="` + t + `" target="_blank" style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif !important;height:100% !important;width:100% !important;visibility:visible !important;filter: none !important;opacity:1 !important;color:#363131 !important;display:flex!important;align-items:center !important;justify-content:center !important;flex-direction:row !important;text-decoration:none !important;outline:0px !important;border:0px !important;font-size:11px !important;background:#fff !important;letter-spacing: 0px !important;transform: scale(1) !important;font-weight:400 !important;">Powered by <img alt="Progressier logo" style="object-fit: contain !important;color:transparent !important;width: 90px !important;visibility:visible !important;opacity:1 !important;display:flex !important;flex:none !important;transform: scale(1) !important;filter: none !important;margin-left: 0px !important;" src="` + r.parent.fetchdomain + `/assets/img/progressier-full-logo.svg" /></a>`
        });
        var i = document.querySelector("body");
        var n = i.childNodes || [];
        if (n.length > 1) {
            var a = n[Math.floor(Math.random() * n.length)];
            i.insertBefore(r.element, a)
        } else {
            i.appendChild(r.element)
        }
    };
    this.init()
}

function ProgressierData(e) {
    var s = this;
    this.params = null;
    this.parent = e;
    this.id = s.parent.appId;
    this.domain = function() {
        return s.parent.fetchdomain
    };
    this.version = 1;
    this.downloadDetails = async function() {
        if (s.params) {
            return
        }
        var e = s.domain() + "/myapp/" + s.id + "/get-app?version=" + s.version;
        if (s.parent.script.includes("progressier.app")) {
            e = "https://progressier.app/" + s.id + "/get-app"
        }
        var t = await s.parent.utils.lets("GET", e);
        s.params = t.app;
        if (s.params.themePreference === "dark") {
            s.parent.theming.darkOnly()
        } else if (s.params.themePreference === "light") {
            s.parent.theming.lightOnly()
        }
        let i = s.params && s.params.featurePermissions && typeof s.params.featurePermissions === "object" && Array.isArray(s.params.featurePermissions) && s.params.featurePermissions.includes("newsfeedWidget");
        Object.defineProperty(s, "newsfeedAccess", {
            writable: false,
            configurable: false,
            enumerable: true,
            value: i
        });
        try {
            if (s.params.featurePermissions && s.params.featurePermissions.includes("manifestRuntimeAuthorization") && window.progressierAppRuntimeSettings && typeof window.progressierAppRuntimeSettings === "object") {
                let e = ["icon512", "themeColor", "name", "shortName", "scope", "startUrl", "desktopQRCode", "domain", "buttonColor"];
                for (let t in window.progressierAppRuntimeSettings) {
                    if (!e.includes(t)) {
                        continue
                    }
                    s.params[t] = window.progressierAppRuntimeSettings[t]
                }
                if (window.progressierAppRuntimeSettings.buttonColor) {
                    s.params.buttonTextColor = s.parent.utils.textIsDark(window.progressierAppRuntimeSettings.buttonColor) ? "rgba(33, 14, 14, 0.78)" : "#ffffff"
                }
                s.params.domain = window.location.host;
                if (window.progressierAppRuntimeSettings.icon512) {
                    let e = ["icon72", "icon180", "icon192", "icon192t", "icon196", "icon196t", "icon200", "icon512t", "icon520", "roundedPaddedIcon"];
                    e.forEach(function(e) {
                        s.params[e] = s.params.icon512
                    })
                }
            }
        } catch (r) {}
        let n = ["pushBannerPitch", "name", "installBannerPitch"];
        let a = s.parent.wording.language();
        n.forEach(function(t) {
            try {
                if (a === "en") {
                    return
                }
                let e = s.params.localized[t][a];
                if (e) {
                    s.params[t] = e
                }
            } catch (r) {}
        });
        s.params.currentlyOnEmbeddablePage = window.location.href.startsWith(s.params.embeddablePageLocation);
        if (s.params.hasDeeperSw) {
            s.params.embedUrl = "https://" + s.params.domain + "/" + (s.params.startUrl || "");
            if (s.params.currentlyOnEmbeddablePage) {
                s.params.wrapperOnlyMode = true
            }
            if (s.parent.detection.requiresInScopeSw()) {
                s.params.usePromoMethod = true
            }
        }
        if (s.params.currentlyOnEmbeddablePage && !s.params.wrapperOnlyMode && !s.params.isEmbed) {
            s.params.embedUrl = "https://" + s.params.domain + "/" + (s.params.startUrl || "");
            s.params.wrapperOnlyMode = true;
            s.params.isEmbed = false
        }
    };
    this.getDisplayableLogo = function() {
        return s.params.icon512 || progressier.utils.emptyLogo()
    };
    this.waitForData = function() {
        return new Promise(function(e, t) {
            var i = setInterval(function() {
                if (!s.params || !s.params.name) {
                    return
                }
                clearInterval(i);
                return e(s.params)
            }, 100)
        })
    };
    this.get = async function(e) {
        if (s.params) {
            return s.params[e]
        }
        await s.waitForData();
        return s.params[e]
    };
    this.autoRewriteUrl = async function() {
        if (!s.params.forceTrailingSlash) {
            return
        }
        var e = function(e) {
            var t = window.location.pathname;
            var i = t[t.length - 1];
            if (i === "/") {
                return
            }
            var n = new URL(window.location.href);
            n.pathname += "/";
            window.history.replaceState({
                addingtrailingslash: true
            }, document.title, n.href)
        };
        e();
        var t = history.pushState;
        history.pushState = function() {
            t.apply(history, arguments);
            e()
        };
        var i = history.replaceState;
        history.replaceState = function() {
            i.apply(history, arguments);
            e()
        }
    };
    this.registerExtraScript = async function() {
        if (!s.params.additionalScript) {
            return
        }
        var e = document.createElement("script");
        e.setAttribute("src", s.params.additionalScript);
        document.querySelector("body").appendChild(e)
    };
    this.registerPullToRefresh = async function() {
        if (!s.params.pullToRefresh) {
            return
        }
        if (!s.parent.detection.isIOS()) {
            return
        }
        if (!s.parent["native"].standalone) {
            return
        }
        new ProgressierPullToRefresh(s.parent)
    };
    this.updateBannerIntervals = async function() {
        var e = await ProgressierForPromoOnly();
        if (e) {
            s.params.installBannerInterval = 43800;
            s.params.pushBannerInterval = 43800
        }
    };
    this.init = async function() {
        try {
            await s.downloadDetails();
            await s.autoRewriteUrl();
            await s.registerExtraScript();
            await s.registerPullToRefresh();
            await s.updateBannerIntervals()
        } catch (e) {
            console.log(e)
        }
    };
    this.init()
}

function ProgressierPullToRefresh(e) {
    var r = this;
    this.parent = e;
    this.stickyDistance = 150;
    this.startingPoint = 0;
    this.className = "progressier-pull-to-refresh";
    this.styling = `
		.` + r.className + `{position:fixed;top:-100px;width:40px;height:40px;display:flex;border-radius:50%;background:var(--progressierElement);left:calc(50% - 20px);box-shadow:var(--progressierBoxShadow);z-index:2147483647;transition:all 0.1s linear;-webkit-transition:all 0.1s linear;color:var(--progressierTxt);justify-content:center;align-items:center;}
		.` + r.className + ` svg{width:22px;height:22px;flex:none;}
		.` + r.className + `-spining svg { animation: ` + r.className + `-spining-animation 20s linear infinite;}
		@keyframes ` + r.className + `-spining-animation { 0% {-webkit-transform: rotate(0deg) scale(1.2); transform: rotate(0deg) scale(1.2); } 100% { -webkit-transform: rotate(7200deg) scale(1.2); transform: rotate(7200deg) scale(1.2); }}
	`;
    this.indicatorIcon = `<svg class="` + r.className + `-indicator" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M447.5 224H456c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L397.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L311 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H447.5z" fill="currentColor"/></svg>`;
    this.loadingIcon = `<svg xmlns="http://www.w3.org/2000/svg" id="` + r.className + `-loader" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto;display: block; shape-rendering: auto;transform:scale(1.2);" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="currentColor" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138"></circle></svg>`;
    this.y = function(e) {
        return e.touches ? e.touches[0].screenY : e.screen
    };
    this.hasScrolledParent = function(e) {
        var t = e;
        while (t) {
            if (t.scrollTop > 0) {
                return true
            }
            t = t.parentNode
        }
        return false
    };
    this.allowed = function(e) {
        var t = r.hasScrolledParent(e.target);
        if (t) {
            return false
        }
        return true
    };
    this.onStart = function(e) {
        r.startingPoint = r.allowed(e) ? r.y(e) : 0;
        r.currentDistance = 0
    };
    this.onEnd = async function(e) {
        if (!r.startingPoint) {
            return
        }
        r.startingPoint = 0;
        var t = r.currentDistance >= r.stickyDistance;
        r.currentDistance = 0;
        if (!r.allowed(e)) {
            return
        }
        if (t) {
            r.el.innerHTML = r.loadingIcon;
            r.el.classList.add(r.className + "-spining");
            setTimeout(function() {
                window.location.reload()
            }, 300)
        } else {
            r.updateEl()
        }
    };
    this.onMove = function(e) {
        if (!r.allowed(e)) {
            return
        }
        var t = r.y(e);
        r.currentDistance = parseInt(t - r.startingPoint);
        if (r.currentDistance < 0) {
            return
        }
        if (r.currentDistance > r.stickyDistance) {
            r.currentDistance = r.stickyDistance
        }
        r.updateEl()
    };
    this.updateEl = function() {
        var e = r.currentDistance + 50;
        var t = parseInt(360 / r.stickyDistance * r.currentDistance);
        var i = parseInt(80 / r.stickyDistance * r.currentDistance);
        var n = parseInt(150 / r.stickyDistance * r.currentDistance) / 100;
        if (i > 100) {
            i = 100
        }
        if (n > 1) {
            n = 1
        }
        r.el.setAttribute("style", `-webkit-transform:translate(0, ` + e + `px) rotate(` + t + `deg);transform:translate(0, ` + e + `px) rotate(` + t + `deg);`);
        var a = r.el.querySelector("." + r.className + "-indicator");
        if (!a) {
            return
        }
        a.setAttribute("style", `opacity:` + i + `%;-webkit-transform:scale(` + n + `);transform:scale(` + n + `);`)
    };
    this.create = function() {
        r.el = document.createElement("div");
        r.el.classList.add(r.className);
        r.el.innerHTML = r.indicatorIcon;
        document.querySelector("body").appendChild(r.el)
    };
    this.init = function() {
        r.parent.utils.styling(r.styling, r.className);
        r.create();
        window.addEventListener("touchstart", r.onStart);
        window.addEventListener("touchend", r.onEnd);
        window.addEventListener("touchmove", r.onMove)
    };
    this.init()
}

function ProgressierCookies() {
    var r = this;
    r["delete"] = function(e) {
        document.cookie = e + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    };
    r.set = function(e, t, i) {
        if (t === null) {
            return r["delete"](e)
        }
        var n = new Date;
        n.setTime(n.getTime() + i * 24 * 60 * 60 * 1e3);
        var a = "expires=" + n.toUTCString();
        document.cookie = e + "=" + t + ";" + a + ";path=/"
    };
    r.get = function(e) {
        try {
            var t = e + "=";
            var i = decodeURIComponent(document.cookie);
            var n = i.split(";");
            for (var a = 0; a < n.length; a++) {
                var r = n[a];
                while (r.charAt(0) == " ") {
                    r = r.substring(1)
                }
                if (r.indexOf(t) == 0) {
                    return r.substring(t.length, r.length)
                }
            }
            return ""
        } catch (s) {
            return ""
        }
    }
}

function ProgressierAnnouncement(e, t) {
    let r = this;
    this.data = JSON.parse(JSON.stringify(e));
    this.helpers = t || null;
    this.readOnly = r.helpers ? false : true;
    this.cn = "progressier-announcement";
    this.styling = `
	.` + r.cn + `{position:relative;width: calc(500px + 40px); height: 60vh; overflow: auto;background: var(--progressierBg);border-radius: 10px;box-shadow:var(--el-shadow);margin-bottom:10px; min-height: 50px;box-shadow:rgba(228, 228, 234, 0.22) 0px 22px 25px 0px, rgba(228, 228, 234, 0.5) 0px 9px 23px 0px;font-size:14px;}
	.` + r.cn + `-wrapper *:not(i){font-family:var(--progressierFont) !important;letter-spacing: 0.3px !important;box-sizing:content-box !important;float:none !important;}
	.` + r.cn + ` *{font-size:14px;}
	.` + r.cn + ` .cdx-alert *{line-height:20px !important;}
	.` + r.cn + ` .cdx-block, .` + r.cn + ` .cdx-block *, .` + r.cn + ` .ce-header *, .` + r.cn + ` .ce-header{color:var(--progressierTxt) !important;}
	.ce-toolbar__plus, .ce-toolbar__settings-btn{border-radius:0px !important;margin:0px !important;}
	.` + r.cn + `-wrapper{position:fixed; top:0px; left:0px; width:100vw; height:100vh; background:var(--progressierBackdrop);-webkit-backdrop-filter:grayscale(1) blur(5px); backdrop-filter:grayscale(1) blur(5px); display:flex; justify-content:center; align-items:center; z-index:99999999999;flex-direction:column;}
	.` + r.cn + `-header{width:500px;display: flex; flex-direction: row; background: var(--progressierBg);box-shadow:rgba(228, 228, 234, 0.22) 0px 22px 25px 0px, rgba(228, 228, 234, 0.5) 0px 9px 23px 0px, rgba(228, 228, 234, 0.5) 20px -19px 100px 0px; border-radius: 10px;position:relative; padding: 20px; margin-bottom: 10px; align-items: flex-start;}
	.` + r.cn + `-header{max-width: 90vw;}
	.` + r.cn + `, .` + r.cn + `-footer{max-width:calc(100vw + 40px);}
	.` + r.cn + `-img{cursor:pointer;width:50px;height:50px;margin-inline-end:20px;border-radius:10px;position:relative;overflow:hidden;flex:none;transition:all 0.3s ease-in-out; -webkit-transition:all 0.3s ease-in-out;}
	.` + r.cn + `-img:hover{transform:scale(1.03);}
	.` + r.cn + `-img img{width:100% !important;height:100% !important;object-fit: cover !important;outline:0px !important;border:0x !important;}
	.` + r.cn + `-wrapper.readonly .` + r.cn + `-img, .` + r.cn + `-wrapper.readonly .` + r.cn + `-date{pointer-events:none;}
	.` + r.cn + `-wrapper .cdx-marker{background:rgba(250, 240, 32, 0.39) !important;}
	.` + r.cn + `-date{font-size:14px; cursor:pointer;position:relative;}
	.` + r.cn + `-date-rendered{ padding: 5px; margin-left: -5px; height: 20px; display: flex; align-items: center; z-index: 2; position: relative;}
	.` + r.cn + `-date-rendered i{margin-left:3px;}
	.` + r.cn + `-wrapper.readonly .` + r.cn + `-date-rendered{color:var(--progressierTxt);}
	.` + r.cn + `-wrapper.readonly .` + r.cn + `-date-rendered i{display:none !important;}
	.` + r.cn + `-title{font-size:18px;font-weight:500;word-break: break-word;color:var(--progressierTxt);line-height:23px;}
	.` + r.cn + `-txt{ padding-inline-end: 60px;}
	.` + r.cn + `-close, .` + r.cn + `-trash{position: absolute; right: 10px; top:10px;font-size: 18px; color: var(--progressierTxt); border-radius: 5px; height: 35px; width: 35px; display: flex; justify-content: center; align-items: center; cursor: pointer;}
	.` + r.cn + `-close svg{width:20px;height:20px;flex:none;}
	.` + r.cn + `-wrapper[dir="rtl"] .` + r.cn + `-close{right:unset;left:15px;}
	.` + r.cn + `-wrapper[dir="rtl"] .` + r.cn + `-trash{right:unset;left:60px;}
	.` + r.cn + `-close:hover, .` + r.cn + `-trash:hover, .ce-toolbar__plus:hover, .ce-toolbar__settings-btn:hover{background: rgba(131,131,131,0.1) !important;}
	.` + r.cn + `-wrapper .cdx-search-field, .` + r.cn + `-wrapper .embed-tool__caption{display:none !important;}
	.` + r.cn + ` .codex-editor{ height: fit-content;  overflow-y:hidden;overflow-x: hidden; }
	.` + r.cn + ` .codex-editor__redactor{padding: 10px 20px; height: calc(100% - 320px);overflow-y:auto;overflow-x: hidden; }
	.` + r.cn + `-wrapper *::selection {background:#56feff !important;color:#000 !important;}
	.` + r.cn + `-wrapper .codex-editor--narrow .codex-editor__redactor{margin-right:0px !important;}
	.` + r.cn + ` .codex-editor--narrow .ce-toolbar__actions{right: 10px !important; position: absolute; background: #fff; border-radius: 5px; padding-right: 0px; margin-top: -5px; border: 1px solid #f3f3f3; -webkit-box-shadow: 0 3px 15px -3px #d6d6d6; box-shadow: 0 3px 15px -3px #d6d6d6;}
	.` + r.cn + `::-webkit-scrollbar-track{ -webkit-box-shadow: inset 0 0 0px rgba(0,0,0,0) !important; background-color: transparent !important;}
	.` + r.cn + `::-webkit-scrollbar{ width: 10px !important; background-color: transparent !important;}
	.` + r.cn + `::-webkit-scrollbar-thumb{ background-color: var(--progressierBorderColor) !important; border-radius:15px !important;}
	.` + r.cn + `-wrapper .ce-block--selected .ce-block__content{background:var(--progressierHover) !important;}
	.` + r.cn + `-details{display:flex;	margin-top: 8px;align-items: center;flex-direction: row-reverse;justify-content: flex-end;}
	.` + r.cn + `-wrapper.readonly .` + r.cn + `-details{margin-top:3px;}
	.` + r.cn + ` .image-tool__caption, .` + r.cn + `-editor .embed-tool__caption{opacity:0.01 !important;display:none !important; }
	.` + r.cn + ` h2{font-size:18px !important;font-weight:500 !important;}
	.` + r.cn + `-wrapper.readonly .codex-editor__redactor{padding-bottom:10px !important;}
	.` + r.cn + `-wrapper.readonly .` + r.cn + `{height:fit-content !important;max-height:60vh;scrollbar-color: var(--progressierBorderColor) var(--progressierBg) !important; scrollbar-width: auto;}
	.` + r.cn + `-wrapper.readonly .ce-block:first-child{display:none !important;}
	.` + r.cn + `-wrapper.readonly .codex-editor--narrow .codex-editor__redactor{margin-right:0px !important;}
	.` + r.cn + `-wrapper .ce-block a{padding:0px !important;display: inline !important;text-decoration: underline !important;}
	.` + r.cn + `-wrapper.readonly .` + r.cn + `-date-rendered{opacity:0.6;padding:0px !important;margin-left:0px !important;}
	.` + r.cn + `-wrapper .ce-block__content{max-width:100% !important;}
	.` + r.cn + `-wrapper li.cdx-list__item{padding:0px !important;}
	body[data-progressier-forced-theme="dark"] .` + r.cn + `-header{box-shadow: none !important;}
	body[data-progressier-forced-theme="dark"] .` + r.cn + `{box-shadow: none !important;}
	@media (prefers-color-scheme: dark) {
		body:not([data-progressier-forced-theme="light"]) .` + r.cn + `-header{box-shadow: none !important;}
		body:not([data-progressier-forced-theme="light"]) .` + r.cn + `{box-shadow: none !important;}
	}
	@media (max-width:768px){
		.` + r.cn + `-wrapper:not(.readonly) .` + r.cn + `{height: 150vh; padding-bottom: 200px;}
		.` + r.cn + `-header{width: calc(100vw - 50px);max-width: calc(100vw - 50px);}
		.` + r.cn + `{width: calc(100vw - 10px);margin-bottom:0px;scrollbar-width:none !important;}
		.` + r.cn + `::-webkit-scrollbar{ width: 0px !important;height:0px !important;}
		.` + r.cn + `-wrapper:not(.readonly) .` + r.cn + `-wrapper{justify-content:flex-start;}
		.` + r.cn + `-header{margin:5px 0px;}
		.` + r.cn + `-wrapper.readonly .` + r.cn + `{height:100vh !important;max-height:100vh;}
		.` + r.cn + `-title{font-size:16px;}
		.` + r.cn + `{scrollbar-width:none !important;}
		.` + r.cn + `-wrapper{justify-content:flex-start;}
		.` + r.cn + `-wrapper.readonly .` + r.cn + `-date-rendered{font-size: 12px !important;opacity:0.6;}
		.` + r.cn + ` .ce-block:last-child{margin-bottom:100px;}
		.` + r.cn + ` h2{font-size:16px !important;}
	}
	`;
    this.fetch = function() {
        let e = "progressier-announcement-script";
        if (document.getElementById(e)) {
            return
        }
        let t = document.createElement("script");
        t.setAttribute("id", e);
        t.setAttribute("src", progressier.fetchdomain + "/client/rich-text-editor.js?v=6");
        document.querySelector("body").appendChild(t)
    };
    this.make = function() {
        document.querySelectorAll("." + r.cn + "-wrapper").forEach(function(e) {
            e.remove()
        });
        r.element = progressier.utils.node("div", r.cn + "-wrapper", {
            parent: document.querySelector("body")
        })
    };
    this.renderHeader = function() {
        r.header.innerHTML = "";
        progressier.utils.node("div", r.cn + "-img", {
            parent: r.header,
            html: `<img src="` + r.data.img + `">`
        });
        let e = progressier.utils.node("div", r.cn + "-txt", {
            parent: r.header
        });
        let t = progressier.utils.node("div", r.cn + "-title", {
            parent: e,
            html: r.data.title
        });
        let i = progressier.utils.node("div", r.cn + "-details", {
            parent: e,
            dir: "auto"
        });
        let n = progressier.utils.node("div", r.cn + "-date", {
            parent: i
        });
        progressier.utils.node("div", r.cn + "-close", {
            parent: r.header,
            html: progressier.utils.svg_x(),
            click: function() {
                r.element.remove()
            }
        });
        let a = progressier.utils.node("div", r.cn + "-date-rendered", {
            parent: n,
            html: progressier.utils.timeFromNow(r.data.pubDate)
        });
        if (r.readOnly) {
            return
        }
        r.helpers.createImgSelection(r);
        r.helpers.editableTitle(r, t);
        r.helpers.createStatusBtn(r, i);
        r.helpers.createTrashBtn(r);
        r.helpers.createDateSelector(r, n);
        r.helpers.replaceRenderedDate(r, a)
    };
    this.renderBody = function() {
        let n = ["ProgressierRichTextEditor", "ProgressierAnnouncementHeading", "ProgressierAnnouncementLi", "ProgressierAnnouncementMarker", "ProgressierAnnouncementAlert", "ProgressierAnnouncementImage", "ProgressierAnnouncementEmbed"];
        let a = setInterval(function() {
            for (let i = 0; i < n.length; i++) {
                if (!window[n[i]]) {
                    return
                }
            }
            let e = {
                header: {
                    "class": ProgressierAnnouncementHeading,
                    inlineToolbar: true,
                    config: {
                        levels: [2],
                        defaultLevel: 2
                    }
                },
                list: {
                    "class": ProgressierAnnouncementLi,
                    inlineToolbar: true
                },
                Marker: {
                    "class": ProgressierAnnouncementMarker
                },
                embed: {
                    "class": ProgressierAnnouncementEmbed
                },
                alert: {
                    "class": ProgressierAnnouncementAlert,
                    inlineToolbar: true
                },
                image: {
                    "class": ProgressierAnnouncementImage,
                    config: {
                        uploader: {
                            uploadByFile(e) {
                                return r.helpers.uploadImageByFile(e)
                            },
                            uploadByUrl(e) {
                                return r.helpers.uploadImageByUrl(e)
                            }
                        }
                    }
                }
            };
            let t = {
                holder: r.cn,
                tools: e,
                data: r.data.content
            };
            if (r.readOnly) {
                t.readOnly = true
            }
            if (!r.readOnly) {
                t.placeholder = "Write your announcement here..."
            }
            window.announcementEditor = new ProgressierRichTextEditor(t);
            clearInterval(a)
        }, 300)
    };
    this.calculateMinHeight = function() {
        if (!r.readOnly) {
            return 0
        }
        try {
            let t = {
                embed: 354,
                paragraph: 35,
                list: 75,
                header: 36,
                alert: 52,
                image: 200
            };
            let i = 0;
            r.data.content.blocks.forEach(function(e) {
                i += t[e.type] || 0
            });
            let e = window.innerHeight * .7;
            if (i > e) {
                return "75vh"
            }
            let n = parseInt(i * .7 / e * 100);
            return n + "vh"
        } catch (e) {
            return 100
        }
    };
    this.render = function() {
        r.element.innerHTML = "";
        if (r.readOnly) {
            r.element.classList.add("readonly")
        }
        var e = progressier.wording.rtl() ? "rtl" : "ltr";
        r.element.setAttribute("dir", e);
        r.header = progressier.utils.node("div", r.cn + "-header", {
            parent: r.element
        });
        let t = r.calculateMinHeight();
        r.body = progressier.utils.node("div", r.cn, {
            dir: "auto",
            id: r.cn,
            parent: r.element,
            style: "min-height:" + t + ";"
        });
        if (t === "75vh") {
            r.body.classList.add("long")
        }
        r.renderHeader();
        r.renderBody();
        if (r.readOnly) {
            return
        }
        r.helpers.createSaveBtn(r)
    };
    this.init = function() {
        if (!r.readOnly) {
            r.styling += r.helpers.extraStyling()
        }
        progressier.utils.styling(r.styling, r.cn + "-styling");
        r.fetch();
        r.make();
        r.render()
    };
    this.init()
}

function ProgressierNewsfeed(e) {
    var l = this;
    this.parent = e;
    this.items = [];
    this.cn = "progressier-newsfeed-button";
    this.timer = null;
    this.currentUnread = 0;
    this.maxUnread = 9;
    this.className = "progressier-notification-center";
    this.styling = `
		.` + l.className + `{content:"";position:fixed;top:0px;left:0px;width:100vw;height:100vh;height:100dvh;background: var(--progressierBackdrop); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); display: flex; justify-content: center; align-items: center;z-index:2147483640;transition:all 0.3s ease-in-out;-webkit-transition:all 0.3s ease-in-out;}
		.` + l.className + `-inner{height:80vh;width:350px;background:var(--progressierBg); box-shadow:var(--progressierBoxShadow);transition:all 0.3s ease-in-out;-webkit-transition:all 0.3s ease-in-out;overflow:hidden;justify-content: center; display: flex; flex-direction: column; align-items: center;position:relative;}
		.` + l.className + ` *{font-size:14px !important;letter-spacing:var(--progressierLetterSpacing) !important;box-sizing: border-box !important;font-family:var(--progressierFont) !important;box-sizing:content-box !important;float:none !important;}
		.` + l.className + `-icon{margin-inline-end:20px;display: flex; justify-content: center; align-items: center; border-radius: 10px; overflow: hidden; flex:none;}
		.` + l.className + `-icon img{width:45px !important;height:45px !important;border-radius:10px;overflow:hidden;flex:none !important;}
		.` + l.className + `-content{font-size:14px;width: 100%;}
		.` + l.className + `-list{height:calc(100% - 40px);overflow-y: auto;overflow-x:hidden; background: var(--progressierBg); z-index: 2;width:100%;padding-bottom:100px;scrollbar-color: var(--progressierBorderColor) var(--progressierBg) !important; scrollbar-width: auto;}
		.` + l.className + `-list *{color:var(--progressierTxt) !important;} 
		.` + l.className + `-title{font-weight:500;}
		.` + l.className + `-title, .` + l.className + `-body{max-width: 75%; word-wrap: break-word; overflow-wrap: break-word;line-height:18px !important;}
		.` + l.className + ` .` + l.className + `-time{opacity:0.6;font-size:12px !important;margin-top:5px;max-width:90%;}
		.` + l.className + `-body{margin-top:5px;font-weight:400 !important;}
		.` + l.className + `-item{transition:all 0.3s ease-in-out;-webkit-transition:all 0.3s ease-in-out;padding: 20px;display: flex;align-items:center;border-bottom: 1px solid var(--progressierBorderColor);cursor:pointer;width:100%;position:relative;}
		.` + l.className + `-item:hover{background:var(--progressierHover);}
		.` + l.className + `-item.unread{ background: var(--progressierHover);opacity:0;}
		.` + l.className + `-item.unread.unread-init{opacity:1;}
		.` + l.className + `-footer{display: flex; align-items: center; justify-content: center;z-index:3;height: 50px;width: calc(100% - 40px); z-index: 3; border-radius: 10px; bottom: 20px; position: absolute;}
		.` + l.className + `-footer button{width:100% !important;height:100% !important;border-radius: 0px !important;outline:0px !important;border:0px !important;cursor:pointer !important;padding:0px 20px;background:transparent !important;}
		.` + l.className + `-footer button *{font-weight:400;font-size: 15px !important;color:inherit !important;}
		.` + l.className + `-footer:hover{filter: brightness(0.9) !important;}
		.` + l.className + `-footer.disabled{opacity: 1!important;pointer-events:none;}
		.` + l.className + `-header{height: 50px; display: flex; align-items: center; color: #fff; justify-content: center;position:relative;width:100%;flex:none;}
		.` + l.className + `-header *{color:inherit !important;}
		.` + l.className + `-back{position:absolute;left:10px;width:30px;height:30px;border-radius:50%;cursor:pointer;display:flex;justify-content:center;align-items:center;transform:rotate(180deg);}
		.` + l.className + `[dir="rtl"] .` + l.className + `-back{left:unset;right:10px;transform: rotate(0deg);}
		.` + l.className + `-back:hover{background:rgba(0,0,0,0.1);}
		.` + l.className + `-back svg{width:25px;height:25px;}
		.` + l.className + `-empty{ height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; }
		.` + l.className + `-empty > div:first-child{background: var(--progressierElement); border-radius: 50%; color: var(--progressierTxt); width: 80px; height: 80px; display: flex; justify-content: center; align-items: center; margin-bottom: 20px;}
		.` + l.className + `-empty > div:first-child svg{width:30px;height:30px;opacity:0.3;}
		.` + l.className + `-empty > div:nth-child(2){font-weight: 500; opacity: 0.4;}
		.` + l.className + ` .` + l.className + `-list::-webkit-scrollbar-track{ -webkit-box-shadow: inset 0 0 0px rgba(0,0,0,0) !important; background-color: transparent !important;}
		.` + l.className + ` .` + l.className + `-list::-webkit-scrollbar{ width: 10px !important; background-color: transparent !important;}
		.` + l.className + ` .` + l.className + `-list::-webkit-scrollbar-thumb{ background-color: var(--progressierBorderColor) !important; border-radius:15px !important;}
		.` + l.className + `-chevron{position:absolute;right:50px;}
		.` + l.className + `[dir="rtl"] .` + l.className + `-chevron{position:absolute;right:unset;left:50px;transform:rotate(180deg);}
		.` + l.className + `-chevron svg{width:25px;height:25px;}
		.` + l.className + `-tabs{display:flex;align-items:center;justify-content:center;width:80%;position:relative;height:100%;}
		.` + l.className + `-tab{height: calc(100% - 5px); display: flex; justify-content: center; align-items: center; border-bottom: 4px solid transparent; font-weight: 500;padding:3px 10px 0px 10px;opacity:0.5;white-space:nowrap;margin-bottom:-1px;}
		.` + l.className + `-tab.inactive{cursor:pointer;}
		.` + l.className + `-tab.active{opacity:1;border-color:inherit;}
		.` + l.className + `-tab.inactive:hover{background:rgba(0,0,0,0.05);opacity:1;}
		.` + l.className + `.scrolled .` + l.className + `-footer{bottom:-50vh;}
		.` + l.className + `:not(.scrolled) .` + l.className + `-list.bottom-gradient:after{content: ""; position: absolute; bottom: 0px; background: linear-gradient(0deg, var(--progressierBg), transparent); left: 0px; width: 100%; height:15vh;height: 15dvh;}
		.` + l.className + `-footer{transition:all 0.3s ease-in-out;-webkit-transition:all 0.3s ease-in-out;}
		@media (min-width:551px){
			.` + l.className + `-inner{border-radius:20px;max-height:800px;}
		}
		@media (max-width:550px){
			.` + l.className + `:not(.initialized){left:150vw;}
			.` + l.className + `-inner{width:100vw;height:100vh;height:100dvh;}
			html .` + l.className + ` .` + l.className + `-list::-webkit-scrollbar{ width:0px !important; height:0px !important;}
			.` + l.className + `-footer{width:auto;bottom:5vh;border-radius: 10px; overflow: hidden; position: fixed;height:50px;}
			.` + l.className + `-list{height:100vh;height:100dvh;padding-bottom:20vh;padding-bottom: 20dvh;scrollbar-width: none !important;}
			.` + l.className + `:not(.initialized) .` + l.className + `-footer{opacity:0;}
			.` + l.className + `-title{font-size:14px !important;}
		}
	`;
    this.listPush = function() {
        return new Promise(function(a, e) {
            try {
                let e = l.parent.data.params.newsfeedContent;
                if (e !== "all" && e !== "push") {
                    return a()
                }
                let t = indexedDB.open("progressierSavedPushNotifications");
                t.onerror = function() {
                    return a()
                };
                t.onsuccess = function(n) {
                    try {
                        let e = n.target.result;
                        let t = e.transaction("progressierSavedPushNotifications", "readonly");
                        let i = t.objectStore("progressierSavedPushNotifications");
                        i.openCursor().onsuccess = function(e) {
                            let t = e.target.result;
                            if (t) {
                                if (t && t.value && typeof t.value === "object" && t.value.title && t.value.timestamp) {
                                    l.items.push(t.value)
                                }
                                t["continue"]()
                            } else {
                                return a()
                            }
                        }
                    } catch (e) {
                        return a()
                    }
                };
                t.onupgradeneeded = function(e) {
                    let t = e.target.result;
                    t.createObjectStore("progressierSavedPushNotifications", {
                        autoIncrement: true,
                        keyPath: "id"
                    });
                    return a()
                }
            } catch (t) {
                console.log(t);
                return a([])
            }
        })
    };
    this.rerenderIfOpen = function() {
        let e = document.querySelector("." + l.className);
        if (!e) {
            return
        }
        let t = document.querySelectorAll("." + l.className + "-item");
        if (t.length > 0) {
            return
        }
        l.renderItems()
    };
    this.listAnnouncements = async function() {
        try {
            let e = l.parent.data.params.newsfeedContent;
            if (e !== "all" && e !== "announcements") {
                return
            }
            if (l.scrollFinished) {
                return
            }
            let t = await l.parent.utils.lets("GET", l.parent.fetchdomain + "/announcements/get?id=" + l.parent.appId + "&doc=" + (l.nextDoc || "latest1"));
            t.list.forEach(function(e) {
                if (!e) {
                    return
                }
                if (typeof e !== "object") {
                    return
                }
                if (!e.title || !e.pubDate) {
                    return
                }
                let t = {
                    title: e.title,
                    body: "",
                    icon: e.img,
                    timestamp: e.pubDate,
                    id: e.id,
                    url: null,
                    announcement: e
                };
                l.items.push(t)
            });
            if (t.next) {
                l.nextDoc = t.next;
                l.scrollFinished = false
            } else {
                l.scrollFinished = true
            }
            l.rerenderIfOpen()
        } catch (e) {
            l.scrollFinished = true;
            console.log(e)
        }
    };
    Object.defineProperty(l, "hasPermission", {
        value: function() {
            return l.parent.data.newsfeedAccess
        },
        writable: false,
        configurable: false,
        enumerable: true
    });
    this.noAccess = function() {
        return "Your plan does not give you access to the Newfeed feature. Please visit https://progressier.com/dashboard/ui-components?expanded=Newsfeed for more information."
    };
    this.save = function(s) {
        return new Promise(function(r, t) {
            if (!l.hasPermission()) {
                return t(l.noAccess())
            }
            try {
                let a = "progressierSavedPushNotifications";
                if (typeof s !== "object") {
                    return t("In-app notification must be a valid JavaScript object")
                }
                if (!s.url || !s.body || !s.title) {
                    return t("In-app notification must contain a body, title and url")
                }
                if (typeof s.url !== "string") {
                    return t("url is invalid")
                }
                if (typeof s.body !== "string") {
                    return t("body is invalid")
                }
                if (typeof s.title !== "string") {
                    return t("title is invalid")
                }
                s.timestamp = (new Date).toISOString();
                let e = indexedDB.open(a);
                e.onerror = function() {
                    return t("Error saving in-app notification")
                };
                e.onsuccess = function(n) {
                    try {
                        let e = n.target.result;
                        let t = e.transaction(a, "readwrite");
                        let i = t.objectStore(a);
                        i.add(s);
                        l.renderItems();
                        if (document.querySelector("." + l.className)) {
                            l.saveViewDate()
                        }
                        return r("In-app notification saved")
                    } catch (e) {
                        console.log(e);
                        return t("Couldn't save in-app notification")
                    }
                };
                e.onupgradeneeded = function(e) {
                    let t = e.target.result;
                    t.createObjectStore(a, {
                        autoIncrement: true,
                        keyPath: "id"
                    })
                }
            } catch (e) {
                return t(e)
            }
        })
    };
    this.make = function() {
        l["delete"]();
        l.parent.utils.styling(l.styling, l.className);
        l.parent.flow.remove();
        l.element = l.parent.utils.node("div", l.className + " no-blurring", {
            parent: document.querySelector("body")
        });
        if (l.parent.wording.rtl()) {
            l.element.setAttribute("dir", "rtl")
        }
        setTimeout(function() {
            l.element.classList.add("initialized")
        }, 500)
    };
    this["delete"] = function() {
        document.querySelectorAll("." + l.className).forEach(function(e) {
            e.remove()
        })
    };
    this.remove = function() {
        l.stopListening();
        l.element.classList.remove("initialized");
        if (window.innerWidth < 551) {
            setTimeout(l["delete"], 1e3)
        } else {
            l["delete"]()
        }
    };
    this.openUrl = function(e) {
        e.unread = false;
        l.renderList();
        if (l.demoItems) {
            return
        }
        let t = e.url;
        if (e.announcement) {
            return new ProgressierAnnouncement(e.announcement)
        }
        if (e.data && e.data.url) {
            t = e.data.url
        }
        if (!t) {
            return
        }
        if (t.startsWith(window.location.origin) || !t.startsWith("https://")) {
            try {
                let e = new URL(t, window.location.origin);
                if (e.href === window.location.href) {
                    return
                }
                window.location.href = t
            } catch (i) {}
        } else if (l.parent.detection.isStandalone()) {
            window.location.href = t
        } else {
            window.open(t, "_blank")
        }
    };
    this.getViewDate = function() {
        return new Promise(function(s, e) {
            try {
                let r = "progressierNewsfeedViewDate";
                let e = indexedDB.open(r);
                e.onerror = function() {
                    return s(null)
                };
                e.onsuccess = function(a) {
                    try {
                        let e = a.target.result;
                        let t = e.transaction(r, "readwrite");
                        let i = t.objectStore(r);
                        let n = i.get(0);
                        n.onsuccess = function(e) {
                            if (!n || !n.result || !n.result.date) {
                                return s(null)
                            }
                            let t = n.result.date;
                            let i = t ? new Date(t).getTime() : null;
                            return s(i)
                        }
                    } catch (e) {
                        return s(null)
                    }
                };
                e.onupgradeneeded = function(e) {
                    let t = e.target.result;
                    t.createObjectStore(r, {
                        autoIncrement: true,
                        keyPath: "id"
                    })
                }
            } catch (t) {
                return s(null)
            }
        })
    };
    this.saveViewDate = function() {
        try {
            let r = "progressierNewsfeedViewDate";
            let e = indexedDB.open(r);
            e.onerror = function() {};
            e.onsuccess = function(a) {
                try {
                    let e = a.target.result;
                    let t = e.transaction(r, "readwrite");
                    let i = t.objectStore(r);
                    let n = (new Date).toISOString();
                    i.put({
                        id: 0,
                        date: n
                    })
                } catch (e) {}
            };
            e.onupgradeneeded = function(e) {
                let t = e.target.result;
                t.createObjectStore(r, {
                    autoIncrement: true,
                    keyPath: "id"
                })
            }
        } catch (e) {}
    };
    this.getUnread = async function() {
        await l.listPush();
        l.order();
        let i = await l.getViewDate();
        let e = l.items.filter(function(t) {
            try {
                let e = new Date(t.timestamp).getTime();
                if (e > i) {
                    t.unread = true;
                    return true
                }
                return false
            } catch (e) {
                return false
            }
        });
        return e.length
    };
    this.order = function() {
        let n = [];
        let a = (new Date).getTime();
        l.items.forEach(function(t) {
            let e = n.find(function(e) {
                if (e.id === t.id) {
                    return true
                }
                return false
            });
            if (e) {
                return
            }
            let i = new Date(t.timestamp).getTime() > a;
            if (i) {
                return
            }
            n.push(t)
        });
        let r = "timestamp";
        n.sort(function(e, t) {
            let i = e[r] < t[r] ? 1 : e[r] > t[r] ? -1 : 0;
            return i
        });
        l.items = n
    };
    this.startListening = function() {
        l.listening = setInterval(async function() {
            let e = l.items.length;
            await l.listPush();
            l.order();
            let t = l.items.length;
            if (e === t) {
                return
            }
            l.renderItems();
            l.saveViewDate()
        }, 1500)
    };
    this.stopListening = function() {
        if (!l.listening) {
            return
        }
        clearInterval(l.listening);
        l.listening = null
    };
    this.renderList = async function() {
        l.list.innerHTML = "";
        let o = l.parent.utils.node;
        let e = l.items;
        if (l.isDemo) {
            e = l.demoItems
        }
        let t = e.filter(function(e) {
            if (e.announcement && !l.focusAnnouncements) {
                return false
            }
            if (!e.announcement && l.focusAnnouncements) {
                return false
            }
            return true
        });
        if (t.length === 0) {
            o("div", l.className + "-empty", {
                parent: l.list,
                html: `<div>` + l.parent.utils.svg_bell_on() + `</div><div>` + l.parent.wording.get("noneYet") + `</div>`
            });
            return
        }
        t.forEach(function(e) {
            let t = e.icon || l.parent.data.params.icon512;
            let i = o("div", l.className + "-item", {
                parent: l.list,
                click: function() {
                    l.openUrl(e)
                }
            });
            o("div", l.className + "-icon", {
                parent: i,
                html: `<img src="` + t + `" />`
            });
            let n = o("div", l.className + "-content", {
                parent: i
            });
            let a = e.title;
            o("div", l.className + "-title", {
                parent: n,
                html: a,
                dir: "auto"
            });
            let r = e.body;
            if (e.announcement) {
                o("div", l.className + "-chevron", {
                    html: l.parent.utils.svg_chevron(),
                    parent: i
                });
                i.setAttribute("data-announcement-id", e.announcement.id)
            } else {
                o("div", l.className + "-body", {
                    parent: n,
                    html: r,
                    dir: "auto"
                })
            }
            let s = l.parent.utils.timeFromNow(e.timestamp);
            o("div", l.className + "-time", {
                parent: n,
                html: s,
                dir: "auto"
            });
            if (e.unread) {
                i.classList.add("unread")
            }
            setTimeout(function() {
                i.classList.add("unread-init")
            }, 100)
        })
    };
    this.renderItems = async function() {
        let e = document.querySelector("." + l.className);
        if (!e) {
            return
        }
        if (!l.list) {
            return
        }
        l.stopListening();
        await l.listPush();
        l.order();
        l.renderList();
        l.startListening()
    };
    this.onScroll = function(e) {
        let t = e.currentTarget.scrollTop;
        if (t > 10) {
            l.element.classList.add("scrolled")
        } else {
            l.element.classList.remove("scrolled")
        }
        let i = e.currentTarget.scrollTop > e.currentTarget.scrollHeight - e.currentTarget.clientHeight - 40;
        if (i) {
            l.queryNextAnnouncements()
        }
    };
    this.queryNextAnnouncements = async function() {
        if (l.queryingNow) {
            return
        }
        if (!l.focusAnnouncements) {
            return
        }
        l.queryingNow = true;
        await l.listAnnouncements();
        l.order();
        l.renderList();
        l.queryingNow = false
    };
    this.announcementIsMain = function() {
        let e = l.items.filter(e => e.unread && e.announcement).length;
        let t = l.items.filter(e => e.unread && !e.announcement).length;
        let i = l.items.filter(e => e.announcement).length;
        let n = l.items.filter(e => !e.announcement).length;
        if (!e && t) {
            return false
        }
        if (n && !i) {
            return false
        }
        return true
    };
    this.renderHeader = function() {
        let i = l.parent.utils.node;
        l.headerEl.innerHTML = "";
        i("div", l.className + "-back", {
            click: l.remove,
            parent: l.headerEl,
            html: l.parent.utils.svg_chevron()
        });
        let t = l.newsfeedContent;
        if (t === "push") {
            l.focusAnnouncements = false
        } else if (t === "announcements") {
            l.focusAnnouncements = true
        }
        if (t === "all") {
            if (!l.tabClicked) {
                l.focusAnnouncements = l.announcementIsMain()
            }
            let e = i("div", l.className + "-tabs", {
                parent: l.headerEl
            });
            let t = function() {
                l.tabClicked = true;
                l.focusAnnouncements = l.focusAnnouncements ? false : true;
                l.list.scrollTop = 0;
                l.renderHeader();
                l.renderItems()
            };
            i("div", l.className + "-tab " + (l.focusAnnouncements ? "active" : "inactive"), {
                click: t,
                parent: e,
                html: l.parent.wording.get("newsfeed")
            });
            i("div", l.className + "-tab " + (l.focusAnnouncements ? "inactive" : "active"), {
                click: t,
                parent: e,
                html: l.parent.wording.get("notifications")
            })
        } else {
            let e = l.parent.wording.get("newsfeed");
            if (t === "push") {
                e = l.parent.wording.get("notifications")
            }
            i("div", l.className + "-head", {
                parent: l.headerEl,
                html: e
            })
        }
    };
    this.render = async function() {
        let e = l.parent.utils.node;
        let t = l.parent.data.params.buttonColor;
        if (l.isDemo) {
            t = l.btnBgColor
        }
        let i = l.parent.data.params.buttonTextColor;
        if (l.isDemo) {
            i = l.btnTxtColor
        }
        l.element.innerHTML = "";
        l.element.setAttribute("dir", progressier.wording.rtl() ? "rtl" : "ltr");
        let n = e("div", l.className + "-inner", {
            parent: l.element
        });
        l.headerEl = e("div", l.className + "-header", {
            parent: n,
            style: `background:` + t + `;color:` + i + `;border-color:` + i + `;`
        });
        l.renderHeader();
        l.list = e("div", l.className + "-list", {
            parent: n,
            scroll: l.onScroll
        });
        if (l.newsfeedBtn && l.isDemo || !l.isDemo && l.parent.data.params.newsfeedBtn) {
            l.list.classList.add("bottom-gradient")
        }
        l.renderItems();
        if (l.isDemo && !l.newsfeedBtn || !l.parent.data.params.newsfeedBtn) {
            return
        }
        let a = l.isDemo ? "disabled" : "enabled";
        e("div", l.className + "-footer " + a, {
            style: "background:" + t,
            parent: n,
            html: `<button style="color:` + i + `;" class="progressier-subscribe-button" data-icons="true" data-eligible="Get notifications" data-subscribed="Notifications enabled" data-blocked="Notifications blocked"></button>`
        })
    };
    this.demo = function(e, t, i, n) {
        if (!e || !t || typeof t !== "object" || t.length < 1) {
            return
        }
        l.btnBgColor = e;
        l.btnTxtColor = l.parent.utils.textIsDark(e || "#ffffff") ? "#142a37" : "#ffffff";
        l.demoItems = t;
        l.newsfeedContent = i;
        l.newsfeedBtn = n;
        if (l.newsfeedContent === "none") {
            l.newsfeedContent = "all"
        }
        l.isDemo = true;
        l.make();
        l.render()
    };
    this.show = async function() {
        if (!l.hasPermission()) {
            console.log(l.noAccess());
            return
        }
        let e = l.parent.data.params;
        if (!e) {
            console.log("You must wait for Progressier to be fully initialized before launching the Newsfeed");
            return
        }
        l.isDemo = false;
        l.newsfeedContent = l.parent.data.params.newsfeedContent;
        l.make();
        await l.render();
        l.saveViewDate()
    };
    this.launch = async function() {
        if (!l.queriedAnnouncements) {
            l.queriedAnnouncements = true;
            await l.listAnnouncements()
        }
        l.show()
    };
    this.searchButtons = async function() {
        document.querySelectorAll(`.` + l.cn).forEach(function(e) {
            let t = l.hasPermission() ? "visible" : "hidden";
            let i = l.hasPermission() ? 1 : 0;
            if (!e.style.opacity || e.style.opacity !== i) {
                e.style.opacity = i
            }
            if (!e.style.visibility || e.style.visibility !== t) {
                e.style.visibility = t
            }
            if (e.classList.contains("captured")) {
                return
            }
            e.classList.add("captured");
            e.addEventListener("click", l.show)
        });
        if (document.querySelector(`.` + l.cn)) {
            if (!l.queriedAnnouncements) {
                l.queriedAnnouncements = true;
                await l.listAnnouncements()
            }
            if (!document.getElementById("progressier-newsfeed-button-styles")) {
                l.parent.utils.styling(`.progressier-newsfeed-button[data-unread]:not([data-unread="0"]):after{content: attr(data-unread);position:absolute;font-size:10px;background:red;border-radius:50%;font-weight:500;color:#fff;width:18px;height:18px;display:flex;justify-content:center;align-items:center;top:-8px;right:-8px;letter-spacing:-0.1px;}`, "progressier-newsfeed-button-styles")
            }
            let n = await l.getUnread();
            document.querySelectorAll(`.` + l.cn).forEach(function(e) {
                let t = e.getAttribute("data-unread");
                let i = n > l.maxUnread ? l.maxUnread + "+" : n;
                if (t == i) {
                    return
                }
                e.setAttribute("data-unread", i)
            });
            l.currentUnread = n
        }
    };
    this.init = async function() {
        await l.parent.data.waitForData();
        if (l.parent.data.params.newsfeedContent === "none") {
            return
        }
        l.timer = setInterval(l.searchButtons, 1e3)
    };
    this.init()
}

function ProgressierUser(e) {
    var p = this;
    this.id = null;
    this.parent = e;
    this.appId = function() {
        return p.parent.data.id
    };
    this.cookieName = "_user_" + p.appId();
    this.domain = function() {
        return p.parent.fetchdomain
    };
    this.cancellationCookie = "_canceldone_" + p.appId();
    this.dataQueue = [];
    this.summaryPushSubscription = function(e) {
        try {
            var t = JSON.parse(e);
            var i = t.endpoint;
            var n = i.slice(i.length - 11, i.length - 1);
            return n
        } catch (a) {
            return null
        }
    };
    this.hasNewTags = function(e, t) {
        var r = new TextEncoder;
        if (e === t) {
            return false
        }
        if (Array.isArray(e) && e.length !== (t || []).length) {
            return true
        }
        let i = e;
        if (typeof e === "string") {
            i = e.split(",")
        }
        let s = typeof t === "object" && Array.isArray(t) ? t : [t];
        let o = 0;
        i.forEach(function(e) {
            var t = e.includes("%");
            var i = t ? e.replace(/%/g, "") : e;
            var n = r.encode(i.trim());
            var a = "";
            n.forEach(e => {
                a += String.fromCharCode(e)
            });
            if (!t && s.includes(a)) {
                return
            }
            if (t && !s.includes(a)) {
                return
            }
            o += 1
        });
        return o > 0
    };
    this.hasNewData = function(e) {
        var t = 0;
        var i = p.getDataLocally() || {};
        var n = new TextEncoder;
        for (var a in e) {
            if (a === "progressier_id") {
                continue
            }
            if (a === "tags" && !p.hasNewTags(e[a], i[a])) {
                continue
            } else if (e[a] === true && i[a] === true || e[a] === true && i[a] === "true" || e[a] === "true" && i[a] === true) {
                continue
            } else {
                var r = n.encode(e[a]);
                var s = "";
                r.forEach(e => {
                    s += String.fromCharCode(e)
                });
                if (s === i[a]) {
                    continue
                }
            }
            t += 1
        }
        return t > 0
    };
    this.retrieveExistingData = async function() {
        var e = p.getDataLocally();
        if (e) {
            p.dataRetrieved = true;
            return
        }
        var t = await p.parent.utils.lets("POST", p.domain() + "/finalusers/get?id=" + p.appId(), {
            userId: p.id
        });
        p.dataRetrieved = true;
        p.saveDataLocally(t.result)
    };
    this.getDataLocally = function() {
        try {
            if (!p.id) {
                return null
            }
            var e = p.parent.cookies.get(p.cookieName + "_data");
            if (!e) {
                return null
            }
            var t = window.atob(e);
            if (!t) {
                return null
            }
            var i = JSON.parse(t);
            if (i.tags && typeof i.tags === "string") {
                i.tags = i.tags.split(",");
                i.tags.forEach(function(e, t) {
                    i.tags[t] = e.trim()
                })
            }
            return i
        } catch (n) {
            return null
        }
    };
    this.saveDataLocally = function(e) {
        try {
            var t = p.getDataLocally() || {};
            for (var i in e) {
                    t[i] = e[i]
            }
            var n = JSON.stringify(t);
            var a = new TextEncoder;
            var r = a.encode(n);
            var s = "";
            r.forEach(e => {
                s += String.fromCharCode(e)
            });
            var o = btoa(s);
            p.parent.cookies.set(p.cookieName + "_data", o, 720)
        } catch (l) {
            console.log(l)
        }
    };
    this.waitExistingData = function() {
        return new Promise(function(e, t) {
            var i = setInterval(function() {
                if (!p.dataRetrieved) {
                    return
                }
                clearInterval(i);
                return e()
            }, 200)
        })
    };
    this.allowedToPass = async function(e) {
        try {
            await p.parent.data.waitForData();
            if (p.parent.data.params.disablePushHandling) {
                return false
            }
            return true
        } catch (t) {
            return true
        }
    };
    this.invalidCharacRange = function(e) {
        return /[^\x00-\xFF]/.test(e)
    };
    this.existsInQueue = function(e) {
        let t = JSON.stringify(e);
        let i = p.dataQueue.indexOf(t);
        let n = i > -1;
        p.dataQueue.push(t);
        return n
    };
    this.add = async function(t) {
        try {
            if (typeof t !== "object") {
                throw "The first argument must be a valid Javascript object"
            }
            if (t.users) {
                throw "users is a reserved parameter. You cannot use it to sync your data."
            }
            if (t.errors) {
                throw "errors is a reserved parameter"
            }
            var i = p.existsInQueue(t);
            if (i && !t.selftagged) {
                return "Request aborted due to same-session caching."
            }
            var n = await p.allowedToPass(t);
            if (!n) {
                return
            }
            await p.waitExistingData();
            var a = p.hasNewData(t);
            if (!a) {
                return "Request aborted. No new unique data."
            }
            if (p.parent.detection.isIOS() && p.parent.detection.isSafari() && p.parent.detection.isStandalone()) {
                t.app_installed = true;
                t.install_path = window.location.pathname
            }
            t.progressier_id = p.id || null;
            if (window.navigator.brave) {
                t.browser = "Brave"
            }
            if (p.parent.detection.isArc()) {
                t.browser = "Arc"
            }
            if (p.parent.detection.isIOS()) {
                t.os = "iOS"
            }
            if (p.parent.detection.supportsNativeiOSPush()) {
                t.browser = "Native App"
            }
            t.domain_name = window.location.hostname;
            await p.parent.data.waitForData();
            let e = p.parent.detection.iosVersion();
            if (e) {
                t.browserVersion = e
            }
            var r = await p.parent.utils.lets("POST", p.domain() + "/finalusers/save?id=" + p.appId(), t);
            var s = r.result;
            var o = s.id;
            if (s.tags) {
                t.tags = s.tags
            }
            if (o === "delete" || o === "ok") {
                o = null
            } else {
                t.progressier_id = o;
                p.saveDataLocally(t)
            }
            p.saveId(o)
        } catch (e) {
            console.log(e)
        }
    };
    this.resetCancellation = function() {
        p.parent.cookies.set(p.cancellationCookie, "", 720)
    };
    this.saveCancellation = function() {
        p.parent.cookies.set(p.cancellationCookie, "yes", 720)
    };
    this.getCancellation = function() {
        var e = p.parent.cookies.get(p.cancellationCookie);
        return e ? true : false
    };
    this.registerInstall = function() {
        if (p.installAlreadyRegistered) {
            return
        }
        p.installAlreadyRegistered = true;
        p.add({
            app_installed: true,
            install_path: window.location.pathname,
            domain_name: window.location.hostname
        })
    };
    this.retrieve = function() {
        var e = p.parent.cookies.get(p.cookieName);
        if (!e) {
            p.dataRetrieved = true;
            return
        }
        p.id = e;
        p.retrieveExistingData()
    };
    this.saveId = function(e) {
        p.id = e;
        p.parent.cookies.set(p.cookieName, p.id, 720)
    };
    this.auto = function() {
        var e = p.parent.utils.getUrlParam("progressieraddemail");
        if (!e) {
            return
        }
        p.parent.utils.setUrlParam({
            progressieraddemail: null
        });
        var t = /^[\w\+-\.]+@([\w-]+\.)+[\w-]{2,15}$/.test(e);
        if (!t) {
            return
        }
        p.add({
            email: e
        })
    };
    this.init = function() {
        p.retrieve();
        p.auto()
    };
    this.init()
}

function ProgressierNative(e) {
    var c = this;
    this.parent = e;
    this.prompt = null;
    this.installed = false;
    this.installable = false;
    this.justInstalled = false;
    this.standalone = false;
    this.iOScompatible = false;
    this.compatible = false;
    this.appId = function() {
        return c.parent.data.id
    };
    this.cookieName = function() {
        return "pwa-installed-" + c.appId()
    };
    this.isIncompatibleCompletely = function() {
        try {
            var e = window.navigator.platform.toLowerCase();
            var t = navigator.userAgent.toLowerCase();
            var i = e.includes("mac");
            var n = e.includes("win");
            var a = c.isSafari();
            if (i && a) {
                return true
            }
            var r = t.includes("firefox");
            var s = i || n;
            if (r) {
                return true
            }
            if (t.includes("opr/")) {
                return true
            }
            var o = c.parent.detection.isChromeEdgeOnMacOs();
            if (o) {
                return false
            }
            var l = c.isIOS();
            if (l && !a) {
                return true
            }
            return false
        } catch (p) {
            return false
        }
    };
    this.isSamsungInternet = function() {
        return c.parent.detection.isSamsungInternet()
    };
    this.compatibleNotCompatibleOrUnknown = function() {
        if (c.parent.nativePrompt) {
            return true
        }
        if (c.isIncompatibleCompletely()) {
            return false
        }
        if (c.installable) {
            return true
        }
        if (c.installed) {
            return false
        }
        if (c.standalone) {
            return false
        }
        if (c.iOScompatible) {
            return true
        }
        if (c.isSamsungInternet()) {
            c.installable = true;
            return true
        }
        return null
    };
    this.installationStatus = function(s) {
        return new Promise(function(t, e) {
            var i = 0;
            var n = 500;
            var a = 3e3;
            var r = setInterval(function() {
                i += n;
                var e = c.compatibleNotCompatibleOrUnknown();
                if (s && e === null && i > a) {
                    clearInterval(r);
                    return t("noengag")
                }
                if (e === null) {
                    return
                }
                if (e === false) {
                    clearInterval(r);
                    return t(false)
                }
                if (e === true) {
                    clearInterval(r);
                    return t(true)
                }
            }, n)
        })
    };
    this.markCompatible = function() {
        if (c.compatible) {
            return
        }
        c.compatible = true
    };
    this.markInstalled = function() {
        if (c.installed) {
            return
        }
        c.installed = true
    };
    this.markStandAlone = function() {
        c.standalone = true;
        c.installable = false;
        c.installed = true;
        c.markCompatible()
    };
    this.performStandaloneCheck = function() {
        try {
            var e = document.querySelector("body");
            var t = "progressier-standalone";
            if (c.parent.detection.isStandalone()) {
                c.markStandAlone();
                e.classList.add(t)
            } else {
                c.standalone = false;
                e.classList.remove(t)
            }
        } catch (i) {}
    };
    this.checkIfStandalone = function() {
        window.addEventListener("DOMContentLoaded", function() {
            c.performStandaloneCheck();
            try {
                window.matchMedia("(display-mode: window-controls-overlay)").addEventListener("change", c.performStandaloneCheck);
                window.matchMedia("(display-mode: standalone)").addEventListener("change", c.performStandaloneCheck);
                window.matchMedia("(display-mode: fullscreen)").addEventListener("change", c.performStandaloneCheck);
                window.matchMedia("(display-mode: minimal-ui)").addEventListener("change", c.performStandaloneCheck)
            } catch (e) {}
        });
        c.performStandaloneCheck();
        setInterval(c.performStandaloneCheck, 1e3)
    };
    this.getInstallCookie = function() {
        try {
            var e = c.parent.cookies.get(c.cookieName());
            var t = e === "installed" ? true : false;
            if (t) {
                c.saveInstallCookie()
            }
            return t
        } catch (i) {
            return false
        }
    };
    this.saveInstallCookie = function() {
        try {
            c.parent.cookies.set(c.cookieName(), "installed", 720)
        } catch (e) {}
    };
    this.resetInstallCookie = function() {
        c.parent.cookies.set(c.cookieName(), null, 720);
        c.parent.cookies["delete"]("progressierapp" + c.appId())
    };
    this.onInstallPrompt = function(e) {
        if (c.parent.debug()) {
            console.log(e)
        }
        if (c.justInstalled) {
            return
        }
        e.preventDefault();
        c.installed = false;
        c.installable = true;
        c.markCompatible();
        c.prompt = e;
        c.resetInstallCookie()
    };
    this.detectInstallPrompt = function() {
        if (c.parent.nativePrompt) {
            c.onInstallPrompt(c.parent.nativePrompt)
        }
        window.addEventListener("beforeinstallprompt", function(e) {
            c.onInstallPrompt(e)
        })
    };
    this.detectTWAInstallation = function() {
        try {
            if (!c.parent.detection.isTWA()) {
                return
            }
            if (c.installEventTrigger) {
                return
            }
            c.installEventTrigger = true;
            c.postInstall()
        } catch (e) {
            console.log(e)
        }
    };
    this.listenToAppInstallSuccess = function() {
        window.addEventListener("appinstalled", async function(e) {
            if (c.installEventTrigger) {
                return
            }
            c.installEventTrigger = true;
            c.postInstall()
        })
    };
    this.detectIfAlreadyInstalled = async function() {
        try {
            if ("getInstalledRelatedApps" in window.navigator) {
                var e = await navigator.getInstalledRelatedApps();
                if (!e || e.length < 0) {
                    c.installed = false
                }
                e.forEach(function(e) {
                    if (e && e.url) {
                        c.markInstalled();
                        c.markCompatible()
                    }
                })
            }
        } catch (i) {}
        var t = c.getInstallCookie();
        if (t && !c.prompt) {
            c.markInstalled();
            c.installable = false;
            c.markCompatible()
        }
    };
    this.checkIfServiceWorkerSupported = function() {
        if (!("serviceWorker" in navigator)) {
            c.makeIncompatible()
        }
    };
    this.isIOS = function() {
        return c.parent.detection.isIOS()
    };
    this.isSafari = function() {
        return c.parent.detection.isSafari()
    };
    this.checkIfIsIOSCompatible = function() {
        if (!c.isIOS()) {
            return
        }
        if (!c.isSafari()) {
            return
        }
        c.iOScompatible = true
    };
    this.makeIncompatible = function() {
        c.installed = false;
        c.installable = false;
        c.standalone = false;
        c.compatible = false
    };
    this.detectiOSInstallation = async function() {
        try {
            await c.parent.data.waitForData();
            if (c.getInstallCookie()) {
                return
            }
            if (!c.isIOS() && !c.parent.detection.isSafariWithPushOnMacOs()) {
                return
            }
            if (!c.parent.detection.isStandalone()) {
                return
            }
            if (c.installEventTrigger) {
                return
            }
            c.installEventTrigger = true;
            let e = new Date("2024-03-26T00:00:00.000Z");
            let t = new Date(c.parent.data.params.createdAt);
            if (t < e) {
                return
            }
            c.postInstall()
        } catch (e) {}
    };
    this.register = function() {
        c.checkIfIsIOSCompatible();
        c.checkIfServiceWorkerSupported();
        c.detectIfAlreadyInstalled();
        c.checkIfStandalone();
        setTimeout(c.detectTWAInstallation, 1e3);
        setTimeout(c.detectiOSInstallation, 1500);
        c.detectInstallPrompt();
        c.listenToAppInstallSuccess()
    };
    this.install = function() {
        return new Promise(function(t, e) {
            if (!c.installable) {
                return e("The app may already be installed or your browser may not support this function")
            }
            var i = document.querySelector("body");
            i.addEventListener("click", async function() {
                var e = await c.oninstall();
                return t(e)
            }, {
                once: true
            });
            i.dispatchEvent(new Event("click"))
        })
    };
    this.promote = async function() {
        try {
            await c.install()
        } catch (e) {
            console.log(e)
        }
    };
    this.postInstall = function() {
        try {
            c.installable = false;
            c.justInstalled = true;
            c.markInstalled();
            c.parent.user.registerInstall();
            c.markCompatible();
            c.saveInstallCookie()
        } catch (e) {}
    };
    this.oninstall = async function() {
        var e = c.prompt || c.parent.nativePrompt;
        if (!e) {
            return false
        }
        e.prompt();
        var t = await e.userChoice;
        if (t && t.outcome === "accepted") {
            c.postInstall();
            return true
        } else {
            c.installed = false;
            c.markCompatible();
            return false
        }
    };
    c.register()
}

function ProgressierInstallButtons(e) {
    var t = this;
    this.parent = e;
    this["native"] = t.parent["native"];
    this.className = "progressier-install-button";
    this.captured = "captured";
    this.timing = 150;
    this.timer = null;
    this.buttons = [];
    this.newButton = function(e) {
        e.classList.add(t.captured);
        t.buttons.push(new ProgressierInstallButton(e, t))
    };
    this.search = function() {
        document.querySelectorAll(`.` + t.className + `:not(.` + t.captured + `)`).forEach(function(e) {
            t.newButton(e)
        })
    };
    this.init = function() {
        t.timer = setInterval(t.search, t.timing)
    };
    this.init()
}

function ProgressierInstallButton(e, t) {
    var l = this;
    this.node = e;
    this.parent = t;
    this.detection = l.parent.parent.detection;
    this["native"] = l.parent.parent["native"];
    this.disabled = true;
    this.status = "";
    this.timer = null;
    this.timing = 400;
    this.datapoints = [{
        db: "installBtnBehavior",
        html: "data-behavior",
        def: function() {
            return "disable"
        }
    }, {
        db: "hideStandalone",
        html: "data-hide-standalone",
        def: function() {
            return true
        }
    }, {
        db: "allowIOS",
        html: "data-allow-ios",
        def: function() {
            return true
        }
    }, {
        db: "allowSamsung",
        html: "data-allow-samsung",
        def: function() {
            return true
        }
    }, {
        db: "installBtnWording",
        html: "data-install",
        standard: "Install",
        def: function() {
            return l.parent.parent.wording.get("install")
        }
    }, {
        db: "installedBtnWording",
        html: "data-installed",
        standard: "Launch the app",
        def: function() {
            return l.parent.parent.wording.get("launchTheApp")
        }
    }, {
        db: "installBtnIcons",
        html: "data-icons",
        def: function() {
            return false
        }
    }];
    this.data = function() {
        var n = {};
        l.datapoints.forEach(function(e) {
            var t = l.node.getAttribute(e.html);
            var i = t || e.def();
            if (t === e.standard || !t) {
                i = e.def()
            }
            if (i === "false") {
                i = false
            }
            n[e.db] = i
        });
        return n
    };
    this.install = async function() {
        var e = await ProgressierForPromoOnly();
        if (e) {
            return progressierRedirectToEmbedPage("install")
        }
        l.parent.parent.flow.init("install")
    };
    this.addInstallBehavior = function() {
        l.node.addEventListener("click", l.install)
    };
    this.remove = function() {
        if (l.node) {
            l.node.remove()
        }
        clearInterval(l.timer)
    };
    this.disable = function() {
        l.node.style["pointer-events"] = "none";
        l.node.style.opacity = "0.4"
    };
    this.enable = function() {
        l.node.style["pointer-events"] = "auto";
        l.node.style.opacity = "1"
    };
    this.hide = function() {
        l.node.style.display = "none";
        l.hidden = true
    };
    this.show = function() {
        l.node.style.display = "";
        l.hidden = false
    };
    this.update = function() {
        if (!l.node) {
            l.remove();
            return
        }
        var e = l.data();
        if (l["native"].standalone && e.hideStandalone) {
            l.hide()
        } else if (l["native"].standalone) {
            l.disable()
        }
        var t = "",
            i = "";
        var n = l.parent.parent.utils.svg_check();
        var a = l.parent.parent.utils.svg_open();
        var r = window.screen.width > 991 ? l.parent.parent.utils.svg_install_desktop() : l.parent.parent.utils.svg_install_mobile();
        var s = "default";
        if (l["native"].standalone || l["native"].installed) {
            i = a;
            t = e.installedBtnWording;
            s = "installed"
        } else {
            i = r;
            t = e.installBtnWording;
            s = "default"
        }
        if (s !== l.status) {
            var o = `<span style="display:flex;justify-content:center;align-items:center;height:100%;">`;
            if (e.installBtnIcons) {
                o += `<span style="object-fit:contain;display:flex;justify-content:center;align-items:center;width:20px;height:20px;">` + i + `</span>`
            }
            o += `<span style="padding:0px 15px;">` + t + `</span>`;
            o += `</span>`;
            l.node.innerHTML = o
        }
        l.status = s;
        l.node.classList.add("initialized")
    };
    this.startTimer = function() {
        l.timer = setInterval(l.update, l.timing)
    };
    this.init = async function() {
        l.addInstallBehavior();
        l.startTimer()
    };
    this.init()
}

function ProgressierSw(e) {
    var l = this;
    this.parent = e;
    this.reg = null;
    this.sw = async function() {
        try {
            var e = await l.parent.data.get("swUrl") || "progressier.js";
            var t = await l.parent.data.get("embeddablePageLocation");
            var i = window.location.href;
            if (i.startsWith(t)) {
                e = "progressier.js"
            }
            var n = await l.parent.data.get("version") || 3;
            var a = window.location.origin + "/" + e;
            var r = new URL(a);
            var s = await l.parent.data.get("dontAppendSwVersion");
            if (s) {
                return r.href
            }
            r.searchParams.append("v", 15 + "." + n);
            return r.href
        } catch (o) {
            return window.location.origin + "/progressier.js?v=99"
        }
    };
    this.register = async function() {
        var e = await l.sw();
        try {
            var t = await navigator.serviceWorker.getRegistration(e);
            if (t && t.active && t.active.scriptURL === e) {
                l.reg = t
            } else {
                var i = await navigator.serviceWorker.register(e);
                l.reg = i
            }
        } catch (n) {
            console.log(n);
            console.log("The Progressier script works fine. But we were not able to register your service worker. Are you sure you've uploaded it to " + e + "?")
        }
    };
    this.ready = function() {
        return new Promise(function(e, t) {
            var i = setInterval(function() {
                if (!l.reg) {
                    return
                }
                clearInterval(i);
                return e()
            }, 200)
        })
    };
    this.listenToMessage = async function() {
        try {
            navigator.serviceWorker.addEventListener("message", function(e) {
                if (e && e.data === "is-this-standalone" && e.ports && e.ports[0]) {
                    var t = l.parent["native"].standalone ? "yes" : "no";
                    e.ports[0].postMessage(t)
                }
                if (e && e.data && e.data.msg && e.data.msg === "redirect-pwa-from-push" && e.data.url) {
                    if (e.data.url.includes("notificationredirect=optional")) {
                        return
                    }
                    window.location.href = e.data.url
                }
            })
        } catch (e) {}
    };
    this.waitTillReady = function() {
        return new Promise(function(t, e) {
            navigator.serviceWorker.ready.then(function() {
                t()
            })["catch"](function(e) {
                console.log(e);
                t()
            });
            try {
                if (progressier.sw.reg.scope.includes("/a/progressier")) {
                    return t()
                }
            } catch (i) {}
        })
    };
    this.registerBackgroundSync = async function() {
        try {
            var e = await navigator.serviceWorker.ready;
            var t = l.parent.utils.randomId();
            if (e && e.sync && e.sync.register) {
                await e.sync.register(t)
            } else if (e && e.active && e.active.postMessage) {
                e.active.postMessage({
                    msg: "back-online",
                    id: t
                })
            }
        } catch (i) {}
    };
    this.dismissBadges = async function() {
        try {
            if (!navigator.clearAppBadge) {
                return
            }
            navigator.clearAppBadge();
            if (!indexedDB) {
                return
            }
            let e = indexedDB.open("progressierBadgeDB", 1);
            e.onupgradeneeded = function(e) {
                let t = e.target.result;
                let i = t.createObjectStore("badgeStore", {
                    keyPath: "id"
                });
                i.add({
                    id: "badgeCount",
                    count: 0
                })
            };
            e.onsuccess = function(e) {
                let t = e.target.result;
                let i = t.transaction(["badgeStore"], "readwrite");
                let n = i.objectStore("badgeStore");
                let a = n.get("badgeCount");
                a.onsuccess = function() {
                    n.put({
                        id: "badgeCount",
                        count: 0
                    })
                };
                i.oncomplete = function() {
                    t.close()
                }
            }
        } catch (e) {}
    };
    this.catchRedirect = function() {
        try {
            var e = l.parent.utils.getUrlParam("pwaredirect");
            if (!e) {
                return
            }
            window.isBeingRedirectedNow = true;
            l.parent.utils.setUrlParam({
                pwaredirect: null
            });
            var t = atob(e);
            if (t && t.startsWith("/")) {
                window.location.href = window.location.origin + t;
                return
            }
            var i = new URL(t);
            if (!i) {
                return
            }
            window.location.href = t
        } catch (n) {
            console.log(n)
        }
    };
    this.init = async function() {
        if ("serviceWorker" in navigator !== true) {
            return
        }
        l.catchRedirect();
        var e = await ProgressierForPromoOnly();
        if (e) {
            return
        }
        await l.register();
        await l.waitTillReady();
        await l.listenToMessage();
        window.addEventListener("online", l.registerBackgroundSync);
        window.addEventListener("focus", l.dismissBadges);
        await l.dismissBadges();
        await l.registerBackgroundSync()
    };
    l.init()
}

function ProgressierForPromoOnly() {
    return new Promise(function(t, e) {
        var i = function() {
            if (!window.progressier || !window.progressier.data || !window.progressier.data.params || typeof window.progressier.data.params.usePromoMethod === "undefined") {
                return
            }
            clearInterval(n);
            var e = window.progressier.data.params.usePromoMethod;
            if (!e) {
                return t(false)
            }
            if (window.progressier.data.params.currentlyOnEmbeddablePage) {
                return t(false)
            }
            return t(true)
        };
        var n = setInterval(i, 100);
        i()
    })
}

function progressierRedirectToEmbedPage(e) {
    var t = window.progressier.data.params.embeddablePageLocation;
    var i = t + "?pswutlzoq=" + e;
    if (progressier.detection.isIframe()) {
        window.open(i, "_blank")
    } else {
        window.location.href = i
    }
}