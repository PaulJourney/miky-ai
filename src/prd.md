# Miky.ai - AI Assistant Platform PRD

## Core Purpose & Success

**Mission Statement**: Miky.ai is a professional AI assistant platform that provides specialized personas for different domains, enabling users to get expert-level guidance through conversational AI.

**Success Indicators**: 
- User engagement through repeat conversations
- Credit consumption indicating value perception
- Plan upgrades demonstrating premium feature adoption
- Referral program usage showing user satisfaction
- Strong SEO performance and social media sharing

**Experience Qualities**: Professional, Intelligent, Efficient

## Project Classification & Approach

**Complexity Level**: Light Application (multiple features with basic state)
- Multi-persona AI chat interface
- Credit-based subscription system
- Conversation history management
- Admin dashboard for analytics
- Comprehensive SEO optimization

**Primary User Activity**: Interacting (conversational AI assistance)

## Thought Process for Feature Selection

**Core Problem Analysis**: Users need specialized AI assistance for different domains but don't want to juggle multiple AI tools or learn domain-specific prompting techniques.

**User Context**: Professionals and individuals seeking expert-level guidance across various domains - legal, technical, marketing, personal development, health, and philosophical questions.

**Critical Path**: Select persona → Ask question → Receive specialized response → Continue conversation or start new topic

**Key Moments**: 
1. Persona selection that matches user's immediate need
2. Quality of AI response that demonstrates domain expertise
3. Seamless conversation flow that maintains context

## Essential Features

### Multi-Persona AI System
- **Functionality**: 6 specialized AI personas (Lawyer, Engineer, Marketer, Coach, Medical Advisor, God Mode)
- **Purpose**: Provides domain-specific responses tailored to user needs
- **Success Criteria**: Users successfully get relevant, helpful responses from chosen personas

### Credit-Based Pricing
- **Functionality**: Tiered subscription plans with monthly credit allowances
- **Purpose**: Monetizes advanced features while providing free access to basic functionality
- **Success Criteria**: Clear credit consumption, upgrade prompts, successful payment processing

### Conversation Management
- **Functionality**: Persistent conversation history, ability to resume, rename, and delete conversations
- **Purpose**: Enables users to maintain context across sessions and organize their interactions
- **Success Criteria**: Users can easily find and continue previous conversations

### Voice Input Support
- **Functionality**: Browser-based speech recognition for hands-free interaction
- **Purpose**: Improves accessibility and convenience, especially for mobile users
- **Success Criteria**: Accurate voice-to-text conversion and seamless integration

### Referral System
- **Functionality**: Unique referral codes with credit rewards for successful invitations
- **Purpose**: Drives organic user growth through incentivized sharing
- **Success Criteria**: Active referral usage and measurable user acquisition

## Design Direction

### Visual Tone & Identity
**Emotional Response**: Users should feel confident, supported, and that they're accessing professional-grade AI assistance.

**Design Personality**: Modern, professional, intelligent - similar to premium productivity tools like Notion or Linear.

**Visual Metaphors**: Clean geometric forms, subtle technological elements, premium card-based layouts.

**Simplicity Spectrum**: Minimal interface that prioritizes content and conversation flow.

### Color Strategy
**Color Scheme Type**: Monochromatic dark theme with acid green accent

**Primary Color**: Dark background (oklch(0.15 0 0)) - professional, focused environment
**Secondary Colors**: Various grays for hierarchy and depth
**Accent Color**: Acid green (oklch(0.8 0.15 140)) - high-tech, attention-grabbing for CTAs
**Color Psychology**: Dark theme reduces eye strain for extended use, green accent suggests growth and intelligence

**Foreground/Background Pairings**:
- Background (oklch(0.15 0 0)) + Foreground (oklch(0.9 0 0)) = 15.0:1 contrast ✓
- Card (oklch(0.18 0 0)) + Card-foreground (oklch(0.9 0 0)) = 13.4:1 contrast ✓
- Primary (oklch(0.8 0.15 140)) + Primary-foreground (oklch(0.1 0 0)) = 14.2:1 contrast ✓

### Typography System
**Font Pairing Strategy**: Single font family (Inter) with multiple weights for consistency
**Which fonts**: Inter (400, 500, 600, 700) - excellent legibility, professional appearance
**Typographic Hierarchy**: Clear distinction between headers, body text, and metadata using size and weight
**Legibility Check**: Inter is specifically designed for screen reading with excellent legibility at small sizes

