# ProjectHub Design System

This design system captures the visual language and component styles of ProjectHub, providing specifications to maintain design consistency throughout the application.

## Color Palette

### Core Colors

| Color Name        | Hex Code                   | Usage                                         |
| ----------------- | -------------------------- | --------------------------------------------- |
| Background Dark   | `#0D0D14`                  | Main background, gradient start               |
| Background Medium | `#111120`                  | Gradient middle                               |
| Background Light  | `#1A1A2E`                  | Gradient end                                  |
| Panel Background  | `#141428` (at 50% opacity) | Card and panel backgrounds with backdrop blur |
| Input Background  | `#1a1a30` (at 50% opacity) | Form inputs and interactive elements          |

### Purple Theme

| Color Name          | Hex Code                                | Usage                                  |
| ------------------- | --------------------------------------- | -------------------------------------- |
| Purple Primary      | `#7e22ce` (`purple-700`)                | Primary buttons, main actions          |
| Purple Secondary    | `#9333ea` (`purple-600`)                | Button hover states, secondary actions |
| Purple Dark         | `#3b0764` (`purple-950`)                | Shadows, deep backgrounds              |
| Purple Accent Light | `#a855f7` (`purple-500`)                | Highlights, badges, active states      |
| Purple Border       | `#581c87` (`purple-900`) at 50% opacity | Borders for containers                 |

### Text Colors

| Color Name        | Tailwind Class    | Usage                        |
| ----------------- | ----------------- | ---------------------------- |
| Text Light        | `text-white`      | Headings, important text     |
| Text Medium       | `text-gray-300`   | Body text, labels            |
| Text Subdued      | `text-gray-400`   | Secondary text, descriptions |
| Text Muted        | `text-gray-500`   | Tertiary text, timestamps    |
| Text Accent       | `text-purple-400` | Links, emphasized text       |
| Text Accent Hover | `text-purple-300` | Link hover states            |

### Status Colors

| Color Name | Tailwind Classes                        | Usage                           |
| ---------- | --------------------------------------- | ------------------------------- |
| Success    | `bg-purple-600/80 border-purple-500/50` | Approved status                 |
| Warning    | `bg-yellow-500/80 border-yellow-400/50` | Pending status                  |
| Error      | `bg-red-600/80 border-red-500/50`       | Rejected status, error messages |

## Typography

### Font Family

- Primary Font: Inter (Variable)
- Font Import: `import { Inter } from "next/font/google";`

### Font Sizes

| Name      | Tailwind Class           | Usage                            |
| --------- | ------------------------ | -------------------------------- |
| Heading 1 | `text-3xl font-bold`     | Main page titles                 |
| Heading 2 | `text-2xl font-semibold` | Section headings                 |
| Heading 3 | `text-xl font-semibold`  | Card titles, subsection headings |
| Body      | `text-sm`                | Main content text                |
| Small     | `text-xs`                | Secondary information, metadata  |

## Layout & Spacing

### Containers

- Max content width: `max-w-5xl` (large sections), `max-w-4xl` (medium sections), `max-w-sm` (forms)
- Container padding: `px-4 sm:px-6 lg:px-8`
- Default vertical spacing: `space-y-8` (large sections), `space-y-6` (medium sections), `space-y-4` (tight sections)

### Cards & Panels
