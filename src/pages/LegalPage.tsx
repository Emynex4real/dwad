import Arrow from '../components/ui/Arrow';

const agreementSections = [
  {
    id: 'definitions',
    title: 'Definitions',
    content: [
      '"Authorized Artwork" means album cover artwork and any other artwork relating to Your Authorized Content that You provide to Us. All such artwork will be deemed to have been properly cleared and/or licensed by You for all purposes, unless You provide Us with written notice to the contrary.',
      '"Authorized Territory" means the Universe, or more limited territories, if You so choose, in the registration.',
      '"Authorized Content" means sound recordings and underlying musical compositions that You have designated for digital distribution by Us. Any such sound recordings and the underlying musical compositions must be owned or controlled by You and/or have been cleared by You for all purposes and rights granted and authorized hereunder.',
      '"Copyright Management Information" means the digital information conveying information regarding a Digital Master, such as your name, the title of the applicable album, the name of the song and the record company name.',
      '"Digital Master" or "Digital Masters" means a copy or copies of Your Authorized Content in digital form.',
      '"The Effective Date" means the date on which Your material becomes available on the DSP\'s platform.',
    ],
  },
  {
    id: 'modification',
    title: 'Modification of Terms',
    content: [
      'All features, content, and prices of services described or depicted on Our Platform are subject to change at any time without notice. We reserve the right, at Our sole discretion, to change, modify or otherwise alter these Terms at any time. You must review these Terms on a regular basis to keep Yourself informed of any changes.',
      'By Using the DWAD MUSIC Digital Platform, You agree that the posting of new or revised Terms on or within the DWAD MUSIC Digital Platform shall constitute adequate and constructive notice to You of any and all revisions and changes. Continued Use of the DWAD MUSIC Digital Platform after any such changes or after explicitly accepting the new Terms upon logging into the DWAD MUSIC Digital Platforms shall constitute Your acceptance of such changes.',
    ],
  },
  {
    id: 'eligibility',
    title: 'Eligibility and Registration Obligation',
    content: [
      'By registering, You acknowledge and certify that You are eligible for an account and the information You include as part of the registration process is accurate and not misleading. Accounts may only be obtained and used by: (i) individuals who are at least eighteen (18) years old or of legal age in their country of residence, if such age exceeds eighteen (18); (ii) those individuals whose registration has been authorized either by their parents or legal guardian, if they are below the legal age in their respective country of residence; or (iii) individuals with the right and authority to act on behalf of an organization or entity for the purposes of accessing and using DWAD MUSIC Digital Platform.',
      'Upon registering for an account, you agree to and are bound by the following conditions: (i) You shall provide accurate and current registration information and maintain the accuracy of your account details. (ii) Your account is for your personal use exclusively. You shall not create multiple accounts, or transfer your account. (iii) You are responsible for maintaining the confidentiality and security of your username, password, and all other login credentials. You are prohibited from allowing any third party to use your account. (iv) You must promptly notify us of any unauthorized use of your account. You assume full responsibility for all activities that occur under your account, regardless of whether they were authorized by you.',
    ],
  },
  {
    id: 'grant',
    title: 'Grant of Rights / Authorization',
    content: [
      'You hereby appoint Us as Your authorized representative for the sale and distribution of Your authorized content. While Your relationship with DWAD MUSIC for selling Your music is non-exclusive, the specific rights You grant Us under this Digital Distribution Agreement are exclusive. This is because online retailers do not accept the same content from multiple distributors.',
      'Accordingly, You hereby grant to Us the exclusive right, and to our partners the non-exclusive right, during the Term and throughout the Territory to: reproduce, distribute, and otherwise Use Your Digital Masters on any and all Digital Streaming Platforms (DSPs), and to collect all royalties and revenues generated from this distribution; perform and make available, for promotional purposes and without remuneration to the Artiste, portions of Your Authorized Content ("Clips") by "streaming" to promote the license, sale and distribution of Digital Masters; promote, sell, distribute, and deliver Digital Masters (as individual tracks or entire albums) and associated metadata to purchasers and resellers; use and authorize others to license the Use of and sale of Your Authorized Content in connection with all manner of phone services, including downloads to cell phones and for Use as ringtones and ring back tones; "Stream" and authorize others to "stream" Your Authorized Content, either on-demand or as part of an internet radio service.',
      'You hereby submit Your content and grant to Us a worldwide license to allow Us use, reproduce, and distribute Your content and any derivative works in connection with our business, including promotional activities and merchandising, and to authorize others to do the same. The license granted to Us is revocable only upon your removal or deletion of the content, or deactivation of Your account.',
      'You hereby grant and appoint us, during the Term of this Agreement, as your sole and exclusive administrator for musical compositions and works that you own or control and have not been previously assigned to a third-party publisher. This includes, without limitation, the right to collect all income derived from your publishing rights, including mechanical, public performance, and synchronization royalties, from all sources worldwide. After the term ends, We have a 12-month post-term collection period to collect any income earned during the term but not yet paid.',
      'You hereby authorize Us to manage the right in Your music through YouTube\'s Content ID system — which includes the right to upload Your audio to YouTube\'s system, scan for videos that contain Your song and place ads on videos that use Your song, and promote and license your music within our own integrated MCN network, including granting whitelisting permissions to channels within our network.',
    ],
  },
  {
    id: 'term',
    title: 'Term',
    content: [
      'The Term of this Agreement will commence on the day You first use our Services/platform and will continue, unless and until terminated by either You or Us. We have the sole right to terminate these Terms, Your account, and your access to the Services at any time without prior notice.',
      'We also have the right to terminate this Agreement immediately if We determine that Your account or content is found to be causing, or is likely to cause, material harm or detriment to Our commercial interests, You are engaging in fraudulent, illegal, or materially deceptive activity, or threatening and unprofessional activities damaging to Our reputation or business relationships.',
    ],
  },
  {
    id: 'content-policy',
    title: 'Content Policy and Subscription',
    content: [
      'User acknowledges and agrees that all Content uploaded, posted, or otherwise made available on DWAD MUSIC Digital Platform is subject to Our review and performance standards. In the event that any such content, in the Company\'s reasonable and good faith judgment, fails to meet commercially viable performance metrics or presents an unviable commercial return, the Company may, without liability, remove or disable access to said content immediately and without notice.',
      'Upon subscribing to Our annual premium plan, an automatic renewal process will be implemented to ensure that You maintain access to our premium services without any disruption. At the end of Your annual premium plan, We will automatically charge the credit card that was used for the previous payment. In the event that the automatic payment attempt is unsuccessful, We will deduct the subscription fee directly from the royalties available on Your dashboard. This means that Your account may have a negative balance based on the amount needed for the premium plan renewal.',
      'Where Your accrued revenue/royalties on Your dashboard is insufficient to offset the premium subscription fee, We reserve the right to immediately terminate Your account and remove all associated content from the platform without further notice after a grace period of thirty (30) days.',
      'To provide transparency, We will endeavor to send a notice one (1) week prior to the expiration of your premium plan. Our failure to send or your failure to receive this notice shall not relieve you of your obligation to renew or of any other obligations under these terms, nor shall it result in any liability to us. You remain solely responsible for managing your account and ensuring timely renewal.',
    ],
  },
  {
    id: 'royalties',
    title: 'Royalties and Accounting',
    content: [
      'For content resold through our distribution partner, We will pay You an amount equal to Seventy percent (70%) of the net profit price that We receive from them for the sale or other licensed Uses of Your Digital Masters. Withdrawals can only be made when an Artiste has reached the minimum threshold of $100.',
      'Withholding royalties ("escrow") for blocked accounts: We may block and withhold revenues in Your account that are received in connection with content that We believe, in our sole discretion, violates the Terms of Service or the agreements We have with Digital Service Providers (DSPs). The money is kept in escrow for a timeframe of 24 months or until a claim is received.',
      'The royalties will be held in escrow in order to be able to respond in the following situations: (i) An End User proves his/her account is not fraudulent, and therefore, royalties will be made available to the End User. (ii) We receive claims from DSPs asking for a refund of the royalties in case any DSPs deem it was generated through unauthorized or fraudulent activity. (iii) We receive claims from legitimate rights holders, claiming the payout of the royalties that have been retained, plus royalties that already have been paid to End Users with claimed unauthorized or fraudulent activity.',
      'You may, but not more than once a year and at Your own expense, examine those records. All such examinations will be in accordance with GAAP procedures and regulations in accounting. Any and all objections to a statement must be delivered to us in writing, with specific reasons, within one (1) year after the date the statement was issued. After this period, each statement shall become conclusively binding upon you.',
    ],
  },
  {
    id: 'withdrawal',
    title: 'Right to Withdraw Material',
    content: [
      'You have the right to withdraw Your permission for the sale or other Uses of Your Authorized Content and Authorized Artwork, upon written notice to Us ("Withdrawal"). Within Five (5) business days following our receipt of Your notice of Withdrawal, We will advise our partners that they are no longer authorized to offer the sale or other Use of Your Authorized Content or Authorized Artwork.',
      'Sending of Your notice of Withdrawal will not limit Your responsibility for sales and other Uses of Your Authorized Content and/or Authorized Artwork that occurred prior to the implementation of such Withdrawal and will not limit in any way the rights of end Users who have acquired Your Authorized Content or Authorized Artwork. We will not be responsible for any delays of our Partners in removing Your Authorized Content and Authorized Artwork.',
    ],
  },
  {
    id: 'takedown',
    title: 'Takedown',
    content: [
      'Content takedown attracts a charge of five pounds (5 GBP) per release. If an artist owes us in subscription or royalties, he or she will not be able to process a takedown until all debts are cleared.',
    ],
  },
  {
    id: 'names',
    title: 'Names and Likenesses for Promotional Use',
    content: [
      'You hereby grant to Us, during the Term, the right to Use and to authorize our partners to Use the names and approved likenesses of, and biographical material concerning any Artistes, bands, producers and/or songwriters, as well as track and/or album name, and Authorized Artwork, in any marketing materials for the sale, promotion and advertising of the applicable Digital Master.',
      'You hereby authorize Us to register all Your releases for our YouTube sound recording service (Content ID). This would enable Us to collect all royalties on Your behalf from any visual content on YouTube that contains releases that were distributed by You through DWAD MUSIC.',
      'You hereby authorize Us to deliver Your release to all of our current retail partners with no exception under any circumstance. You also authorize Us to deliver Your release(s) to our future partners automatically with no exception under any circumstance.',
    ],
  },
  {
    id: 'ownership',
    title: 'Ownership',
    content: [
      'We maintain full ownership, rights, and interests in the Services, including all related intellectual property rights. Any rights pertaining to the Services that are not explicitly granted in this agreement are fully reserved. All trademarks, logos, and service marks ("Marks") presented within the Services are owned by DWAD MUSIC or their respective third-party proprietors.',
      'You hold all rights, titles, and interests in your authorized content, approved artwork, digital masters, clips, all copyrights and relevant rights associated with them, and any additional materials You provide to Us.',
    ],
  },
  {
    id: 'indemnification',
    title: 'Indemnification & Refund Policy',
    content: [
      'You hereby indemnify, save, and hold Us harmless from any and all damages, liabilities, costs, losses and expenses (including, but not limited to, legal costs and attorneys\' fees) arising out of or connected with any claim, demand, or action which is inconsistent with any of the warranties, representations, covenants or agreements made by You in this Agreement, including, but not limited to, Your representations and warranties regarding copyrights or any other rights in and to any other forms of intellectual property.',
      'Pending the determination of any claim, demand, or action, We may, at our election, withhold payment of any monies otherwise payable to You hereunder in an amount which does not exceed Your potential liability to Us pursuant to this paragraph.',
      'Refund Policy: We can only issue a refund of any annual paid plan if You haven\'t distributed any release and this can only be within the first 30 days of Your subscription. We won\'t issue any refund if You have distributed at least one song for an Artiste or after 30 days of You joining the subscription plan. There\'s no refund policy for monthly premium subscriptions.',
    ],
  },
  {
    id: 'warranties',
    title: 'Representations and Warranties',
    content: [
      'You represent and warrant that You have the full authority to act on behalf of any and all owners of any right, title or interest in and to Your Authorized Content or Authorized Artwork, or metadata. You warrant and represent that if You are under the age of 18 that You have Your parent\'s and/or legal guardian\'s written consent to enter into these Terms.',
      'You represent and warrant that You own or control the necessary rights in order to make the grant of rights, licenses and permissions herein, and that the exercise of such rights, licenses and permissions by Us and our Licensees shall not violate or infringe the rights of any third party.',
      'You represent and warrant that You will not act in any manner which conflicts or interferes with any of Our existing commitment or obligation and that no agreement previously entered into by You will interfere with the performance of our obligations under this Agreement.',
      'We make no guarantees whatsoever about there being any minimum sales or Uses of any Digital Master. Both Free & Paid plan Users have access to our playlist pitching service; We still reserve the sole right to decide which song could be pitched or not as this is an editorial decision from and by Us. Hence — You cannot impose on Us to compulsorily pitch a track for play listing.',
    ],
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer and Limitations',
    content: [
      'We do not represent or warrant that the site, services, or its Use will be uninterrupted, will be free of inaccuracies or errors, will meet Your requirements, or will operate in the configuration or with the hardware or software that You Use. We make no warranties other than those made expressly in this agreement and hereby disclaim any and all implied warranties, including, without limitation, warranties of fitness for a particular purpose, and non-infringement.',
      'We will not be liable to You or any third party for any consequential, incidental, indirect, punitive, or special damages (including damages relating to lost profits, lost data or loss of goodwill) arising out of, relating to, or connected with the Use of the DWAD MUSIC service, based on any cause of action, even if advised of the possibility of such damages.',
      'We shall not be held liable for damages, delays, or failures in performance when such occurrences result from events beyond reasonable control. These events include, but are not limited to: fire, lightning, explosions, power surges or failures, water damage, acts of God, war, revolution, civil unrest, acts of civil or military authorities, or public enemies. If such act shall make performance of this Agreement impossible for more than three months, this agreement shall be treated as frustrated and terminated at that date.',
    ],
  },
  {
    id: 'consequences',
    title: 'Intellectual Property, Copyright Infringement & Consequences of Misrepresentation',
    content: [
      'We solely and exclusively own all intellectual property and other right, title and interest in and to Our Site. We respect the intellectual property of others and take the protection of copyrights and all other intellectual property very seriously. Infringing activity will not be tolerated on or through the Site or Services.',
      'We will promptly remove or disable materials from Our Site that We believe in good faith, following its receipt of notice, that the materials or content uploaded infringe a third party\'s rights. We will attempt to forward the written notification, including the complainant\'s contact information, to the User who posted the content.',
      'Where Content provided by You is determined to constitute an infringement of intellectual property rights, a fee/charge of 10 GBP shall be imposed for each established claim of infringement. We will initiate takedowns of suspicious content for blocked accounts and all content that is involved in fraudulent issues. Any content that is taken down due to an infringement report from any DSP shall attract a Takedown fee/charge of 10 GBP.',
      'Consequences of fraudulent activities — If We deem that You and/or Your end User is in breach of the Terms of service, We will have the right to: (i) Takedown Content, (ii) Withhold Royalties and place them in escrow, (iii) Disable distribution to DSPs, and (iv) Terminate Your account.',
      'Should Your actions or those of Your end users be found to cause any fraudulent or infringing activity, We reserve the right to terminate our agreement and close your account immediately. We may also deduct any costs we incur as a result, including legal fees, from any future payments owed to you. If these costs exceed your withheld earnings, We may pursue additional legal action.',
      'Where we have detected potential infringing or unauthorized activity, Your account will be blocked preventively while information from You will be required. When You provide the requested information within 2 working days, and the information can be verified, the account will be unblocked. We may request You to: (i) fully fix Your information; (ii) send Us a copy of an identification document (passport or national ID); (iii) provide Your profile, Website URL(s), social media handles — your profile must have historical data to support the sales data.',
      'In the case where You cannot or refuse to provide the requested information within 2 working days, We may block and withhold revenues in Your account. Royalties will be held in an escrow account for a period of up to twenty-four (24) months, in accordance with the contractual rights of Digital Service Providers (DSPs) to reclaim royalties within that same timeframe.',
      'To report a copyright infringement, send a written notice to contact@dwadmusic.com. Your notice must contain: (i) your signature; (ii) a description of your copyrighted work; (iii) a description of the infringing material and its location on our platform; (iv) your contact information; (v) a statement that you have a good-faith belief that the use of the material is not authorized; (vi) a statement, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on their behalf.',
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Dispute Resolution',
    content: [
      'This Agreement, and any disputes, claims, or controversies arising from or related to it, shall be governed by and construed in accordance with the laws of the Republic of Ghana without giving effect to any principles of conflicts of law.',
      'If any dispute, difference, or controversy arises out of or in relation or connection to this Agreement, the parties shall attempt to resolve and settle such amicably by negotiations between themselves. If the dispute cannot be resolved by negotiation within Thirty (30) days, the dispute shall be referred to arbitration in accordance with the Ghana Alternative Dispute Resolution Act, 2010 (Act 798). The place of arbitration shall be Accra, Ghana, and the language of the arbitration shall be English. The decision of the arbitrator shall be final and binding on both parties.',
      'All claims must be submitted exclusively to individual (non-class action) binding arbitration. All disputes shall be arbitrated or litigated solely on an individual basis. Any claim must be brought within one (1) year after the cause of action arises, after which time such claim shall be permanently barred.',
    ],
  },
  {
    id: 'survival',
    title: 'Survival and Severability',
    content: [
      'The expiration or termination of the Term will not relieve You from Your obligations incurred prior to or during the Term. Accordingly, applicable provisions of this Agreement will continue to apply even after the expiration of the Term.',
      'If any provision of this Agreement is determined by a court of competent jurisdiction to be unenforceable, such determination shall not affect any other provision hereof, and the unenforceable provision shall be replaced by an enforceable provision that most closely meets the commercial intent of the parties.',
    ],
  },
  {
    id: 'general',
    title: 'General Provisions / Miscellaneous',
    content: [
      'This Agreement shall not be deemed to create a partnership or joint venture, and neither You nor Us is the other\'s agent, partner, or employee.',
      'A waiver by either party of any term or condition of this Agreement will not be deemed or construed as a waiver of such term or condition, or of any subsequent breach thereof. By using Our Platform, you waive any and all claims for damages or losses that may arise from the termination of Your account.',
      'Any notice, approval, request, authorization, direction or other communication under this Agreement shall be given in writing and shall be deemed to have been delivered and given for all purposes on the delivery date if sent by electronic mail to the addresses provided to and by You upon registration on Our Website or as properly updated.',
      'This Agreement contains the entire understanding of the parties relating to the subject matter hereof. This Agreement supersedes all previous agreements or arrangements between Us pertaining to the digital distribution of content, provided that if You previously entered into a digital distribution agreement with Us in the past, and elected any options, those options will remain in place under this Agreement.',
    ],
  },
];

const splitSheets = [
  {
    id: 'master',
    num: '01',
    title: 'Master Split Sheet',
    desc: 'Sign a split sheet for Masters royalty sharing for Artists and Music Producers.',
    detail: 'Defines ownership percentages of the master recording — the actual sound file — between all contributing parties. Required before distribution.',
    href: 'https://forms.gle/XhaeQrP9Yw4S5wex7',
  },
  {
    id: 'publishing',
    num: '02',
    title: 'Publishing Split Sheet',
    desc: 'Sign a split sheet for Publishing royalty sharing for Artists and Music Producers.',
    detail: 'Defines ownership percentages of the underlying composition — melody and lyrics — between all songwriters and producers. Required for publishing registration.',
    href: 'https://forms.gle/VhJ6Xi3euVaC1oyc6',
  },
];

export default function LegalPage() {
  return (
    <div className="page-enter">

      {/* ── HEADER ── */}
      <section
        className="border-b pt-32 pb-14 px-5 sm:pt-[180px] sm:pb-20 sm:px-14"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <div className="max-w-[1440px] mx-auto">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '24px',
            }}
          >
            ✦ Dwad Music Legal Department
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(48px, 7vw, 120px)',
              lineHeight: 0.94,
              letterSpacing: '-0.02em',
              maxWidth: '16ch',
            }}
          >
            Legal{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
              Agreements.
            </span>
          </h1>
          <p
            className="mt-8"
            style={{
              fontSize: '17px',
              lineHeight: 1.55,
              color: 'var(--color-ink-2)',
              fontWeight: 300,
              maxWidth: '580px',
            }}
          >
            By using DWAD MUSIC services, you enter into a legally binding agreement. Please read our full Terms of Service and Distribution Agreement carefully before submitting your music.
          </p>
        </div>
      </section>

      {/* ── DISTRIBUTION AGREEMENT ── */}
      <section id="distribution" className="py-16 sm:py-[100px] px-5 sm:px-14 border-b" style={{ borderColor: 'var(--color-line)' }}>
        <div className="max-w-[1440px] mx-auto">

          {/* Section label */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '32px',
            }}
          >
            ✦ Distribution Agreement
          </div>

          {/* Title + intro */}
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(32px, 4vw, 64px)',
              lineHeight: 1.0,
              letterSpacing: '-0.015em',
              marginBottom: '32px',
              maxWidth: '22ch',
            }}
          >
            Terms of Service &{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
              Artiste Distribution Agreement
            </span>
          </h2>

          {/* Preamble */}
          <div
            className="mb-12 border-l-2 pl-6"
            style={{ borderColor: 'var(--color-gold)' }}
          >
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '800px' }}>
              Welcome to DWAD MUSIC! This TERMS OF SERVICE AND ARTISTE DISTRIBUTION AGREEMENT ("Agreement") is a legally binding contract between DWAD MUSIC, along with its Licensors, Affiliates and Content Providers (collectively referred to as "DWAD MUSIC," "We," "Us," "Our"), and You including individuals, or the authorized representatives (collectively referred to as "You," "User" or "Your"). BY ACCESSING AND USING THE SERVICES, YOU CONFIRM THAT YOU HAVE READ, UNDERSTOOD, AND AGREED TO THESE TERMS. IF YOU DO NOT ACCEPT THIS AGREEMENT IN ITS ENTIRETY, PLEASE DO NOT USE THE SERVICES.
            </p>
          </div>

          {/* Table of contents */}
          <div
            className="mb-16 border p-8"
            style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg-2)' }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                marginBottom: '20px',
              }}
            >
              Contents
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {agreementSections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#section-${s.id}`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    color: 'var(--color-ink-2)',
                    textDecoration: 'none',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'baseline',
                    padding: '4px 0',
                  }}
                  className="hover:text-gold transition-colors"
                >
                  <span style={{ color: 'var(--color-muted)', minWidth: '24px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Agreement sections */}
          <div className="flex flex-col gap-14">
            {agreementSections.map((section, i) => (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className="border-t pt-10"
                style={{ borderColor: 'var(--color-line)' }}
              >
                <div className="flex items-start gap-6 mb-6">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-muted)',
                      minWidth: '32px',
                      paddingTop: '4px',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 400,
                      fontSize: 'clamp(22px, 2.5vw, 32px)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {section.title}
                  </h3>
                </div>
                <div className="flex flex-col gap-4 pl-0 sm:pl-14">
                  {section.content.map((para, j) => (
                    <p
                      key={j}
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.8,
                        color: 'var(--color-ink-2)',
                        fontWeight: 300,
                        maxWidth: '800px',
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Effective date note */}
          <div
            className="mt-16 border-t pt-8"
            style={{ borderColor: 'var(--color-line)' }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: 'var(--color-muted)',
                textTransform: 'uppercase',
              }}
            >
              This agreement is effective upon first use of DWAD MUSIC services. For questions, contact{' '}
              <a href="mailto:contact@dwadmusic.com" style={{ color: 'var(--color-gold)' }}>
                contact@dwadmusic.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── SPLIT SHEETS ── */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14 border-b" style={{ borderColor: 'var(--color-line)' }}>
        <div className="max-w-[1440px] mx-auto">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '32px',
            }}
          >
            ✦ Split Sheet Agreements
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(32px, 4vw, 64px)',
              lineHeight: 1.0,
              letterSpacing: '-0.015em',
              marginBottom: '16px',
              maxWidth: '16ch',
            }}
          >
            Ownership{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
              Splits.
            </span>
          </h2>
          <p
            className="mb-14"
            style={{
              fontSize: '16px',
              lineHeight: 1.55,
              color: 'var(--color-ink-2)',
              fontWeight: 300,
              maxWidth: '520px',
            }}
          >
            Before your music is distributed or registered, all contributing parties must agree on ownership splits.
          </p>
          <div className="grid gap-6 grid-cols-1 min-[820px]:grid-cols-2">
            {splitSheets.map(doc => (
              <div
                key={doc.id}
                className="border flex flex-col"
                style={{
                  padding: 'clamp(32px, 4vw, 60px)',
                  borderColor: 'var(--color-line)',
                  background: 'var(--color-bg-2)',
                  minHeight: '360px',
                }}
              >
                <div className="flex items-center justify-between mb-10">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--color-gold)',
                    }}
                  >
                    {doc.num}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)',
                    }}
                  >
                    Legal Document
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 400,
                    fontSize: 'clamp(32px, 3.5vw, 56px)',
                    lineHeight: 1,
                    letterSpacing: '-0.015em',
                  }}
                >
                  {doc.title.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
                    {doc.title.split(' ').slice(-1)[0]}
                  </span>
                </h3>
                <p
                  className="mt-5 flex-1"
                  style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300 }}
                >
                  {doc.desc}
                </p>
                <p
                  className="mt-4"
                  style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-muted)', fontStyle: 'italic' }}
                >
                  {doc.detail}
                </p>
                <div className="mt-10">
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-gold-2"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      padding: '16px 28px',
                      background: 'var(--color-gold)',
                      color: 'var(--color-bg)',
                    }}
                  >
                    Sign Agreement<Arrow />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTICE ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="border-l-2 pl-6"
            style={{ borderColor: 'var(--color-gold)' }}
          >
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--color-muted)', fontStyle: 'italic', maxWidth: '680px' }}>
              All agreements are legally binding documents. Ensure all contributing parties review and agree to the stated terms before signing. Dwad Music acts as administrator and distributor under the terms outlined above.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        className="py-12 sm:py-20 px-5 sm:px-14 border-t"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <div className="max-w-[1440px] mx-auto flex flex-col min-[600px]:flex-row items-start min-[600px]:items-center justify-between gap-6">
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '10px',
              }}
            >
              ✦ Questions
            </div>
            <p style={{ fontSize: '17px', color: 'var(--color-ink-2)', fontWeight: 300 }}>
              Need help with an agreement or have a legal query?
            </p>
          </div>
          <a
            href="mailto:Contact@Dwadmusic.com"
            className="inline-flex items-center gap-3 transition-colors duration-250 hover:text-gold shrink-0"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.15em',
              color: 'var(--color-ink)',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Contact@Dwadmusic.com<Arrow />
          </a>
        </div>
      </section>

    </div>
  );
}
