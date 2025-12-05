import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useOutletContext, Link } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { NewConsultantsTable } from './NewConsultantsTable';
import { SideRanking } from './SideRanking';
import { ChecklistView } from './Checklist';
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
    ShieldCheckIcon,
    ShareIcon
} from './components/Icons';
import { Consultant, Order, DashboardContextType } from './types';

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
                                order.status === 'Enviado' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                'bg-yellow-100 text-yellow-700 border-yellow-200'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Realizado em {order.date}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="space-y-8">
                        {/* Status Steps */}
                        <div className="relative">
                            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
                            <div className={`absolute left-0 top-1/2 w-3/4 h-1 bg-brand-green-mid -translate-y-1/2 rounded-full transition-all duration-1000`}></div>
                            <div className="relative flex justify-between">
                                {['Confirmado', 'Em Separação', 'Enviado', 'Entregue'].map((step, i) => (
                                    <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                                        <div className={`w-4 h-4 rounded-full border-2 ${i < 3 ? 'bg-brand-green-mid border-brand-green-mid' : 'bg-white border-gray-300'}`}></div>
                                        <span className={`text-xs font-medium ${i < 3 ? 'text-brand-green-dark' : 'text-gray-400'}`}>{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Items */}
                        <div>
                            <h4 className="font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <PackageIcon className="h-5 w-5 text-brand-green-mid" />
                                Itens do Pedido
                            </h4>
                            <div className="bg-gray-50 rounded-xl p-4 flex gap-4">
                                <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 p-2 flex items-center justify-center">
                                    <img src="https://i.imgur.com/ntlcx07.png" alt="Produto" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">Kit Pomadas Terapêuticas - Alívio Natural</h5>
                                    <p className="text-sm text-gray-500 mt-1">Quantidade: {qty} caixas (12 un. cada)</p>
                                    <p className="text-brand-green-dark font-bold mt-2">{formatCurrency(unitPrice)} <span className="text-xs font-normal text-gray-400">/un</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{formatCurrency(subtotal)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Payment */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-serif font-bold text-gray-900 flex items-center gap-2">
                                    <TruckIcon className="h-5 w-5 text-brand-green-mid" />
                                    Endereço de Entrega
                                </h4>
                                <div className="bg-white border border-gray-100 rounded-xl p-4 text-sm text-gray-600 leading-relaxed shadow-sm">
                                    <p className="font-medium text-gray-900 mb-1">Consultora Brotos da Terra</p>
                                    <p>Rua das Flores, 123 - Sala 4</p>
                                    <p>Jardim Botânico</p>
                                    <p>Curitiba - PR</p>
                                    <p>CEP: 80000-000</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-serif font-bold text-gray-900 flex items-center gap-2">
                                    <CreditCardIcon className="h-5 w-5 text-brand-green-mid" />
                                    Resumo Financeiro
                                </h4>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Frete</span>
                                        <span>{shipping === 0 ? 'Grátis' : formatCurrency(shipping)}</span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold text-lg text-brand-green-dark">
                                        <span>Total</span>
                                        <span>{order.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end gap-3">
                     <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        Ajuda com Pedido
                     </button>
                     <button className="px-6 py-2.5 bg-brand-green-mid text-white font-medium rounded-xl hover:bg-brand-green-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Rastrear Entrega
                     </button>
                </div>
            </div>
        </div>
    );
};

// --- Dashboard Shell (Layout) ---
export const DashboardShell = ({ children, consultant }: { children?: React.ReactNode, consultant?: Consultant }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine current section for header title
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Visão Geral';
        if (path.includes('materiais')) return 'Materiais de Apoio';
        if (path.includes('unibrotos')) return 'UniBrotos';
        if (path.includes('meus-pedidos')) return 'Meus Pedidos';
        if (path.includes('novo-pedido')) return 'Novo Pedido';
        if (path.includes('convidar')) return 'Convite';
        if (path.includes('meu-negocio')) return 'Meu Negócio';
        if (path.includes('financeiro')) return 'Financeiro';
        if (path.includes('admin')) return 'Portal Master';
        if (path.includes('checklist')) return 'Checklist do Projeto';
        return 'Brotos da Terra';
    };

    const handleLogout = async () => {
        // Check if user was admin to redirect correctly
        const wasAdmin = localStorage.getItem('sb-admin-session') || consultant?.role === 'admin';
        
        await supabase.auth.signOut();
        localStorage.removeItem('sb-admin-session'); // Clear simulated session
        
        if (wasAdmin) {
            navigate('/portal-master');
        } else {
            navigate('/login');
        }
    };

    // Define menu items based on role
    const getMenuItems = () => {
        const baseItems = [];

        // Adiciona Checklist para todos (Público/Dev)
        baseItems.push({ icon: ClipboardListIcon, label: 'Checklist Projeto', path: '/checklist' });

        if (consultant?.role === 'admin') {
            return [
                { icon: ChartBarIcon, label: 'Visão Geral', path: '/admin/dashboard' },
                { icon: UsersIcon, label: 'Usuários', path: '/admin/usuarios' },
                { icon: BriefcaseIcon, label: 'Negócio', path: '/admin/negocio' },
                { icon: BanknotesIcon, label: 'Financeiro', path: '/admin/financeiro' },
                { icon: PresentationChartLineIcon, label: 'Relatórios', path: '/admin/relatorios' },
                { icon: ShieldCheckIcon, label: 'Suporte', path: '/admin/suporte' },
                { icon: LockClosedIcon, label: 'Configurações', path: '/admin/config' },
                ...baseItems
            ];
        }
        
        // Default consultant/leader menu
        if (consultant) {
            return [
                { icon: ChartBarIcon, label: 'Visão Geral', path: '/consultor/dashboard' },
                { icon: UsersIcon, label: 'Meu Negócio', path: '/consultor/meu-negocio' }, // New Business View
                { icon: AcademicCapIcon, label: 'UniBrotos', path: '/consultor/unibrotos' },
                { icon: PhotoIcon, label: 'Materiais', path: '/consultor/materiais' },
                { icon: ShoppingCartIcon, label: 'Novo Pedido', path: '/consultor/novo-pedido' },
                { icon: PackageIcon, label: 'Meus Pedidos', path: '/consultor/meus-pedidos' },
                { icon: BanknotesIcon, label: 'Financeiro', path: '/consultor/financeiro' },
                { icon: UserPlusIcon, label: 'Convidar', path: '/consultor/convidar' },
                ...baseItems
            ];
        }

        // Se for acesso público (ex: Checklist apenas)
        return baseItems;
    };

    const menuItems = getMenuItems();

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out flex flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-24 flex items-center justify-center border-b border-gray-50 bg-white">
                    <BrandLogo className="h-10 w-auto" />
                </div>

                <div className="p-6">
                    {consultant ? (
                        <div className="bg-brand-green-light rounded-2xl p-4 flex items-center gap-3 mb-6 border border-brand-green-mid/10">
                            <div className="h-12 w-12 rounded-full bg-brand-green-mid text-white flex items-center justify-center font-bold text-lg shadow-md">
                                {consultant?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-gray-900 truncate">{consultant?.name || 'Usuário'}</p>
                                <p className="text-xs text-brand-green-mid font-medium uppercase tracking-wider">{consultant?.role || 'Consultor'}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-center">
                            <p className="text-sm font-bold text-gray-500">Visitante</p>
                        </div>
                    )}

                    <nav className="space-y-1.5">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                                        ${isActive 
                                            ? 'bg-brand-green-mid text-white shadow-lg shadow-brand-green-mid/20 font-medium' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-brand-green-dark font-medium'
                                        }
                                    `}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand-green-mid'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-gray-50">
                    {consultant ? (
                         <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full font-medium"
                        >
                            <LogoutIcon className="h-5 w-5" />
                            <span>Sair do Sistema</span>
                        </button>
                    ) : (
                        <Link 
                            to="/login"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-green-mid hover:bg-green-50 transition-colors w-full font-medium"
                        >
                            <UserCircleIcon className="h-5 w-5" />
                            <span>Fazer Login</span>
                        </Link>
                    )}
                    <p className="text-xs text-center text-gray-300 mt-4">v{1.0}</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 relative">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                            <MenuIcon />
                        </button>
                        <h1 className="text-xl font-serif font-bold text-gray-800 hidden md:block">
                            {getPageTitle()}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-brand-green-mid hover:bg-gray-50 rounded-full transition-colors">
                            <BellIcon className="h-6 w-6" />
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                             <CalendarIcon className="h-4 w-4" />
                             <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
                    <div className="max-w-7xl mx-auto space-y-8 pb-20">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

// ==========================================
// VIEWS (PAGES)
// ==========================================

export const OverviewView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    
    return (
        <div className="space-y-8 animate-slide-up">
            {/* Welcome Banner */}
            <div className="relative bg-gradient-to-r from-brand-green-dark to-brand-green-mid rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-12 -mb-12"></div>
                
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-4 border border-white/10">
                        <SparklesIcon className="h-3 w-3" />
                        <span>Painel do Consultor</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight">
                        Bem-vindo(a) de volta, <br/>{consultant?.name?.split(' ')[0]}!
                    </h2>
                    <p className="text-brand-green-light/90 text-lg mb-8 leading-relaxed">
                        Sua jornada de sucesso continua. Você tem 3 novos pedidos pendentes de envio e 2 novos materiais de treinamento disponíveis.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-white text-brand-green-dark px-6 py-3 rounded-xl font-bold hover:bg-brand-green-light transition-colors shadow-lg flex items-center gap-2">
                            <ShoppingCartIcon className="h-5 w-5" />
                            Novo Pedido
                        </button>
                        <button className="bg-brand-green-dark/30 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-medium hover:bg-brand-green-dark/50 transition-colors flex items-center gap-2">
                            <ShareIcon className="h-5 w-5" />
                            Compartilhar Loja
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Vendas Mês', value: 'R$ 2.450,00', icon: BanknotesIcon, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Lucro Estimado', value: 'R$ 890,00', icon: TrendingUpIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pedidos Ativos', value: '3', icon: PackageIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Clientes', value: '12', icon: UsersIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders & UniBrotos Teaser */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders List */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-serif font-bold text-gray-900">Pedidos Recentes</h3>
                        <Link to="/consultor/meus-pedidos" className="text-sm text-brand-green-mid font-medium hover:text-brand-green-dark">Ver todos</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {[1, 2, 3].map((orderId) => (
                            <div key={orderId} className="p-4 md:p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                        <PackageIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Pedido #{202400 + orderId}</p>
                                        <p className="text-xs text-gray-500">12/03/2024 • 3 itens</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-brand-green-dark">R$ 450,00</p>
                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full mt-1">
                                        Entregue
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* UniBrotos Card */}
                <div className="bg-brand-dark-card text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-green-dark/50 group-hover:bg-brand-green-dark/40 transition-colors"></div>
                    <img src="https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" alt="Training" />
                    
                    <div className="relative z-10">
                        <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-white/20">
                            <AcademicCapIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold font-serif mb-2">UniBrotos</h3>
                        <p className="text-gray-300 text-sm mb-6">Aprenda novas técnicas de venda e aprofunde seu conhecimento sobre os produtos.</p>
                    </div>
                    
                    <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                        <p className="text-xs font-medium text-brand-green-mid mb-2 uppercase tracking-wider">Em progresso</p>
                        <p className="font-bold text-sm mb-2">Módulo 2: Abordagem Eficiente</p>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-brand-green-mid w-2/3 h-full rounded-full"></div>
                        </div>
                        <button className="w-full mt-4 py-2 bg-white text-brand-dark-bg text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
                            Continuar Estudando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Placeholder for missing icon in admin view
const OrganizationChartIconPlaceholder = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
);

export const AdminOverviewView = () => {
    // State for real metrics
    const [stats, setStats] = useState({
        newConsultants: 0,
        activeConsultants: 0,
        inactiveConsultants: 0,
        leadersWithReferrals: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Total Active
                const { count: active } = await supabase
                    .from('consultants')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'Ativo'); 

                // 2. Total Inactive
                const { count: inactive } = await supabase
                    .from('consultants')
                    .select('*', { count: 'exact', head: true })
                    .neq('status', 'Ativo');

                // 3. New Last 30 Days
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const { count: newUsers } = await supabase
                    .from('consultants')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', thirtyDaysAgo.toISOString());

                // 4. Leaders (Simulated for now based on role 'leader')
                const { count: leaders } = await supabase
                    .from('consultants')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'leader');

                setStats({
                    newConsultants: newUsers || 0,
                    activeConsultants: active || 0,
                    inactiveConsultants: inactive || 0,
                    leadersWithReferrals: leaders || 0
                });

            } catch (e) {
                console.error("Error fetching admin stats", e);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">Visão Geral Master</h2>
                    <p className="text-gray-500">Métricas globais e desempenho da rede.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                        Exportar Relatório
                    </button>
                </div>
            </div>

            {/* Standard KPI Grid (Existing) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Produtividade Alta', value: '85%', sub: '+2.4% vs mês anterior', icon: TrendingUpIcon, color: 'text-green-600', bg: 'bg-green-50' },
                    { title: 'Últimos 30 dias', value: 'R$ 145.2k', sub: 'Volume de Vendas', icon: CalendarIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: 'Inativos', value: `${stats.inactiveConsultants}`, sub: 'Risco de Churn', icon: UsersIcon, color: 'text-red-600', bg: 'bg-red-50' },
                    { title: 'Total Indicações', value: '1.240', sub: 'Rede em crescimento', icon: UserPlusIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</h3>
                            </div>
                            <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                                <kpi.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <p className={`text-xs ${kpi.color.replace('text-', 'text-opacity-80 ')} font-medium`}>{kpi.sub}</p>
                    </div>
                ))}
            </div>

            {/* NEW KPI Grid (5 New Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                    { title: 'Novos Consultores', subtitle: 'últimos 30 dias', value: stats.newConsultants.toString(), icon: UserPlusIcon },
                    { title: 'Consultores Ativos', subtitle: 'Total', value: stats.activeConsultants.toString(), icon: CheckCircleIcon },
                    { title: 'Consultores Inativos', subtitle: 'Total', value: stats.inactiveConsultants.toString(), icon: UsersIcon },
                    { title: 'Consultores com Indicações', subtitle: 'Líderes', value: stats.leadersWithReferrals.toString(), icon: HandshakeIcon },
                    { title: 'Árvore de Indicações', subtitle: 'Visualizar', value: 'Ver Rede', icon: OrganizationChartIconPlaceholder },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{card.subtitle}</p>
                            </div>
                            <div className="p-2 bg-gray-50 text-brand-green-dark rounded-lg">
                                <card.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-4">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* NEW SECTION: Table and Ranking */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <NewConsultantsTable />
                </div>
                <div className="lg:col-span-1">
                    <SideRanking />
                </div>
            </div>
        </div>
    );
};

// --- Other Views (Placeholders/Implementations) ---

export const MaterialsView = () => (
    <div className="animate-slide-up">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Materiais de Apoio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                        <PhotoIcon className="h-10 w-10 text-gray-300" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm">Visualizar</button>
                        </div>
                    </div>
                    <h3 className="font-bold text-gray-900">Catálogo Digital 2024 - Ciclo {i}</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-4">PDF • 12.5 MB • Atualizado há 2 dias</p>
                    <button className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-brand-green-light hover:text-brand-green-dark hover:border-brand-green-mid transition-colors">
                        <DownloadIcon className="h-4 w-4" />
                        Baixar Material
                    </button>
                </div>
            ))}
        </div>
    </div>
);

export const UniBrotosView = () => (
    <div className="animate-slide-up">
        <div className="bg-brand-dark-card rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
             <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-serif font-bold mb-4">UniBrotos Academy</h2>
                <p className="text-gray-300 text-lg mb-6">Capacitação exclusiva para consultores. Aumente suas vendas com conhecimento técnico e estratégias de mercado.</p>
                <div className="flex gap-4">
                    <button className="bg-brand-green-mid hover:bg-brand-green-mid/90 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                        Continuar de onde parei
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold transition-colors backdrop-blur-sm">
                        Ver Certificados
                    </button>
                </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/50 to-transparent hidden lg:block"></div>
        </div>
        
        <h3 className="font-bold text-xl text-gray-900 mb-4">Trilhas de Conhecimento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Iniciante: Primeiros Passos', 'Técnicas de Vendas Avançadas', 'Produtos: Aprofundamento'].map((track, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-brand-green-mid transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-brand-green-light text-brand-green-dark rounded-lg group-hover:bg-brand-green-mid group-hover:text-white transition-colors">
                            <AcademicCapIcon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">4 Módulos</span>
                    </div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">{track}</h4>
                    <p className="text-sm text-gray-500 mb-4">Domine os fundamentos e comece a vender com confiança.</p>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div style={{width: `${(i+1)*25}%`}} className="bg-brand-green-mid h-full rounded-full"></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-400">{(i+1)*25}% concluído</p>
                </div>
            ))}
        </div>
    </div>
);

export const MyOrdersView = () => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const orders: Order[] = [
        { id: '202455', consultant_id: '007', date: '12/03/2024', items: '3x Kits Pomadas', total: 'R$ 675,90', status: 'Entregue' },
        { id: '202456', consultant_id: '007', date: '28/02/2024', items: '1x Display Balcão', total: 'R$ 150,00', status: 'Enviado' },
        { id: '202457', consultant_id: '007', date: '10/01/2024', items: '5x Kits Pomadas', total: 'R$ 1.050,00', status: 'Entregue' },
    ];

    return (
        <div className="animate-slide-up">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Meus Pedidos</h2>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-600 text-sm">Pedido</th>
                            <th className="px-6 py-4 font-bold text-gray-600 text-sm">Data</th>
                            <th className="px-6 py-4 font-bold text-gray-600 text-sm hidden md:table-cell">Itens</th>
                            <th className="px-6 py-4 font-bold text-gray-600 text-sm">Total</th>
                            <th className="px-6 py-4 font-bold text-gray-600 text-sm">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">#{order.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{order.items}</td>
                                <td className="px-6 py-4 font-medium text-brand-green-dark">{order.total}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${
                                        order.status === 'Entregue' ? 'bg-green-50 text-green-700 border-green-100' : 
                                        'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-brand-green-mid hover:text-brand-green-dark font-medium text-sm"
                                    >
                                        Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};

export const NewOrderView = () => (
    <div className="animate-slide-up max-w-4xl mx-auto">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Novo Pedido</h2>
        <p className="text-gray-500 mb-8">Selecione os produtos para reabastecer seu estoque.</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-8 items-start">
             <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-4 flex items-center justify-center">
                <img src="https://i.imgur.com/ntlcx07.png" alt="Kit" className="max-h-64 object-contain mix-blend-multiply" />
             </div>
             <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Kit Revenda Premium</h3>
                        <p className="text-gray-500 mt-1">Caixa Master com 12 unidades</p>
                    </div>
                    <div className="bg-brand-green-light px-3 py-1 rounded-lg text-brand-green-dark font-bold text-sm">
                        Mais Vendido
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <span>Frete Grátis para todo Brasil</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <span>Material de apoio incluso</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <span>Lucro de até 100% na revenda</span>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 flex items-end justify-between">
                    <div>
                        <p className="text-sm text-gray-400 line-through">R$ 420,00</p>
                        <p className="text-3xl font-bold text-brand-green-dark">R$ 210,00</p>
                        <p className="text-xs text-gray-500">ou 3x de R$ 70,00 sem juros</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-lg h-12">
                             <button className="px-3 hover:bg-gray-50 h-full text-gray-500">-</button>
                             <span className="px-3 font-bold text-gray-900">1</span>
                             <button className="px-3 hover:bg-gray-50 h-full text-gray-500">+</button>
                        </div>
                        <button className="bg-brand-green-mid hover:bg-brand-green-dark text-white px-8 h-12 rounded-xl font-bold transition-colors shadow-lg shadow-brand-green-mid/30">
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
             </div>
        </div>
    </div>
);

export const InviteView = () => (
    <div className="animate-slide-up max-w-2xl mx-auto text-center pt-8">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-green-light via-brand-green-mid to-brand-green-dark"></div>
            
            <div className="bg-brand-green-light w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlusIcon className="h-10 w-10 text-brand-green-dark" />
            </div>

            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Expanda sua Rede</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Convide novos consultores e ganhe comissões sobre as vendas da sua equipe. Construa seu legado na Brotos da Terra.
            </p>

            <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 border border-gray-200 mb-8">
                <div className="flex-1 text-left">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Seu Link de Convite</p>
                    <p className="text-gray-800 font-medium truncate font-mono text-sm">brotosdaterra.com.br/convite/ana-silva-2024</p>
                </div>
                <button className="bg-white border border-gray-200 p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
                    <ClipboardCopyIcon className="h-5 w-5" />
                </button>
            </div>

            <div className="flex flex-col gap-3">
                <button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg">
                    <WhatsAppIcon className="h-6 w-6" />
                    Enviar por WhatsApp
                </button>
                <button className="w-full bg-brand-green-dark hover:bg-gray-900 text-white py-4 rounded-xl font-bold transition-colors">
                    Copiar Convite Personalizado
                </button>
            </div>
        </div>
    </div>
);

// --- Admin/Leader Specific Views ---

export const BusinessView = () => {
    // Shows team structure
    const team = DB_LOCAL_STATE.team;

    return (
        <div className="animate-slide-up">
            <div className="flex justify-between items-end mb-8">
                 <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">Minha Rede</h2>
                    <p className="text-gray-500">Gestão de equipe e desempenho.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Consultor</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Vendas (Mês)</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cidade</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {team.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-brand-green-light text-brand-green-dark flex items-center justify-center font-bold text-sm">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{member.name}</p>
                                            <p className="text-xs text-gray-500">{member.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        member.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-gray-700">{member.sales}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{member.city} - {member.state}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-brand-green-mid">
                                        <ChatIcon className="h-5 w-5" />
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

export const FinancialView = () => (
    <div className="animate-slide-up max-w-4xl mx-auto">
        <div className="bg-brand-dark-card text-white rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Saldo Disponível para Saque</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white">{formatCurrency(3450.00)}</h2>
                </div>
                <button className="bg-brand-green-mid hover:bg-brand-green-mid/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-green-mid/20 w-full md:w-auto">
                    Solicitar Saque
                </button>
            </div>
        </div>

        <h3 className="font-serif font-bold text-gray-900 mb-4 text-xl">Histórico de Transações</h3>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 border-b border-gray-50 last:border-0 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${i % 2 === 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            {i % 2 === 0 ? <TrendingUpIcon className="h-5 w-5" /> : <BanknotesIcon className="h-5 w-5" />}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{i % 2 === 0 ? 'Comissão de Venda Direta' : 'Bônus de Liderança'}</p>
                            <p className="text-xs text-gray-500">12 de Março, 14:30</p>
                        </div>
                    </div>
                    <p className={`font-bold ${i % 2 === 0 ? 'text-green-600' : 'text-blue-600'}`}>+ R$ {i * 150},00</p>
                </div>
            ))}
        </div>
    </div>
);

// --- Admin Sub-Views ---

export const AdminPanelView = () => (
    <div className="animate-slide-up">
        <h2 className="text-2xl font-serif font-bold mb-6">Gerenciamento de Usuários</h2>
        <BusinessView />
    </div>
);

export const AdminGoalsView = () => (
    <div className="animate-slide-up">
        <h2 className="text-2xl font-serif font-bold mb-6">Metas e Desempenho</h2>
        <div className="bg-white p-12 rounded-xl text-center border border-gray-100">
            <TargetIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Configuração de Metas</h3>
            <p className="text-gray-500">Defina metas mensais para cada nível de consultor.</p>
        </div>
    </div>
);

export const AdminWithdrawalsView = () => (
    <div className="animate-slide-up">
        <h2 className="text-2xl font-serif font-bold mb-6">Solicitações de Saque</h2>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-center py-8">Nenhuma solicitação pendente.</p>
        </div>
    </div>
);

export const AdminReportsView = () => (
    <div className="animate-slide-up">
        <h2 className="text-2xl font-serif font-bold mb-6">Relatórios Detalhados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64 flex items-center justify-center">
                <p className="text-gray-400 font-medium">Gráfico de Vendas</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64 flex items-center justify-center">
                <p className="text-gray-400 font-medium">Mapa de Calor (Geolocalização)</p>
            </div>
        </div>
    </div>
);

export const AdminSupportView = () => (
    <div className="animate-slide-up">
         <h2 className="text-2xl font-serif font-bold mb-6">Central de Suporte</h2>
         <p className="text-gray-500">Gerenciamento de tickets e atendimento.</p>
    </div>
);

export const AdminSettingsView = () => (
    <div className="animate-slide-up">
         <h2 className="text-2xl font-serif font-bold mb-6">Configurações do Sistema</h2>
         <p className="text-gray-500">Parâmetros globais, permissões e integrações.</p>
    </div>
);

// --- Auth Components (Simplified) ---

export const ConsultantRegister = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
            <div className="text-center mb-8">
                <BrandLogo className="h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-serif font-bold">Junte-se a Nós</h2>
                <p className="text-gray-500 text-sm mt-2">Crie sua conta de consultor</p>
            </div>
            <form className="space-y-4">
                <input type="text" placeholder="Nome Completo" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-green-mid" />
                <input type="email" placeholder="E-mail" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-green-mid" />
                <input type="password" placeholder="Senha" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-green-mid" />
                <button className="w-full bg-brand-green-mid text-white py-3 rounded-lg font-bold hover:bg-brand-green-dark transition-colors">
                    Cadastrar
                </button>
            </form>
            <p className="text-center mt-6 text-sm text-gray-500">
                Já tem conta? <Link to="/login" className="text-brand-green-mid font-bold">Entrar</Link>
            </p>
        </div>
    </div>
);

export const LoginScreen = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Clear any simulated or stale sessions on load
        localStorage.removeItem('sb-admin-session');
        supabase.auth.signOut();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            // 1. Authenticate with Supabase
            const { data: { session }, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (session) {
                // 2. Fetch User Profile to check Role
                const { data: profile } = await supabase
                    .from('consultants')
                    .select('role')
                    .eq('auth_id', session.user.id)
                    .single();

                if (profile?.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/consultor/dashboard');
                }
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg('Email ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <div className="text-center mb-8">
                    <BrandLogo className="h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-serif font-bold">Portal do Consultor</h2>
                    <p className="text-gray-500 text-sm mt-2">Acesso sua área exclusiva</p>
                </div>
                
                {errorMsg && (
                    <div className="bg-red-50 text-red-500 text-sm text-center p-3 rounded-lg mb-4">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-green-mid" 
                    />
                    <input 
                        type="password" 
                        placeholder="Senha" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-green-mid" 
                    />
                    <button disabled={loading} className="w-full bg-brand-green-mid text-white py-3 rounded-lg font-bold hover:bg-brand-green-dark transition-colors disabled:opacity-70">
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <div className="mt-6 text-center space-y-2">
                    <Link to="/cadastro" className="block text-sm text-brand-green-mid font-bold">Quero ser um consultor</Link>
                    <Link to="/portal-master" className="block text-xs text-gray-400">Acesso Administrativo</Link>
                </div>
            </div>
        </div>
    );
};

export const AdminLoginScreen = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            // 1. Try Real Supabase Auth
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (data.session) {
                // Login successful, let the Guard handle redirection and verification
                navigate('/admin/dashboard');
                return;
            }

            if (error) {
                setErrorMsg('Credenciais inválidas ou acesso não autorizado.');
                console.error('Login error:', error.message);
            }

        } catch (err) {
            setErrorMsg('Erro de conexão. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark-bg flex items-center justify-center p-4">
            <div className="bg-brand-dark-card p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800">
                <div className="text-center mb-8">
                    <div className="h-16 w-16 bg-brand-green-dark rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-green-mid/30">
                        <LockClosedIcon className="h-8 w-8 text-brand-green-mid" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white">Portal Master</h2>
                    <p className="text-gray-400 text-sm mt-2">Acesso restrito à administração</p>
                </div>
                
                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="relative">
                        <UserCircleIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="E-mail de Administrador" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-brand-green-mid focus:ring-1 focus:ring-brand-green-mid" 
                        />
                    </div>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                        <input 
                            type="password" 
                            placeholder="Senha de Acesso" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-brand-green-mid focus:ring-1 focus:ring-brand-green-mid" 
                        />
                    </div>
                    <button disabled={loading} className="w-full bg-brand-green-mid hover:bg-brand-green-mid/90 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-brand-green-mid/20 disabled:opacity-50">
                        {loading ? 'Validando Credenciais...' : 'Acessar Sistema'}
                    </button>
                </form>
                <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                    <Link to="/login" className="text-xs text-gray-500 hover:text-white transition-colors">Voltar para Login Consultor</Link>
                </div>
            </div>
        </div>
    );
};