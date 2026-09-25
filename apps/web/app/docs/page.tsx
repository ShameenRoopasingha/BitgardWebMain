"use client";

import React, { useState } from "react";
import { Copy, Terminal, CheckCircle2, ChevronRight, Book, Key, Link as LinkIcon, Webhook } from "lucide-react";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("intro");

  const sidebarLinks = [
    { id: "intro", label: "Getting Started", icon: Book },
    { id: "auth", label: "Authentication", icon: Key },
    { id: "endpoints", label: "Core Endpoints", icon: LinkIcon },
    { id: "webhooks", label: "Webhooks", icon: Webhook }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      
      {/* Background Holographic Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-24 border-b border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="w-full lg:w-1/2 z-10">
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-md mb-6">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                <span className="text-xs font-semibold tracking-wider text-green-500 uppercase">All Systems Operational</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
                Build with <span className="text-primary">Bitgard.</span>
              </h1>
              <p className="text-xl text-neutral-400 font-subheading mb-8">
                Integrate your custom applications, build internal tools, or extend our platform using our robust GraphQL and REST APIs.
              </p>
              <button className="bg-primary hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(232,115,42,0.4)] flex items-center gap-2">
                Generate API Key <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full lg:w-1/2 relative z-10 perspective-1000">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(232,115,42,0.2)] transform rotate-y-[-10deg] rotate-x-[5deg]">
                {/* Terminal Header */}
                <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <div className="ml-4 flex items-center gap-2 text-neutral-500 text-xs font-mono">
                    <Terminal className="w-3 h-3" /> bash - api-request
                  </div>
                </div>
                {/* Terminal Body */}
                <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                  <div className="text-neutral-300">
                    <span className="text-pink-500">curl</span> -X GET <span className="text-blue-400">"https://api.bitgard.com/v1/inventory"</span> \
                  </div>
                  <div className="text-neutral-300 pl-4">
                    -H <span className="text-blue-400">"Authorization: Bearer bg_live_8f7d6a..."</span> \
                  </div>
                  <div className="text-neutral-300 pl-4 mb-4">
                    -H <span className="text-blue-400">"Content-Type: application/json"</span>
                  </div>
                  
                  <div className="text-neutral-500 mb-2"># Response</div>
                  <div className="text-primary">{`{`}</div>
                  <div className="text-primary pl-4">{`"status": "success",`}</div>
                  <div className="text-primary pl-4">{`"data": {`}</div>
                  <div className="text-primary pl-8">{`"total_items": 14205,`}</div>
                  <div className="text-primary pl-8">{`"locations": 12`}</div>
                  <div className="text-primary pl-4">{`}`}</div>
                  <div className="text-primary">{`}`}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DOCUMENTATION LAYOUT */}
      <section className="relative z-10 border-t border-white/5 bg-[#080808]">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 py-12 md:pr-12 md:border-r border-white/5 md:min-h-screen">
            <nav className="sticky top-32 flex flex-col gap-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 px-4">Navigation</span>
              {sidebarLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${
                    activeTab === link.id 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <link.icon className={`w-4 h-4 ${activeTab === link.id ? "text-primary" : "text-neutral-500"}`} />
                  {link.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 py-12 md:pl-16">
            <div className="prose prose-invert prose-orange max-w-3xl prose-headings:font-heading prose-headings:text-white prose-p:text-neutral-300 prose-a:text-primary prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10 prose-pre:text-neutral-300">
              
              {activeTab === "intro" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-4xl mb-6">Getting Started</h2>
                  <p>Welcome to the Bitgard Developer API. Our API allows you to programmatically manage your retail ecosystem, fleet vehicles, and human resources from a single, unified interface.</p>
                  
                  <h3 className="text-2xl mt-12 mb-4">Base URL</h3>
                  <p>All API requests should be made to the following base URL:</p>
                  <pre className="relative group">
                    <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/10 rounded-md hover:bg-white/20">
                      <Copy className="w-4 h-4 text-white" />
                    </button>
                    <code>https://api.bitgard.com/v1</code>
                  </pre>
                  
                  <h3 className="text-2xl mt-12 mb-4">Rate Limits</h3>
                  <p>To ensure platform stability, we enforce rate limits on all endpoints.</p>
                  <ul>
                    <li><strong>Starter Plan:</strong> 100 requests / minute</li>
                    <li><strong>Professional Plan:</strong> 500 requests / minute</li>
                    <li><strong>Enterprise Plan:</strong> 2,000+ requests / minute (customizable)</li>
                  </ul>
                  <p>If you exceed the rate limit, the API will return a <code>429 Too Many Requests</code> status code.</p>
                </div>
              )}

              {activeTab === "auth" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-4xl mb-6">Authentication</h2>
                  <p>The Bitgard API uses Bearer tokens for authentication. You can generate API keys in your dashboard under <strong>Settings &gt; Developers</strong>.</p>
                  
                  <div className="p-4 mb-6 rounded-xl bg-orange-500/10 border border-orange-500/30">
                    <strong className="text-orange-400 block mb-1">Warning</strong>
                    <span className="text-orange-200/80 text-sm">Never share your secret API keys in publicly accessible areas such GitHub, client-side code, and so forth.</span>
                  </div>

                  <p>Pass your API key in the <code>Authorization</code> header of your HTTP request:</p>
                  <pre className="relative group">
                    <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/10 rounded-md hover:bg-white/20">
                      <Copy className="w-4 h-4 text-white" />
                    </button>
                    <code>Authorization: Bearer bg_live_your_secret_key_here</code>
                  </pre>
                </div>
              )}

              {(activeTab === "endpoints" || activeTab === "webhooks") && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-4xl mb-6">{activeTab === "endpoints" ? "Core Endpoints" : "Webhooks"}</h2>
                  <p>Select an endpoint from the comprehensive reference guide to see payload structures, required parameters, and response schemas.</p>
                  <div className="h-64 mt-8 rounded-2xl border border-dashed border-white/20 flex items-center justify-center bg-white/[0.02]">
                    <span className="text-neutral-500 font-mono">Interactive API Explorer Loading...</span>
                  </div>
                </div>
              )}

            </div>
          </main>

        </div>
      </section>

    </div>
  );
}
