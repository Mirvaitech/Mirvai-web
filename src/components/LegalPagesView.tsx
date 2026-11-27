import React, { useState } from 'react';
import {
  buildWhatsAppUrl,
  SurfaceView,
  WHATSAPP_DISPLAY,
} from '../lib/courtyardReview';

export type LegalView = Extract<SurfaceView, 'terms' | 'privacy' | 'delete'>;

interface LegalPagesViewProps {
  activePage: LegalView;
  savedCount: number;
  requestCount: number;
  hasPortrait: boolean;
  onNavigateView: (view: SurfaceView) => void;
  onClearLocalData: () => void;
  onSubmitDeletionRequest: (payload: {
    name: string;
    contact: string;
    scope: string;
    reason: string;
  }) => void;
}

const EFFECTIVE_DATE = 'November 22, 2026';

export const LegalPagesView: React.FC<LegalPagesViewProps> = ({
  activePage,
  savedCount,
  requestCount,
  hasPortrait,
  onNavigateView,
  onClearLocalData,
  onSubmitDeletionRequest,
}) => {
  const [delName, setDelName] = useState('');
  const [delContact, setDelContact] = useState('');
  const [delScope, setDelScope] = useState('All account, enquiry & saved data');
  const [delReason, setDelReason] = useState('');
  const [delConfirmed, setDelConfirmed] = useState(false);
  const [delError, setDelError] = useState<string | null>(null);
  const [delSubmittedRef, setDelSubmittedRef] = useState<string | null>(null);
  const [localCleared, setLocalCleared] = useState(false);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    view: SurfaceView
  ) => {
    e.preventDefault();
    onNavigateView(view);
  };

  const handleDeleteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanName = delName.trim();
    const cleanContact = delContact.trim();
    if (!cleanName || !cleanContact) {
      setDelError('Please enter your name and the email or phone number used with MIRVAI.');
      return;
    }
    if (!delConfirmed) {
      setDelError('Please confirm that you want your MIRVAI records permanently removed.');
      return;
    }
    setDelError(null);
    onSubmitDeletionRequest({
      name: cleanName,
      contact: cleanContact,
      scope: delScope,
      reason: delReason.trim(),
    });
    const refId = `DEL-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setDelSubmittedRef(refId);
    setDelName('');
    setDelContact('');
    setDelReason('');
    setDelConfirmed(false);
  };

  const handleClearDeviceData = () => {
    onClearLocalData();
    setLocalCleared(true);
  };

  return (
    <div className="legal-shell">
      <header className="site-head legal-head">
        <a
          className="text-button menu-toggle"
          href="/"
          onClick={(e) => handleLinkClick(e, 'website')}
        >
          <svg aria-hidden="true" style={{ transform: 'rotate(180deg)' }}>
            <use href="#i-arrow" />
          </svg>
          <span>Back to MIRVAI</span>
        </a>

        <a
          className="wordmark"
          href="/"
          aria-label="MIRVAI home"
          onClick={(e) => handleLinkClick(e, 'website')}
        >
          MIRVAI
        </a>

        <a
          className="text-button head-contact"
          href="/app"
          onClick={(e) => handleLinkClick(e, 'app')}
        >
          Open Client App
        </a>
      </header>

      <div className="legal-container">
        <nav className="legal-tabs" aria-label="Legal and data management pages">
          <a
            href="/terms"
            aria-current={activePage === 'terms' ? 'page' : undefined}
            className={activePage === 'terms' ? 'is-active' : ''}
            onClick={(e) => handleLinkClick(e, 'terms')}
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            aria-current={activePage === 'privacy' ? 'page' : undefined}
            className={activePage === 'privacy' ? 'is-active' : ''}
            onClick={(e) => handleLinkClick(e, 'privacy')}
          >
            Privacy Policy
          </a>
          <a
            href="/delete"
            aria-current={activePage === 'delete' ? 'page' : undefined}
            className={activePage === 'delete' ? 'is-active' : ''}
            onClick={(e) => handleLinkClick(e, 'delete')}
          >
            Delete Account &amp; Data
          </a>
        </nav>

        {activePage === 'terms' && (
          <article className="legal-article" aria-labelledby="terms-heading">
            <p className="eyebrow">MIRVAI / LEGAL</p>
            <h1 id="terms-heading">Terms of Service</h1>
            <p className="legal-meta">
              Effective date: {EFFECTIVE_DATE} · Applies to the MIRVAI website and mobile web
              application.
            </p>

            <section className="legal-section">
              <h2>1. Overview of MIRVAI</h2>
              <p>
                MIRVAI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates a real
                estate discovery and advisory platform showcasing residential properties, off-plan
                developments, and verified land across Lagos Island and Lagos Mainland. By
                accessing the MIRVAI website or Client App, you agree to these Terms of Service.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Property Listings &amp; Independent Developers</h2>
              <p>
                Listings displayed on MIRVAI may originate from MIRVAI partners, independent
                property developers, or verified property owners. While we curate descriptions,
                photography, video walkthroughs, and pricing in Naira (NGN) or US Dollars (USD),
                all availability, finishes, payment milestones, and title documents (such as
                Governor&rsquo;s Consent or Certificate of Occupancy) remain subject to final
                physical inspection and legal verification prior to any transaction.
              </p>
            </section>

            <section className="legal-section">
              <h2>3. Enquiries, Viewings &amp; Advisory</h2>
              <p>
                Submitting an enquiry or requesting a property viewing through MIRVAI or WhatsApp
                does not create a binding purchase contract, reservation, or agency fee obligation.
                Any sale, lease, or escrow arrangement is governed exclusively by written agreements
                executed directly with the relevant seller, developer, or legal representative.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. Acceptable Use</h2>
              <p>
                You agree to provide accurate contact information when submitting property
                enquiries or viewing requests, and not to scrape, copy, redistribute, or misuse
                property media, trademarks, or platform infrastructure. Authorized team members
                using the MIRVAI administrative workspace must upload only property media they have
                rights to publish.
              </p>
            </section>

            <section className="legal-section">
              <h2>5. Intellectual Property</h2>
              <p>
                The MIRVAI name, visual identity, interface design, curated copy, and editorial
                photography belong to MIRVAI or its respective licensors. You may browse and share
                property links for personal home-search purposes only.
              </p>
            </section>

            <section className="legal-section">
              <h2>6. Limitation of Liability &amp; Updates</h2>
              <p>
                The platform is provided on an &ldquo;as available&rdquo; basis. MIRVAI is not
                liable for indirect or consequential losses arising from reliance on illustrative
                estimates, temporary service interruptions, or third-party developer schedule
                changes. We may update these Terms from time to time by posting the revised date on
                this page.
              </p>
            </section>

            <section className="legal-section">
              <h2>7. Contact &amp; Related Policies</h2>
              <p>
                For questions about these Terms, reach our advisory desk via WhatsApp at{' '}
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {WHATSAPP_DISPLAY}
                </a>
                , read our{' '}
                <a href="/privacy" onClick={(e) => handleLinkClick(e, 'privacy')}>
                  Privacy Policy
                </a>
                , or manage your information on the{' '}
                <a href="/delete" onClick={(e) => handleLinkClick(e, 'delete')}>
                  Delete Account &amp; Data
                </a>{' '}
                page.
              </p>
            </section>
          </article>
        )}

        {activePage === 'privacy' && (
          <article className="legal-article" aria-labelledby="privacy-heading">
            <p className="eyebrow">MIRVAI / PRIVACY</p>
            <h1 id="privacy-heading">Privacy Policy</h1>
            <p className="legal-meta">
              Effective date: {EFFECTIVE_DATE} · How MIRVAI handles your information across web and
              mobile app experiences.
            </p>

            <section className="legal-section">
              <h2>1. Information We Collect</h2>
              <ul>
                <li>
                  <strong>Enquiry &amp; Viewing Details:</strong> When you submit a viewing or
                  property enquiry, we collect your name, phone number or email, preferred Lagos
                  area, budget range, timeline, location context, and any notes you share.
                </li>
                <li>
                  <strong>On-Device App Preferences:</strong> Your saved homes shortlist and
                  optional client profile photo preview are stored locally on your device so your
                  shortlist stays available across sessions. Local profile photos are previewed
                  strictly on-device and are not uploaded to remote servers.
                </li>
                <li>
                  <strong>Property Media (Team Workspace):</strong> Images and video walkthroughs
                  uploaded by authorized MIRVAI team members are stored to render live listings.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>2. How We Use Information</h2>
              <p>
                We use your enquiry details solely to respond to property questions, coordinate
                private or video viewings, match you with relevant Lagos Island or Mainland homes,
                and maintain enquiry history inside our advisory CRM. We do not sell your personal
                information to third-party data brokers.
              </p>
            </section>

            <section className="legal-section">
              <h2>3. Infrastructure &amp; Third-Party Links</h2>
              <p>
                Enquiry submissions and live property catalog records are synchronized via Convex
                real-time cloud infrastructure. If you choose to tap a WhatsApp button, you will be
                directed to WhatsApp to chat directly with our advisory number ({WHATSAPP_DISPLAY})
                under WhatsApp&rsquo;s own privacy terms.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. Data Retention &amp; Security</h2>
              <p>
                We retain enquiry records only as long as needed to support active property searches
                and advisory follow-ups, or until you ask us to erase them. Access to team
                enquiry management is restricted to authorized MIRVAI team members.
              </p>
            </section>

            <section className="legal-section">
              <h2>5. Your Rights &amp; Data Deletion</h2>
              <p>
                You can clear your saved shortlist and local browser session data instantly, or
                submit a permanent deletion request for any enquiry or contact records held by
                MIRVAI at any time using our{' '}
                <a href="/delete" onClick={(e) => handleLinkClick(e, 'delete')}>
                  Delete Account &amp; Data
                </a>{' '}
                page.
              </p>
            </section>
          </article>
        )}

        {activePage === 'delete' && (
          <article className="legal-article" aria-labelledby="delete-heading">
            <p className="eyebrow">MIRVAI / DATA CONTROL</p>
            <h1 id="delete-heading">Delete Account &amp; Data</h1>
            <p className="legal-meta">
              Remove your saved shortlist from this device immediately or request permanent
              erasure of your enquiries and contact records from MIRVAI.
            </p>

            <div className="delete-cards-grid">
              <section className="legal-card" aria-labelledby="local-clear-heading">
                <p className="eyebrow">INSTANT ON-DEVICE REMOVAL</p>
                <h2 id="local-clear-heading">Clear app data on this device</h2>
                <p>
                  Immediately removes your saved shortlist ({savedCount} saved{' '}
                  {savedCount === 1 ? 'home' : 'homes'}), local enquiry log ({requestCount}{' '}
                  {requestCount === 1 ? 'record' : 'records'}), and{' '}
                  {hasPortrait ? 'active profile photo preview' : 'profile preferences'} stored in
                  this browser.
                </p>
                <div className="form-actions">
                  <button
                    type="button"
                    className="button outline"
                    onClick={handleClearDeviceData}
                  >
                    Clear local app data now
                  </button>
                </div>
                {localCleared && (
                  <p className="result" role="status">
                    Saved homes, profile preview, and local session data have been cleared from
                    this device.
                  </p>
                )}
              </section>

              <section className="legal-card" aria-labelledby="server-delete-heading">
                <p className="eyebrow">PERMANENT CLOUD RECORD ERASURE</p>
                <h2 id="server-delete-heading">Request account &amp; enquiry deletion</h2>
                <p>
                  Submit your details below to permanently delete any enquiries, viewing schedules,
                  or profile contact records associated with you in MIRVAI&rsquo;s CRM. Requests
                  are processed within 7 business days.
                </p>

                <form className="delete-form" onSubmit={handleDeleteSubmit} noValidate>
                  <label>
                    Full name
                    <input
                      type="text"
                      value={delName}
                      onChange={(e) => setDelName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </label>

                  <label>
                    Email or phone / WhatsApp number
                    <input
                      type="text"
                      value={delContact}
                      onChange={(e) => setDelContact(e.target.value)}
                      placeholder="Email or +234…"
                      required
                    />
                  </label>

                  <label>
                    What should be deleted?
                    <select
                      value={delScope}
                      onChange={(e) => setDelScope(e.target.value)}
                    >
                      <option value="All account, enquiry & saved data">
                        All account, enquiry &amp; saved data
                      </option>
                      <option value="Enquiry and viewing history only">
                        Enquiry and viewing history only
                      </option>
                      <option value="Saved shortlist & local profile only">
                        Saved shortlist &amp; local profile only
                      </option>
                    </select>
                  </label>

                  <label>
                    Additional details (optional)
                    <textarea
                      value={delReason}
                      onChange={(e) => setDelReason(e.target.value)}
                      placeholder="Optional context or specific contact details to remove"
                    />
                  </label>

                  <label className="admin-check-row">
                    <input
                      type="checkbox"
                      checked={delConfirmed}
                      onChange={(e) => setDelConfirmed(e.target.checked)}
                    />
                    <span>
                      I confirm I want MIRVAI to permanently delete my matching account and
                      enquiry records.
                    </span>
                  </label>

                  {delError && <p className="form-error">{delError}</p>}

                  <div className="form-actions">
                    <button type="submit" className="button danger">
                      Submit deletion request
                    </button>
                    <a
                      className="button whatsapp-button"
                      href={buildWhatsAppUrl({
                        propertyName: 'Data / Account Deletion Request',
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Request via WhatsApp ↗
                    </a>
                  </div>
                </form>

                {delSubmittedRef && (
                  <div className="result" role="status">
                    <strong>Deletion request logged ({delSubmittedRef}).</strong> Our team will
                    erase matching records and confirm with you shortly.
                  </div>
                )}
              </section>
            </div>
          </article>
        )}
      </div>

      <footer className="site-foot">
        <div>
          <div className="wordmark">MIRVAI</div>
          <p>Find. Own. Grow.</p>
        </div>
        <div className="legal-foot-links">
          <a href="/" onClick={(e) => handleLinkClick(e, 'website')}>
            Collection
          </a>
          <a href="/app" onClick={(e) => handleLinkClick(e, 'app')}>
            Client App
          </a>
          <a href="/terms" onClick={(e) => handleLinkClick(e, 'terms')}>
            Terms of Service
          </a>
          <a href="/privacy" onClick={(e) => handleLinkClick(e, 'privacy')}>
            Privacy Policy
          </a>
          <a href="/delete" onClick={(e) => handleLinkClick(e, 'delete')}>
            Delete Account &amp; Data
          </a>
        </div>
        <small>MIRVAI Holdings · Lagos Island &amp; Lagos Mainland.</small>
      </footer>
    </div>
  );
};
