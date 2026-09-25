// Fitness-hesaplama/js/arjininHesaplayici.js
// Bu dosyanın çalışabilmesi için common.js'in HTML'de önce yüklenmesi gerekir.

function hesaplaArjinin() {
  const result = validateInputAndGetResultDiv("a_kilo", "arjininSonuc");
  if (!result) return;

  const kilo = result.value;
  const resultDiv = result.resultDiv;

  // Doz aralığı: 0.04 – 0.08 g/kg (örn. 70 kg için 2.8–5.6 g)
  const minDoz = (kilo * 0.075).toFixed(1);
  const maxDoz = (kilo * 0.100).toFixed(1);

  const content = `
    <div class="result-value">${minDoz} - ${maxDoz} g/tek doz (antrenman öncesi)</div>
    <div class="interpretation">
      <p class="formula">Kilonuzun her kilogramı için <strong>0.075 - 0.100 gram</strong>.</p>
    </div>
  `;

  showResult(resultDiv, content);
}