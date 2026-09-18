import React from 'react';

/**
 * High-fidelity vector emblems and seals for universities,
 * perfectly matching the original design mockup in public/designs/screen-4.png.
 */
export function UniversityLogo({ id, mark, size = 44 }) {
  const normId = (id || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (normId) {
    case 'sdu':
      return (
        <svg width={size * 1.3} height={size} viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SDU University Logo">
          {/* Stylized modern SDU bold wordmark */}
          <text x="0" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="30" letterSpacing="-1.5" fill="#1260f5">
            SDU
          </text>
        </svg>
      );

    case 'padua':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="University of Padua Seal">
          {/* Historic Circular Terracotta Seal */}
          <circle cx="22" cy="22" r="21" fill="#fff" stroke="#c02626" strokeWidth="2" />
          <circle cx="22" cy="22" r="18.5" fill="none" stroke="#c02626" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          <circle cx="22" cy="22" r="14" fill="#fef2f2" stroke="#c02626" strokeWidth="1" />
          {/* Latin lettering ring imitation */}
          <circle cx="22" cy="22" r="16.2" fill="none" stroke="#dc2626" strokeWidth="0.5" />
          {/* Central iconic heraldic bust / star */}
          <path d="M22 11L24 16H29L25 19.5L26.5 24.5L22 21.5L17.5 24.5L19 19.5L15 16H20L22 11Z" fill="#b91c1c" />
          <path d="M17 27C17 25 19 24 22 24C25 24 27 25 27 27C27 29.5 24.5 32 22 32C19.5 32 17 29.5 17 27Z" fill="#991b1b" opacity="0.85" />
          <text x="22" y="38" textAnchor="middle" fontSize="4.5" fontWeight="700" fill="#991b1b" fontFamily="serif" letterSpacing="0.5">
            PADVA 1222
          </text>
        </svg>
      );

    case 'nu':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Nazarbayev University Crest">
          {/* Bronze/Gold Heraldic Rounded Shield */}
          <rect x="2" y="2" width="40" height="40" rx="10" fill="url(#nu-grad)" />
          <path d="M12 11H17.5L26.5 27.5V11H32V33H26.5L17.5 16.5V33H12V11Z" fill="#ffffff" />
          <circle cx="30" cy="13" r="2.5" fill="#fef08a" />
          <defs>
            <linearGradient id="nu-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#854d0e" />
              <stop offset="1" stopColor="#a16207" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'kbtu':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="KBTU Crest">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#1e293b" stroke="#dc2626" strokeWidth="2" />
          <path d="M22 6L33 13V24C33 31 22 37 22 37C22 37 11 31 11 24V13L22 6Z" fill="#b91c1c" />
          <path d="M22 10L30 15V23C30 28 22 33 22 33C22 33 14 28 14 23V15L22 10Z" fill="#1e293b" />
          <text x="22" y="24" textAnchor="middle" fontSize="8" fontWeight="900" fill="#f8fafc" fontFamily="Inter, sans-serif" letterSpacing="0.5">
            КБТУ
          </text>
        </svg>
      );

    case 'aitu':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Astana IT University Logo">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
          {/* Futuristic Hexagonal Tech Node */}
          <polygon points="22,9 33,15 33,29 22,35 11,29 11,15" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <circle cx="22" cy="9" r="2" fill="#06b6d4" />
          <circle cx="33" cy="15" r="2" fill="#06b6d4" />
          <circle cx="33" cy="29" r="2" fill="#06b6d4" />
          <circle cx="22" cy="35" r="2" fill="#06b6d4" />
          <circle cx="11" cy="29" r="2" fill="#06b6d4" />
          <circle cx="11" cy="15" r="2" fill="#06b6d4" />
          <text x="22" y="25" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#38bdf8" fontFamily="Inter, sans-serif" letterSpacing="0.8">
            AITU
          </text>
        </svg>
      );

    case 'asu':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Arizona State University Emblem">
          {/* ASU Sun Devil Maroon & Gold Shield */}
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#8c1d40" stroke="#ffc627" strokeWidth="2" />
          {/* Stylized Sun Devil Pitchfork / Trident */}
          <path d="M22 9V29M22 29H18M22 29H26M16 11V21C16 23 18 25 22 25C26 25 28 23 28 21V11M16 11L14 15M22 9L20 13M22 9L24 13M28 11L30 15" stroke="#ffc627" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="22" y="38" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#ffffff" fontFamily="Inter, sans-serif" letterSpacing="0.8">
            ASU
          </text>
        </svg>
      );

    case 'mit':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MIT Logo">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          {/* Iconic MIT Slash-Bars */}
          <rect x="7" y="12" width="4.5" height="20" fill="#a31f34" />
          <rect x="14" y="12" width="4.5" height="13" fill="#a31f34" />
          <rect x="14" y="27" width="4.5" height="5" fill="#8b959e" />
          <rect x="21" y="12" width="4.5" height="20" fill="#a31f34" />
          <rect x="28" y="19" width="4.5" height="13" fill="#a31f34" />
          <rect x="28" y="12" width="4.5" height="5" fill="#8b959e" />
          <rect x="35" y="12" width="4.5" height="20" fill="#a31f34" />
        </svg>
      );

    case 'stanford':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stanford University Logo">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#ffffff" stroke="#8c1515" strokeWidth="2" />
          {/* Cardinal Red Block 'S' with Redwood */}
          <text x="22" y="32" textAnchor="middle" fontSize="28" fontWeight="900" fill="#8c1515" fontFamily="serif">
            S
          </text>
          {/* Redwood Tree Silhouette inside S */}
          <polygon points="22,12 24,17 26,17 23.5,21 25.5,21 22,27 18.5,21 20.5,21 18,17 20,17" fill="#005026" />
          <rect x="21.2" y="27" width="1.6" height="4" fill="#603000" />
        </svg>
      );

    case 'harvard':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Harvard University Shield">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#a51c30" stroke="#791322" strokeWidth="1.5" />
          <path d="M10 8H34V24C34 31 22 36 22 36C22 36 10 31 10 24V8Z" fill="#a51c30" stroke="#ffffff" strokeWidth="1.5" />
          {/* Three Veritas Books */}
          <rect x="14" y="12" width="6" height="5" rx="1" fill="#ffffff" />
          <rect x="24" y="12" width="6" height="5" rx="1" fill="#ffffff" />
          <rect x="19" y="21" width="6" height="5" rx="1" fill="#ffffff" />
          <text x="17" y="16" textAnchor="middle" fontSize="3.5" fontWeight="900" fill="#a51c30">VE</text>
          <text x="27" y="16" textAnchor="middle" fontSize="3.5" fontWeight="900" fill="#a51c30">RI</text>
          <text x="22" y="25" textAnchor="middle" fontSize="3.5" fontWeight="900" fill="#a51c30">TAS</text>
        </svg>
      );

    case 'ucberkeley':
    case 'berkeley':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="UC Berkeley Seal">
          <circle cx="22" cy="22" r="20" fill="#003262" stroke="#fdb515" strokeWidth="2" />
          <circle cx="22" cy="22" r="16.5" fill="none" stroke="#fdb515" strokeWidth="0.8" strokeDasharray="1.5 1" />
          {/* Open Book & Star */}
          <path d="M16 20C18 19 21 19 22 21C23 19 26 19 28 20V27C26 26 23 26 22 28C21 26 18 26 16 27V20Z" fill="#ffffff" />
          <polygon points="22,11 23,14 26,14 23.5,16 24.5,19 22,17 19.5,19 20.5,16 18,14 21,14" fill="#fdb515" />
          <text x="22" y="35" textAnchor="middle" fontSize="4.2" fontWeight="700" fill="#fdb515" fontFamily="Inter, sans-serif">
            FIAT LUX
          </text>
        </svg>
      );

    case 'tum':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Technical University of Munich Crest">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#0065bd" />
          {/* TUM Geometric Towers */}
          <path d="M9 13H15V29H12V16H9V13Z" fill="#ffffff" />
          <path d="M16 13H21V26C21 28 22 29 23.5 29C25 29 26 28 26 26V13H31V26C31 30 28 32 23.5 32C19 32 16 30 16 26V13Z" fill="#ffffff" />
          <path d="M32 13H35L38 22L41 13H44V29H41V17L38 26L35 17V29H32V13Z" fill="#ffffff" transform="scale(0.85) translate(4, 2)" />
        </svg>
      );

    case 'bocconi':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bocconi University Seal">
          <circle cx="22" cy="22" r="20" fill="#002855" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="22" cy="22" r="16.5" fill="none" stroke="#93c5fd" strokeWidth="0.8" />
          <path d="M22 12L28 17V27L22 32L16 27V17L22 12Z" fill="#1e40af" stroke="#ffffff" strokeWidth="1" />
          <text x="22" y="24" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#ffffff" fontFamily="serif">
            UB
          </text>
        </svg>
      );

    case 'kaist':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="KAIST Logo">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#004191" />
          <circle cx="15" cy="16" r="3" fill="#00b0f0" />
          <circle cx="29" cy="16" r="3" fill="#00b0f0" />
          <path d="M15 28C15 23 18 20 22 20C26 20 29 23 29 28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <text x="22" y="38" textAnchor="middle" fontSize="6" fontWeight="900" fill="#ffffff" fontFamily="Inter, sans-serif" letterSpacing="0.8">
            KAIST
          </text>
        </svg>
      );

    case 'nyu':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NYU Logo">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#57068c" />
          {/* Torch */}
          <path d="M22 9C23 12 25 13 25 15C25 17 23.5 18 22 18C20.5 18 19 17 19 15C19 13 21 12 22 9Z" fill="#ffc72c" />
          <path d="M18 18H26L24 23H20L18 18Z" fill="#ffffff" />
          <rect x="21" y="23" width="2" height="7" fill="#ffffff" />
          <text x="22" y="38" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#ffffff" fontFamily="Inter, sans-serif" letterSpacing="1">
            NYU
          </text>
        </svg>
      );

    case 'polimi':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Politecnico di Milano Emblem">
          <circle cx="22" cy="22" r="20" fill="#1b2d4f" stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx="22" cy="22" r="16" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 1.5" />
          <text x="22" y="20" textAnchor="middle" fontSize="6" fontWeight="800" fill="#ffffff" fontFamily="Inter, sans-serif">
            POLI
          </text>
          <text x="22" y="27" textAnchor="middle" fontSize="6" fontWeight="800" fill="#38bdf8" fontFamily="Inter, sans-serif">
            MI
          </text>
          <circle cx="22" cy="33" r="1.5" fill="#f59e0b" />
        </svg>
      );

    case 'purdue':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Purdue University Logo">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#000000" stroke="#ceb888" strokeWidth="2" />
          <text x="22" y="31" textAnchor="middle" fontSize="26" fontWeight="900" fill="#ceb888" fontFamily="serif">
            P
          </text>
        </svg>
      );

    case 'columbia':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Columbia University Crown">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#002b7f" />
          {/* Columbia Crown */}
          <path d="M11 25L13 15L18 20L22 13L26 20L31 15L33 25H11Z" fill="#9bcbeb" stroke="#ffffff" strokeWidth="1" />
          <rect x="11" y="26" width="22" height="3" rx="1" fill="#ffffff" />
          <circle cx="13" cy="14" r="1.5" fill="#ffffff" />
          <circle cx="22" cy="12" r="1.5" fill="#ffffff" />
          <circle cx="31" cy="14" r="1.5" fill="#ffffff" />
        </svg>
      );

    case 'cmu':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Carnegie Mellon University Crest">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#c41230" />
          <path d="M12 11H32V25C32 31 22 35 22 35C22 35 12 31 12 25V11Z" fill="#990011" stroke="#ffffff" strokeWidth="1.5" />
          <text x="22" y="25" textAnchor="middle" fontSize="8" fontWeight="900" fill="#ffffff" fontFamily="serif">
            CMU
          </text>
        </svg>
      );

    case 'kaznu':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="KazNU Logo">
          <circle cx="22" cy="22" r="20" fill="#0284c7" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="22" cy="22" r="16.5" fill="none" stroke="#ffffff" strokeWidth="0.8" />
          <circle cx="22" cy="16" r="3.5" fill="#fef08a" />
          <path d="M16 27C17 24 20 22 22 22C24 22 27 24 28 27C27 30 24 31 22 31C20 31 17 30 16 27Z" fill="#ffffff" />
          <text x="22" y="38" textAnchor="middle" fontSize="5" fontWeight="900" fill="#ffffff" fontFamily="Inter, sans-serif">
            КАЗНУ
          </text>
        </svg>
      );

    case 'iitu':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IITU Logo">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <polygon points="22,8 32,14 32,26 22,32 12,26 12,14" fill="#0369a1" stroke="#ffffff" strokeWidth="1.5" />
          <text x="22" y="23" textAnchor="middle" fontSize="7" fontWeight="900" fill="#ffffff" fontFamily="Inter, sans-serif">
            IITU
          </text>
        </svg>
      );

    case 'satbayev':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Satbayev University Logo">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#047857" stroke="#10b981" strokeWidth="2" />
          <polygon points="22,10 32,18 28,31 16,31 12,18" fill="#065f46" stroke="#ffffff" strokeWidth="1.5" />
          <text x="22" y="24" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#ffffff" fontFamily="serif">
            SU
          </text>
        </svg>
      );

    case 'kimep':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="KIMEP University Logo">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#b91c1c" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="22,11 23.5,15 28,15 24.5,18 26,22 22,19.5 18,22 19.5,18 16,15 20.5,15" fill="#fbbf24" />
          <text x="22" y="32" textAnchor="middle" fontSize="6" fontWeight="900" fill="#ffffff" fontFamily="Inter, sans-serif" letterSpacing="0.8">
            KIMEP
          </text>
        </svg>
      );

    case 'narxoz':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Narxoz University Logo">
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#1e293b" stroke="#e11d48" strokeWidth="2" />
          <polygon points="22,9 33,22 22,35 11,22" fill="#e11d48" />
          <text x="22" y="24" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#ffffff" fontFamily="Inter, sans-serif">
            НАРХОЗ
          </text>
        </svg>
      );

    default: {
      // Elegant heraldic shield fallback for all other universities
      const initials = (mark || id || 'U').slice(0, 4);
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`${initials} Emblem`}>
          <rect x="2" y="2" width="40" height="40" rx="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M12 10H32V23C32 29 22 34 22 34C22 34 12 29 12 23V10Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          <text x="22" y="24" textAnchor="middle" fontSize={initials.length > 3 ? "7" : initials.length > 2 ? "8" : "10"} fontWeight="800" fill="#1e293b" fontFamily="Inter, sans-serif">
            {initials}
          </text>
        </svg>
      );
    }
  }
}
