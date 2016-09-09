#!/usr/bin/fish

npm i; npm run build
sed -i -e 's/^\/dist$/#\/dist/g' .gitignore
echo "script: echo test" > dist/.travis.yml
cp -Rf README.md dist/
git add .
git commit --amend --no-edit
git push origin (git subtree split --prefix=dist --onto=origin/master):master --force
git rm -r dist --cached
sed -i -e 's/^#\/dist$/\/dist/g' .gitignore
git add .
git commit --amend --no-edit
git push origin angularjs-redux --force
