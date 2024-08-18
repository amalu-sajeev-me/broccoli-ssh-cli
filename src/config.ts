// src/config.ts
export interface ServerConfig {
  name: string;
  localDir: string;
  remoteDir: string;
  host: string;
  username: string;
  privateKey: string;
}

export const serverConfigs: ServerConfig[] = [
  // Add more server configurations as needed
];
