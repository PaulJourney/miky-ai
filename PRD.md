# Miky.ai - AI Assistant Platform

Miky.ai is a professional AI assistant platform that autonomously manages users' social media presence across multiple platforms through natural language and voice interactions.

**Experience Qualities**:
1. **Professional** - Clean, business-grade interface that instills confidence in users managing their digital presence
2. **Intuitive** - All primary functions visible without scrolling, with clear persona-based interaction patterns
3. **Efficient** - Credit-based system with transparent usage tracking and seamless cross-platform social media management

**Complexity Level**: Light Application (multiple features with basic state)
- Combines chat interface, persona selection, credit management, and admin dashboard with persistent user state and conversation history

## Essential Features

### Main Chat Interface
- **Functionality**: Central AI conversation interface with persona-specific routing
- **Purpose**: Primary interaction point for all AI assistant requests across different expertise areas
- **Trigger**: User types in main input field or selects persona button
- **Progression**: Input prompt → Select persona (optional) → Submit → AI response → Continue conversation
- **Success criteria**: Responses feel contextually appropriate to selected persona, conversation history persists

### Persona Selection System  
- **Functionality**: Six specialized AI personas (Lawyer, Engineer, Marketer, Coach, Medical Advisor, God Mode)
- **Purpose**: Route user queries to specialized AI behaviors and contexts
- **Trigger**: Click persona button before or after entering prompt
- **Progression**: View personas → Select specialty → Input enhanced with persona context → Specialized response
- **Success criteria**: Each persona provides distinctly different response styles and expertise areas

### Credit Management System
- **Functionality**: Credit-based usage tracking with subscription tiers and automatic deduction
- **Purpose**: Monetize platform usage while providing transparent resource allocation
- **Trigger**: Any AI interaction automatically consumes credits
- **Progression**: Check balance → Use feature → Credits auto-deduct → Low credit warning (if applicable)
- **Success criteria**: Balance updates in real-time, clear upgrade paths when credits are low

### Voice Input Integration
- **Functionality**: Browser-based speech recognition for hands-free interaction
- **Purpose**: Enable natural conversation flow and accessibility for mobile users
- **Trigger**: Click microphone icon, grant browser permissions
- **Progression**: Click mic → Start speaking → Speech-to-text conversion → Submit as regular prompt
- **Success criteria**: Accurate speech recognition, seamless integration with text input flow

### Conversation History
- **Functionality**: Persistent chat history organized by persona with management options
- **Purpose**: Allow users to continue previous conversations and manage their interaction history
- **Trigger**: Access history via navigation or sidebar
- **Progression**: View history list → Select conversation → Resume/rename/delete → Continue or manage
- **Success criteria**: All conversations persist between sessions, organized clearly by persona

### Referral System
- **Functionality**: Unique referral links with bonus credit rewards for both parties
- **Purpose**: Grow user base through incentivized word-of-mouth marketing
- **Trigger**: Click "Refer a Friend" in header
- **Progression**: Generate link → Share with friend → Friend signs up → Both receive 100 bonus credits
- **Success criteria**: Accurate referral tracking, automatic credit distribution, clear referral dashboard

### Admin Dashboard
- **Functionality**: Comprehensive platform management with user analytics and content editing
- **Purpose**: Platform administration, user management, and business intelligence
- **Trigger**: Access via footer with password "1234"
- **Progression**: Enter password → Access dashboard → Manage users/content/analytics → Export reports
- **Success criteria**: Complete platform oversight, user management capabilities, financial reporting

## Edge Case Handling

- **Credit exhaustion**: Graceful degradation with upgrade prompts, essential features remain accessible
- **Voice recognition failures**: Automatic fallback to text input with error messaging
- **Persona conflicts**: Clear visual indication of active persona, easy switching between contexts
- **Admin access attempts**: Password protection with rate limiting on failed attempts
- **Mobile viewport constraints**: Responsive design ensures all primary functions visible on smallest screens
- **Conversation history overflow**: Pagination or infinite scroll with search functionality
- **Network connectivity issues**: Offline indicators with retry mechanisms for failed requests

## Design Direction

The design should feel cutting-edge yet professional, like a premium AI tool that Fortune 500 companies would trust with their social media presence. Clean, minimal interface with strategic use of acid green accents against a sophisticated dark theme that communicates both innovation and reliability.

## Color Selection

Complementary (opposite colors) - Dark background with acid green accents creates high contrast and technological feel while maintaining professional credibility.

- **Primary Color**: Acid Green (`oklch(0.8 0.15 140)`) - Represents AI innovation, energy, and technological advancement
- **Secondary Colors**: Dark Gray (`oklch(0.15 0 0)`) for backgrounds, Medium Gray (`oklch(0.4 0 0)`) for secondary elements  
- **Accent Color**: Bright Acid Green (`oklch(0.85 0.18 140)`) for CTAs, active states, and important notifications
- **Foreground/Background Pairings**: 
  - Background (Dark Gray #1A1A1A): Light Gray text (#E5E5E5) - Ratio 9.1:1 ✓
  - Card (Charcoal #2A2A2A): White text (#FFFFFF) - Ratio 12.6:1 ✓
  - Primary (Acid Green #7ED321): Black text (#000000) - Ratio 11.8:1 ✓
  - Accent (Bright Acid Green #8EE834): Black text (#000000) - Ratio 13.2:1 ✓

## Font Selection

Typography should convey precision, modernity, and technological sophistication while remaining highly legible at small sizes for mobile-first design.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/24px/tight letter spacing
  - H2 (Section Headers): Inter Medium/18px/normal spacing  
  - Body (Interface Text): Inter Regular/14px/relaxed line height
  - Small (Credits/Status): Inter Regular/12px/tight line height
  - Button Text: Inter Medium/14px/normal spacing

## Animations

Animations should feel precise and technological, reinforcing the AI-powered nature of the platform while maintaining professional polish suitable for business users.

- **Purposeful Meaning**: Subtle glow effects on acid green elements suggest AI processing, smooth transitions between personas indicate intelligent context switching
- **Hierarchy of Movement**: Primary focus on input field interactions and persona selection, secondary movement for status updates and navigation

## Component Selection

- **Components**: Dialog for admin access, Card for conversation history, Form for inputs, Button for personas, Switch for theme toggle, Popover for user menus, Toast for notifications
- **Customizations**: Custom persona buttons with icons, specialized credit display component, voice input button with recording animation
- **States**: Buttons have hover glow effects, inputs show active states with acid green focus rings, disabled states for insufficient credits
- **Icon Selection**: Phosphor icons for clean, consistent iconography - microphone for voice, user-circle for profile, lightning for credits
- **Spacing**: Generous padding (p-6, p-8) between major sections, consistent gap-4 for related elements, gap-8 for section separation
- **Mobile**: Single column layout with stacked personas on mobile, collapsible header elements, touch-friendly 44px minimum touch targets