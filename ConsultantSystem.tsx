
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { useNavigate, useLocation, useOutletContext, Link } from 'react-router-dom';
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
    StoreIcon,
    UserCircleIcon,
    TargetIcon,
    HandshakeIcon,
    BellIcon,
    ChatIcon,
    ClipboardListIcon,
    ShieldCheckIcon
} from './components/Icons';
import { Consultant, Order, Sale, Material, Lesson, Withdrawal, GoalMetric } from './types';

// --- Context Type for Outlet ---
type DashboardContextType = {
    consultant: Consultant;
};

// --- THEME CONTEXT SYSTEM ---
type AdminTheme = 'green' | 'navy';

interface ThemeColors {
    primary: string; // Sidebar bg, dark cards
    accent: string;  // Buttons, highlights
    text: string;    // Headings
    secondary: string; // Lighter bg nuances
}

const THEMES: Record<AdminTheme, ThemeColors> = {
    green: {
        primary: '#0A382A', // Elevate Green
        accent: '#4CAF50',  // Vivid Green
        text: '#0A382A',
        secondary: '#14532d'
    },
    navy: {
        primary: '#0F172A', // Slate 900 (Midnight)
        accent: '#38BDF8',  // Sky 400 (Cyan/Blue)
        text: '#0F172A',
        secondary: '#1e293b'
    }
};

interface ThemeContextType {
    currentTheme: AdminTheme;
    setTheme: (theme: AdminTheme) => void;
    colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
    currentTheme: 'green',
    setTheme: () => {},
    colors: THEMES.green
});

export const AdminThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTheme, setCurrentTheme] = useState<AdminTheme>(() => {
        return (localStorage.getItem('admin_theme') as AdminTheme) || 'green';
    });

    const setTheme = (theme: AdminTheme) => {
        setCurrentTheme(theme);
        localStorage.setItem('admin_theme', theme);
    };

    const colors = THEMES[currentTheme];

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAdminTheme = () => useContext(ThemeContext);

// --- Helper Functions ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

// --- DATA SOURCE (Simulating API Response) ---
const DB_LOCAL_STATE = {
    team: [
        { id: '007053', name: 'Cleide Maia', role: 'Consultor', status: 'Ativo', sales: 'R$ 1.250,00', phone: '5511999999999', email: 'cleide@email.com', address: 'Rua das Flores, 123', city: 'São Paulo', state: 'SP', doc: '123.456.789-00', joinDate: '2023-10-01', invitedBy: '000000' },
        { id: '102031', name: 'João Santos', role: 'Consultor', status: 'Ativo', sales: 'R$ 5.200,00', phone: '5511988888888', email: 'joao@email.com', address: 'Av. Brasil, 500', city: 'Rio de Janeiro', state: 'RJ', doc: '222.333.444-55', joinDate: '2023-11-15', invitedBy: '007053' },
        { id: '102032', name: 'Ana Costa', role: 'Consultor', status: 'Inativo', sales: 'R$ 0,00', phone: '5511977777777', email: 'ana@email.com', address: 'Rua Projetada, 10', city: 'Salvador', state: 'BA', doc: '999.888.777-66', joinDate: '2023-09-10', invitedBy: '007053' },
        { id: '102033', name: 'Pedro Alves', role: 'Líder', status: 'Ativo', sales: 'R$ 3.450,00', phone: '5511966666666', email: 'pedro@email.com', address: 'Rua da Praia, 45', city: 'Recife', state: 'PE', doc: '555.666.777-88', joinDate: '2023-10-05', invitedBy: '000000' },
        { id: '102034', name: 'Carla Lima', role: 'Consultor', status: 'Ativo', sales: 'R$ 825,00', phone: '5511955555555', email: 'carla@email.com', address: 'Rua Nova, 88', city: 'Curitiba', state: 'PR', doc: '111.222.333-44', joinDate: '2023-12-01', invitedBy: '102033' },
        { id: '102035', name: 'Marcos Rocha', role: 'Consultor', status: 'Inativo', sales: 'R$ 0,00', phone: '5511944444444', email: 'marcos@email.com', address: 'Av. Central, 900', city: 'Porto Alegre', state: 'RS', doc: '444.555.666-99', joinDate: '2023-08-20', invitedBy: '102033' },
        { id: '102036', name: 'Julia Roberts', role: 'Líder', status: 'Ativo', sales: 'R$ 8.900,00', phone: '5511933333333', email: 'julia@email.com', address: 'Rua Oscar Freire, 1000', city: 'São Paulo', state: 'SP', doc: '777.888.999-00', joinDate: '2023-11-20', invitedBy: '000000' },
    ],
    financial: {
        balance: 3450.00,
        pendingWithdrawals: 0
    }
};

