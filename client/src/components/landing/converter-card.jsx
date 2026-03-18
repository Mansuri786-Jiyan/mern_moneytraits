import { ArrowRightLeft } from "lucide-react";

export default function ConverterCard({
  amount,
  isLoading,
  error,
  result,
  onAmountChange,
  onSubmit,
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <ArrowRightLeft className="h-5 w-5 text-primary" />
        Dollar to Rupees Converter
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm font-medium">Amount in USD ($)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          placeholder="Enter USD amount"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {isLoading ? "Converting..." : "Convert to INR"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      {result ? (
        <div className="mt-5 rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Conversion Result</p>
          <p className="mt-1 text-2xl font-bold text-primary">₹ {result.convertedAmount.toLocaleString("en-IN")}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {result.amount} USD × {result.rate} = {result.convertedAmount} INR
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Source: {result.source} {result.isFallback ? "(fallback rate)" : "(live rate)"}
          </p>
        </div>
      ) : null}
    </section>
  );
}
