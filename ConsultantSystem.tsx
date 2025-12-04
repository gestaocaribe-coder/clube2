
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
    PresentationChartLineIcon
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

export const MaterialsView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const [materials, setMaterials] = useState<Material[]>([]);

    useEffect(() => {
        const fetchMaterials = async () => {
             const { data } = await supabase.from('materials').select('*').order('created_at', { ascending: false });
             if (data) setMaterials(data);
        };
        fetchMaterials();
    }, []);

    const isAdmin = consultant.role === 'admin';

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-800">Materiais de Marketing</h2>
                    <p className="text-gray-500">Baixe conteúdos profissionais para suas redes sociais.</p>
                </div>
                {isAdmin && (
                    <button className="px-4 py-2 bg-brand-green-dark text-white rounded-lg shadow hover:bg-opacity-90 transition text-sm font-bold flex items-center gap-2">
                        <PlusIcon className="h-4 w-4" /> Novo Material
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((item) => (
                    <div key={item.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                            {item.type === 'image' ? (
                                <img src={item.url || 'https://via.placeholder.com/400'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-brand-green-light">
                                    <ClipboardCopyIcon className="h-16 w-16 text-brand-green-mid opacity-50" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600 shadow-sm">
                                {item.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{item.title}</h3>
                            <div className="flex gap-3 mt-4">
                                <button className="flex-1 py-2 rounded-lg bg-gray-50 text-gray-600 text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                                    <EyeIcon className="h-4 w-4" /> Visualizar
                                </button>
                                <button className="flex-1 py-2 rounded-lg bg-brand-green-mid text-white text-sm font-bold hover:bg-brand-green-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-100">
                                    <DownloadIcon className="h-4 w-4" /> Baixar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const UniBrotosView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const [lessons, setLessons] = useState<Lesson[]>([]);

    useEffect(() => {
        const fetchLessons = async () => {
             const { data } = await supabase.from('lessons').select('*').order('created_at', { ascending: false });
             if (data) setLessons(data);
        };
        fetchLessons();
    }, []);

    const isAdmin = consultant.role === 'admin';

    return (
         <div className="space-y-8 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-brand-dark-bg text-white p-8 rounded-[2rem] relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <AcademicCapIcon className="h-8 w-8 text-brand-green-mid" />
                        <h2 className="text-3xl font-serif font-bold">UniBrotos</h2>
                    </div>
                    <p className="text-gray-300 max-w-lg">Sua universidade corporativa. Aprenda sobre produtos, técnicas de venda e liderança.</p>
                </div>
                {isAdmin && (
                    <button className="relative z-10 px-4 py-2 bg-brand-green-mid text-white rounded-lg shadow hover:bg-brand-green-dark transition text-sm font-bold flex items-center gap-2">
                        <PlusIcon className="h-4 w-4" /> Adicionar Aula
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                    <div key={lesson.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                        <div className={`h-48 ${lesson.thumbnail || 'bg-gray-200'} relative flex items-center justify-center`}>
                            <PlayCircleIcon className="text-white/80 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg h-16 w-16" />
                            <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
                                {lesson.duration}
                            </span>
                        </div>
                        <div className="p-5">
                            <span className="text-xs font-bold text-brand-green-mid uppercase tracking-wider">{lesson.category}</span>
                            <h3 className="font-bold text-gray-800 text-lg mt-1 mb-2 group-hover:text-brand-green-dark transition-colors">{lesson.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
         </div>
    );
};

export const MyOrdersView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-serif font-bold text-gray-800">Meus Pedidos</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-sm font-bold text-gray-500">ID</th>
                                <th className="p-4 text-sm font-bold text-gray-500">Data</th>
                                <th className="p-4 text-sm font-bold text-gray-500">Total</th>
                                <th className="p-4 text-sm font-bold text-gray-500">Status</th>
                                <th className="p-4 text-sm font-bold text-gray-500">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        Nenhum pedido encontrado.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">#{order.id}</td>
                                        <td className="p-4 text-gray-600">{order.date}</td>
                                        <td className="p-4 font-bold text-gray-800">{order.total}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                order.status === 'Entregue' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Em trânsito' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-brand-green-mid hover:text-brand-green-dark font-bold text-sm"
                                            >
                                                Ver Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
        </div>
    );
};

export const NewOrderView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const [quantity, setQuantity] = useState(1);
    const [zipCode, setZipCode] = useState('');
    const [shippingCost, setShippingCost] = useState<number | null>(null);
    const [loadingShipping, setLoadingShipping] = useState(false);

    const pricePerUnit = 210.00;
    const subtotal = quantity * pricePerUnit;

    const handleCalculateShipping = () => {
        if (zipCode.length < 8) return;
        setLoadingShipping(true);
        setTimeout(() => {
            if (subtotal >= 400) {
                setShippingCost(0);
            } else {
                setShippingCost(45.90);
            }
            setLoadingShipping(false);
        }, 1000);
    };

    const handleFinalizeOrder = async () => {
        const orderId = `PED-${Math.floor(Math.random() * 10000)}`;
        const totalValue = formatCurrency(subtotal + (shippingCost || 0));
        
        // Abrir WhatsApp imediatamente (Fire and Forget)
        const message = `Olá! Sou o consultor ${consultant.name} (ID: ${consultant.id}). Gostaria de finalizar o pedido *${orderId}*.\n\nItens: ${quantity}x Display Canela de Velho\nTotal: ${totalValue}`;
        const whatsappUrl = `https://wa.me/557199190515?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Tentar salvar no banco em segundo plano
        try {
            await supabase.from('orders').insert({
                id: orderId,
                consultant_id: consultant.id,
                date: new Date().toLocaleDateString('pt-BR'),
                items: `${quantity}x Display Canela de Velho`,
                total: totalValue,
                status: 'Pendente'
            });
        } catch (err) {
            console.error("Background save failed", err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
             <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-green-dark mb-2">Novo Pedido</h2>
                <p className="text-gray-500">Abasteça seu estoque e garanta 100% de lucro.</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8">
                    {/* Product Card */}
                    <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
                        <div className="w-32 h-32 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <img src="https://i.imgur.com/yNKoBxr.png" alt="Produto" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-gray-800">Display Pomada Canela de Velho</h3>
                            <p className="text-gray-500 mb-2">Contém 12 unidades de 100g</p>
                            <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-100">
                                Preço de Custo: R$ 17,50 /un
                            </div>
                        </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                        <label className="block text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide text-center">Quantidade de Displays</label>
                        <div className="flex items-center justify-center gap-6">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition shadow-sm">
                                <MinusIcon className="h-5 w-5 text-gray-600" />
                            </button>
                            <span className="text-4xl font-bold text-brand-green-dark w-16 text-center">{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} className="h-12 w-12 rounded-full bg-brand-green-dark text-white flex items-center justify-center hover:bg-opacity-90 transition shadow-lg shadow-green-200">
                                <PlusIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-center text-gray-400 mt-4 text-sm">Total de {quantity * 12} pomadas</p>
                    </div>

                    {/* Shipping Calc */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Calcular Frete</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="CEP (00000-000)" 
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green-mid"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                            />
                            <button 
                                onClick={handleCalculateShipping}
                                className="bg-gray-800 text-white px-6 rounded-xl font-bold hover:bg-gray-900 transition"
                                disabled={loadingShipping}
                            >
                                {loadingShipping ? '...' : 'Calcular'}
                            </button>
                        </div>
                        {shippingCost !== null && (
                            <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${shippingCost === 0 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-700 border border-gray-100'}`}>
                                <TruckIcon className="h-5 w-5" />
                                <div className="flex-1 font-medium">
                                    {shippingCost === 0 ? 'Frete Grátis' : 'Envio via Transportadora'}
                                </div>
                                <div className="font-bold">
                                    {shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost)}
                                </div>
                            </div>
                        )}
                         <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 bg-green-50 text-green-700 border border-green-100 ${subtotal >= 400 ? 'opacity-100' : 'opacity-50'}`}>
                            <CheckCircleIcon className="h-5 w-5" />
                            <div className="text-sm">
                                <strong>Frete Grátis</strong> para compras acima de R$ 400,00.
                            </div>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="border-t border-gray-100 pt-6 space-y-3 mb-8">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Frete</span>
                            <span>{shippingCost === null ? '--' : (shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost))}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-brand-green-dark pt-2">
                            <span>Total</span>
                            <span>{formatCurrency(subtotal + (shippingCost || 0))}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleFinalizeOrder}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-200 transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        <WhatsAppIcon className="h-6 w-6" />
                        FINALIZAR VIA WHATSAPP
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Você será redirecionado para o WhatsApp do suporte para confirmar pagamento e envio.
                    </p>
                </div>
            </div>
        </div>
    );
};

export const InviteView = () => {
    const { consultant } = useOutletContext<DashboardContextType>();
    const inviteLink = `https://clubebrotos.com/cadastro?indicante=${consultant.id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        alert("Link copiado!");
    };

    return (
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in pt-12">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                 <UsersIcon className="h-12 w-12 text-brand-green-dark" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-brand-green-dark">Cresça sua Equipe</h2>
            <p className="text-gray-500 text-lg">Convide novos consultores e ganhe comissões sobre as vendas da sua rede.</p>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4">
                <div className="flex-1 bg-gray-50 p-4 rounded-xl text-gray-600 font-mono text-sm truncate border border-gray-200">
                    {inviteLink}
                </div>
                <button 
                    onClick={handleCopy}
                    className="bg-brand-green-mid hover:bg-brand-green-dark text-white px-6 py-4 rounded-xl font-bold transition shadow-lg shadow-green-100 flex items-center gap-2"
                >
                    <ClipboardCopyIcon className="h-5 w-5" />
                    Copiar
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-50">
                    <div className="font-bold text-brand-green-dark text-xl mb-2">1º Nível</div>
                    <p className="text-sm text-gray-500">Ganhe 10% sobre a primeira compra de quem você indicar.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-50">
                    <div className="font-bold text-brand-green-dark text-xl mb-2">Liderança</div>
                    <p className="text-sm text-gray-500">Bônus de produtividade ao atingir meta de R$ 5k/mês em equipe.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-50">
                    <div className="font-bold text-brand-green-dark text-xl mb-2">Prêmios</div>
                    <p className="text-sm text-gray-500">Viagens e reconhecimentos para os Top Líderes.</p>
                </div>
            </div>
        </div>
    );
};

export const BusinessView = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-serif font-bold text-gray-800">Minha Equipe</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-bold text-gray-500">Nome</th>
                            <th className="p-4 text-sm font-bold text-gray-500">Cargo</th>
                            <th className="p-4 text-sm font-bold text-gray-500">Status</th>
                            <th className="p-4 text-sm font-bold text-gray-500">Vendas (Mês)</th>
                            <th className="p-4 text-sm font-bold text-gray-500">Contato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_DATA.team.map((member) => (
                            <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="p-4 font-medium text-gray-900">{member.name}</td>
                                <td className="p-4 text-gray-600">{member.role}</td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        member.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="p-4 font-bold text-gray-700">{member.sales}</td>
                                <td className="p-4">
                                    <button className="text-green-600 hover:text-green-800 text-sm font-bold flex items-center gap-1">
                                        <WhatsAppIcon className="h-4 w-4" /> Whatsapp
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
    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-brand-dark-bg text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest mb-2">Saldo Disponível</p>
                        <h2 className="text-5xl font-serif font-bold text-brand-green-mid">
                            {formatCurrency(MOCK_DATA.financial.balance)}
                        </h2>
                    </div>
                    <button className="px-8 py-4 bg-white text-brand-dark-bg rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all flex items-center gap-2">
                        <BanknotesIcon className="h-6 w-6" />
                        Solicitar Saque
                    </button>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Histórico de Transações</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                                    <TrendingUpIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">Comissão de Rede</p>
                                    <p className="text-xs text-gray-500">24 Out 2023</p>
                                </div>
                            </div>
                            <span className="font-bold text-green-600">+ R$ 150,00</span>
                        </div>
                         <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                                    <TrendingUpIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">Bônus de Liderança</p>
                                    <p className="text-xs text-gray-500">20 Out 2023</p>
                                </div>
                            </div>
                            <span className="font-bold text-blue-600">+ R$ 500,00</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Dados Bancários</h3>
                    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 mb-4">
                        <p className="text-sm text-gray-500 mb-1">Chave PIX</p>
                        <p className="font-bold text-gray-800">cpf@consultor.com</p>
                    </div>
                    <button className="text-brand-green-dark font-bold text-sm hover:underline">
                        Alterar dados de recebimento
                    </button>
                </div>
             </div>
        </div>
    );
};

export const AdminPanelView = () => {
    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-gradient-to-br from-brand-dark-bg to-brand-dark-card text-white rounded-[2rem] p-8 shadow-xl">
                <h2 className="text-3xl font-serif font-bold mb-6">Painel Administrativo</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
                        <p className="text-gray-300 text-sm font-bold uppercase">Vendas Totais (Clube)</p>
                        <h3 className="text-3xl font-bold mt-2">R$ 45.230,00</h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
                         <p className="text-gray-300 text-sm font-bold uppercase">Total de Consultores</p>
                        <h3 className="text-3xl font-bold mt-2">142</h3>
                    </div>
                     <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
                         <p className="text-gray-300 text-sm font-bold uppercase">Pedidos Pendentes</p>
                        <h3 className="text-3xl font-bold mt-2 text-yellow-400">8</h3>
                    </div>
                </div>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                 <h3 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <button className="p-4 rounded-xl border border-gray-200 hover:border-brand-green-mid hover:bg-green-50 transition flex flex-col items-center gap-2 text-center">
                         <UserPlusIcon className="h-6 w-6 text-brand-green-dark" />
                         <span className="font-bold text-gray-700 text-sm">Aprovar Cadastros</span>
                     </button>
                      <button className="p-4 rounded-xl border border-gray-200 hover:border-brand-green-mid hover:bg-green-50 transition flex flex-col items-center gap-2 text-center">
                         <PackageIcon className="h-6 w-6 text-brand-green-dark" />
                         <span className="font-bold text-gray-700 text-sm">Gerenciar Estoque</span>
                     </button>
                      <button className="p-4 rounded-xl border border-gray-200 hover:border-brand-green-mid hover:bg-green-50 transition flex flex-col items-center gap-2 text-center">
                         <SparklesIcon className="h-6 w-6 text-brand-green-dark" />
                         <span className="font-bold text-gray-700 text-sm">Config. Sistema</span>
                     </button>
                 </div>
             </div>
        </div>
    );
};

// --- LAYOUT COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, to, active, onClick }: { icon: any, label: string, to?: string, active?: boolean, onClick?: () => void }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) onClick();
        if (to) navigate(to);
    };

    return (
        <button 
            onClick={handleClick}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active 
                ? 'bg-brand-green-dark text-white shadow-lg shadow-green-900/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
        >
            <Icon className={`h-6 w-6 transition-colors ${active ? 'text-brand-green-mid' : 'text-gray-500 group-hover:text-white'}`} />
            <span className={`font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-green-mid shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>}
        </button>
    );
};

export const DashboardShell = ({ consultant, children }: { consultant: Consultant, children?: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine Base Path for navigation links
    const basePath = consultant.role === 'admin' ? '/admin' : '/consultor';
    
    // Check active states
    const isActive = (path: string) => location.pathname.includes(path);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-brand-dark-bg/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-brand-dark-bg border-r border-white/5 shadow-2xl transition-transform duration-300 ease-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-brand-green-dark rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl">
                            B
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg leading-tight">Clube Brotos</h1>
                            <p className="text-gray-500 text-xs uppercase tracking-widest">Painel {consultant.role === 'admin' ? 'Admin' : 'Consultor'}</p>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
                        <CloseIcon />
                    </button>
                </div>

                <div className="px-4 py-6 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar">
                    <div className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Principal</div>
                    <SidebarItem 
                        icon={ChartBarIcon} 
                        label="Visão Geral" 
                        to={`${basePath}/dashboard`}
                        active={isActive('/dashboard')} 
                    />
                    <SidebarItem 
                        icon={ShoppingCartIcon} 
                        label="Novo Pedido" 
                        to={`${basePath}/novo-pedido`}
                        active={isActive('/novo-pedido')} 
                    />
                    <SidebarItem 
                        icon={PackageIcon} 
                        label="Meus Pedidos" 
                        to={`${basePath}/meus-pedidos`}
                        active={isActive('/meus-pedidos')} 
                    />

                    <div className="px-4 mt-8 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Crescimento</div>
                    <SidebarItem 
                        icon={PhotoIcon} 
                        label="Marketing" 
                        to={`${basePath}/materiais`}
                        active={isActive('/materiais')} 
                    />
                    <SidebarItem 
                        icon={AcademicCapIcon} 
                        label="UniBrotos" 
                        to={`${basePath}/unibrotos`}
                        active={isActive('/unibrotos')} 
                    />
                     <SidebarItem 
                        icon={UserPlusIcon} 
                        label="Convidar" 
                        to={`${basePath}/convidar`}
                        active={isActive('/convidar')} 
                    />

                    {/* Restricted Sections */}
                    {(consultant.role === 'admin' || consultant.role === 'leader') && (
                        <>
                            <div className="px-4 mt-8 mb-2 text-xs font-bold text-brand-earth uppercase tracking-widest">Gestão</div>
                            <SidebarItem 
                                icon={BriefcaseIcon} 
                                label="Meu Negócio" 
                                to={`${basePath}/meu-negocio`}
                                active={isActive('/meu-negocio')} 
                            />
                            <SidebarItem 
                                icon={BanknotesIcon} 
                                label="Financeiro" 
                                to={`${basePath}/financeiro`}
                                active={isActive('/financeiro')} 
                            />
                        </>
                    )}

                    {consultant.role === 'admin' && (
                         <>
                            <div className="px-4 mt-8 mb-2 text-xs font-bold text-red-400 uppercase tracking-widest">Admin</div>
                            <SidebarItem 
                                icon={LockClosedIcon} 
                                label="Administração" 
                                to={`${basePath}/administracao`}
                                active={isActive('/administracao')} 
                            />
                        </>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 bg-brand-dark-bg border-t border-white/5">
                    <SidebarItem icon={LogoutIcon} label="Sair" onClick={handleLogout} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 transition-all duration-300">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <MenuIcon />
                    </button>

                    <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="font-bold text-gray-800 text-sm">{consultant.name}</span>
                            <span className="text-xs text-gray-500 uppercase">{consultant.role}</span>
                        </div>
                        <div className="h-10 w-10 bg-brand-green-light text-brand-green-dark rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                            {consultant.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

// --- AUTH SCREENS ---

export const LoginScreen = () => {
    const [consultantId, setConsultantId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // --- 1. MAGIC ADMIN LOGIC (Auto-provisioning) ---
            if (consultantId === '000000' && password === 'jo1234') {
                const adminEmail = 'admin@brotos.com';
                
                // Tenta logar diretamente
                const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                    email: adminEmail,
                    password: password
                });

                if (loginData.session) {
                     navigate('/admin/dashboard');
                     return;
                }

                // Se falhar, tenta criar (se for o primeiro acesso)
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: adminEmail,
                    password: password
                });

                if (signUpError) throw new Error('Falha ao criar admin automático.');

                if (signUpData.user) {
                     // Cria perfil de admin
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

            // --- 2. NORMAL CONSULTANT LOGIC (ID Lookup) ---
            
            // Passo A: Buscar o email vinculado ao ID
            const { data: profiles, error: profileLookupError } = await supabase
                .from('consultants')
                .select('email, role')
                .eq('id', consultantId)
                .maybeSingle();

            if (profileLookupError) {
                console.error(profileLookupError);
                throw new Error('Erro ao verificar ID. Tente novamente.');
            }
            
            if (!profiles) {
                throw new Error('ID de consultor não encontrado.');
            }

            // Passo B: Autenticar usando o email encontrado e a senha digitada
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: profiles.email,
                password
            });

            if (authError) throw authError;

            if (data.user) {
                if (profiles.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/consultor/dashboard');
                }
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

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-slide-up">
                <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
                    <BrandLogo className="h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-serif font-bold text-gray-800">Bem-vindo ao Clube</h2>
                    <p className="text-gray-500 text-sm mt-2">Faça login para gerenciar seu negócio.</p>
                </div>
                
                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">ID do Consultor</label>
                        <input 
                            type="text" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green-mid focus:ring-2 focus:ring-brand-green-light outline-none transition-all bg-gray-50 focus:bg-white"
                            placeholder="Ex: 102030"
                            value={consultantId}
                            onChange={(e) => setConsultantId(e.target.value)}
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
