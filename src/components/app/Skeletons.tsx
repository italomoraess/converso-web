'use client';
/* CONVERSO Web — skeletons de carregamento que espelham o layout de cada tela,
   evitando "pulos" de layout enquanto os dados reais chegam do crm-api. */
import { WCard, Skeleton } from '@/components/ui';

const arr = (n: number) => Array.from({ length: n });

/* ── KPIs (4 cards) — usado por Dashboard e Empresa/Visão ─────────────── */
function KpiRow({ spark = true }: { spark?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
      {arr(4).map((_, i) => (
        <WCard key={i} pad={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Skeleton w={40} h={40} r={12} />
            <Skeleton w={50} h={20} r={99} />
          </div>
          <Skeleton w={120} h={28} style={{ marginTop: 16 }} />
          <Skeleton w={90} h={13} style={{ marginTop: 8 }} />
          {spark && <Skeleton w="100%" h={34} style={{ marginTop: 10 }} />}
        </WCard>
      ))}
    </div>
  );
}

function ChartCard() {
  return (
    <WCard pad={24}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <Skeleton w={90} h={17} />
          <Skeleton w={120} h={12} style={{ marginTop: 8 }} />
        </div>
        <Skeleton w={120} h={22} />
      </div>
      <Skeleton w="100%" h={190} r={12} />
    </WCard>
  );
}

function BarsCard({ rows = 5 }: { rows?: number }) {
  return (
    <WCard pad={24} style={{ display: 'flex', flexDirection: 'column' }}>
      <Skeleton w={140} h={17} />
      <Skeleton w={100} h={12} style={{ marginTop: 8, marginBottom: 18 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {arr(rows).map((_, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <Skeleton w={120} h={13} />
              <Skeleton w={60} h={13} />
            </div>
            <Skeleton w="100%" h={7} r={99} />
          </div>
        ))}
      </div>
    </WCard>
  );
}

function ListCard({ rows = 4 }: { rows?: number }) {
  return (
    <WCard pad={24}>
      <Skeleton w={150} h={17} style={{ marginBottom: 18 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {arr(rows).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 14px', borderRadius: 'var(--r-md)', background: 'var(--bg)' }}>
            <Skeleton w={40} h={40} r={11} />
            <div style={{ flex: 1 }}>
              <Skeleton w="70%" h={14} />
              <Skeleton w="40%" h={12} style={{ marginTop: 6 }} />
            </div>
            <Skeleton w={60} h={16} />
          </div>
        ))}
      </div>
    </WCard>
  );
}

export function DashboardSkeleton() {
  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <KpiRow />
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18 }}>
        <ChartCard />
        <BarsCard />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <ListCard />
        <ListCard />
      </div>
    </div>
  );
}

/* ── Tabela (Serviços, Clientes, Autônomos) ───────────────────────────── */
export function TableSkeleton({ toolbar = true, rows = 7 }: { toolbar?: boolean; rows?: number }) {
  return (
    <div style={{ padding: 28 }}>
      {toolbar && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <Skeleton w={280} h={42} r={12} />
          <div style={{ flex: 1, display: 'flex', gap: 7 }}>
            {arr(4).map((_, i) => (
              <Skeleton key={i} w={80} h={34} r={99} />
            ))}
          </div>
          <Skeleton w={160} h={42} r={12} />
        </div>
      )}
      <WCard pad={0} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '15px 20px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
          <Skeleton w={90} h={11} />
          <div style={{ flex: 1 }} />
          {arr(3).map((_, i) => (
            <Skeleton key={i} w={70} h={11} />
          ))}
        </div>
        {arr(rows).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, flex: 2, minWidth: 0 }}>
              <Skeleton w={40} h={40} r={11} />
              <div style={{ flex: 1 }}>
                <Skeleton w="55%" h={14} />
                <Skeleton w="35%" h={12} style={{ marginTop: 6 }} />
              </div>
            </div>
            <Skeleton w={90} h={14} />
            <Skeleton w={50} h={14} />
            <Skeleton w={50} h={14} />
            <Skeleton w={34} h={34} r={9} />
          </div>
        ))}
      </WCard>
    </div>
  );
}

