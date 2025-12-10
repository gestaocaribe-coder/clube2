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
        // Remove Flag de Admin (Dev)
        localStorage.removeItem('sb-admin-session');
        // Standard logout process - removes local supabase session
        await supabase.auth.signOut();
        navigate('/login');
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
                    { title: 'Consultores Inativos', subtitle: 'Total', value: stats.inactiveConsultants.toString(), icon: StopIcon },
                    { title: 'Líderes', subtitle: 'com indicações', value: stats.leadersWithReferrals.toString(), icon: TargetIcon },
                    { title: 'Árvore de Indicações', subtitle: 'Visualizar', value: 'Ver', icon: OrganizationChartIconPlaceholder },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-gray-50 text-brand-green-mid rounded-lg">
                            <card.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">{card.title}</p>
                            <p className="text-xl font-bold text-gray-900">{card.value}</p>
                            <p className="text-[10px] text-gray-400">{card.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tabela de Novos Consultores */}
                <div className="lg:col-span-2 h-full">
                    <NewConsultantsTable />
                </div>
                
                {/* Ranking Lateral */}
                <div className="h-full">
                    <SideRanking />
                </div>
            </div>
        </div>
    );
};

// ... (Rest of the exports remain unchanged, ensuring to keep all previously defined views)

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Limpa qualquer sessão anterior ao carregar a tela de login
    useEffect(() => {
        const clearSession = async () => {
            // Se estiver deslogando, também limpa o bypass
            localStorage.removeItem('sb-admin-session');
            await supabase.auth.signOut();
        };
        clearSession();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.session) {
                // Check Role
                const { data: consultant } = await supabase
                    .from('consultants')
                    .select('role')
                    .eq('auth_id', data.session.user.id)
                    .single();

                if (consultant?.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/consultor/dashboard');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 md:p-12 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green-light rounded-full blur-2xl -mr-10 -mt-10"></div>
                
                <div className="text-center mb-10 relative z-10">
                    <BrandLogo className="h-16 mx-auto mb-6" />
                    <h2 className="text-2xl font-serif font-bold text-gray-800">Portal do Consultor</h2>
                    <p className="text-gray-500 mt-2">Acesso sua área exclusiva</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">E-mail</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green-mid focus:ring-4 focus:ring-brand-green-light transition-all outline-none bg-gray-50 focus:bg-white"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Senha</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green-mid focus:ring-4 focus:ring-brand-green-light transition-all outline-none bg-gray-50 focus:bg-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-brand-green-mid text-white font-bold py-3.5 rounded-xl hover:bg-brand-green-dark hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-8 text-center relative z-10">
                    <a href="#" className="text-sm text-brand-green-mid font-bold hover:underline">Quero ser um consultor</a>
                    <div className="mt-4">
                         <Link to="/portal-master" className="text-xs text-gray-300 hover:text-gray-400">Acesso Administrativo</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminLoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. BYPASS DE DESENVOLVIMENTO (Credencial Mestra)
        if (email === 'admin@master.com' && password === 'admin123') {
            try {
                // Simula um login bem sucedido localmente
                localStorage.setItem('sb-admin-session', 'true');
                // Pequeno delay para UX
                setTimeout(() => {
                    navigate('/admin/dashboard');
                }, 500);
                return;
            } catch (e) {
                console.error("Erro no login bypass", e);
            }
        }

        // 2. Fluxo Normal Supabase
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.session) {
                // Verifica se é realmente admin no banco
                const { data: consultant } = await supabase
                    .from('consultants')
                    .select('role')
                    .eq('auth_id', data.session.user.id)
                    .single();

                if (consultant?.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    setError('Acesso negado: Apenas administradores.');
                    await supabase.auth.signOut();
                }
            }
        } catch (err: any) {
            setError(err.message || 'Credenciais inválidas ou acesso não autorizado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark-bg flex items-center justify-center p-4">
            <div className="bg-brand-dark-card rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-12 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-brand-green-mid"></div>
                
                <div className="text-center mb-10">
                    <div className="h-16 w-16 bg-brand-dark-bg rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                        <LockClosedIcon className="h-8 w-8 text-brand-green-mid" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white">Portal Master</h2>
                    <p className="text-gray-400 mt-2 text-sm">Acesso restrito à administração</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                         <div className="relative">
                            <UserCircleIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                            <input 
                                type="email" 
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-brand-dark-bg border border-white/10 text-white placeholder-gray-600 focus:border-brand-green-mid focus:ring-1 focus:ring-brand-green-mid transition-all outline-none"
                                placeholder="admin@brotos.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="relative">
                            <LockClosedIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                            <input 
                                type="password" 
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-brand-dark-bg border border-white/10 text-white placeholder-gray-600 focus:border-brand-green-mid focus:ring-1 focus:ring-brand-green-mid transition-all outline-none"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-brand-green-mid text-white font-bold py-3.5 rounded-xl hover:bg-brand-green-dark hover:shadow-lg hover:shadow-brand-green-mid/20 transition-all disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Validando...' : 'Acessar Sistema'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                        Voltar para Login Consultor
                    </Link>
                </div>
            </div>
        </div>
    );
};

export const ConsultantRegister = () => <div className="p-8"><h2 className="text-2xl font-bold">Cadastro de Consultor</h2></div>;
export const MaterialsView = () => <div className="p-8"><h2 className="text-2xl font-bold">Materiais</h2></div>;
export const UniBrotosView = () => <div className="p-8"><h2 className="text-2xl font-bold">UniBrotos</h2></div>;
export const MyOrdersView = () => <div className="p-8"><h2 className="text-2xl font-bold">Meus Pedidos</h2></div>;
export const NewOrderView = () => <div className="p-8"><h2 className="text-2xl font-bold">Novo Pedido</h2></div>;
export const InviteView = () => <div className="p-8"><h2 className="text-2xl font-bold">Convidar</h2></div>;
export const BusinessView = () => <div className="p-8"><h2 className="text-2xl font-bold">Meu Negócio</h2></div>;
export const FinancialView = () => <div className="p-8"><h2 className="text-2xl font-bold">Financeiro</h2></div>;
export const AdminPanelView = () => <div className="p-8"><h2 className="text-2xl font-bold">Usuários</h2></div>;
export const AdminReportsView = () => <div className="p-8"><h2 className="text-2xl font-bold">Relatórios</h2></div>;
export const AdminSupportView = () => <div className="p-8"><h2 className="text-2xl font-bold">Suporte</h2></div>;
export const AdminSettingsView = () => <div className="p-8"><h2 className="text-2xl font-bold">Configurações</h2></div>;
export const AdminGoalsView = () => <div className="p-8"><h2 className="text-2xl font-bold">Metas</h2></div>;
export const AdminWithdrawalsView = () => <div className="p-8"><h2 className="text-2xl font-bold">Saques</h2></div>;
export const ChecklistViewExport = ChecklistView;