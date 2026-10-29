import { useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDown, ArrowRight, Bike, CalendarDays, Check, ChevronDown, Clock3, Compass, Heart, MapPin, Menu, ShieldCheck, Star, Users, X } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [riders, setRiders] = useState('2 viajeros');
  const [searched, setSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [saved, setSaved] = useState<number[]>([]);
  const [booking, setBooking] = useState<Tour | null>(null);
  const [bookingDone, setBookingDone] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  type Tour = { id: number; city: string; title: string; detail: string; price: number; rating: string; reviews: number; image: string; category: string; badge?: string };
  const tours: Tour[] = [
    { id: 1, city: 'San Sebastián', title: 'La costa secreta de Donostia', detail: '3 h · Fácil · Grupo pequeño', price: 42, rating: '4,96', reviews: 128, image: '/donostia.jpg', category: 'Costa', badge: 'Favorito local' },
    { id: 2, city: 'Barcelona', title: 'Barcelona, antes de que despierte', detail: '2,5 h · Fácil · Desayuno incluido', price: 36, rating: '4,91', reviews: 204, image: '/barcelona.jpg', category: 'Ciudad' },
    { id: 3, city: 'Sevilla', title: 'Patios, naranjos y callejuelas', detail: '3 h · Muy fácil · Tapas al final', price: 39, rating: '4,98', reviews: 86, image: '/sevilla.jpg', category: 'Ciudad' },
    { id: 4, city: 'Girona', title: 'Pedalea entre viñedos y piedra', detail: '4 h · Moderado · Cata incluida', price: 58, rating: '4,93', reviews: 71, image: '/girona.jpg', category: 'Naturaleza' },
  ];
  const categories = ['Todos', 'Ciudad', 'Costa', 'Naturaleza'];
  const shownTours = useMemo(() => tours.filter((tour) => {
    const categoryMatch = activeCategory === 'Todos' || tour.category === activeCategory;
    const cityMatch = !searched || !destination || tour.city.toLowerCase().includes(destination.toLowerCase());
    return categoryMatch && cityMatch;
  }), [activeCategory, destination, searched]);

  const startBooking = (tour: Tour) => { setBooking(tour); setBookingDone(false); };
  const closeBooking = () => { setBooking(null); setBookingDone(false); };
  const runSearch = () => {
    setSearched(true);
    setActiveCategory('Todos');
    document.getElementById('experiencias')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="site-shell">
      <div className="announcement"><span className="announcement-dot" /> Historias locales, recorridos a tu ritmo <span className="announcement-divider">·</span> <a href="#como-funciona">Así de sencillo <ArrowRight size={13} /></a></div>
      <header className="nav-wrap">
        <a className="brand" href="#" aria-label="Rutas en Bici, inicio"><span className="brand-mark"><Bike size={21} strokeWidth={2.1} /></span><span>rutas<span className="brand-light">enbici</span><i>.</i></span></a>
        <nav className={mobileOpen ? 'main-nav nav-open' : 'main-nav'}>
          <a href="#experiencias" onClick={() => setMobileOpen(false)}>Explorar rutas</a><a href="#como-funciona" onClick={() => setMobileOpen(false)}>Cómo funciona</a><a href="#locales" onClick={() => setMobileOpen(false)}>Para guías locales</a>
        </nav>
        <div className="nav-actions"><a className="nav-login" href="#experiencias">Iniciar sesión</a><a className="nav-cta" href="#busqueda">Encuentra tu ruta <ArrowRight size={15} /></a></div>
        <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir menú">{mobileOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> VIAJAR SE SIENTE DISTINTO DESDE AQUÍ</div>
            <h1>La ciudad<br />es tuya <em>en bici.</em></h1>
            <p className="hero-lede">Menos mapas. Más momentos que no salen en la guía.</p>
            <p className="hero-description">Pedalea con quien conoce cada esquina. Descubre lugares con historia y reserva tu próxima pequeña gran aventura.</p>
            <div className="hero-proof"><div className="avatar-stack"><span>ML</span><span>JR</span><span>AC</span><span>+</span></div><div><strong>4,9 de 5</strong><span className="proof-stars">★★★★★</span><small>de viajeros que ya salieron a rodar</small></div></div>
            <a href="#busqueda" className="scroll-cue">EMPIEZA A EXPLORAR <ArrowDown size={14} /></a>
          </div>
          <div className="hero-image-wrap">
            <img className="hero-image" src="/coast-ride.jpg" alt="Dos ciclistas recorren una carretera costera entre verdes colinas" />
            <div className="image-shade" />
            <div className="hero-image-caption"><span className="caption-pin"><MapPin size={14} /></span><div><strong>La costa cantábrica</strong><small>Un desvío que merece la pena</small></div><span className="caption-index">01 / 04</span></div>
            <div className="floating-note"><span className="note-icon"><Compass size={18} /></span><div><strong>Sin prisa, sin perderte</strong><small>Guías locales, grupos pequeños</small></div></div>
            <div className="hero-stamp">SAL<br />A<br />RODAR</div>
          </div>
        </section>

        <section className="search-section" id="busqueda">
          <div className="search-heading"><span>01 — TU PRÓXIMA AVENTURA</span><p>¿Por dónde empezamos?</p></div>
          <form className="search-panel" onSubmit={(event) => { event.preventDefault(); runSearch(); }}>
            <label className="search-field destination-field"><span className="field-icon"><MapPin size={19} /></span><span className="field-content"><small>DESTINO</small><select value={destination} onChange={(event) => setDestination(event.target.value)} aria-label="Elige un destino"><option value="">¿A dónde vas?</option><option>San Sebastián</option><option>Barcelona</option><option>Sevilla</option><option>Girona</option></select></span><ChevronDown className="select-chevron" size={15} /></label>
            <label className="search-field"><span className="field-icon"><CalendarDays size={18} /></span><span className="field-content"><small>CUÁNDO</small><input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Fecha del tour" /></span></label>
            <label className="search-field"><span className="field-icon"><Users size={19} /></span><span className="field-content"><small>QUIÉNES</small><select value={riders} onChange={(event) => setRiders(event.target.value)} aria-label="Número de viajeros"><option>1 viajero</option><option>2 viajeros</option><option>3 viajeros</option><option>4 viajeros</option><option>5+ viajeros</option></select></span><ChevronDown className="select-chevron" size={15} /></label>
            <button className="search-button" type="submit">Buscar rutas <ArrowRight size={17} /></button>
          </form>
          <div className="search-reassurance"><span><ShieldCheck size={14} /> Reserva flexible</span><span>·</span><span>Sin cargos ocultos</span><span>·</span><span>Guías de verdad</span></div>
        </section>

        <section className="experiences section-wrap" id="experiencias">
          <div className="section-topline"><span>HECHAS PARA SENTIR EL LUGAR</span><span className="section-number">02 — 04</span></div>
          <div className="section-title-row"><div><h2>Un buen plan<br /><em>te encuentra.</em></h2><p>Rutas pequeñas, recuerdos grandes. Elegidas por quienes viven aquí.</p></div><a className="text-link" href="#explora">Ver todas las rutas <ArrowRight size={16} /></a></div>
          {searched && destination && <div className="search-result-note"><span className="result-marker" />Mostrando rutas para <strong>{destination}</strong>{date && <span> · {new Date(`${date}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>} <button onClick={() => { setDestination(''); setSearched(false); }}>Quitar filtro <X size={13} /></button></div>}
          <div className="category-row" id="explora">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={activeCategory === category ? 'category-chip active' : 'category-chip'}>{category}</button>)}</div>
          {shownTours.length ? <div className="tour-grid">{shownTours.map((tour) => <article className="tour-card" key={tour.id} data-testid={`card-tour-${tour.id}`}>
            <div className="tour-image-wrap"><img src={tour.image} alt="" className="tour-image" loading="lazy" />{tour.badge && <span className="tour-badge">{tour.badge}</span>}<button className={saved.includes(tour.id) ? 'save-tour saved' : 'save-tour'} onClick={() => setSaved((current) => current.includes(tour.id) ? current.filter((id) => id !== tour.id) : [...current, tour.id])} aria-label={saved.includes(tour.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'} data-testid={`button-save-${tour.id}`}><Heart size={17} fill={saved.includes(tour.id) ? 'currentColor' : 'none'} /></button><span className="image-location"><MapPin size={12} />{tour.city}</span></div>
            <div className="tour-body"><div className="tour-rating"><Star size={13} fill="currentColor" /><strong>{tour.rating}</strong><span>({tour.reviews})</span></div><h3>{tour.title}</h3><p className="tour-detail"><Clock3 size={14} />{tour.detail}</p><div className="tour-footer"><span>Desde <strong>{tour.price} €</strong><small> / persona</small></span><button onClick={() => startBooking(tour)} className="tour-arrow" aria-label={`Ver disponibilidad de ${tour.title}`}><ArrowRight size={18} /></button></div></div>
          </article>)}</div> : <div className="empty-results"><Compass size={25} /><h3>Esta ruta aún no ha llegado aquí.</h3><p>Prueba con Barcelona, Sevilla, Girona o San Sebastián.</p><button onClick={() => { setDestination(''); setSearched(false); }}>Ver todas las rutas <ArrowRight size={15} /></button></div>}
          <div className="after-cards"><span>NO HAY DOS CIUDADES IGUALES. <em>NI DOS RUTAS.</em></span><span>01 — 04</span></div>
        </section>

        <section className="manifesto" id="como-funciona">
          <div className="manifesto-side"><span>02 / EL CAMINO</span><div className="route-scribble"><svg viewBox="0 0 190 160" fill="none" aria-hidden="true"><path d="M16 132C55 128 40 92 73 91c31-1 17 43 50 28 29-13 4-54 30-71 10-7 19-10 25-19" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 7" strokeLinecap="round"/><circle cx="16" cy="132" r="5" fill="currentColor"/><path d="m173 26 5 3-1-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div><small>LA MEJOR FORMA<br />DE LLEGAR ES<br />DESVIARSE.</small></div>
          <div className="manifesto-content"><span className="eyebrow"><span className="eyebrow-line" /> NO ES SOLO IR DE UN SITIO A OTRO</span><h2>Hay cosas que<br />solo pasan <em>a pie de calle.</em></h2><p>El olor de un horno que acaba de abrir. La plaza donde todavía se alarga la sobremesa. Ese camino junto al río que no aparece en ninguna app. Ve más despacio. Llega mucho más lejos.</p><div className="manifesto-signature"><span className="signature-rule" />Lo bueno pasa fuera del itinerario.</div></div>
        </section>

        <section className="how-section section-wrap" id="locales">
          <div className="section-topline"><span>03 — TAN FÁCIL COMO SALIR</span><span>Y TAN AUTÉNTICO COMO CONOCER</span></div>
          <div className="how-heading"><h2>De aquí a <em>ahí.</em></h2><p>Todo lo que necesitas para salir a rodar,<br />sin tener que pensarlo demasiado.</p></div>
          <div className="steps"><div className="step"><span className="step-number">01</span><div className="step-icon"><MapPin size={21} /></div><h3>Elige un lugar</h3><p>Encuentra una ruta con el ritmo y la mirada que te apetecen.</p></div><div className="step"><span className="step-number">02</span><div className="step-icon"><Bike size={22} /></div><h3>Conoce a tu guía</h3><p>Gente de aquí, historias propias y cascos para todos.</p></div><div className="step"><span className="step-number">03</span><div className="step-icon"><ArrowRight size={21} /></div><h3>Sal a descubrir</h3><p>Reserva sin complicaciones. El resto, mejor dejarlo al camino.</p></div></div>
          <div className="trust-strip"><ShieldCheck size={20} /><p><strong>Planes claros, gente real.</strong> Cada ruta incluye lo que necesitas saber antes de reservar.</p><span>Y si cambian los planes, también hay sitio para eso.</span></div>
        </section>

        <section className="local-cta">
          <div><span className="eyebrow"><span className="eyebrow-line" /> PARA QUIENES CONOCEN CADA ESQUINA</span><h2>Tu ciudad tiene<br /><em>otra historia.</em></h2><p>Y nos encantaría que la contaras. Comparte tus rutas con viajeros que quieren conocerla de verdad.</p><a href="mailto:hola@rutasenbici.es" className="local-link">Cuéntanos tu idea <ArrowRight size={16} /></a></div>
          <div className="local-visual"><div className="local-circle">HECHO<br />AQUÍ,<br /><em>PARA</em><br />RODAR</div><div className="local-texture" /><div className="local-caption"><span>ESPAÑA, A TU RITMO</span><span>DESDE 2024</span></div></div>
        </section>

        <section className="last-call"><p>EL CAMINO CORTO NO SIEMPRE ES EL MEJOR.</p><a href="#busqueda">¿Salimos? <ArrowRight size={18} /></a><span>Con curiosidad basta.</span></section>
      </main>
      <footer className="footer"><a className="brand" href="#"><span className="brand-mark"><Bike size={20} /></span><span>rutas<span className="brand-light">enbici</span><i>.</i></span></a><span>Un poco más cerca de cada lugar.</span><div><a href="#como-funciona">Cómo funciona</a><a href="mailto:hola@rutasenbici.es">Contacto</a><span>© 2024 Rutas en Bici</span></div></footer>
      {booking && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeBooking(); }}><section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="modal-close" onClick={closeBooking} aria-label="Cerrar"><X size={19} /></button>{bookingDone ? <div className="booking-success"><div className="success-mark"><Check size={25} /></div><span className="eyebrow">LISTO PARA IMAGINARLO</span><h2>Tu plan ya<br /><em>tiene forma.</em></h2><p>Esta es una demostración: no se ha realizado ninguna reserva ni pago. Puedes volver a explorar cuando quieras.</p><button className="modal-primary" onClick={closeBooking}>Seguir explorando <ArrowRight size={16} /></button></div> : <><span className="eyebrow">UNA BUENA ELECCIÓN</span><h2 id="booking-title">Un paseo por<br /><em>{booking.city}.</em></h2><p className="modal-tour-name">{booking.title}</p><div className="modal-meta"><span><Clock3 size={15} />{booking.detail.split(' · ')[0]}</span><span><Users size={15} />{riders}</span></div><label className="modal-date">Elige una fecha<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><div className="modal-price"><span>Desde <strong>{booking.price} €</strong> / persona</span><span className="modal-rating"><Star size={13} fill="currentColor" /> {booking.rating}</span></div><button className="modal-primary" onClick={() => setBookingDone(true)}>Continuar con este plan <ArrowRight size={16} /></button><small className="demo-disclaimer"><ShieldCheck size={13} /> Sin pago ni reserva real. Es solo una demo local.</small></>}</section></div>}
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
