
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useOutletContext, Link, useSearchParams } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { 
    BrandLogo, 
    MenuIcon, 
    CloseIcon, 
    UsersIcon, 
    ChartBarIcon, 
    LogoutIcon, 
    AcademicCapIcon, 
    ShoppingCartIcon, 
    PackageIcon, 
    TruckIcon, 
    TrendingUpIcon, 
    BanknotesIcon, 
    CalendarIcon,
    QrCodeIcon, 
    CreditCardIcon, 
    DocumentDuplicateIcon, 
    CheckCircleIcon,
    PhotoIcon, 
    DownloadIcon, 
    ClipboardCopyIcon,
    UserPlusIcon, 
    CurrencyDollarIcon,
    TagIcon,
    CalculatorIcon, 
    PlayCircleIcon,
    SparklesIcon,
    WhatsAppIcon,
    LocationIcon,
    SearchIcon,
    PlusIcon, 
    MinusIcon,
    EyeIcon,
    FilterIcon,
    LockClosedIcon,
    BriefcaseIcon,
    PresentationChartLineIcon,
    TargetIcon
} from './components/Icons';
import { Consultant, ConsultantStats, Sale, Notification, PrivateCustomer, PrivateSale, Material, Lesson, Order, Withdrawal, GoalMetrics } from './types';

// --- Context Type for Outlet ---
type DashboardContextType = {
    consultant: Consultant;
};

// --- Configurações de Metas ---
const GOAL_TARGET = 5000.00; // Meta mensal de vendas
const GOAL_NEAR_PERCENT = 0.8; // 80%
const BONUS_PERCENT = 0.10; // 10% de bônus

// --- Helper Functions ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const parseCurrency = (valueStr: string): number => {
    if (!valueStr) return 0;
    // Remove "R$", espaços, pontos de milhar e troca vírgula por ponto
    const cleanStr = valueStr.replace(/[R$\s.]/g, '').replace(',', '.');
    return parseFloat(cleanStr) || 0;
};

// --- Centralized Mock Data ---
const MOCK_DATA = {
    team: [
        { id: '007053', name: 'Cleide Maia', role: 'Consultor', status: 'Ativo', sales: 'R$ 1.250,00', phone: '5511999999999' },
        { id: '102031', name: 'João Santos', role: 'Consultor', status: 'Ativo', sales: 'R$ 1.200,00', phone: '5511988888888' },
        { id: '102032', name: 'Ana Costa', role: 'Consultor', status: 'Inativo', sales: 'R$ 0,00', phone: '5511977777777' },
        { id: '102033', name: 'Pedro Alves', role: 'Líder', status: 'Ativo', sales: 'R$ 3.450,00', phone: '5511966666666' },
        { id: '102034', name: 'Carla Lima', role: 'Consultor', status: 'Ativo', sales: 'R$ 525,00', phone: '5511955555555' },
        { id: '102035', name: 'Marcos Rocha', role: 'Consultor', status: 'Inativo', sales: 'R$ 0,00', phone: '5511944444444' },
    ],
    financial: {
        balance: 3450.00, // Saldo simulado disponível para saque
        pendingWithdrawals: 0
    }
};

// --- AUTH COMPONENTS ---

