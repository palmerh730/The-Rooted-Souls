import React from 'react';
import styles from './AsSeenOn.module.css';

const logos = [
  { 
    name: 'Digital Journal',
    domain: 'digitaljournal.com',
    link: 'https://www.digitaljournal.com/pr/news/prunderground/years-chronic-insomnia-personal-struggle-1903215595.html'
  },
  { 
    name: 'Google News',
    domain: 'news.google.com',
    link: 'https://news.google.com/search?q=After+Years+of+Chronic+Insomnia+and+Personal+Struggle,+Dublin-Born+Author+Alan+McDonald+Publishes+Debut+Poetry+Collection&hl=en-PK&gl=PK&ceid=PK:en'
  },
  { 
    name: 'Financial Content',
    domain: 'financialcontent.com',
    link: 'https://markets.financialcontent.com/stocks/article/prunderground-2026-6-24-after-years-of-chronic-insomnia-and-personal-struggle-dublin-born-author-alan-mcdonald-publishes-debut-poetry-collection'
  },
  { 
    name: 'MINYANVILLE',
    domain: 'minyanville.com',
    link: 'https://finance.minyanville.com/minyanville/article/prunderground-2026-6-24-after-years-of-chronic-insomnia-and-personal-struggle-dublin-born-author-alan-mcdonald-publishes-debut-poetry-collection'
  },
  { 
    name: 'The Chronicle Journal',
    domain: 'chroniclejournal.com',
    link: 'http://markets.chroniclejournal.com/chroniclejournal/article/prunderground-2026-6-24-after-years-of-chronic-insomnia-and-personal-struggle-dublin-born-author-alan-mcdonald-publishes-debut-poetry-collection'
  },
  { 
    name: 'Times Record',
    domain: 'times-online.com',
    link: 'http://business.times-online.com/times-online/article/prunderground-2026-6-24-after-years-of-chronic-insomnia-and-personal-struggle-dublin-born-author-alan-mcdonald-publishes-debut-poetry-collection'
  },
  { 
    name: 'The Daily News',
    domain: 'bogalusadailynews.com',
    link: 'https://smb.bogalusadailynews.com/article/After-Years-of-Chronic-Insomnia-and-Personal-Struggle-Dublin-Born-Author-Alan-McDonald-Publishes-Debut-Poetry-Collection/6a3bf544787ee30002e175e2'
  },
  { 
    name: 'Washington City Paper',
    domain: 'washingtoncitypaper.com',
    link: 'https://pr.washingtoncitypaper.com/article/After-Years-of-Chronic-Insomnia-and-Personal-Struggle-Dublin-Born-Author-Alan-McDonald-Publishes-Debut-Poetry-Collection/6a3bf544787ee30002e175e2'
  },
];

const LaurelWreath = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M50,190 C30,170 10,130 10,90 C10,50 30,20 50,10 C40,30 30,60 30,90 C30,120 40,160 50,190 Z" opacity="0.4" />
    <path d="M50,190 C40,170 30,130 30,90 C30,50 40,20 50,10 C35,30 20,60 20,90 C20,120 35,160 50,190 Z" opacity="0.6"/>
    {/* Leaves */}
    <path d="M25,150 Q5,140 15,120 Q35,135 25,150 Z" opacity="0.8"/>
    <path d="M20,110 Q0,100 10,80 Q30,95 20,110 Z" opacity="0.8"/>
    <path d="M20,70 Q0,60 10,40 Q30,55 20,70 Z" opacity="0.8"/>
    <path d="M25,35 Q5,25 15,5 Q35,20 25,35 Z" opacity="0.8"/>
  </svg>
);

const AsSeenOn: React.FC = () => {
  // Duplicate logos array to create seamless infinite scroll
  const marqueeLogos = [...logos, ...logos];

  return (
    <section className={styles.asSeenOnSection}>
      <div className={styles.headerContainer}>
        <div className={styles.divider} />
        <h2 className={styles.title}>AS SEEN ON</h2>
        <div className={styles.divider} />
      </div>

      <div className={styles.marqueeWrapper}>
        <LaurelWreath className={styles.laurelLeft} />
        
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {marqueeLogos.map((logo, index) => (
              <a 
                key={index} 
                href={logo.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.logoItem}
                title={`View Press Release on ${logo.name}`}
              >
                <img 
                  src={`https://logo.clearbit.com/${logo.domain}`} 
                  alt={logo.name} 
                  className={styles.logoImage}
                  onError={(e) => {
                    // Fallback to text if the logo fails to load
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('span')) {
                      const span = document.createElement('span');
                      span.textContent = logo.name;
                      span.className = styles.logoFallbackText;
                      parent.appendChild(span);
                    }
                  }}
                />
              </a>
            ))}
          </div>
        </div>

        <LaurelWreath className={styles.laurelRight} />
      </div>

      <div className={styles.footerText}>
        AND OVER 320 NEWS SITES
      </div>
    </section>
  );
};

export default AsSeenOn;
