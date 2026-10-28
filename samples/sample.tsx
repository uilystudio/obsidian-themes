import { useMemo, useState } from 'react';

type Tone = 'cream' | 'sand';

interface ThemeCardProps {
  title: string;
  tone?: Tone;
  price: number;
}

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(amount);

export function ThemeCard({ title, tone = 'cream', price }: ThemeCardProps) {
  const [selected, setSelected] = useState(false);
  const label = useMemo(() => `${title} · ${formatAmount(price)}`, [title, price]);

  // Calm surfaces; high readability; minimal semantic contrast.
  return (
    <button className={`card card--${tone}`} onClick={() => setSelected(!selected)}>
      <span className="card__label">{label}</span>
      <small>{selected ? 'Selected' : 'Explore'}</small>
    </button>
  );
}
