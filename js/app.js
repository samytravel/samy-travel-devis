let devisCounter = Math.floor(Math.random()*90)+10;

// ── Fonctions hôtels manquantes ──────────────────────────
function getHotelMedine(){
  const sel = document.getElementById('hotel-medine').value;
  const custom = document.getElementById('hotel-medine-custom').value.trim();
  return sel || custom || 'Hôtel Médine';
}

function getHotelMekkah(){
  const sel = document.getElementById('hotel-mekkah').value;
  const custom = document.getElementById('hotel-mekkah-custom').value.trim();
  return sel || custom || 'Hôtel Mekkah';
}

function syncCustomMedine(){
  document.getElementById('hotel-medine-custom').value = '';
}

function syncCustomMekkah(){
  document.getElementById('hotel-mekkah-custom').value = '';
}
// ────────────────────────────────────────────────────────

function toggleFormule(val){
  document.getElementById('fo-ro').classList.toggle('active', val==='RO');
  document.getElementById('fo-bb').classList.toggle('active', val==='BB');
  updateDevis();
}

function getFormule(){
  return document.querySelector('input[name=formule]:checked').value;
}

function getChambres(){
  const t = document.getElementById('chambre-type').value;
  const labels = {single:'Single',double:'Double',triple:'Triple',quad:'Quadruple',quintuple:'Quintuple',junior:'Suite Junior',senior:'Suite Senior'};
  const pax = {single:1,double:2,triple:3,quad:4,quintuple:5,junior:2,senior:2};
  return {label:labels[t], pax:pax[t]};
}

