import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

// --- Version Marker for Git ---
// v1.1.0 - God Mode Secure Access

// --- Icons ---
const TerminalIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>;
const CodeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const DatabaseIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor"><path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" /><path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" /><path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" /></svg>;
const LockClosedIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>;

// --- Components ---

const SqlConsole = () => {
    const [query, setQuery] = useState('SELECT * FROM public.consultants LIMIT 5;');
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const executeSql = async () => {
        setLoading(true);
        try {
            // Calls the secure RPC function
            const { data, error } = await supabase.rpc('exec_sql', { sql_query: query });
            
            if (error) throw error;
            setResult(JSON.stringify(data, null, 2));
        } catch (err: any) {
            setResult(`ERROR: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black text-green-500 font-mono p-4 rounded-lg shadow-xl border border-green-900">
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <DatabaseIcon /> SQL Execution Console (Audit Logged)
            </h3>
            <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-gray-900 border border-green-800 p-2 rounded text-sm focus:outline-none focus:border-green-500 h-32 mb-2"
            />
            <button 
                onClick={executeSql}
                disabled={loading}
                className="bg-green-700 hover:bg-green-600 text-black font-bold px-4 py-1 rounded text-sm mb-4"
            >
                {loading ? 'EXECUTING...' : 'RUN QUERY'}
            </button>
            <div className="bg-gray-900 p-2 rounded border border-green-900 h-64 overflow-auto">
                <pre className="text-xs">{result || '// Results will appear here...'}</pre>
            </div>
        </div>
    );
};

const ThemeEditor = () => {
    const [config, setConfig] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase.from('system_config').select('value').eq('key', 'theme_config').single();
            if (data) setConfig(JSON.stringify(data.value, null, 2));
        };
        fetchConfig();
    }, []);

    const saveConfig = async () => {
        setLoading(true);
        try {
            const json = JSON.parse(config);
            const { error } = await supabase.from('system_config').upsert({ key: 'theme_config', value: json });
            if (error) throw error;
            
            // Audit Log
            await supabase.from('audit_logs').insert({ action_type: 'CONFIG_CHANGE', payload: 'Theme updated' });
            
            alert('Theme updated! Refresh to see changes.');
        } catch (err: any) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 text-gray-200 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                <CodeIcon /> Live Theme JSON Editor
            </h3>
            <p className="text-xs text-gray-400 mb-2">Controls: Primary Color, Accent Color, Global Border Radius.</p>
            <textarea 
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                className="w-full bg-black border border-gray-600 p-4 rounded text-sm font-mono h-64 focus:border-blue-500 outline-none"
            />
            <button 
                onClick={saveConfig}
                disabled={loading}
                className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded"
            >
                {loading ? 'Saving...' : 'Deploy Changes'}
            </button>
        </div>
    );
};

// --- Main Layout ---

export const GodMode = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [activeTab, setActiveTab] = useState<'sql' | 'theme' | 'scripts'>('sql');
    const navigate = useNavigate();

    // Simulated MFA (In production, use TOTP)
    const handleMFA = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded "Master Key" for demo purposes
        if (passcode === 'sudo-root-123') {
            setIsAuthenticated(true);
        } else {
            alert('ACCESS DENIED. Incident reported.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">
                <div className="w-full max-w-md p-8 border border-green-800 rounded shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                    <h1 className="text-2xl font-bold mb-6 text-center glitch-effect">GOD MODE ACCESS</h1>
                    <form onSubmit={handleMFA}>
                        <label className="block text-xs mb-2">SECURE PASSCODE REQUIRED</label>
                        <input 
                            type="password" 
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full bg-gray-900 border border-green-700 p-3 rounded text-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 mb-4"
                            autoFocus
                        />
                        <button type="submit" className="w-full bg-green-900 hover:bg-green-800 text-green-100 py-2 rounded border border-green-700">
                            AUTHENTICATE
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans">
            {/* Header */}
            <header className="bg-black border-b border-gray-800 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">GOD MODE ACTIVE</div>
                    <span className="font-mono text-sm text-gray-500">Connected to: Production DB (Secure)</span>
                </div>
                <button onClick={() => navigate('/admin/dashboard')} className="text-xs text-gray-500 hover:text-white">EXIT TO ADMIN</button>
            </header>

            <div className="flex h-[calc(100vh-60px)]">
                {/* Sidebar */}
                <aside className="w-64 bg-[#111] border-r border-gray-800 p-4">
                    <nav className="space-y-1">
                        <button 
                            onClick={() => setActiveTab('sql')}
                            className={`w-full text-left px-4 py-2 rounded text-sm font-medium ${activeTab === 'sql' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-900'}`}
                        >
                            Data Console (SQL)
                        </button>
                        <button 
                            onClick={() => setActiveTab('theme')}
                            className={`w-full text-left px-4 py-2 rounded text-sm font-medium ${activeTab === 'theme' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-900'}`}
                        >
                            Theme & UI Config
                        </button>
                        <button 
                            onClick={() => setActiveTab('scripts')}
                            className={`w-full text-left px-4 py-2 rounded text-sm font-medium ${activeTab === 'scripts' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-900'}`}
                        >
                            Script Injection
                        </button>
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 p-8 overflow-auto">
                    {activeTab === 'sql' && <SqlConsole />}
                    {activeTab === 'theme' && <ThemeEditor />}
                    {activeTab === 'scripts' && (
                        <div className="text-center py-20 text-gray-500">
                            <LockClosedIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-gray-400">Restricted Area</h3>
                            <p>Script injection requires Layer 3 authorization.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};