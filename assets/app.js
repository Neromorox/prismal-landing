(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  // Barre de navigation : bordure au defilement, menu mobile
  var top = $("top");
  function onScroll() { top.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var toggle = $("menu-toggle"), menu = $("menu");
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  });
  $("year").textContent = new Date().getFullYear();

  // Apparition au defilement
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (n) { io.observe(n); });
  } else {
    items.forEach(function (n) { n.classList.add("in"); });
  }

  // Formulaire de contact -> fonction Supabase "contact"
  var form = $("contact-form"), msg = $("form-msg"), btn = $("f-submit");
  var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  function erreur(t) { msg.className = "form-msg err"; msg.textContent = t; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    msg.className = "form-msg"; msg.textContent = "";
    var f = form.elements;
    var nom = f.nom.value.trim(), email = f.email.value.trim();
    if (!nom) { erreur("Merci d'indiquer votre nom."); f.nom.focus(); return; }
    if (!EMAIL.test(email)) { erreur("Merci d'indiquer une adresse email valide."); f.email.focus(); return; }
    if (!f.consentement.checked) { erreur("Merci d'accepter l'utilisation de vos données pour recevoir une réponse."); return; }

    var outils = Array.prototype.filter.call(form.querySelectorAll("input[name=outils]"), function (c) { return c.checked; })
      .map(function (c) { return c.value; });
    var corps = {
      nom: nom, email: email, societe: f.societe.value.trim(), role: f.role.value, telephone: f.telephone.value.trim(),
      outils: outils, message: f.message.value.trim(), consentement: true,
      site: f.site.value, page: location.href.split("#")[0]
    };

    btn.disabled = true; btn.textContent = "Envoi en cours…";
    fetch(window.PRISMAL.SUPABASE_URL + "/functions/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": window.PRISMAL.PUBLISHABLE_KEY },
      body: JSON.stringify(corps)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (b) {
        if (!r.ok) throw new Error(b.message || "Une erreur est survenue. Réessayez dans un instant.");
        $("form-body").hidden = true; $("form-sent").hidden = false;
      });
    }).catch(function (err) {
      btn.disabled = false; btn.textContent = "Envoyer ma demande";
      erreur(err instanceof TypeError ? "Connexion impossible. Vérifiez votre accès à Internet et réessayez." : err.message);
    });
  });
})();
