#!/bin/bash

# Print warning in red color
echo -e "\033[31m⚠️  WARNING: This will DELETE ALL DATA in the database:\033[0m"
echo "- All user profiles and authentication data"
echo "- All stories and their content"
echo "- All animations and saved states"
echo "- All relationships between tables"
echo ""
echo -e "\033[1mThis action cannot be undone!\033[0m"
echo ""

# Ask for confirmation
read -p "Are you absolutely sure you want to proceed? Type 'YES' to confirm: " confirmation

if [ "$confirmation" = "YES" ]; then
    echo "Proceeding with database reset..."
    supabase db reset --linked
else
    echo "Database reset cancelled."
    exit 1
fi 