// --- Shared Modals ---
const OrderDetailsModal = ({ order, onClose }: { order: Order, onClose: () => void }) => {
    if (!order) return null;

    const qtyMatch = order.items.match(/(\d+)x/);
    const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
    const unitPrice = 210.00;
    const subtotal = qty * unitPrice;
    const shipping = order.total.includes('420,00') || order.total.includes('1.050,00') || order.total.includes('675,90') ? 0 : 45.90; 

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            <div className="bg-white rounded-[2rem] w-full max-w-3xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-serif font-bold text-brand-green-dark">Pedido #{order.id}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                order.status === 'Entregue' ? 'bg-green-100 text-green-700 border-green-200' :
                                order.status === 'Em trânsito' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                'bg-gray-100 text-gray-700 border-gray-200'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm font-medium mt-1">Realizado em {order.date}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="h-10 w-10 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <CloseIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="md:col-span-2 space-y-6">
                            <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-4">Itens do Pedido</h4>
                            <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
                                <div className="h-20 w-20 bg-white rounded-xl p-2 border border-gray-100 shrink-0">
                                    <img src="https://i.imgur.com/yNKoBxr.png" alt="Product" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-bold text-gray-800">Caixa Pomada Canela de Velho</h5>
                                    <p className="text-sm text-gray-500 mb-2">Display com 12 Unidades</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-medium bg-white px-2 py-1 rounded border border-gray-200">
                                            Qtd: {qty}
                                        </span>
                                        <span className="font-bold text-brand-green-dark">{formatCurrency(subtotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                             <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-4">Resumo</h4>
                             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Frete</span>
                                    <span>{shipping === 0 ? 'Grátis' : formatCurrency(shipping)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-brand-green-dark">
                                    <span>Total</span>
                                    <span>{order.total}</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button className="px-6 py-3 bg-brand-green-mid hover:bg-brand-green-dark text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all flex items-center gap-2">
                        <WhatsAppIcon className="h-5 w-5" />
                        Falar com Suporte sobre este Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};

const ConsultantDetailsModal = ({ consultant, onClose }: { consultant: any, onClose: () => void }) => {
    const { colors } = useAdminTheme();
    if (!consultant) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-[2rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col">
                <div 
                    className="px-8 py-6 flex justify-between items-center text-white"
                    style={{ backgroundColor: colors.primary }}
                >
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl border border-white/20">
                            {consultant.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold">{consultant.name}</h3>
                            <p className="text-white/70 text-sm">ID: {consultant.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                        <CloseIcon className="h-6 w-6 text-white" />
                    </button>
                </div>
                <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
                            <p className="text-lg font-medium text-gray-800">{consultant.email}</p>
                        </div>
                        <div>
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Telefone/WhatsApp</label>
                             <p className="text-lg font-medium text-gray-800">{consultant.phone}</p>
                        </div>
                        <div>
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">CPF</label>
                             <p className="text-lg font-medium text-gray-800">{consultant.doc}</p>
                        </div>
                         <div>
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</label>
                             <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold mt-1 ${
                                 consultant.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                             }`}>
                                 {consultant.status}
                             </span>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-6">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Endereço Completo</label>
                        <p className="text-lg font-medium text-gray-800 mt-1">{consultant.address}</p>
                        <p className="text-gray-500">{consultant.city} - {consultant.state}</p>
                    </div>
                    <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl text-center">
                            <p className="text-xs text-gray-500 mb-1">Vendas Totais</p>
                            <p className="text-xl font-bold text-brand-green-dark">{consultant.sales}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center">
                             <p className="text-xs text-gray-500 mb-1">Data de Cadastro</p>
                             <p className="text-lg font-bold text-gray-700">{new Date(consultant.joinDate).toLocaleDateString()}</p>
                        </div>
                         <div className="bg-gray-50 p-4 rounded-xl text-center">
                             <p className="text-xs text-gray-500 mb-1">Quem Indicou</p>
                             <p className="text-lg font-bold text-gray-700">{consultant.invitedBy}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- AUTH COMPONENTS ---

export const LoginScreen = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState(''); // ID or Email
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let emailToLogin = identifier.trim();

            // Detect if input is numeric ID (simple check)
            const isId = /^\d+$/.test(identifier);

            if (isId) {
                // If it's an ID, find the email
                const { data: consultant, error: searchError } = await supabase
                    .from('consultants')
                    .select('email')
                    .eq('id', identifier)
                    .single();

                if (searchError || !consultant) {
                    throw new Error('ID de consultor não encontrado.');
                }
                emailToLogin = consultant.email;
            }

            // Sign In
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: emailToLogin,
                password: password,
            });

            if (authError) throw authError;

            // Auth successful, Profile check in ProtectedRoute will handle redirection
            // But we can help it a bit by fetching role here if we wanted to be explicit
            navigate('/consultor/dashboard');

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-green-dark relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-green-mid rounded-full blur-[100px]"></div>
                 <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-earth rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-10">
                    <div className="text-center mb-10">
                        <BrandLogo className="h-16 mx-auto mb-6" />
                        <h2 className="text-3xl font-serif font-bold text-brand-green-dark mb-2">Bem-vindo</h2>
                        <p className="text-gray-500">Acesse sua conta para continuar.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">ID Consultor ou E-mail</label>
                            <div className="relative">
                                <UserCircleIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-mid focus:border-transparent outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
                                    placeholder="Digite seu ID ou E-mail"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Senha</label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-mid focus:border-transparent outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
                                    placeholder="••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-500 cursor-pointer hover:text-gray-700">
                                <input type="checkbox" className="mr-2 rounded text-brand-green-mid focus:ring-brand-green-mid" />
                                Lembrar-me
                            </label>
                            <a href="#" className="font-bold text-brand-green-dark hover:text-brand-green-mid transition-colors">Esqueceu a senha?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-green-dark hover:bg-brand-green-mid text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Entrando...' : 'Entrar na Conta'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Não tem uma conta?{' '}
                            <Link to="/cadastro" className="font-bold text-brand-green-mid hover:text-brand-green-dark transition-colors">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminLoginScreen = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // ADMIN MAGIC LOGIN
            if (identifier === '000000' && password === 'jo1234') {
                // Check if admin exists
                 const { data: adminExists } = await supabase
                    .from('consultants')
                    .select('id')
                    .eq('id', '000000')
                    .single();

                if (!adminExists) {
                     // Create Admin Auth
                     const { data: authData, error: signupError } = await supabase.auth.signUp({
                         email: 'admin@brotos.com',
                         password: 'jo1234',
                     });
                     
                     if (signupError && !signupError.message.includes('already registered')) throw signupError;

                     // Create Admin Profile
                     if (authData.user) {
                         const { error: profileError } = await supabase
                             .from('consultants')
                             .insert({
                                 id: '000000',
                                 auth_id: authData.user.id,
                                 name: 'Administrador Principal',
                                 email: 'admin@brotos.com',
                                 role: 'admin',
                                 whatsapp: '00000000000'
                             });
                         if (profileError) console.error('Error creating admin profile:', profileError);
                     }
                }

                // Log in as Admin
                const { error: loginError } = await supabase.auth.signInWithPassword({
                    email: 'admin@brotos.com',
                    password: 'jo1234'
                });

                if (loginError) throw loginError;
                navigate('/admin/dashboard');
                return;
            }

            // Normal admin login (if credentials changed)
            await supabase.auth.signInWithPassword({
                email: identifier.includes('@') ? identifier : 'admin@brotos.com', 
                password 
            });
            navigate('/admin/dashboard');

        } catch (err: any) {
            setError('Acesso negado. Credenciais inválidas.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#051c15] relative overflow-hidden font-sans">
             {/* Abstract Lines */}
             <div className="absolute inset-0 opacity-20" 
                  style={{backgroundImage: 'radial-gradient(circle at 50% 50%, #104936 0%, transparent 50%)'}}>
             </div>

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="bg-white rounded-[2rem] shadow-2xl p-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-green-dark text-white mb-6 shadow-xl shadow-green-900/30">
                           <ShieldCheckIcon className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Portal Master</h2>
                        <p className="text-gray-500 text-sm">Acesso restrito à administração</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                            <span className="block w-2 h-2 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">ID MASTER</label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-dark focus:border-transparent outline-none transition-all font-mono text-gray-800 placeholder-gray-400 tracking-wider"
                                placeholder="000000"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Chave de Acesso</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green-dark focus:border-transparent outline-none transition-all font-mono text-gray-800 placeholder-gray-400"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-green-dark hover:bg-[#051c15] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all mt-4"
                        >
                            {loading ? 'Verificando...' : 'Acessar Painel'}
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center">
                         <Link to="/login" className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors">
                             ← Voltar para Login Comum
                         </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ConsultantRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        whatsapp: '',
        cpf: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateId = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Create Auth User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Erro ao criar usuário.");

            // 2. Create Consultant Profile
            const newId = generateId();
            const { error: dbError } = await supabase
                .from('consultants')
                .insert({
                    id: newId,
                    auth_id: authData.user.id,
                    name: formData.name,
                    email: formData.email,
                    whatsapp: formData.whatsapp,
                    document_id: formData.cpf,
                    role: 'consultant'
                });

            if (dbError) throw dbError;

            // 3. Login immediately
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });
            
            if (loginError) throw loginError;

            navigate('/consultor/dashboard');

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Erro ao realizar cadastro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl">
                <div className="text-center">
                    <BrandLogo className="h-12 mx-auto mb-4" />
                    <h2 className="text-3xl font-serif font-bold text-brand-green-dark">Crie sua Conta</h2>
                    <p className="mt-2 text-gray-600">Junte-se à nossa rede de sucesso</p>
                </div>
                
                {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        <input
                            type="text"
                            required
                            className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green-mid focus:border-brand-green-mid focus:z-10 sm:text-sm"
                            placeholder="Nome Completo"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <input
                            type="email"
                            required
                            className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green-mid focus:border-brand-green-mid focus:z-10 sm:text-sm"
                            placeholder="Endereço de Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                         <input
                            type="text"
                            required
                            className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green-mid focus:border-brand-green-mid focus:z-10 sm:text-sm"
                            placeholder="WhatsApp (com DDD)"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                        />
                         <input
                            type="text"
                            required
                            className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green-mid focus:border-brand-green-mid focus:z-10 sm:text-sm"
                            placeholder="CPF"
                            value={formData.cpf}
                            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                        />
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green-mid focus:border-brand-green-mid focus:z-10 sm:text-sm"
                            placeholder="Senha"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-green-dark hover:bg-brand-green-mid focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-mid transition-colors shadow-lg"
                        >
                            {loading ? 'Criando conta...' : 'Cadastrar'}
                        </button>
                    </div>
                    <div className="text-center">
                        <Link to="/login" className="text-sm font-medium text-brand-green-dark hover:text-brand-green-mid">
                            Já tem uma conta? Entre aqui
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- DASHBOARD SHELL ---

export const DashboardShell = ({ children, consultant }: { children?: React.ReactNode, consultant: Consultant }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { colors } = useAdminTheme();

    const isAdmin = consultant.role === 'admin';
    const activePath = location.pathname;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate(isAdmin ? '/portal-master' : '/login');
    };

    const NavItem = ({ to, icon: Icon, label, exact = false }: any) => {
        const isActive = exact 
            ? activePath === to 
            : activePath.startsWith(to);

        // Styling variants
        const baseStyle = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-sm";
        const adminActive = "bg-white text-brand-green-dark shadow-sm translate-x-1";
        const adminInactive = "text-white/60 hover:text-white hover:bg-white/5";
        
        const consultantActive = "bg-brand-green-dark text-white shadow-lg shadow-green-900/20";
        const consultantInactive = "text-gray-500 hover:bg-gray-100 hover:text-brand-green-dark";

        const style = isAdmin 
            ? `${baseStyle} ${isActive ? adminActive : adminInactive}`
            : `${baseStyle} ${isActive ? consultantActive : consultantInactive}`;

        return (
            <Link to={to} className={style}>
                <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                    isAdmin && isActive ? 'text-brand-green-mid' : ''
                }`} />
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <div className={`min-h-screen flex ${isAdmin ? 'bg-gray-100' : 'bg-gray-50'}`}>
            {/* Sidebar */}
            <aside 
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:static flex flex-col
                    ${isAdmin ? '' : 'bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]'}
                `}
                style={isAdmin ? { backgroundColor: colors.primary } : {}}
            >
                {/* Logo Area */}
                <div className="h-24 flex items-center px-8">
                     {isAdmin ? (
                         <div className="w-full bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5 flex items-center justify-center">
                             <BrandLogo className="h-8 brightness-0 invert" />
                         </div>
                     ) : (
                         <BrandLogo className="h-10" />
                     )}
                </div>

                {/* User Profile Snippet */}
                <div className="px-6 mb-8">
                    <div className={`p-4 rounded-2xl ${isAdmin ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold border-2 ${
                                isAdmin ? 'bg-brand-green-mid text-white border-white/20' : 'bg-white text-brand-green-dark border-gray-200'
                            }`}>
                                {consultant.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <h3 className={`font-bold truncate ${isAdmin ? 'text-white' : 'text-gray-900'}`}>
                                    {consultant.name.split(' ')[0]}
                                </h3>
                                <p className={`text-[10px] uppercase tracking-wider font-bold ${isAdmin ? 'text-white/50' : 'text-gray-400'}`}>
                                    ID: {consultant.id}
                                </p>
                            </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest text-center ${
                             isAdmin ? 'bg-brand-green-mid text-white' : 'bg-brand-green-dark text-white'
                        }`}>
                            {consultant.role === 'admin' ? 'Administrador' : consultant.role === 'leader' ? 'Líder' : 'Consultor'}
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-6">
                    {/* ADMIN MENU STRUCTURE */}
                    {isAdmin && (
                        <>
                            <div>
                                <h4 className="px-4 text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] mb-3">Gerenciamento Central</h4>
                                <div className="space-y-1">
                                    <NavItem to="/admin/dashboard" icon={ChartBarIcon} label="Dashboard Gerencial" exact />
                                    <NavItem to="/admin/negocio" icon={BriefcaseIcon} label="Meu Negócio" />
                                    <NavItem to="/admin/usuarios" icon={UsersIcon} label="Administração" />
                                </div>
                            </div>

                            <div>
                                <h4 className="px-4 text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] mb-3">Relatórios e Finanças</h4>
                                <div className="space-y-1">
                                    <NavItem to="/admin/financeiro" icon={BanknotesIcon} label="Financeiro" />
                                    <NavItem to="/admin/relatorios" icon={PresentationChartLineIcon} label="Relatórios" />
                                    <NavItem to="/admin/metas" icon={TargetIcon} label="Metas da Equipe" />
                                    <NavItem to="/admin/saques" icon={CurrencyDollarIcon} label="Solicitações de Saque" />
                                </div>
                            </div>

                            <div>
                                <h4 className="px-4 text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] mb-3">Sistema e Suporte</h4>
                                <div className="space-y-1">
                                    <NavItem to="/admin/suporte" icon={ChatIcon} label="Suporte e Tickets" />
                                    <NavItem to="/admin/config" icon={ClipboardListIcon} label="Configurações" />
                                </div>
                            </div>
                        </>
                    )}

                    {/* CONSULTANT MENU STRUCTURE */}
                    {!isAdmin && (
                        <>
                            <div className="space-y-1">
                                <NavItem to="/consultor/dashboard" icon={ChartBarIcon} label="Visão Geral" exact />
                                <NavItem to="/consultor/materiais" icon={PhotoIcon} label="Materiais de Apoio" />
                                <NavItem to="/consultor/unibrotos" icon={AcademicCapIcon} label="UniBrotos" />
                            </div>

                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <h4 className="px-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-3">Vendas</h4>
                                <div className="space-y-1">
                                    <NavItem to="/consultor/meus-pedidos" icon={PackageIcon} label="Meus Pedidos" />
                                    <NavItem to="/consultor/novo-pedido" icon={ShoppingCartIcon} label="Fazer Pedido" />
                                </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <h4 className="px-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-3">Expansão</h4>
                                <div className="space-y-1">
                                    <NavItem to="/consultor/convidar" icon={UserPlusIcon} label="Convidar Consultor" />
                                    {consultant.role === 'leader' && (
                                        <>
                                            <NavItem to="/consultor/meu-negocio" icon={BriefcaseIcon} label="Meu Negócio" />
                                            <NavItem to="/consultor/financeiro" icon={BanknotesIcon} label="Financeiro" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </nav>

                {/* Logout Action */}
                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-sm ${
                            isAdmin 
                            ? "text-red-400 hover:bg-red-500/10 hover:text-red-300" 
                            : "text-gray-500 hover:bg-red-50 hover:text-red-600"
                        }`}
                    >
                        <LogoutIcon className="h-5 w-5" />
                        <span>Sair do Sistema</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
                    <BrandLogo className="h-8" />
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-500 rounded-lg hover:bg-gray-100"
                    >
                        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </header>

                {/* Scrollable Viewport */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-10">
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
    const salesGoal = 5000;
    const currentSales = 1250;
    const progress = (currentSales / salesGoal) * 100;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Olá, {consultant.name.split(' ')[0]}! 👋</h1>
                    <p className="text-gray-500 mt-1">Aqui está o resumo do seu negócio hoje.</p>
                </div>
                <Link to="/consultor/novo-pedido" className="bg-brand-green-dark hover:bg-brand-green-mid text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all flex items-center gap-2">
                    <ShoppingCartIcon className="h-5 w-5" />
                    Fazer Pedido
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                    { label: 'Vendas no Mês', value: formatCurrency(currentSales), icon: TrendingUpIcon, color: 'bg-green-100 text-green-700' },
                    { label: 'Lucro Estimado', value: formatCurrency(currentSales * 0.5), icon: BanknotesIcon, color: 'bg-blue-100 text-blue-700' },
                    { label: 'Novos Clientes', value: '12', icon: UserPlusIcon, color: 'bg-purple-100 text-purple-700' },
                    { label: 'Aulas Assistidas', value: '8/12', icon: AcademicCapIcon, color: 'bg-orange-100 text-orange-700' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">HOJE</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Goal Progress */}
            <div className="bg-brand-green-dark rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green-mid rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Meta Mensal</h3>
                            <p className="text-white/60 text-sm">Faltam {formatCurrency(salesGoal - currentSales)} para atingir seu objetivo</p>
                        </div>
                        <span className="text-3xl font-bold">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-green-mid rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                 <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-brand-green-mid rounded-full block"></span>
                    Últimas Vendas
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Produto</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Valor</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[
                                    { client: 'Maria Silva', product: 'Pomada Canela de Velho', price: 'R$ 35,00', status: 'Pago' },
                                    { client: 'João Souza', product: 'Kit 3 Pomadas', price: 'R$ 100,00', status: 'Pendente' },
                                    { client: 'Ana Clara', product: 'Pomada Sucupira', price: 'R$ 35,00', status: 'Pago' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{row.client}</td>
                                        <td className="px-6 py-4 text-gray-500">{row.product}</td>
                                        <td className="px-6 py-4 font-bold text-gray-700">{row.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                row.status === 'Pago' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminOverviewView = () => {
    // --- Revenue Growth Simulator Logic ---
    const [newConsultants, setNewConsultants] = useState(100);
    const [activationRate, setActivationRate] = useState(20);
    const [ticket, setTicket] = useState(250);

    const projectedRevenue = useMemo(() => {
        const activeNew = newConsultants * (activationRate / 100);
        return activeNew * ticket * 12; // Annualized projection example or monthly scaled
    }, [newConsultants, activationRate, ticket]);

    // Network Summary Logic
    const activeConsultants = DB_LOCAL_STATE.team.filter(c => c.status === 'Ativo').length;
    const totalConsultants = DB_LOCAL_STATE.team.length;
    const inactiveConsultants = totalConsultants - activeConsultants;

    return (
        <div className="space-y-10 animate-fade-in">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-brand-green-dark">Olá, Administrador 👋</h1>
                    <p className="text-gray-500 mt-2 font-medium">Visão global e estratégica da rede.</p>
                </div>
            </div>

            {/* Network Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Consultores Ativos', value: activeConsultants, icon: UsersIcon, color: '#4CAF50', bg: 'bg-green-50' },
                    { title: 'Novos Cadastros', value: '14', icon: SparklesIcon, color: '#1C2833', bg: 'bg-gray-50' },
                    { title: 'Inativos', value: inactiveConsultants, icon: UserCircleIcon, color: '#EF4444', bg: 'bg-red-50' },
                    { title: 'Total Indicações', value: '42', icon: HandshakeIcon, color: '#F59E0B', bg: 'bg-yellow-50' }
                ].map((card, idx) => (
                    <Link to="/admin/usuarios" key={idx} className={`${card.bg} p-6 rounded-3xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                                <card.icon className="h-6 w-6" style={{ color: card.color }} />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{card.value}</span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{card.title}</h3>
                    </Link>
                ))}
            </div>

            {/* Revenue Growth Simulator (Premium) */}
            <div className="bg-brand-green-dark rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                {/* Background FX */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green-mid rounded-full blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-3xl font-serif font-bold mb-2">Simulador de Crescimento</h2>
                            <p className="text-white/60">Projete o impacto das suas estratégias na receita global.</p>
                        </div>

                        <div className="space-y-6">
                             {/* Slider 1 */}
                             <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                                <div className="flex justify-between mb-4">
                                    <span className="font-bold text-sm uppercase tracking-widest text-brand-green-mid">Novos Cadastros / Mês</span>
                                    <span className="font-mono text-xl">{newConsultants}</span>
                                </div>
                                <input 
                                    type="range" min="0" max="500" value={newConsultants} 
                                    onChange={(e) => setNewConsultants(Number(e.target.value))}
                                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-green-mid"
                                />
                             </div>

                             {/* Slider 2 */}
                             <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                                <div className="flex justify-between mb-4">
                                    <span className="font-bold text-sm uppercase tracking-widest text-brand-green-mid">Taxa de Ativação</span>
                                    <span className="font-mono text-xl">{activationRate}%</span>
                                </div>
                                <input 
                                    type="range" min="0" max="100" value={activationRate} 
                                    onChange={(e) => setActivationRate(Number(e.target.value))}
                                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-green-mid"
                                />
                             </div>

                             {/* Slider 3 */}
                             <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                                <div className="flex justify-between mb-4">
                                    <span className="font-bold text-sm uppercase tracking-widest text-brand-green-mid">Ticket Médio Alvo</span>
                                    <span className="font-mono text-xl">{formatCurrency(ticket)}</span>
                                </div>
                                <input 
                                    type="range" min="50" max="1000" step="10" value={ticket} 
                                    onChange={(e) => setTicket(Number(e.target.value))}
                                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-green-mid"
                                />
                             </div>
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center backdrop-blur-md border border-white/10">
                        <p className="text-sm font-bold uppercase tracking-widest text-brand-green-mid mb-2">Potencial de Receita (Anual)</p>
                        <div className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            {formatCurrency(projectedRevenue)}
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed max-w-xs">
                            *Estimativa baseada na entrada mensal constante de novos consultores ativos multiplicada pelo ticket médio ao longo de 12 meses.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminPanelView = () => {
    const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
    const { colors } = useAdminTheme();

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                     <h1 className="text-3xl font-serif font-bold" style={{ color: colors.text }}>Gestão de Usuários</h1>
                     <p className="text-gray-500 mt-1">Base completa de consultores cadastrados.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
                        <FilterIcon className="h-4 w-4" /> Filtros
                    </button>
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
                        <DownloadIcon className="h-4 w-4" /> Exportar
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Consultor</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Vendas Totais</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(DB_LOCAL_STATE.team || []).map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-brand-green-light text-brand-green-dark flex items-center justify-center font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{member.name}</p>
                                                <p className="text-xs text-gray-500 font-mono">ID: {member.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                            member.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                member.status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'
                                            }`}></span>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-gray-700">{member.sales}</td>
                                    <td className="px-8 py-5 text-right">
                                        <button 
                                            onClick={() => setSelectedConsultant(member)}
                                            className="text-brand-green-mid hover:text-brand-green-dark font-bold text-sm px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                                        >
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedConsultant && (
                <ConsultantDetailsModal 
                    consultant={selectedConsultant} 
                    onClose={() => setSelectedConsultant(null)} 
                />
            )}
        </div>
    );
};

export const FinancialView = () => {
    // Shared view for simplicity, logic can be split based on role
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="bg-brand-dark-card rounded-3xl p-8 text-white">
                <h2 className="text-2xl font-serif font-bold mb-6">Financeiro</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                        <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-1">Saldo Disponível</p>
                        <p className="text-3xl font-bold">{formatCurrency(DB_LOCAL_STATE.financial.balance)}</p>
                    </div>
                     <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                        <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-1">A Receber</p>
                        <p className="text-3xl font-bold">R$ 0,00</p>
                    </div>
                     <button className="bg-brand-green-mid hover:bg-white hover:text-brand-green-dark text-white p-6 rounded-2xl font-bold transition-all flex flex-col items-center justify-center gap-2">
                        <CurrencyDollarIcon className="h-8 w-8" />
                        Solicitar Saque
                    </button>
                </div>
            </div>
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center py-20">
                <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                     <BanknotesIcon className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Nenhuma transação recente</h3>
                <p className="text-gray-500">Seu histórico financeiro aparecerá aqui.</p>
            </div>
        </div>
    );
};

// --- PLACEHOLDER & OPERATIONAL VIEWS ---

export const MaterialsView = () => (
    <div className="animate-fade-in">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Materiais de Apoio</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1, 2, 3, 4, 5, 6].map((item) => (
                 <div key={item} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                     <div className="aspect-square bg-gray-100 relative overflow-hidden">
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                             <button className="bg-white text-brand-green-dark px-6 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                 Baixar
                             </button>
                         </div>
                     </div>
                     <div className="p-4">
                         <h3 className="font-bold text-gray-900">Material de Campanha #{item}</h3>
                         <p className="text-sm text-gray-500">Post para Instagram • PNG</p>
                     </div>
                 </div>
             ))}
        </div>
    </div>
);

export const UniBrotosView = () => (
     <div className="animate-fade-in">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">UniBrotos</h1>
        <div className="bg-brand-green-dark rounded-3xl p-8 text-white mb-8 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold mb-2">Continue aprendendo</h2>
                <p className="text-white/70">Módulo 2: Técnicas de Venda Avançadas</p>
            </div>
            <PlayCircleIcon className="h-16 w-16 text-brand-green-mid hover:scale-110 transition-transform cursor-pointer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-brand-green-mid transition-colors cursor-pointer">
                    <div className="h-24 w-32 bg-gray-200 rounded-xl shrink-0"></div>
                    <div>
                        <span className="text-xs font-bold text-brand-green-mid uppercase tracking-wider">Aula {i}</span>
                        <h3 className="font-bold text-gray-900 mt-1">Como abordar clientes no WhatsApp</h3>
                        <p className="text-sm text-gray-500 mt-2">15 min</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const MyOrdersView = () => (
     <div className="animate-fade-in">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Meus Pedidos</h1>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 text-center text-gray-500">
                 Nenhum pedido realizado recentemente.
             </div>
        </div>
    </div>
);

export const NewOrderView = () => (
     <div className="animate-fade-in">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Fazer Pedido</h1>
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
             <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
             <h2 className="text-xl font-bold text-gray-900 mb-2">Catálogo de Produtos</h2>
             <p className="text-gray-500 mb-6">Selecione os produtos para revenda.</p>
             <button className="bg-brand-green-mid text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-green-dark transition-colors">
                 Ver Catálogo
             </button>
        </div>
    </div>
);

export const InviteView = () => (
    <div className="animate-fade-in max-w-2xl mx-auto text-center pt-10">
        <div className="bg-brand-green-light w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlusIcon className="h-10 w-10 text-brand-green-dark" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-brand-green-dark mb-4">Expanda sua Equipe</h1>
        <p className="text-gray-600 mb-8 text-lg">Envie seu link exclusivo para novos consultores e ganhe comissões sobre as vendas da sua rede.</p>
        
        <div className="bg-white p-2 rounded-2xl border border-gray-200 flex items-center shadow-sm mb-6">
            <input 
                type="text" 
                readOnly 
                value="https://clube.brotosdaterra.com.br/cadastro?ref=102030"
                className="flex-1 p-4 outline-none text-gray-600 font-mono text-sm bg-transparent"
            />
            <button className="bg-brand-green-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-green-mid transition-colors flex items-center gap-2">
                <ClipboardCopyIcon className="h-5 w-5" />
                Copiar
            </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
             <button className="p-4 bg-[#25D366] text-white rounded-xl font-bold flex flex-col items-center gap-2 hover:opacity-90">
                 <WhatsAppIcon className="h-6 w-6" /> WhatsApp
             </button>
             {/* More share buttons... */}
        </div>
    </div>
);

export const BusinessView = () => (
    <div className="animate-fade-in">
         <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Meu Negócio</h1>
         <div className="bg-white rounded-2xl p-8 border border-gray-100">
             <p className="text-gray-500">Estatísticas detalhadas da sua rede.</p>
         </div>
    </div>
);

// --- ADMIN SPECIFIC VIEWS ---

export const AdminReportsView = () => (
    <div className="animate-fade-in">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Relatórios Globais</h1>
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <PresentationChartLineIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Relatórios detalhados em desenvolvimento.</p>
        </div>
    </div>
);

export const AdminSupportView = () => (
    <div className="animate-fade-in">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Central de Suporte</h1>
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <ChatIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Sistema de tickets será implementado aqui.</p>
        </div>
    </div>
);

export const AdminSettingsView = () => (
    <div className="animate-fade-in">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Configurações do Sistema</h1>
        <div className="bg-white rounded-2xl p-8 border border-gray-100 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Preferências Gerais</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Manutenção do Sistema</span>
                    <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                    </div>
                </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Novos Cadastros</span>
                    <div className="w-12 h-6 bg-brand-green-mid rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const AdminGoalsView = () => {
    // --- Team Goals Logic ---
    const goals: GoalMetric[] = DB_LOCAL_STATE.team.map(member => {
        // Parse currency string to number for demo
        const salesNum = parseFloat(member.sales.replace('R$ ', '').replace('.', '').replace(',', '.'));
        const goal = 5000; // Static goal for demo
        return {
            consultant_id: member.id,
            name: member.name,
            total_sales: salesNum,
            goal: goal,
            percentage: Math.min((salesNum / goal) * 100, 100)
        };
    }).sort((a, b) => b.percentage - a.percentage);

    const totalBonus = goals.filter(g => g.percentage >= 100).length * 500; // Demo bonus rule

    return (
        <div className="animate-fade-in space-y-8">
            <h1 className="text-3xl font-serif font-bold text-brand-green-dark">Painel de Metas da Equipe</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-dark-card text-white p-6 rounded-3xl">
                    <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Bonificação Estimada</p>
                    <p className="text-4xl font-bold mt-2">{formatCurrency(totalBonus)}</p>
                    <p className="text-xs mt-4 opacity-60">Valor total a pagar este mês</p>
                </div>
                 <div className="bg-white p-6 rounded-3xl border border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Bateram a Meta</p>
                    <p className="text-4xl font-bold text-brand-green-mid mt-2">{goals.filter(g => g.percentage >= 100).length}</p>
                </div>
                 <div className="bg-white p-6 rounded-3xl border border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Próximos (80%+)</p>
                    <p className="text-4xl font-bold text-yellow-500 mt-2">{goals.filter(g => g.percentage >= 80 && g.percentage < 100).length}</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900">Progresso Individual</h3>
                </div>
                <div className="p-6 space-y-6">
                    {goals.map((metric) => (
                        <div key={metric.consultant_id}>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="font-bold text-gray-900">{metric.name}</p>
                                    <p className="text-xs text-gray-500">{formatCurrency(metric.total_sales)} / {formatCurrency(metric.goal)}</p>
                                </div>
                                <span className={`font-bold ${metric.percentage >= 100 ? 'text-brand-green-mid' : 'text-gray-600'}`}>
                                    {metric.percentage.toFixed(0)}%
                                </span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${
                                        metric.percentage >= 100 ? 'bg-brand-green-mid' : 
                                        metric.percentage >= 80 ? 'bg-yellow-400' : 'bg-gray-400'
                                    }`} 
                                    style={{ width: `${metric.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const AdminWithdrawalsView = () => {
    // Mock withdrawals
    const withdrawals: Withdrawal[] = [
        { id: 'wd-1', consultant_id: '102031', amount: 1250.00, status: 'pending', created_at: '2023-12-01' },
        { id: 'wd-2', consultant_id: '102033', amount: 500.00, status: 'approved', created_at: '2023-11-28', processed_at: '2023-11-29' }
    ];

    return (
        <div className="animate-fade-in space-y-8">
            <h1 className="text-3xl font-serif font-bold text-brand-green-dark">Solicitações de Saque</h1>
            
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Consultor ID</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Valor</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {withdrawals.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhuma solicitação pendente.</td></tr>
                        ) : withdrawals.map(w => (
                            <tr key={w.id} className="hover:bg-gray-50">
                                <td className="px-8 py-5 font-mono text-sm text-gray-500">#{w.id}</td>
                                <td className="px-8 py-5 font-mono text-sm font-bold text-gray-700">{w.consultant_id}</td>
                                <td className="px-8 py-5 font-bold text-gray-900">{formatCurrency(w.amount)}</td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        w.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {w.status === 'pending' ? 'Aguardando' : w.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    {w.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 font-bold text-xs">
                                                Aprovar
                                            </button>
                                            <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs">
                                                Rejeitar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};
