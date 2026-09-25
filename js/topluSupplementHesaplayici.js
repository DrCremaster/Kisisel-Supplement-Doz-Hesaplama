// Fitness-hesaplama/js/topluSupplementHesaplayici.js
function hesaplaToplu() {
    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    const kiloInput = document.getElementById("toplu_kilo");
    const hedefInput = document.getElementById("toplu_hedef");
    const secilenler = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    const topluSonucDiv = document.getElementById("topluSonuc");

    const kilo = parseFloat(kiloInput.value);
    let isValid = true;

    if (isNaN(kilo) || kilo <= 0) {
        document.getElementById('toplu_kilo_warning').textContent = "Lütfen geçerli (pozitif) bir kilonuzu girin.";
        isValid = false;
    }
    if (secilenler.length === 0) {
        showResult(topluSonucDiv, "Lütfen en az bir supplement seçin.", false);
        return;
    }
    if (!isValid) {
        showResult(topluSonucDiv, "Lütfen tüm gerekli alanları doğru şekilde doldurun.", false);
        return;
    }

    let output = "<div class='result-value'>Toplu Supplement Önerileri</div><div class='interpretation'><div class='bulk-result-grid'>";

    // Protein (proteinHesaplayici.js ile aynı)
    if (document.getElementById("chk_protein").checked) {
        const hedef = hedefInput.value;
        let min = 1.4, max = 1.8;
        if (hedef === "alma") { min = 1.6; max = 2.2; }
        else if (hedef === "verme") { min = 1.8; max = 2.4; }
        output += `<div class="bulk-result-item"><strong>Protein</strong><span>${(kilo * min).toFixed(1)} – ${(kilo * max).toFixed(1)} g</span><small>günlük</small></div>`;
    }

    // Kreatin (kreatinHesaplayici.js ile aynı)
    if (document.getElementById("chk_kreatin").checked) {
        const idameMin = (kilo * 0.03).toFixed(1);
        const idameMax = (kilo * 0.05).toFixed(1);
        output += `<div class="bulk-result-item"><strong>Kreatin</strong><span>${idameMin} – ${idameMax} g</span><small>günlük</small></div>`;
    }

    // Beta-Alanin (betaHesaplayici.js ile aynı)
    if (document.getElementById("chk_beta").checked) {
        const minDoz = (kilo * 0.065).toFixed(1);
        const maxDoz = (kilo * 0.080).toFixed(1);
        output += `<div class="bulk-result-item"><strong>Beta-Alanin</strong><span>${minDoz} – ${maxDoz} g</span><small>günlük</small></div>`;
    }

    // Sitrülin (sitrulinHesaplayici.js ile aynı)
    if (document.getElementById("chk_sitrulin").checked) {
        const minDoz = (kilo * 0.10).toFixed(1);
        const maxDoz = (kilo * 0.15).toFixed(1);
        output += `<div class="bulk-result-item"><strong>Sitrülin Malat</strong><span>${minDoz} – ${maxDoz} g</span><small>günlük</small></div>`;
    }

    // Karnitin (karnitinHesaplayici.js ile aynı)
    if (document.getElementById("chk_karnitin").checked) {
        const minDozMg = (kilo * 20).toFixed(0);
        const maxDozMg = (kilo * 40).toFixed(0);
        output += `<div class="bulk-result-item"><strong>L-Karnitin</strong><span>${minDozMg} – ${maxDozMg} mg</span><small>günlük</small></div>`;
    }

    // Kafein (kafeinHesaplayici.js ile aynı)
    if (document.getElementById("chk_kafein").checked) {
        const alt = (kilo * 3).toFixed(0);
        const ust = (kilo * 6).toFixed(0);
        output += `<div class="bulk-result-item"><strong>Kafein</strong><span>${alt} – ${ust} mg</span><small>tek kullanım aralığı</small></div>`;
    }

    // BCAA
    if (document.getElementById("chk_bcaa")?.checked) {
        const minDoz = (kilo * 0.070).toFixed(1);
        const maxDoz = (kilo * 0.100).toFixed(1);
        output += `<div class="bulk-result-item"><strong>BCAA</strong><span>${minDoz} – ${maxDoz} g</span><small>günlük</small></div>`;
    }

    // Glutamin
    if (document.getElementById("chk_glutamin")?.checked) {
        const minDoz = (kilo * 0.10).toFixed(1);
        const maxDoz = (kilo * 0.15).toFixed(1);
        output += `<div class="bulk-result-item"><strong>Glutamin</strong><span>${minDoz} – ${maxDoz} g</span><small>günlük</small></div>`;
    }

    // Arjinin
    if (document.getElementById("chk_arjinin")?.checked) {
        const minDoz = (kilo * 0.075).toFixed(1);
        const maxDoz = (kilo * 0.100).toFixed(1);
        output += `<div class="bulk-result-item"><strong>Arjinin</strong><span>${minDoz} – ${maxDoz} g</span><small>günlük</small></div>`;
    }

    // EAA
    if (document.getElementById("chk_eaa")?.checked) {
        const minDoz = (kilo * 0.1).toFixed(1);
        const maxDoz = (kilo * 0.2).toFixed(1);
        output += `<div class="bulk-result-item"><strong>EAA</strong><span>${minDoz} – ${maxDoz} g</span><small>günlük</small></div>`;
    }

    output += "</div></div>";
    showResult(topluSonucDiv, output);
}