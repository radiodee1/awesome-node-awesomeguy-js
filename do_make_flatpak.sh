npm install --package-lock-only
cd flatpak

python3 ../../flatpak-builder-tools/node/flatpak-node-generator.py npm --xdg-layout ../package-lock.json
