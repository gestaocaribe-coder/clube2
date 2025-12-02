
import React, { useState, useEffect } from 'react';
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
    BriefcaseIcon
} from './components/Icons';
import { Consultant, ConsultantStats, Sale, Notification, PrivateCustomer, PrivateSale, Material, Lesson, Order } from './types';

// --- Helper Functions ---

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

// --- Centralized Mock Data (Fallback & Team Data) ---
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

// --- Components ---

const OrderDetailsModal = ({ order, onClose }: { order: Order, onClose: () => void }) => {
    if (!order) return null;

    const qtyMatch = order.items.match(/(\d+)x/);
    const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
    // Assuming mock price for calculation display inside modal logic
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
                                    <h5 className="font-bold text-gray-800">Caixa Pomada de Copaíba</h5>
                                    <p className="text-xs text-gray-500 mb-2">{order.items}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Qtd: {qty}</span>
                                        <span className="font-bold text-brand-green-dark">{formatCurrency(subtotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-4">Entrega</h4>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-start gap-3 mb-4">
                                    <LocationIcon />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Endereço de Entrega</p>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            Rua das Flores, 123<br />
                                            Jardim Botânico<br />
                                            São Paulo - SP<br />
                                            CEP: 01234-567
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                    <TruckIcon className="h-4 w-4 text-brand-green-mid" />
                                    <p className="text-xs font-medium text-brand-green-dark">Sedex Express</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                         <div className="space-y-3">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Frete</span>
                                <span>{shipping === 0 ? 'Grátis' : formatCurrency(shipping)}</span>
                            </div>
                            <div className="h-px bg-gray-200 my-2"></div>
                            <div className="flex justify-between items-center text-xl font-bold text-brand-green-dark">
                                <span>Total</span>
                                <span>{order.total}</span>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <button className="text-sm font-bold text-gray-500 hover:text-brand-green-dark flex items-center gap-2 transition-colors">
                        <DownloadIcon className="h-4 w-4" />
                        Baixar Nota Fiscal
                    </button>
                    <button 
                        onClick={onClose}
                        className="bg-brand-green-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-mid transition-colors shadow-lg shadow-brand-green-mid/20"
                    >
                        Fechar Detalhes
                    </button>
                </div>
            </div>
        </div>
    );
};

const EarningsSimulator = () => {
    const [dailyGoal, setDailyGoal] = useState(4);
    const profitPerUnit = 17.50;
    const workingDays = 30;

    const calculateMonthly = (daily: number) => daily * profitPerUnit * workingDays;

    return (
        <div className="bg-[#2E5C31] rounded-[2rem] p-8 shadow-xl border border-[#374151] animate-slide-up mt-8 text-white">
            <div className="flex items-start gap-4 mb-8">
                <div className="bg-white/10 p-3 rounded-xl text-[#4ADE80]">
                    <CurrencyDollarIcon className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="text-2xl font-serif font-bold text-white">Simulador de Ganhos</h3>
                    <p className="text-gray-300 mt-1 max-w-2xl">
                        Visualize o potencial do seu esforço. Pequenas metas diárias constroem grandes resultados mensais.
                        <span className="text-xs block mt-1 opacity-70">*Considerando 30 dias e lucro de R$ 17,50 por unidade.</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[2, 5, 10].map((units) => (
                    <div key={units} className="bg-[#1F2937] rounded-2xl p-6 border border-[#374151] hover:border-[#4ADE80]/30 transition-colors">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Meta Diária</p>
                        <p className="text-gray-300 font-medium mb-4">
                            Vender <strong className="text-[#4ADE80]">{units}</strong> pomadas
                        </p>
                        <hr className="border-gray-700 mb-4" />
                        <p className="text--[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">Ganho Mensal Estimado</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(calculateMonthly(units))}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#1F2937] rounded-2xl p-8 border border-[#374151]">
                <div className="text-center mb-8">
                    <h4 className="text-lg font-bold text-white mb-6">Quanto você quer ganhar este mês?</h4>
                    
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                         <span className="text-5xl md:text-6xl font-bold text-[#4ADE80] tracking-tight">
                            {formatCurrency(calculateMonthly(dailyGoal))}
                        </span>
                        <div className="px-4 py-2 bg-[#374151] rounded-lg shadow-sm border border-gray-600">
                             <span className="text-sm font-bold text-white">~{dailyGoal} un/dia</span>
                             <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">Sua Meta</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4">
                    <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={dailyGoal}
                        onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4ADE80] hover:accent-brand-green-mid transition-all"
                    />
                    <div className="flex justify-between mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>R$ 500</span>
                        <span>R$ 3.000</span>
                        <span>R$ 10.000+</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BusinessModelSection = () => {
    const [mode, setMode] = useState<'sales' | 'team'>('sales');

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-[#2E5C31] text-white p-8 md:p-12 rounded-[2rem] flex flex-col lg:flex-row gap-12 items-center shadow-2xl overflow-hidden relative transition-all duration-500">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-900/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex-1 space-y-8 relative z-10 w-full">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#1F2937] text-[#4ADE80] text-xs font-extrabold tracking-widest uppercase border border-[#374151]">
                        Modelo de Negócio
                    </span>
                    
                    <h2 className="text-4xl md:text-5xl font-serif font-bold leading-[1.1]">
                        Faça seu negócio <br />
                        <span className="text-[#4ADE80]">do seu jeito</span>
                    </h2>
                    
                    <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                        Liberdade total. Escolha entre lucro rápido com vendas diretas ou construa um legado duradouro formando sua própria equipe.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button 
                            onClick={() => setMode('sales')}
                            className={`flex items-center justify-center sm:justify-start gap-4 px-8 py-5 rounded-2xl font-bold transition-all duration-300 w-full sm:w-auto group ${
                                mode === 'sales' 
                                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' 
                                : 'bg-[#1F2937] text-white hover:bg-[#374151] border border-[#374151]'
                            }`}
                        >
                            <ShoppingCartIcon className={`h-6 w-6 ${mode === 'sales' ? 'text-black' : 'text-[#4ADE80]'}`} />
                            <div className="text-left leading-tight">
                                <span className="block text-sm opacity-80 uppercase tracking-wider text-[10px]">Foco em</span>
                                <span className="text-lg">Venda Direta</span>
                            </div>
                        </button>
                        
                        <button 
                            onClick={() => setMode('team')}
                            className={`flex items-center justify-center sm:justify-start gap-4 px-8 py-5 rounded-2xl font-bold transition-all duration-300 w-full sm:w-auto group ${
                                mode === 'team' 
                                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' 
                                : 'bg-[#1F2937] text-white hover:bg-[#374151] border border-[#374151]'
                            }`}
                        >
                            <UsersIcon className={`h-6 w-6 ${mode === 'team' ? 'text-black' : 'text-[#4ADE80]'}`} />
                            <div className="text-left leading-tight">
                                <span className="block text-sm opacity-80 uppercase tracking-wider text-[10px]">Foco em</span>
                                <span className="text-lg">Construção de Time</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-md relative z-10">
                    <div className="bg-[#0F1115] p-8 rounded-[2rem] border border-[#1F2937] shadow-xl relative overflow-hidden h-full min-h-[420px] flex flex-col">
                        
                        <div className="flex bg-[#050608] p-1.5 rounded-xl mb-10 border border-[#1F2937]">
                            <button 
                                onClick={() => setMode('sales')}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                                    mode === 'sales' 
                                    ? 'bg-white text-black shadow-md' 
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                Revenda
                            </button>
                            <button 
                                onClick={() => setMode('team')}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                                    mode === 'team' 
                                    ? 'bg-white text-black shadow-md' 
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                Liderança
                            </button>
                        </div>

                        <div className="flex-1">
                            {mode === 'sales' ? (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="flex gap-5 group">
                                        <div className="bg-[#112918] p-4 rounded-2xl h-fit text-[#4ADE80] border border-[#1a3f24] group-hover:bg-[#1a3f24] transition-colors">
                                            <TagIcon className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Lucro de 100%</h3>
                                            <p className="text-gray-400 leading-relaxed font-medium">Margem excepcional. Compre por R$ 17,50 e revenda por R$ 35,00.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5 group">
                                        <div className="bg-[#112918] p-4 rounded-2xl h-fit text-[#4ADE80] border border-[#1a3f24] group-hover:bg-[#1a3f24] transition-colors">
                                            <TruckIcon className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Pronta Entrega</h3>
                                            <p className="text-gray-400 leading-relaxed font-medium">Receba produtos em casa e atenda seus clientes com agilidade.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="flex gap-5 group">
                                        <div className="bg-[#132238] p-4 rounded-2xl h-fit text-[#60A5FA] border border-[#1c304d] group-hover:bg-[#1c304d] transition-colors">
                                            <TrendingUpIcon className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Bônus Recorrente</h3>
                                            <p className="text-gray-400 leading-relaxed font-medium">Receba comissões automáticas sobre todas as vendas da sua rede.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5 group">
                                        <div className="bg-[#132238] p-4 rounded-2xl h-fit text-[#60A5FA] border border-[#1c304d] group-hover:bg-[#1c304d] transition-colors">
                                            <AcademicCapIcon className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Carreira Executiva</h3>
                                            <p className="text-gray-400 leading-relaxed font-medium">Acesso a mentorias exclusivas e plano de carreira.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {mode === 'sales' && <EarningsSimulator />}
        </div>
    );
};

const LoginScreen = ({ onLogin, onRegisterClick }: { onLogin: (user: Consultant) => void, onRegisterClick: () => void }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data: consultant, error: consultantError } = await supabase
                .from('consultants')
                .select('*')
                .eq('id', id)
                .single();

            if (consultantError || !consultant) {
                throw new Error('ID de consultor não encontrado.');
            }

            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: consultant.email,
                password: password,
            });

            if (authError) {
                throw new Error('Senha incorreta.');
            }

            onLogin(consultant as Consultant);

        } catch (err: any) {
            setError(err.message || 'Erro ao acessar o sistema.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 transition-colors duration-500 font-sans">
            
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-md w-full border-t-4 border-brand-green-dark relative z-10 animate-fade-in">
                <div className="flex flex-col items-center mb-8">
                    <BrandLogo className="h-16 w-auto mb-6 drop-shadow-sm" />
                    <h2 className="text-3xl font-serif font-extrabold text-brand-green-dark tracking-tight">Clube Brotos <span className="text-brand-green-mid">🌱</span></h2>
                    <p className="text-gray-600 mt-2 text-base font-semibold">Área restrita para consultores.</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">ID de Consultor</label>
                        <input 
                            type="text" 
                            placeholder="Ex: 000000"
                            className="block w-full rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 p-3.5 font-bold focus:ring-2 focus:ring-brand-green-mid focus:border-brand-green-mid outline-none transition-all placeholder-gray-400"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Sua Senha</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            className="block w-full rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 p-3.5 font-bold focus:ring-2 focus:ring-brand-green-mid focus:border-brand-green-mid outline-none transition-all placeholder-gray-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded">{error}</p>}
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-brand-green-dark hover:bg-brand-green-mid text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 uppercase tracking-wide text-sm"
                    >
                        {loading ? 'Entrando...' : 'Entrar no Sistema'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <span className="text-gray-400 text-sm font-medium">ou</span>
                </div>

                <div className="mt-6">
                     <button
                        onClick={onRegisterClick}
                        className="w-full bg-transparent border-2 border-brand-green-dark text-brand-green-dark font-bold py-3.5 rounded-lg hover:bg-brand-green-dark hover:text-white transition-all duration-200 uppercase tracking-wide text-sm"
                    >
                        Quero ser um Consultor
                    </button>
                </div>
            </div>
        </div>
    );
};

const ConsultantRegister = ({ onBack, onRegisterSuccess }: { onBack: () => void, onRegisterSuccess: () => void }) => {
    // State management for registration
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        cpf: '',
        cep: '',
        address: '',
        password: '',
        confirmPassword: '',
        parentId: '' // ID do patrocinador
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check for referral code in URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            setFormData(prev => ({ ...prev, parentId: ref }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        try {
            // 1. Create Auth User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Erro ao criar usuário.");

            // 2. Generate ID (Simples simulation)
            const newId = Math.floor(100000 + Math.random() * 900000).toString();

            // 3. Insert into Consultants table
            const { error: dbError } = await supabase.from('consultants').insert([{
                id: newId,
                auth_id: authData.user.id,
                name: formData.name,
                email: formData.email,
                whatsapp: formData.whatsapp,
                document_id: formData.cpf,
                address: `${formData.address} - CEP: ${formData.cep}`,
                role: 'consultant',
                parent_id: formData.parentId || null // Salva o ID do patrocinador se existir
            }]);

            if (dbError) throw dbError;

            alert(`Cadastro realizado com sucesso! Seu ID de acesso é: ${newId}`);
            onRegisterSuccess();

        } catch (err: any) {
            setError(err.message || 'Erro ao realizar cadastro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 transition-colors duration-500 font-sans">
             
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-2xl w-full border-t-4 border-brand-green-dark relative z-10 animate-fade-in my-10">
                <button onClick={onBack} className="absolute top-4 left-6 text-gray-400 hover:text-brand-green-dark transition-colors flex items-center font-medium">
                    ← Voltar para Login
                </button>

                <div className="flex flex-col items-center mb-8 mt-6">
                    <BrandLogo className="h-14 w-auto mb-4 drop-shadow-sm" />
                    <h2 className="text-3xl font-serif font-extrabold text-brand-green-dark tracking-tight">Cadastro de Consultor</h2>
                    <p className="text-gray-600 mt-2 text-base font-semibold">Preencha seus dados para iniciar.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    
                    <div className="space-y-4">
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b pb-2 mb-4">Dados Pessoais</h3>
                        <div>
                             <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Nome Completo</label>
                            <input name="name" type="text" placeholder="Nome Completo" onChange={handleChange} required 
                                className="block w-full rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 p-3.5 font-bold focus:ring-2 focus:ring-brand-green-mid outline-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">CPF</label>
                                <input name="cpf" type="text" placeholder="CPF" onChange={handleChange} required 
                                    className="block w-full rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 p-3.5 font-bold focus:ring-2 focus:ring-brand-green-mid outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">WhatsApp</label>
                                <input name="whatsapp" type="text" placeholder="WhatsApp" onChange={handleChange} required 
                                    className="block w-full rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 p-3.5 font-bold focus:ring-2 focus:ring-brand-green-mid outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">E-mail</label>
                            <input name="email" type="email" placeholder="E-mail" onChange={handleChange} required 
                                className="block w-full rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 p-3.5 font-bold focus:ring-2 focus:ring-brand-green-mid outline-none" />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b pb-2 mb-4">Indicação</h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">ID de quem indicou</label>
                            <input 
                                name="parentId" 
                                type="text" 
                                placeholder="ID do Patrocinador (Opcional)" 
                                value={formData.parentId}
                                onChange={handleChange}
                                className={`block w-full rounded-lg border-2 bg-gray-50 text-gray-900 p-3.5 font-bold focus:ring-2 focus:ring-brand-green-mid outline-none ${formData.parentId ? 'border-brand-green-mid/50 bg-green-50/30' : 'border-gray-200'}`}
                            />
                            {formData.parentId && <p className="text-[10px] text-brand-green-dark mt-1 font-bold">Código de indicação aplicado.</p>}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b pb-2 mb-4">Localização</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">CEP</label>
                                <input name="cep" type="text" placeholder="CEP" onChange={handleChange} required 
                                    className="block w-full rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 p-3.5 font-bold focus:ring-2 focus:ring-brand-green-mid outline-none" />
                             </div>
                             <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Endereço Completo</label>
                                <input name="address" type="text" placeholder="Endereço Completo" onChange={handleChange} required 
                                    className="block w-full rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 p-3.5 font-bold focus:ring-2 focus:ring-brand-green-mid outline-none" />
                             </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                         <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b pb-2 mb-4">Segurança</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Senha</label>
                                <input name="password" type="password" placeholder="Senha" onChange={handleChange} required 
                                    className="block w-full rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 p-3.5 font-bold focus:ring-2 focus:ring-brand-green-mid outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Confirmar Senha</label>
                                <input name="confirmPassword" type="password" placeholder="Confirmar Senha" onChange={handleChange} required 
                                    className="block w-full rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 p-3.5 font-bold focus:ring-2 focus:ring-brand-green-mid outline-none" />
                            </div>
                         </div>
                    </div>

                    {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded">{error}</p>}

                    <div className="pt-6">
                        <button type="submit" disabled={loading} className="w-full bg-brand-green-dark hover:bg-brand-green-mid text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 uppercase tracking-wide">
                            {loading ? 'Processando...' : 'Finalizar Cadastro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

type DashboardShellProps = {
    consultant: Consultant;
    children?: React.ReactNode;
    onLogout: () => void;
};

const DashboardShell = ({ consultant, children, onLogout }: DashboardShellProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showLockedToast, setShowLockedToast] = useState(false);

    // Passing the activeTab to children if they are valid React elements
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab });
        }
        return child;
    });

    // Check if user is distributor, but FORCE consultor if ID is 007053 (Cleide) for demo/testing purposes
    const isDistributor = (consultant.role === 'leader' || consultant.role === 'admin') && consultant.id !== '007053';

    // Main Menu Items
    const menuItems = [
        { id: 'overview', label: 'Visão Geral', icon: <ChartBarIcon /> },
        { id: 'materials', label: 'Materiais de Apoio', icon: <DocumentDuplicateIcon /> },
        { id: 'unibrotos', label: 'UniBrotos', icon: <AcademicCapIcon /> },
        { id: 'my_orders', label: 'Meus Pedidos', icon: <PackageIcon /> },
        { id: 'new_order', label: 'Fazer Pedido', icon: <ShoppingCartIcon /> },
    ];

    // Expansion Items
    const expansionItems = [
        { id: 'invite', label: 'Convidar Consultor', icon: <UserPlusIcon /> },
    ];

    // Distributor Only Items (Now visible to everyone but locked for consultants)
    const distributorItems = [
        { id: 'business', label: 'Meu Negócio', icon: <BriefcaseIcon /> },
        { id: 'financial', label: 'Financeiro', icon: <BanknotesIcon /> },
    ];

    const renderMenuItem = (item: { id: string, label: string, icon: React.ReactNode }) => {
        const isActive = activeTab === item.id;
        const isNewOrder = item.id === 'new_order';
        
        // Locked logic
        const isLocked = ['business', 'financial'].includes(item.id) && !isDistributor;

        return (
            <button
                key={item.id}
                onClick={() => {
                    if (isLocked) {
                        setShowLockedToast(true);
                        setTimeout(() => setShowLockedToast(false), 3000);
                        return;
                    }
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                        ? 'bg-white text-[#2E5C31] shadow-lg transform scale-[1.02]' 
                        : (isLocked ? 'text-white opacity-50 cursor-not-allowed' : 'text-white hover:bg-white/10')
                }`}
            >
                <div className={`transition-colors duration-200 ${
                    isActive 
                        ? 'text-[#2E5C31]' 
                        : (isNewOrder ? 'text-yellow-400' : 'text-white')
                }`}>
                    {item.icon}
                </div>
                <span className={`text-base ${isActive ? 'font-extrabold' : 'font-semibold'} ${!isActive && isNewOrder ? 'text-yellow-400' : ''}`}>
                    {item.label}
                </span>
                
                {isLocked && <LockClosedIcon className="h-4 w-4 ml-auto" />}
            </button>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans transition-colors duration-500 relative overflow-hidden">
            
            {/* Locked Content Toast Notification */}
            {showLockedToast && (
                <div className="fixed top-20 right-4 md:right-8 bg-gray-800 text-white px-6 py-4 rounded-2xl shadow-2xl z-[70] flex items-center gap-4 animate-slide-left border border-white/10">
                    <div className="bg-white/10 p-2 rounded-full text-[#4ADE80]">
                        <LockClosedIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm leading-none">Acesso Restrito</h4>
                        <p className="text-xs font-medium opacity-80 mt-1">Torne-se um Distribuidor para desbloquear.</p>
                    </div>
                </div>
            )}

            {/* Mobile Header - Adjusted for requested layout */}
            <div className="md:hidden fixed top-0 w-full bg-brand-green-dark z-50 px-4 h-16 flex items-center justify-between shadow-md">
                 {/* Left: Menu Trigger (3 dots/lines) */}
                 <button 
                    onClick={() => setIsMobileMenuOpen(true)} 
                    className="text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                 >
                     <MenuIcon className="h-8 w-8" />
                 </button>

                 {/* Center: Logo */}
                 <div className="bg-white rounded-lg p-1.5 shadow-sm absolute left-1/2 transform -translate-x-1/2">
                    <BrandLogo className="h-8 w-auto" />
                 </div>

                 {/* Right: Spacer for balance */}
                 <div className="w-8"></div>
            </div>

            {/* Backdrop for Mobile Menu */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop & Mobile Drawer */}
            <aside className={`
                fixed inset-y-0 left-0 z-[70] w-72 transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:z-40
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                bg-[#2E5C31] shadow-2xl overflow-y-auto
            `}>
                <div className="p-6 flex flex-col h-full">
                    {/* Brand Card - White Background as requested */}
                    <div className="bg-white rounded-2xl p-6 mb-6 relative shadow-lg">
                        <div className="flex justify-center">
                             <BrandLogo className="h-16 w-auto" />
                        </div>
                        {/* Mobile Close Button integrated in card */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)} 
                            className="md:hidden absolute top-2 right-2 text-brand-green-dark hover:text-red-500 transition-colors"
                        >
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* User Profile Card - Dark semi-transparent */}
                    <div className="bg-[#1F4224] rounded-2xl p-4 mb-2 flex items-center shadow-inner border border-[#2a5530]">
                        <div className="h-12 w-12 rounded-full bg-[#D4A373] flex items-center justify-center text-[#1F4224] font-bold text-xl mr-3 shrink-0 ring-2 ring-[#D4A373]/50">
                            {consultant.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="text-white font-bold text-sm truncate uppercase">{consultant.name}</h3>
                            <p className="text-gray-300 text-xs font-medium">ID: {consultant.id}</p>
                        </div>
                    </div>
                    
                    {/* Level Badge - Separate */}
                    <div className="bg-[#446b49] bg-opacity-40 rounded-lg py-2 px-4 mb-6 text-center border border-[#527a57]/30 backdrop-blur-sm">
                        <p className="text-white text-[10px] font-bold tracking-widest uppercase">
                            NÍVEL: {consultant.role === 'admin' ? 'ADMINISTRADOR' : (isDistributor ? 'LÍDER/DISTRIBUIDOR' : 'CONSULTOR')}
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map(renderMenuItem)}

                        {/* Divider */}
                        <div className="py-2">
                            <hr className="border-[#446b49]/50" />
                        </div>

                        {/* Expansion Section Header */}
                        <p className="text-gray-300/60 text-[10px] font-bold uppercase tracking-widest px-6 pt-2 pb-1">EXPANSÃO</p>
                        
                        {expansionItems.map(renderMenuItem)}
                        
                        {/* Distributor Section (Visible to all, locked for consultants) */}
                        {distributorItems.map(renderMenuItem)}
                    </nav>

                    {/* Logout Footer */}
                    <div className="pt-6 mt-4 border-t border-[#446b49]/30">
                        <button 
                            onClick={onLogout}
                            className="flex items-center space-x-3 text-[#d4a373] hover:text-white transition-colors w-full px-6 group"
                        >
                            <LogoutIcon className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Sair do Sistema</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pt-20 md:pt-0 bg-gray-50 p-4 md:p-8 w-full">
                 {childrenWithProps}
            </main>
        </div>
    );
};

const Dashboard = ({ activeTab, setActiveTab, consultant }: { activeTab?: string, setActiveTab?: (tab: string) => void, consultant: Consultant }) => {
    // Determine content based on activeTab
    // Force consultor for Cleide (007053) for demo purposes
    const isDistributor = (consultant.role === 'leader' || consultant.role === 'admin') && consultant.id !== '007053';

    // -- State for Dynamic Data --
    const [materials, setMaterials] = useState<Material[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    
    // Fetch Data from Supabase
    useEffect(() => {
        const fetchData = async () => {
            // Materials
            const { data: materialsData } = await supabase.from('materials').select('*');
            if (materialsData) setMaterials(materialsData);

            // Lessons
            const { data: lessonsData } = await supabase.from('lessons').select('*');
            if (lessonsData) setLessons(lessonsData);

            // Orders (Own orders based on RLS)
            const { data: ordersData } = await supabase.from('orders').select('*');
            if (ordersData) setOrders(ordersData);
        };
        fetchData();
    }, [consultant.id]);

    // State for Materials Filter
    const [materialCategory, setMaterialCategory] = useState('Todos');
    const materialsCategories = ['Todos', 'Produtos', 'Empresa', 'Textos Prontos', 'Promoções'];

    // Using State Data
    const filteredMaterials = materialCategory === 'Todos' ? materials : materials.filter(m => m.category === materialCategory);

    // State for UniBrotos Filter
    const [uniCategory, setUniCategory] = useState('Todas as Aulas');
    const uniCategories = ['Todas as Aulas', 'Técnicas de Venda', 'Produtos', 'Liderança'];

    // Using State Data
    const filteredLessons = uniCategory === 'Todas as Aulas' ? lessons : lessons.filter(l => l.category === uniCategory);

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Entregue': return 'bg-green-100 text-green-700 border-green-200';
            case 'Em trânsito': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pendente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Cancelado': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // New Order State
    const [orderQty, setOrderQty] = useState(1);
    const [cep, setCep] = useState('');
    const [shippingCost, setShippingCost] = useState<number | null>(0); // Default to 0 for free shipping
    const [isCalculating, setIsCalculating] = useState(false);
    const [loadingShipping, setLoadingShipping] = useState(false);
    const [showFreeShippingToast, setShowFreeShippingToast] = useState(false);
    
    // Order Details Modal State
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    // Invite State
    const [copied, setCopied] = useState(false);
    
    // Financial Tab State
    const [bankInfo, setBankInfo] = useState({
        cnpj: '',
        bankName: '',
        agency: '',
        account: '',
        pixKey: ''
    });
    const [bonusVolume, setBonusVolume] = useState(10000);

    const BOX_PRICE = 210;

    const handleCalculateShipping = () => {
        if (cep.length < 8) return;
        setLoadingShipping(true);
        // Simulate API call
        setTimeout(() => {
            setShippingCost(0); // Sempre grátis
            setLoadingShipping(false);
        }, 1500);
    };

    // Recalculate shipping if qty changes and shipping was already calculated
    useEffect(() => {
        if (shippingCost !== null) {
             setShippingCost(0);
        }
        
        setShowFreeShippingToast(false);

    }, [orderQty]);

    const total = (orderQty * BOX_PRICE) + (shippingCost || 0);

    const inviteLink = `${window.location.origin}?ref=${consultant.id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleFinalizeOrder = async () => {
        if (!cep) {
            alert('Por favor, informe o CEP para entrega.');
            return;
        }

        // Insert Order into DB
        const newOrder = {
            id: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
            consultant_id: consultant.id,
            date: new Date().toLocaleDateString('pt-BR'),
            items: `${orderQty}x Caixa Pomada de Copaíba`,
            total: formatCurrency(total),
            status: 'Pendente'
        };

        // Attempt to save to DB, but don't block the user if it fails
        const { error } = await supabase.from('orders').insert([newOrder]);

        if (error) {
            console.error("Erro ao salvar pedido no banco de dados (ignorando para fluxo WhatsApp):", error);
            // We proceed to WhatsApp anyway, so no alert is shown to the user.
        }

        const phoneNumber = "557199190515"; 
        
        const message = `*NOVO PEDIDO - CLUBE BROTOS* 🌱\n\n` +
            `👤 *Consultor:* ${consultant.name} (ID: ${consultant.id})\n\n` +
            `📦 *Itens do Pedido:*\n` +
            `${orderQty}x Caixa Pomada de Copaíba - 12 Unidades\n` +
            `(R$ ${BOX_PRICE.toFixed(2).replace('.', ',')} / caixa)\n\n` +
            `📍 *CEP de Entrega:* ${cep}\n` +
            `🚚 *Frete:* Grátis\n` +
            `💰 *TOTAL:* ${formatCurrency(total)}\n\n` +
            `Gostaria de finalizar meu pedido!`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Refresh orders if successful
        if (!error) {
            const { data: ordersData } = await supabase.from('orders').select('*');
            if (ordersData) setOrders(ordersData as Order[]);
        }
    };

    // Bonus Calculation Logic
    const calculateBonus = (volume: number) => {
        let percentage = 0;
        if (volume < 5000) percentage = 0.03;
        else if (volume < 15000) percentage = 0.05;
        else if (volume < 30000) percentage = 0.07;
        else percentage = 0.10;
        
        return volume * percentage;
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in py-6 md:py-10">
             {activeTab === 'overview' && (
                <div className="space-y-10">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-serif font-bold text-brand-green-dark">
                            Olá, {consultant.name.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>

                    {/* New Business Model Section (Replacing Old Campaign) */}
                    <BusinessModelSection />
                </div>
             )}

             {activeTab === 'materials' && (
                 <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
                        <div className="flex items-center gap-5">
                            <div className="bg-pink-100 p-4 rounded-3xl text-pink-500 shadow-sm">
                                <PhotoIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-brand-green-dark">Materiais de Apoio</h2>
                                <p className="text-gray-500 text-sm font-medium mt-1">Acervo de marketing para suas redes sociais.</p>
                            </div>
                        </div>
                        <button className="bg-[#064e3b] hover:bg-[#064e3b]/90 text-white font-bold py-3 px-8 rounded-2xl text-sm shadow-lg transition-transform hover:scale-105 active:scale-95">
                            + Novo Material
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex overflow-x-auto pb-4 mt-8 pt-4 gap-4 no-scrollbar">
                        {materialsCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setMaterialCategory(cat)}
                                className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                                    materialCategory === cat
                                    ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-md'
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-[#064e3b] hover:text-[#064e3b] hover:bg-gray-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Materials Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredMaterials.map((material) => (
                            <div key={material.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group relative hover:-translate-y-1">
                                {/* Gray Placeholder Area */}
                                <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center relative group-hover:bg-gray-200 transition-colors">
                                    <PhotoIcon className="h-16 w-16 text-gray-300 group-hover:scale-110 transition-transform duration-300" />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button className="bg-white text-[#064e3b] font-bold py-3 px-8 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-green-50">
                                            Baixar
                                        </button>
                                    </div>
                                    <button className="absolute bottom-4 right-4 bg-white/80 text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shadow-sm">
                                        <CloseIcon className="h-4 w-4" />
                                    </button>
                                </div>
                                
                                {/* Footer Info */}
                                <div className="p-6">
                                    <h3 className="text-sm font-extrabold text-[#064e3b] uppercase tracking-wide mb-2 line-clamp-1">
                                        {material.title}
                                    </h3>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-[10px] font-bold text-brand-green-mid uppercase tracking-widest">
                                        {material.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             )}

             {activeTab === 'unibrotos' && (
                 <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
                        <div className="flex items-center gap-5">
                            <div className="bg-[#1e1b4b] p-4 rounded-3xl text-white shadow-sm">
                                <AcademicCapIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-brand-green-dark">UniBrotos</h2>
                                <p className="text-gray-500 text-sm font-medium mt-1">Universidade Corporativa Brotos da Terra</p>
                            </div>
                        </div>
                        <button className="bg-[#064e3b] hover:bg-[#064e3b]/90 text-white font-bold py-3 px-8 rounded-2xl text-sm shadow-lg transition-transform hover:scale-105 active:scale-95">
                            + Adicionar Aula
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar mt-8">
                        {uniCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setUniCategory(cat)}
                                className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                                    uniCategory === cat
                                    ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-md'
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-[#064e3b] hover:text-[#064e3b] hover:bg-gray-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Lessons Grid (Dynamic) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredLessons.map((lesson) => (
                            <div key={lesson.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group relative hover:-translate-y-1">
                                {/* Thumbnail Area */}
                                <div className={`aspect-video ${lesson.thumbnail} flex items-center justify-center relative group-hover:brightness-95 transition-all`}>
                                    <PlayCircleIcon className="h-12 w-12 text-[#064e3b]/50 group-hover:text-[#064e3b] group-hover:scale-110 transition-all duration-300" />
                                </div>
                                
                                {/* Info */}
                                <div className="p-6">
                                    <h3 className="text-sm font-extrabold text-[#064e3b] uppercase tracking-wide mb-2 line-clamp-1">
                                        {lesson.title}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                                            {lesson.category}
                                        </span>
                                        <span className="text-xs text-gray-400 font-bold">{lesson.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             )}

             {activeTab === 'my_orders' && (
                 <div className="space-y-8">
                    {/* Order Details Modal */}
                    {selectedOrder && (
                        <OrderDetailsModal 
                            order={selectedOrder} 
                            onClose={() => setSelectedOrder(null)} 
                        />
                    )}

                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-2xl font-bold mb-8 text-brand-green-dark">Meus Pedidos</h2>

                        {/* Stats Grid - Moved from Overview */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 ${isDistributor ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 mb-8`}>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-brand-green-mid hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Vendas Mês</p>
                                        <h3 className="text-2xl font-bold text-brand-green-dark mt-1">R$ 1.260,00</h3>
                                    </div>
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <TrendingUpIcon />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-brand-earth hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pontos</p>
                                        <h3 className="text-2xl font-bold text-brand-earth mt-1">300 pts</h3>
                                        <span className="text-[10px] text-gray-400 font-medium mt-1 block">100 pts/caixa</span>
                                    </div>
                                    <div className="bg-orange-100 p-2 rounded-lg">
                                        <SparklesIcon className="h-6 w-6 text-brand-earth" />
                                    </div>
                                </div>
                            </div>
                             {isDistributor && (
                                <div 
                                    onClick={() => setActiveTab && setActiveTab('business')}
                                    className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all cursor-pointer hover:bg-gray-50"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Equipe</p>
                                            <h3 className="text-2xl font-bold text-blue-600 mt-1">12 Membros</h3>
                                        </div>
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <UsersIcon />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Lucro Est.</p>
                                        <h3 className="text-2xl font-bold text-purple-600 mt-1">R$ 630,00</h3>
                                    </div>
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <BanknotesIcon />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Order History Table */}
                        <div className="border border-gray-100 rounded-3xl overflow-hidden mt-10 shadow-sm">
                            <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h3 className="font-bold text-brand-green-dark text-lg">Histórico de Pedidos</h3>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:flex-initial w-full sm:w-64">
                                        <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input 
                                            type="text" 
                                            placeholder="Buscar pedido..." 
                                            className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-mid/20 focus:border-brand-green-mid w-full transition-all bg-white"
                                        />
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-brand-green-mid hover:text-brand-green-dark transition-all shadow-sm hover:shadow font-bold text-xs uppercase tracking-wide">
                                        <FilterIcon className="h-4 w-4" />
                                        <span className="hidden sm:inline">Filtrar</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="py-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Pedido</th>
                                            <th className="py-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Data</th>
                                            <th className="py-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Itens</th>
                                            <th className="py-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="py-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Total</th>
                                            <th className="py-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.length === 0 ? (
                                             <tr>
                                                <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                                                    Nenhum pedido encontrado. Faça seu primeiro pedido agora!
                                                </td>
                                            </tr>
                                        ) : orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="py-4 px-6 font-bold text-brand-green-dark text-sm">#{order.id}</td>
                                                <td className="py-4 px-6 text-sm text-gray-500 font-medium">{order.date}</td>
                                                <td className="py-4 px-6 text-sm text-gray-600">{order.items}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm font-bold text-gray-800 text-right">{order.total}</td>
                                                <td className="py-4 px-6 text-center">
                                                    <button 
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="group flex items-center justify-center w-9 h-9 mx-auto rounded-xl bg-gray-50 text-gray-400 hover:bg-brand-green-mid hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200" 
                                                        title="Ver Detalhes"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                                <button className="text-xs font-bold text-gray-500 hover:text-brand-green-dark uppercase tracking-widest transition-colors w-full h-full py-2">
                                    Ver todos os pedidos
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
             )}

             {activeTab === 'new_order' && (
                 <div className="space-y-8 animate-fade-in relative">
                    {/* Free Shipping Toast Notification - Keep Logic if needed in future, but default is always free now */}
                    {showFreeShippingToast && (
                        <div className="fixed top-24 right-4 md:right-8 bg-brand-green-mid text-white px-6 py-4 rounded-2xl shadow-2xl z-[60] flex items-center gap-4 animate-slide-left border border-white/20 backdrop-blur-md">
                            <div className="bg-white/20 p-2 rounded-full">
                                <TruckIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg leading-none">Parabéns! 🎉</h4>
                                <p className="text-sm font-medium opacity-90 mt-1">Você ganhou frete grátis!</p>
                            </div>
                            <button onClick={() => setShowFreeShippingToast(false)} className="text-white/70 hover:text-white ml-2">
                                <CloseIcon className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    <div className="bg-[#0f172a] rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-green-mid/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                        
                        <h2 className="text-3xl font-serif font-bold text-white mb-2 relative z-10">Fazer Pedido</h2>
                        <p className="text-gray-400 mb-10 relative z-10">Oportunidade Exclusiva para Consultores</p>

                        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                            
                            {/* Product Showcase */}
                            <div className="flex-1 bg-[#1e293b] rounded-3xl p-8 border border-gray-700/50 shadow-inner">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="shrink-0 w-full md:w-auto flex justify-center items-center relative">
                                         {/* Glow effect behind */}
                                         <div className="absolute inset-0 bg-brand-green-mid/40 blur-[40px] rounded-full"></div>
                                         <img 
                                            src="https://i.imgur.com/yNKoBxr.png" 
                                            alt="Caixa Pomada de Copaíba" 
                                            className="h-48 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-[2rem]" 
                                         />
                                    </div>
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-yellow-400/30">
                                            Campeão de Vendas
                                        </span>
                                        <h3 className="text-2xl font-bold text-white mb-2">Caixa Pomada de Copaíba - 12 Unidades</h3>
                                        <p className="text-gray-400 text-sm mb-6">Pomada Terapêutica de Alta Performance</p>
                                        
                                        <div className="flex items-baseline gap-3 mb-6">
                                            <span className="text-4xl font-bold text-white">R$ 210,00</span>
                                            <span className="text-brand-green-mid font-semibold">R$ 17,50 / unidade</span>
                                        </div>

                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                                <CheckCircleIcon className="h-5 w-5 text-brand-green-mid" />
                                                Lucro de 100% na revenda (R$ 420,00 total)
                                            </li>
                                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                                <CheckCircleIcon className="h-5 w-5 text-brand-green-mid" />
                                                Pronta Entrega Imediata
                                            </li>
                                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                                <CheckCircleIcon className="h-5 w-5 text-brand-green-mid" />
                                                Suporte de Marketing Incluso
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout / Calculator */}
                            <div className="flex-1 lg:max-w-md bg-white rounded-3xl p-8 shadow-xl text-gray-800">
                                <h4 className="text-xl font-bold text-brand-green-dark mb-6 border-b pb-4">Resumo do Pedido</h4>
                                
                                <div className="mb-8">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Quantidade de Caixas</label>
                                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200 w-fit">
                                        <button 
                                            onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                                            className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-brand-green-dark transition-colors"
                                        >
                                            <MinusIcon />
                                        </button>
                                        <span className="text-xl font-bold w-8 text-center">{orderQty}</span>
                                        <button 
                                            onClick={() => setOrderQty(orderQty + 1)}
                                            className="w-10 h-10 rounded-lg bg-brand-green-dark shadow-sm flex items-center justify-center text-white hover:bg-brand-green-mid transition-colors"
                                        >
                                            <PlusIcon />
                                        </button>
                                    </div>
                                </div>

                                {/* Free Shipping Banner - Updated */}
                                <div className="mb-8 bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full text-brand-green-dark">
                                         <TruckIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-brand-green-dark">Frete Grátis</p>
                                        <p className="text-xs text-brand-green-mid font-medium">Para todo o Brasil, independente da quantidade.</p>
                                    </div>
                                </div>

                                {/* Shipping Calculator */}
                                <div className="mb-8">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Calcular Frete</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Seu CEP" 
                                            value={cep}
                                            onChange={(e) => setCep(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-brand-green-mid focus:ring-2 focus:ring-brand-green-mid/20 transition-all"
                                        />
                                        <button 
                                            onClick={handleCalculateShipping}
                                            disabled={loadingShipping}
                                            className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                        >
                                            {loadingShipping ? '...' : 'Calcular'}
                                        </button>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="space-y-3 border-t pt-6">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(orderQty * BOX_PRICE)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Frete</span>
                                        <span className={shippingCost === 0 ? 'text-green-600 font-bold' : ''}>
                                            {shippingCost === null ? '--' : (shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-2xl font-bold text-gray-900 pt-2">
                                        <span>Total</span>
                                        <span>{formatCurrency(total)}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleFinalizeOrder}
                                    className="w-full mt-8 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 uppercase tracking-wide flex items-center justify-center gap-3"
                                >
                                    <WhatsAppIcon />
                                    Finalizar via WhatsApp
                                </button>

                            </div>
                        </div>
                    </div>
                 </div>
             )}
             
             {activeTab === 'invite' && (
                 <div className="space-y-8 animate-fade-in">
                     {/* Header */}
                    <div className="flex items-center gap-5 mb-8">
                        <div className="bg-blue-100 p-4 rounded-3xl text-blue-500 shadow-sm">
                            <UserPlusIcon className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-brand-green-dark">Convidar Consultor</h2>
                            <p className="text-gray-500 text-sm font-medium mt-1">Expanda sua equipe e aumente seus ganhos.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 max-w-2xl">
                        <h3 className="text-xl font-bold text-brand-green-dark mb-4">Seu Link de Indicação</h3>
                        <p className="text-gray-500 mb-6">Compartilhe este link com novos consultores. Quando eles se cadastrarem, você será automaticamente vinculado como distribuidor em qualificação.</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={inviteLink}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-600 px-5 py-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-mid/20"
                                />
                            </div>
                            <button 
                                onClick={handleCopyLink}
                                className={`px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                                    copied ? 'bg-green-500' : 'bg-brand-green-dark hover:bg-brand-green-mid hover:-translate-y-1'
                                }`}
                            >
                                {copied ? <CheckCircleIcon className="h-5 w-5" /> : <ClipboardCopyIcon className="h-5 w-5" />}
                                {copied ? 'Copiado!' : 'Copiar Link'}
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                             <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Compartilhar via</h4>
                             <a 
                                href={`https://wa.me/?text=Olá! Gostaria de te convidar para ser um consultor na Brotos da Terra. Cadastre-se pelo meu link: ${encodeURIComponent(inviteLink)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-md hover:shadow-lg"
                             >
                                 <WhatsAppIcon />
                                 WhatsApp
                             </a>
                        </div>
                    </div>
                 </div>
             )}

             {activeTab === 'business' && (
                 <div className="bg-white rounded-2xl shadow-sm p-8">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-brand-green-dark">Meu Negócio</h2>
                            <p className="text-gray-500 text-sm mt-1">Gerenciamento completo da sua equipe.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase">Total Consultores</p>
                                <p className="text-xl font-bold text-gray-800">125</p>
                            </div>
                            <div className="text-right border-l pl-4 border-gray-200">
                                <p className="text-xs text-gray-400 font-bold uppercase">Ativos Hoje</p>
                                <p className="text-xl font-bold text-brand-green-mid">12</p>
                            </div>
                        </div>
                     </div>
                     
                     {/* Team Table */}
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-4 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Consultor</th>
                                    <th className="py-4 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="py-4 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Nível</th>
                                    <th className="py-4 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendas (Mês)</th>
                                    <th className="py-4 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_DATA.team.map((member) => (
                                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-2 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-800">{member.name}</span>
                                        </td>
                                        <td className="py-4 px-2 text-sm text-gray-500">{member.id}</td>
                                        <td className="py-4 px-2 text-sm">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${member.role === 'Líder' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-sm">
                                             <span className={`flex items-center gap-1.5 ${member.status === 'Ativo' ? 'text-green-600' : 'text-red-500'}`}>
                                                <span className={`h-2 w-2 rounded-full ${member.status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {member.status}
                                             </span>
                                        </td>
                                        <td className="py-4 px-2 text-sm font-bold text-gray-700">{member.sales}</td>
                                        <td className="py-4 px-2 text-right">
                                            <button className="text-green-600 hover:text-green-700 p-2 rounded-full hover:bg-green-50 transition-colors">
                                                <WhatsAppIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                 </div>
             )}

             {activeTab === 'financial' && (
                 <div className="space-y-8 animate-fade-in">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                         <div className="flex items-center gap-5">
                            <div className="bg-brand-green-dark p-4 rounded-3xl text-white shadow-sm">
                                <BanknotesIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-brand-green-dark">Financeiro</h2>
                                <p className="text-gray-500 text-sm font-medium mt-1">Gestão de bônus e dados bancários.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Withdrawal & Balance */}
                        <div className="bg-[#1F2937] text-white rounded-[2rem] p-8 md:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden">
                             {/* Background Accents */}
                             <div className="absolute top-0 right-0 w-64 h-64 bg-[#4ADE80]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                             
                             <div>
                                 <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Saldo Disponível</p>
                                 <h3 className="text-5xl font-bold text-white tracking-tight mb-1">{formatCurrency(MOCK_DATA.financial.balance)}</h3>
                                 <p className="text-[#4ADE80] text-sm font-medium flex items-center gap-2 mt-2">
                                     <TrendingUpIcon className="h-4 w-4" />
                                     +12% em relação ao mês anterior
                                 </p>
                             </div>

                             <div className="mt-12">
                                 <button className="w-full bg-[#4ADE80] hover:bg-[#22c55e] text-[#064e3b] font-bold py-4 rounded-xl shadow-lg hover:shadow-[#4ADE80]/30 transition-all transform hover:-translate-y-1">
                                     Solicitar Saque
                                 </button>
                                 <p className="text-center text-xs text-gray-500 mt-4">Saques processados em até 2 dias úteis.</p>
                             </div>
                        </div>

                        {/* Right Column: Bonus Calculator */}
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-gray-100">
                             <div className="flex items-center gap-3 mb-6">
                                 <CalculatorIcon className="h-6 w-6 text-brand-green-dark" />
                                 <h3 className="text-xl font-bold text-brand-green-dark">Calculadora de Bônus</h3>
                             </div>

                             <div className="mb-8">
                                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Volume de Vendas da Equipe</label>
                                 <input
                                    type="range"
                                    min="0"
                                    max="50000"
                                    step="1000"
                                    value={bonusVolume}
                                    onChange={(e) => setBonusVolume(parseInt(e.target.value))}
                                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green-mid hover:accent-brand-green-dark transition-all mb-4"
                                />
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-gray-800">{formatCurrency(bonusVolume)}</span>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">Volume Mensal</span>
                                </div>
                             </div>

                             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                 <div className="flex justify-between items-center mb-2">
                                     <span className="text-sm font-bold text-gray-500">Bônus Estimado</span>
                                     <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                         {bonusVolume < 5000 ? '3%' : bonusVolume < 15000 ? '5%' : bonusVolume < 30000 ? '7%' : '10%'}
                                     </span>
                                 </div>
                                 <h4 className="text-3xl font-bold text-brand-green-dark">
                                     {formatCurrency(calculateBonus(bonusVolume))}
                                 </h4>
                                 <p className="text-xs text-gray-400 mt-2">*Estimativa baseada no plano de carreira atual.</p>
                             </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                            <CreditCardIcon className="h-6 w-6 text-brand-green-dark" />
                            <h3 className="text-xl font-bold text-brand-green-dark">Dados para Recebimento</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {/* CNPJ */}
                             <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">CNPJ</label>
                                <div className="relative">
                                    <BriefcaseIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="text" 
                                        placeholder="00.000.000/0000-00" 
                                        value={bankInfo.cnpj}
                                        onChange={(e) => setBankInfo({...bankInfo, cnpj: e.target.value})}
                                        className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl py-3 font-medium outline-none focus:border-brand-green-mid focus:ring-2 focus:ring-brand-green-mid/20 transition-all"
                                        required
                                    />
                                </div>
                             </div>

                             {/* Pix Key */}
                             <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Chave Pix</label>
                                <div className="relative">
                                    <QrCodeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="text" 
                                        placeholder="CPF, E-mail ou Telefone" 
                                        value={bankInfo.pixKey}
                                        onChange={(e) => setBankInfo({...bankInfo, pixKey: e.target.value})}
                                        className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl py-3 font-medium outline-none focus:border-brand-green-mid focus:ring-2 focus:ring-brand-green-mid/20 transition-all"
                                    />
                                </div>
                             </div>

                             {/* Bank Details */}
                             <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Banco</label>
                                     <input 
                                        type="text" 
                                        placeholder="Ex: Nubank, Itaú" 
                                        value={bankInfo.bankName}
                                        onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-medium outline-none focus:border-brand-green-mid focus:ring-2 focus:ring-brand-green-mid/20 transition-all"
                                     />
                                </div>
                                <div className="space-y-2">
                                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Agência</label>
                                     <input 
                                        type="text" 
                                        placeholder="0000" 
                                        value={bankInfo.agency}
                                        onChange={(e) => setBankInfo({...bankInfo, agency: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-medium outline-none focus:border-brand-green-mid focus:ring-2 focus:ring-brand-green-mid/20 transition-all"
                                     />
                                </div>
                                <div className="space-y-2">
                                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Conta</label>
                                     <input 
                                        type="text" 
                                        placeholder="00000-0" 
                                        value={bankInfo.account}
                                        onChange={(e) => setBankInfo({...bankInfo, account: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-medium outline-none focus:border-brand-green-mid focus:ring-2 focus:ring-brand-green-mid/20 transition-all"
                                     />
                                </div>
                             </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button className="bg-brand-green-dark hover:bg-brand-green-mid text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
                                Salvar Dados
                            </button>
                        </div>
                    </div>
                 </div>
             )}
        </div>
    );
};

export const ConsultantApp = () => {
    const [user, setUser] = useState<Consultant | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);

    // Persist login state check
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                 const { data: consultant } = await supabase
                    .from('consultants')
                    .select('*')
                    .eq('auth_id', session.user.id)
                    .single();
                 if (consultant) setUser(consultant as Consultant);
            }
        };
        checkUser();

        // Check for referral in URL to auto-open registration
        const params = new URLSearchParams(window.location.search);
        if (params.get('ref')) {
            setIsRegistering(true);
        }
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    if (user) {
        return (
            <DashboardShell consultant={user} onLogout={handleLogout}>
                <Dashboard consultant={user} />
            </DashboardShell>
        );
    }

    if (isRegistering) {
        return <ConsultantRegister onBack={() => setIsRegistering(false)} onRegisterSuccess={() => setIsRegistering(false)} />;
    }

    return <LoginScreen onLogin={setUser} onRegisterClick={() => setIsRegistering(true)} />;
};
