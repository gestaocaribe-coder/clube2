import React, { useState, useEffect, useMemo } from 'react';
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
import { Consultant, ConsultantStats, Sale, Notification, PrivateCustomer, PrivateSale, Material, Lesson, Order, Withdrawal, GoalMetric } from './types';

// --- Context Type for Outlet ---
type DashboardContextType = {
    consultant: Consultant;
};

// --- Helper Functions ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

// --- DATA SOURCE (Simulating API Response) ---
// In production, this would be replaced by a fetch to Supabase
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
    if (!consultant) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-[2rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col">
                <div className="bg-[#0A382A] px-8 py-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl border border-white/20">
                            {consultant.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold">{consultant.name}</h3>
                            <p className="text-green-200/70 text-sm">ID: {consultant.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20">
                        <CloseIcon className="h-4 w-4" />
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Status</p>
                            <span className={`px-2 py-1 rounded text-sm font-bold ${consultant.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {consultant.status}
                            </span>
                        </div>
                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Nível</p>
                            <p className="font-bold text-gray-800">{consultant.role}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-brand-green-dark uppercase tracking-widest border-b border-gray-100 pb-2">Dados de Contato</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <p className="text-xs text-gray-400">E-mail</p>
                                <p className="font-medium text-gray-800">{consultant.email}</p>
                            </div>
                             <div>
                                <p className="text-xs text-gray-400">Telefone / WhatsApp</p>
                                <p className="font-medium text-gray-800">{consultant.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-brand-green-dark uppercase tracking-widest border-b border-gray-100 pb-2">Documentação & Endereço</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <p className="text-xs text-gray-400">CPF/CNPJ</p>
                                <p className="font-medium text-gray-800">{consultant.doc || 'Não informado'}</p>
                            </div>
                             <div>
                                <p className="text-xs text-gray-400">Endereço</p>
                                <p className="font-medium text-gray-800">{consultant.address || 'Não informado'}</p>
                                <p className="text-sm text-gray-600">{consultant.city} - {consultant.state}</p>
                            </div>
                        </div>
                    </div>

                     <div className="pt-4 flex gap-4">
                        <button className="flex-1 py-3 bg-brand-green-mid text-white rounded-xl font-bold shadow hover:bg-brand-green-dark transition">
                            Enviar Mensagem
                        </button>
                        <button className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">
                            Editar Cadastro
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

// --- NEW COMPONENT: RevenueGrowthSimulator (Strategic Admin Tool) ---

const RevenueGrowthSimulator = () => {
    // State for the sliders (Inputs)
    const [newConsultantsGoal, setNewConsultantsGoal] = useState(50);
    const [activationRateGoal, setActivationRateGoal] = useState(15); // Percentage
    const [ticketAverageGoal, setTicketAverageGoal] = useState(250);

    // Business Logic: Calculate Estimated Monthly Revenue
    // Formula: (Active Base + New Consultants) * Activation Rate * Ticket Average
    // *Simplified for simulation purposes*
    
    // Get real base numbers from DB_LOCAL_STATE
    const currentTotalConsultants = DB_LOCAL_STATE.team.length; 
    
    // Logic: 
    // Total Potential Active = Current Base + New Goal
    // Active Users = Total Potential * (Activation Rate / 100)
    // Revenue = Active Users * Ticket Average
    
    const totalPotentialBase = 500 + newConsultantsGoal; // Assuming 500 base for simulation scale + goal
    const activeUsers = Math.floor(totalPotentialBase * (activationRateGoal / 100));
    const estimatedRevenue = activeUsers * ticketAverageGoal;

    return (
        <div className="bg-[#0A382A] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-green-900/30 border border-white/5">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
                <div className="flex items-center gap-4">
                     <div className="p-3 bg-[#4CAF50] rounded-2xl shadow-lg shadow-green-500/20">
                        <PresentationChartLineIcon className="h-8 w-8 text-white" />
                     </div>
                     <div>
                         <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white">Simulador de Crescimento da Receita</h3>
                         <p className="text-green-100/60 text-sm mt-1">Projeção estratégica baseada em métricas de rede.</p>
                     </div>
                </div>
                <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/5 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-300">Receita Mensal Estimada</p>
                    <p className="text-3xl font-mono font-bold text-white">{formatCurrency(estimatedRevenue)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                {/* Inputs Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Slider 1: New Consultants */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-green-100 flex items-center gap-2">
                                <UserPlusIcon className="h-4 w-4" /> Meta de Novos Consultores / Mês
                            </label>
                            <span className="font-mono text-[#4CAF50] font-bold">{newConsultantsGoal} un.</span>
                        </div>
                        <input 
                            type="range" min="10" max="500" step="10"
                            value={newConsultantsGoal}
                            onChange={(e) => setNewConsultantsGoal(parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4CAF50]"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>10</span>
                            <span>Expansão da Base</span>
                            <span>500</span>
                        </div>
                    </div>

                    {/* Slider 2: Activation Rate */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-green-100 flex items-center gap-2">
                                <TargetIcon className="h-4 w-4" /> Meta de Ativação / Mês
                            </label>
                            <span className="font-mono text-[#4CAF50] font-bold">{activationRateGoal}%</span>
                        </div>
                        <input 
                            type="range" min="5" max="100" step="5"
                            value={activationRateGoal}
                            onChange={(e) => setActivationRateGoal(parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4CAF50]"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>5%</span>
                            <span>Produtividade</span>
                            <span>100%</span>
                        </div>
                    </div>

                    {/* Slider 3: Ticket Average */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-green-100 flex items-center gap-2">
                                <BanknotesIcon className="h-4 w-4" /> Ticket Médio Alvo
                            </label>
                            <span className="font-mono text-[#4CAF50] font-bold">{formatCurrency(ticketAverageGoal)}</span>
                        </div>
                        <input 
                            type="range" min="100" max="1000" step="50"
                            value={ticketAverageGoal}
                            onChange={(e) => setTicketAverageGoal(parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#4CAF50]"
                        />
                         <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>R$ 100</span>
                            <span>Valor da Venda</span>
                            <span>R$ 1.000</span>
                        </div>
                    </div>
                </div>

                {/* Scenarios / Output */}
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col justify-center gap-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center mb-2">Cenários Projetados</p>
                    
                    <div className={`p-4 rounded-xl border transition-all ${estimatedRevenue < 50000 ? 'bg-white/10 border-[#4CAF50] shadow-lg' : 'bg-transparent border-white/5 opacity-50'}`}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-300">Conservador</span>
                            <span className="font-mono font-bold text-white">~R$ 35k</span>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${estimatedRevenue >= 50000 && estimatedRevenue < 150000 ? 'bg-white/10 border-[#4CAF50] shadow-lg' : 'bg-transparent border-white/5 opacity-50'}`}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-300">Ideal</span>
                            <span className="font-mono font-bold text-white">~R$ 100k</span>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${estimatedRevenue >= 150000 ? 'bg-white/10 border-[#4CAF50] shadow-lg' : 'bg-transparent border-white/5 opacity-50'}`}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-300">Agressivo</span>
                            <span className="font-mono font-bold text-white">R$ 150k+</span>
                        </div>
                    </div>

                    <button className="mt-4 w-full py-3 bg-[#4CAF50] text-[#0A382A] font-bold rounded-xl hover:bg-green-400 transition-colors shadow-lg">
                        Aplicar Metas
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- VIEWS ---

export const OverviewView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const [recentSales, setRecentSales] = useState<Sale[]>([]);

    useEffect(() => {
        // Mock fetch recent sales
        const mockSales = [
            { id: 101, consultant_id: consultant.id, quantity: 2, total_amount: 420.00, created_at: '2023-10-25' },
            { id: 102, consultant_id: consultant.id, quantity: 1, total_amount: 210.00, created_at: '2023-10-20' },
        ];
        setRecentSales(mockSales);
    }, [consultant.id]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header / Welcome */}
            <div className="bg-gradient-to-r from-brand-green-dark to-brand-green-mid rounded-[2rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                        Olá, {consultant.name.split(' ')[0]}! 🌱
                    </h2>
                    <p className="text-green-50 text-lg md:text-xl font-light leading-relaxed">
                        Sua jornada de sucesso continua. Você já impactou vidas hoje?
                    </p>
                    <div className="mt-8 flex gap-4">
                        <Link to="/consultor/novo-pedido" className="px-6 py-3 bg-white text-brand-green-dark rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2">
                            <ShoppingCartIcon className="h-5 w-5" />
                            Novo Pedido
                        </Link>
                         <Link to="/consultor/materiais" className="px-6 py-3 bg-brand-green-dark bg-opacity-30 border border-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-opacity-40 transition-all flex items-center gap-2">
                            <SparklesIcon className="h-5 w-5" />
                            Divulgar
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 text-brand-green-dark rounded-xl">
                            <TrendingUpIcon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Vendas no Mês</p>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">R$ 1.250,00</h3>
                    <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 inline-block px-2 py-1 rounded">+15% vs mês anterior</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <BanknotesIcon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Lucro Estimado</p>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">R$ 625,00</h3>
                    <p className="text-xs text-gray-400 mt-2">Margem de 100%</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <UsersIcon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Novos Clientes</p>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">12</h3>
                    <p className="text-xs text-purple-600 font-bold mt-2 bg-purple-50 inline-block px-2 py-1 rounded">+4 essa semana</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                            <AcademicCapIcon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Aulas Assistidas</p>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">8/12</h3>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                        <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: '66%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminOverviewView = () => {
    // ADMIN DASHBOARD
    // Calculates metrics dynamically from DB_LOCAL_STATE to replace mock values
    
    // 1. Calculate Active Consultants
    const activeConsultants = DB_LOCAL_STATE.team.filter(c => c.status === 'Ativo').length;
    
    // 2. Calculate Inactive
    const inactiveConsultants = DB_LOCAL_STATE.team.filter(c => c.status === 'Inativo').length;
    
    // 3. Calculate New (Last 30 days - simulated logic)
    // In a real app, compare c.joinDate with Date.now()
    const newConsultants = 4; // Simulated from list

    // 4. Total Referrals (Anyone who has an inviter that isn't root 000000)
    const totalReferrals = DB_LOCAL_STATE.team.filter(c => c.invitedBy && c.invitedBy !== '000000').length;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Date Info */}
            <div className="flex justify-between items-center px-2">
                <div>
                     {/* PERSONALIZED ADMIN GREETING */}
                     <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A382A]">Olá, Administrador 👋</h2>
                     <p className="text-gray-500 text-sm">Visão global e estratégica da rede.</p>
                </div>
                <span className="text-gray-400 text-sm italic hidden md:block">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>

            {/* NETWORK SUMMARY CARDS (Dynamic Data) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                 {/* Card 1: Active */}
                 <Link to="/admin/usuarios" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform">
                        <CheckCircleIcon className="h-24 w-24 text-[#0A382A]" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 text-[#0A382A] rounded-xl">
                            <UsersIcon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Consultores Ativos</p>
                    </div>
                    <h3 className="text-3xl font-bold text-[#0A382A]">{activeConsultants}</h3>
                    <p className="text-xs text-green-600 mt-2 font-bold">Produtividade Alta</p>
                </Link>

                {/* Card 2: New */}
                <Link to="/admin/usuarios" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden">
                     <div className="absolute right-0 top-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform">
                        <UserPlusIcon className="h-24 w-24 text-blue-600" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <UserPlusIcon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Novos Cadastros</p>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{newConsultants}</h3>
                    <p className="text-xs text-blue-600 mt-2 font-bold">Últimos 30 dias</p>
                </Link>

                {/* Card 3: Inactive */}
                <Link to="/admin/usuarios" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden">
                     <div className="absolute right-0 top-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform">
                        <UserCircleIcon className="h-24 w-24 text-gray-600" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gray-100 text-gray-600 rounded-xl">
                            <UserCircleIcon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Inativos</p>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{inactiveConsultants}</h3>
                    <p className="text-xs text-red-500 mt-2 font-bold">Ação Necessária</p>
                </Link>

                {/* Card 4: Total Referrals */}
                <div className="bg-[#1C2833] p-6 rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden">
                     <div className="absolute right-0 top-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform">
                        <TargetIcon className="h-24 w-24 text-white" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-[#4CAF50] text-white rounded-xl shadow-lg shadow-green-900/50">
                            <HandshakeIcon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Total Indicações</p>
                    </div>
                    <h3 className="text-3xl font-bold text-white">{totalReferrals}</h3>
                    <p className="text-xs text-[#4CAF50] mt-2 font-bold">Alavancagem de Rede</p>
                </div>
            </div>

            {/* REVENUE GROWTH SIMULATOR (Replacing Ranking) */}
            <RevenueGrowthSimulator />
        </div>
    );
};

export const AdminPanelView = () => {
    // This view manages the "Administração" / "Usuarios" route
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConsultant, setSelectedConsultant] = useState<any | null>(null);

    const filteredTeam = DB_LOCAL_STATE.team.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.id.includes(searchTerm) ||
        c.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-gradient-to-br from-brand-dark-bg to-brand-dark-card text-white rounded-[2rem] p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-serif font-bold mb-2">Administração de Usuários</h2>
                    <p className="text-gray-400">Gerencie todos os consultores, visualize cadastros e status.</p>
                </div>
                <div className="flex gap-4">
                     <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Buscar por Nome, ID ou Status" 
                            className="pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-80"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                     </div>
                </div>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Consultor</th>
                            <th className="p-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Contato</th>
                            <th className="p-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="p-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Vendas (Mês)</th>
                            <th className="p-6 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Ação</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {filteredTeam.map((member) => (
                            <tr key={member.id} className="hover:bg-green-50/30 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{member.name}</p>
                                            <p className="text-xs text-gray-500">ID: {member.id} • {member.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <p className="text-sm text-gray-600">{member.email}</p>
                                    <p className="text-xs text-gray-400">{member.phone}</p>
                                </td>
                                <td className="p-6">
                                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                        member.status === 'Ativo' 
                                            ? 'bg-green-100 text-green-700 border-green-200' 
                                            : 'bg-red-50 text-red-600 border-red-100'
                                    }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="p-6 font-mono font-bold text-brand-green-dark">{member.sales}</td>
                                <td className="p-6 text-right">
                                    <button 
                                        onClick={() => setSelectedConsultant(member)}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:text-brand-green-dark hover:border-brand-green-mid shadow-sm transition-all"
                                    >
                                        Ver Ficha
                                    </button>
                                </td>
                            </tr>
                        ))}
                     </tbody>
                 </table>
                 {filteredTeam.length === 0 && (
                     <div className="p-12 text-center text-gray-500">
                         Nenhum consultor encontrado.
                     </div>
                 )}
             </div>

             {/* Consultant Details Modal */}
             {selectedConsultant && (
                 <ConsultantDetailsModal consultant={selectedConsultant} onClose={() => setSelectedConsultant(null)} />
             )}
        </div>
    );
};

// --- LAYOUT COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, to, active, onClick, adminMode }: { icon: any, label: string, to?: string, active?: boolean, onClick?: () => void, adminMode?: boolean }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) onClick();
        if (to) navigate(to);
    };

    // New "Elevate" Design System for Sidebar Items
    // Pill shape, high contrast
    
    // Base classes common to both
    const baseClasses = "w-full flex items-center gap-4 px-6 py-4 rounded-full transition-all duration-200 group relative overflow-hidden";
    
    let activeClasses = "";
    let inactiveClasses = "";

    if (adminMode) {
        // --- Admin Green Theme ---
        // Active: White background, Green text, Shadow
        activeClasses = "bg-white text-[#0A382A] shadow-md font-bold";
        // Inactive: Transparent, White text with opacity
        inactiveClasses = "text-white/70 hover:bg-white/10 hover:text-white font-medium";
    } else {
        // --- Consultant Dark Theme (Legacy/Standard) ---
        activeClasses = "bg-brand-green-dark text-white shadow-lg shadow-green-900/20";
        inactiveClasses = "text-gray-400 hover:bg-white/5 hover:text-white";
    }

    return (
        <button 
            onClick={handleClick}
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
        >
            <Icon className={`h-6 w-6 z-10 relative ${
                active 
                    ? (adminMode ? 'text-[#0A382A]' : 'text-brand-green-mid') 
                    : 'text-current'
            }`} />
            <span className="z-10 relative">{label}</span>
        </button>
    );
};

export const DashboardShell = ({ consultant, children }: { consultant: Consultant, children?: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = consultant.role === 'admin';
    const basePath = isAdmin ? '/admin' : '/consultor';
    
    // Check active states
    const isActive = (path: string) => location.pathname.includes(path);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    // --- Sidebar Background Color (Design Specification) ---
    // Admin: #0A382A (Deep Green)
    // Consultant: brand-dark-bg (Dark Slate)
    const sidebarBg = isAdmin ? 'bg-[#0A382A]' : 'bg-brand-dark-bg';
    const mainBg = isAdmin ? 'bg-[#F9F9F9]' : 'bg-gray-50';

    return (
        <div className={`min-h-screen ${mainBg} flex font-sans`}>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px] ${sidebarBg} shadow-2xl transition-transform duration-300 ease-out flex flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* 1. Brand Logo Area */}
                <div className="p-8 flex items-center justify-center">
                     <div className="w-full bg-white rounded-2xl py-4 px-6 shadow-lg flex justify-center items-center">
                        <img src="https://i.imgur.com/ntlcx07.png" alt="Brotos Logo" className="h-10" />
                     </div>
                     <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white absolute top-4 right-4">
                        <CloseIcon />
                    </button>
                </div>

                {/* 2. Admin Profile Card (Elevate Design) */}
                <div className="px-6 mb-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className={`h-20 w-20 ${isAdmin ? 'bg-[#d4a373] text-[#0A382A]' : 'bg-brand-green-dark text-white'} rounded-full flex items-center justify-center font-bold text-3xl shadow-xl mb-4 border-4 border-white/10`}>
                            {consultant.name.charAt(0)}
                        </div>
                        <h2 className="text-white font-bold text-lg leading-tight mb-1">{consultant.name}</h2>
                        <p className="text-white/50 text-xs font-mono mb-3">ID: {consultant.id}</p>
                        
                        <div className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${isAdmin ? 'bg-[#4CAF50] text-white shadow-lg shadow-green-900/40' : 'bg-gray-800 text-gray-400'}`}>
                            {consultant.role === 'admin' ? 'ADMINISTRADOR' : consultant.role.toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* 3. Navigation Menu */}
                <div className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    
                    {isAdmin ? (
                        // --- ADMIN MENU (CLEAN STRUCTURE - ELEVATE SPEC) ---
                        <>
                             <div className={`px-6 mt-4 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/30`}>
                                Gerenciamento Central
                            </div>

                            <SidebarItem 
                                icon={ChartBarIcon} 
                                label="Dashboard Gerencial" 
                                to={`${basePath}/dashboard`}
                                active={isActive('/dashboard')}
                                adminMode={isAdmin}
                            />
                             <SidebarItem 
                                icon={BriefcaseIcon} 
                                label="Meu Negócio" 
                                to={`${basePath}/negocio`}
                                active={isActive('/negocio')}
                                adminMode={isAdmin} 
                            />
                             <SidebarItem 
                                icon={LockClosedIcon} 
                                label="Administração" 
                                to={`${basePath}/usuarios`}
                                active={isActive('/usuarios')}
                                adminMode={isAdmin} 
                            />

                            <div className={`px-6 mt-8 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/30`}>
                                Relatórios e Finanças
                            </div>

                            <SidebarItem 
                                icon={BanknotesIcon} 
                                label="Financeiro" 
                                to={`${basePath}/financeiro`}
                                active={isActive('/financeiro')}
                                adminMode={isAdmin} 
                            />
                            <SidebarItem 
                                icon={ClipboardListIcon} 
                                label="Relatórios" 
                                to={`${basePath}/relatorios`}
                                active={isActive('/relatorios')}
                                adminMode={isAdmin} 
                            />

                            <div className={`px-6 mt-8 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/30`}>
                                Sistema e Suporte
                            </div>

                             <SidebarItem 
                                icon={ChatIcon} 
                                label="Suporte e Tickets" 
                                to={`${basePath}/suporte`}
                                active={isActive('/suporte')}
                                adminMode={isAdmin} 
                            />
                            <SidebarItem 
                                icon={SparklesIcon} 
                                label="Configurações" 
                                to={`${basePath}/config`}
                                active={isActive('/config')}
                                adminMode={isAdmin} 
                            />
                        </>
                    ) : (
                        // CONSULTANT MENU (Standard)
                        <>
                            <SidebarItem 
                                icon={ChartBarIcon} 
                                label="Visão Geral" 
                                to={`${basePath}/dashboard`}
                                active={isActive('/dashboard')}
                                adminMode={isAdmin}
                            />
                            <SidebarItem 
                                icon={ShoppingCartIcon} 
                                label="Novo Pedido" 
                                to={`${basePath}/novo-pedido`}
                                active={isActive('/novo-pedido')}
                                adminMode={isAdmin} 
                            />
                            <SidebarItem 
                                icon={PackageIcon} 
                                label="Meus Pedidos" 
                                to={`${basePath}/meus-pedidos`}
                                active={isActive('/meus-pedidos')}
                                adminMode={isAdmin} 
                            />

                            <div className="px-6 mt-8 mb-4 text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Crescimento</div>
                            <SidebarItem 
                                icon={PhotoIcon} 
                                label="Marketing" 
                                to={`${basePath}/materiais`}
                                active={isActive('/materiais')}
                                adminMode={isAdmin} 
                            />
                            <SidebarItem 
                                icon={AcademicCapIcon} 
                                label="UniBrotos" 
                                to={`${basePath}/unibrotos`}
                                active={isActive('/unibrotos')}
                                adminMode={isAdmin} 
                            />
                             <SidebarItem 
                                icon={UserPlusIcon} 
                                label="Convidar" 
                                to={`${basePath}/convidar`}
                                active={isActive('/convidar')}
                                adminMode={isAdmin} 
                            />

                            {(consultant.role === 'leader') && (
                                <>
                                    <div className="px-6 mt-8 mb-4 text-[10px] font-extrabold uppercase tracking-widest text-brand-earth">Gestão</div>
                                    <SidebarItem 
                                        icon={BriefcaseIcon} 
                                        label="Meu Negócio" 
                                        to={`${basePath}/meu-negocio`}
                                        active={isActive('/meu-negocio')}
                                        adminMode={isAdmin} 
                                    />
                                    <SidebarItem 
                                        icon={BanknotesIcon} 
                                        label="Financeiro" 
                                        to={`${basePath}/financeiro`}
                                        active={isActive('/financeiro')}
                                        adminMode={isAdmin} 
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* 4. Footer Action */}
                <div className="p-6">
                    <button 
                        onClick={handleLogout}
                        className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-colors font-bold ${isAdmin ? 'bg-[#144d3b] text-red-300 hover:bg-red-900/20 hover:text-red-200' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <LogoutIcon className="h-5 w-5" />
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 transition-all duration-300">
                {/* Mobile Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between lg:hidden">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <MenuIcon />
                    </button>
                    <BrandLogo className="h-8" />
                    <div className="w-8"></div> {/* Spacer */}
                </header>

                <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

// --- AUTH SCREENS ---

// Public Login Screen (NO Admin Magic)
export const LoginScreen = () => {
    const [credential, setCredential] = useState(''); // Unified credential (email or ID)
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let emailToAuth = credential;
            let isEmail = credential.includes('@');

            // --- 2. ID LOOKUP (If not email) ---
            if (!isEmail) {
                const { data: profiles, error: profileLookupError } = await supabase
                    .from('consultants')
                    .select('email, role')
                    .eq('id', credential)
                    .maybeSingle();

                if (profileLookupError) {
                    throw new Error('Erro ao buscar ID. Verifique a conexão.');
                }
                
                if (!profiles) {
                    throw new Error('ID não encontrado.');
                }
                
                // Security check: if user is admin, force them to use the admin portal
                if (profiles.role === 'admin') {
                    throw new Error('Acesso administrativo restrito. Use o Portal Master.');
                }
                
                emailToAuth = profiles.email;
            }

            // --- 3. STANDARD SUPABASE AUTH ---
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: emailToAuth,
                password
            });

            if (authError) throw authError;

            // Redirect based on role
            if (data.user) {
                navigate('/consultor/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao entrar. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-green-dark opacity-20 blur-[100px] rounded-full animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-earth opacity-10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* WHITE CARD CONTAINER (Solid White for Contrast) */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-slide-up border border-gray-100">
                <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
                    <BrandLogo className="h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-serif font-bold text-gray-800">Bem-vindo ao Clube</h2>
                    <p className="text-gray-500 text-sm mt-2">Área exclusiva para Consultores.</p>
                </div>
                
                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        {/* UPDATED LABEL: ID Consultor */}
                        <label className="text-sm font-bold text-gray-700 ml-1">ID Consultor</label>
                        <input 
                            type="text" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green-mid focus:ring-2 focus:ring-brand-green-light outline-none transition-all bg-gray-50 focus:bg-white"
                            placeholder="Digite seu ID"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Senha</label>
                        <input 
                            type="password" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green-mid focus:ring-2 focus:ring-brand-green-light outline-none transition-all bg-gray-50 focus:bg-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-brand-green-dark hover:bg-brand-green-mid text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/10 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Entrando...' : 'Acessar Painel'}
                    </button>

                    <div className="text-center pt-4 border-t border-gray-50">
                        <p className="text-gray-500 text-sm">Ainda não faz parte?</p>
                        <Link to="/cadastro" className="text-brand-green-dark font-bold hover:underline">
                            Torne-se um Consultor
                        </Link>
                    </div>
                </form>
            </div>
            <p className="mt-8 text-gray-500 text-sm relative z-10">© 2024 Brotos da Terra. Todos os direitos reservados.</p>
        </div>
    );
};

// NEW: Admin Login Screen (SECRET URL)
export const AdminLoginScreen = () => {
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // --- 1. MAGIC ADMIN CHECK (Fallback for Setup - ONLY HERE) ---
            if (credential === '000000' && password === 'jo1234') {
                const adminEmail = 'admin@brotos.com';
                
                // Try direct login
                const { data: loginData } = await supabase.auth.signInWithPassword({
                    email: adminEmail,
                    password: password
                });

                if (loginData.session) {
                     navigate('/admin/dashboard');
                     return;
                }

                // If fails, try to create (first time)
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: adminEmail,
                    password: password
                });

                if (signUpError) throw new Error('Falha ao criar admin automático.');

                if (signUpData.user) {
                     const { error: profileError } = await supabase.from('consultants').upsert({
                         id: '000000',
                         auth_id: signUpData.user.id,
                         name: 'Administrador Geral',
                         email: adminEmail,
                         role: 'admin',
                         whatsapp: '',
                         created_at: new Date().toISOString()
                     });

                     if (profileError) throw profileError;
                     navigate('/admin/dashboard');
                     return;
                }
            }

            // Normal Admin Login (Email/Password)
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: credential, // Admin uses email usually
                password
            });

            if (authError) throw authError;

            // Redirect based on role
            if (data.user) {
                // Fetch fresh profile to be sure of role
                const { data: profile } = await supabase
                    .from('consultants')
                    .select('role')
                    .eq('auth_id', data.user.id)
                    .single();

                if (profile?.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    setError('Esta conta não possui permissões administrativas.');
                    await supabase.auth.signOut();
                }
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao entrar. Credenciais inválidas.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A382A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
             {/* Dark Background Effects */}
             <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0A382A] opacity-30 rounded-full blur-[120px]"></div>
            </div>

            {/* WHITE CARD CONTAINER for Admin (High Contrast) */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-fade-in border border-gray-100">
                <div className="p-8 text-center bg-[#0A382A] border-b border-[#0A382A]">
                    <BrandLogo className="h-12 mx-auto mb-4 filter brightness-0 invert" />
                    <h2 className="text-xl font-serif font-bold text-white tracking-wide">Portal Master</h2>
                    <p className="text-green-200/70 text-xs mt-2 uppercase tracking-widest font-bold">Acesso Restrito</p>
                </div>
                
                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        {/* UPDATED LABEL: ID MASTER */}
                        <label className="text-sm font-bold text-[#0A382A] ml-1 uppercase">ID MASTER</label>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <input 
                                type="text" 
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400"
                                placeholder="Acesso Master"
                                value={credential}
                                onChange={(e) => setCredential(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0A382A] ml-1 uppercase">Chave de Segurança</label>
                        <div className="relative">
                            <ShieldCheckIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <input 
                                type="password" 
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                    >
                        {loading ? 'Autenticando...' : 'Iniciar Sessão Segura'}
                    </button>
                </form>
            </div>
             <div className="mt-8 text-center z-10 opacity-30">
                <LockClosedIcon className="h-6 w-6 text-white mx-auto mb-2" />
                <p className="text-white text-xs">Conexão Criptografada</p>
            </div>
        </div>
    );
};

export const ConsultantRegister = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', document: '', address: '', city: '', state: ''
    });
    const navigate = useNavigate();

    // Generate random ID (simulated)
    const generateId = () => Math.floor(100000 + Math.random() * 900000).toString();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Sign Up in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create Profile in 'consultants' table
                // Uses the RLS policy "Users can insert their own profile"
                const newId = generateId();
                const { error: dbError } = await supabase.from('consultants').insert({
                    id: newId,
                    auth_id: authData.user.id,
                    name: formData.name,
                    email: formData.email,
                    whatsapp: formData.phone,
                    document_id: formData.document,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    role: 'consultant',
                    parent_id: '007053' // Default sponsor
                });

                if (dbError) throw dbError;

                alert("Cadastro realizado com sucesso! Faça login para continuar.");
                navigate('/login');
            }

        } catch (error: any) {
            alert("Erro no cadastro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden animate-slide-up">
                <div className="bg-brand-green-dark p-8 text-white text-center">
                    <BrandLogo className="h-12 mx-auto mb-4 filter brightness-0 invert" />
                    <h2 className="text-2xl font-serif font-bold">Ficha de Cadastro</h2>
                    <p className="opacity-80 text-sm">Junte-se a nós e comece a lucrar hoje.</p>
                </div>

                <form onSubmit={handleRegister} className="p-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Nome Completo</label>
                                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">CPF</label>
                                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" 
                                    value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">E-mail</label>
                                <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" 
                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">WhatsApp</label>
                                <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" 
                                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>
                        </div>

                         <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Endereço Completo</label>
                            <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" 
                                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Senha de Acesso</label>
                            <input type="password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" 
                                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-brand-green-mid hover:bg-brand-green-dark text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                        >
                            {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                        </button>
                    </div>
                    
                    <div className="text-center mt-6">
                        <Link to="/login" className="text-brand-green-dark font-bold text-sm hover:underline">
                            Já tenho uma conta
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- ADDITIONAL VIEWS (Placeholder Implementations for Routing) ---

export const MaterialsView = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
             <div>
                <h2 className="text-3xl font-serif font-bold text-gray-800">Materiais de Apoio</h2>
                <p className="text-gray-500">Baixe imagens e textos para divulgar.</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                        <PhotoIcon className="h-12 w-12 text-gray-300" />
                    </div>
                    <div className="p-6">
                        <h3 className="font-bold text-gray-800 mb-2">Pack de Marketing #{i}</h3>
                        <p className="text-sm text-gray-500 mb-4">Imagens para redes sociais e stories.</p>
                        <button className="w-full py-2 border border-brand-green-mid text-brand-green-dark font-bold rounded-lg hover:bg-brand-green-mid hover:text-white transition-colors flex items-center justify-center gap-2">
                            <DownloadIcon className="h-4 w-4" /> Baixar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const UniBrotosView = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-brand-earth rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                    <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Universidade Corporativa</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">UniBrotos</h2>
                <p className="text-white/80 max-w-xl text-lg">
                    Domine as vendas e cresça na carreira com nossos treinamentos exclusivos.
                </p>
            </div>
        </div>
         <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <PlayCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Módulos em Breve</h3>
            <p className="text-gray-500">Estamos preparando conteúdos incríveis para você.</p>
        </div>
    </div>
);

export const MyOrdersView = () => (
    <div className="space-y-8 animate-fade-in">
         <h2 className="text-3xl font-serif font-bold text-gray-800">Meus Pedidos</h2>
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-12 text-center">
                <PackageIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhum pedido encontrado</h3>
                <p className="text-gray-400">Você ainda não realizou nenhuma compra.</p>
            </div>
         </div>
    </div>
);

export const NewOrderView = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-serif font-bold text-gray-800">Loja do Consultor</h2>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
                <ShoppingCartIcon className="h-5 w-5 text-brand-green-mid" />
                <span className="font-bold text-gray-700">Carrinho (0)</span>
            </div>
        </div>
         <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
             <StoreIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">O catálogo de produtos está sendo atualizado.</p>
        </div>
    </div>
);

export const InviteView = () => (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
        <div className="text-center">
             <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Expanda sua Rede</h2>
             <p className="text-gray-500">Convide novos consultores e ganhe comissões sobre as vendas deles.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex flex-col items-center gap-6">
                <div className="h-24 w-24 bg-brand-green-light/20 rounded-full flex items-center justify-center text-brand-green-dark">
                    <QrCodeIcon className="h-12 w-12" />
                </div>
                <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
                    <span className="text-gray-600 font-mono text-sm truncate">https://brotos.com/convite/REF123456</span>
                    <button className="text-brand-green-dark hover:bg-white p-2 rounded-lg transition-colors">
                        <ClipboardCopyIcon className="h-5 w-5" />
                    </button>
                </div>
                <button className="w-full py-4 bg-brand-green-dark text-white font-bold rounded-xl shadow-lg hover:bg-brand-green-mid transition-all flex items-center justify-center gap-2">
                    <WhatsAppIcon className="h-5 w-5" />
                    Compartilhar no WhatsApp
                </button>
            </div>
        </div>
    </div>
);

export const BusinessView = () => (
    <div className="space-y-8 animate-fade-in">
        <h2 className="text-3xl font-serif font-bold text-gray-800">Meu Negócio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase">Consultores Ativos</h3>
                <p className="text-4xl font-bold text-gray-800 mt-2">12</p>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase">Vendas da Rede</h3>
                <p className="text-4xl font-bold text-brand-green-dark mt-2">R$ 4.500</p>
            </div>
        </div>
    </div>
);

export const FinancialView = () => (
    <div className="space-y-8 animate-fade-in">
        <h2 className="text-3xl font-serif font-bold text-gray-800">Gestão Financeira</h2>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2rem] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
            <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Saldo Disponível</p>
                <h3 className="text-5xl font-mono font-bold mt-2">R$ 1.250,00</h3>
            </div>
            <button className="px-8 py-4 bg-green-500 hover:bg-green-400 text-gray-900 font-bold rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center gap-2">
                <BanknotesIcon className="h-5 w-5" />
                Solicitar Saque
            </button>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Histórico de Transações</h3>
            <p className="text-gray-400 text-center py-8">Nenhuma movimentação recente.</p>
        </div>
    </div>
);

