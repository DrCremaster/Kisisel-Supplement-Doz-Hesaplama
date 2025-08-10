function validateInputAndGetResultDiv(inputId, resultId, requiredInputs = []) {
    let isValid = true;

    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    const valueInput = document.getElementById(inputId);
    const value = parseFloat(valueInput.value);
    const resultDiv = document.getElementById(resultId);
    const warningSpan = document.getElementById(inputId + '_warning');

    if (isNaN(value) || value <= 0) {
        warningSpan.textContent = "Lütfen geçerli (pozitif) bir değer girin.";
        isValid = false;
    } else {
        warningSpan.textContent = "";
    }

    for (const input of requiredInputs) {
        const el = document.getElementById(input.id);
        const elWarningSpan = document.getElementById(input.id + '_warning');
        let val;
        if (input.type === 'number') {
            val = parseFloat(el.value);
            if (isNaN(val) || val <= 0) {
                elWarningSpan.textContent = "Lütfen geçerli (pozitif) bir değer girin.";
                isValid = false;
            } else {
                elWarningSpan.textContent = "";
            }
        } else if (input.type === 'select') {
            val = el.value;
            if (!val) {
                elWarningSpan.textContent = `Lütfen ${el.options[el.selectedIndex].text.replace('-- ', '').replace(' --', '').toLowerCase()} seçin.`;
                isValid = false;
            } else {
                elWarningSpan.textContent = "";
            }
        }
    }

    if (!isValid) {
        showResult(resultDiv, "Lütfen tüm gerekli alanları doğru şekilde doldurun.", false);
        return null;
    }
    return {
        value,
        resultDiv
    };
}

