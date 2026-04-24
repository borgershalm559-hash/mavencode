"use client";

import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { signIn, getProviders } from "next-auth/react";

type ProviderMap = Record<string, { id: string; name: string }>;

export function SocialLogin() {
  const [providers, setProviders] = useState<ProviderMap | null>(null);

  useEffect(() => {
    getProviders().then((p) => setProviders((p as ProviderMap) ?? {}));
  }, []);

  const hasGoogle = providers && "google" in providers;
  const hasGithub = providers && "github" in providers;
  const hasYandex = providers && "yandex" in providers;
  const hasVK = providers && "vk" in providers;

  const oauthCount = [hasGoogle, hasGithub, hasYandex, hasVK].filter(Boolean).length;

  if (providers !== null && oauthCount === 0) return null;

  const gridCols =
    oauthCount >= 4 ? "grid-cols-2" :
    oauthCount === 3 ? "grid-cols-3" :
    oauthCount === 2 ? "grid-cols-2" :
    "grid-cols-1";

  return (
    <>
      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 border-t-2 border-white/[0.07]" />
        <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/25 px-2">
          или
        </span>
        <div className="flex-1 border-t-2 border-white/[0.07]" />
      </div>

      {/* OAuth buttons */}
      <div className={`grid gap-2 ${gridCols}`}>
        {hasGoogle && (
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-2.5 py-3 text-sm font-mono font-medium border-2 border-white/[0.1] bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white/90 transition-colors duration-150"
            style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.2)" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="currentColor" fillOpacity="0.7" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="currentColor" fillOpacity="0.7" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" fillOpacity="0.7" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" fillOpacity="0.7" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
        )}

        {hasGithub && (
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-2.5 py-3 text-sm font-mono font-medium border-2 border-white/[0.1] bg-white/[0.04] text-white/60 hover:bg-[#10B981]/[0.08] hover:border-[#10B981]/50 hover:text-[#10B981] transition-colors duration-150"
            style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.2)" }}
          >
            <Github className="w-4 h-4" />
            GitHub
          </button>
        )}

        {hasYandex && (
          <button
            type="button"
            onClick={() => signIn("yandex", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-2.5 py-3 text-sm font-mono font-medium border-2 border-white/[0.1] bg-white/[0.04] text-white/60 hover:bg-[#10B981]/[0.08] hover:border-[#10B981]/50 hover:text-[#10B981] transition-colors duration-150"
            style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.2)" }}
            aria-label="Войти через Яндекс ID"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm2.69 18.44h-2.05V8.123h-.91c-1.666 0-2.54.82-2.54 2.044 0 1.386.592 2.03 1.81 2.844l1.004.672-2.892 4.756H6.863l2.603-3.87c-1.492-1.065-2.332-2.103-2.332-3.857 0-2.195 1.528-3.692 4.42-3.692h3.135v11.42z" />
            </svg>
            Yandex
          </button>
        )}

        {hasVK && (
          <button
            type="button"
            onClick={() => signIn("vk", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-2.5 py-3 text-sm font-mono font-medium border-2 border-white/[0.1] bg-white/[0.04] text-white/60 hover:bg-[#10B981]/[0.08] hover:border-[#10B981]/50 hover:text-[#10B981] transition-colors duration-150"
            style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.2)" }}
            aria-label="Войти через ВКонтакте"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.136-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.266-.305-1.073-.305-1.647 0-1.793.267-2.54-.518-2.733-.26-.064-.452-.106-1.117-.113-.854-.009-1.578.003-1.987.208-.273.136-.483.44-.355.457.158.022.516.099.706.36.246.338.237 1.095.237 1.095s.141 2.09-.331 2.35c-.324.178-.77-.186-1.722-1.866-.488-.86-.856-1.812-.856-1.812s-.071-.176-.199-.27c-.154-.114-.37-.15-.37-.15l-2.286.016s-.343.009-.469.161c-.112.135-.009.414-.009.414s1.79 4.258 3.817 6.403c1.858 1.966 3.968 1.837 3.968 1.837h.955z" />
            </svg>
            VK
          </button>
        )}
      </div>
    </>
  );
}