### Visual Hierarchy & Layout
**Attention Direction**: Main input field centered at top, personas immediately below, conversations flow naturally
**White Space Philosophy**: Generous spacing between sections to create breathing room and focus
**Grid System**: Container-based layout with consistent padding and margins
**Responsive Approach**: Mobile-first design with progressive enhancement for larger screens

### Animations
**Purposeful Meaning**: Subtle transitions communicate state changes and provide feedback
**Hierarchy of Movement**: Focus on interactive elements - button hovers, loading states, transitions
**Contextual Appropriateness**: Minimal, functional animations that enhance rather than distract

### UI Elements & Component Selection
**Component Usage**: 
- Cards for conversation display and pricing tiers
- Buttons for personas and actions
- Dialogs for admin login and settings
- Badges for plan indicators and status

**Icon Selection**: Phosphor Icons (outline variants) for consistent, clean iconography
**Spacing System**: Tailwind's spacing scale for mathematical consistency
**Mobile Adaptation**: Stack layouts vertically, larger touch targets, simplified navigation

## Implementation Considerations

**Scalability Needs**: 
- Support for additional personas
- Multiple language support structure
- Analytics and reporting capabilities

**Testing Focus**: 
- Credit system accuracy
- Voice recognition reliability
- Cross-browser compatibility
- Mobile responsiveness

**Critical Questions**:
- How to integrate real AI APIs efficiently
- Payment processing security and reliability
- Voice recognition fallbacks for unsupported browsers

## Current Implementation Status

### Completed Features
- ✅ Dark-only theme implementation
- ✅ Pricing page with three tiers (Free, Plus, Business)
- ✅ Outline icon system using Phosphor Icons
- ✅ Credit-based system with plan upgrades
- ✅ Multi-persona interface with restrictions
- ✅ Conversation history management
- ✅ Admin dashboard with analytics
- ✅ Referral system with unique codes
- ✅ Voice input support (browser-based)
- ✅ Mobile-responsive design
- ✅ Professional card-based layout
- ✅ Comprehensive SEO optimization with meta tags
- ✅ Favicon and social sharing assets
- ✅ Admin SEO management dashboard
- ✅ Structured data and Open Graph implementation

### SEO & Social Media Features
**Comprehensive SEO Implementation**:
- **Meta Tags**: Complete set of SEO meta tags including title, description, keywords, author
- **Open Graph**: Full Facebook/Meta sharing optimization with custom image and metadata
- **Twitter Cards**: Optimized Twitter/X sharing with large image cards
- **Structured Data**: JSON-LD schema markup for search engines
- **Favicon System**: Multi-format favicon support (SVG, PNG, Apple Touch Icon)
- **Social Sharing**: Custom 1200×630px social sharing image with Miky.ai branding
- **Technical SEO**: robots.txt, sitemap.xml, canonical URLs, theme color
- **Admin Management**: Full admin control over all SEO settings and asset uploads

**Brand Assets Created**:
- **Favicon**: Minimalist "M" logo on dark background (#1a1a1a) with acid green (#7FFF00)
- **Social Image**: Professional 1200×630px image with "MIKY" in green, ".AI" in white, subtle glow effect
- **Brand Consistency**: All assets follow the established dark theme with acid green accent

### Integration Points for Production
- **Stripe Payment Processing**: Replace mock payment flow in Pricing component
- **AI API Integration**: Replace persona response generation with real AI calls
- **Authentication System**: Add user registration and login
- **Real-time Features**: Consider WebSocket for live conversation updates
- **Analytics**: Integrate usage tracking and conversion metrics

## Reflection

This approach creates a premium, focused AI assistant platform that prioritizes user experience through specialized personas and a clean, professional interface. The dark theme with acid green accents establishes a high-tech, professional identity while maintaining excellent accessibility. The credit-based pricing model allows for flexible monetization while keeping the platform accessible to free users.

The removal of theme switching simplifies the user experience and technical implementation, while the outline icon system maintains visual consistency throughout the application. The pricing page provides clear value propositions for each tier, encouraging upgrades through feature restrictions rather than hard paywalls.