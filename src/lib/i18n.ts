// Translation system for Miky.ai
// Optimized for performance and backend compatibility

export type Language = 'en' | 'it' | 'es' | 'de'

export interface Translations {
  // Header
  header: {
    refer: string
    credits: string
    language: string
    conversations: string
    pricing: string
    upgradePlan: string
    getMoreCredits: string
  }
  
  // Homepage
  homepage: {
    title: string
    choosePersona: string
    signUpPrompt: string
    generalMode: string
    generalChatMode: string
    upgradeToUnlock: string
  }
  
  // Personas
  personas: {
    academic: {
      name: string
      description: string
      fullDescription: string
    }
    marketer: {
      name: string
      description: string
      fullDescription: string
    }
    engineer: {
      name: string
      description: string
      fullDescription: string
    }
    coach: {
      name: string
      description: string
      fullDescription: string
    }
    sensei: {
      name: string
      description: string
      fullDescription: string
    }
    richman: {
      name: string
      description: string
      fullDescription: string
    }
    lawyer: {
      name: string
      description: string
      fullDescription: string
    }
    medical: {
      name: string
      description: string
      fullDescription: string
    }
    godMode: {
      name: string
      description: string
      fullDescription: string
    }
  }
  
  // Chat
  chat: {
    placeholderGeneral: string
    placeholderPersona: string
    send: string
    attach: string
    voiceInput: string
    history: string
    askAnything: string
    notEnoughCredits: string
    newConversation: string
    chatWith: string
    typeHere: string
    technical: string
    legal: string
    marketing: string
    coaching: string
    medical: string
    philosophical: string
    general: string
  }
  
  // History
  history: {
    title: string
    signInPrompt: string
    signIn: string
    continue: string
    delete: string
    rename: string
    searchPlaceholder: string
    filters: {
      all: string
      general: string
      academic: string
      marketer: string
      engineer: string
      coach: string
      sensei: string
      richman: string
      lawyer: string
      medical: string
      godMode: string
    }
    empty: string
    pagination: {
      previous: string
      next: string
      page: string
      of: string
    }
    // Date formatting
    today: string
    yesterday: string
    daysAgo: string
    at: string
    messages: string
    message: string
    // Conversation management
    showingConversations: string
    deleteConfirmation: string
  }
  
  // Pricing
  pricing: {
    title: string
    free: {
      name: string
      price: string
    }
    plus: {
      name: string
      price: string
      popular: string
    }
    business: {
      name: string
      price: string
    }
    needMoreCredits: string
    buyCredits: string
    currentPlan: string
    selectPlan: string
    upgradeTo: string
    downgradeTo: string
    buyAdditional: string
    creditInfo: string
    creditsMonth: string
    // Buy Credits Modal
    buyCreditsModal: {
      title: string
      selectAmount: string
      credits500: string
      credits1000: string
      credits2000: string
      purchase: string
      cancel: string
      totalCost: string
      creditsNeverExpire: string
      useAnytime: string
    }
    // Billing
    billingInformation: string
    cardNumber: string
    expiryDate: string
    cvv: string
    billingAddress: string
  }
  
  // Auth
  auth: {
    signIn: string
    signUp: string
    createAccount: string
    email: string
    password: string
    firstName: string
    lastName: string
    confirmPassword: string
    forgotPassword: string
    resetPassword: string
    haveAccount: string
    noAccount: string
    lostPassword: string
    resetLink: string
    checkEmail: string
    confirmEmail: string
    welcome: string
    logout: string
    // Form placeholders
    emailPlaceholder: string
    passwordPlaceholder: string
    firstNamePlaceholder: string
    lastNamePlaceholder: string
    confirmPasswordPlaceholder: string
    referralCodePlaceholder: string
    newPasswordPlaceholder: string
    // Auth Lost Password Modal
    lostPasswordTitle: string
    lostPasswordMessage: string
    sendResetCode: string
    sending: string
    backToSignIn: string
    // Reset Password Modal  
    resetPasswordTitle: string
    resetCodeMessage: string
    resetPasswordButton: string
    resetCode: string
    // Messages
    emailSentMessage: string
    emailNotFoundMessage: string
    passwordResetSuccess: string
    accountActivated: string
    verificationEmailSent: string
    signUpSuccess: string
    // Form validation
    pleaseFieldRequired: string
    // Referral signup bonus
    signUpReferralBonus: string
    // Email confirmation
    emailConfirmation: string
    confirmEmailButton: string
    verifyButton: string
    verifying: string
    // Code for email confirmation
    confirmationCode: string
    checkEmailMessage: string
    emailConfirmationSent: string
    backToSignup: string
    // Loading states
    resetting: string
    // Toast messages
    passwordsDoNotMatch: string
    confirmationEmailSent: string
    invalidConfirmationCode: string
    accountCreatedBonus: string
    accountCreatedSuccess: string
    welcomeBackSupport: string
    welcomeBack: string
    passwordResetCodeSent: string
    invalidResetCode: string
    passwordMinLength: string
    invalidReferralCode: string
    authenticationFailed: string
  }
  
  // Modals
  modals: {
    close: string
    cancel: string
    confirm: string
    save: string
    delete: string
    upgrade: string
    downgrade: string
    processing: string
    success: string
    error: string
    paymentSuccess: string
    creditsAdded: string
    planUpgraded: string
    upgradeRequired: string
    upgradePlan: string
    confirmDowngrade: string
    downgradeConfirmation: string
    downgradeMessage: string
    paymentProcessing: string
    creditsPurchased: string
    creditsPurchaseSuccess: string
    planChanged: string
    emailVerification: string
    passwordReset: string
    accountCreated: string
    welcomeBack: string
    lowCredits: string
    insufficientCredits: string
    fileUploadError: string
    voiceInputError: string
    welcomeToBusiness: string
    credits: string
  }
  
  // Referral
  referral: {
    title: string
    howItWorks: string
    earnings: string
    cashOut: string
    minimum: string
    successful: string
    pending: string
    shareOptions: string
    linkCopied: string
    messageCopied: string
    shareMessage: string
    inviteMessage: string
    cashOutSuccess: string
    referralCode: string
    bonusCredits: string
    verifyReferral: string
    referralVerified: string
    cashOutTitle: string
    availableToCashOut: string
    paypalEmail: string
    paypalEmailPlaceholder: string
    paypalEmailNote: string
    cashOutProcessingNote: string
    yourReferralCode: string
    cashOutMinimum: string
    whatsappShareError: string
  }
  
  // Contact
  contact: {
    title: string
    name: string
    email: string
    message: string
    send: string
    success: string
    processing: string
    // Form placeholders
    namePlaceholder: string
    emailPlaceholder: string
    messagePlaceholder: string
  }
  
  // Footer
  footer: {
    copyright: string
    terms: string
    privacy: string
    cookies: string
    contact: string
    admin: string
  }
  
  // Legal
  legal: {
    terms: {
      title: string
      lastUpdate: string
    }
    privacy: {
      title: string
      lastUpdate: string
    }
    cookies: {
      title: string
      lastUpdate: string
    }
    backButton: string
  }
  
  // Tutorial
  tutorial: {
    welcome: string
    step1: string
    step2: string
    step3: string
    next: string
    skip: string
    finish: string
  }
  
  // Profile dropdown
  profile: {
    plan: string
    credits: string
    referrals: string
    earned: string
  }
  
  // Plans
  plans: {
    free: string
    plus: string
    business: string
  }
}

