import { loadAndValidateConfigFromEnvironment } from './config';
import { createServer } from './api';

const config = loadAndValidateConfigFromEnvironment();
const server = createServer(config);

server.listen(config.port, () => console.log(`Tender API server listening on http://localhost:${config.port}`));
