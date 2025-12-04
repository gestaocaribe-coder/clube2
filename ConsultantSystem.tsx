
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
const GOAL_TARGET = 5000.00;
const GOAL_NEAR_PERCENT = 0.8;
const BONUS_PERCENT = 0.10;

// --- Helper Functions ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value || 0);
};

const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
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
        balance: 3450.00,
        pendingWithdrawals: 0
    }
};

// --- AUTH COMPONENTS ---

export const LoginScreen = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState(''); // ID ou Email
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let signInEmail = identifier.trim();

            // Lógica: Se não contém '@', assumimos que é um ID e buscamos o email correspondente
            if (!signInEmail.includes('@')) {
                const { data, error: lookupError } = await supabase
                    .from('consultants')
                    .select('email')
                    .eq('id', signInEmail)
                    .maybeSingle();

                if (lookupError || !data) {
                    throw new Error("ID de consultor não encontrado.");
                }
                signInEmail = data.email;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: signInEmail,
                password,
            });

            if (error) throw error;

            if (data.session) {
                // Fetch user role to decide navigation
                const { data: consultant, error: profileError } = await supabase
                    .from('consultants')
                    .select('role')
                    .eq('auth_id', data.session.user.id)
                    .single();

                if (consultant) {
                    if (consultant.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/consultor/dashboard');
                    }
                } else {
                    navigate('/consultor/dashboard');
                }
            }
        } catch (err: any) {
            setError(err.message || "Falha no login. Verifique seu ID e senha.");
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
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green-mid focus:border-transparent outline-none transition"
                            placeholder="Ex: 102030"
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

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-brand-green-dark text-white rounded-xl font-bold shadow-lg shadow-green-900/10 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
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
            // 1. Criar usuário no Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Gerar ID aleatório de 6 dígitos
                const newId = Math.floor(100000 + Math.random() * 900000).toString();

                // 3. Inserir na tabela consultants
                const { error: dbError } = await supabase
                    .from('consultants')
                    .insert([
                        {
                            id: newId,
                            auth_id: authData.user.id,
                            name: formData.name,
                            email: formData.email,
                            whatsapp: formData.whatsapp,
                            document_id: formData.document_id,
                            parent_id: formData.sponsor_id || null,
                            role: 'consultant', 
                        }
                    ]);

                if (dbError) throw dbError;

                // Sucesso
                navigate('/login');
            }
        } catch (err: any) {
            console.error("Erro no cadastro:", err);
            setError(err.message || "Erro ao realizar cadastro.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
                 <div className="text-center mb-8">
                    <BrandLogo className="h-12 w-auto mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-brand-green-dark font-serif">Cadastro de Consultor</h2>
                    <p className="text-gray-500">Junte-se à Brotos da Terra</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-brand-green-mid outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CPF</label>
                            <input name="document_id" type="text" required value={formData.document_id} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-brand-green-mid outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                            <input name="whatsapp" type="text" required value={formData.whatsapp} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-brand-green-mid outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-brand-green-mid outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-brand-green-mid outline-none" />
                    </div>
                    {formData.sponsor_id && (
                         <div>
                            <label className="block text-sm font-medium text-gray-700">ID do Patrocinador</label>
                            <input name="sponsor_id" type="text" readOnly value={formData.sponsor_id} className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
                        </div>
                    )}
                    
                    <button type="submit" disabled={loading} className="w-full py-3 bg-brand-green-dark text-white rounded-lg font-bold hover:bg-opacity-90 transition disabled:opacity-50">
                        {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-500">
                    Já tem conta? <Link to="/login" className="text-brand-green-mid hover:underline">Fazer Login</Link>
                </div>
            </div>
        </div>
    );
};

// --- DASHBOARD SHELL ---

export const DashboardShell = ({ consultant, children }: { consultant: Consultant, children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const isAdmin = consultant.role === 'admin';
    const basePath = isAdmin ? '/admin' : '/consultor';

    const MenuItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
        const isActive = location.pathname === `${basePath}/${to}`;
        return (
            <Link 
                to={`${basePath}/${to}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                    ? 'bg-brand-green-dark text-white shadow-lg shadow-brand-green-dark/20' 
                    : 'text-gray-600 hover:bg-brand-green-light hover:text-brand-green-dark'
                }`}
            >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand-green-dark'}`} />
                <span className="font-medium">{label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between">
                     <BrandLogo className="h-10 w-auto" />
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-brand-green-dark">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="px-6 mb-6">
                    <div className="bg-brand-green-light/50 p-4 rounded-2xl flex items-center gap-3 border border-brand-green-light">
                        <div className="h-10 w-10 rounded-full bg-brand-green-mid text-white flex items-center justify-center font-bold shadow-sm">
                            {consultant.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-brand-green-dark truncate">{consultant.name}</p>
                            <p className="text-xs text-brand-green-mid uppercase tracking-wide font-semibold">{consultant.role}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Principal</div>
                    <MenuItem to="dashboard" icon={ChartBarIcon} label="Visão Geral" />
                    {isAdmin && (
                        <>
                             <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Administração</div>
                             <MenuItem to="administracao" icon={PresentationChartLineIcon} label="Painel Admin" />
                             <MenuItem to="painel-metas" icon={TargetIcon} label="Metas & Bônus" />
                             <MenuItem to="solicitacoes-saque" icon={BanknotesIcon} label="Saques" />
                        </>
                    )}
                    
                    <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Vendas</div>
                    <MenuItem to="novo-pedido" icon={ShoppingCartIcon} label="Novo Pedido" />
                    <MenuItem to="meus-pedidos" icon={PackageIcon} label="Meus Pedidos" />
                    
                    <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recursos</div>
                    <MenuItem to="unibrotos" icon={AcademicCapIcon} label="UniBrotos" />
                    <MenuItem to="materiais" icon={PhotoIcon} label="Materiais" />
                    <MenuItem to="convidar" icon={UserPlusIcon} label="Convidar" />

                    {(consultant.role === 'leader' || isAdmin) && (
                        <>
                            <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Gestão</div>
                            <MenuItem to="meu-negocio" icon={BriefcaseIcon} label="Minha Equipe" />
                            <MenuItem to="financeiro" icon={CurrencyDollarIcon} label="Financeiro" />
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                    >
                        <LogoutIcon className="h-5 w-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm z-30">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 p-2 -ml-2 hover:bg-gray-50 rounded-lg">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <div className="flex items-center gap-4 ml-auto">
                        <button className="relative p-2 text-gray-400 hover:text-brand-green-dark transition-colors">
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                            <span className="sr-only">Notificações</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8 pb-20">
                         {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- VIEWS ---

export const OverviewView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    
    // Simulação visual de ganhos (hardcoded para demonstração)
    const mockMonthlySales = "R$ 1.250,00";
    const mockEstimatedProfit = "R$ 625,00"; // 50% de lucro
    
    return (
        <div className="space-y-6 animate-fade-in">
             <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">Olá, {consultant.name.split(' ')[0]}! 👋</h1>
                <p className="text-gray-500">Aqui está o resumo do seu negócio hoje.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><TrendingUpIcon className="h-6 w-6" /></div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                     </div>
                     <p className="text-gray-500 text-sm font-medium">Vendas no Mês</p>
                     <h3 className="text-2xl font-bold text-gray-900 mt-1">{mockMonthlySales}</h3>
                </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><CurrencyDollarIcon className="h-6 w-6" /></div>
                     </div>
                     <p className="text-gray-500 text-sm font-medium">Lucro Estimado</p>
                     <h3 className="text-2xl font-bold text-gray-900 mt-1">{mockEstimatedProfit}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><UsersIcon className="h-6 w-6" /></div>
                     </div>
                     <p className="text-gray-500 text-sm font-medium">Novos Clientes</p>
                     <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
                </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><AcademicCapIcon className="h-6 w-6" /></div>
                     </div>
                     <p className="text-gray-500 text-sm font-medium">Aulas Assistidas</p>
                     <h3 className="text-2xl font-bold text-gray-900 mt-1">8/12</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Atividade Recente</h3>
                    <div className="space-y-4">
                         {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="h-10 w-10 rounded-full bg-brand-green-light text-brand-green-dark flex items-center justify-center font-bold">
                                    <ShoppingCartIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Nova venda realizada</p>
                                    <p className="text-xs text-gray-500">Há {i + 2} horas • Kit Iniciante</p>
                                </div>
                                <div className="ml-auto font-bold text-brand-green-dark">+ R$ 150,00</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-brand-green-dark rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-xl mb-2">Meta Mensal</h3>
                        <p className="text-brand-green-light mb-6">Você já atingiu 65% da sua meta pessoal!</p>
                        <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                            <div className="bg-brand-green-mid h-3 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm text-brand-green-light font-medium">
                            <span>R$ 1.250,00</span>
                            <span>Meta: R$ 2.000,00</span>
                        </div>
                    </div>
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 bg-brand-green-mid/20 rounded-full blur-xl"></div>
                </div>
            </div>
        </div>
    );
};

export const MaterialsView = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            const { data } = await supabase.from('materials').select('*');
            setMaterials(data || []);
            setLoading(false);
        };
        fetchMaterials();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Materiais de Marketing</h2>
            {loading ? <p>Carregando...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((item) => (
                         <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-40 bg-gray-200 flex items-center justify-center">
                                {item.type === 'image' ? (
                                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 uppercase font-bold">{item.type}</span>
                                )}
                            </div>
                            <div className="p-4">
                                <span className="text-xs font-bold text-brand-green-mid uppercase tracking-wide">{item.category}</span>
                                <h3 className="font-bold text-gray-900 mt-1 mb-3">{item.title}</h3>
                                <button className="w-full py-2 flex items-center justify-center gap-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-brand-green-dark transition-colors text-sm font-medium">
                                    <DownloadIcon className="h-4 w-4" /> Baixar Material
                                </button>
                            </div>
                        </div>
                    ))}
                    {materials.length === 0 && <p className="text-gray-500">Nenhum material encontrado.</p>}
                </div>
            )}
        </div>
    );
};

export const UniBrotosView = () => {
     const [lessons, setLessons] = useState<Lesson[]>([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchLessons = async () => {
            const { data } = await supabase.from('lessons').select('*');
            setLessons(data || []);
            setLoading(false);
        };
        fetchLessons();
     }, []);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-brand-green-dark to-brand-green-mid rounded-2xl p-8 text-white mb-8">
                <h2 className="text-3xl font-serif font-bold mb-2">UniBrotos</h2>
                <p className="text-brand-green-light max-w-xl">Aprenda, cresça e floresça. Nossa universidade corporativa com conteúdos exclusivos para alavancar suas vendas.</p>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">Aulas Disponíveis</h3>
             {loading ? <p>Carregando...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer">
                            <div className={`h-48 ${lesson.thumbnail.startsWith('#') ? '' : lesson.thumbnail} bg-gray-200 relative`}>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <PlayCircleIcon className="h-12 w-12 text-white opacity-90 group-hover:scale-110 transition-transform" />
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-brand-green-mid uppercase">{lesson.category}</span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1"><i className="far fa-clock"></i> {lesson.duration}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-brand-green-dark transition-colors">{lesson.title}</h3>
                            </div>
                        </div>
                    ))}
                     {lessons.length === 0 && <p className="text-gray-500">Nenhuma aula disponível.</p>}
                </div>
             )}
        </div>
    );
};