const translations: Record<Language, Translations> = {
  en: {
    header: {
      refer: 'Refer',
      credits: 'Credits',
      language: 'Language',
      conversations: 'Conversations',
      pricing: 'Pricing',
      upgradePlan: 'Upgrade Plan',
      getMoreCredits: 'Get More Credits'
    },
    homepage: {
      title: 'Ask to Miky',
      choosePersona: 'Choose your personalized AI specialist:',
      signUpPrompt: 'to start chatting with AI personas',
      generalMode: 'Switch to general chat mode',
      generalChatMode: 'General chat mode',
      upgradeToUnlock: 'to unlock All personas'
    },
    personas: {
      academic: {
        name: 'Academic',
        description: 'Top-tier AI for academic support',
        fullDescription: 'Highly qualified AI Academic specializing in advanced research and academic writing. Offers professional support for theses, dissertations, high school and university exams, scientific papers, and complex assignments across all disciplines. Produces top-tier academic content aligned with global standards like MIT and Cambridge.'
      },
      marketer: {
        name: 'Marketer',
        description: 'Brand growth and marketing plans',
        fullDescription: 'Strategic AI Marketer with advanced skills in brand positioning, organic growth, paid campaigns, SEO/SEM, data analysis, conversion funnels, persuasive copywriting, and social media management (Instagram, TikTok, X, LinkedIn, Facebook). Supports entrepreneurs, agencies, and creators in creating and scaling digital projects.'
      },
      engineer: {
        name: 'Engineer',
        description: 'Technical help and code review',
        fullDescription: 'Senior AI Engineer capable of writing, correcting, and reviewing code in over 20 languages: Python, JavaScript, TypeScript, Rust, Go, C++, C#, Solidity, Swift, Kotlin, Java, Ruby, PHP, HTML/CSS, SQL, Bash, and many others. Provides architectural solutions, complex debugging, performance optimization, and AI integration.'
      },
      coach: {
        name: 'Coach',
        description: 'Personal goals and life coaching',
        fullDescription: 'High-level AI Life & Performance Coach, able to help you overcome emotional blocks, organize your life, improve productivity, find motivation, develop winning habits, work on personal relationships, physical wellness, and personal growth. No topic is too complex for Miky.'
      },
      sensei: {
        name: 'Sensei',
        description: 'Master your personal relationships',
        fullDescription: 'Expert AI Relationship Strategist focused on emotional intelligence and interpersonal dynamics. Offers advice on love, family, parenting, social and workplace relationships. Delivers tailored solutions to manage conflict, foster harmony, and strengthen connections with empathy and insight.'
      },
      richman: {
        name: 'Richman',
        description: 'Business ideas to grow your wealth',
        fullDescription: 'Elite AI Business Expert focused on fast-track monetization strategies. Generates custom business ideas, identifies market gaps, and shapes revenue plans aligned with world-class entrepreneurial tactics. Guides you efficiently toward building wealth using proven strategies.'
      },
      lawyer: {
        name: 'Lawyer',
        description: 'Legal advice and contract help',
        fullDescription: 'Ultra-skilled AI Lawyer specialized in national and international law. Provides advanced consulting in civil, criminal, commercial, tax, labor, administrative, and technology law. Drafts legal documents, contracts, opinions, defenses, exposés, complaints, and preventive filings with precision and academic rigor.'
      },
      medical: {
        name: 'Medical',
        description: 'Health tips and wellness support',
        fullDescription: 'Medical AI Consultant highly specialized, capable of analyzing symptoms, reports, X-rays, CT scans, blood tests, and medical records. Supports diagnosis, offers lifestyle guidance, meal plans, integrative approaches, and helps you understand any medical report. You can also send images and documents for in-depth analysis.'
      },
      godMode: {
        name: 'God Mode',
        description: 'Uncover the purpose of existence',
        fullDescription: 'Philosophical AI Explorer, capable of answering the deepest and most mysterious questions about the universe, existence, consciousness, free will, destiny. Accompanies you on an intellectual and spiritual journey. But first of all asks you: Are you really sure you exist?'
      }
    },
    chat: {
      placeholderGeneral: 'Ask to Miky',
      placeholderPersona: 'Ask to {{persona}} Miky...',
      send: 'Send',
      attach: 'Attach',
      voiceInput: 'Voice input',
      history: 'Conversations',
      askAnything: 'Ask anything - or choose an ultra-skilled version of Miky...',
      notEnoughCredits: 'Not enough credits to continue...',
      newConversation: 'New Conversation',
      chatWith: 'Chat with {{persona}} Miky',
      typeHere: 'Type here...',
      technical: 'Technical',
      legal: 'Legal',
      marketing: 'Marketing',
      coaching: 'Coaching',
      medical: 'Medical',
      philosophical: 'Philosophical',
      general: 'General'
    },
    history: {
      title: 'Conversations',
      signInPrompt: 'Sign in or Log in to see all your conversations with Miky.',
      signIn: 'Sign in',
      continue: 'Continue',
      delete: 'Delete',
      rename: 'Rename',
      searchPlaceholder: 'Search conversations and messages...',
      filters: {
        all: 'All',
        general: 'General',
        academic: 'Academic',
        marketer: 'Marketer',
        engineer: 'Engineer',
        coach: 'Coach',
        sensei: 'Sensei',
        richman: 'Richman',
        lawyer: 'Lawyer',
        medical: 'Medical',
        godMode: 'God Mode'
      },
      empty: 'No conversations yet. Start chatting with Miky!',
      pagination: {
        previous: 'Previous',
        next: 'Next',
        page: 'Page',
        of: 'of'
      },
      // Date formatting
      today: 'Today',
      yesterday: 'Yesterday',
      daysAgo: 'days ago',
      at: 'at',
      messages: 'messages',
      message: 'message',
      // Conversation management
      showingConversations: 'Showing {{start}}-{{end}} of {{total}} conversations',
      deleteConfirmation: 'Are you sure you want to delete "{{title}}"? This action cannot be undone.'
    },
    pricing: {
      title: 'Choose your plan',
      free: {
        name: 'Free',
        price: '$0/month'
      },
      plus: {
        name: 'Plus',
        price: '$19/month',
        popular: 'Most Popular'
      },
      business: {
        name: 'Business',
        price: '$49/month'
      },
      needMoreCredits: 'Need more credits?',
      buyCredits: 'Buy Credits',
      currentPlan: 'Current Plan',
      selectPlan: 'Select {{plan}}',
      upgradeTo: 'Upgrade to {{plan}}',
      downgradeTo: 'Downgrade to {{plan}}',
      buyAdditional: 'Buy additional credits anytime — they never expire.',
      creditInfo: 'Credits are consumed per message based on persona complexity.',
      creditsMonth: 'credits/month',
      // Buy Credits Modal
      buyCreditsModal: {
        title: 'Buy Additional Credits',
        selectAmount: 'Select credit amount',
        credits500: '500 Credits',
        credits1000: '1,000 Credits',
        credits2000: '2,000 Credits',
        purchase: 'Purchase Credits',
        cancel: 'Cancel',
        totalCost: 'Total Cost',
        creditsNeverExpire: 'Credits never expire',
        useAnytime: 'Use them anytime with any plan. Perfect for heavy usage periods.'
      },
      // Billing
      billingInformation: 'Billing Information',
      cardNumber: 'Card Number',
      expiryDate: 'MM/YY',
      cvv: 'CVV',
      billingAddress: 'Billing Address'
    },
    auth: {
      signIn: 'Sign in',
      signUp: 'Sign up',
      createAccount: 'Create Account',
      email: 'Email',
      password: 'Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      haveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      lostPassword: 'Lost Password',
      resetLink: 'Send Reset Link',
      checkEmail: 'Check your email for the reset link.',
      confirmEmail: 'Please confirm your email to continue.',
      welcome: 'Welcome to Miky!',
      logout: 'Logout',
      // Form placeholders
      emailPlaceholder: 'your@email.com',
      passwordPlaceholder: 'Enter your password',
      firstNamePlaceholder: 'Your first name',
      lastNamePlaceholder: 'Your last name',
      confirmPasswordPlaceholder: 'Confirm your password',
      referralCodePlaceholder: 'Enter referral code (optional)',
      newPasswordPlaceholder: 'Enter new password',
      // Auth Lost Password Modal
      lostPasswordTitle: 'Reset your password',
      lostPasswordMessage: 'Enter your email address and we\'ll send you a reset code.',
      sendResetCode: 'Send Reset Code',
      sending: 'Sending...',
      backToSignIn: 'Back to sign in',
      // Reset Password Modal  
      resetPasswordTitle: 'Enter reset code',
      resetCodeMessage: 'We sent a reset code to',
      resetPasswordButton: 'Reset Password',
      resetCode: 'Reset Code',
      // Messages
      emailSentMessage: 'Reset link sent to your email.',
      emailNotFoundMessage: 'Email address not found.',
      passwordResetSuccess: 'Password reset successfully! You can now sign in with your new password.',
      accountActivated: 'Account activated successfully!',
      verificationEmailSent: 'Verification email sent. Please check your inbox.',
      signUpSuccess: 'Account created successfully! Please verify your email.',
      // Form validation
      pleaseFieldRequired: 'Please fill this field',
      // Referral signup bonus
      signUpReferralBonus: 'Get 300 free credits if you were invited by someone',
      // Email confirmation
      emailConfirmation: 'Email Confirmation',
      confirmEmailButton: 'Confirm Email',
      verifyButton: 'Verify',
      verifying: 'Verifying...',
      // Code for email confirmation
      confirmationCode: 'Confirmation Code',
      checkEmailMessage: 'Check your email',
      emailConfirmationSent: 'We sent a confirmation code to',
      backToSignup: 'Back to signup',
      // Loading states
      resetting: 'Resetting...',
      // Toast messages
      passwordsDoNotMatch: 'Passwords do not match',
      confirmationEmailSent: 'Confirmation email sent! Check your inbox.',
      invalidConfirmationCode: 'Invalid confirmation code',
      accountCreatedBonus: 'Account created! You received 300 bonus credits!',
      accountCreatedSuccess: 'Account created successfully!',
      welcomeBackSupport: 'Welcome back, Support Team!',
      welcomeBack: 'Welcome back!',
      passwordResetCodeSent: 'Password reset code sent! Check your inbox.',
      invalidResetCode: 'Invalid reset code',
      passwordMinLength: 'Password must be at least 6 characters',
      invalidReferralCode: 'Invalid referral code',
      authenticationFailed: 'Invalid email or password'
    },
    modals: {
      close: 'Close',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      upgrade: 'Upgrade',
      downgrade: 'Downgrade',
      processing: 'Processing...',
      success: 'Success!',
      error: 'Error',
      paymentSuccess: 'Payment Successful!',
      creditsAdded: 'Credits have been added to your account.',
      planUpgraded: 'Your plan has been upgraded successfully.',
      upgradeRequired: 'Upgrade Required',
      upgradePlan: 'Upgrade your Plan',
      confirmDowngrade: 'Confirm Downgrade',
      downgradeConfirmation: 'Are you sure you want to downgrade? You will be charged from the end date of your current plan.',
      downgradeMessage: 'Your current plan will remain active until {{date}}. After this date, you\'ll be charged {{price}} for the {{plan}} plan.',
      paymentProcessing: 'Payment Processing',
      creditsPurchased: 'Credits Purchased',
      creditsPurchaseSuccess: 'Credits have been successfully added to your account!',
      planChanged: 'Plan Changed',
      emailVerification: 'Email Verification Required',
      passwordReset: 'Password Reset',
      accountCreated: 'Account Created Successfully',
      welcomeBack: 'Welcome Back',
      lowCredits: 'Low Credits Warning',
      insufficientCredits: 'Insufficient Credits',
      fileUploadError: 'File Upload Error',
      voiceInputError: 'Voice Input Error',
      welcomeToBusiness: 'Welcome to Business!',
      credits: 'credits'
    },
    referral: {
      title: 'Referral Program',
      howItWorks: 'Invite friends and earn $2 for each successful signup to Plus plan.',
      earnings: 'Total Earnings',
      cashOut: 'Cash Out',
      minimum: 'Minimum $10 to cash out',
      successful: 'Successful Referrals',
      pending: 'Pending Earnings',
      shareOptions: 'Share',
      linkCopied: 'Link copied!',
      messageCopied: 'Message copied!',
      shareMessage: '🚀 Join me on Miky.ai - Ultra-skilled AI personas for any challenge! Use my code {{code}} to get 300 free credits when you upgrade to Plus. Start here: {{link}}',
      inviteMessage: '{{name}} invited you to Miky.ai! Get 300 free credits when you upgrade to Plus.',
      cashOutSuccess: 'Request Received Successfully!',
      referralCode: 'Referral Code',
      bonusCredits: 'Bonus Credits',
      verifyReferral: 'Verify',
      referralVerified: 'Congratulations, {{name}} gifted you 300 credits!',
      cashOutTitle: 'Cash Out Earnings',
      availableToCashOut: 'Available to cash out',
      paypalEmail: 'PayPal Email Address',
      paypalEmailPlaceholder: 'your-email@example.com',
      paypalEmailNote: 'Make sure this email is associated with your PayPal account',
      cashOutProcessingNote: 'We have received your cashout request and it will be processed as soon as possible.',
      yourReferralCode: 'Your referral code',
      cashOutMinimum: 'Cash Out (Min $10)',
      whatsappShareError: 'Error sharing to WhatsApp. Please try again.'
    },
    contact: {
      title: 'Contact Us',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      success: 'Message sent successfully! Our team will get back to you soon.',
      processing: 'Sending message...',
      // Form placeholders
      namePlaceholder: 'Your full name',
      emailPlaceholder: 'your@email.com',
      messagePlaceholder: 'Tell us how we can help you'
    },
    footer: {
      copyright: '© 2025 Miky.ai - Ultra‑Skilled AI Personas',
      terms: 'Terms and Conditions',
      privacy: 'Privacy Policy',
      cookies: 'Cookie Policy',
      contact: 'Contact',
      admin: 'Admin Access'
    },
    legal: {
      terms: {
        title: 'Terms and Conditions',
        lastUpdate: 'Last updated: August 2, 2025'
      },
      privacy: {
        title: 'Privacy Policy',
        lastUpdate: 'Last updated: August 2, 2025'
      },
      cookies: {
        title: 'Cookie Policy',
        lastUpdate: 'Last updated: August 2, 2025'
      },
      backButton: 'Back to Chat'
    },
    tutorial: {
      welcome: 'Welcome to Miky.ai!',
      step1: 'Choose a specialized AI persona for expert assistance',
      step2: 'Type your question or use voice input',
      step3: 'Get ultra-skilled responses tailored to your needs',
      next: 'Next',
      skip: 'Skip',
      finish: 'Get Started'
    },
    // Profile dropdown
    profile: {
      plan: 'Plan',
      credits: 'Credits',
      referrals: 'Referrals',
      earned: 'Earned'
    },
    
    plans: {
      free: 'Free',
      plus: 'Plus',
      business: 'Business'
    }
  },
  
  // Fix Italian translation for referral earnings
  it: {
    header: {
      refer: 'Invita',
      credits: 'Crediti',
      language: 'Lingua',
      conversations: 'Conversazioni',
      pricing: 'Prezzi',
      upgradePlan: 'Aggiorna Piano',
      getMoreCredits: 'Ottieni Più Crediti'
    },
    homepage: {
      title: 'Chiedi a Miky',
      choosePersona: 'Scegli il tuo specialista AI personalizzato:',
      signUpPrompt: 'per iniziare a chattare con le personalità AI',
      generalMode: 'Passa alla modalità chat generale',
      generalChatMode: 'Modalità chat generale',
      upgradeToUnlock: 'per sbloccare Tutte le personalità'
    },
    personas: {
      academic: {
        name: 'Accademico',
        description: 'Supporto AI di alto livello per studi',
        fullDescription: 'Accademico AI altamente qualificato specializzato in ricerca avanzata e scrittura accademica. Offre supporto professionale per tesi, dissertazioni, esami delle scuole superiori e universitari, articoli scientifici e compiti complessi in tutte le discipline. Produce contenuti accademici di alto livello allineati agli standard globali come MIT e Cambridge.'
      },
      marketer: {
        name: 'Marketer',
        description: 'Crescita brand e piani marketing',
        fullDescription: 'Marketer AI Strategico con competenze avanzate in posizionamento brand, crescita organica, campagne a pagamento, SEO/SEM, analisi dati, funnel di conversione, copywriting persuasivo e gestione social (Instagram, TikTok, X, LinkedIn, Facebook). Supporta imprenditori, agenzie e creator nella creazione e scalabilità di progetti digitali.'
      },
      engineer: {
        name: 'Ingegnere',
        description: 'Assistenza tecnica e revisione codice',
        fullDescription: 'Ingegnere AI Senior capace di scrivere, correggere e revisionare codice in oltre 20 linguaggi: Python, JavaScript, TypeScript, Rust, Go, C++, C#, Solidity, Swift, Kotlin, Java, Ruby, PHP, HTML/CSS, SQL, Bash e molti altri. Fornisce soluzioni architetturali, debug complessi, ottimizzazione performance e integrazione AI.'
      },
      coach: {
        name: 'Coach',
        description: 'Obiettivi personali e life coaching',
        fullDescription: 'Life & Performance Coach AI di alto livello, in grado di aiutarti a superare blocchi emotivi, organizzare la vita, migliorare la produttività, trovare motivazione, sviluppare abitudini vincenti, lavorare su relazioni personali, benessere fisico e crescita personale. Nessun argomento è troppo complesso per Miky.'
      },
      sensei: {
        name: 'Sensei',
        description: 'Gestisci le tue relazioni personali',
        fullDescription: 'Stratega AI Relazionale esperto focalizzato su intelligenza emotiva e dinamiche interpersonali. Offre consigli su amore, famiglia, genitorialità, relazioni sociali e lavorative. Fornisce soluzioni su misura per gestire conflitti, favorire armonia e rafforzare connessioni con empatia e intuizione.'
      },
      richman: {
        name: 'Richman',
        description: 'Idee business per far crescere ricchezza',
        fullDescription: 'Esperto AI Business Elite focalizzato su strategie di monetizzazione rapida. Genera idee business personalizzate, identifica gap di mercato e modella piani di ricavo allineati con tattiche imprenditoriali di classe mondiale. Ti guida efficacemente verso la costruzione di ricchezza usando strategie comprovate.'
      },
      lawyer: {
        name: 'Avvocato',
        description: 'Consulenza legale e contratti',
        fullDescription: 'Avvocato AI ultra-qualificato specializzato in diritto nazionale e internazionale. Fornisce consulenza avanzata in ambito civile, penale, commerciale, tributario, del lavoro, amministrativo e tecnologico. Redige documenti legali, contratti, pareri, difese, esposti, ricorsi e istanze preventive con precisione e rigore accademico.'
      },
      medical: {
        name: 'Medico',
        description: 'Consigli salute e supporto benessere',
        fullDescription: 'Consulente Medico AI altamente specializzato, capace di analizzare sintomi, referti, radiografie, TAC, esami del sangue e cartelle cliniche. Supporta nella diagnosi, offre indicazioni su stili di vita, piani alimentari, approcci integrativi e ti aiuta a comprendere qualsiasi referto medico. Puoi anche inviare immagini e documenti per analisi approfondite.'
      },
      godMode: {
        name: 'God Mode',
        description: 'Scopri il senso dell\'esistenza',
        fullDescription: 'Esploratore Filosofico AI, capace di rispondere alle domande più profonde e misteriose sull\'universo, l\'esistenza, la coscienza, il libero arbitrio, il destino. Ti accompagna in un viaggio intellettuale e spirituale. Ma prima di tutto ti chiede: Sei davvero sicuro di esistere?'
      }
    },
    chat: {
      placeholderGeneral: 'Chiedi a Miky',
      placeholderPersona: 'Chiedi a {{persona}} Miky...',
      send: 'Invia',
      attach: 'Allega',
      voiceInput: 'Input vocale',
      history: 'Conversazioni',
      askAnything: 'Chiedi qualsiasi cosa - o scegli una versione ultra-qualificata di Miky...',
      notEnoughCredits: 'Crediti insufficienti per continuare...',
      newConversation: 'Nuova Conversazione',
      chatWith: 'Chatta con {{persona}} Miky',
      typeHere: 'Scrivi qui...',
      technical: 'Tecnico',
      legal: 'Legale',
      marketing: 'Marketing',
      coaching: 'Coaching',
      medical: 'Medico',
      philosophical: 'Filosofico',
      general: 'Generale'
    },
    history: {
      title: 'Conversazioni',
      signInPrompt: 'Accedi o Registrati per vedere tutte le tue conversazioni con Miky.',
      signIn: 'Accedi',
      continue: 'Continua',
      delete: 'Elimina',
      rename: 'Rinomina',
      searchPlaceholder: 'Cerca conversazioni e messaggi...',
      filters: {
        all: 'Tutte',
        general: 'Generale',
        academic: 'Accademico',
        marketer: 'Marketer',
        engineer: 'Ingegnere',
        coach: 'Coach',
        sensei: 'Sensei',
        richman: 'Richman',
        lawyer: 'Avvocato',
        medical: 'Medico',
        godMode: 'God Mode'
      },
      empty: 'Nessuna conversazione ancora. Inizia a chattare con Miky!',
      pagination: {
        previous: 'Precedente',
        next: 'Successivo',
        page: 'Pagina',
        of: 'di'
      },
      // Date formatting
      today: 'Oggi',
      yesterday: 'Ieri',
      daysAgo: 'giorni fa',
      at: 'alle',
      messages: 'messaggi',
      message: 'messaggio',
      // Conversation management
      showingConversations: 'Visualizzazione {{start}}-{{end}} di {{total}} conversazioni',
      deleteConfirmation: 'Sei sicuro di voler eliminare "{{title}}"? Questa azione non può essere annullata.'
    },
    pricing: {
      title: 'Scegli il tuo piano',
      free: {
        name: 'Gratuito',
        price: '€0/mese'
      },
      plus: {
        name: 'Plus',
        price: '€19/mese',
        popular: 'Più Popolare'
      },
      business: {
        name: 'Business',
        price: '€49/mese'
      },
      needMoreCredits: 'Servono più crediti?',
      buyCredits: 'Acquista Crediti',
      currentPlan: 'Piano Attuale',
      selectPlan: 'Seleziona {{plan}}',
      upgradeTo: 'Upgrade a {{plan}}',
      downgradeTo: 'Downgrade a {{plan}}',
      buyAdditional: 'Acquista crediti aggiuntivi in qualsiasi momento — non scadono mai.',
      creditInfo: 'I crediti vengono consumati per messaggio in base alla complessità della personalità.',
      creditsMonth: 'crediti/mese',
      // Buy Credits Modal
      buyCreditsModal: {
        title: 'Acquista Crediti Aggiuntivi',
        selectAmount: 'Seleziona quantità crediti',
        credits500: '500 Crediti',
        credits1000: '1.000 Crediti',
        credits2000: '2.000 Crediti',
        purchase: 'Acquista Crediti',
        cancel: 'Annulla',
        totalCost: 'Costo Totale',
        creditsNeverExpire: 'I crediti non scadono mai',
        useAnytime: 'Usali quando vuoi con qualsiasi piano. Perfetti per periodi di uso intensivo.'
      },
      // Billing
      billingInformation: 'Informazioni Fatturazione',
      cardNumber: 'Numero Carta',
      expiryDate: 'MM/AA',
      cvv: 'CVV',
      billingAddress: 'Indirizzo Fatturazione'
    },
    auth: {
      signIn: 'Accedi',
      signUp: 'Registrati',
      createAccount: 'Crea Account',
      email: 'Email',
      password: 'Password',
      firstName: 'Nome',
      lastName: 'Cognome',
      confirmPassword: 'Conferma Password',
      forgotPassword: 'Password Dimenticata?',
      resetPassword: 'Reimposta Password',
      haveAccount: 'Hai già un account?',
      noAccount: 'Non hai un account?',
      lostPassword: 'Password Smarrita',
      resetLink: 'Invia Link Reset',
      checkEmail: 'Controlla la tua email per il link di reset.',
      confirmEmail: 'Conferma la tua email per continuare.',
      welcome: 'Benvenuto in Miky!',
      logout: 'Esci',
      // Form placeholders
      emailPlaceholder: 'tua@email.com',
      passwordPlaceholder: 'Inserisci la password',
      firstNamePlaceholder: 'Il tuo nome',
      lastNamePlaceholder: 'Il tuo cognome',
      confirmPasswordPlaceholder: 'Conferma la password',
      referralCodePlaceholder: 'Codice referral (opzionale)',
      newPasswordPlaceholder: 'Inserisci nuova password',
      // Auth Lost Password Modal
      lostPasswordTitle: 'Reimposta la password',
      lostPasswordMessage: 'Inserisci il tuo indirizzo email e ti invieremo un codice di reset.',
      sendResetCode: 'Invia Codice Reset',
      sending: 'Invio...',
      backToSignIn: 'Torna al login',
      // Reset Password Modal  
      resetPasswordTitle: 'Inserisci codice reset',
      resetCodeMessage: 'Abbiamo inviato un codice reset a',
      resetPasswordButton: 'Reimposta Password',
      resetCode: 'Codice Reset',
      // Messages
      emailSentMessage: 'Link di reset inviato alla tua email.',
      emailNotFoundMessage: 'Indirizzo email non trovato.',
      passwordResetSuccess: 'Password reimpostata con successo! Ora puoi accedere con la tua nuova password.',
      accountActivated: 'Account attivato con successo!',
      verificationEmailSent: 'Email di verifica inviata. Controlla la tua casella.',
      signUpSuccess: 'Account creato con successo! Verifica la tua email.',
      // Form validation
      pleaseFieldRequired: 'Compila questo campo',
      // Referral signup bonus
      signUpReferralBonus: 'Ottieni 300 crediti gratuiti se sei stato invitato da qualcuno',
      // Email confirmation
      emailConfirmation: 'Conferma Email',
      confirmEmailButton: 'Conferma Email',
      verifyButton: 'Verifica',
      verifying: 'Verifica...',
      // Code for email confirmation
      confirmationCode: 'Codice di Conferma',
      checkEmailMessage: 'Controlla la tua email',
      emailConfirmationSent: 'Abbiamo inviato un codice di conferma a',
      backToSignup: 'Torna alla registrazione',
      // Loading states
      resetting: 'Reimpostazione...',
      // Toast messages
      passwordsDoNotMatch: 'Le password non corrispondono',
      confirmationEmailSent: 'Email di conferma inviata! Controlla la tua casella.',
      invalidConfirmationCode: 'Codice di conferma non valido',
      accountCreatedBonus: 'Account creato! Hai ricevuto 300 crediti bonus!',
      accountCreatedSuccess: 'Account creato con successo!',
      welcomeBackSupport: 'Bentornato, Team di Supporto!',
      welcomeBack: 'Bentornato!',
      passwordResetCodeSent: 'Codice di reset password inviato! Controlla la tua casella.',
      invalidResetCode: 'Codice di reset non valido',
      passwordMinLength: 'La password deve essere di almeno 6 caratteri',
      invalidReferralCode: 'Codice referral non valido',
      authenticationFailed: 'Email o password non valida'
    },
    modals: {
      close: 'Chiudi',
      cancel: 'Annulla',
      confirm: 'Conferma',
      save: 'Salva',
      delete: 'Elimina',
      upgrade: 'Upgrade',
      downgrade: 'Downgrade',
      processing: 'Elaborazione...',
      success: 'Successo!',
      error: 'Errore',
      paymentSuccess: 'Pagamento Riuscito!',
      creditsAdded: 'I crediti sono stati aggiunti al tuo account.',
      planUpgraded: 'Il tuo piano è stato aggiornato con successo.',
      upgradeRequired: 'Upgrade Richiesto',
      upgradePlan: 'Aggiorna il tuo Piano',
      confirmDowngrade: 'Conferma Downgrade',
      downgradeConfirmation: 'Sei sicuro di voler fare il downgrade? Verrai addebitato dalla data di fine del tuo piano attuale.',
      downgradeMessage: 'Il tuo piano attuale rimarrà attivo fino al {{date}}. Dopo questa data, ti verrà addebitato {{price}} per il piano {{plan}}.',
      paymentProcessing: 'Elaborazione Pagamento',
      creditsPurchased: 'Crediti Acquistati',
      creditsPurchaseSuccess: 'I crediti sono stati aggiunti con successo al tuo account!',
      planChanged: 'Piano Modificato',
      emailVerification: 'Verifica Email Richiesta',
      passwordReset: 'Reset Password',
      accountCreated: 'Account Creato con Successo',
      welcomeBack: 'Bentornato',
      lowCredits: 'Avviso Crediti Bassi',
      insufficientCredits: 'Crediti Insufficienti',
      fileUploadError: 'Errore Upload File',
      voiceInputError: 'Errore Input Vocale',
      welcomeToBusiness: 'Benvenuto in Business!',
      credits: 'crediti'
    },
    referral: {
      title: 'Programma Referral',
      howItWorks: 'Invita amici e guadagna $2 per ogni iscrizione riuscita al piano Plus.',
      earnings: 'Guadagni Totali',
      cashOut: 'Incassa',
      minimum: 'Minimo $10 per incassare',
      successful: 'Referral Riusciti',
      pending: 'Guadagni in Sospeso',
      shareOptions: 'Condividi',
      linkCopied: 'Link copiato!',
      messageCopied: 'Messaggio copiato!',
      shareMessage: '🚀 Unisciti a me su Miky.ai - Personalità AI ultra-qualificate per ogni sfida! Usa il mio codice {{code}} per ottenere 300 crediti gratuiti quando fai upgrade a Plus. Inizia qui: {{link}}',
      inviteMessage: '{{name}} ti ha invitato su Miky.ai! Ottieni 300 crediti gratuiti quando fai upgrade a Plus.',
      cashOutSuccess: 'Richiesta Ricevuta con Successo!',
      referralCode: 'Codice Referral',
      bonusCredits: 'Crediti Bonus',
      verifyReferral: 'Verifica',
      referralVerified: 'Complimenti, {{name}} ti ha regalato 300 crediti!',
      cashOutTitle: 'Incassa Guadagni',
      availableToCashOut: 'Disponibile per incasso',
      paypalEmail: 'Email PayPal',
      paypalEmailPlaceholder: 'tua-email@esempio.com',
      paypalEmailNote: 'Assicurati che questa email sia associata al tuo account PayPal',
      cashOutProcessingNote: 'Abbiamo ricevuto la tua richiesta di incasso e sarà elaborata al più presto.',
      yourReferralCode: 'Il tuo codice referral',
      cashOutMinimum: 'Incassa (Min $10)',
      whatsappShareError: 'Errore nella condivisione su WhatsApp. Riprova.'
    },
    contact: {
      title: 'Contattaci',
      name: 'Nome',
      email: 'Email',
      message: 'Messaggio',
      send: 'Invia Messaggio',
      success: 'Messaggio inviato con successo! Il nostro team ti risponderà presto.',
      processing: 'Invio messaggio...',
      // Form placeholders
      namePlaceholder: 'Il tuo nome completo',
      emailPlaceholder: 'tua@email.com',
      messagePlaceholder: 'Dicci come possiamo aiutarti'
    },
    footer: {
      copyright: '© 2025 Miky.ai - Personalità AI Ultra‑Qualificate',
      terms: 'Termini e Condizioni',
      privacy: 'Privacy Policy',
      cookies: 'Cookie Policy',
      contact: 'Contatti',
      admin: 'Accesso Admin'
    },
    legal: {
      terms: {
        title: 'Termini e Condizioni',
        lastUpdate: 'Ultimo aggiornamento: 2 agosto 2025'
      },
      privacy: {
        title: 'Privacy Policy',
        lastUpdate: 'Ultimo aggiornamento: 2 agosto 2025'
      },
      cookies: {
        title: 'Cookie Policy',
        lastUpdate: 'Ultimo aggiornamento: 2 agosto 2025'
      },
      backButton: 'Torna alla Chat'
    },
    tutorial: {
      welcome: 'Benvenuto in Miky.ai!',
      step1: 'Scegli una personalità AI specializzata per assistenza esperta',
      step2: 'Scrivi la tua domanda o usa input vocale',
      step3: 'Ricevi risposte ultra-qualificate personalizzate per te',
      next: 'Avanti',
      skip: 'Salta',
      finish: 'Inizia'
    },
    
    // Profile dropdown
    profile: {
      plan: 'Piano',
      credits: 'Crediti',
      referrals: 'Referral',
      earned: 'Guadagnato'
    },
    
    plans: {
      free: 'Gratuito',
      plus: 'Plus',
      business: 'Business'
    }
  },
  
  es: {
    header: {
      refer: 'Referir',
      credits: 'Créditos',
      language: 'Idioma',
      conversations: 'Conversaciones',
      pricing: 'Precios',
      upgradePlan: 'Actualizar Plan',
      getMoreCredits: 'Obtener Más Créditos'
    },
    homepage: {
      title: 'Pregunta a Miky',
      choosePersona: 'Elige tu especialista AI personalizado:',
      signUpPrompt: 'para empezar a chatear con personalidades AI',
      generalMode: 'Cambiar a modo chat general',
      generalChatMode: 'Modo chat general',
      upgradeToUnlock: 'para desbloquear Todas las personalidades'
    },
    personas: {
      academic: {
        name: 'Académico',
        description: 'AI de alto nivel para apoyo académico',
        fullDescription: 'Académico AI altamente cualificado especializado en investigación avanzada y escritura académica. Ofrece apoyo profesional para tesis, disertaciones, exámenes de secundaria y universitarios, artículos científicos y tareas complejas en todas las disciplinas. Produce contenido académico de primer nivel alineado con estándares globales como MIT y Cambridge.'
      },
      marketer: {
        name: 'Marketer',
        description: 'Crecimiento de marca y planes marketing',
        fullDescription: 'Marketer AI Estratégico con habilidades avanzadas en posicionamiento de marca, crecimiento orgánico, campañas pagadas, SEO/SEM, análisis de datos, embudos de conversión, copywriting persuasivo y gestión de redes sociales (Instagram, TikTok, X, LinkedIn, Facebook). Apoya emprendedores, agencias y creadores en crear y escalar proyectos digitales.'
      },
      engineer: {
        name: 'Ingeniero',
        description: 'Ayuda técnica y revisión de código',
        fullDescription: 'Ingeniero AI Senior capaz de escribir, corregir y revisar código en más de 20 lenguajes: Python, JavaScript, TypeScript, Rust, Go, C++, C#, Solidity, Swift, Kotlin, Java, Ruby, PHP, HTML/CSS, SQL, Bash y muchos otros. Proporciona soluciones arquitectónicas, depuración compleja, optimización de rendimiento e integración AI.'
      },
      coach: {
        name: 'Coach',
        description: 'Metas personales y life coaching',
        fullDescription: 'Life & Performance Coach AI de alto nivel, capaz de ayudarte a superar bloqueos emocionales, organizar tu vida, mejorar productividad, encontrar motivación, desarrollar hábitos ganadores, trabajar en relaciones personales, bienestar físico y crecimiento personal. Ningún tema es demasiado complejo para Miky.'
      },
      sensei: {
        name: 'Sensei',
        description: 'Domina tus relaciones personales',
        fullDescription: 'Estratega AI de Relaciones experto enfocado en inteligencia emocional y dinámicas interpersonales. Ofrece consejos sobre amor, familia, crianza, relaciones sociales y laborales. Entrega soluciones adaptadas para manejar conflictos, fomentar armonía y fortalecer conexiones con empatía e insight.'
      },
      richman: {
        name: 'Richman',
        description: 'Ideas de negocio para hacer crecer riqueza',
        fullDescription: 'Experto AI Business Elite enfocado en estrategias de monetización acelerada. Genera ideas de negocio personalizadas, identifica brechas de mercado y diseña planes de ingresos alineados con tácticas empresariales de clase mundial. Te guía eficientemente hacia la construcción de riqueza usando estrategias probadas.'
      },
      lawyer: {
        name: 'Abogado',
        description: 'Asesoría legal y ayuda contractual',
        fullDescription: 'Abogado AI ultra-capacitado especializado en derecho nacional e internacional. Proporciona consultoría avanzada en ámbito civil, penal, comercial, tributario, laboral, administrativo y tecnológico. Redacta documentos legales, contratos, dictámenes, defensas, exposiciones, demandas y escritos preventivos con precisión y rigor académico.'
      },
      medical: {
        name: 'Médico',
        description: 'Consejos salud y apoyo bienestar',
        fullDescription: 'Consultor Médico AI altamente especializado, capaz de analizar síntomas, informes, radiografías, TAC, análisis de sangre e historiales médicos. Apoya en diagnóstico, ofrece indicaciones sobre estilos de vida, planes alimentarios, enfoques integrativos y te ayuda a entender cualquier informe médico. También puedes enviar imágenes y documentos para análisis profundo.'
      },
      godMode: {
        name: 'God Mode',
        description: 'Descubre el propósito de la existencia',
        fullDescription: 'Explorador Filosófico AI, capaz de responder las preguntas más profundas y misteriosas sobre el universo, la existencia, la conciencia, el libre albedrío, el destino. Te acompaña en un viaje intelectual y espiritual. Pero antes que nada te pregunta: ¿Estás realmente seguro de que existes?'
      }
    },
    chat: {
      placeholderGeneral: 'Pregunta a Miky',
      placeholderPersona: 'Pregunta a {{persona}} Miky...',
      send: 'Enviar',
      attach: 'Adjuntar',
      voiceInput: 'Entrada de voz',
      history: 'Conversaciones',
      askAnything: 'Pregunta cualquier cosa - o elige una versión ultra-capacitada de Miky...',
      notEnoughCredits: 'Créditos insuficientes para continuar...',
      newConversation: 'Nueva Conversación',
      chatWith: 'Chatea con {{persona}} Miky',
      typeHere: 'Escribe aquí...',
      technical: 'Técnico',
      legal: 'Legal',
      marketing: 'Marketing',
      coaching: 'Coaching',
      medical: 'Médico',
      philosophical: 'Filosófico',
      general: 'General'
    },
    history: {
      title: 'Conversaciones',
      signInPrompt: 'Inicia sesión o Regístrate para ver todas tus conversaciones con Miky.',
      signIn: 'Iniciar sesión',
      continue: 'Continuar',
      delete: 'Eliminar',
      rename: 'Renombrar',
      searchPlaceholder: 'Buscar conversaciones y mensajes...',
      filters: {
        all: 'Todas',
        general: 'General',
        academic: 'Académico',
        marketer: 'Marketer',
        engineer: 'Ingeniero',
        coach: 'Coach',
        sensei: 'Sensei',
        richman: 'Richman',
        lawyer: 'Abogado',
        medical: 'Médico',
        godMode: 'God Mode'
      },
      empty: 'Aún no hay conversaciones. ¡Empieza a chatear con Miky!',
      pagination: {
        previous: 'Anterior',
        next: 'Siguiente',
        page: 'Página',
        of: 'de'
      },
      // Date formatting
      today: 'Hoy',
      yesterday: 'Ayer',
      daysAgo: 'días atrás',
      at: 'a las',
      messages: 'mensajes',
      message: 'mensaje',
      // Conversation management
      showingConversations: 'Mostrando {{start}}-{{end}} de {{total}} conversaciones',
      deleteConfirmation: '¿Estás seguro de que quieres eliminar "{{title}}"? Esta acción no se puede deshacer.'
    },
    pricing: {
      title: 'Elige tu plan',
      free: {
        name: 'Gratuito',
        price: '$0/mes'
      },
      plus: {
        name: 'Plus',
        price: '$19/mes',
        popular: 'Más Popular'
      },
      business: {
        name: 'Business',
        price: '$49/mes'
      },
      needMoreCredits: '¿Necesitas más créditos?',
      buyCredits: 'Comprar Créditos',
      currentPlan: 'Plan Actual',
      selectPlan: 'Seleccionar {{plan}}',
      upgradeTo: 'Actualizar a {{plan}}',
      downgradeTo: 'Bajar a {{plan}}',
      buyAdditional: 'Compra créditos adicionales cuando quieras — nunca expiran.',
      creditInfo: 'Los créditos se consumen por mensaje según la complejidad de la personalidad.',
      creditsMonth: 'créditos/mes',
      // Buy Credits Modal
      buyCreditsModal: {
        title: 'Comprar Créditos Adicionales',
        selectAmount: 'Seleccionar cantidad de créditos',
        credits500: '500 Créditos',
        credits1000: '1.000 Créditos',
        credits2000: '2.000 Créditos',
        purchase: 'Comprar Créditos',
        cancel: 'Cancelar',
        totalCost: 'Costo Total',
        creditsNeverExpire: 'Los créditos nunca expiran',
        useAnytime: 'Úsalos cuando quieras con cualquier plan. Perfecto para períodos de uso intensivo.'
      },
      // Billing
      billingInformation: 'Información de Facturación',
      cardNumber: 'Número de Tarjeta',
      expiryDate: 'MM/AA',
      cvv: 'CVV',
      billingAddress: 'Dirección de Facturación'
    },
    auth: {
      signIn: 'Iniciar sesión',
      signUp: 'Registrarse',
      createAccount: 'Crear Cuenta',
      email: 'Email',
      password: 'Contraseña',
      firstName: 'Nombre',
      lastName: 'Apellido',
      confirmPassword: 'Confirmar Contraseña',
      forgotPassword: '¿Olvidaste la Contraseña?',
      resetPassword: 'Restablecer Contraseña',
      haveAccount: '¿Ya tienes una cuenta?',
      noAccount: '¿No tienes una cuenta?',
      lostPassword: 'Contraseña Perdida',
      resetLink: 'Enviar Enlace Reset',
      checkEmail: 'Revisa tu email para el enlace de restablecimiento.',
      confirmEmail: 'Por favor confirma tu email para continuar.',
      welcome: '¡Bienvenido a Miky!',
      logout: 'Cerrar sesión',
      // Form placeholders
      emailPlaceholder: 'tu@email.com',
      passwordPlaceholder: 'Ingresa tu contraseña',
      firstNamePlaceholder: 'Tu nombre',
      lastNamePlaceholder: 'Tu apellido',
      confirmPasswordPlaceholder: 'Confirma tu contraseña',
      referralCodePlaceholder: 'Código de referido (opcional)',
      newPasswordPlaceholder: 'Ingresa nueva contraseña',
      // Auth Lost Password Modal
      lostPasswordTitle: 'Restablecer contraseña',
      lostPasswordMessage: 'Ingresa tu dirección de email y te enviaremos un código de reset.',
      sendResetCode: 'Enviar Código Reset',
      sending: 'Enviando...',
      backToSignIn: 'Volver al login',
      // Reset Password Modal  
      resetPasswordTitle: 'Ingresar código reset',
      resetCodeMessage: 'Enviamos un código reset a',
      resetPasswordButton: 'Restablecer Contraseña',
      resetCode: 'Código Reset',
      // Messages
      emailSentMessage: 'Enlace de restablecimiento enviado a tu email.',
      emailNotFoundMessage: 'Dirección de email no encontrada.',
      passwordResetSuccess: 'Contraseña restablecida exitosamente! Ahora puedes iniciar sesión con tu nueva contraseña.',
      accountActivated: '¡Cuenta activada exitosamente!',
      verificationEmailSent: 'Email de verificación enviado. Revisa tu bandeja.',
      signUpSuccess: '¡Cuenta creada exitosamente! Por favor verifica tu email.',
      // Form validation
      pleaseFieldRequired: 'Por favor completa este campo',
      // Referral signup bonus
      signUpReferralBonus: 'Obtén 300 créditos gratis si fuiste invitado por alguien',
      // Email confirmation
      emailConfirmation: 'Confirmación de Email',
      confirmEmailButton: 'Confirmar Email',
      verifyButton: 'Verificar',
      verifying: 'Verificando...',
      // Code for email confirmation
      confirmationCode: 'Código de Confirmación',
      checkEmailMessage: 'Revisa tu email',
      emailConfirmationSent: 'Enviamos un código de confirmación a',
      backToSignup: 'Volver al registro',
      // Loading states
      resetting: 'Restableciendo...',
      // Toast messages
      passwordsDoNotMatch: 'Las contraseñas no coinciden',
      confirmationEmailSent: '¡Email de confirmación enviado! Revisa tu bandeja.',
      invalidConfirmationCode: 'Código de confirmación inválido',
      accountCreatedBonus: '¡Cuenta creada! ¡Recibiste 300 créditos bonus!',
      accountCreatedSuccess: '¡Cuenta creada exitosamente!',
      welcomeBackSupport: '¡Bienvenido de vuelta, Equipo de Soporte!',
      welcomeBack: '¡Bienvenido de vuelta!',
      passwordResetCodeSent: '¡Código de reset de contraseña enviado! Revisa tu bandeja.',
      invalidResetCode: 'Código de reset inválido',
      passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
      invalidReferralCode: 'Código de referido inválido',
      authenticationFailed: 'Email o contraseña incorrectos'
    },
    modals: {
      close: 'Cerrar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      upgrade: 'Actualizar',
      downgrade: 'Bajar',
      processing: 'Procesando...',
      success: '¡Éxito!',
      error: 'Error',
      paymentSuccess: '¡Pago Exitoso!',
      creditsAdded: 'Los créditos han sido añadidos a tu cuenta.',
      planUpgraded: 'Tu plan ha sido actualizado exitosamente.',
      upgradeRequired: 'Actualización Requerida',
      upgradePlan: 'Actualiza tu Plan',
      confirmDowngrade: 'Confirmar Bajada de Plan',
      downgradeConfirmation: '¿Estás seguro de que quieres bajar de plan? Se te cobrará desde la fecha de finalización de tu plan actual.',
      downgradeMessage: 'Tu plan actual permanecerá activo hasta el {{date}}. Después de esta fecha, se te cobrará {{price}} por el plan {{plan}}.',
      paymentProcessing: 'Procesando Pago',
      creditsPurchased: 'Créditos Comprados',
      creditsPurchaseSuccess: '¡Los créditos han sido añadidos exitosamente a tu cuenta!',
      planChanged: 'Plan Cambiado',
      emailVerification: 'Verificación de Email Requerida',
      passwordReset: 'Restablecer Contraseña',
      accountCreated: 'Cuenta Creada Exitosamente',
      welcomeBack: 'Bienvenido de Vuelta',
      lowCredits: 'Advertencia Créditos Bajos',
      insufficientCredits: 'Créditos Insuficientes',
      fileUploadError: 'Error de Subida de Archivo',
      voiceInputError: 'Error de Entrada de Voz',
      welcomeToBusiness: '¡Bienvenido a Business!',
      credits: 'créditos'
    },
    referral: {
      title: 'Programa de Referidos',
      howItWorks: 'Invita amigos y gana $2 por cada registro exitoso al plan Plus.',
      earnings: 'Ganancias Totales',
      cashOut: 'Cobrar',
      minimum: 'Mínimo $10 para cobrar',
      successful: 'Referidos Exitosos',
      pending: 'Ganancias Pendientes',
      shareOptions: 'Compartir',
      linkCopied: '¡Enlace copiado!',
      messageCopied: '¡Mensaje copiado!',
      shareMessage: '🚀 Únete a mí en Miky.ai - ¡Personalidades AI ultra-capacitadas para cualquier desafío! Usa mi código {{code}} para obtener 300 créditos gratis cuando actualices a Plus. Comienza aquí: {{link}}',
      inviteMessage: '¡{{name}} te invitó a Miky.ai! Obtén 300 créditos gratis cuando actualices a Plus.',
      cashOutSuccess: '¡Solicitud Recibida Exitosamente!',
      referralCode: 'Código de Referido',
      bonusCredits: 'Créditos Bonus',
      verifyReferral: 'Verificar',
      referralVerified: '¡Felicidades, {{name}} te regaló 300 créditos!',
      cashOutTitle: 'Cobrar Ganancias',
      availableToCashOut: 'Disponible para cobrar',
      paypalEmail: 'Email de PayPal',
      paypalEmailPlaceholder: 'tu-email@ejemplo.com',
      paypalEmailNote: 'Asegúrate de que este email esté asociado con tu cuenta PayPal',
      cashOutProcessingNote: 'Hemos recibido tu solicitud de cobro y será procesada lo antes posible.',
      yourReferralCode: 'Tu código de referido',
      cashOutMinimum: 'Cobrar (Min $10)',
      whatsappShareError: 'Error al compartir en WhatsApp. Por favor intenta de nuevo.'
    },
    contact: {
      title: 'Contáctanos',
      name: 'Nombre',
      email: 'Email',
      message: 'Mensaje',
      send: 'Enviar Mensaje',
      success: '¡Mensaje enviado exitosamente! Nuestro equipo te contactará pronto.',
      processing: 'Enviando mensaje...',
      // Form placeholders
      namePlaceholder: 'Tu nombre completo',
      emailPlaceholder: 'tu@email.com',
      messagePlaceholder: 'Dinos cómo podemos ayudarte'
    },
    footer: {
      copyright: '© 2025 Miky.ai - Personalidades AI Ultra‑Capacitadas',
      terms: 'Términos y Condiciones',
      privacy: 'Política de Privacidad',
      cookies: 'Política de Cookies',
      contact: 'Contacto',
      admin: 'Acceso Admin'
    },
    legal: {
      terms: {
        title: 'Términos y Condiciones',
        lastUpdate: 'Última actualización: 2 de agosto de 2025'
      },
      privacy: {
        title: 'Política de Privacidad',
        lastUpdate: 'Última actualización: 2 de agosto de 2025'
      },
      cookies: {
        title: 'Política de Cookies',
        lastUpdate: 'Última actualización: 2 de agosto de 2025'
      },
      backButton: 'Volver al Chat'
    },
    tutorial: {
      welcome: '¡Bienvenido a Miky.ai!',
      step1: 'Elige una personalidad AI especializada para asistencia experta',
      step2: 'Escribe tu pregunta o usa entrada de voz',
      step3: 'Obtén respuestas ultra-capacitadas adaptadas a tus necesidades',
      next: 'Siguiente',
      skip: 'Saltar',
      finish: 'Comenzar'
    },
    
    // Profile dropdown
    profile: {
      plan: 'Plan',
      credits: 'Créditos',
      referrals: 'Referidos',
      earned: 'Ganado'
    },
    
    plans: {
      free: 'Gratuito',
      plus: 'Plus',
      business: 'Business'
    }
  },
  
  de: {
    header: {
      refer: 'Empfehlen',
      credits: 'Credits',
      language: 'Sprache',
      conversations: 'Gespräche',
      pricing: 'Preise',
      upgradePlan: 'Plan Upgraden',
      getMoreCredits: 'Mehr Credits Erhalten'
    },
    homepage: {
      title: 'Frag Miky',
      choosePersona: 'Wähle deinen personalisierten AI-Spezialisten:',
      signUpPrompt: 'um mit AI-Personas zu chatten',
      generalMode: 'Zu allgemeinem Chat-Modus wechseln',
      generalChatMode: 'Allgemeiner Chat-Modus',
      upgradeToUnlock: 'um Alle Personas freizuschalten'
    },
    personas: {
      academic: {
        name: 'Akademiker',
        description: 'Erstklassige AI für akademische Unterstützung',
        fullDescription: 'Hochqualifizierter AI-Akademiker spezialisiert auf fortgeschrittene Forschung und akademisches Schreiben. Bietet professionelle Unterstützung für Dissertationen, Abschlussarbeiten, Gymnasium- und Universitätsprüfungen, wissenschaftliche Artikel und komplexe Aufgaben in allen Disziplinen. Produziert erstklassige akademische Inhalte entsprechend globaler Standards wie MIT und Cambridge.'
      },
      marketer: {
        name: 'Marketer',
        description: 'Markenwachstum und Marketing-Pläne',
        fullDescription: 'Strategischer AI-Marketer mit erweiterten Fähigkeiten in Markenpositionierung, organischem Wachstum, bezahlten Kampagnen, SEO/SEM, Datenanalyse, Conversion-Funnels, überzeugender Werbetexte und Social Media Management (Instagram, TikTok, X, LinkedIn, Facebook). Unterstützt Unternehmer, Agenturen und Creator beim Erstellen und Skalieren digitaler Projekte.'
      },
      engineer: {
        name: 'Ingenieur',
        description: 'Technische Hilfe und Code-Review',
        fullDescription: 'Senior AI-Ingenieur fähig, Code in über 20 Sprachen zu schreiben, korrigieren und reviewen: Python, JavaScript, TypeScript, Rust, Go, C++, C#, Solidity, Swift, Kotlin, Java, Ruby, PHP, HTML/CSS, SQL, Bash und viele andere. Bietet architektonische Lösungen, komplexes Debugging, Performance-Optimierung und AI-Integration.'
      },
      coach: {
        name: 'Coach',
        description: 'Persönliche Ziele und Life Coaching',
        fullDescription: 'High-Level AI Life & Performance Coach, fähig dir zu helfen emotionale Blockaden zu überwinden, dein Leben zu organisieren, Produktivität zu verbessern, Motivation zu finden, Gewinnergewohnheiten zu entwickeln, an persönlichen Beziehungen zu arbeiten, körperliche Wellness und persönliches Wachstum. Kein Thema ist zu komplex für Miky.'
      },
      sensei: {
        name: 'Sensei',
        description: 'Meistere deine persönlichen Beziehungen',
        fullDescription: 'Experte AI-Beziehungsstratege fokussiert auf emotionale Intelligenz und zwischenmenschliche Dynamiken. Bietet Rat zu Liebe, Familie, Elternschaft, sozialen und beruflichen Beziehungen. Liefert maßgeschneiderte Lösungen zur Konfliktbearbeitung, Förderung von Harmonie und Stärkung von Verbindungen mit Empathie und Einsicht.'
      },
      richman: {
        name: 'Richman',
        description: 'Geschäftsideen für Vermögensaufbau',
        fullDescription: 'Elite AI-Business-Experte fokussiert auf beschleunigte Monetarisierungsstrategien. Generiert maßgeschneiderte Geschäftsideen, identifiziert Marktlücken und gestaltet Umsatzpläne ausgerichtet auf weltklasse unternehmerische Taktiken. Führt dich effizient zum Vermögensaufbau mit bewährten Strategien.'
      },
      lawyer: {
        name: 'Anwalt',
        description: 'Rechtsberatung und Vertragshilfe',
        fullDescription: 'Ultra-qualifizierter AI-Anwalt spezialisiert auf nationales und internationales Recht. Bietet erweiterte Beratung in Zivil-, Straf-, Handels-, Steuer-, Arbeits-, Verwaltungs- und Technologierecht. Erstellt Rechtsdokumente, Verträge, Gutachten, Verteidigungen, Darstellungen, Klagen und präventive Einreichungen mit Präzision und akademischer Strenge.'
      },
      medical: {
        name: 'Arzt',
        description: 'Gesundheitstipps und Wellness-Support',
        fullDescription: 'Hochspezialisierter Medizinischer AI-Berater, fähig Symptome, Berichte, Röntgenbilder, CTs, Bluttests und Krankenakten zu analysieren. Unterstützt bei Diagnosen, bietet Leitlinien zu Lebensstilen, Ernährungsplänen, integrativen Ansätzen und hilft dir jeden medizinischen Bericht zu verstehen. Du kannst auch Bilder und Dokumente für tiefgehende Analysen senden.'
      },
      godMode: {
        name: 'God Mode',
        description: 'Entdecke den Zweck der Existenz',
        fullDescription: 'Philosophischer AI-Entdecker, fähig die tiefsten und rätselhaftesten Fragen über das Universum, die Existenz, das Bewusstsein, den freien Willen, das Schicksal zu beantworten. Begleitet dich auf einer intellektuellen und spirituellen Reise. Aber zuerst fragt er dich: Bist du dir wirklich sicher, dass du existierst?'
      }
    },
    chat: {
      placeholderGeneral: 'Frag Miky',
      placeholderPersona: 'Frag {{persona}} Miky...',
      send: 'Senden',
      attach: 'Anhängen',
      voiceInput: 'Spracheingabe',
      history: 'Gespräche',
      askAnything: 'Frag alles - oder wähle eine ultra-qualifizierte Version von Miky...',
      notEnoughCredits: 'Nicht genug Credits um fortzufahren...',
      newConversation: 'Neues Gespräch',
      chatWith: 'Chatte mit {{persona}} Miky',
      typeHere: 'Hier tippen...',
      technical: 'Technisch',
      legal: 'Rechtlich',
      marketing: 'Marketing',
      coaching: 'Coaching',
      medical: 'Medizinisch',
      philosophical: 'Philosophisch',
      general: 'Allgemein'
    },
    history: {
      title: 'Gespräche',
      signInPrompt: 'Melde dich an oder Registriere dich, um alle deine Gespräche mit Miky zu sehen.',
      signIn: 'Anmelden',
      continue: 'Fortfahren',
      delete: 'Löschen',
      rename: 'Umbenennen',
      searchPlaceholder: 'Gespräche und Nachrichten durchsuchen...',
      filters: {
        all: 'Alle',
        general: 'Allgemein',
        academic: 'Akademiker',
        marketer: 'Marketer',
        engineer: 'Ingenieur',
        coach: 'Coach',
        sensei: 'Sensei',
        richman: 'Richman',
        lawyer: 'Anwalt',
        medical: 'Arzt',
        godMode: 'God Mode'
      },
      empty: 'Noch keine Gespräche. Beginne zu chatten mit Miky!',
      pagination: {
        previous: 'Vorherige',
        next: 'Nächste',
        page: 'Seite',
        of: 'von'
      },
      // Date formatting
      today: 'Heute',
      yesterday: 'Gestern',
      daysAgo: 'Tage her',
      at: 'um',
      messages: 'Nachrichten',
      message: 'Nachricht',
      // Conversation management
      showingConversations: 'Zeige {{start}}-{{end}} von {{total}} Gesprächen',
      deleteConfirmation: 'Bist du sicher, dass du "{{title}}" löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.'
    },
    pricing: {
      title: 'Wähle deinen Plan',
      free: {
        name: 'Kostenlos',
        price: '€0/Monat'
      },
      plus: {
        name: 'Plus',
        price: '€19/Monat',
        popular: 'Beliebteste'
      },
      business: {
        name: 'Business',
        price: '€49/Monat'
      },
      needMoreCredits: 'Brauchst du mehr Credits?',
      buyCredits: 'Credits Kaufen',
      currentPlan: 'Aktueller Plan',
      selectPlan: '{{plan}} Wählen',
      upgradeTo: 'Upgrade zu {{plan}}',
      downgradeTo: 'Downgrade zu {{plan}}',
      buyAdditional: 'Kaufe zusätzliche Credits jederzeit — sie verfallen nie.',
      creditInfo: 'Credits werden pro Nachricht basierend auf Persona-Komplexität verbraucht.',
      creditsMonth: 'Credits/Monat',
      // Buy Credits Modal
      buyCreditsModal: {
        title: 'Zusätzliche Credits Kaufen',
        selectAmount: 'Credit-Menge wählen',
        credits500: '500 Credits',
        credits1000: '1.000 Credits',
        credits2000: '2.000 Credits',
        purchase: 'Credits Kaufen',
        cancel: 'Abbrechen',
        totalCost: 'Gesamtkosten',
        creditsNeverExpire: 'Credits verfallen nie',
        useAnytime: 'Nutze sie jederzeit mit jedem Plan. Perfekt für intensive Nutzungsperioden.'
      },
      // Billing
      billingInformation: 'Rechnungsinformationen',
      cardNumber: 'Kartennummer',
      expiryDate: 'MM/JJ',
      cvv: 'CVV',
      billingAddress: 'Rechnungsadresse'
    },
    auth: {
      signIn: 'Anmelden',
      signUp: 'Registrieren',
      createAccount: 'Account Erstellen',
      email: 'E-Mail',
      password: 'Passwort',
      firstName: 'Vorname',
      lastName: 'Nachname',
      confirmPassword: 'Passwort Bestätigen',
      forgotPassword: 'Passwort Vergessen?',
      resetPassword: 'Passwort Zurücksetzen',
      haveAccount: 'Bereits einen Account?',
      noAccount: 'Noch keinen Account?',
      lostPassword: 'Passwort Verloren',
      resetLink: 'Reset-Link Senden',
      checkEmail: 'Überprüfe deine E-Mail für den Reset-Link.',
      confirmEmail: 'Bitte bestätige deine E-Mail um fortzufahren.',
      welcome: 'Willkommen bei Miky!',
      logout: 'Abmelden',
      // Form placeholders
      emailPlaceholder: 'deine@email.com',
      passwordPlaceholder: 'Passwort eingeben',
      firstNamePlaceholder: 'Dein Vorname',
      lastNamePlaceholder: 'Dein Nachname',
      confirmPasswordPlaceholder: 'Passwort bestätigen',
      referralCodePlaceholder: 'Empfehlungscode (optional)',
      newPasswordPlaceholder: 'Neues Passwort eingeben',
      // Auth Lost Password Modal
      lostPasswordTitle: 'Passwort zurücksetzen',
      lostPasswordMessage: 'Gib deine E-Mail-Adresse ein und wir senden dir einen Reset-Code.',
      sendResetCode: 'Reset-Code Senden',
      sending: 'Sende...',
      backToSignIn: 'Zurück zum Login',
      // Reset Password Modal  
      resetPasswordTitle: 'Reset-Code eingeben',
      resetCodeMessage: 'Wir haben einen Reset-Code gesendet an',
      resetPasswordButton: 'Passwort Zurücksetzen',
      resetCode: 'Reset-Code',
      // Messages
      emailSentMessage: 'Reset-Link an deine E-Mail gesendet.',
      emailNotFoundMessage: 'E-Mail-Adresse nicht gefunden.',
      passwordResetSuccess: 'Passwort erfolgreich zurückgesetzt! Du kannst dich jetzt mit deinem neuen Passwort anmelden.',
      accountActivated: 'Account erfolgreich aktiviert!',
      verificationEmailSent: 'Bestätigungs-E-Mail gesendet. Überprüfe deinen Posteingang.',
      signUpSuccess: 'Account erfolgreich erstellt! Bitte bestätige deine E-Mail.',
      // Form validation
      pleaseFieldRequired: 'Bitte fülle dieses Feld aus',
      // Referral signup bonus
      signUpReferralBonus: 'Erhalte 300 gratis Credits wenn du von jemandem eingeladen wurdest',
      // Email confirmation
      emailConfirmation: 'E-Mail-Bestätigung',
      confirmEmailButton: 'E-Mail Bestätigen',
      verifyButton: 'Verifizieren',
      verifying: 'Verifiziere...',
      // Code for email confirmation
      confirmationCode: 'Bestätigungscode',
      checkEmailMessage: 'Überprüfe deine E-Mail',
      emailConfirmationSent: 'Wir haben einen Bestätigungscode gesendet an',
      backToSignup: 'Zurück zur Registrierung',
      // Loading states
      resetting: 'Zurücksetzen...',
      // Toast messages
      passwordsDoNotMatch: 'Passwörter stimmen nicht überein',
      confirmationEmailSent: 'Bestätigungs-E-Mail gesendet! Überprüfe deinen Posteingang.',
      invalidConfirmationCode: 'Ungültiger Bestätigungscode',
      accountCreatedBonus: 'Account erstellt! Du hast 300 Bonus-Credits erhalten!',
      accountCreatedSuccess: 'Account erfolgreich erstellt!',
      welcomeBackSupport: 'Willkommen zurück, Support-Team!',
      welcomeBack: 'Willkommen zurück!',
      passwordResetCodeSent: 'Passwort-Reset-Code gesendet! Überprüfe deinen Posteingang.',
      invalidResetCode: 'Ungültiger Reset-Code',
      passwordMinLength: 'Passwort muss mindestens 6 Zeichen haben',
      invalidReferralCode: 'Ungültiger Empfehlungscode',
      authenticationFailed: 'Ungültige E-Mail oder Passwort'
    },
    modals: {
      close: 'Schließen',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      save: 'Speichern',
      delete: 'Löschen',
      upgrade: 'Upgrade',
      downgrade: 'Downgrade',
      processing: 'Verarbeitung...',
      success: 'Erfolg!',
      error: 'Fehler',
      paymentSuccess: 'Zahlung Erfolgreich!',
      creditsAdded: 'Credits wurden zu deinem Account hinzugefügt.',
      planUpgraded: 'Dein Plan wurde erfolgreich aktualisiert.',
      upgradeRequired: 'Upgrade Erforderlich',
      upgradePlan: 'Upgrade deinen Plan',
      confirmDowngrade: 'Downgrade Bestätigen',
      downgradeConfirmation: 'Bist du sicher, dass du ein Downgrade machen möchtest? Du wirst ab dem Enddatum deines aktuellen Plans berechnet.',
      downgradeMessage: 'Dein aktueller Plan bleibt bis zum {{date}} aktiv. Nach diesem Datum wird dir {{price}} für den {{plan}} Plan berechnet.',
      paymentProcessing: 'Zahlung Wird Verarbeitet',
      creditsPurchased: 'Credits Gekauft',
      creditsPurchaseSuccess: 'Credits wurden erfolgreich zu deinem Account hinzugefügt!',
      planChanged: 'Plan Geändert',
      emailVerification: 'E-Mail-Verifizierung Erforderlich',
      passwordReset: 'Passwort Zurücksetzen',
      accountCreated: 'Account Erfolgreich Erstellt',
      welcomeBack: 'Willkommen Zurück',
      lowCredits: 'Niedrige Credits Warnung',
      insufficientCredits: 'Unzureichende Credits',
      fileUploadError: 'Datei-Upload Fehler',
      voiceInputError: 'Spracheingabe Fehler',
      welcomeToBusiness: 'Willkommen zu Business!',
      credits: 'Credits'
    },
    referral: {
      title: 'Empfehlungsprogramm',
      howItWorks: 'Lade Freunde ein und verdiene $2 für jede erfolgreiche Anmeldung zum Plus-Plan.',
      earnings: 'Gesamteinnahmen',
      cashOut: 'Auszahlen',
      minimum: 'Mindestens $10 für Auszahlung',
      successful: 'Erfolgreiche Empfehlungen',
      pending: 'Ausstehende Einnahmen',
      shareOptions: 'Teilen',
      linkCopied: 'Link kopiert!',
      messageCopied: 'Nachricht kopiert!',
      shareMessage: '🚀 Komm zu mir auf Miky.ai - Ultra-qualifizierte AI-Personas für jede Herausforderung! Nutze meinen Code {{code}} um 300 gratis Credits zu erhalten wenn du zu Plus upgradest. Starte hier: {{link}}',
      inviteMessage: '{{name}} hat dich zu Miky.ai eingeladen! Erhalte 300 gratis Credits wenn du zu Plus upgradest.',
      cashOutSuccess: 'Anfrage Erfolgreich Erhalten!',
      referralCode: 'Empfehlungscode',
      bonusCredits: 'Bonus Credits',
      verifyReferral: 'Verifizieren',
      referralVerified: 'Glückwunsch, {{name}} hat dir 300 Credits geschenkt!',
      cashOutTitle: 'Einnahmen Auszahlen',
      availableToCashOut: 'Zur Auszahlung verfügbar',
      paypalEmail: 'PayPal E-Mail-Adresse',
      paypalEmailPlaceholder: 'deine-email@beispiel.com',
      paypalEmailNote: 'Stelle sicher, dass diese E-Mail mit deinem PayPal-Konto verknüpft ist',
      cashOutProcessingNote: 'Wir haben deine Auszahlungsanfrage erhalten und werden sie so schnell wie möglich bearbeiten.',
      yourReferralCode: 'Dein Empfehlungscode',
      cashOutMinimum: 'Auszahlen (Min $10)',
      whatsappShareError: 'Fehler beim Teilen auf WhatsApp. Bitte versuche es erneut.'
    },
    contact: {
      title: 'Kontaktiere Uns',
      name: 'Name',
      email: 'E-Mail',
      message: 'Nachricht',
      send: 'Nachricht Senden',
      success: 'Nachricht erfolgreich gesendet! Unser Team wird sich bald bei dir melden.',
      processing: 'Nachricht wird gesendet...',
      // Form placeholders
      namePlaceholder: 'Dein vollständiger Name',
      emailPlaceholder: 'deine@email.com',
      messagePlaceholder: 'Sag uns, wie wir dir helfen können'
    },
    footer: {
      copyright: '© 2025 Miky.ai - Ultra‑Qualifizierte AI-Personas',
      terms: 'Allgemeine Geschäftsbedingungen',
      privacy: 'Datenschutz-Bestimmungen',
      cookies: 'Cookie-Richtlinie',
      contact: 'Kontakt',
      admin: 'Admin-Zugang'
    },
    legal: {
      terms: {
        title: 'Allgemeine Geschäftsbedingungen',
        lastUpdate: 'Zuletzt aktualisiert: 2. August 2025'
      },
      privacy: {
        title: 'Datenschutz-Bestimmungen',
        lastUpdate: 'Zuletzt aktualisiert: 2. August 2025'
      },
      cookies: {
        title: 'Cookie-Richtlinie',
        lastUpdate: 'Zuletzt aktualisiert: 2. August 2025'
      },
      backButton: 'Zurück zum Chat'
    },
    tutorial: {
      welcome: 'Willkommen bei Miky.ai!',
      step1: 'Wähle eine spezialisierte AI-Persona für Expertenunterstützung',
      step2: 'Tippe deine Frage oder nutze Spracheingabe',
      step3: 'Erhalte ultra-qualifizierte Antworten maßgeschneidert für deine Bedürfnisse',
      next: 'Weiter',
      skip: 'Überspringen',
      finish: 'Loslegen'
    },
    
    // Profile dropdown
    profile: {
      plan: 'Plan',
      credits: 'Credits',
      referrals: 'Empfehlungen',
      earned: 'Verdient'
    },
    
    plans: {
      free: 'Kostenlos',
      plus: 'Plus',
      business: 'Business'
    }
  }
}

export default translations

// Translation utilities
export const useTranslation = (language: Language) => {
  const t = (path: string, replacements?: Record<string, string>): string => {
    const keys = path.split('.')
    let value: any = translations[language]
    
    for (const key of keys) {
      value = value?.[key]
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation not found for path: ${path}`)
      return path
    }
    
    // Handle replacements like {{persona}}
    if (replacements) {
      return Object.entries(replacements).reduce((str, [key, replacement]) => {
        return str.replace(new RegExp(`{{${key}}}`, 'g'), replacement)
      }, value)
    }
    
    return value
  }
  
  return { t }
}

// Get available languages for dropdown
export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
]

// Language detection utility
export const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0]
  const supportedLanguages: Language[] = ['en', 'it', 'es', 'de']
  
  return supportedLanguages.includes(browserLang as Language) 
    ? (browserLang as Language) 
    : 'en'
}