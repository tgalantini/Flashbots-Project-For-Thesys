import signale from "signale";
import WebService from "./WebService.js";

class App {
  constructor(webPort) {
    this.startService(webPort);
  }


  async startService(webPort) {
    try {
      signale.info('\x1b[36m%s\x1b[0m', '+--------------------------+');
      signale.info('\x1b[36m%s\x1b[0m', '|     FLASHBOTS PROJECT    |');
      signale.info('\x1b[36m%s\x1b[0m', '|     TOMMASO GALANTINI    |');
      signale.info('\x1b[36m%s\x1b[0m', '+--------------------------+');
      signale.info(`Trying to start webserver...`);

      await this.startWebServer(webPort)
      
      signale.success(`WebServer successfully started, listening at http://localhost:${webPort}/`)
    } catch (error) {
      signale.error(`Error during WebServer launch : ${error}`);
      process.exit(1);
    }
  }

  async startWebServer(webPort) {
    new WebService(webPort);
  }

}

new App(3600);