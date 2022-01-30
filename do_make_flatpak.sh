## this assumes that flatpak-builder-tools is installed on the folder next to awesome-node-awesomeguy-js. The flatpak-builder-tools should be cloned there.

npm install --package-lock-only
cd flatpak

python3 ../../flatpak-builder-tools/node/flatpak-node-generator.py npm --xdg-layout ../package-lock.json