export const NewOrderView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    
    const handleFinalizeOrder = async () => {
         const orderId = `PED-${Math.floor(Math.random() * 10000)}`;
         const total = 210.00;
         const items = "3x Pomada Massageadora, 2x Gel Refrescante";
         
         // 1. WhatsApp Redirect (Instantâneo)
         const phone = '557199190515';
         const message = encodeURIComponent(
            `Olá, sou o consultor *${consultant.name}* (ID: ${consultant.id}).\n\n` +
            `Gostaria de finalizar meu pedido *${orderId}*.\n` +
            `Itens: ${items}\n` +
            `Total: R$ ${total.toFixed(2)}`
         );
         window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
         
         // 2. Save to DB (Fire and Forget)
         supabase.from('orders').insert([{
             id: orderId,
             consultant_id: consultant.id,
             date: new Date().toLocaleDateString('pt-BR'),
             items: items,
             total: `R$ ${total.toFixed(2).replace('.', ',')}`,
             status: 'Pendente'
         }]).then(({ error }) => {
             if (error) console.error("Erro ao salvar pedido em background:", error);
         });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Novo Pedido</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                {/* Product Catalog Simulation */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 border rounded-xl hover:border-brand-green-mid transition-colors cursor-pointer bg-gray-50/50">
                        <div className="h-20 w-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">Pomada Massageadora Premium</h3>
                            <p className="text-sm text-gray-500">Alívio imediato para dores musculares</p>
                            <div className="mt-2 font-bold text-brand-green-dark">R$ 45,00</div>
                        </div>
                        <div className="flex items-center gap-3">
                             <button className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"><MinusIcon className="h-4 w-4" /></button>
                             <span className="font-medium w-6 text-center">3</span>
                             <button className="h-8 w-8 rounded-full bg-brand-green-dark text-white flex items-center justify-center hover:bg-brand-green-mid"><PlusIcon className="h-4 w-4" /></button>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-4 border rounded-xl hover:border-brand-green-mid transition-colors cursor-pointer bg-gray-50/50">
                        <div className="h-20 w-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">Gel Refrescante</h3>
                            <p className="text-sm text-gray-500">Para pernas cansadas</p>
                            <div className="mt-2 font-bold text-brand-green-dark">R$ 37,50</div>
                        </div>
                        <div className="flex items-center gap-3">
                             <button className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"><MinusIcon className="h-4 w-4" /></button>
                             <span className="font-medium w-6 text-center">2</span>
                             <button className="h-8 w-8 rounded-full bg-brand-green-dark text-white flex items-center justify-center hover:bg-brand-green-mid"><PlusIcon className="h-4 w-4" /></button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500">Total do Pedido</span>
                        <span className="text-3xl font-bold text-gray-900">R$ 210,00</span>
                    </div>
                    <button 
                        onClick={handleFinalizeOrder}
                        className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-3"
                    >
                        <WhatsAppIcon className="h-6 w-6" />
                        FINALIZAR VIA WHATSAPP
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Ao clicar, você será redirecionado para o WhatsApp da central para confirmar pagamento e envio.
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
            setOrders(data || []);
        };
        fetchOrders();
    }, [consultant.id]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Meus Pedidos</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600 text-sm">ID</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Data</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Total</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="p-4 font-medium text-brand-green-dark">#{order.id}</td>
                                    <td className="p-4 text-gray-500">{order.date}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            order.status === 'Entregue' ? 'bg-green-100 text-green-700' : 
                                            order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-gray-900">{order.total}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-brand-green-mid hover:text-brand-green-dark text-sm font-medium">Ver Detalhes</button>
                                    </td>
                                </tr>
                            ))}
                             {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">Você ainda não realizou nenhum pedido.</td>
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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        alert("Link copiado!");
    };

    return (
        <div className="max-w-2xl mx-auto text-center space-y-8 pt-10">
            <div className="h-24 w-24 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlusIcon className="h-10 w-10 text-brand-green-dark" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Cresça sua Equipe</h2>
            <p className="text-gray-500 text-lg">Envie seu link exclusivo para novos consultores e ganhe bonificações sobre as vendas da sua equipe.</p>
            
            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 max-w-md mx-auto">
                <div className="flex-1 px-4 py-2 bg-gray-50 rounded-lg text-gray-600 font-mono text-sm truncate">
                    {inviteLink}
                </div>
                <button onClick={copyToClipboard} className="p-3 bg-brand-green-dark text-white rounded-lg hover:bg-brand-green-mid transition-colors">
                    <ClipboardCopyIcon className="h-5 w-5" />
                </button>
            </div>
            
             <button onClick={() => window.open(`https://wa.me/?text=Olá! Quero te convidar para fazer parte da minha equipe na Brotos da Terra. Cadastre-se aqui: ${inviteLink}`, '_blank')} className="inline-flex items-center gap-2 text-green-600 font-bold hover:underline">
                <WhatsAppIcon className="h-5 w-5" /> Compartilhar no WhatsApp
            </button>
        </div>
    );
};

