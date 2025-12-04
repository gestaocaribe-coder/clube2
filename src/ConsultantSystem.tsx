
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

// --- Version Marker for Git ---
// v1.4.0 - Strategic Dashboard Refinement (Ranking & Tools)

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

// FIX: Use PropsWithChildren to make children optional, resolving the error in App.tsx
export const AdminThemeProvider = ({ children }: React.PropsWithChildren<{}>) => {
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
                                    