export const LoginScreen = () => {
    const navigate = useNavigate();
    const [consultantId, setConsultantId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Buscar o email vinculado ao ID informado
            const { data: consultant, error: fetchError } = await supabase
                .from('consultants')
                .select('email')
                .eq('id', consultantId)
                .single();

            if (fetchError || !consultant) {
                throw new Error("ID de consultor não encontrado.");
            }

            // 2. Fazer login usando o email encontrado e a senha digitada
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: consultant.email,
                password: password,
            });

            if (authError) throw authError;

            if (data.session) {
                // Redirecionamento é feito pelo AuthGuard no App.tsx
                navigate('/'); 
            }
        } catch (err: any) {
            setError(err.message || "Falha no login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <BrandLogo className="h-16 w-auto" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-brand-green-dark">Bem-vindo</h2>
                    <p className="text-gray-500">Acesse sua conta para continuar.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID do Consultor</label>
                        <input 
                            type="text" 
                            required
                            value={consultantId}
                            onChange={(e) => setConsultantId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green-mid focus:border-transparent outline-none transition"
                            placeholder="Seu ID (ex: 102030)"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green-mid focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                            <input type="checkbox" className="rounded text-brand-green-mid focus:ring-brand-green-mid" />
                            Lembrar-me
                        </label>
                        <a href="#" className="text-brand-green-dark font-bold hover:underline">Esqueceu a senha?</a>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-brand-green-dark text-white rounded-xl font-bold shadow-lg shadow-green-900/10 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Validando...' : 'Entrar'}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    Não tem uma conta? <Link to="/cadastro" className="text-brand-green-dark font-bold hover:underline">Cadastre-se</Link>
                </div>
            </div>
        </div>
    );
};

export const ConsultantRegister = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        whatsapp: '',
        document_id: '',
        sponsor_id: searchParams.get('indicante') || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Sign Up
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create Consultant Record
                // Generate a random 6 digit ID for display purposes
                const newId = Math.floor(100000 + Math.random() * 900000).toString();

                const { error: dbError } = await supabase.from('consultants').insert({
                    id: newId,
                    auth_id: authData.user.id,
                    name: formData.name,
                    email: formData.email,
                    whatsapp: formData.whatsapp,
                    document_id: formData.document_id,
                    parent_id: formData.sponsor_id || null,
                    role: 'consultant'
                });

                if (dbError) throw dbError;

                alert(`Cadastro realizado com sucesso! Seu ID de acesso é: ${newId}. Anote-o para fazer login.`);
                navigate('/login');
            }
        } catch (err: any) {
            setError(err.message || "Erro ao realizar cadastro.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                     <div className="flex justify-center mb-4">
                        <BrandLogo className="h-12 w-auto" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-brand-green-dark">Seja um Consultor</h2>
                    <p className="text-gray-500 text-sm">Junte-se ao Clube Brotos e transforme sua vida.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                        <input 
                            name="name"
                            type="text" 
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-green-mid outline-none text-sm"
                            placeholder="Seu nome"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp</label>
                        <input 
                            name="whatsapp"
                            type="tel" 
                            required
                            value={formData.whatsapp}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-green-mid outline-none text-sm"
                            placeholder="(00) 00000-0000"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CPF</label>
                        <input 
                            name="document_id"
                            type="text" 
                            value={formData.document_id}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-green-mid outline-none text-sm"
                            placeholder="000.000.000-00"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                        <input 
                            name="email"
                            type="email" 
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-green-mid outline-none text-sm"
                            placeholder="seu@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha</label>
                        <input 
                            name="password"
                            type="password" 
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-green-mid outline-none text-sm"
                            placeholder="Crie uma senha forte"
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID do Patrocinador (Opcional)</label>
                        <input 
                            name="sponsor_id"
                            type="text" 
                            value={formData.sponsor_id}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-green-mid outline-none text-sm"
                            placeholder="ID de quem te indicou"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-brand-green-dark text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-70"
                    >
                        {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                    </button>
                </form>

                <div className="text-center text-xs text-gray-500">
                    Já tem conta? <Link to="/login" className="text-brand-green-dark font-bold hover:underline">Fazer Login</Link>
                </div>
            </div>
        </div>
    );
};

// --- LAYOUT COMPONENTS ---

export const DashboardShell = ({ children, consultant }: { children?: React.ReactNode, consultant: Consultant }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const isAdmin = consultant.role === 'admin';
    const isLeader = consultant.role === 'leader' || isAdmin;
    const basePath = isAdmin ? '/admin' : '/consultor';

    const menuItems = [
        { label: 'Visão Geral', icon: <ChartBarIcon className="w-5 h-5" />, path: `${basePath}/dashboard` },
        ...(isAdmin ? [
            { label: 'Administração', icon: <BriefcaseIcon className="w-5 h-5" />, path: `${basePath}/administracao`, section: true },
            { label: 'Painel de Metas', icon: <TargetIcon className="w-5 h-5" />, path: `${basePath}/painel-metas` },
            { label: 'Solicitações Saque', icon: <BanknotesIcon className="w-5 h-5" />, path: `${basePath}/solicitacoes-saque` },
        ] : []),
        { label: 'Novo Pedido', icon: <ShoppingCartIcon className="w-5 h-5" />, path: `${basePath}/novo-pedido` },
        { label: 'Meus Pedidos', icon: <PackageIcon className="w-5 h-5" />, path: `${basePath}/meus-pedidos` },
        { label: 'UniBrotos', icon: <AcademicCapIcon className="w-5 h-5" />, path: `${basePath}/unibrotos` },
        { label: 'Materiais', icon: <PhotoIcon className="w-5 h-5" />, path: `${basePath}/materiais` },
        ...(isLeader ? [
             { label: 'Meu Negócio', icon: <UsersIcon className="w-5 h-5" />, path: `${basePath}/meu-negocio` },
             { label: 'Financeiro', icon: <BanknotesIcon className="w-5 h-5" />, path: `${basePath}/financeiro` },
        ] : []),
        { label: 'Convidar', icon: <UserPlusIcon className="w-5 h-5" />, path: `${basePath}/convidar` },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-72 bg-brand-green-dark text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between border-b border-brand-green-mid/30">
                     {/* Logo Branca para contraste */}
                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                         <BrandLogo className="h-8 w-auto filter brightness-0 invert" />
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/80 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 border-b border-brand-green-mid/30 bg-brand-green-dark/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-green-mid flex items-center justify-center text-xl font-bold shadow-lg border-2 border-brand-green-light">
                            {consultant.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold truncate max-w-[140px]">{consultant.name}</p>
                            <div className="flex items-center gap-2 text-xs text-brand-green-light/80">
                                <span className="uppercase tracking-wider">{consultant.role === 'admin' ? 'Administrador' : consultant.role === 'leader' ? 'Líder' : 'Consultor'}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                     <div className="mt-4 text-xs text-white/60 bg-black/20 py-1 px-2 rounded">
                        ID: <span className="font-mono text-white">{consultant.id}</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    {menuItems.map((item) => (
                        <React.Fragment key={item.path}>
                            {item.section && (
                                <div className="mt-6 mb-2 px-4 text-xs font-bold text-brand-green-mid uppercase tracking-widest">
                                    {item.label}
                                </div>
                            )}
                             {!item.section && (
                                <Link
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                        ${location.pathname === item.path 
                                            ? 'bg-brand-green-mid text-white shadow-lg font-semibold' 
                                            : 'text-brand-green-light/70 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <span className={`${location.pathname === item.path ? 'text-white' : 'text-brand-green-mid group-hover:text-white'} transition-colors`}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            )}
                        </React.Fragment>
                    ))}
                </nav>

                <div className="p-4 border-t border-brand-green-mid/30">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-xl transition-colors"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 flex-shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-brand-text">
                        <MenuIcon className="w-8 h-8" />
                    </button>
                    
                    <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
                        <span className="text-brand-green-mid font-medium">Brotos da Terra</span>
                        <span className="text-gray-300">/</span>
                        <span>Painel do Parceiro</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-brand-green-dark transition-colors">
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            <div className="w-6 h-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 lg:p-10 custom-scrollbar pb-24">
                     {children}
                </div>
            </main>
        </div>
    );
};

// --- VIEW COMPONENTS ---

export const OverviewView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Olá, {consultant.name.split(' ')[0]}!</h1>
                <p className="text-gray-500 mt-1">Aqui está o resumo do seu desempenho hoje.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 rounded-xl text-brand-green-mid">
                            <CurrencyDollarIcon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Vendas no Mês</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ 1.250,00</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
                            <TrendingUpIcon className="w-6 h-6" />
                        </div>
                         <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Simulação</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Lucro Estimado</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ 625,00</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-500">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+5</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Novos Clientes</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-50 rounded-xl text-orange-500">
                            <AcademicCapIcon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Em progresso</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Aulas Assistidas</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">8/12</h3>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Vendas Recentes</h3>
                        <button className="text-sm text-brand-green-mid font-bold hover:underline">Ver tudo</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-3 pl-2">Cliente</th>
                                    <th className="pb-3">Produto</th>
                                    <th className="pb-3">Data</th>
                                    <th className="pb-3">Valor</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[1, 2, 3].map((i) => (
                                    <tr key={i} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 pl-2 font-medium text-gray-900">Maria Silva</td>
                                        <td className="py-4 text-gray-600">Kit 3 Pomadas</td>
                                        <td className="py-4 text-gray-500">Hoje, 14:30</td>
                                        <td className="py-4 font-bold text-gray-900">R$ 150,00</td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Pago</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {[1,2,3].length === 0 && <p className="text-gray-500 text-center py-4">Nenhuma venda recente.</p>}
                    </div>
                </div>

                <div className="bg-brand-green-dark rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">Dica do Dia</h3>
                        <p className="text-brand-green-light mb-6 text-sm leading-relaxed">
                            Ofereça o Kit de 3 unidades para clientes com dores crônicas. O tratamento contínuo traz melhores resultados e aumenta seu ticket médio.
                        </p>
                        <button className="w-full py-3 bg-white text-brand-green-dark rounded-xl font-bold shadow-lg hover:bg-brand-green-light transition-colors text-sm">
                            Ver Treinamento de Vendas
                        </button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-10 text-white">
                        <SparklesIcon className="w-48 h-48" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MaterialsView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            const { data } = await supabase.from('materials').select('*').order('created_at', { ascending: false });
            if (data) setMaterials(data);
            setLoading(false);
        };
        fetchMaterials();
    }, []);

    const isAdmin = consultant.role === 'admin';

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Materiais de Apoio</h1>
                    <p className="text-gray-500 mt-1">Baixe imagens e textos para divulgar nas redes sociais.</p>
                </div>
                 {/* Only Admin sees Add button, though function not implemented in this view for brevity */}
                 {isAdmin && (
                    <button className="bg-brand-green-dark text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-brand-green-mid transition">
                        + Novo Material
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                            {item.type === 'image' ? (
                                <img src={item.url || "https://via.placeholder.com/400x300"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    {item.type === 'pdf' ? <DocumentDuplicateIcon className="w-16 h-16" /> : <ClipboardCopyIcon className="w-16 h-16" />}
                                </div>
                            )}
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-green-dark shadow-sm">
                                {item.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                            <div className="flex gap-3 mt-4">
                                <a href={item.url || '#'} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-green-dark text-white rounded-xl text-sm font-bold hover:bg-brand-green-mid transition-colors">
                                    <DownloadIcon className="w-4 h-4" /> Baixar
                                </a>
                                {item.type === 'text' && (
                                    <button className="px-3 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                                        <ClipboardCopyIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {!loading && materials.length === 0 && (
                     <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        Nenhum material encontrado.
                    </div>
                )}
            </div>
        </div>
    );
};

export const UniBrotosView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            const { data } = await supabase.from('lessons').select('*').order('created_at', { ascending: true });
            if (data) setLessons(data);
            setLoading(false);
        };
        fetchLessons();
    }, []);
    
    const isAdmin = consultant.role === 'admin';

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                     <div className="flex items-center gap-2 mb-1">
                        <AcademicCapIcon className="w-8 h-8 text-brand-green-mid" />
                        <h1 className="text-3xl font-serif font-bold text-gray-900">UniBrotos</h1>
                    </div>
                    <p className="text-gray-500">Treinamentos exclusivos para você vender mais.</p>
                </div>
                 {isAdmin && (
                    <button className="bg-brand-green-dark text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-brand-green-mid transition">
                        + Adicionar Aula
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                    <div key={lesson.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                        <div className={`h-48 ${lesson.thumbnail || 'bg-gray-200'} relative flex items-center justify-center`}>
                            <div className="w-16 h-16 bg-white/30 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <PlayCircleIcon className="w-16 h-16 text-white" />
                            </div>
                            <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
                                {lesson.duration}
                            </span>
                        </div>
                        <div className="p-5">
                            <div className="text-xs font-bold text-brand-green-mid uppercase tracking-wider mb-1">{lesson.category}</div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-brand-green-dark transition-colors">{lesson.title}</h3>
                        </div>
                    </div>
                ))}
                 {!loading && lessons.length === 0 && (
                     <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        Nenhuma aula disponível no momento.
                    </div>
                )}
            </div>
        </div>
    );
};

export const NewOrderView = () => {
     const { consultant } = useOutletContext<DashboardContextType>();
     const navigate = useNavigate();
     const [cart, setCart] = useState<{product: string, qty: number, price: number}[]>([]);
     const [loading, setLoading] = useState(false);

     const products = [
         { id: 1, name: "Pomada Massageadora (Unidade)", price: 35.00 },
         { id: 2, name: "Kit 3 Pomadas (Promo)", price: 90.00 },
         { id: 3, name: "Caixa Display (12 Unid)", price: 300.00 },
     ];

     const addToCart = (product: any) => {
         const existing = cart.find(c => c.product === product.name);
         if (existing) {
             setCart(cart.map(c => c.product === product.name ? {...c, qty: c.qty + 1} : c));
         } else {
             setCart([...cart, { product: product.name, qty: 1, price: product.price }]);
         }
     };

     const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

     const handleFinalizeOrder = async () => {
         if (cart.length === 0) return;
         setLoading(true);

         const orderId = `PED-${Math.floor(Math.random() * 100000)}`;
         const itemsString = cart.map(c => `${c.qty}x ${c.product}`).join(', ');
         
         // 1. WhatsApp Logic (Immediate)
         const message = `Olá, sou o consultor *${consultant.name}* (ID: ${consultant.id}).\n\nGostaria de finalizar o pedido *${orderId}*:\n\n${cart.map(c => `- ${c.qty}x ${c.product}`).join('\n')}\n\n*Total: R$ ${total.toFixed(2)}*`;
         const whatsappLink = `https://wa.me/557199190515?text=${encodeURIComponent(message)}`;
         
         // Open WhatsApp immediately
         window.open(whatsappLink, '_blank');

         // 2. Database Save (Background)
         try {
             await supabase.from('orders').insert({
                 id: orderId,
                 consultant_id: consultant.id,
                 date: new Date().toLocaleDateString('pt-BR'),
                 items: itemsString,
                 total: `R$ ${total.toFixed(2)}`,
                 status: 'Pendente'
             });
             // Reset cart after successful initiation
             setCart([]);
             navigate('/consultor/meus-pedidos');
         } catch (error) {
             console.error("Error saving order backup:", error);
             // User is already on WhatsApp, so we don't alert error to avoid confusion
         } finally {
             setLoading(false);
         }
     };

     return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Novo Pedido</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    {products.map(product => (
                        <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-900">{product.name}</h3>
                                <p className="text-brand-green-mid font-bold">R$ {product.price.toFixed(2)}</p>
                            </div>
                            <button 
                                onClick={() => addToCart(product)}
                                className="bg-brand-green-dark text-white p-2 rounded-lg hover:bg-brand-green-mid transition"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <ShoppingCartIcon className="w-5 h-5" /> Resumo do Pedido
                    </h3>
                    
                    {cart.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">Carrinho vazio</p>
                    ) : (
                        <div className="space-y-3">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span>{item.qty}x {item.product}</span>
                                    <span className="font-medium">R$ {(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-brand-green-dark">
                                <span>Total</span>
                                <span>R$ {total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleFinalizeOrder}
                        disabled={cart.length === 0 || loading}
                        className="w-full mt-6 py-3 bg-brand-green-mid text-white rounded-xl font-bold shadow hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <WhatsAppIcon className="w-5 h-5" />
                        Finalizar via WhatsApp
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-3">
                        Você será redirecionado para falar com nosso suporte.
                    </p>
                </div>
            </div>
        </div>
     );
};

export const MyOrdersView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await supabase
                .from('orders')
                .select('*')
                .eq('consultant_id', consultant.id)
                .order('created_at', { ascending: false });
            if (data) setOrders(data);
        };
        fetchOrders();
    }, [consultant.id]);

    return (
        <div className="max-w-6xl mx-auto">
             <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Meus Pedidos</h1>
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Itens</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(orders || []).map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{order.items}</td>
                                    <td className="px-6 py-4 font-bold text-brand-green-dark">{order.total}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                            order.status === 'Entregue' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Enviado' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(orders || []).length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Você ainda não fez nenhum pedido.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    );
};

export const InviteView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const inviteLink = `${window.location.origin}/cadastro?indicante=${consultant.id}`;

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        alert("Link copiado!");
    };

    return (
        <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="w-20 h-20 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlusIcon className="w-10 h-10 text-brand-green-mid" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Convide e Ganhe</h1>
                <p className="text-gray-500 mb-8">Envie seu link exclusivo para novos consultores e construa sua equipe de sucesso.</p>
                
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <input 
                        readOnly 
                        value={inviteLink}
                        className="flex-1 bg-transparent border-none text-gray-600 text-sm px-2 outline-none"
                    />
                    <button 
                        onClick={copyLink}
                        className="bg-brand-green-dark text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-green-mid transition shadow"
                    >
                        Copiar
                    </button>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <button className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:scale-110 transition hover:shadow-green-500/30">
                        <WhatsAppIcon className="w-6 h-6" />
                    </button>
                    {/* Add more social share buttons if needed */}
                </div>
            </div>
        </div>
    );
};

export const BusinessView = () => {
    // Only accessible by Leader/Admin
    const { consultant } = useOutletContext<DashboardContextType>();
    const team = MOCK_DATA.team; // Em produção, buscaria do Supabase com parent_id = consultant.id

    return (
        <div className="max-w-6xl mx-auto space-y-6">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Meu Negócio</h1>
                <div className="text-sm text-gray-500">
                    Total Equipe: <span className="font-bold text-gray-900">{team.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Nível</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Vendas (Mês)</th>
                            <th className="px-6 py-4">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {team.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green-dark font-bold text-xs">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{member.name}</p>
                                            <p className="text-xs text-gray-400">ID: {member.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{member.role}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        member.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm">{member.sales}</td>
                                <td className="px-6 py-4">
                                    <button className="text-brand-green-mid hover:text-brand-green-dark">
                                        <WhatsAppIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const FinancialView = () => {
    // Only accessible by Leader/Admin
    const { consultant } = useOutletContext<DashboardContextType>();
    const { balance } = MOCK_DATA.financial;
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<Withdrawal[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data } = await supabase
                .from('withdrawals')
                .select('*')
                .eq('consultant_id', consultant.id)
                .order('created_at', { ascending: false });
            if (data) setHistory(data);
        };
        fetchHistory();
    }, [consultant.id]);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(withdrawAmount);
        
        if (amount <= 0 || amount > balance) {
            alert("Valor inválido ou saldo insuficiente.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('withdrawals').insert({
                consultant_id: consultant.id,
                amount: amount,
                status: 'pending'
            });

            if (error) throw error;
            
            alert("Solicitação de saque enviada!");
            setWithdrawAmount('');
            // Refresh history
            const { data } = await supabase
                .from('withdrawals')
                .select('*')
                .eq('consultant_id', consultant.id)
                .order('created_at', { ascending: false });
            if (data) setHistory(data);

        } catch (err: any) {
            alert("Erro ao solicitar saque: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Financeiro</h1>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-brand-green-dark rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-brand-green-light font-medium mb-1">Saldo Disponível</p>
                        <h2 className="text-4xl font-bold mb-6">R$ {balance.toFixed(2).replace('.', ',')}</h2>
                        
                        <form onSubmit={handleWithdraw} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <label className="text-xs text-brand-green-light block mb-2">Solicitar Saque</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">R$</span>
                                    <input 
                                        type="number" 
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="w-full bg-black/20 border-none rounded-lg py-2 pl-8 pr-3 text-white placeholder-white/30 focus:ring-1 focus:ring-brand-green-mid outline-none"
                                        placeholder="0,00"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="bg-brand-green-mid text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-white hover:text-brand-green-dark transition disabled:opacity-50"
                                >
                                    {loading ? '...' : 'Sacar'}
                                </button>
                            </div>
                        </form>
                    </div>
                     <BanknotesIcon className="absolute -right-6 -bottom-6 w-48 h-48 text-white/5" />
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Histórico de Saques</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {history.length > 0 ? history.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-bold text-gray-900">Saque PIX</p>
                                    <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-500">- R$ {item.amount.toFixed(2)}</p>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                        item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {item.status === 'pending' ? 'Pendente' : item.status === 'approved' ? 'Pago' : 'Rejeitado'}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-400 text-sm text-center">Nenhum saque registrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminPanelView = () => {
    // Only Admin view
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Painel Administrativo</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Total de Usuários</h3>
                    <p className="text-4xl font-bold text-brand-green-dark">1,234</p>
                    <div className="mt-4 flex gap-2">
                        <button className="text-sm text-brand-green-mid font-bold hover:underline">Gerenciar Usuários</button>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Vendas Totais (Mês)</h3>
                    <p className="text-4xl font-bold text-brand-green-dark">R$ 154.000</p>
                    <div className="mt-4 flex gap-2">
                         <button className="text-sm text-brand-green-mid font-bold hover:underline">Relatório Detalhado</button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Pedidos Pendentes</h3>
                    <p className="text-4xl font-bold text-orange-500">12</p>
                    <div className="mt-4 flex gap-2">
                        <Link to="/admin/meus-pedidos" className="text-sm text-brand-green-mid font-bold hover:underline">Ver Pedidos</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminGoalsView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const [metrics, setMetrics] = useState<GoalMetrics[]>([]);
    
    // Simulate fetching goal metrics from backend logic
    // In a real scenario, this would be a complex SQL query or Edge Function aggregation
    useEffect(() => {
        // Mocking the calculation based on "team" mock data + random generation
        const mockMetrics: GoalMetrics[] = MOCK_DATA.team.map(member => {
            const sales = parseCurrency(member.sales); // Extract numeric value from "R$ 1.250,00"
            const percentage = Math.min((sales / GOAL_TARGET) * 100, 100);
            
            let status: 'meta_batida' | 'proximo' | 'distante' = 'distante';
            if (sales >= GOAL_TARGET) status = 'meta_batida';
            else if (sales >= GOAL_TARGET * GOAL_NEAR_PERCENT) status = 'proximo';

            const bonus = status === 'meta_batida' ? sales * BONUS_PERCENT : 0;

            return {
                consultant_id: member.id,
                consultant_name: member.name,
                total_sales: sales,
                percentage: percentage,
                status: status,
                bonus_amount: bonus
            };
        });
        setMetrics(mockMetrics);
    }, []);

    const totalBonusToPay = metrics.reduce((acc, curr) => acc + curr.bonus_amount, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Painel de Metas</h1>
                    <p className="text-gray-500 mt-1">Acompanhamento mensal de desempenho e bonificações.</p>
                </div>
                <div className="bg-brand-green-light px-6 py-4 rounded-2xl border border-brand-green-mid/20">
                    <p className="text-xs font-bold text-brand-green-dark uppercase tracking-wider mb-1">Previsão de Bonificação</p>
                    <p className="text-3xl font-bold text-brand-green-dark">{formatCurrency(totalBonusToPay)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="font-bold text-gray-700">Meta Batida</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{metrics.filter(m => m.status === 'meta_batida').length}</p>
                </div>
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <span className="font-bold text-gray-700">Próximos da Meta ({GOAL_NEAR_PERCENT * 100}%)</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{metrics.filter(m => m.status === 'proximo').length}</p>
                </div>
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <span className="font-bold text-gray-700">Meta: {formatCurrency(GOAL_TARGET)}</span>
                    </div>
                    <p className="text-sm text-gray-500">Bônus: {BONUS_PERCENT * 100}% sobre vendas</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Consultor</th>
                            <th className="px-6 py-4">Vendas</th>
                            <th className="px-6 py-4 w-1/3">Progresso</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Bonificação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {metrics.map((metric) => (
                            <tr key={metric.consultant_id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900 text-sm">{metric.consultant_name}</p>
                                    <p className="text-xs text-gray-400">ID: {metric.consultant_id}</p>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm text-gray-700">
                                    {formatCurrency(metric.total_sales)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className={`h-2.5 rounded-full ${
                                                metric.status === 'meta_batida' ? 'bg-green-500' : 
                                                metric.status === 'proximo' ? 'bg-yellow-400' : 'bg-gray-400'
                                            }`} 
                                            style={{ width: `${metric.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-right mt-1 text-gray-500">{metric.percentage.toFixed(0)}%</p>
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        metric.status === 'meta_batida' ? 'bg-green-100 text-green-700' :
                                        metric.status === 'proximo' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-500'
                                    }`}>
                                        {metric.status === 'meta_batida' ? 'Batida' : metric.status === 'proximo' ? 'Quase lá' : 'Em andamento'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-green-600">
                                    {metric.bonus_amount > 0 ? formatCurrency(metric.bonus_amount) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const AdminWithdrawalsView = () => {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWithdrawals = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('withdrawals')
            .select('*, consultants(name, email)')
            .order('created_at', { ascending: false });
        
        if (data) setWithdrawals(data as any); // Cast needed due to join
        setLoading(false);
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        const confirmMsg = action === 'approved' ? 'Aprovar este saque?' : 'Rejeitar este saque?';
        if (!window.confirm(confirmMsg)) return;

        try {
            const { error } = await supabase
                .from('withdrawals')
                .update({ 
                    status: action,
                    processed_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            fetchWithdrawals(); // Refresh list
        } catch (err: any) {
            alert("Erro ao processar: " + err.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Solicitações de Saque</h1>
                <button onClick={fetchWithdrawals} className="text-sm text-brand-green-mid hover:underline">Atualizar lista</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Data</th>
                            <th className="px-6 py-4">Consultor</th>
                            <th className="px-6 py-4">Valor</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {withdrawals.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(item.created_at).toLocaleDateString()}
                                    <br/>
                                    <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleTimeString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900 text-sm">{item.consultants?.name || 'Desconhecido'}</p>
                                    <p className="text-xs text-gray-500">{item.consultants?.email}</p>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900 text-lg">
                                    {formatCurrency(item.amount)}
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                        item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {item.status === 'pending' ? 'Aguardando' : item.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {item.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleAction(item.id, 'approved')}
                                                className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition"
                                            >
                                                Autorizar
                                            </button>
                                            <button 
                                                onClick={() => handleAction(item.id, 'rejected')}
                                                className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition"
                                            >
                                                Rejeitar
                                            </button>
                                        </div>
                                    )}
                                    {item.status !== 'pending' && (
                                        <span className="text-xs text-gray-400 italic">Processado em {new Date(item.processed_at || '').toLocaleDateString()}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {withdrawals.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    Nenhuma solicitação encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