/* ── Funil (Kanban) ───────────────────────────────────────────────────── */
export function FunilSkeleton() {
  return (
    <div style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        {arr(2).map((_, i) => (
          <WCard key={i} pad={18} style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 210 }}>
            <Skeleton w={42} h={42} r={12} />
            <div>
              <Skeleton w={90} h={19} />
              <Skeleton w={70} h={12} style={{ marginTop: 6 }} />
            </div>
          </WCard>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', gap: 16, minHeight: 0 }}>
        {arr(5).map((_, col) => (
          <div key={col} style={{ flex: 1, minWidth: 248, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
              <Skeleton w={10} h={10} r={99} />
              <Skeleton w={80} h={15} />
            </div>
            <Skeleton w={60} h={12} style={{ marginBottom: 12 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11, padding: 10, borderRadius: 'var(--r-lg)', background: 'var(--bg)' }}>
              {arr(2 + (col % 3)).map((_, i) => (
                <WCard key={i} pad={15}>
                  <Skeleton w="85%" h={14} />
                  <Skeleton w="50%" h={12} style={{ marginTop: 6 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 13 }}>
                    <Skeleton w={70} h={26} r={99} />
                    <Skeleton w={56} h={14} />
                  </div>
                </WCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Agenda (calendário + painel do dia) ──────────────────────────────── */
export function AgendaSkeleton() {
  return (
    <div style={{ padding: 28, height: '100%', display: 'flex', gap: 20, minHeight: 0 }}>
      <WCard pad={0} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <Skeleton w={170} h={22} />
          <Skeleton w={72} h={32} r={10} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
          {arr(7).map((_, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton w={26} h={11} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridAutoRows: '1fr' }}>
          {arr(35).map((_, i) => (
            <div key={i} style={{ borderRight: i % 7 !== 6 ? '1px solid var(--border)' : 'none', borderBottom: '1px solid var(--border)', padding: 8, minHeight: 84 }}>
              <Skeleton w={26} h={26} r={8} />
            </div>
          ))}
        </div>
      </WCard>
      <div style={{ width: 330, flexShrink: 0 }}>
        <WCard pad={22} style={{ height: '100%' }}>
          <Skeleton w={100} h={13} />
          <Skeleton w={160} h={24} style={{ marginTop: 8 }} />
          <Skeleton w={110} h={13} style={{ marginTop: 8, marginBottom: 18 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {arr(3).map((_, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 'var(--r-md)', background: 'var(--bg)' }}>
                <Skeleton w="80%" h={14} />
                <Skeleton w={120} h={12} style={{ marginTop: 11 }} />
                <Skeleton w={150} h={20} r={99} style={{ marginTop: 10 }} />
              </div>
            ))}
          </div>
        </WCard>
      </div>
    </div>
  );
}

/* ── Empresa / Visão geral (mesma malha do Dashboard, sem sparkline) ──── */
export function EmpresaVisaoSkeleton() {
  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <KpiRow spark={false} />
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18 }}>
        <ChartCard />
        <BarsCard />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <ListCard rows={3} />
        <ListCard rows={4} />
      </div>
    </div>
  );
}

/* ── Empresa / Desempenho ─────────────────────────────────────────────── */
export function DesempenhoSkeleton() {
  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <WCard pad={24}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Skeleton w={108} h={108} r={99} />
          <div style={{ flex: 1 }}>
            <Skeleton w={180} h={18} />
            <Skeleton w={240} h={30} style={{ marginTop: 8 }} />
            <Skeleton w="70%" h={14} style={{ marginTop: 8 }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <Skeleton w={70} h={40} />
            <Skeleton w={60} h={13} style={{ marginTop: 6 }} />
          </div>
        </div>
      </WCard>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>
        <WCard pad={24}>
          <Skeleton w={160} h={17} style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {arr(6).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                <Skeleton w={28} h={28} r={8} />
                <Skeleton w={36} h={36} r={99} />
                <div style={{ flex: 1 }}>
                  <Skeleton w="45%" h={14} />
                  <Skeleton w="100%" h={6} r={99} style={{ marginTop: 8 }} />
                </div>
                <Skeleton w={60} h={14} />
              </div>
            ))}
          </div>
        </WCard>
        <BarsCard />
      </div>
    </div>
  );
}
