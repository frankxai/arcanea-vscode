# Arcaneacode Change Marking Guidelines

We are a fork of Roo. We regularly merge in the Roo codebase. To enable us to merge more easily, we mark all
our own changes with `arcanea_change` comments.

## Basic Usage

### Single Line Changes

For single line changes, add the comment at the end of the line:

```typescript
let i = 2 // arcanea_change
```

### Multi-line Changes

For multiple consecutive lines, wrap them with start/end comments:

```typescript
// arcanea_change start
let i = 2
let j = 3
// arcanea_change end
```

## Language-Specific Examples

### HTML/JSX/TSX

```html
{/* arcanea_change start */}
<CustomArcaneaComponent />
{/* arcanea_change end */}
```

### CSS/SCSS

```css
/* arcanea_change */
.arcanea-specific-class {
	color: blue;
}

/* arcanea_change start */
.another-class {
	background: red;
}
/* arcanea_change end */
```

## Special Cases

### Arcaneacode specific file

if the filename or directory name contains arcanea no marking with comments is required

### New Files

If you're creating a completely new file that doesn't exist in Roo, add this comment at the top:

```
// arcanea_change - new file
```
