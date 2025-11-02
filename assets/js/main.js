// footer year
(function(){
  var yEl=document.getElementById('yr');
  if(yEl){ yEl.textContent=new Date().getFullYear(); }
})();

// splash hide
(function(){
  var intro=document.getElementById('intro');
  setTimeout(function(){
    if(intro) intro.classList.add('hide');
    document.body.classList.remove('splash-active');
  }, 2800 + 300);
})();

// header shrink
(function(){
  var hdr=document.getElementById('hdr');
  var ADD_AT=40, REM_AT=10;
  function onScroll(){
    var y=window.scrollY||document.documentElement.scrollTop;
    if(y>ADD_AT){hdr.classList.add('is-shrunk');}
    else if(y<REM_AT){hdr.classList.remove('is-shrunk');}
  }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
})();

// mobile menu toggle
(function(){
  var toggle=document.getElementById('menuToggle');
  var nav=document.getElementById('mainNav');
  var mobileCta=document.getElementById('mobileCta');
  if(!toggle || !nav) return;
  toggle.addEventListener('click', function(){
    var isOpen=nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    if(mobileCta){
      mobileCta.style.display = isOpen ? 'block' : 'none';
    }
  });
  // close when clicking a link (mobile)
  nav.addEventListener('click', function(e){
    if(e.target.tagName.toLowerCase()==='a' && nav.classList.contains('is-open')){
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      if(mobileCta) mobileCta.style.display='none';
    }
  });
  // close on resize back to desktop
  window.addEventListener('resize', function(){
    if(window.innerWidth>820){
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      if(mobileCta) mobileCta.style.display='none';
    }
  });
})();

// reveal on scroll (with reset)
(function(){
  var els=[].slice.call(document.querySelectorAll('.reveal'));
  if(!('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('is-visible');});
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){en.target.classList.add('is-visible');}
      else{en.target.classList.remove('is-visible');}
    });
  }, {threshold:0.2});
  els.forEach(function(e){io.observe(e);});
})();

// mailto form
(function(){
  var btn=document.getElementById('sendBtn');
  var clearBtn=document.getElementById('clearFormBtn');

  function enc(s){return encodeURIComponent(s).replace(/%20/g,'+');}

  if(btn){
    btn.addEventListener('click', function(){
      var name=document.getElementById('fName').value.trim();
      var phone=document.getElementById('fPhone').value.trim();
      var email=document.getElementById('fEmail').value.trim();
      var msg=document.getElementById('fMsg').value.trim();
      if(!name || !email || !msg){
        alert('Fill in Name, Email and Description.');
        return;
      }
      var subject=enc('New enquiry from ' + name);
      var body=enc(
        'Name: ' + name + '\n' +
        'Phone: ' + (phone || '-') + '\n' +
        'Email: ' + email + '\n\n' +
        'Project / Description:\n' + msg + '\n'
      );
      window.location.href='mailto:info@rozsadesign.com.au?subject=' + subject + '&body=' + body;
    });
  }

  if(clearBtn){
    clearBtn.addEventListener('click', function(){
      ['fName','fPhone','fEmail','fMsg'].forEach(function(id){
        var el=document.getElementById(id);
        if(el) el.value='';
      });
    });
  }
})();

// active nav on scroll
(function(){
  var links=[].slice.call(document.querySelectorAll('#mainNav a'));
  var sections=links.map(function(l){
    var id=l.getAttribute('data-target');
    return {id:id, el:document.getElementById(id)};
  });

  function setActive(id){
    links.forEach(function(l){
      if(l.getAttribute('data-target')===id){l.classList.add('active');}
      else{l.classList.remove('active');}
    });
  }

  function onScroll(){
    var scrollPos=window.scrollY||window.pageYOffset;
    var winH=window.innerHeight || document.documentElement.clientHeight;
    var docH=document.documentElement.scrollHeight;
    var current='top';

    sections.forEach(function(s){
      if(!s.el) return;
      var top=s.el.offsetTop - 130;
      if(scrollPos>=top){current=s.id;}
    });

    if(scrollPos + winH >= docH - 5){
      current='contact';
    }

    setActive(current);
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();
})();

// ========== HERO CAROUSEL ==========
(function(){
  var slider=document.getElementById('heroSlider');
  if(!slider) return;
  var slides=[].slice.call(slider.querySelectorAll('.hero-slide'));
  var dotsWrap=document.getElementById('heroDots');
  var current=0;
  var timer=null;
  var INTERVAL=6500;

  // set background from data-bg or fallback
  slides.forEach(function(slide){
    var bg=slide.getAttribute('data-bg');
    if(bg){
      slide.style.backgroundImage='url('+bg+')';
    } else {
      // fallback to your old SVG panel
      slide.style.backgroundImage="url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1400\" height=\"420\" viewBox=\"0 0 1400 420\"><defs><linearGradient id=\"hg\" x1=\"0\" x2=\"1\" y1=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"%23232323\"/><stop offset=\"100%\" stop-color=\"%233d3d3d\"/></linearGradient></defs><rect width=\"1400\" height=\"420\" fill=\"url(%23hg)\"/><rect x=\"90\" y=\"80\" width=\"540\" height=\"250\" rx=\"16\" fill=\"none\" stroke=\"%23ffffff33\" stroke-width=\"3\"/><line x1=\"680\" y1=\"90\" x2=\"1230\" y2=\"90\" stroke=\"%23ffffff22\" stroke-width=\"4\" stroke-linecap=\"round\"/><line x1=\"680\" y1=\"130\" x2=\"1180\" y2=\"130\" stroke=\"%23ffffff18\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"680\" y1=\"170\" x2=\"980\" y2=\"170\" stroke=\"%23ffffff18\" stroke-width=\"3\" stroke-linecap=\"round\"/><text x=\"110\" y=\"150\" fill=\"%23ffffff\" font-size=\"44\" font-family=\"sans-serif\" font-weight=\"700\">Concept → CAD → Manufacture</text><text x=\"110\" y=\"190\" fill=\"%23ffffffaa\" font-size=\"22\" font-family=\"sans-serif\">Rozsa Design</text></svg>')";
    }
  });

  // dots
  var dots=[];
  slides.forEach(function(_,idx){
    var d=document.createElement('button');
    d.type='button';
    d.className='hero-dot' + (idx===0 ? ' is-active' : '');
    d.setAttribute('aria-label','Go to slide ' + (idx+1));
    d.addEventListener('click', function(){
      goTo(idx, true);
    });
    dotsWrap.appendChild(d);
    dots.push(d);
  });

  function goTo(idx, user){
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');

    current=idx;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');

    if(user){
      restart();
    }
  }

  function next(){
    var n=(current+1) % slides.length;
    goTo(n, false);
  }

  function start(){
    timer=setInterval(next, INTERVAL);
  }
  function stop(){
    if(timer) clearInterval(timer);
  }
  function restart(){
    stop();
    start();
  }

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  start();
})();
