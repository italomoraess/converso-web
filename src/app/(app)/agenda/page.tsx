'use client';

import { useState } from 'react';
import { Icon } from '@/lib/icon';
import { CV, clienteById, type Evento } from '@/lib/data';
import { WButton, WCard, Avatar, Badge, WModal } from '@/components/ui';
import { useStore } from '@/components/app/store';

/* ─── WNovoAgendamento ──────────────────────────────────────────────────── */

function WNovoAgendamento({
  day,
  onClose,
  onSave,
}: {
  day: number;
  onClose: () => void;
  onSave: (ev: Omit<Evento, 'id'>) => void;
}) {
  const [cliente, setCliente] = useState('c1');
  const [tipo, setTipo] = useState('Consultoria');
  const [hora, setHora] = useState('10:00');
  const horas = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <WModal onClose={onClose} title={`Novo agendamento · ${day} de junho`} width={520}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Cliente</div>
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            {CV.clientes.map((c) => {
              const on = cliente === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCliente(c.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px 6px 6px',
                    borderRadius: 99,
                    cursor: 'pointer',
                    border: 'none',
                    background: on ? 'var(--primary-soft)' : 'var(--bg)',
                    boxShadow: on ? 'inset 0 0 0 1.5px var(--primary)' : 'none',
                  }}
                >
                  <Avatar ini={c.ini} cor={c.cor} size={26} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: on ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {c.nome.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Tipo de serviço</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.keys(CV.catColor).map((c) => {
              const on = tipo === c;
              const cc = CV.catColor[c];
              return (
                <button
                  key={c}
                  onClick={() => setTipo(c)}
                  style={{
                    padding: '9px 14px',
                    borderRadius: 99,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 700,
                    fontSize: 13,
                    border: 'none',
                    background: on ? `color-mix(in srgb, ${cc} 15%, transparent)` : 'var(--bg)',
                    color: on ? cc : 'var(--text-muted)',
                    boxShadow: on ? `inset 0 0 0 1.5px ${cc}` : 'none',
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Horário</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {horas.map((h) => (
              <button
                key={h}
                onClick={() => setHora(h)}
                className="cv-num"
                style={{
                  padding: '10px 15px',
                  borderRadius: 'var(--r-md)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 700,
                  fontSize: 13.5,
                  border: 'none',
                  background: hora === h ? 'var(--primary)' : 'var(--bg)',
                  color: hora === h ? '#fff' : 'var(--text-muted)',
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, padding: '16px 24px', borderTop: '1px solid var(--border)', justifyContent: 'flex-end' }}>
        <WButton variant="outline" onClick={onClose}>Cancelar</WButton>
        <WButton
          icon="calCheck"
          onClick={() =>
            onSave({
              dia: day,
              hora,
              tipo,
              cliente,
              titulo: `${tipo} — ${clienteById(cliente).nome.split(' ')[0]}`,
              dur: 60,
              status: 'confirmado',
            })
          }
        >
          Confirmar
        </WButton>
      </div>
    </WModal>
  );
}

/* ─── AgendaPage ────────────────────────────────────────────────────────── */

const YEAR = 2026;
const MONTH = 5;

const WEEKDAYS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function AgendaPage() {
  const { agenda, addEvent } = useStore();

  const [sel, setSel] = useState(4);
  const [novo, setNovo] = useState(false);

  const first = new Date(YEAR, MONTH, 1).getDay();
  const days = new Date(YEAR, MONTH + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const evDay = (d: number): Evento[] =>
    agenda.filter((a: Evento) => a.dia === d).sort((a: Evento, b: Evento) => a.hora.localeCompare(b.hora));

  const selEvents = evDay(sel);

  return (
    <div style={{ padding: 28, height: '100%', display: 'flex', gap: 20, minHeight: 0 }}>
      {/* calendar */}
      <WCard pad={0} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <h3 style={{ fontSize: 19, fontWeight: 800, fontFamily: 'var(--font-display)' }}>Junho 2026</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="chevL" size={18} color="var(--text-muted)" />
              </button>
              <button style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="chevR" size={18} color="var(--text-muted)" />
              </button>
            </div>
          </div>
          <WButton size="sm" variant="soft" icon="calendar" onClick={() => setSel(4)}>Hoje</WButton>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid var(--border)' }}>
          {CV.diasSemana.map((d) => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 800, color: 'var(--text-subtle)', padding: '10px 0', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {d}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridAutoRows: '1fr' }}>
          {cells.map((d, i) => {
            if (!d) {
              return (
                <div
                  key={i}
                  style={{
                    borderRight: i % 7 !== 6 ? '1px solid var(--border)' : 'none',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--surface-2)',
                  }}
                />
              );
            }
            const isToday = d === 4;
            const isSel = d === sel;
            const evs = evDay(d);
            return (
              <div
                key={i}
                onClick={() => setSel(d)}
                style={{
                  borderRight: i % 7 !== 6 ? '1px solid var(--border)' : 'none',
                  borderBottom: '1px solid var(--border)',
                  padding: 8,
                  cursor: 'pointer',
                  minHeight: 84,
                  background: isSel ? 'var(--primary-soft)' : 'transparent',
                  transition: 'background .12s',
                  position: 'relative',
                }}
              >
                <div
                  className="cv-num"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13.5,
                    fontWeight: isToday || isSel ? 800 : 600,
                    background: isToday ? 'var(--primary)' : 'transparent',
                    color: isToday ? '#fff' : isSel ? 'var(--primary)' : 'var(--text)',
                    marginBottom: 4,
                  }}
                >
                  {d}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {evs.slice(0, 2).map((e: Evento) => {
                    const cc = CV.catColor[e.tipo] || 'var(--primary)';
                    return (
                      <div
                        key={e.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: 11,
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          background: `color-mix(in srgb, ${cc} 12%, transparent)`,
                          borderRadius: 5,
                          padding: '2px 6px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: 99, background: cc, flexShrink: 0 }} />
                        <span className="cv-num">{e.hora}</span> {e.titulo.split(' — ')[0]}
                      </div>
                    );
                  })}
                  {evs.length > 2 && (
                    <div style={{ fontSize: 10.5, color: 'var(--text-subtle)', fontWeight: 700, paddingLeft: 4 }}>
                      +{evs.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </WCard>

      {/* day panel */}
      <div style={{ width: 330, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <WCard pad={22} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
              {WEEKDAYS_FULL[new Date(YEAR, MONTH, sel).getDay()]}
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: -0.4 }}>
              {sel} de junho
            </h3>
            <div style={{ fontSize: 13, color: 'var(--text-subtle)', fontWeight: 600, marginTop: 2 }}>
              {selEvents.length} {selEvents.length === 1 ? 'compromisso' : 'compromissos'}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {selEvents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-subtle)' }}>
                <Icon name="calendar" size={34} color="var(--text-subtle)" />
                <div style={{ fontWeight: 700, marginTop: 10, color: 'var(--text-muted)' }}>Dia livre</div>
              </div>
            )}
            {selEvents.map((a: Evento) => {
              const cl = clienteById(a.cliente);
              const cc = CV.catColor[a.tipo] || 'var(--primary)';
              return (
                <div
                  key={a.id}
                  style={{ padding: 14, borderRadius: 'var(--r-md)', background: 'var(--bg)', borderLeft: `3px solid ${cc}` }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{a.titulo}</div>
                    <Badge color={a.status === 'confirmado' ? 'var(--money)' : 'var(--warn)'} dot>
                      {a.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                    </Badge>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 11, fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>
                    <span className="cv-num" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Icon name="clock" size={14} /> {a.hora} · {a.dur}min
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                    <Avatar ini={cl.ini} cor={cl.cor} size={24} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)' }}>{cl.nome}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <WButton full icon="plus" style={{ marginTop: 16 }} onClick={() => setNovo(true)}>
            Novo agendamento
          </WButton>
        </WCard>
      </div>

      {novo && (
        <WNovoAgendamento
          day={sel}
          onClose={() => setNovo(false)}
          onSave={(ev) => {
            addEvent(ev);
            setNovo(false);
          }}
        />
      )}
    </div>
  );
}