function showResult(resultDiv, content, isSuccess = true) {
    resultDiv.innerHTML = content;
    resultDiv.style.backgroundColor = isSuccess ? '#f0f7ff' : '#fff3cd';
    resultDiv.style.borderLeftColor = isSuccess ? 'var(--primary-color)' : 'var(--warning-color)';
    resultDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

function hesaplaProtein() {
    const result = validateInputAndGetResultDiv("p_kilo", "proteinSonuc", [{
        id: "p_hedef",
        type: "select"
    }]);
    if (!result) return;

    const kilo = result.value;
    const hedef = document.getElementById("p_hedef").value;
    const resultDiv = result.resultDiv;

    let min = 1.4,
        max = 1.8;
    let formulaText = "";
    let recommendation = "";

    if (hedef === "alma") {
        min = 1.6;
        max = 2.2;
        formulaText = `Kilonuzun her kilogramı için 1.6 - 2.2 gram protein.`
        recommendation = "Kilo alma döneminde kas gelişimi için yüksek protein alımı önerilir.";
    } else if (hedef === "verme") {
        min = 1.8;
        max = 2.4;
        formulaText = `Kütlenizin her kilogramı için 1.8 - 2.4 gram protein.`;
        recommendation = "Kilo verme döneminde kas kaybını önlemek için yüksek protein alımı önerilir.";
    } else {
        formulaText = `Kilonuzun her kilogramı için 1.4 - 1.8 gram protein.`;
        recommendation = "Kilo koruma döneminde orta düzey protein alımı yeterlidir.";
    }

    const content = `
        <div class="result-value">${(kilo * min).toFixed(1)} - ${(kilo * max).toFixed(1)} gram</div>
        <div class="interpretation">
            <p><strong>Önerilen günlük protein alımı:</strong></p>
            <p>${recommendation}</p>
            <p class="formula">${formulaText}</p>
        </div>
    `;

    showResult(resultDiv, content);
}

function hesaplaYagOrani() {
    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    const cinsiyetInput = document.getElementById('y_cinsiyet');
    const boyInput = document.getElementById("y_boy");
    const kiloInput = document.getElementById("y_kilo");
    const belInput = document.getElementById("y_bel");
    const boyunInput = document.getElementById("y_boyun");
    const kalcaInput = document.getElementById("y_kalca");

    const cinsiyet = cinsiyetInput.value;
    const boy = parseFloat(boyInput.value);
    const kilo = parseFloat(kiloInput.value);
    const bel = parseFloat(belInput.value);
    const boyun = parseFloat(boyunInput.value);
    const kalca = parseFloat(kalcaInput.value);

    const yagSonucDiv = document.getElementById("yagSonuc");
    const vkiSonucDiv = document.getElementById("vkiSonuc");

    let isValid = true;

    if (!cinsiyet) {
        document.getElementById('y_cinsiyet_warning').textContent = "Lütfen cinsiyetinizi seçin.";
        isValid = false;
    }
    if (isNaN(boy) || boy <= 0) {
        document.getElementById('y_boy_warning').textContent = "Lütfen boyunuzu girin.";
        isValid = false;
    }
    if (isNaN(kilo) || kilo <= 0) {
        document.getElementById('y_kilo_warning').textContent = "Lütfen kilonuzu girin.";
        isValid = false;
    }
    if (isNaN(bel) || bel <= 0) {
        document.getElementById('y_bel_warning').textContent = "Lütfen bel çevrenizi girin.";
        isValid = false;
    }
    if (isNaN(boyun) || boyun <= 0) {
        document.getElementById('y_boyun_warning').textContent = "Lütfen boyun çevrenizi girin.";
        isValid = false;
    }
    if (cinsiyet === 'kadin' && (isNaN(kalca) || kalca <= 0)) {
        document.getElementById('y_kalca_warning').textContent = "Kadınlar için kalça çevresi gereklidir.";
        isValid = false;
    }

    if (!isValid) {
        showResult(yagSonucDiv, "Lütfen tüm gerekli alanları geçerli değerlerle doldurun.", false);
        vkiSonucDiv.innerHTML = "";
        return;
    }

    let yagOrani = 0;
    let yagOraniFormulaText = "ABD Donanması Yöntemi kullanılmıştır. Max sapma payı ±%1-3'tür";
    if (cinsiyet === 'erkek') {
        yagOrani = 495 / (1.0324 - 0.19077 * Math.log10(bel - boyun) + 0.15456 * Math.log10(boy)) - 450;
    } else if (cinsiyet === 'kadin') {
        yagOrani = 495 / (1.29579 - 0.35004 * Math.log10(bel + kalca - boyun) + 0.22100 * Math.log10(boy)) - 450;
    }

    const vki = kilo / ((boy / 100) ** 2);
    const vkiFormulaText = `Formül: Kilo (kg) / (Boy (metre) ^ 2)`;

    let yagKategori = '';
    if (cinsiyet === 'erkek') {
        if (yagOrani >= 2 && yagOrani <= 5) yagKategori = 'Temel Yağ';
        else if (yagOrani >= 6 && yagOrani <= 13) yagKategori = 'Atletik';
        else if (yagOrani >= 14 && yagOrani <= 17) yagKategori = 'Fitness';
        else if (yagOrani >= 18 && yagOrani <= 24) yagKategori = 'Ortalama';
        else if (yagOrani >= 25) yagKategori = 'Obez';
    } else {
        if (yagOrani >= 10 && yagOrani <= 13) yagKategori = 'Temel Yağ';
        else if (yagOrani >= 14 && yagOrani <= 20) yagKategori = 'Atletik';
        else if (yagOrani >= 21 && yagOrani <= 24) yagKategori = 'Fitness';
        else if (yagOrani >= 25 && yagOrani <= 31) yagKategori = 'Ortalama';
        else if (yagOrani >= 32) yagKategori = 'Obez';
    }

    let vkiKategori = '';
    if (vki < 18.5) vkiKategori = 'Zayıf';
    else if (vki >= 18.5 && vki <= 24.9) vkiKategori = 'Normal Kilolu';
    else if (vki >= 25.0 && vki <= 29.9) vkiKategori = 'Fazla Kilolu';
    else if (vki >= 30.0 && vki <= 34.9) vkiKategori = 'Obezite (1. Derece)';
    else if (vki >= 35.0 && vki <= 39.9) vkiKategori = 'Obezite (2. Derece)';
    else if (vki >= 40.0) vkiKategori = 'Morbid Obezite (3. Derece)';


    showResult(yagSonucDiv, `Tahmini Vücut Yağ Oranınız: <b>%${yagOrani.toFixed(1)}</b><br><br>Bu sonuca göre <strong>${yagKategori}</strong> kategorisindesiniz.<div class="formula">${yagOraniFormulaText}</div>`);
    showResult(vkiSonucDiv, `Vücut Kitle İndeksiniz (VKİ): <b>${vki.toFixed(1)}</b><br><br>Bu sonuca göre <strong>${vkiKategori}</strong> kategorisindesiniz.<div class="formula">${vkiFormulaText}</div>`);
}

function hesaplaKreatin() {
    const result = validateInputAndGetResultDiv("k_kilo", "kreatinSonuc");
    if (!result) return;

    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const idameMin = (kilo * 0.03).toFixed(1);
    const idameMax = (kilo * 0.05).toFixed(1);
    const asiriGereksinimMin = (kilo * 0.05).toFixed(1);
    const asiriGereksinimMax = (kilo * 0.10).toFixed(1);
    const yuklemeDoz = (kilo * 0.3).toFixed(1);

    const content = `
        <div class="result-value">${idameMin} - ${idameMax} g/gün</div>
        <div class="interpretation">
            <p><strong>Günlük Kreatin Dozları:</strong></p>
            <p>- İdame Dozu: <b>${idameMin} – ${idameMax} gram</b> <span class="formula">(Kilonuzun her kilogramı için 0.03 - 0.05 gram)</span></p>
            <p>- Aşırı Gereksinim Dozu: <b>${asiriGereksinimMin} – ${asiriGereksinimMax} gram</b> <span class="formula">(Veganlar, yüksek kas kütlesine sahip bireyler için)</span></p>
            <p>- Yükleme Dozu: <b>${yuklemeDoz} gram</b> <span class="formula">(5-7 gün boyunca alınır)</span></p>
        </div>
    `;

    showResult(resultDiv, content);
}

function hesaplaBeta() {
    const result = validateInputAndGetResultDiv("b_kilo", "betaSonuc");
    if (!result) return;
    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const minDoz = (kilo * 0.065).toFixed(1);
    const maxDoz = (kilo * 0.080).toFixed(1);
    const content = `
        <div class="result-value">${minDoz} - ${maxDoz} g/gün</div>
        <div class="interpretation">
            <p class="formula">Kilonuzun her kilogramı için 0.065 - 0.080 gram.</p>
        </div>
    `;

    showResult(resultDiv, content);
}

function hesaplaSitrulin() {
    const result = validateInputAndGetResultDiv("s_kilo", "sitrulinSonuc");
    if (!result) return;
    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const minDoz = (kilo * 0.10).toFixed(1);
    const maxDoz = (kilo * 0.15).toFixed(1);
    const content = `
        <div class="result-value">${minDoz} - ${maxDoz} g/gün</div>
        <div class="interpretation">
            <p class="formula">Kilonuzun her kilogramı için 0.10 - 0.15 gram.</p>
        </div>
    `;

    showResult(resultDiv, content);
}

function hesaplaKarnitin() {
    const result = validateInputAndGetResultDiv("l_kilo", "karnitinSonuc");
    if (!result) return;
    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const minDozMg = (kilo * 15).toFixed(0);
    const maxDozMg = (kilo * 30).toFixed(0);

    const content = `
        <div class="result-value">${minDozMg} - ${maxDozMg} mg/gün</div>
        <div class="interpretation">
            <p>Kilonuzun her kilogramı için 15 - 30 mg.</p>
            <p>Genel kullanım 2 - 4 gram arasıdır.</p>
            <p>Min doz 1 gram, max doz günlük 4 gramdır.</p>
        </div>
    `;

    showResult(resultDiv, content);
}

function hesaplaKreatin() {
    const result = validateInputAndGetResultDiv("k_kilo", "kreatinSonuc");
    if (!result) return;

    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const idameMin = (kilo * 0.03).toFixed(1);
    const idameMax = (kilo * 0.05).toFixed(1);

    const content = `
        <div class="result-value">${idameMin} - ${idameMax} g/gün</div>
        <div class="interpretation">
            <p class="formula">Kilonuzun her kilogramı için 0.03 - 0.05 gram (idame dozu).</p>
        </div>
    `;

    showResult(resultDiv, content);
}

function hesaplaKafein() {
    const result = validateInputAndGetResultDiv("c_kilo", "kafeinSonuc");
    if (!result) return;
    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const alt = kilo * 3;
    const ust = kilo * 6;
    const content = `
        <div class="result-value">${alt.toFixed(0)} - ${ust.toFixed(0)} mg</div>
        <div class="interpretation">
            <p class="formula">Kilonuzun her kilogramı için 3 - 6 mg.</p>
        </div>
    `;

    showResult(resultDiv, content);
}

function hesaplaToplu() {
    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    const kiloInput = document.getElementById("toplu_kilo");
    const hedefInput = document.getElementById("toplu_hedef");
    const secilenler = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    const topluSonucDiv = document.getElementById("topluSonuc");

    const kilo = parseFloat(kiloInput.value);
    const hedef = hedefInput.value;

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

    let output = "<div class='result-value'>Toplu Supplement Önerileri</div><div class='interpretation'>";

    if (document.getElementById("chk_protein").checked) {
        if (!hedef) {
            document.getElementById('toplu_hedef_warning').textContent = "Protein için hedef seçimi gerekli.";
            isValid = false;
        } else {
            let min = 1.4,
                max = 1.8;
            if (hedef === "alma") {
                min = 1.6;
                max = 2.2;
            } else if (hedef === "verme") {
                min = 1.8;
                max = 2.4;
            }
            output += `<p><strong>Protein:</strong> ${(kilo * min).toFixed(1)} – ${(kilo * max).toFixed(1)} g/gün</p>`;
        }
    }

    if (!isValid) {
        showResult(topluSonucDiv, "Lütfen tüm gerekli alanları doğru şekilde doldurun.", false);
        return;
    }

    if (document.getElementById("chk_kreatin").checked) {
        const idameMin = (kilo * 0.03).toFixed(1);
        const idameMax = (kilo * 0.05).toFixed(1);
        output += `<p><strong>Kreatin:</strong> ${idameMin} – ${idameMax} g/gün (idame dozu)</p>`;
    }

    if (document.getElementById("chk_beta").checked) {
        const minDoz = (kilo * 0.065).toFixed(1);
        const maxDoz = (kilo * 0.080).toFixed(1);
        output += `<p><strong>Beta-Alanin:</strong> ${minDoz} – ${maxDoz} g/gün</p>`;
    }

    if (document.getElementById("chk_sitrulin").checked) {
        const minDoz = (kilo * 0.10).toFixed(1);
        const maxDoz = (kilo * 0.15).toFixed(1);
        output += `<p><strong>Sitrülin Malat:</strong> ${minDoz} – ${maxDoz} g/gün</p>`;
    }

    if (document.getElementById("chk_karnitin").checked) {
        const minDozMg = (kilo * 15).toFixed(0);
        const maxDozMg = (kilo * 30).toFixed(0);
        output += `<p><strong>L-Karnitin:</strong> ${minDozMg} – ${maxDozMg} mg/gün</p>`;
    }

    if (document.getElementById("chk_kafein").checked) {
        const alt = kilo * 3;
        const ust = kilo * 6;
        output += `<p><strong>Kafein:</strong> ${alt.toFixed(0)} – ${ust.toFixed(0)} mg (antrenman öncesi)</p>`;
    }

    output += "</div>";
    showResult(topluSonucDiv, output);
}

function hesaplaKreatininTahmini() {
    // Uyarı mesajlarını temizle
    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    // Giriş alanlarını al
    const genderInput = document.getElementById('gender');
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const fatInput = document.getElementById('fat');
    const waterInput = document.getElementById('water');
    const proteinInput = document.getElementById('protein');
    const creatineInput = document.getElementById('creatine');
    const activityInput = document.getElementById('activity');
    const lbmMethodInput = document.getElementById('lbmMethod');

    // Giriş değerlerini al ve parse et
    const gender = genderInput.value;
    const age = +ageInput.value;
    const weight = +weightInput.value;
    const height = +heightInput.value;
    const fat = +fatInput.value;
    const lbmMethod = lbmMethodInput.value;

    let isValid = true; // Giriş kontrolü için bayrak

    // Giriş doğrulama kontrolleri
    if (!gender) {
        document.getElementById('gender_warning').textContent = "Lütfen cinsiyetinizi seçin.";
        isValid = false;
    }
    if (isNaN(age) || age <= 0) {
        document.getElementById('age_warning').textContent = "Lütfen geçerli bir yaş girin.";
        isValid = false;
    }
    if (isNaN(weight) || weight <= 0) {
        document.getElementById('weight_warning').textContent = "Lütfen geçerli bir kilo girin.";
        isValid = false;
    }
    if (isNaN(height) || height <= 0) {
        document.getElementById('height_warning').textContent = "Lütfen geçerli bir boy girin.";
        isValid = false;
    }
    if ((lbmMethod === 'fat' || lbmMethod === 'both') && (isNaN(fat) || fat < 1 || fat >= 100)) { // Yağ oranı %1-99 arası olmalı
        document.getElementById('fat_warning').textContent = "Yağ oranı %1-99 arasında olmalıdır.";
        isValid = false;
    }

    // Sonuç kartı elementlerini al
    const kreatininResultCard = document.getElementById('kreatininResultCard');
    const kreatininInterpretation = document.getElementById('kreatininInterpretation');
    const kreatininResultValue = document.getElementById('kreatininResultValue');

    // Geçersiz giriş durumunda uyarı göster ve fonksiyondan çık
    if (!isValid) {
        kreatininResultValue.textContent = "0.00 - 0.00 mg/dL";
        kreatininInterpretation.textContent = "Lütfen tüm gerekli alanları doğru şekilde doldurun.";
        kreatininResultCard.style.display = 'block';
        document.getElementById('kreatininResultFat').style.display = 'none';
        document.getElementById('kreatininResultBoer').style.display = 'none';
        return;
    }

    // Giriş değerlerini al veya varsayılan ata
    const water = +waterInput.value || 1.8; // Günlük su miktarı Litre olarak (varsayılan 1.8L)
    const protein = +proteinInput.value || 80; // Günlük protein alımı gram olarak (varsayılan 80g)
    const creatine = +creatineInput.value || 0; // Kreatin takviyesi gram olarak (varsayılan 0g)
    const activity = +activityInput.value || 2; // Egzersiz seviyesi (1-10 arası, 1 sedanter, 10 çok aktif)

    // Yağsız Vücut Kütlesi (LBM) hesaplamaları
    const lbmFat = !isNaN(fat) ? weight * (1 - fat / 100) : null;
    const lbmBoer = (gender === 'male') ? (0.407 * weight) + (0.267 * height) - 19.20 : (0.252 * weight) + (0.473 * height) - 48.30;

    // --- TEMEL KATSAYILAR ---
    // Ayarlanmış Temel Kreatinin Değerleri (Minimumlar Artırıldı)
    const baseMinCreatinine = (gender === 'male') ? 0.50 : 0.35; // Artırıldı
    const baseMaxCreatinine = (gender === 'male') ? 0.55 : 0.40;

    // Ayarlanmış LBM'nin kreatinin üzerindeki temel doğrusal etkisi (mg/dL / kg LBM) - Minimum Artırıldı
    const lbmMinCoef = (gender === 'male') ? 0.006 : 0.005; // Artırıldı
    const lbmMaxCoef = (gender === 'male') ? 0.008 : 0.007;

    // Kreatin takviyesinin logaritmik etkisi (mg/dL / log(gram+1)) - Minimum Artırıldı
    const logCreatineMinFactor = 0.030; // Artırıldı
    const logCreatineMaxFactor = 0.065;

    // Protein alımının logaritmik etkisi (mg/dL / log(gram+1)) - Minimum Artırıldı
    const logProteinMinFactor = 0.004; // Artırıldı
    const logProteinMaxFactor = 0.008;

    // --- ETKİ HESAPLAMALARI ---
    let actMinEffect = 0;
    let actMaxEffect = 0;
    // Egzersiz seviyesinin doğrusal etkisi (mg/dL) - Minimum Artırıldı
    if (activity >= 8) { // Sizin gibi yüksek spor yapanlar (8-10)
        actMinEffect = 0.015; // Artırıldı
        actMaxEffect = 0.025;
    } else if (activity >= 5) { // Orta aktifler (5-7)
        actMinEffect = 0.005;
        actMaxEffect = 0.015;
    } else if (activity >= 2) { // Hafif aktifler (2-4)
        actMinEffect = 0.001;
        actMaxEffect = 0.005;
    } else { // Sedanterler (1)
        actMinEffect = 0.000;
        actMaxEffect = 0.000;
    }

    // Su tüketimi ayarlaması (doğrusal)
    let waterAdjustmentMin = 0;
    let waterAdjustmentMax = 0;
    if (water < 1.0) { // Çok az su
        waterAdjustmentMin = 0.04;
        waterAdjustmentMax = 0.08;
    } else if (water >= 1.0 && water < 1.8) { // Az su
        waterAdjustmentMin = 0.01;
        waterAdjustmentMax = 0.03;
    } else if (water > 2.5) { // Çok fazla su
        waterAdjustmentMin = -0.05;
        waterAdjustmentMax = -0.02;
    }

    // Yaş ayarlaması (Anabolik/Katabolik yaklaşıma göre)
    let ageAdjustmentMin = 0;
    let ageAdjustmentMax = 0;
    if (age >= 45) { // Katabolik dönem: Kreatinin düşer
        const ageFactor = (age - 45) / 10;
        ageAdjustmentMin = -0.02 * ageFactor;
        ageAdjustmentMax = -0.01 * ageFactor;
    } else if (age >= 30) { // Denge dönemi: Çok hafif düşüş veya sabit
        const ageFactor = (age - 30) / 10;
        ageAdjustmentMin = -0.008 * ageFactor;
        ageAdjustmentMax = 0.00;
    }

    // Ana hesaplama fonksiyonu (LBM'e göre)
    const getValue = (lbm) => {
        // Kreatin ve protein için logaritmik etki hesaplaması
        const creatineEffectMin = Math.log(creatine + 1) * logCreatineMinFactor;
        const creatineEffectMax = Math.log(creatine + 1) * logCreatineMaxFactor;

        const proteinEffectMin = Math.log(protein + 1) * logProteinMinFactor;
        const proteinEffectMax = Math.log(protein + 1) * logProteinMaxFactor;

        // Tüm minimum ve maksimum etkileri topla (temel kreatinin dahil)
        const minE = baseMinCreatinine + (lbm * lbmMinCoef) + creatineEffectMin + proteinEffectMin + actMinEffect + waterAdjustmentMin + ageAdjustmentMin;
        const maxE = baseMaxCreatinine + (lbm * lbmMaxCoef) + creatineEffectMax + proteinEffectMax + actMaxEffect + waterAdjustmentMax + ageAdjustmentMax;

        // Kreatinin alt sınırını ve aralık genişliğini koru (çok düşük fizyolojik alt sınırlar)
        const finalMin = Math.max(minE, (gender === 'male' ? 0.40 : 0.20)); // Bu sabit sınır hala çok düşükse, hesaplanan minE daha baskın olacak.
        const finalMax = Math.max(maxE, finalMin + 0.15); // Minimum aralık genişliği 0.15 mg/dL

        return [finalMin.toFixed(2), finalMax.toFixed(2)];
    };

    let displayText = '';
    document.getElementById('kreatininResultFat').style.display = 'none';
    document.getElementById('kreatininResultBoer').style.display = 'none';

    // Seçilen LBM yöntemine göre sonucu göster
    if (lbmMethod === 'fat' && lbmFat !== null) {
        const [min, max] = getValue(lbmFat);
        displayText = `${min} - ${max} mg/dL`;
        document.getElementById('kreatininResultFat').style.display = 'block';
        document.getElementById('kreatininValueFat').textContent = displayText;
        kreatininInterpretation.textContent = 'Bu tahmini aralık, yağ oranınıza göre beklenen kreatinin seviyelerini gösterir.';
    } else if (lbmMethod === 'boer') {
        const [min, max] = getValue(lbmBoer);
        displayText = `${min} - ${max} mg/dL`;
        document.getElementById('kreatininResultBoer').style.display = 'block';
        document.getElementById('kreatininValueBoer').textContent = displayText;
        kreatininInterpretation.textContent = 'Bu tahmini aralık, Boer formülüyle hesaplanan LBM\'ye göre beklenen kreatinin seviyelerini gösterir.';
    } else if (lbmMethod === 'both' && lbmFat !== null) {
        const [minFat, maxFat] = getValue(lbmFat);
        const [minBoer, maxBoer] = getValue(lbmBoer);
        document.getElementById('kreatininResultFat').style.display = 'block';
        document.getElementById('kreatininResultBoer').style.display = 'block';
        document.getElementById('kreatininValueFat').textContent = `${minFat} - ${maxFat} mg/dL`;
        document.getElementById('kreatininValueBoer').textContent = `${minBoer} - ${maxBoer} mg/dL`;
        displayText = 'Her iki yöntem aşağıda listelendi';
        kreatininInterpretation.textContent = 'Bu tahmini aralıklar, farklı LBM hesaplama yöntemlerine göre beklenen kreatinin seviyelerini gösterir.';
    } else {
        // Eğer yağ oranı girişi yoksa veya geçersizse Boer'i varsayılan olarak kullan
        const [min, max] = getValue(lbmBoer);
        displayText = `${min} - ${max} mg/dL`;
        document.getElementById('kreatininResultBoer').style.display = 'block';
        document.getElementById('kreatininValueBoer').textContent = displayText;
        kreatininInterpretation.textContent = 'Yağ oranı girilmediği için tahmin Boer formülüne göre yapılmıştır. Bu tahmini aralık, vücut kompozisyonunuza göre beklenen kreatinin seviyelerini gösterir.';
    }

    kreatininResultValue.textContent = displayText;
    kreatininResultCard.style.display = 'block';
}
