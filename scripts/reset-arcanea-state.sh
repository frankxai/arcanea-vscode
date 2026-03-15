#!/bin/sh

echo "Arcanea state is being reset.  This probably doesn't work while VS Code is running."

# Reset the secrets:
sqlite3 ~/Library/Application\ Support/Code/User/globalStorage/state.vscdb \
"DELETE FROM ItemTable WHERE \
    key = 'arcanea.arcanea' OR \
    key LIKE 'workbench.view.extension.arcanea%' OR \
    key LIKE 'secret://{\"extensionId\":\"arcanea.arcanea\",%';"

# delete all arcanea state files:
rm -rf ~/Library/Application\ Support/Code/User/globalStorage/arcanea.arcanea/

# clear some of the vscode cache that I've observed contains arcanea related entries:
rm -f ~/Library/Application\ Support/Code/CachedProfilesData/__default__profile__/extensions.user.cache