function fmt(n){ return n.toLocaleString('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}); }

function updateDevis(){
  const nbCh = parseInt(document.getElementById('nb-chambres').value)||1;
  const formule = getFormule();
  const chambre = getChambres();
  const validite = parseInt(document.getElementById('validite').value)||1;

  // Médine
  const nuitsMedine = parseInt(document.getElementById('nuits-medine').value)||0;
  const prixNuitMedine = parseFloat(document.getElementById('prix-nuit-medine').value)||0;
  const prixPdjMedine = parseFloat(document.getElementById('prix-pdj-medine').value)||0;
  const hotelMedine = getHotelMedine();
  const stMedine = prixNuitMedine * nuitsMedine * nbCh;
  const pdjMedine = formule==='BB' ? prixPdjMedine * chambre.pax * nbCh * nuitsMedine : 0;

  // Mekkah
  const nuitsM = parseInt(document.getElementById('nuits-mekkah').value)||0;
  const prixNuitM = parseFloat(document.getElementById('prix-nuit-mekkah').value)||0;
  const prixPdjM = parseFloat(document.getElementById('prix-pdj-mekkah').value)||0;
  const hotelMekkah = getHotelMekkah();
  const stMekkah = prixNuitM * nuitsM * nbCh;
  const pdjMekkah = formule==='BB' ? prixPdjM * chambre.pax * nbCh * nuitsM : 0;

  const totalNuits = nuitsMedine + nuitsM;
  const total = stMedine + pdjMedine + stMekkah + pdjMekkah;

  // Badge durée totale
  document.getElementById('duree-calc').innerHTML = '<i class="fas fa-moon" style="font-size:9px"></i> '+totalNuits+' nuit'+(totalNuits>1?'s':'');

  const today = new Date();
  const expiry = new Date(today.getTime()+validite*86400000);
  const fmtDate = d=>d.toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'});

  // Calculer dates si renseignées
  const da = document.getElementById('date-arrivee').value;
  const dd = document.getElementById('date-depart').value;
  if(da && dd){
    const diff = Math.round((new Date(dd)-new Date(da))/(1000*60*60*24));
    if(diff>0) document.getElementById('duree-calc').innerHTML = '<i class="fas fa-moon" style="font-size:9px"></i> '+diff+' nuit'+(diff>1?'s':'');
  }

  document.getElementById('d-ref').textContent = `ST-${today.getFullYear()}-${String(devisCounter).padStart(3,'0')}`;
  document.getElementById('d-hotel-name').textContent = `Médine & Mekkah`;
  document.getElementById('d-today').textContent = 'Émis le '+fmtDate(today);
  document.getElementById('d-validity').textContent = 'Valable jusqu\'au '+fmtDate(expiry);
  const prenom = document.getElementById('client-prenom').value.trim();
  const nom = document.getElementById('client-nom').value.trim();
  const clientEl = document.getElementById('d-client-name');
  clientEl.textContent = (prenom || nom) ? `À l'attention de : ${prenom} ${nom}`.trim() : '';

  const lines = [];
  const chLabel = nbCh > 1 ? `${nbCh} chambres ${chambre.label.toLowerCase()}` : `1 chambre ${chambre.label.toLowerCase()}`;

  // Bloc Médine
  if(nuitsMedine > 0){
    lines.push({label:`Hébergement Médine`, detail:`${hotelMedine} — ${chLabel} pour ${nuitsMedine} nuit${nuitsMedine>1?'s':''}`, price: fmt(stMedine)});
    if(formule==='BB' && pdjMedine>0){
      lines.push({label:'Petit-déjeuner Médine', detail:`${chambre.pax} personne${chambre.pax>1?'s':''} × ${nuitsMedine} nuit${nuitsMedine>1?'s':''}`, price: fmt(pdjMedine)});
    }
  }

  // Bloc Mekkah
  if(nuitsM > 0){
    lines.push({label:`Hébergement Mekkah`, detail:`${hotelMekkah} — ${chLabel} pour ${nuitsM} nuit${nuitsM>1?'s':''}`, price: fmt(stMekkah)});
    if(formule==='BB' && pdjMekkah>0){
      lines.push({label:'Petit-déjeuner Mekkah', detail:`${chambre.pax} personne${chambre.pax>1?'s':''} × ${nuitsM} nuit${nuitsM>1?'s':''}`, price: fmt(pdjMekkah)});
    }
  }

  let html = '';
  lines.forEach(l=>{
    if(l.sep){ html+=`<div class="separator"></div>`; return; }
    html+=`<div class="line-item">
      <div>
        <div class="line-desc">${l.label}</div>
        ${l.detail?`<div class="line-detail">${l.detail}</div>`:''}
      </div>
      <div class="line-price">${l.price}</div>
    </div>`;
  });
  document.getElementById('d-lines').innerHTML = html;
  document.getElementById('d-total').textContent = fmt(total);
  document.getElementById('d-valid-text').textContent = `Offre valable ${validite} jour${validite>1?'s':''} — expire le ${fmtDate(expiry)}`;

  const alreadyVisible = document.getElementById('devis-output').style.display === 'block';
  document.getElementById('devis-output').style.display = 'block';
  if(!alreadyVisible){
    document.getElementById('devis-output').scrollIntoView({behavior:'smooth', block:'nearest'});
  }
}

function getDevisData(){
  const lineEls = document.querySelectorAll('#d-lines .line-item');
  const lines = [];
  lineEls.forEach(el => {
    const desc  = el.querySelector('.line-desc')?.textContent?.trim() || '';
    const detail= el.querySelector('.line-detail')?.textContent?.trim() || '';
    const price = el.querySelector('.line-price')?.textContent?.trim() || '';
    if(desc) lines.push({desc, detail, price});
  });

  const nbCh = parseInt(document.getElementById('nb-chambres').value)||1;
  const nuits = (parseInt(document.getElementById('nuits-medine').value)||0) + (parseInt(document.getElementById('nuits-mekkah').value)||0);

  return {
    ref:      document.getElementById('d-ref').textContent.trim(),
    hotel:    document.getElementById('d-hotel-name').textContent.trim(),
    client:   document.getElementById('d-client-name').textContent.trim(),
    dateEmis: document.getElementById('d-today').textContent.trim(),
    dateVal:  document.getElementById('d-validity').textContent.trim(),
    total:    document.getElementById('d-total').textContent.trim(),
    validTxt: document.getElementById('d-valid-text').textContent.trim(),
    lines,
    ville: 'Médine & Mekkah',
    nuits, nbCh,
    formule:  getFormule(),
    chambre:  getChambres()
  };
}

function genererPDF(data){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4', orientation:'portrait' });
  const W = 210;
  const M = 14;
  const CW = W - M*2;

  const hex2rgb = h => {
    const r = parseInt(h.slice(1,3),16);
    const g = parseInt(h.slice(3,5),16);
    const b = parseInt(h.slice(5,7),16);
    return [r,g,b];
  };
  const setFill = h => doc.setFillColor(...hex2rgb(h));
  const setDraw = h => doc.setDrawColor(...hex2rgb(h));
  const setTxt  = h => doc.setTextColor(...hex2rgb(h));

  let y = 0;

  setFill('#FFFFFF');
  doc.rect(0, 0, W, 56, 'F');
  setDraw('#DADADA');
  doc.setLineWidth(0.5);
  doc.line(0, 56, W, 56);

  // Logo : utiliser la version base64 si disponible, sinon tenter l'URL directe
  const logoSrc = LOGO_BASE64 || (document.querySelector('.logo-img') && document.querySelector('.logo-img').src);
  if(logoSrc) {
    try { doc.addImage(logoSrc, 'PNG', M, 6, 26, 26); } catch(e) { console.warn('logo PDF err', e); }
  }

  doc.setFont('helvetica','bold');
  doc.setFontSize(16);
  setTxt('#1A1A1A');
  doc.text('SAMY TRAVEL', M + 30, 16);

  doc.setFont('helvetica','normal');
  doc.setFontSize(7.5);
  setTxt('#6B6B6B');
  doc.text('OMRA & PELERINAGE - AGENCE DE VOYAGES', M + 30, 22);

  doc.setFont('helvetica','normal');
  doc.setFontSize(8);
  setTxt('#6B6B6B');
  doc.text('DEVIS N', W - M, 14, {align:'right'});

  doc.setFont('helvetica','bold');
  doc.setFontSize(16);
  setTxt('#1A1A1A');
  doc.text(data.ref, W - M, 22, {align:'right'});

  doc.setFont('helvetica','normal');
  doc.setFontSize(7.5);
  setTxt('#AAAAAA');
  const hotelShort = data.hotel.length > 42 ? data.hotel.slice(0,42)+'...' : data.hotel;
  doc.text(hotelShort, W - M, 28, {align:'right'});

  if(data.client){
    doc.setFont('helvetica','bold');
    doc.setFontSize(8);
    setTxt('#1A1A1A');
    doc.text(data.client, W - M, 34, {align:'right'});
  }

  doc.setFontSize(8);
  setTxt('#999999');
  doc.text(data.dateEmis, M + 30, 40);
  doc.text(data.dateVal, W - M, 40, {align:'right'});

  y = 68;

  doc.setFont('helvetica','bold');
  doc.setFontSize(8);
  setTxt('#6B6B6B');
  doc.text('DÉTAIL DU SÉJOUR', M, y);
  y += 8;

  data.lines.forEach((line, i) => {
    setDraw('#E8E8E8');
    doc.setLineWidth(0.3);
    doc.line(M, y - 2, W - M, y - 2);

    doc.setFont('helvetica','bold');
    doc.setFontSize(10);
    setTxt('#1A1A1A');
    doc.text(line.desc, M, y + 4);

    if(line.detail){
      doc.setFont('helvetica','normal');
      doc.setFontSize(8);
      setTxt('#6B6B6B');
      doc.text(line.detail, M, y + 9);
    }

    if(line.price){
      doc.setFont('helvetica','bold');
      doc.setFontSize(10);
      setTxt('#1A1A1A');
      doc.text(line.price, W - M, y + 4, {align:'right'});
    }

    y += line.detail ? 16 : 11;
  });

  setDraw('#E8E8E8');
  doc.setLineWidth(0.3);
  doc.line(M, y - 2, W - M, y - 2);
  y += 6;

  setFill('#F6F6F6');
  setDraw('#DADADA');
  doc.setLineWidth(0.5);
  doc.roundedRect(M, y, CW, 18, 3, 3, 'FD');

  doc.setFont('helvetica','bold');
  doc.setFontSize(12);
  setTxt('#1A1A1A');
  doc.text('Total TTC', M + 6, y + 11);

  doc.setFont('helvetica','bold');
  doc.setFontSize(16);
  setTxt('#1A1A1A');
  doc.text(data.total, W - M - 6, y + 12, {align:'right'});
  y += 26;

  setFill('#F6F6F6');
  setDraw('#DADADA');
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, CW, 10, 2, 2, 'FD');

  doc.setFont('helvetica','normal');
  doc.setFontSize(8);
  setTxt('#6B6B6B');
  doc.text('  ' + data.validTxt, M + 4, y + 6.5);
  y += 18;

  setDraw('#E8E8E8');
  doc.setLineWidth(0.4);
  doc.line(M, y, W - M, y);
  y += 8;

  const mention = 'Ce devis est etabli sous reserve de disponibilite hoteliere. Samy Travel se reserve le droit de proposer\nun hebergement equivalent en cas d\'indisponibilite.';
  doc.setFont('helvetica','normal');
  doc.setFontSize(8);
  setTxt('#6B6B6B');
  doc.text(mention, M, y);

  return doc;
}

async function envoyerWhatsappPDF(){
  const btn = document.getElementById('btn-wa');
  const statusEl = document.getElementById('wa-status');
  const numero = document.getElementById('wa-number').value.trim().replace(/\s+/g,'');

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération PDF…';
  statusEl.style.display = 'block';
  statusEl.innerHTML = '⏳ Création du PDF en cours…';

  try {
    const data = getDevisData();
    const doc  = genererPDF(data);
    const filename = `Devis_SamyTravel_${data.ref}.pdf`;
    const msg = `Voici le devis ci-joint.\n\nSamy Travel`;

    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

    if(navigator.canShare && navigator.canShare({ files: [pdfFile] })){
      statusEl.innerHTML = '📤 Ouverture du partage…';
      await navigator.share({ files: [pdfFile], text: msg });
      statusEl.innerHTML = '✅ PDF partagé avec succès !';
    } else {
      doc.save(filename);
      statusEl.innerHTML = '✅ PDF téléchargé ! Ouverture de WhatsApp…';
      await new Promise(r => setTimeout(r, 1000));
      const encoded = encodeURIComponent(msg);
      const waUrl = numero
        ? `https://wa.me/${numero.replace(/^\+/,'')}?text=${encoded}`
        : `https://wa.me/?text=${encoded}`;
      window.open(waUrl, '_blank');
      statusEl.innerHTML = '📤 WhatsApp ouvert — <strong>joignez le PDF</strong> depuis vos téléchargements !';
    }

  } catch(err) {
    if(err.name !== 'AbortError'){
      console.error(err);
      statusEl.innerHTML = '❌ Erreur : ' + err.message;
    } else {
      statusEl.innerHTML = '↩️ Partage annulé.';
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fab fa-whatsapp"></i> Envoyer le PDF WhatsApp';
  }
}

// Convertir le logo en base64 pour le PDF et le devis
let LOGO_BASE64 = null;

function chargerLogoBase64() {
  const logoEl = document.querySelector('.logo-img');
  if (!logoEl || !logoEl.src) return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 200;
    canvas.height = img.naturalHeight || 200;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    try {
      LOGO_BASE64 = canvas.toDataURL('image/png');
      document.getElementById('devis-logo-img').src = LOGO_BASE64;
    } catch(e) {
      console.warn('Logo cross-origin, utilisation URL directe');
      document.getElementById('devis-logo-img').src = logoEl.src;
    }
  };
  img.onerror = function() {
    document.getElementById('devis-logo-img').src = logoEl.src;
  };
  img.src = logoEl.src;
}

chargerLogoBase64();

const today = new Date();
const dep = new Date(today.getTime()+7*86400000);
document.getElementById('date-arrivee').value = today.toISOString().split('T')[0];
document.getElementById('date-depart').value = dep.toISOString().split('T')[0];
updateDevis();

// ===============================
// Gestion des hôtels
// ===============================

let HOTELS = {};

const HOTELS_VERSION = "2";

function loadHotels() {
  const saved = localStorage.getItem("hotels");
  const savedVersion = localStorage.getItem("hotels_version");
  if (saved && savedVersion === HOTELS_VERSION) {
    HOTELS = JSON.parse(saved);
  } else {
    HOTELS = {
      medine: [
        "Anwar Al Madinah Mövenpick ⭐⭐⭐⭐⭐",
        "Pullman Zamzam Madinah ⭐⭐⭐⭐⭐",
        "Sofitel Shahd Al Madinah ⭐⭐⭐⭐⭐",
        "Intercontinental Dar Al Iman ⭐⭐⭐⭐⭐",
        "Intercontinental Dar Al Hijra ⭐⭐⭐⭐⭐",
        "Conrad Madinah ⭐⭐⭐⭐⭐",
        "Hilton Madinah ⭐⭐⭐⭐⭐",
        "Saja by Warwick Madinah ⭐⭐⭐⭐",
        "Elaf Al Taqwa ⭐⭐⭐⭐",
        "Elaf Taiba ⭐⭐⭐⭐",
        "Emaar Royal ⭐⭐⭐⭐",
        "Dar Al Taqwa ⭐⭐⭐⭐",
        "Rotana Al Manakha Madinah ⭐⭐⭐⭐",
        "Ancyra Hotel Madinah ⭐⭐⭐⭐",
        "Jayden Hotel ⭐⭐⭐",
        "Maien Taiba ⭐⭐⭐",
        "Peninsula Worth Hotel ⭐⭐⭐"
      ],
      mekkah: [
        "Swissôtel Makkah - Abraj Al Bait ⭐⭐⭐⭐⭐",
        "Fairmont Makkah Clock Royal Tower ⭐⭐⭐⭐⭐",
        "Conrad Makkah ⭐⭐⭐⭐⭐",
        "Pullman Zamzam Makkah ⭐⭐⭐⭐⭐",
        "Raffles Makkah Palace ⭐⭐⭐⭐⭐",
        "Mövenpick Hajar Tower Makkah ⭐⭐⭐⭐⭐",
        "Al Marwa Rayhaan by Rotana ⭐⭐⭐⭐⭐",
        "Hilton Makkah Convention Hotel ⭐⭐⭐⭐",
        "DoubleTree by Hilton Jabal Omar ⭐⭐⭐⭐",
        "Anjum Makkah ⭐⭐⭐⭐",
        "Voco Makkah ⭐⭐⭐⭐",
        "Novotel Makkah Thakher City ⭐⭐⭐⭐",
        "Tilal Jabal Al Kabah ⭐⭐⭐⭐",
        "Elaf Ajyad Makkah ⭐⭐⭐",
        "Al Safwah Royale Orchid ⭐⭐⭐",
        "Makkah Towers ⭐⭐⭐"
      ]
    };
    localStorage.setItem("hotels", JSON.stringify(HOTELS));
    localStorage.setItem("hotels_version", HOTELS_VERSION);
  }
  populateHotels();
}

function populateHotels() {
  ["medine","mekkah"].forEach(ville => {
    const select = document.getElementById("hotel-" + ville);
    if (!select) return;

    // Sauvegarder la sélection actuelle AVANT de vider
    const valeurActuelle = select.value;

    select.innerHTML = '<option value="">— Choisir un hôtel —</option>';

    HOTELS[ville].sort().forEach(hotel => {
      const option = document.createElement("option");
      option.value = hotel;
      option.textContent = hotel;
      select.appendChild(option);
    });

    // Restaurer la sélection si elle existe encore
    if (valeurActuelle) select.value = valeurActuelle;
  });
}

function ajouterHotel(ville) {
  const input = document.getElementById("hotel-" + ville + "-custom");
  const nom = input.value.trim();

  if (!nom) { alert("Saisissez un nom d'hôtel."); return; }

  if (!HOTELS[ville].includes(nom)) {
    HOTELS[ville].push(nom);
    localStorage.setItem("hotels", JSON.stringify(HOTELS));
    populateHotels();
  }

  // Sélectionner l'hôtel ajouté dans le select
  document.getElementById("hotel-" + ville).value = nom;
  input.value = "";
  updateDevis();
}

loadHotels();
