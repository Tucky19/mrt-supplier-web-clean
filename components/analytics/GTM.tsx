import Script from "next/script";

const GTM_ID = "GTM-5FB498FW";

export function GoogleConsentDefaults() {
  return (
    <script
      id="google-consent-defaults"
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        var consentChoice = null;
        try { consentChoice = localStorage.getItem('mrt_cookie_consent'); } catch (e) {}
        var consentValue = consentChoice === 'accepted' ? 'granted' : 'denied';
        gtag('consent', 'default', {
          ad_storage: consentValue,
          analytics_storage: consentValue,
          ad_user_data: consentValue,
          ad_personalization: consentValue,
          wait_for_update: 500
        });
        gtag('set', 'ads_data_redaction', true);
      `,
      }}
    />
  );
}

export function GTMHead() {
  return (
    <Script id="gtm-head" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
    </Script>
  );
}

export function GTMBody() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