export const BusinessView = () => {
    const { team } = MOCK_DATA;
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Minha Equipe</h2>
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                     <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="p-4 font-semibold text-gray-600">Nome</th>
                            <th className="p-4 font-semibold text-gray-600">Cargo</th>
                            <th className="p-4 font-semibold text-gray-600">Vendas (Mês)</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Contato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {team.map(member => (
                            <tr key={member.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                <td className="p-4 font-medium text-gray-900">{member.name}</td>
                                <td className="p-4 text-gray-500">{member.role}</td>
                                <td className="p-4 font-medium text-green-600">{member.sales}</td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${member.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <a href={`https://wa.me/${member.phone}`} target="_blank" className="text-brand-green-dark hover:text-brand-green-mid font-medium text-sm">
                                        WhatsApp
                                    </a>
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
    const { consultant } = useOutletContext<DashboardContextType>();
    const { financial } = MOCK_DATA;
    const [requesting, setRequesting] = useState(false);

    const handleWithdraw = async () => {
        if (financial.balance <= 0) return alert("Saldo insuficiente");
        setRequesting(true);
        
        const { error } = await supabase.from('withdrawals').insert([{
            consultant_id: consultant.id,
            amount: financial.balance,
            status: 'pending'
        }]);

        if (error) {
            alert("Erro ao solicitar saque.");
        } else {
            alert("Solicitação enviada com sucesso!");
        }
        setRequesting(false);
    };

    return (
         <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Financeiro</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-dark-bg text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-gray-400 mb-1">Saldo Disponível</p>
                        <h3 className="text-4xl font-bold mb-6">{formatCurrency(financial.balance)}</h3>
                        <button 
                            onClick={handleWithdraw}
                            disabled={requesting || financial.balance <= 0}
                            className="bg-brand-green-mid text-white px-6 py-3 rounded-xl font-bold hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {requesting ? 'Processando...' : 'Solicitar Saque'}
                        </button>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-brand-green-dark/50 to-transparent"></div>
                </div>
                 <div className="bg-white rounded-2xl border border-gray-100 p-8">
                     <h3 className="font-bold text-gray-900 mb-4">Dados Bancários</h3>
                     <p className="text-gray-500 text-sm mb-4">Cadastre sua chave PIX para receber seus bônus automaticamente.</p>
                     <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                         <div className="p-2 bg-white rounded shadow-sm"><QrCodeIcon className="h-5 w-5 text-gray-700" /></div>
                         <span className="font-mono text-gray-600">CPF: ***.123.456-**</span>
                         <button className="ml-auto text-brand-green-dark font-medium text-sm">Alterar</button>
                     </div>
                 </div>
            </div>
         </div>
    );
};

export const AdminPanelView = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Painel Administrativo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Total de Consultores</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">1,240</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Vendas Totais (Mês)</p>
                <h3 className="text-3xl font-bold text-brand-green-dark mt-2">R$ 45.200,00</h3>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Pedidos Pendentes</p>
                <h3 className="text-3xl font-bold text-orange-500 mt-2">18</h3>
            </div>
        </div>
    </div>
);

export const AdminGoalsView = () => {
    const [metrics, setMetrics] = useState<GoalMetrics[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulação de cálculo de metas (em produção seria uma View SQL ou Edge Function)
        const mockMetrics: GoalMetrics[] = MOCK_DATA.team.map(c => {
            const sales = parseCurrency(c.sales);
            const pct = sales / GOAL_TARGET;
            return {
                consultant_id: c.id,
                consultant_name: c.name,
                total_sales: sales,
                percentage: pct,
                status: pct >= 1 ? 'meta_batida' : pct >= GOAL_NEAR_PERCENT ? 'proximo' : 'distante',
                bonus_amount: pct >= 1 ? sales * BONUS_PERCENT : 0
            };
        });
        setMetrics(mockMetrics);
        setLoading(false);
    }, []);

    const totalBonus = metrics.reduce((acc, curr) => acc + curr.bonus_amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <h2 className="text-2xl font-serif font-bold text-gray-900">Painel de Metas</h2>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Bônus a Pagar</p>
                    <p className="text-2xl font-bold text-brand-green-dark">{formatCurrency(totalBonus)}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Consultor</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Vendas</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Progresso</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Bônus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={5} className="p-6 text-center">Calculando...</td></tr> : 
                         metrics.map(m => (
                            <tr key={m.consultant_id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                <td className="p-4 font-medium text-gray-900">{m.consultant_name}</td>
                                <td className="p-4 text-gray-600">{formatCurrency(m.total_sales)}</td>
                                <td className="p-4 w-1/3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${m.status === 'meta_batida' ? 'bg-green-500' : m.status === 'proximo' ? 'bg-yellow-400' : 'bg-gray-300'}`} 
                                                style={{ width: `${Math.min(m.percentage * 100, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold w-10">{(m.percentage * 100).toFixed(0)}%</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                        m.status === 'meta_batida' ? 'bg-green-50 border-green-200 text-green-700' : 
                                        m.status === 'proximo' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                                    }`}>
                                        {m.status === 'meta_batida' ? 'Meta Batida 🏆' : m.status === 'proximo' ? 'Quase lá 🚀' : 'Em andamento'}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-bold text-brand-green-dark">
                                    {m.bonus_amount > 0 ? formatCurrency(m.bonus_amount) : '-'}
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
        const { data, error } = await supabase
            .from('withdrawals')
            .select(`
                *,
                consultants (name, email)
            `)
            .order('created_at', { ascending: false });
        
        // Cast to unknown first to avoid deep type checking errors with Supabase joins
        const safeData = (data as unknown) as (Withdrawal & { consultants: { name: string, email: string } })[];
        
        if (!error && safeData) {
            setWithdrawals(safeData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('withdrawals')
            .update({ status: action, processed_at: new Date().toISOString() })
            .eq('id', id);

        if (!error) {
            fetchWithdrawals(); // Refresh
        } else {
            alert("Erro ao atualizar status");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Solicitações de Saque</h2>
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Data</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Consultor</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Valor</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={5} className="p-6 text-center">Carregando...</td></tr> : 
                         withdrawals.map(w => (
                            <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(w.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{w.consultants?.name || 'Desconhecido'}</div>
                                    <div className="text-xs text-gray-400">{w.consultants?.email}</div>
                                </td>
                                <td className="p-4 font-bold text-gray-900">{formatCurrency(w.amount)}</td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                        w.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        w.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {w.status === 'pending' ? 'Aguardando' : w.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    {w.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleAction(w.id, 'approved')}
                                                className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 transition"
                                            >
                                                Autorizar
                                            </button>
                                            <button 
                                                onClick={() => handleAction(w.id, 'rejected')}
                                                className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded hover:bg-red-200 transition"
                                            >
                                                Rejeitar
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                         {withdrawals.length === 0 && !loading && (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhuma solicitação encontrada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
