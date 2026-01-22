import { useState, useMemo } from "react";
import { Calculator, TrendingUp, Plus, Percent, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CalculationResult {
  original: number;
  afterImprovement: number;
  improvementAmount: number;
  afterPercentage: number;
  percentageAmount: number;
  final: number;
  flatIncrease: number;
  totalIncrease: number;
  totalPercentageIncrease: number;
  // Second period
  secondPeriodIncrease: number;
  secondPeriodFinal: number;
  secondPeriodTotalIncrease: number;
  secondPeriodTotalPercentage: number;
}

const SalaryCalculator = () => {
  const [hourlyWage, setHourlyWage] = useState<string>("");

  const result = useMemo<CalculationResult | null>(() => {
    const wage = parseFloat(hourlyWage.replace(",", "."));
    if (isNaN(wage) || wage <= 0) return null;

    // Step 1: İyileştirme (140 TL altındakilere 10 TL, max 140 TL)
    let afterImprovement = wage;
    let improvementAmount = 0;

    if (wage < 140) {
      improvementAmount = Math.min(10, 140 - wage);
      afterImprovement = wage + improvementAmount;
    }

    // Step 2: %20 zam
    const percentageAmount = afterImprovement * 0.2;
    const afterPercentage = afterImprovement + percentageAmount;

    // Step 3: Seyyanen 17.61 TL
    const flatIncrease = 17.61;
    const final = afterPercentage + flatIncrease;

    const totalIncrease = final - wage;
    const totalPercentageIncrease = ((final - wage) / wage) * 100;

    // Second period: %13 increase
    const secondPeriodIncrease = final * 0.13;
    const secondPeriodFinal = final + secondPeriodIncrease;
    const secondPeriodTotalIncrease = secondPeriodFinal - wage;
    const secondPeriodTotalPercentage = ((secondPeriodFinal - wage) / wage) * 100;

    return {
      original: wage,
      afterImprovement,
      improvementAmount,
      afterPercentage,
      percentageAmount,
      final,
      flatIncrease,
      totalIncrease,
      totalPercentageIncrease,
      secondPeriodIncrease,
      secondPeriodFinal,
      secondPeriodTotalIncrease,
      secondPeriodTotalPercentage,
    };
  }, [hourlyWage]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-primary mb-2">
            Türk Metal Sendikası
          </h1>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <Calculator className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            TİS2026 Zam Hesaplama Aracı
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Toplu iş sözleşmesi zam miktarını hesaplayın
          </p>
          
          {/* Share Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Paylaş
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem
                onClick={() => {
                  const text = "TİS2026 Zam Hesaplama Aracı - Türk Metal Sendikası";
                  const url = window.location.href;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
                }}
              >
                <span className="text-green-600 mr-2">📱</span> WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const text = "TİS2026 Zam Hesaplama Aracı - Türk Metal Sendikası";
                  const url = window.location.href;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
                }}
              >
                <span className="mr-2">𝕏</span> X (Twitter)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const url = window.location.href;
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
                }}
              >
                <span className="text-blue-600 mr-2">📘</span> Facebook
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                <span className="mr-2">📋</span> Linki Kopyala
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Calculator Card */}
        <div className="calculator-card">
          {/* Input */}
          <div className="mb-6">
            <label htmlFor="wage" className="input-label">
              Mevcut Saat Ücretiniz
            </label>
            <div className="relative">
              <input
                id="wage"
                type="text"
                inputMode="decimal"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(e.target.value)}
                placeholder="Örn: 125,50"
                className="calculator-input pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                TL
              </span>
            </div>
            {result && (
              <div className="mt-2 text-sm text-muted-foreground">
                Eski Maaş: <span className="font-semibold text-foreground">{formatCurrency(result.original * 225)} TL</span> <span className="text-xs">(×225 saat)</span>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
              {/* Calculation Steps */}
              <div className="space-y-3">
                {/* Step 1 - İyileştirme */}
                {result.improvementAmount > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl">
                    <div className="step-badge">1</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span>İyileştirme</span>
                      </div>
                      <div className="font-semibold text-foreground">
                        +{formatCurrency(result.improvementAmount)} TL →{" "}
                        {formatCurrency(result.afterImprovement)} TL
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 - %20 Zam */}
                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl">
                  <div className="step-badge">
                    {result.improvementAmount > 0 ? "2" : "1"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                      <Percent className="w-3.5 h-3.5" />
                      <span>%20 Zam</span>
                    </div>
                    <div className="font-semibold text-foreground">
                      +{formatCurrency(result.percentageAmount)} TL →{" "}
                      {formatCurrency(result.afterPercentage)} TL
                    </div>
                  </div>
                </div>

                {/* Step 3 - Seyyanen */}
                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl">
                  <div className="step-badge">
                    {result.improvementAmount > 0 ? "3" : "2"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Seyyanen Artış</span>
                    </div>
                    <div className="font-semibold text-foreground">
                      +{formatCurrency(result.flatIncrease)} TL
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Result */}
              <div className="result-highlight mt-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Yeni Saat Ücretiniz
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(result.final)} TL
                  </div>
                  <div className="mt-2 text-sm text-accent font-medium">
                    Toplam artış: +{formatCurrency(result.totalIncrease)} TL
                    <span className="text-muted-foreground"> (</span>%
                    {result.totalPercentageIncrease.toFixed(1)}
                    <span className="text-muted-foreground">)</span>
                  </div>
                  
                  {/* Monthly Salary */}
                  <div className="mt-4 pt-4 border-t border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">
                      Tahmini Aylık Maaş <span className="text-xs">(×225 saat)</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(result.final * 225)} TL
                    </div>
                    <div className="mt-2 text-sm text-accent font-medium">
                      Fark: +{formatCurrency((result.final - result.original) * 225)} TL
                    </div>
                  </div>
                </div>
              </div>

              {/* Toplu Ödenecek Fark */}
              <div className="result-highlight mt-4" style={{ background: 'linear-gradient(135deg, hsl(45 90% 50% / 0.1), hsl(35 90% 55% / 0.1))' }}>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-3">
                    <span>Toplu Ödenecek Fark</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    4 Aylık Maaş Farkı
                  </div>
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {formatCurrency((result.final - result.original) * 225 * 4)} TL
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    ({formatCurrency((result.final - result.original) * 225)} TL × 4 ay)
                  </div>
                </div>
              </div>

              {/* Second Period - 6 Month */}
              <div className="result-highlight mt-4" style={{ background: 'linear-gradient(135deg, hsl(160 60% 45% / 0.1), hsl(210 80% 45% / 0.1))' }}>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full text-xs font-medium text-accent mb-3">
                    <span>2. Altı Ay (Mart zammı)</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
                    <Percent className="w-3.5 h-3.5" />
                    <span>%13 Zam</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Yeni Saat Ücretiniz
                  </div>
                  <div className="text-3xl font-bold text-accent">
                    {formatCurrency(result.secondPeriodFinal)} TL
                  </div>
                  <div className="mt-2 text-sm text-primary font-medium">
                    Dönem artışı: +{formatCurrency(result.secondPeriodIncrease)} TL
                  </div>
                  
                  {/* Monthly Salary - Second Period */}
                  <div className="mt-4 pt-4 border-t border-accent/20">
                    <div className="text-sm text-muted-foreground mb-1">
                      Tahmini Aylık Maaş <span className="text-xs">(×225 saat)</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(result.secondPeriodFinal * 225)} TL
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Başlangıçtan toplam artış: %{result.secondPeriodTotalPercentage.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          {!result && (
            <div className="bg-secondary/30 rounded-xl p-4 text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Hesaplama kuralları:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>140 TL altındaki ücretlere 10 TL iyileştirme (max 140 TL)</li>
                <li>Tüm ücretlere %20 zam</li>
                <li>Seyyanen 17,61 TL ekleme</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Toplu İş Sözleşmesi Raporu'na göre hesaplanmıştır.
        </p>
      </div>
    </div>
  );
};

export default SalaryCalculator;
