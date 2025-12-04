
import React, { useState, useEffect } from 'react';
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
    ShieldCheckIcon
} from './components/Icons';
import { Consultant, ConsultantStats, Sale, Notification, PrivateCustomer, PrivateSale, Material, Lesson, Order } from './types';

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

// --- Centralized Mock Data (Fallback) ---
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
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
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

// --- Network Details Modal (New) ---
const NetworkDetailsModal = ({ title, data, type, onClose }: { title: string, data: any[], type: 'standard' | 'hierarchy', onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            <div className="bg-white rounded-[2rem] w-full max-w-4xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                <div className="bg-[#0A382A] px-8 py-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-white">{title}</h3>
                        <p className="text-green-100/60 text-sm mt-1">Total de registros: {data.length}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                        <CloseIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-5 text-xs font-extrabold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="p-5 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nome</th>
                                {type === 'hierarchy' ? (
                                    <th className="p-5 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Indicado Por (Patrocinador)</th>
                                ) : (
                                    <>
                                        <th className="p-5 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Contato</th>
                                        <th className="p-5 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="p-5 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Cidade/UF</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-500">
                                        Nenhum registro encontrado nesta categoria.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-5 font-mono text-sm text-gray-400">{item.id}</td>
                                        <td className="p-5">
                                            <div className="font-bold text-gray-800">{item.name}</div>
                                            <div className="text-xs text-gray-400">{item.email}</div>
                                        </td>
                                        {type === 'hierarchy' ? (
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-brand-green-mid"></div>
                                                    <span className="font-medium text-gray-700">{item.sponsorName || 'Admin (000000)'}</span>
                                                </div>
                                            </td>
                                        ) : (
                                            <>
                                                <td className="p-5 text-sm text-gray-600">{item.whatsapp}</td>
                                                <td className="p-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                                        title.includes('Ativos') ? 'bg-green-50 text-green-700 border-green-200' :
                                                        title.includes('Inativos') ? 'bg-gray-100 text-gray-500 border-gray-200' :
                                                        'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}>
                                                        {item.role === 'admin' ? 'Master' : 'Consultor'}
                                                    </span>
                                                </td>
                                                <td className="p-5 text-sm text-gray-500">
                                                    {item.city && item.state ? `${item.city} - ${item.state}` : '-'}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
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
                        <Link to={consultant.role === 'admin' ? "/admin/novo-pedido" : "/consultor/novo-pedido"} className="px-6 py-3 bg-white text-brand-green-dark rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2">
                            <ShoppingCartIcon className="h-5 w-5" />
                            Novo Pedido
                        </Link>
                         <Link to={consultant.role === 'admin' ? "/admin/materiais" : "/consultor/materiais"} className="px-6 py-3 bg-brand-green-dark bg-opacity-30 border border-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-opacity-40 transition-all flex items-center gap-2">
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

// --- COMPONENT: Consultant Ranking (List Layout) ---
const ConsultantRanking = () => {
    // This assumes real data will be passed or fetched inside.
    // For now using mock data sorted.
    const sortedTeam = [...MOCK_DATA.team].sort((a, b) => {
        const valA = parseFloat(a.sales.replace('R$ ', '').replace('.', '').replace(',', '.'));
        const valB = parseFloat(b.sales.replace('R$ ', '').replace('.', '').replace(',', '.'));
        return valB - valA;
    });

    const getMedalColor = (index: number) => {
        if (index === 0) return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // Gold
        if (index === 1) return 'bg-gray-100 text-gray-600 border-gray-200'; // Silver
        if (index === 2) return 'bg-orange-50 text-orange-700 border-orange-200'; // Bronze
        return 'bg-white text-gray-500 border-gray-100';
    };

    return (
        <div className="bg-[#144d3b] rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-lg shadow-green-900/20">
             {/* Header */}
             <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur">
                    <SparklesIcon className="h-6 w-6 text-[#4CAF50]" />
                </div>
                <div>
                    <h3 className="text-2xl font-serif font-bold">Ranking de Consultores</h3>
                    <p className="text-green-100/60 text-sm">Os maiores destaques da sua rede neste mês.</p>
                </div>
             </div>

             {/* Top 3 Podium Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {sortedTeam.slice(0, 3).map((consultant, index) => (
                    <div key={consultant.id} className={`relative p-6 rounded-2xl border ${index === 0 ? 'bg-gradient-to-b from-[#4CAF50]/20 to-[#144d3b] border-[#4CAF50]/50' : 'bg-white/5 border-white/10'} flex flex-col items-center text-center`}>
                        {index === 0 && <div className="absolute -top-3">👑</div>}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-3 border-2 ${index === 0 ? 'bg-yellow-400 text-yellow-900 border-yellow-200' : index === 1 ? 'bg-gray-300 text-gray-800 border-gray-100' : 'bg-orange-400 text-orange-900 border-orange-200'}`}>
                            {consultant.name.charAt(0)}
                        </div>
                        <h4 className="font-bold text-lg truncate w-full">{consultant.name}</h4>
                        <span className="text-xs opacity-60 mb-2">{consultant.role}</span>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${index === 0 ? 'bg-[#4CAF50] text-white' : 'bg-white/10 text-gray-300'}`}>
                            {consultant.sales}
                        </span>
                    </div>
                ))}
             </div>

             {/* List for the rest */}
             <div className="space-y-3">
                 {sortedTeam.slice(3, 8).map((consultant, index) => (
                     <div key={consultant.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-4">
                             <span className="font-mono text-white/40 font-bold w-6 text-center">{index + 4}</span>
                             <div className="flex flex-col">
                                 <span className="font-bold text-sm">{consultant.name}</span>
                                 <span className="text-[10px] uppercase tracking-wider opacity-50">{consultant.role}</span>
                             </div>
                         </div>
                         <span className="font-mono font-bold text-[#4CAF50]">{consultant.sales}</span>
                     </div>
                 ))}
             </div>
        </div>
    );
};

export const AdminOverviewView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const navigate = useNavigate();

    // --- STATES FOR ATOMIC METRICS ---
    const [networkStats, setNetworkStats] = useState({
        newConsultants: [] as Consultant[],
        activeConsultants: [] as Consultant[],
        inactiveConsultants: [] as Consultant[],
        sponsors: [] as Consultant[],
        hierarchy: [] as any[], // Changed to any to hold sponsor name
        loading: true
    });

    // --- MODAL STATE ---
    const [modalConfig, setModalConfig] = useState<{isOpen: boolean, title: string, data: any[], type: 'standard' | 'hierarchy'}>({
        isOpen: false, 
        title: '', 
        data: [], 
        type: 'standard'
    });

    // --- ATOMIC DATA FETCHING ---
    useEffect(() => {
        const fetchNetworkXRay = async () => {
            try {
                // 1. Fetch All Consultants
                const { data: allConsultants, error } = await supabase.from('consultants').select('*');
                
                // 2. Fetch Orders (to determine activity)
                const { data: allOrders } = await supabase.from('orders').select('consultant_id, created_at');

                if (allConsultants) {
                    const now = new Date();
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(now.getDate() - 30);

                    // COMMAND 1: New Consultants (Last 30 Days)
                    const newCons = allConsultants.filter(c => new Date(c.created_at) > thirtyDaysAgo);

                    // COMMAND 2 & 3: Active vs Inactive Logic
                    const activeIds = new Set(allOrders?.map(o => o.consultant_id) || []);
                    const activeCons = allConsultants.filter(c => activeIds.has(c.id));
                    const inactiveCons = allConsultants.filter(c => !activeIds.has(c.id));

                    // COMMAND 4: Sponsors (Who has referred someone)
                    const parentIds = new Set(allConsultants.map(c => c.parent_id).filter(id => id && id !== '000000'));
                    const sponsorList = allConsultants.filter(c => parentIds.has(c.id));

                    // COMMAND 5: Hierarchy (Map Sponsor Names)
                    const hierarchyList = allConsultants.map(c => {
                        const sponsor = allConsultants.find(p => p.id === c.parent_id);
                        return {
                            ...c,
                            sponsorName: sponsor ? sponsor.name : 'N/A'
                        };
                    });

                    setNetworkStats({
                        newConsultants: newCons,
                        activeConsultants: activeCons,
                        inactiveConsultants: inactiveCons,
                        sponsors: sponsorList,
                        hierarchy: hierarchyList,
                        loading: false
                    });
                }
            } catch (err) {
                console.error("Error fetching network stats", err);
            }
        };

        fetchNetworkXRay();
    }, []);

    // --- HANDLERS ---
    const openListModal = (title: string, data: any[], type: 'standard' | 'hierarchy' = 'standard') => {
        setModalConfig({ isOpen: true, title, data, type });
    };

    const closeListModal = () => {
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    // --- UI HELPER FOR CARDS ---
    const MetricCard = ({ title, value, icon: Icon, colorClass, onClick, subtext }: any) => (
        <button 
            onClick={onClick}
            className={`flex-1 p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-lg text-left ${colorClass}`}
        >
            <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{title}</p>
                <h4 className="text-2xl font-bold">{value}</h4>
                {subtext && <p className="text-[10px] opacity-60 mt-1">{subtext}</p>}
            </div>
        </button>
    );

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Header */}
            <div className="flex justify-between items-center px-2">
                <div>
                     <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A382A]">Olá, Administrador! 👋</h2>
                     <p className="text-gray-500 text-sm">Visão global e estratégica da rede.</p>
                </div>
                <span className="text-gray-400 text-sm italic hidden md:block">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>

            {/* SECTION 1: NETWORK HERO (Existing) */}
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-[2] bg-[#0A382A] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-center min-h-[380px] shadow-lg shadow-green-900/20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.03] rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-green-100">Rede Global</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6 text-white">
                            Monitore o <br/>
                            <span className="text-[#4CAF50]">Crescimento</span>
                        </h1>
                        <p className="text-green-50/70 text-lg font-light max-w-lg mb-10 leading-relaxed">
                            Acompanhe em tempo real o desempenho de todos os consultores, novas adesões e volume de vendas.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/admin/administracao" className="px-6 py-4 bg-white text-[#0A382A] rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 min-w-[160px]">
                                <UsersIcon className="h-5 w-5" />
                                <div className="text-left leading-tight">
                                    <span className="block text-[9px] uppercase text-gray-400 font-extrabold tracking-wider">Consultores</span>
                                    <span className="text-sm">Gerenciar</span>
                                </div>
                            </Link>
                             <Link to="/admin/financeiro" className="px-6 py-4 bg-[#144d3b] text-white border border-white/5 rounded-2xl font-bold hover:bg-[#1a5e48] transition-all flex items-center justify-center gap-3 min-w-[160px]">
                                <BanknotesIcon className="h-5 w-5 text-[#4CAF50]" />
                                <div className="text-left leading-tight">
                                    <span className="block text-[9px] uppercase text-gray-400 font-extrabold tracking-wider">Acessar</span>
                                    <span className="text-sm">Financeiro</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: NETWORK SUMMARY CARDS (Dynamic Data) */}
                <div className="w-full xl:w-96 bg-[#1C2833] rounded-[2.5rem] p-8 text-white flex flex-col shadow-lg shadow-gray-900/20">
                     <h3 className="text-xl font-bold mb-6">Resumo da Rede</h3>
                     
                     <div className="flex-1 flex flex-col gap-4 justify-center">
                        <div onClick={() => openListModal('Novos Consultores (30d)', networkStats.newConsultants)} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition">
                            <div className="p-3 bg-[#144d3b] rounded-xl text-[#4CAF50]">
                                <UserPlusIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Novos (30d)</p>
                                <h4 className="text-2xl font-bold">{networkStats.loading ? '...' : networkStats.newConsultants.length}</h4>
                            </div>
                        </div>

                        <div onClick={() => openListModal('Consultores Ativos', networkStats.activeConsultants)} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition">
                            <div className="p-3 bg-blue-900/30 rounded-xl text-blue-400">
                                <CheckCircleIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Ativos</p>
                                <h4 className="text-2xl font-bold">{networkStats.loading ? '...' : networkStats.activeConsultants.length}</h4>
                            </div>
                        </div>

                         <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-yellow-900/30 rounded-xl text-yellow-400">
                                <ShoppingCartIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Pedidos (Hoje)</p>
                                <h4 className="text-2xl font-bold">23</h4> {/* Mock for daily activity */}
                            </div>
                        </div>
                     </div>
                </div>
            </div>

            {/* SECTION 3: RAIO-X DA REDE (Atomic Commands Activated) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-200 shadow-sm">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#0A382A] rounded-lg text-white">
                        <UsersIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-[#0A382A]">Raio-X da Rede</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. Novos Consultores */}
                    <MetricCard 
                        title="Novos Consultores" 
                        subtext="Últimos 30 dias"
                        value={networkStats.newConsultants.length} 
                        icon={UserPlusIcon} 
                        colorClass="bg-[#0A382A] text-white border-[#0A382A]"
                        onClick={() => openListModal('Novos Consultores', networkStats.newConsultants)}
                    />
                    
                    {/* 2. Inativos */}
                    <MetricCard 
                        title="Consultores Inativos" 
                        subtext="Sem pedidos registrados"
                        value={networkStats.inactiveConsultants.length} 
                        icon={UsersIcon} 
                        colorClass="bg-gray-100 text-gray-600 border-gray-200"
                        onClick={() => openListModal('Consultores Inativos', networkStats.inactiveConsultants)}
                    />

                    {/* 3. Quem Indicou (Patrocinadores) */}
                    <MetricCard 
                        title="Patrocinadores" 
                        subtext="Consultores que formaram time"
                        value={networkStats.sponsors.length} 
                        icon={UsersIcon} 
                        colorClass="bg-blue-600 text-white border-blue-600"
                        onClick={() => openListModal('Lista de Patrocinadores', networkStats.sponsors)}
                    />

                    {/* 4. Estrutura (Total) */}
                     <MetricCard 
                        title="Estrutura de Indicação" 
                        subtext="Cadastro Global e Hierarquia"
                        value={networkStats.hierarchy.length} 
                        icon={StoreIcon} 
                        colorClass="bg-[#1C2833] text-white border-[#1C2833]"
                        onClick={() => openListModal('Estrutura de Indicação (Quem indicou quem)', networkStats.hierarchy, 'hierarchy')}
                    />
                 </div>
                 
                 <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500 flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                     Dados atualizados em tempo real com base no registro global de consultores.
                 </div>
            </div>

            {/* SECTION 4: RANKING */}
            <ConsultantRanking />

            {/* DETAIL MODAL */}
            {modalConfig.isOpen && (
                <NetworkDetailsModal 
                    title={modalConfig.title} 
                    data={modalConfig.data} 
                    type={modalConfig.type} 
                    onClose={closeListModal} 
                />
            )}
        </div>
    );
};

export const MaterialsView = () => {
