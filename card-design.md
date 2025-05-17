# Kudos Card Design Prompt

## Overview

We need to design two interfaces for a Kudos system:

1. A Kudos card display component for the Kudos Wall
2. A Kudos creation form for Tech Leads to create new kudos

## Kudos Card Display Component

### Visual Design

Each Kudos card should:

- Have a distinct colored background based on category (e.g., purple for "Well Done", blue for "Great Teamwork", green for "Proud of You")
- Include a category icon at the top (matching the category theme)
- Display a profile picture/avatar of the recipient
- Show recipient's name and team prominently
- Include the recognition message in a readable format
- Feature a small themed illustration relevant to the category (trophy for achievements, team symbol for teamwork, medal for pride)
- Show who sent the kudos with their name and optional picture
- Include the date the kudos was sent
- Have subtle shadows and rounded corners for a modern look

### Layout Structure

- Cards should be consistent in width but can vary in height based on content
- Organized in a responsive grid layout (3-4 columns on desktop, 2 on tablet, 1 on mobile)
- Clean white space to ensure readability
- Clear visual hierarchy with the most important information (recipient name, category, message) most prominent

### User Interaction

- Subtle hover effects (slight elevation or border highlight)
- Optional: Click/tap to expand for longer messages
- Filter/search capabilities for the Kudos Wall as specified in requirements

## Kudos Creation Form

### Form Fields (all required)

- Recipient's Name (text input with optional autocomplete)
- Team Name (dropdown with company departments/teams)
- Category Selection (visual dropdown with icons and colors matching the final display)
- Recognition Message (textarea with character count/limit)
- Preview of how the kudos will appear on the wall

### User Experience

- Clean, step-by-step form layout
- Clear validation with helpful error messages
- Success confirmation after submission
- Simple and intuitive UI that encourages frequent use

## Technical Requirements

- Responsive design for all device sizes
- Accessibility compliant (proper contrast, screen reader support)
- Consistent with the rest of the application's design system
- Reusable components with props for different categories/themes
- Support for light/dark mode (optional)

## Design Inspiration

The design should capture the essence of appreciation and recognition while maintaining a professional look. The cards shown in the reference image have several strong elements:

- Clear category identification
- Good use of color coding
- Personal elements (profile pictures)
- Concise yet meaningful messaging
- Professional appearance with warm, appreciative tone

The new design should build on these strengths while establishing its own unique appearance that aligns with modern web design principles.

## Important Considerations

- Focus on making the design look celebratory without being overly flashy
- Ensure the design scales well with varying text lengths
- Create a design that encourages regular participation in the kudos program
- Make sure filtering and searching are intuitive on the Kudos Wall
