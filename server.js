const fastify = require('fastify')({
  logger: true,
  bodyLimit: 33554432
});
const puppeteer = require('puppeteer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

var dir = './tmp';

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

async function getPdf(html) {

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await page.setContent(html, {waitUntil: 'networkidle2'});
  let fileName = `${dir}/pdf-${uuidv4()}.pdf`;
  await page.pdf({
    path: fileName,
    format: 'A4',
    printBackground: true,
    margin: {
      top: "20px",
      left: "20px",
      right: "20px",
      bottom: "20px"
    }
  });
  await page.close();
  await browser.close();
  return fileName;
}

fastify.route({
  method: 'POST',
  url: '/pdf',
  handler: function(request, reply){
    getPdf(request.body.html).then(fileName => {
      let pdf = fs.readFileSync(fileName).toString('base64');
      fs.unlinkSync(fileName);
      reply.send({ status: 'ok', pdf });
    });
  }

});

const start = async () => {
  try {
    await fastify.listen({
      port: 3000,
      host: '0.0.0.0'
    });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
