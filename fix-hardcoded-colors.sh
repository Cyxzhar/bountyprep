#!/bin/bash

# Light Mode Fix Script - Automated Color Replacement
# This script finds and reports hardcoded colors in CSS files
# Run this to identify all files that need manual fixing

echo "🔍 Finding hardcoded dark colors in CSS files..."
echo "=================================================="
echo ""

# Find files with rgba(10, 10, 15 pattern
echo "📁 Files with hardcoded dark backgrounds (rgba(10, 10, 15...)):"
echo "-----------------------------------------------------------"
grep -r "rgba(10, 10, 1" src/ --include="*.css" | grep -v node_modules | cut -d: -f1 | sort -u | while read file; do
    count=$(grep -c "rgba(10, 10, 1" "$file")
    echo "  ⚠️  $file ($count occurrences)"
done
echo ""

# Find files with #0A0A0F or #000000
echo "📁 Files with hardcoded black (#0A0A0F, #000000):"
echo "-----------------------------------------------"
grep -r "#0A0A0F\|#000000" src/ --include="*.css" | grep -v node_modules | grep -v "Keep dark" | cut -d: -f1 | sort -u | while read file; do
    count=$(grep -c "#0A0A0F\|#000000" "$file" | grep -v "Keep dark")
    echo "  ⚠️  $file"
done
echo ""

# Find files with hardcoded white text
echo "📁 Files with hardcoded white text (#FFFFFF):"
echo "-------------------------------------------"
grep -r "#FFFFFF" src/ --include="*.css" | grep -v node_modules | grep -v "color-stop" | cut -d: -f1 | sort -u | while read file; do
    echo "  ⚠️  $file"
done
echo ""

# Summary
echo "📊 Summary:"
echo "=========="
total_rgba=$(grep -r "rgba(10, 10, 1" src/ --include="*.css" | grep -v node_modules | wc -l)
total_black=$(grep -r "#0A0A0F\|#000000" src/ --include="*.css" | grep -v node_modules | grep -v "Keep dark" | wc -l)
total_white=$(grep -r "#FFFFFF" src/ --include="*.css" | grep -v node_modules | grep -v "color-stop" | wc -l)

echo "  Total rgba(10,10,15...) occurrences: $total_rgba"
echo "  Total #0A0A0F/#000000 occurrences: $total_black"
echo "  Total #FFFFFF occurrences: $total_white"
echo ""

echo "💡 Next Steps:"
echo "============="
echo "1. Review LIGHT_MODE_FIXES.md for detailed fixes"
echo "2. Fix Settings.jsx to use useTheme() hook"
echo "3. Replace hardcoded colors with CSS variables"
echo "4. Add [data-theme=\"light\"] overrides"
echo "5. Test in both light and dark modes"
echo ""

echo "✅ Quick wins (do these first):"
echo "  - src/pages/Settings/Settings.jsx (use ThemeContext)"
echo "  - src/components/BottomNav/BottomNav.css (replace rgba background)"
echo "  - src/styles/global/variables.css (verify light mode section)"
