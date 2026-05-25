/**
 * Generate static HTML files for SEO/crawler compatibility.
 * Creates one HTML file per route with correct meta tags.
 * Run after `npm run build` and before deploy.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";

const DIST = "dist";
const INDEX_HTML = readFileSync(join(DIST, "index.html"), "utf-8");
const SITE_ORIGIN = "https://fmcsahelper.com";

const ROUTES = [
  { path: "/", title: "Driver Compliance Hub | Practical FMCSA Guidance for Small Fleets", description: "Free, practical FMCSA guidance for owner-operators and small fleets, including new-hire files, annual reviews, medical updates, and printable checklists.", lang: "en" },
  { path: "/es/", title: "Driver Compliance Hub | Orientacion practica de la FMCSA para pequenas flotas", description: "Orientacion practica gratuita de la FMCSA para operadores propietarios y pequenas flotas, con revisiones anuales, actualizaciones medicas y listas imprimibles.", lang: "es" },
  { path: "/about", title: "About | Driver Compliance Hub", description: "Driver Compliance Hub provides practical FMCSA compliance guidance for owner-operators and small fleets based on official sources.", lang: "en" },
  { path: "/es/about", title: "Acerca de | Driver Compliance Hub", description: "Driver Compliance Hub ayuda a operadores propietarios y pequenas flotas a encontrar orientacion practica de cumplimiento basada en fuentes oficiales.", lang: "es" },
  { path: "/contact", title: "Contact | Driver Compliance Hub", description: "Contact Driver Compliance Hub about free compliance guidance and printable checklists.", lang: "en" },
  { path: "/es/contact", title: "Contacto | Driver Compliance Hub", description: "Contacte a Driver Compliance Hub sobre la orientacion gratuita de cumplimiento y las listas imprimibles.", lang: "es" },
  { path: "/privacy", title: "Privacy Policy | Driver Compliance Hub", description: "Privacy policy for Driver Compliance Hub and its browser-based printable checklist tool.", lang: "en" },
  { path: "/es/privacy", title: "Politica de Privacidad | Driver Compliance Hub", description: "Politica de privacidad de Driver Compliance Hub y su herramienta de listas imprimibles en el navegador.", lang: "es" },
  { path: "/verify-examiner", title: "Verify Your DOT Medical Examiner | Driver Compliance Hub", description: "How to verify your DOT medical examiner is listed on the FMCSA National Registry and understand the current temporary exemption for paper certificates.", lang: "en" },
  { path: "/es/verify-examiner", title: "Verifique a su Examinador Medico DOT | Driver Compliance Hub", description: "Como verificar que su examinador medico DOT figure en el Registro Nacional de la FMCSA y conocer la exencion temporal vigente para certificados en papel.", lang: "es" },
  { path: "/checklist/employment-application", title: "Employment Application | 49 CFR 391.21 | Driver Compliance Hub", description: "FMCSA requirements for driver employment applications: CMV history, general employment history, accidents, violations, and residences under 49 CFR 391.21.", lang: "en" },
  { path: "/es/checklist/employment-application", title: "Solicitud de Empleo del Conductor | 49 CFR 391.21 | Driver Compliance Hub", description: "Requisitos de la FMCSA para la solicitud de empleo del conductor: historial de CMV, historial laboral general, accidentes, infracciones y domicilios bajo 49 CFR 391.21.", lang: "es" },
  { path: "/checklist/initial-mvr", title: "Initial Motor Vehicle Record (MVR) | 49 CFR 391.23 | Driver Compliance Hub", description: "FMCSA guidance for requesting and reviewing a driver's initial motor vehicle record under 49 CFR 391.23.", lang: "en" },
  { path: "/es/checklist/initial-mvr", title: "Registro Inicial de Vehiculos Motorizados (MVR) | 49 CFR 391.23 | Driver Compliance Hub", description: "Guia de la FMCSA para solicitar y revisar el registro inicial de vehiculos motorizados de conductores regulados por el DOT bajo 49 CFR 391.23.", lang: "es" },
  { path: "/checklist/road-test", title: "Road Test and Certification | 49 CFR 391.31 | Driver Compliance Hub", description: "FMCSA requirements under 49 CFR 391.31 for road test certificates, CDL equivalents, and recordkeeping.", lang: "en" },
  { path: "/es/checklist/road-test", title: "Examen de Manejo y Certificacion | 49 CFR 391.31 | Driver Compliance Hub", description: "Requisitos de la FMCSA bajo 49 CFR 391.31 para certificados de examen de manejo, equivalencias de CDL y conservacion en el expediente.", lang: "es" },
  { path: "/checklist/medical-certificate", title: "Medical Examiner Certificate | 49 CFR 391.43 | Driver Compliance Hub", description: "FMCSA guidance on medical certificates, examiner verification, and the current temporary exemption for paper certificates during the NRII transition.", lang: "en" },
  { path: "/es/checklist/medical-certificate", title: "Certificado del Examinador Medico | 49 CFR 391.43 | Driver Compliance Hub", description: "Orientacion de la FMCSA sobre certificados medicos, verificacion del examinador y la exencion vigente para certificados en papel durante la transicion NRII.", lang: "es" },
  { path: "/checklist/safety-performance-history", title: "Safety Performance History | 49 CFR 391.23 | Driver Compliance Hub", description: "Investigation requirements for DOT-regulated employers under 49 CFR 391.23: process, retention, and driver rights.", lang: "en" },
  { path: "/es/checklist/safety-performance-history", title: "Historial de Desempeno de Seguridad | 49 CFR 391.23 | Driver Compliance Hub", description: "Requisitos de investigacion para empleadores regulados por DOT bajo 49 CFR 391.23: proceso, retencion y derechos del conductor.", lang: "es" },
];

function buildHtml(route) {
  const url = `${SITE_ORIGIN}${route.path}`;
  const enUrl = route.lang === "es"
    ? url.replace("/es/", "/").replace("/es", "")
    : url;
  const esUrl = route.lang === "es"
    ? url
    : (route.path === "/" ? "/es/" : `/es${route.path}`);

  const ogLocale = route.lang === "es" ? "es_ES" : "en_US";
  const htmlLang = route.lang === "es" ? "es" : "en";

  let html = INDEX_HTML
    .replace('<html lang="en">', `<html lang="${htmlLang}">`)
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${route.description}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${route.title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${route.description}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${ogLocale}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${route.title}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${route.description}" />`);

  // Update hreflang links
  html = html.replace(
    /<link rel="alternate" hreflang="en" href=".*?" \/>/,
    `<link rel="alternate" hreflang="en" href="${enUrl}" />`
  );
  html = html.replace(
    /<link rel="alternate" hreflang="es" href=".*?" \/>/,
    `<link rel="alternate" hreflang="es" href="${esUrl}" />`
  );
  html = html.replace(
    /<link rel="alternate" hreflang="x-default" href=".*?" \/>/,
    `<link rel="alternate" hreflang="x-default" href="${enUrl}" />`
  );

  return html;
}

for (const route of ROUTES) {
  const filePath = join(DIST, route.path, "index.html");
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, buildHtml(route));
  console.log(`Generated: ${filePath}`);
}

console.log(`\nDone! Generated ${ROUTES.length} static HTML files.`);
