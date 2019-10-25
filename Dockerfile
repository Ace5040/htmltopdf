FROM archlinux
WORKDIR /htmltopdf
RUN pacman --noconfirm -Syu
RUN pacman --noconfirm -S libxcomposite libxcursor libxdamage libxi libxtst libxss libxrandr nss libcups alsa-lib atk at-spi2-atk pango gtk3
RUN pacman --noconfirm -S git npm
RUN git clone https://gitlab.com/ace5040/htmltopdf.git .
RUN npm install --unsafe-perm=true --allow-root
CMD ["npm", "start"]
