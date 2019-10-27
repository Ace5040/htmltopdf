FROM archlinux/base

RUN pacman --noconfirm -Syu
RUN pacman --noconfirm -S libxcomposite libxcursor libxdamage libxi libxtst libxss libxrandr nss libcups alsa-lib atk at-spi2-atk pango gtk3
RUN pacman --noconfirm -S npm
COPY . /htmltopdf
WORKDIR /htmltopdf
RUN npm install --unsafe-perm=true --allow-root
CMD ["npm", "start"]
