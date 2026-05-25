import { useEffect } from "react";
import type { Lang } from "@/config/i18n";
import { useLang } from "@/contexts/LangContext";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
  jsonLd?: JsonLd;
  image?: string;
  lang?: Lang;
};

const SITE_ORIGIN = "https://fmcsahelper.com";
const SPANISH_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Driver Compliance Hub | Orientacion practica de la FMCSA para pequenas flotas",
    description: "Orientacion practica gratuita de la FMCSA para operadores propietarios y pequenas flotas, con revisiones anuales, actualizaciones medicas y listas imprimibles.",
  },
  "/about": {
    title: "Acerca de Driver Compliance Hub | Orientacion practica de la FMCSA",
    description: "Driver Compliance Hub ayuda a operadores propietarios y pequenas flotas a encontrar orientacion practica de cumplimiento basada en fuentes oficiales.",
  },
  "/contact": {
    title: "Contacto | Driver Compliance Hub y orientacion de la FMCSA",
    description: "Contacte a Driver Compliance Hub sobre la orientacion gratuita de cumplimiento y las listas imprimibles.",
  },
  "/privacy": {
    title: "Politica de Privacidad | Driver Compliance Hub",
    description: "Politica de privacidad de Driver Compliance Hub y su herramienta de listas imprimibles en el navegador.",
  },
  "/verify-examiner": {
    title: "Verifique a su Examinador Medico DOT | Driver Compliance Hub",
    description: "Como verificar que su examinador medico DOT figure en el Registro Nacional de la FMCSA y conocer la exencion temporal vigente para certificados en papel.",
  },
  "/checklist/medical-certificate": {
    title: "Certificado del Examinador Medico | Driver Compliance Hub",
    description: "Orientacion de la FMCSA sobre certificados medicos, verificacion del examinador y la exencion vigente para certificados en papel durante la transicion NRII.",
  },
  "/checklist/employment-application": {
    title: "Solicitud de Empleo del Conductor | 49 CFR 391.21 | Driver Compliance Hub",
    description: "Requisitos de la FMCSA para la solicitud de empleo del conductor: historial de CMV, historial laboral general, accidentes, infracciones y domicilios bajo 49 CFR 391.21.",
  },
  "/checklist/initial-mvr": {
    title: "Registro Inicial de Vehiculos Motorizados (MVR) | 49 CFR 391.23 | Driver Compliance Hub",
    description: "Guia de la FMCSA para solicitar y revisar el registro inicial de vehiculos motorizados de conductores regulados por el DOT bajo 49 CFR 391.23.",
  },
  "/checklist/road-test": {
    title: "Examen de Manejo y Certificacion | 49 CFR 391.31 | Driver Compliance Hub",
    description: "Requisitos de la FMCSA bajo 49 CFR 391.31 para certificados de examen de manejo, equivalencias de CDL y conservacion en el expediente.",
  },
  "/checklist/safety-performance-history": {
    title: "Historial de Desempeno de Seguridad | 49 CFR 391.23 | Driver Compliance Hub",
    description: "Requisitos de investigacion para empleadores regulados por DOT bajo 49 CFR 391.23: proceso, retencion y derechos del conductor.",
  },
};

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => {
      if (key !== "content") el!.setAttribute(key, value);
    });
    document.head.appendChild(el);
  }
  el.setAttribute("content", attrs.content);
  return el;
};

const upsertLink = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    Object.entries(attrs).forEach(([key, value]) => el!.setAttribute(key, value));
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el!.setAttribute(key, value));
  return el;
};

const translatedPath = (path: string, lang: Lang): string => {
  const englishPath = path === "/es" ? "/" : path.replace(/^\/es(?=\/|$)/, "") || "/";
  return lang === "es" ? (englishPath === "/" ? "/es/" : `/es${englishPath}`) : englishPath;
};

export const SEO = ({ title, description, path, noindex, jsonLd, image, lang = "en" }: SEOProps) => {
  const { lang: contextLang } = useLang();
  const resolvedLang = lang === "es" || contextLang === "es" ? "es" : "en";

  useEffect(() => {
    const routePath = path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    const basePath = translatedPath(routePath, "en");
    const pathname = translatedPath(routePath, resolvedLang);
    const englishUrl = `${SITE_ORIGIN}${translatedPath(routePath, "en")}`;
    const spanishUrl = `${SITE_ORIGIN}${translatedPath(routePath, "es")}`;
    const url = `${SITE_ORIGIN}${pathname}`;
    const ogImage = image ?? `${SITE_ORIGIN}/og-image.jpg`;
    const isDeployPreview =
      typeof window !== "undefined" &&
      window.location.hostname.startsWith("deploy-preview-") &&
      window.location.hostname.endsWith(".netlify.app");
    const pageMeta = resolvedLang === "es" ? SPANISH_META[basePath] : undefined;
    const displayTitle = pageMeta?.title ?? title;
    const displayDescription = pageMeta?.description ?? description;
    const prevTitle = document.title;
    const prevLang = document.documentElement.lang;
    document.title = displayTitle;
    document.documentElement.lang = resolvedLang === "es" ? "es" : "en";

    upsertMeta('meta[name="description"]', { name: "description", content: displayDescription });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex || isDeployPreview ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    });
    upsertLink('link[rel="canonical"]', { rel: "canonical", href: url });
    upsertLink('link[rel="alternate"][hreflang="en"]', { rel: "alternate", hreflang: "en", href: englishUrl });
    upsertLink('link[rel="alternate"][hreflang="es"]', { rel: "alternate", hreflang: "es", href: spanishUrl });
    upsertLink('link[rel="alternate"][hreflang="x-default"]', { rel: "alternate", hreflang: "x-default", href: englishUrl });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: displayTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: displayDescription });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "Driver Compliance Hub" });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: ogImage });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: resolvedLang === "es" ? "es_ES" : "en_US" });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: displayTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: displayDescription });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: ogImage });

    const scripts: HTMLScriptElement[] = [];
    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      blocks.forEach((block) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.seo = "page";
        script.text = JSON.stringify(block);
        document.head.appendChild(script);
        scripts.push(script);
      });
    }

    return () => {
      document.title = prevTitle;
      document.documentElement.lang = prevLang;
      scripts.forEach((script) => script.remove());
    };
  }, [title, description, path, noindex, jsonLd, image, resolvedLang]);

  return null;
};

export const breadcrumbLd = (items: { name: string; path: string }[], lang: Lang = "en"): Record<string, unknown> => {
  const resolvedLang = typeof window !== "undefined" && /^\/es(?:\/|$)/.test(window.location.pathname) ? "es" : lang;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_ORIGIN}${translatedPath(item.path, resolvedLang)}`,
    })),
  };
};

export const articleLd = ({ title, description, path, lang = "en" }: { title: string; description: string; path: string; lang?: Lang }): Record<string, unknown> => {
  const resolvedLang = typeof window !== "undefined" && /^\/es(?:\/|$)/.test(window.location.pathname) ? "es" : lang;
  const pageMeta = resolvedLang === "es" ? SPANISH_META[translatedPath(path, "en")] : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageMeta?.title ?? title,
    description: pageMeta?.description ?? description,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_ORIGIN}${translatedPath(path, resolvedLang)}` },
    author: { "@type": "Organization", name: "Driver Compliance Hub" },
    publisher: { "@type": "Organization", name: "Driver Compliance Hub" },
    inLanguage: resolvedLang === "es" ? "es" : "en-US",
  };
};