// --- Admin Placeholder Views ---

export const AdminGoalsView = () => (
     <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">Metas da Rede</h2>
        <p className="text-gray-500">Configuração de metas (Legado).</p>
    </div>
);

export const AdminWithdrawalsView = () => (
     <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">Solicitações de Saque</h2>
        <p className="text-gray-500">Gestão de saques (Legado).</p>
    </div>
);

export const AdminReportsView = () => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-3xl font-serif font-bold text-[#0A382A]">Relatórios</h2>
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
             <ClipboardListIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">Módulo de relatórios avançados em desenvolvimento.</p>
        </div>
    </div>
);

export const AdminSupportView = () => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-3xl font-serif font-bold text-[#0A382A]">Central de Suporte</h2>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <ChatIcon className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">Tickets Abertos</h3>
                    <p className="text-sm text-gray-500">Gerencie as dúvidas dos consultores</p>
                </div>
            </div>
            <p className="text-gray-400 text-center py-4">Nenhum ticket pendente.</p>
        </div>
    </div>
);

export const AdminSettingsView = () => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-3xl font-serif font-bold text-[#0A382A]">Configurações</h2>
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-700">Manutenção do Sistema</span>
                <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
            </div>
             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-700">Novos Cadastros</span>
                <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
            </div>
        </div>
    </div>
);