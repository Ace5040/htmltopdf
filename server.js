const fastify = require('fastify')({
  logger: true,
  bodyLimit: 33554432
});
const puppeteer = require('puppeteer');
const fs = require('fs');

var dir = './tmp';

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

async function getPdf(html) {

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  var date = new Date().valueOf();

  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await page.setContent(html, {waitUntil: 'networkidle2'});
  await page.pdf({
    path: "./tmp/pdf-" + date + ".pdf",
    format: 'A4',
    printBackground: true,
    margin: {
      top: "20px",
      left: "20px",
      right: "20px",
      bottom: "20px"
    }
  });
  await browser.close();
  return "pdf-" + date + ".pdf";
}

fastify.route({
  method: 'POST',
  url: '/pdf',
  handler: function(request, reply){
    getPdf(request.body.html).then(fileName => {
      pdf = fs.readFileSync('./tmp/' + fileName);
      var result = {
        status: 'ok',
        pdf: Buffer.from(pdf).toString('base64')
      };
      fs.unlinkSync('./tmp/' + fileName);
      reply.send(result);
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
