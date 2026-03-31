import React, { useState } from 'react';
import { adminService } from '../../services/adminService';

const ApiDocsPage = () => {
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_ADMIN_API_KEY || '');
    const [docsHtml, setDocsHtml] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const loadDocs = async () => {
        try {
            setLoading(true);
            setError('');
            const html = await adminService.getApiDocsHtml(apiKey);
            setDocsHtml(html);
        } catch (loadError) {
            setError(loadError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-grid single-column-grid">
            <section className="glass-panel page-panel">
                <div className="section-heading">
                    <div>
                        <span className="section-kicker">Protected docs</span>
                        <h2>API reference</h2>
                    </div>
                    <p className="muted-copy">This page fetches `/api-docs` with both the admin JWT and the configured API key.</p>
                </div>

                <div className="inline-form">
                    <input
                        value={apiKey}
                        onChange={(event) => setApiKey(event.target.value)}
                        placeholder="Enter admin x-api-key"
                    />
                    <button type="button" onClick={loadDocs} disabled={loading}>
                        {loading ? 'Loading...' : 'Load docs'}
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {docsHtml ? (
                    <iframe
                        title="API Docs"
                        srcDoc={docsHtml}
                        style={{ width: '100%', minHeight: '720px', border: '1px solid var(--glass-border)', borderRadius: '16px' }}
                    />
                ) : (
                    <div className="page-center-state">Load the protected docs to preview the admin-only API reference.</div>
                )}
            </section>
        </div>
    );
};

export default ApiDocsPage;
