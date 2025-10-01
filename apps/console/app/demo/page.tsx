'use client';
import { useState, useEffect } from 'react';

export default function DemoPage() {
  const [desc, setDesc] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [used, setUsed] = useState(false);
  const [serverPreview, setServerPreview] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | undefined>(undefined);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [llmOnline, setLlmOnline] = useState<boolean | null>(null);
  const [llmLoading, setLlmLoading] = useState<boolean>(false);

  useEffect(() => {
    // check server status for demo attempts
    (async () => {
      try {
        const r = await fetch('/api/demo/status');
        if (!r.ok) return;
        const j = await r.json();
        setUsed(Boolean(j.used));
        if (j.preview) {
          setServerPreview(j.preview);
          setPreviewSrc(j.preview);
        }
      } catch (e) {
        /* ignore */
      }
      // check local LLM
      const checkHealth = async () => {
        try {
          const h = await fetch('/api/llm/health');
          const hj = await h.json().catch(() => ({}));
          setLlmOnline(Boolean(hj.online));
          setLlmLoading(Boolean(hj.loading));
        } catch (e) {
          setLlmOnline(false);
          setLlmLoading(false);
        }
      };
      await checkHealth();
      // poll for up to ~30s to catch first model load
      let elapsed = 0;
      const int = setInterval(async () => {
        elapsed += 2000;
        await checkHealth();
        if (llmOnline) {
          clearInterval(int);
        }
        if (elapsed >= 30000) clearInterval(int);
      }, 2000);
      return () => clearInterval(int);
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/demo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout: { title: desc } }),
      });
      const j = await res.json();
      if (!j.ok) setError(j.error || 'Error');
      else {
        setPreview(j.preview);
        setPreviewSrc(j.preview);
        setIframeLoading(true);
      }
    } catch (e: any) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Demo generator</h1>
      <div style={{ marginTop: 6, fontSize: 12 }}>
        {llmOnline === null ? (
          <span className="muted">Checking local AI…</span>
        ) : llmOnline ? (
          <span style={{ color: '#059669' }}>Local AI: Online</span>
        ) : (
          <span style={{ color: '#b91c1c' }}>
            Local AI: {llmLoading ? 'Loading model…' : 'Offline (falling back)'}{' '}
          </span>
        )}
      </div>
      <p className="muted">Create a single demo preview (watermarked).</p>
      <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe your business..."
          className="w-full p-2 border"
        />
        <div style={{ marginTop: 8 }}>
          <button className="btn" type="submit" disabled={loading || Boolean(preview) || used}>
            {loading
              ? 'Generating…'
              : preview
              ? 'Preview generated'
              : used
              ? 'Demo used'
              : 'Generate Demo'}
          </button>
        </div>
      </form>
      {llmOnline === false && (
        <p className="muted" style={{ marginTop: 8 }}>
          {llmLoading
            ? 'Model is loading, this can take a bit the first time…'
            : 'Local AI offline. The system will try fallbacks automatically.'}{' '}
          To start the local AI, see README under apps/console (run the gpt4all server).
        </p>
      )}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {previewSrc && (
        <div style={{ marginTop: 12 }}>
          {serverPreview && (
            <p className="muted">
              A demo was already generated: <a href={serverPreview}>{serverPreview}</a>
            </p>
          )}
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <a href={previewSrc || '#'} target="_blank" rel="noreferrer" className="btn">
              Open preview
            </a>
            <button
              className="btn"
              onClick={() => {
                const base = preview || serverPreview || previewSrc;
                if (!base) return;
                const url = base + (base.includes('?') ? '&' : '?') + 't=' + Date.now();
                setPreviewSrc(url);
                setIframeLoading(true);
              }}
              style={{ background: '#10b981' /* green */ }}
            >
              Refresh
            </button>
            <button
              className="btn"
              onClick={() => {
                setPreview(null);
                setDesc('');
                setPreviewSrc(undefined);
              }}
              style={{ background: '#ef4444' /* red */ }}
            >
              Clear
            </button>
          </div>
          <div
            style={{
              border: '1px solid #e6e6e6',
              borderRadius: 8,
              overflow: 'hidden',
              height: 520,
              position: 'relative',
            }}
          >
            {iframeLoading && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.8)',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    padding: 12,
                    borderRadius: 6,
                    background: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }}
                >
                  Loading preview…
                </div>
              </div>
            )}
            <iframe
              src={previewSrc}
              title="demo-preview"
              style={{ width: '100%', height: '100%', border: 0 }}
              onLoad={() => setIframeLoading(false)}
              onError={() => setIframeLoading(false)}
            />
          </div>
        </div>
      )}

      {used && (
        <div style={{ marginTop: 12 }}>
          <p className="muted">You already used the demo from this IP.</p>
          {process.env.NODE_ENV !== 'production' && (
            <div>
              <button
                className="btn"
                onClick={async () => {
                  await fetch('/api/debug/clear-attempts', { method: 'POST' });
                  const s = await fetch('/api/demo/status');
                  const j = await s.json();
                  setUsed(Boolean(j.used));
                  setServerPreview(j.preview || null);
                  setPreviewSrc(j.preview || undefined);
                }}
              >
                Reset demo (dev)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
